import { useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Pause, MessageSquare, UserPlus, Keyboard, ArrowUpRight, ArrowDownLeft, PhoneMissed, Search, ChevronDown } from 'lucide-react'

const contacts = [
  { id: 1, name: 'Sarah Johnson', number: '(415) 555-0123', initial: 'S', lastActivity: 'Called 10 min ago', type: 'outgoing' },
  { id: 2, name: 'Mike Peters', number: '(212) 555-0456', initial: 'M', lastActivity: 'Voicemail 25 min ago', type: 'incoming' },
  { id: 3, name: 'Emily Davis', number: '(310) 555-0789', initial: 'E', lastActivity: 'Missed 1 hour ago', type: 'missed' },
  { id: 4, name: 'James Wilson', number: '(512) 555-0321', initial: 'J', lastActivity: 'Called 2 hours ago', type: 'outgoing' },
  { id: 5, name: 'Lisa Chen', number: '(617) 555-0654', initial: 'L', lastActivity: 'Message 3 hours ago', type: 'incoming' },
  { id: 6, name: 'Robert Taylor', number: '(702) 555-0987', initial: 'R', lastActivity: 'Called yesterday', type: 'outgoing' },
]

const suggestions = [
  { name: 'Sarah Johnson', number: '(415) 555-0123' },
  { name: 'Mike Peters', number: '(212) 555-0456' },
]

const typeIcon = {
  incoming: ArrowDownLeft,
  outgoing: ArrowUpRight,
  missed: PhoneMissed,
}

const typeColor = {
  incoming: 'text-green-400',
  outgoing: 'text-blue-400',
  missed: 'text-red-400',
}

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500']

function DialerPage() {
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showKeypad, setShowKeypad] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [selectedContact, setSelectedContact] = useState(null)
  const [activeTab, setActiveTab] = useState('calls')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ]

  const handleKeyPress = (value) => setNumber((prev) => prev + value)
  const handleDelete = () => setNumber((prev) => prev.slice(0, -1))

  const handleCall = () => {
    if (number.trim()) {
      setIsCallActive(true)
      setCallDuration(0)
    }
  }

  const handleHangup = () => {
    setIsCallActive(false)
    setNumber('')
    setShowKeypad(false)
    setIsMuted(false)
  }

  const unreadMessages = 1
  const missedCalls = 2
  const newVoicemails = 2

  const getNotificationText = () => {
    const parts = []
    if (unreadMessages > 0) parts.push(`${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`)
    if (missedCalls > 0) parts.push(`${missedCalls} missed call${missedCalls > 1 ? 's' : ''}`)
    if (newVoicemails > 0) parts.push(`${newVoicemails} new voicemail${newVoicemails > 1 ? 's' : ''}`)
    if (parts.length === 0) return null
    return `You have ${parts.join(', ')}`
  }

  const notificationText = getNotificationText()

  return (
    <div className="flex h-full -m-6">
      {/* LEFT PANE - History List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-1">
            {['calls', 'messages', 'voicemail'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, idx) => {
            const Icon = typeIcon[contact.type] || ArrowUpRight
            const color = typeColor[contact.type] || 'text-blue-400'
            return (
              <button key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors cursor-pointer ${
                  selectedContact?.id === contact.id ? 'bg-gray-700' : ''
                }`}>
                <div className={`w-10 h-10 ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                  {contact.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{contact.name}</span>
                    <Icon size={14} className={`${color} flex-shrink-0 ml-1`} />
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{contact.lastActivity}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* MIDDLE PANE - Context */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        {selectedContact ? (
          <>
            <div className="h-16 border-b border-gray-700 flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {selectedContact.initial}
                </div>
                <span className="text-white font-medium text-sm">{selectedContact.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white transition-colors cursor-pointer"><MessageSquare size={18} /></button>
                <button className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Phone size={18} /></button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              {activeTab === 'calls' && <p>Call history for {selectedContact.name}</p>}
              {activeTab === 'messages' && <p>Message thread with {selectedContact.name}</p>}
              {activeTab === 'voicemail' && <p>Voicemails from {selectedContact.name}</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Hi, {user.name || 'User'}!</h2>
            {notificationText && (
              <p className="text-gray-400 mt-2">{notificationText}</p>
            )}
            {!notificationText && (
              <p className="text-gray-500 mt-2">You&apos;re all caught up</p>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANE - Dialer / Active Call */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {isCallActive ? (
          <div className="flex-1 flex flex-col items-center justify-between py-8 px-4">
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-white">
                  {number ? number.slice(-2) : '??'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{number || 'Unknown'}</p>
              <p className="text-white text-3xl font-mono mt-3 tabular-nums">
                {String(Math.floor(callDuration / 60)).padStart(2, '0')}:{String(callDuration % 60).padStart(2, '0')}
              </p>
            </div>

            {showKeypad ? (
              <div className="w-full space-y-2">
                {keys.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((key) => (
                      <button key={key} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-4 text-xl font-medium text-white transition-colors cursor-pointer">{key}</button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[
                  { icon: MessageSquare, label: 'Message' },
                  { icon: isMuted ? MicOff : Mic, label: isMuted ? 'Unmute' : 'Mute', onClick: () => setIsMuted(!isMuted) },
                  { icon: Pause, label: 'Hold' },
                  { icon: Keyboard, label: 'Keypad', onClick: () => setShowKeypad(true) },
                  { icon: UserPlus, label: 'Transfer' },
                  { icon: MessageSquare, label: 'Record' },
                ].map((action, i) => (
                  <button key={i} onClick={action.onClick}
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                      <action.icon size={20} />
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            <button onClick={handleHangup}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mt-6 transition-colors cursor-pointer">
              <PhoneOff size={28} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4">
            <div className="text-center mb-4">
              <p className="text-gray-500 text-xs">Call as</p>
              <p className="text-gray-300 text-sm">+1 (555) 000-0000</p>
            </div>

            <div className="relative mb-4">
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a name or number"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm" />
              {number && (
                <button onClick={handleDelete} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              )}
            </div>

            <button onClick={handleCall} disabled={!number.trim()}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 py-3 rounded-xl text-white font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 mb-4">
              <Phone size={18} /> Call
            </button>

            {!number && suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-2">Suggestions</p>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setNumber(s.number)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-left">
                    <div className={`w-8 h-8 ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.number}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 flex flex-col justify-end">
              <div className="space-y-2">
                {keys.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((key) => (
                      <button key={key} onClick={() => handleKeyPress(key)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl py-4 text-xl font-medium text-white transition-colors cursor-pointer">
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <button className="text-gray-500 hover:text-gray-300 text-xs mt-4 flex items-center justify-center gap-1 cursor-pointer">
                <ChevronDown size={14} /> Hide keypad
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DialerPage