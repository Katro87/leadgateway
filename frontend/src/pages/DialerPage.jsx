import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Pause, Keyboard, UserPlus, MessageSquare, ArrowUpRight, ArrowDownLeft, PhoneMissed, ChevronDown, Send, Paperclip, MoreVertical, User, X, Play, Download, Trash2, Check, Loader2, Plus } from 'lucide-react'
import { getContacts, createContact } from '../api/contacts';
import { getCalls, createCall, deleteCall } from '../api/calls'
import { getMessages as fetchMessages, sendMessage as sendMsg, deleteMessage } from '../api/messages'

const typeIcon = { incoming: ArrowDownLeft, outgoing: ArrowUpRight, missed: PhoneMissed }
const typeColor = { incoming: 'text-green-400', outgoing: 'text-blue-400', missed: 'text-red-400' }
const keys = [
  { d: '1', l: '' }, { d: '2', l: 'ABC' }, { d: '3', l: 'DEF' },
  { d: '4', l: 'GHI' }, { d: '5', l: 'JKL' }, { d: '6', l: 'MNO' },
  { d: '7', l: 'PQRS' }, { d: '8', l: 'TUV' }, { d: '9', l: 'WXYZ' },
  { d: '*', l: '' }, { d: '0', l: '+' }, { d: '#', l: '' },
]
const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500']

function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCallTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getTabFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/tab=(\w+)/);
  if (match && match[1] === 'messages') return 'messages';
  if (match && match[1] === 'voicemail') return 'voicemail';
  return 'calls';
}

function digitsOnly(str) {
  return (str || '').replace(/\D/g, '');
}

