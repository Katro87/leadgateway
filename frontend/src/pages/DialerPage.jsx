import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Pause, Keyboard, UserPlus, MessageSquare, ArrowUpRight, ArrowDownLeft, PhoneMissed, ChevronDown, Send, Paperclip, MoreVertical, User, X, Play, Download, Trash2, Check, Mail, Tag } from 'lucide-react'
import { getContacts, createContact, updateContact } from '../api/contacts'

const typeIcon = { incoming: ArrowDownLeft, outgoing: ArrowUpRight, missed: PhoneMissed }
const typeColor = { incoming: 'text-green-400', outgoing: 'text-blue-400', missed: 'text-red-400' }
const keys = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']]
const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500']

// Hard-coded call history and voicemail linked to contact names
const hardCodedCalls = {
  'Sarah Johnson': [
    { id: 101, type: 'outgoing', status: 'Connected', timestamp: '2026-06-26T10:30:00' },
    { id: 102, type: 'incoming', status: 'Voicemail', timestamp: '2026-06-25T14:00:00' },
    { id: 105, type: 'outgoing', status: 'Connected', timestamp: '2026-06-24T09:00:00' },
  ],
  'sufyan': [
    { id: 103, type: 'incoming', status: 'Voicemail', timestamp: '2026-06-26T10:05:00' },
    { id: 106, type: 'missed', status: 'No Answer', timestamp: '2026-06-23T15:00:00' },
  ],
}

const hardCodedMessages = {
  'Sarah Johnson': [
    { id: 201, sender: 'them', text: 'Hi! Are we still on for the demo tomorrow?', timestamp: '2026-06-26T10:15:00' },
    { id: 202, sender: 'me', text: 'Yes, absolutely. 2 PM works great.', timestamp: '2026-06-26T10:20:00' },
  ],
  'sufyan': [
    { id: 203, sender: 'them', text: 'Can you send me the proposal?', timestamp: '2026-06-26T09:15:00' },
  ],
}

const hardCodedVoicemails = {
  'Sarah Johnson': [
    { id: 301, duration: '0:45', timestamp: '2026-06-25T14:00:00', listened: false, transcription: 'Hey Sarah, just checking in on the proposal. Call me back when you can.' },
  ],
  'sufyan': [
    { id: 302, duration: '0:32', timestamp: '2026-06-26T10:05:00', listened: false, transcription: 'Hi, this is Mike. Please send over the documents when you get a chance.' },
  ],
}

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

