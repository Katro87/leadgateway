import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Pause, Keyboard, UserPlus, MessageSquare, ArrowUpRight, ArrowDownLeft, PhoneMissed, ChevronDown, Send, Paperclip, MoreVertical, User, X } from 'lucide-react'
import { communications, formatTimeAgo, formatCallTime } from '../data/communications'

const typeIcon = { incoming: ArrowDownLeft, outgoing: ArrowUpRight, missed: PhoneMissed }
const typeColor = { incoming: 'text-green-400', outgoing: 'text-blue-400', missed: 'text-red-400' }
const keys = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']]

function getTabFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/tab=(\w+)/);
  return match && match[1] === 'messages' ? 'messages' : 'calls';
}

function DialerPage() {
  const [activeLeftTab, setActiveLeftTab] = useState(getTabFromHash)
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showKeypad, setShowKeypad] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuTimeout = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const onHashChange = () => setActiveLeftTab(getTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleMenuEnter = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setMenuOpen(false), 2000);
  };

  const handleKeyPress = (v) => setNumber((p) => p + v)
  const handleCall = () => { if (number.trim()) setIsCallActive(true) }
  const handleHangup = () => { setIsCallActive(false); setNumber(''); setShowKeypad(false); setIsMuted(false) }
  const handleSendMessage = () => { if (messageText.trim()) { setMessageText('') } }
  const handleDialNumber = (num) => { setNumber(num); setSelectedContact(null) }

  const unreadMessages = 1; const missedCalls = 2; const newVoicemails = 2;
  const notificationParts = [];
  if (unreadMessages) notificationParts.push(`${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`);
  if (missedCalls) notificationParts.push(`${missedCalls} missed call${missedCalls > 1 ? 's' : ''}`);
  if (newVoicemails) notificationParts.push(`${newVoicemails} new voicemail${newVoicemails > 1 ? 's' : ''}`);
  const notificationText = notificationParts.length ? `You have ${notificationParts.join(', ')}` : null;

  return (
    <div className="flex h-full -m-6">
      {/* LEFT PANE */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeLeftTab === 'calls'
            ? communications.map((c) => {
                const Icon = typeIcon[c.calls[0]?.type] || ArrowUpRight
                const lastCall = c.calls[0]
                return lastCall ? (
                  <button key={c.id} onClick={() => setSelectedContact(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?.id === c.id ? 'bg-gray-700' : ''}`}>
                    <div className={`w-10 h-10 ${c.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{c.initial}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{c.name || c.number}</span>
                        <Icon size={14} className={`${typeColor[c.calls[0]?.type]} flex-shrink-0 ml-1`} />
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{lastCall.status} • {formatTimeAgo(lastCall.timestamp)}</p>
                    </div>
                  </button>
                ) : null
              })
            : communications.filter(c => c.messages.length > 0).map((c) => {
                const lastMsg = c.messages[c.messages.length - 1]
                return (
                  <div key={c.id} className="group relative">
                    <button onClick={() => setSelectedContact(c)}
                      className={`w-full flex items-center gap-3 px-4 py-3 pr-10 text-left hover:bg-gray-700 transition-colors cursor-pointer ${selectedContact?.id === c.id ? 'bg-gray-700' : ''}`}>
                      <div className={`w-10 h-10 ${c.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>{c.initial}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white truncate">{c.name || c.number}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{formatTimeAgo(lastMsg.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.text}</p>
                      </div>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDialNumber(c.number); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all cursor-pointer bg-gray-700 p-1.5 rounded-full">
                      <Phone size={16} />
                    </button>
                  </div>
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
                <div className={`w-9 h-9 ${selectedContact.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>{selectedContact.initial}</div>
                <div>
                  <span className="text-white font-medium text-sm">{selectedContact.name || selectedContact.number}</span>
                  {selectedContact.name && <p className="text-xs text-gray-400">{selectedContact.number}</p>}
                </div>
              </div>
              <div className="relative" ref={menuRef} onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <MoreVertical size={18} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-1 z-50">
                    {selectedContact.isSaved ? (
                      <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><User size={14} /> Edit Contact</button>
                    ) : (
                      <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><UserPlus size={14} /> Save Contact</button>
                    )}
                    <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"><MessageSquare size={14} /> Message</button>
                    <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2">🚫 Block</button>
                    <hr className="border-gray-700 my-1" />
                    <button onClick={() => { if (confirm('Delete this entry?')) { setSelectedContact(null); setMenuOpen(false); } }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2">🗑️ Delete</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeLeftTab === 'messages' && selectedContact.messages.length > 0
                ? selectedContact.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-xl text-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                        <p>{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">{formatTimeAgo(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))
                : activeLeftTab === 'calls' && selectedContact.calls.length > 0
                  ? selectedContact.calls.map((call) => {
                      const Icon = typeIcon[call.type]
                      return (
                        <div key={call.id} className="flex items-center gap-3 py-2">
                          <Icon size={16} className={typeColor[call.type]} />
                          <div><p className="text-sm text-white">{call.status}</p><p className="text-xs text-gray-400">{formatCallTime(call.timestamp)}</p></div>
                        </div>
                      )
                    })
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
            {notificationText ? <p className="text-gray-400 mt-2">{notificationText}</p> : <p className="text-gray-500 mt-2">You&apos;re all caught up</p>}
          </div>
        )}
      </div>

      {/* RIGHT PANE - Dialer */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {isCallActive ? (
          <div className="flex-1 flex flex-col items-center justify-between py-8 px-4">
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-white">{number.slice(-2)}</span>
              </div>
              <p className="text-gray-400 text-sm">{number}</p>
              <p className="text-white text-3xl font-mono mt-3">00:15</p>
            </div>
            {showKeypad ? (
              <div className="w-full space-y-2">
                {keys.map((row, i) => (<div key={i} className="flex gap-2">{row.map((k) => (<button key={k} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-4 text-xl font-medium text-white cursor-pointer">{k}</button>))}</div>))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[{ icon: MessageSquare, label: 'Message' }, { icon: isMuted ? MicOff : Mic, label: isMuted ? 'Unmute' : 'Mute', onClick: () => setIsMuted(!isMuted) }, { icon: Pause, label: 'Hold' }, { icon: Keyboard, label: 'Keypad', onClick: () => setShowKeypad(true) }, { icon: UserPlus, label: 'Transfer' }, { icon: MessageSquare, label: 'Record' }].map((a, i) => (
                  <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-1 text-gray-300 hover:text-white cursor-pointer">
                    <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"><a.icon size={20} /></div>
                    <span className="text-xs">{a.label}</span>
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
              <div className="space-y-2">
                {keys.map((row, i) => (<div key={i} className="flex gap-2">{row.map((k) => (<button key={k} onClick={() => handleKeyPress(k)} className="flex-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl py-4 text-xl font-medium text-white transition-colors cursor-pointer">{k}</button>))}</div>))}
              </div>
              <button className="text-gray-500 hover:text-gray-300 text-xs mt-4 flex items-center justify-center gap-1 cursor-pointer"><ChevronDown size={14} /> Hide keypad</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DialerPage