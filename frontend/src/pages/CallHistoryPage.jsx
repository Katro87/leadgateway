import { useState } from 'react'
import { Search, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react'

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

const typeIcons = {
  incoming: { Icon: PhoneIncoming, color: 'text-green-400' },
  outgoing: { Icon: PhoneOutgoing, color: 'text-blue-400' },
  missed: { Icon: PhoneMissed, color: 'text-red-400' },
}

const resultStyles = {
  'Connected': 'bg-green-500/20 text-green-400',
  'Voicemail': 'bg-yellow-500/20 text-yellow-400',
  'No Answer': 'bg-red-500/20 text-red-400',
}

function CallHistoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const types = ['All', 'outgoing', 'incoming', 'missed']

  const filteredCalls = callHistory.filter((call) => {
    const matchesSearch = call.name.toLowerCase().includes(search.toLowerCase()) || call.number.includes(search)
    const matchesFilter = filter === 'All' || call.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Call History</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{callHistory.length} total calls</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or number..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex gap-2">
          {types.map((type) => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700'
              }`}>{type}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium hidden sm:table-cell">Number</th>
              <th className="px-5 py-3 font-medium hidden md:table-cell">Duration</th>
              <th className="px-5 py-3 font-medium hidden lg:table-cell">Date & Time</th>
              <th className="px-5 py-3 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => {
              const { Icon, color } = typeIcons[call.type] || typeIcons.outgoing
              return (
                <tr key={call.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={color} />
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{call.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{call.number}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{call.duration}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{call.date} • {call.time}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${resultStyles[call.result] || ''}`}>
                      {call.result}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-gray-400">No calls found</div>
        )}
      </div>
    </div>
  )
}

export default CallHistoryPage