import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContacts, toggleFavorite, createContact } from '../api/contacts'
import { Search, Download, Plus, Star, X, Loader2, User, Building2, Mail, Phone, Tag } from 'lucide-react'

function ContactsPage() {
  const [search, setSearch] = useState('')
  const [contactsList, setContactsList] = useState([])
  const [selectedTag, setSelectedTag] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', phone: '', tags: '' })
  const navigate = useNavigate()

  useEffect(() => { loadContacts(); }, []);
useEffect(() => {
  const hash = window.location.hash;
  const match = hash.match(/search=([^&]+)/);
  if (match) setSearch(decodeURIComponent(match[1]));
}, []);

// NEW: auto-open the Add Contact modal when arriving from Dashboard's
// "Add Contact" quick action button.
useEffect(() => {
  if (sessionStorage.getItem('openAddContactModal') === 'true') {
    setShowModal(true);
    sessionStorage.removeItem('openAddContactModal'); // one-time trigger, don't reopen on every visit
  }
}, []);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContactsList(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const contact = {
        ...newContact,
        tags: newContact.tags ? newContact.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      await createContact(contact);
      setShowModal(false);
      setNewContact({ name: '', company: '', email: '', phone: '', tags: '' });
      loadContacts();
    } catch (err) {
      console.error('Failed to add contact:', err);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Tags'];
    const rows = contactsList.map(c => [c.name, c.company, c.email, c.phone, (c.tags || []).join('; ')]);
    const csv = [headers, ...rows].map(row => row.map(field => `"${field || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contacts.csv'; a.click();
  };

  const allTags = ['All', ...new Set(contactsList.flatMap((c) => c.tags || []))];

  const filteredContacts = contactsList.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.company?.toLowerCase().includes(search.toLowerCase()) ||
      contact.email?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'All' || (contact.tags && contact.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleToggleFavorite = async (id) => {
    try {
      const updated = await toggleFavorite(id);
      setContactsList((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contacts</h2>
          <p className="text-gray-400 text-sm mt-1">{contactsList.length} total contacts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Plus size={16} /> Add Contact
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, company, email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setSelectedTag(tag)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>{tag}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                <th className="px-5 py-3 font-medium w-10"></th>
                <th className="px-5 py-3 font-medium"><div className="flex items-center gap-1"><User size={14} /> Name</div></th>
                <th className="px-5 py-3 font-medium hidden md:table-cell"><div className="flex items-center gap-1"><Building2 size={14} /> Company</div></th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell"><div className="flex items-center gap-1"><Mail size={14} /> Email</div></th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell"><div className="flex items-center gap-1"><Phone size={14} /> Phone</div></th>
                <th className="px-5 py-3 font-medium"><div className="flex items-center gap-1"><Tag size={14} /> Tags</div></th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact._id} onClick={() => navigate(`/contacts/${contact._id}`)}
                  className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors cursor-pointer">
                  <td className="px-5 py-4">
                    <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(contact._id); }}
                      className={`transition-colors cursor-pointer ${contact.favorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}>
                      <Star size={16} fill={contact.favorite ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-5 py-4"><span className="font-medium text-sm text-white">{contact.name}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{contact.company || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 hidden lg:table-cell">{contact.email || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 hidden sm:table-cell">{contact.phone || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags?.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
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
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Contact</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="space-y-4">
              <input type="text" placeholder="Name *" required value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Company" value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Phone" value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Tags (comma separated)" value={newContact.tags}
                onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Save Contact</button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsPage