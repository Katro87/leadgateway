import { useState } from 'react'

const callHistory = [
  { id: 1, name: 'Sarah Johnson', number: '(415) 555-0123', type: 'outgoing', duration: '4:32', date: '2026-06-26', time: '10:30 AM', result: 'Connected' },
  { id: 2, name: 'Mike Peters', number: '(212) 555-0456', type: 'incoming', duration: '2:15', date: '2026-06-26', time: '10:05 AM', result: 'Voicemail' },
  { id: 3, name: 'Emily Davis', number: '(310) 555-0789', type: 'outgoing', duration: '8:47', date: '2026-06-25', time: '4:15 PM', result: 'Connected' },
  { id: 4, name: 'James Wilson', number: '(512) 555-0321', type: 'missed', duration: '—', date: '2026-06-25', time: '2:30 PM', result: 'No Answer' },
  { id: 5, name: 'Lisa Chen', number: '(617) 555-0654', type: 'outgoing', duration: '3:21', date: '2026-06-25', time: '11:00 AM', result: 'Connected' },
  { id: 6, name: 'Robert Taylor', number: '(702) 555-0987', type: 'incoming', duration: '5:10', date: '2026-06-24', time: '3:45 PM', result: 'Connected' },
  { id: 7, name: 'Anna Kim', number: '(305) 555-0111', type: 'missed', duration: '—', date: '2026-06-24', time: '9:20 AM', result: 'No Answer' },
  { id: 8, name: 'David Brown', number: '(650) 555-0222', type: 'outgoing', duration: '1:45', date: '2026-06-23', time: '5:00 PM', result: 'Voicemail' },
]

function CallHistoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const types = ['All', 'outgoing', 'incoming', 'missed']

  const filteredCalls = callHistory.filter((call) => {
    const matchesSearch =
      call.name.toLowerCase().includes(search.toLowerCase()) ||
      call.number.includes(search)
    const matchesFilter = filter === 'All' || call.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Call History</h2>
        <p className="text-gray-400 text-sm mt-1">{callHistory.length} total calls</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <div className="flex gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Call History Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium hidden sm:table-cell">Number</th>
              <th className="px-5 py-3 font-medium hidden md:table-cell">Duration</th>
              <th className="px-5 py-3 font-medium hidden lg:table-cell">Date & Time</th>
              <th className="px-5 py-3 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => (
              <tr
                key={call.id}
                className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {call.type === 'incoming' ? '📥' : call.type === 'missed' ? '❌' : '📤'}
                    </span>
                    <span className="font-medium text-sm">{call.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden sm:table-cell">
                  {call.number}
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">
                  {call.duration}
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden lg:table-cell">
                  {call.date} • {call.time}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      call.result === 'Connected'
                        ? 'bg-green-900/50 text-green-400'
                        : call.result === 'Voicemail'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {call.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-gray-500">No calls found</div>
        )}
      </div>
    </div>
  )
}

export default CallHistoryPage