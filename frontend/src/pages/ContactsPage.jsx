import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { contacts as initialContacts } from '../data/contactsData'

function ContactsPage() {
  const [search, setSearch] = useState('')
  const [contactsList, setContactsList] = useState(initialContacts)
  const [selectedTag, setSelectedTag] = useState('All')
  const navigate = useNavigate()
  const allTags = ['All', ...new Set(initialContacts.flatMap((c) => c.tags))]

  const filteredContacts = contactsList.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.company.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    const matchesTag = selectedTag === 'All' || contact.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const toggleFavorite = (id) => {
    setContactsList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contacts</h2>
          <p className="text-gray-400 text-sm mt-1">{contactsList.length} total contacts</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
          + Add Contact
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, company, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
              <th className="px-5 py-3 font-medium w-10"></th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium hidden md:table-cell">Company</th>
              <th className="px-5 py-3 font-medium hidden lg:table-cell">Email</th>
              <th className="px-5 py-3 font-medium hidden sm:table-cell">Phone</th>
              <th className="px-5 py-3 font-medium">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr
                 key={contact.id}
                onClick={() => navigate(`/contacts/${contact.id}`)}
                className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors cursor-pointer"
                >
                <td className="px-5 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(contact.id)
                    }}
                    className="text-lg cursor-pointer"
                  >
                    {contact.favorite ? '⭐' : '☆'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium text-sm">{contact.name}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">
                  {contact.company}
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden lg:table-cell">
                  {contact.email}
                </td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden sm:table-cell">
                  {contact.phone}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-gray-500">No contacts found</div>
        )}
      </div>
    </div>
  )
}

export default ContactsPage