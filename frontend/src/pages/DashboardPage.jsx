import { statsCards, recentCalls } from '../data/dashboardData'

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, John. Here&apos;s your overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-green-400 text-xs font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            📞 New Call
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            👤 Add Contact
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            💬 Send Message
          </button>
        </div>
      </div>

      {/* Recent Calls */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Calls</h3>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Number</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Duration</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Time</th>
                <th className="px-5 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
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
                    {call.time}
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
        </div>
      </div>
    </div>
  )
}

export default DashboardPage