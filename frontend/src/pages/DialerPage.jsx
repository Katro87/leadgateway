import { useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Pause, Delete, User } from 'lucide-react'

const recentCalls = [
  { id: 1, name: 'Sarah Johnson', number: '(415) 555-0123', time: '10 min ago', type: 'outgoing' },
  { id: 2, name: 'Mike Peters', number: '(212) 555-0456', time: '25 min ago', type: 'incoming' },
  { id: 3, name: 'Emily Davis', number: '(310) 555-0789', time: '1 hour ago', type: 'missed' },
  { id: 4, name: 'James Wilson', number: '(512) 555-0321', time: '2 hours ago', type: 'outgoing' },
]

function DialerPage() {
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleKeyPress = (value) => setNumber((prev) => prev + value)
  const handleDelete = () => setNumber((prev) => prev.slice(0, -1))
  const handleCall = () => { if (number.trim()) setIsCallActive(true) }
  const handleHangup = () => { setIsCallActive(false); setNumber('') }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ]

  return (
    <div className="flex h-full gap-0 -m-6">
      {/* Left Panel - Activity Feed */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 p-5 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Hi, {user.name || 'User'}</h2>
          <p className="text-gray-400 text-sm mt-1">You&apos;re all caught up</p>
        </div>
        <div className="text-center flex-1 flex flex-col items-center justify-center text-gray-500">
          <User size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No new notifications</p>
        </div>
      </div>

      {/* Center Panel - Dialer */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-6">
        {!isCallActive ? (
          <>
            {/* Number Display */}
            <div className="w-full max-w-xs mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center min-h-[56px] flex items-center justify-center">
                {number ? (
                  <span className="text-3xl font-mono text-white tracking-wider">{number}</span>
                ) : (
                  <span className="text-gray-500 text-lg">Enter number</span>
                )}
              </div>
            </div>

            {/* Keypad */}
            <div className="w-full max-w-xs space-y-2">
              {keys.map((row, i) => (
                <div key={i} className="flex gap-2">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 rounded-xl py-5 text-2xl font-medium text-white transition-colors cursor-pointer"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Call Button */}
            <div className="w-full max-w-xs mt-6">
              <button
                onClick={handleCall}
                disabled={!number.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 py-4 rounded-xl text-white font-semibold text-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone size={22} /> Call
              </button>
            </div>

            {number && (
              <button onClick={handleDelete} className="mt-3 text-gray-400 hover:text-white text-sm cursor-pointer flex items-center gap-1">
                <Delete size={14} /> Clear
              </button>
            )}
          </>
        ) : (
          /* Active Call Screen */
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Calling...</p>
              <p className="text-2xl font-mono text-white mt-2 tracking-wider">{number}</p>
              <p className="text-green-400 text-lg font-medium mt-4">00:15</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 transition-colors cursor-pointer">
                <Pause size={22} />
              </button>
              <button onClick={handleHangup}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer">
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Recent Calls */}
      <div className="w-72 bg-gray-800 border-l border-gray-700 p-5 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Calls</h3>
        <div className="space-y-1">
          {recentCalls.map((call) => (
            <button
              key={call.id}
              onClick={() => setNumber(call.number)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white">{call.name}</p>
              <p className="text-xs text-gray-400">{call.number}</p>
              <p className="text-xs text-gray-500 mt-1">{call.time}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DialerPage