function DialerPage() {
  const [activeLeftTab, setActiveLeftTab] = useState(getTabFromHash)
  const [contacts, setContacts] = useState([])
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showKeypad, setShowKeypad] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveForm, setSaveForm] = useState({ name: '', company: '', email: '', phone: '', tags: '' })
  const [localMessages, setLocalMessages] = useState(hardCodedMessages)
  const menuRef = useRef(null)
  const menuTimeout = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getContacts().then(setContacts).catch(console.error);
  }, []);

  useEffect(() => {
    const checkTab = () => {
      const savedTab = sessionStorage.getItem('dialerTab');
      if (savedTab === 'messages') setActiveLeftTab('messages');
      else if (savedTab === 'voicemail') setActiveLeftTab('voicemail');
      else if (savedTab === 'calls') setActiveLeftTab('calls');
      else setActiveLeftTab(getTabFromHash());
    };
    checkTab();
    window.addEventListener('hashchange', checkTab);
    const interval = setInterval(checkTab, 200);
    return () => { window.removeEventListener('hashchange', checkTab); clearInterval(interval); };
  }, []);

  const getContactCalls = (c) => hardCodedCalls[c.name] || [];
  const getContactMessages = (c) => localMessages[c.name] || [];
  const getContactVoicemails = (c) => hardCodedVoicemails[c.name] || [];
  const getContactInitial = (c) => (c.name || '?').charAt(0).toUpperCase();
  const getContactAvatarColor = (c) => avatarColors[Math.abs((c.name || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % avatarColors.length];

  const handleMenuEnter = () => { if (menuTimeout.current) clearTimeout(menuTimeout.current); setMenuOpen(true); };
  const handleMenuLeave = () => { menuTimeout.current = setTimeout(() => setMenuOpen(false), 2000); };
  const handleKeyPress = (v) => setNumber((p) => p + v)
  const handleCall = () => { if (number.trim()) setIsCallActive(true) }
  const handleHangup = () => { setIsCallActive(false); setNumber(''); setShowKeypad(false); setIsMuted(false) }
  const handleDialNumber = (num) => { setNumber(num); setSelectedContact(null) }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    const newMsg = { id: Date.now(), sender: 'me', text: messageText, timestamp: new Date().toISOString() };
    setLocalMessages(prev => ({
      ...prev,
      [selectedContact.name]: [...(prev[selectedContact.name] || []), newMsg],
    }));
    setMessageText('');
  };

  const handleSaveContact = async () => {
    if (!saveForm.name.trim()) return;
    try {
      await createContact({
        name: saveForm.name,
        company: saveForm.company,
        email: saveForm.email,
        phone: saveForm.phone,
        tags: saveForm.tags ? saveForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      const updated = await getContacts();
      setContacts(updated);
      setShowSaveModal(false);
      setMenuOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleSwitchToMessages = () => {
    sessionStorage.setItem('dialerTab', 'messages');
    setActiveLeftTab('messages');
    setMenuOpen(false);
  };

  const handleDeleteCallEntry = (contactName, callId) => {
    if (confirm('Delete this call entry?')) {
      hardCodedCalls[contactName] = hardCodedCalls[contactName].filter(c => c.id !== callId);
      setSelectedContact({ ...selectedContact });
    }
  };

  const notificationText = null;

  return (
    <div className="flex h-full -m-6">
      {/* LEFT PANE */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeLeftTab === 'calls'
            ? contacts.map((c) => {
                const calls = getContactCalls(c);
                const lastCall = calls[0];
                if (!lastCall) return null;
                const Icon = typeIcon[lastCall.type] || ArrowUpRight;
                return (
                  <button key={c._id} onClick={() => setSelectedContact(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?._id === c._id ? 'bg-gray-700' : ''}`}>
                    <div className={`w-10 h-10 ${getContactAvatarColor(c)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{getContactInitial(c)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{c.name}</span>
                        <Icon size={14} className={`${typeColor[lastCall.type]} flex-shrink-0 ml-1`} />
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{lastCall.status} • {formatTimeAgo(lastCall.timestamp)}</p>
                    </div>
                  </button>
                )
              })
            : activeLeftTab === 'messages'
            ? contacts.filter(c => (localMessages[c.name] || []).length > 0).map((c) => {
                const msgs = getContactMessages(c);
                const lastMsg = msgs[msgs.length - 1];
                return (
                  <div key={c._id} className="group relative">
                    <button onClick={() => setSelectedContact(c)}
                      className={`w-full flex items-center gap-3 px-4 py-3 pr-10 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?._id === c._id ? 'bg-gray-700' : ''}`}>
                      <div className={`w-10 h-10 ${getContactAvatarColor(c)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{getContactInitial(c)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white truncate">{c.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{formatTimeAgo(lastMsg.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.text}</p>
                      </div>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDialNumber(c.phone); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all cursor-pointer bg-gray-700 p-1.5 rounded-full">
                      <Phone size={16} />
                    </button>
                  </div>
                )
              })
            : contacts.filter(c => (hardCodedVoicemails[c.name] || []).length > 0).map((c) => {
                const vms = getContactVoicemails(c);
                const lastVm = vms[vms.length - 1];
                const hasUnread = vms.some(v => !v.listened);
                return (
                  <button key={c._id} onClick={() => setSelectedContact(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?._id === c._id ? 'bg-gray-700' : ''}`}>
                    <div className={`w-10 h-10 ${getContactAvatarColor(c)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{getContactInitial(c)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{c.name}</span>
                        {hasUnread && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-1"></span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{lastVm.duration} • {formatTimeAgo(lastVm.timestamp)}</p>
                    </div>
                  </button>
                )
              })
          }
        </div>
      </div>

      {/* MIDDLE PANE */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        {selectedContact ? (
          <>
            <div className="h-16 border-b border-gray-700 flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${getContactAvatarColor(selectedContact)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>{getContactInitial(selectedContact)}</div>
                <div>
                  <span className="text-white font-medium text-sm">{selectedContact.name}</span>
                  {selectedContact.phone && <p className="text-xs text-gray-400">{selectedContact.phone}</p>}
                </div>
              </div>
              <div className="relative" ref={menuRef} onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><MoreVertical size={18} /></button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-1 z-50">
                    <button onClick={() => { setSaveForm({ name: selectedContact.name || '', company: selectedContact.company || '', email: selectedContact.email || '', phone: selectedContact.phone || '', tags: (selectedContact.tags || []).join(', ') }); setShowSaveModal(true); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><User size={14} /> Edit Contact</button>
                    <button onClick={handleSwitchToMessages} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><MessageSquare size={14} /> Message</button>
                    <button onClick={() => { if (confirm('Delete this contact?')) { setSelectedContact(null); setMenuOpen(false); } }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeLeftTab === 'messages' && getContactMessages(selectedContact).length > 0
                ? getContactMessages(selectedContact).map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-xl text-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                        <p>{msg.text}</p><p className="text-xs mt-1 opacity-70">{formatTimeAgo(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))
                : activeLeftTab === 'calls' && getContactCalls(selectedContact).length > 0
                  ? getContactCalls(selectedContact).map((call) => {
                      const Icon = typeIcon[call.type]
                      return (
                        <div key={call.id} className="flex items-center justify-between py-2 group">
                          <div className="flex items-center gap-3">
                            <Icon size={16} className={typeColor[call.type]} />
                            <div><p className="text-sm text-white">{call.status}</p><p className="text-xs text-gray-400">{formatCallTime(call.timestamp)}</p></div>
                          </div>
                          <button onClick={() => handleDeleteCallEntry(selectedContact.name, call.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      )
                    })
                  : activeLeftTab === 'voicemail' && getContactVoicemails(selectedContact).length > 0
                    ? getContactVoicemails(selectedContact).map((vm) => (
                        <div key={vm.id} className={`bg-gray-800 rounded-xl border p-4 ${vm.listened ? 'border-gray-700' : 'border-blue-600/50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">{!vm.listened && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}<span className="text-sm text-white font-medium">Voicemail</span></div>
                            <span className="text-xs text-gray-400">{vm.duration}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{vm.transcription}</p>
                          <p className="text-xs text-gray-500 mb-3">{formatTimeAgo(vm.timestamp)}</p>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"><Play size={14} /> Play</button>
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"><Download size={14} /> Download</button>
                          </div>
                        </div>
                      ))
                    : <p className="text-center text-gray-500 text-sm">No history yet</p>
              }
            </div>
            {activeLeftTab === 'messages' && (
              <div className="p-4 border-t border-gray-700 flex items-center gap-2">
                <button className="text-gray-400 hover:text-white cursor-pointer"><Paperclip size={20} /></button>
                <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..." onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
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
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {isCallActive ? (
          <div className="flex-1 flex flex-col items-center justify-between py-8 px-4">
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6"><span className="text-4xl font-bold text-white">{number.slice(-2)}</span></div>
              <p className="text-gray-400 text-sm">{number}</p>
              <p className="text-white text-3xl font-mono mt-3">00:15</p>
            </div>
            {showKeypad ? (
              <div className="w-full space-y-2">{keys.map((row, i) => (<div key={i} className="flex gap-2">{row.map((k) => (<button key={k} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-4 text-xl font-medium text-white cursor-pointer">{k}</button>))}</div>))}</div>
            ) : (
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[{ icon: MessageSquare, label: 'Message' }, { icon: isMuted ? MicOff : Mic, label: isMuted ? 'Unmute' : 'Mute', onClick: () => setIsMuted(!isMuted) }, { icon: Pause, label: 'Hold' }, { icon: Keyboard, label: 'Keypad', onClick: () => setShowKeypad(true) }, { icon: UserPlus, label: 'Transfer' }, { icon: MessageSquare, label: 'Record' }].map((a, i) => (
                  <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-1 text-gray-300 hover:text-white cursor-pointer">
                    <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"><a.icon size={20} /></div><span className="text-xs">{a.label}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={handleHangup} className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mt-6 cursor-pointer"><PhoneOff size={28} className="text-white" /></button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4">
            <div className="text-center mb-4"><p className="text-gray-500 text-xs">Call as</p><p className="text-gray-300 text-sm">+1 (555) 000-0000</p></div>
            <div className="relative mb-4">
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter a name or number"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm" />
              {number && <button onClick={() => setNumber('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"><X size={16} /></button>}
            </div>
            <button onClick={handleCall} disabled={!number.trim()} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 py-3 rounded-xl text-white font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 mb-4"><Phone size={18} /> Call</button>
            <div className="flex-1 flex flex-col justify-end">
              <div className="space-y-2">{keys.map((row, i) => (<div key={i} className="flex gap-2">{row.map((k) => (<button key={k} onClick={() => handleKeyPress(k)} className="flex-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl py-4 text-xl font-medium text-white transition-colors cursor-pointer">{k}</button>))}</div>))}</div>
              <button className="text-gray-500 hover:text-gray-300 text-xs mt-4 flex items-center justify-center gap-1 cursor-pointer"><ChevronDown size={14} /> Hide keypad</button>
            </div>
          </div>
        )}
      </div>

      {/* Save/Edit Contact Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit Contact</h3>
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