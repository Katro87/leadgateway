import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContacts, deleteContact, updateContact } from '../api/contacts'

function ContactDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', company: '', email: '', phone: '', tags: '', notes: '' })

  useEffect(() => { loadContact(); }, [id]);

  const loadContact = async () => {
    try {
      const contacts = await getContacts();
      const found = contacts.find((c) => c._id === id);
      setContact(found);
      if (found) {
        setEditForm({
          name: found.name || '',
          company: found.company || '',
          email: found.email || '',
          phone: found.phone || '',
          tags: found.tags?.join(', ') || '',
          notes: found.notes || '',
        });
      }
    } catch (err) {
      console.error('Failed to load contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        navigate('/contacts');
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...editForm,
        tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      const data = await updateContact(id, updated);
      setContact(data);
      setShowEdit(false);
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold">Contact Not Found</h3>
          <button onClick={() => navigate('/contacts')} className="text-blue-500 hover:text-blue-400 mt-4 cursor-pointer">← Back to Contacts</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/contacts')} className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">← Back to Contacts</button>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold">
              {contact.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              <p className="text-gray-400 text-sm">{contact.company || '—'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowEdit(true)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">✏️ Edit</button>
            <button onClick={handleDelete} className="bg-red-900/50 hover:bg-red-800/50 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">🗑️ Delete</button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p><p className="text-sm">{contact.email || '—'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p><p className="text-sm">{contact.phone || '—'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Company</p><p className="text-sm">{contact.company || '—'}</p></div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tags</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {contact.tags?.map((tag) => (<span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <p className="text-gray-500 text-sm">{contact.notes || 'No notes yet.'}</p>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Contact</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <input type="text" placeholder="Name *" required value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Company" value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Phone" value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Tags (comma separated)" value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <textarea placeholder="Notes" value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" rows="3" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Save Changes</button>
                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactDetailPage