const voicemails = [
  { id: 1, name: 'Mike Peters', number: '(212) 555-0456', duration: '0:45', date: '2026-06-26', time: '10:05 AM', listened: false },
  { id: 2, name: 'David Brown', number: '(650) 555-0222', duration: '1:12', date: '2026-06-23', time: '5:00 PM', listened: true },
  { id: 3, name: 'Sarah Johnson', number: '(415) 555-0123', duration: '0:32', date: '2026-06-22', time: '9:15 AM', listened: true },
  { id: 4, name: 'Unknown', number: '(213) 555-0999', duration: '0:18', date: '2026-06-21', time: '2:40 PM', listened: false },
]

function VoicemailPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Voicemail</h2>
        <p className="text-gray-400 text-sm mt-1">{voicemails.length} messages</p>
      </div>

      {/* Voicemail List */}
      <div className="space-y-2">
        {voicemails.map((vm) => (
          <div
            key={vm.id}
            className={`bg-gray-800 rounded-xl border p-4 flex items-center justify-between ${
              vm.listened ? 'border-gray-700' : 'border-blue-600/50'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Play Button */}
              <button className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors cursor-pointer">
                ▶️
              </button>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{vm.name}</span>
                  {!vm.listened && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{vm.number}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {vm.date} • {vm.time} • {vm.duration}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                ⬇️
              </button>
              <button className="text-gray-400 hover:text-red-400 text-sm transition-colors cursor-pointer">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoicemailPage