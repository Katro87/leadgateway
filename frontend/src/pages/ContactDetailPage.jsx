import { useParams, useNavigate } from 'react-router-dom'
import { contacts } from '../data/contactsData'

function ContactDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contact = contacts.find((c) => c.id === parseInt(id))

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold">Contact Not Found</h3>
          <button
            onClick={() => navigate('/contacts')}
            className="text-blue-500 hover:text-blue-400 mt-4 cursor-pointer"
          >
            ← Back to Contacts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/contacts')}
        className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
      >
        ← Back to Contacts
      </button>

      {/* Contact Header */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold">
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{contact.name}</h2>
                <span>{contact.favorite ? '⭐' : '☆'}</span>
              </div>
              <p className="text-gray-400 text-sm">{contact.company}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              ✏️ Edit
            </button>
            <button className="bg-red-900/50 hover:bg-red-800/50 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm">{contact.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
            <p className="text-sm">{contact.phone}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Company</p>
            <p className="text-sm">{contact.company}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tags</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <p className="text-gray-500 text-sm">No notes yet. Notes feature coming soon.</p>
      </div>
    </div>
  )
}

export default ContactDetailPage