function formatUSNumber(digits) {
  const d = digits.slice(-10);
  if (d.length < 10) return digits;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function DialerPage() {
  const [activeLeftTab, setActiveLeftTab] = useState(getTabFromHash)
  const [contacts, setContacts] = useState([])
  const [calls, setCalls] = useState([])
  const [messages, setMessages] = useState([])
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showKeypad, setShowKeypad] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveForm, setSaveForm] = useState({ name: '', company: '', email: '', phone: '', tags: '' })
  const [loading, setLoading] = useState(true)

  const [composeMode, setComposeMode] = useState(false)
  const [composeNumber, setComposeNumber] = useState('')
  const [composeConfirmed, setComposeConfirmed] = useState('')
  const messageInputRef = useRef(null)

  const prevTabRef = useRef(activeLeftTab)
  const menuRef = useRef(null)
  const menuTimeout = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const loadData = async () => {
    try {
      const [contactsData, callsData, messagesData] = await Promise.all([
        getContacts(), getCalls(), fetchMessages()
      ]);
      setContacts(contactsData);
      setCalls(callsData);
      setMessages(messagesData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const checkTab = () => {
      const savedTab = sessionStorage.getItem('dialerTab');
      let newTab;
      if (savedTab === 'messages') newTab = 'messages';
      else if (savedTab === 'voicemail') newTab = 'voicemail';
      else if (savedTab === 'calls') newTab = 'calls';
      else newTab = getTabFromHash();

      if (newTab !== prevTabRef.current) {
        prevTabRef.current = newTab;
        setActiveLeftTab(newTab);
        setSelectedContact(null);
      }
    };
    checkTab();
    window.addEventListener('hashchange', checkTab);
    const interval = setInterval(checkTab, 200);
    return () => { window.removeEventListener('hashchange', checkTab); clearInterval(interval); };
  }, []);

  const handleCall = async (overrideNumber) => {
    const target = (overrideNumber ?? number).trim();
    if (!target) return;
    setActiveLeftTab('calls');
    prevTabRef.current = 'calls';
    sessionStorage.setItem('dialerTab', 'calls');
    setSelectedContact(null);
    setComposeMode(false);
    setNumber(target);
    setIsCallActive(true);
    try {
      const contactMatch = contacts.find(c => c.phone === target);
      const newCall = await createCall({ number: target, contactName: contactMatch?.name || 'Unknown', type: 'outgoing', status: 'Calling', duration: 0 });
      setCalls(prev => [newCall, ...prev]);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
  const handleDialNumberEvent = (e) => {
    const phone = e.detail;
    if (!phone) return;
    handleCall(phone);
  };

  const handleOpenMessageContact = (e) => {
    const contact = e.detail;
    if (!contact) return;
    setActiveLeftTab('messages');
    prevTabRef.current = 'messages';
    setComposeMode(false);
    const matched = contacts.find(c => c.phone === contact.phone) || contact;
    setSelectedContact(matched);
  };

  const handleOpenComposeMessage = () => {
    setActiveLeftTab('messages');
    prevTabRef.current = 'messages';
    sessionStorage.setItem('dialerTab', 'messages');
    setSelectedContact(null);
    setComposeMode(true);
    setComposeNumber('');
    setComposeConfirmed('');
  };

  window.addEventListener('dialNumber', handleDialNumberEvent);
  window.addEventListener('openMessageContact', handleOpenMessageContact);
  window.addEventListener('openComposeMessage', handleOpenComposeMessage);
  return () => {
    window.removeEventListener('dialNumber', handleDialNumberEvent);
    window.removeEventListener('openMessageContact', handleOpenMessageContact);
    window.removeEventListener('openComposeMessage', handleOpenComposeMessage);
  };
}, [contacts]);
  const getCallsForContact = (c) => calls.filter(call => call.number === c.phone);
  const getMessagesForContact = (c) => messages.filter(msg => msg.number === c.phone);
  const getContactInitial = (c) => (c.name || '?').charAt(0).toUpperCase();
  const getContactAvatarColor = (c) => avatarColors[Math.abs((c.name || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % avatarColors.length];

  const handleMenuEnter = () => { if (menuTimeout.current) clearTimeout(menuTimeout.current); setMenuOpen(true); };
  const handleMenuLeave = () => { menuTimeout.current = setTimeout(() => setMenuOpen(false), 2000); };
  const handleKeyPress = (v) => setNumber((p) => p + v)

  const handleHangup = () => { setIsCallActive(false); setNumber(''); setShowKeypad(false); setIsMuted(false) }

  const handleSendMessage = async () => {
    const targetPhone = selectedContact?.phone || composeConfirmed;
    if (!messageText.trim() || !targetPhone) return;
    try {
      const contactMatch = contacts.find(c => c.phone === targetPhone);
      const newMsg = await sendMsg({
        number: targetPhone,
        contactName: contactMatch?.name || selectedContact?.name || 'Unknown',
        text: messageText,
        direction: 'sent',
      });
      setMessages(prev => [newMsg, ...prev]);
      setMessageText('');

      if (!selectedContact) {
        setSelectedContact(contactMatch || { name: 'Unknown', phone: targetPhone });
        setComposeMode(false);
        setComposeNumber('');
        setComposeConfirmed('');
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveContact = async () => {
    if (!saveForm.name.trim()) return;
    try {
      await createContact({ name: saveForm.name, company: saveForm.company, email: saveForm.email, phone: saveForm.phone, tags: saveForm.tags ? saveForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [] });
      const updated = await getContacts();
      setContacts(updated);
      setShowSaveModal(false); setMenuOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleSwitchToMessages = () => {
    sessionStorage.setItem('dialerTab', 'messages');
    setActiveLeftTab('messages');
    prevTabRef.current = 'messages';
    setComposeMode(false);
    setMenuOpen(false);
  };

  const handleDeleteCall = async (id) => {
    try { await deleteCall(id); setCalls(prev => prev.filter(c => c._id !== id)); } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (id) => {
    try { await deleteMessage(id); setMessages(prev => prev.filter(m => m._id !== id)); } catch (err) { console.error(err); }
  };

  const startCompose = () => {
    setSelectedContact(null);
    setComposeMode(true);
    setComposeNumber('');
    setComposeConfirmed('');
  };

  const handleConfirmComposeNumber = () => {
    setComposeConfirmed(composeNumber.trim());
    setTimeout(() => messageInputRef.current?.focus(), 50);
  };

  const handleRemoveComposeChip = () => {
    setComposeConfirmed('');
    setComposeNumber('');
  };

  const getActiveContactCalls = () => selectedContact ? getCallsForContact(selectedContact) : [];
  const getActiveContactMessages = () => selectedContact ? getMessagesForContact(selectedContact) : [];

  const uniqueMsgNumbers = [...new Set(messages.map(m => m.number))];
  const groupedMessages = uniqueMsgNumbers.map(num => {
    const numMsgs = messages.filter(m => m.number === num);
    const contact = contacts.find(c => c.phone === num);
    return { number: num, name: contact?.name || numMsgs[0]?.contactName || 'Unknown', messages: numMsgs, contact };
  });

  const sortedCalls = [...calls].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const activeCallContact = contacts.find(c => c.phone === number);
  const composeDigits = digitsOnly(composeNumber);
  const showSendSmsSuggestion = !composeConfirmed && composeDigits.length >= 10;
  const canTypeMessage = (selectedContact && activeLeftTab === 'messages') || (composeMode && composeConfirmed);

  return (
    // Sized against the viewport, not inherited height — guarantees all
    // three panes stretch to the bottom of the screen regardless of parent
    // layout. 4rem = Topbar's h-16. Adjust this if your Topbar height changes.
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {/* LEFT PANE */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-blue-400" /></div>
          ) : activeLeftTab === 'calls' ? (
            sortedCalls.map((call) => {
              const Icon = typeIcon[call.type] || ArrowUpRight;
              const contact = contacts.find(c => c.phone === call.number);
              const displayName = contact?.name || call.contactName || 'Unknown';
              return (
                <div key={call._id} className="group relative">
                  <button
                    onClick={() => { setSelectedContact(contact || { name: displayName, phone: call.number }); setComposeMode(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 pr-10 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?.phone === call.number ? 'bg-gray-700' : ''}`}
                  >
                    <div className={`w-10 h-10 ${getContactAvatarColor({ name: displayName })} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{displayName.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{displayName}</span>
                        <Icon size={14} className={`${typeColor[call.type]} flex-shrink-0 ml-1`} />
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{call.status} • {formatTimeAgo(call.createdAt)}</p>
                    </div>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleCall(call.number); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all cursor-pointer bg-gray-700 p-1.5 rounded-full"
                    title="Call">
                    <Phone size={16} />
                  </button>
                </div>
              );
            })
          ) : activeLeftTab === 'messages' ? (
            <>
              <button onClick={startCompose} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-700">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"><Plus size={18} className="text-white" /></div>
                <span className="text-sm font-medium text-blue-400">+ Send new message</span>
              </button>
              {groupedMessages.map((g, i) => {
                const lastMsg = g.messages[0];
                return (
                  <div key={i} className="group relative">
                    <button onClick={() => { setSelectedContact(g.contact || { name: g.name, phone: g.number }); setComposeMode(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 pr-10 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?.phone === g.number ? 'bg-gray-700' : ''}`}>
                      <div className={`w-10 h-10 ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{g.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white truncate">{g.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{formatTimeAgo(lastMsg.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.text}</p>
                      </div>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleCall(g.number); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all cursor-pointer bg-gray-700 p-1.5 rounded-full"
                      title="Call">
                      <Phone size={16} />
                    </button>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">No voicemails yet</div>
          )}
        </div>
      </div>

      {/* MIDDLE PANE */}
      <div className="flex-1 bg-gray-900 flex flex-col h-full">
        {selectedContact || composeMode ? (
          <>
            {selectedContact ? (
              <div className="h-16 border-b border-gray-700 flex items-center justify-between px-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${getContactAvatarColor(selectedContact)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>{getContactInitial(selectedContact)}</div>
                  <div>
                    <span className="text-white font-medium text-sm">{selectedContact.name || 'Unknown'}</span>
                    {selectedContact.phone && <p className="text-xs text-gray-400">{selectedContact.phone}</p>}
                  </div>
                </div>
                <div className="relative" ref={menuRef} onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                  <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><MoreVertical size={18} /></button>
                  {menuOpen && (
                    <div className="absolute right-0 top-8 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-1 z-50">
                      {contacts.find(c => c.phone === selectedContact.phone) ? (
                        <button onClick={() => { const c = contacts.find(ct => ct.phone === selectedContact.phone); setSaveForm({ name: c.name || '', company: c.company || '', email: c.email || '', phone: c.phone || '', tags: (c.tags || []).join(', ') }); setShowSaveModal(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><User size={14} /> Edit Contact</button>
                      ) : (
                        <button onClick={() => { setSaveForm({ name: '', company: '', email: '', phone: selectedContact.phone || '', tags: '' }); setShowSaveModal(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><UserPlus size={14} /> Save Contact</button>
                      )}
                      <button onClick={handleSwitchToMessages}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><MessageSquare size={14} /> Message</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-16 border-b border-gray-700 flex items-center px-5 gap-2 relative flex-shrink-0">
                {composeConfirmed ? (
                  <div className="flex items-center gap-2 bg-gray-700 rounded-full pl-2 pr-3 py-1.5">
                    <button onClick={handleRemoveComposeChip} className="text-gray-400 hover:text-white cursor-pointer"><X size={14} /></button>
                    <span className="text-sm text-white">{formatUSNumber(digitsOnly(composeConfirmed))}</span>
                  </div>
                ) : (
                  <div className="relative flex-1">
                    <input
                      type="text"
                      autoFocus
                      value={composeNumber}
                      onChange={(e) => setComposeNumber(e.target.value)}
                      placeholder="Type a number"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    {showSendSmsSuggestion && (
                      <button
                        onClick={handleConfirmComposeNumber}
                        className="absolute top-full mt-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-blue-400 hover:bg-gray-700 transition-colors cursor-pointer text-left z-10 shadow-lg"
                      >
                        Send SMS to {formatUSNumber(composeDigits)}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selectedContact ? (
                activeLeftTab === 'messages' ? (
                  getActiveContactMessages().length > 0 ? getActiveContactMessages().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg) => (
                    <div key={msg._id} className={`flex group ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-xl text-sm relative ${msg.direction === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                        <p>{msg.text}</p><p className="text-xs mt-1 opacity-70">{formatTimeAgo(msg.createdAt)}</p>
                      </div>
                      <button onClick={() => handleDeleteMessage(msg._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all cursor-pointer ml-1 self-center"><Trash2 size={14} /></button>
                    </div>
                  )) : <p className="text-center text-gray-500 text-sm">No messages yet</p>
                ) : activeLeftTab === 'calls' ? (
                  getActiveContactCalls().length > 0 ? getActiveContactCalls().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((call) => {
                    const Icon = typeIcon[call.type] || ArrowUpRight;
                    return (
                      <div key={call._id} className="flex items-center justify-between py-2 group">
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={typeColor[call.type] || 'text-blue-400'} />
                          <div><p className="text-sm text-white">{call.status}</p><p className="text-xs text-gray-400">{formatCallTime(call.createdAt)}</p></div>
                        </div>
                        <button onClick={() => handleDeleteCall(call._id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    )
                  }) : <p className="text-center text-gray-500 text-sm">No calls yet</p>
                ) : (
                  <p className="text-center text-gray-500 text-sm">No voicemails yet</p>
                )
              ) : (
                <p className="text-center text-gray-500 text-sm mt-10">
                  {composeConfirmed ? 'Send a message to start the conversation' : 'Enter a number to send a new message'}
                </p>
              )}
            </div>

            {canTypeMessage && (
              <div className="p-4 border-t border-gray-700 flex items-center gap-2 flex-shrink-0">
                <button className="text-gray-400 hover:text-white cursor-pointer"><Paperclip size={20} /></button>
                <input
                  ref={messageInputRef}
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button onClick={handleSendMessage} className="text-blue-500 hover:text-blue-400 cursor-pointer"><Send size={20} /></button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Hi, {user.name || 'User'}!</h2>
            <p className="text-gray-500 mt-2">You&apos;re all caught up</p>
          </div>
        )}
      </div>

      {/* RIGHT PANE - Dialer */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
        {isCallActive ? (
          <div className="flex-1 flex flex-col items-center justify-between py-8 px-4">
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6"><span className="text-4xl font-bold text-white">{number.slice(-2)}</span></div>
              <p className="text-white text-lg font-semibold">{activeCallContact ? activeCallContact.name : number}</p>
              {activeCallContact && <p className="text-gray-400 text-sm">{number}</p>}
              <p className="text-white text-3xl font-mono mt-3">00:00</p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              {[{ icon: MessageSquare, label: 'Message' }, { icon: isMuted ? MicOff : Mic, label: isMuted ? 'Unmute' : 'Mute', onClick: () => setIsMuted(!isMuted) }, { icon: Pause, label: 'Hold' }, { icon: Keyboard, label: 'Keypad', onClick: () => setShowKeypad(true) }, { icon: UserPlus, label: 'Transfer' }, { icon: MessageSquare, label: 'Record' }].map((a, i) => (
                <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-1 text-gray-300 hover:text-white cursor-pointer">
                  <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"><a.icon size={20} /></div><span className="text-xs">{a.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleHangup} className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mt-6 cursor-pointer"><PhoneOff size={28} className="text-white" /></button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-5 overflow-y-auto">
            <div className="text-center mb-4">
              <p className="text-gray-500 text-xs">Call as</p>
              <p className="text-gray-300 text-sm">+1 (555) 000-0000</p>
            </div>

            <div className="relative mb-5">
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter a name or number"
                className="w-full bg-gray-700 border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm text-center" />
              {number && <button onClick={() => setNumber('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"><X size={16} /></button>}
            </div>

            {/* Circular Google-Voice-style keypad */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-2 justify-items-center mb-6">
              {keys.map((k) => (
                <button
                  key={k.d}
                  onClick={() => handleKeyPress(k.d)}
                  className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                >
                  <span className="text-xl font-medium text-white leading-none">{k.d}</span>
                  {k.l && <span className="text-[9px] text-gray-400 tracking-wider mt-0.5">{k.l}</span>}
                </button>
              ))}
            </div>

            <div className="flex justify-center mb-2">
              <button
                onClick={() => handleCall()}
                disabled={!number.trim()}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <Phone size={26} />
              </button>
            </div>

            <button className="text-gray-500 hover:text-gray-300 text-xs flex items-center justify-center gap-1 cursor-pointer mt-auto pt-4">
              <ChevronDown size={14} /> Hide keypad
            </button>
          </div>
        )}
      </div>

      {/* Save/Edit Contact Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{contacts.find(c => c.phone === selectedContact?.phone) ? 'Edit Contact' : 'Save Contact'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name *" value={saveForm.name} onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Company" value={saveForm.company} onChange={(e) => setSaveForm({ ...saveForm, company: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" value={saveForm.email} onChange={(e) => setSaveForm({ ...saveForm, email: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Phone" value={saveForm.phone} onChange={(e) => setSaveForm({ ...saveForm, phone: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Tags (comma separated)" value={saveForm.tags} onChange={(e) => setSaveForm({ ...saveForm, tags: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveContact} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"><Check size={16} /> Save</button>
                <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DialerPage