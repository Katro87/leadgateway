import { useState } from 'react'

function DialerPage() {
  const [number, setNumber] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)

  const handleKeyPress = (value) => {
    setNumber((prev) => prev + value)
  }

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (number.trim()) {
      setIsCallActive(true)
    }
  }

  const handleHangup = () => {
    setIsCallActive(false)
    setNumber('')
  }

  const recentNumbers = [
    { id: 1, name: 'Sarah Johnson', number: '(415) 555-0123', time: '10 min ago' },
    { id: 2, name: 'Mike Peters', number: '(212) 555-0456', time: '25 min ago' },
    { id: 3, name: 'Emily Davis', number: '(310) 555-0789', time: '1 hour ago' },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Dial Pad Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Number Display */}
        <div className="w-full max-w-sm mb-6">
          <input
            type="text"
            value={number}
            readOnly
            placeholder="Enter number"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-mono text-white placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
            (key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-4 text-xl font-medium transition-colors cursor-pointer"
              >
                {key}
              </button>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 w-full max-w-sm">
          <button
            onClick={handleCall}
            disabled={!number.trim() || isCallActive}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 py-4 rounded-lg text-lg font-medium transition-colors cursor-pointer"
          >
            📞 Call
          </button>
          {number && (
            <button
              onClick={handleDelete}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-4 rounded-lg text-lg transition-colors cursor-pointer"
            >
              ⌫
            </button>
          )}
        </div>

        {/* Active Call Controls */}
        {isCallActive && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-green-400 text-lg font-medium">Call in progress...</p>
            <p className="text-gray-400 text-sm">00:15</p>
            <div className="flex gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                🔇 Mute
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                ⏸️ Hold
              </button>
              <button
                onClick={handleHangup}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                ❌ Hang Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Calls Sidebar */}
      <div className="lg:w-72 bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Calls</h3>
        <div className="space-y-3">
          {recentNumbers.map((call) => (
            <button
              key={call.id}
              onClick={() => setNumber(call.number)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium">{call.name}</p>
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