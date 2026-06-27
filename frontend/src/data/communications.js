export const communications = [
  {
    id: 1,
    number: '(415) 555-0123',
    name: 'Sarah Johnson',
    avatarColor: 'bg-blue-500',
    initial: 'S',
    isBlocked: false,
    isSaved: true,
    calls: [
      { id: 101, type: 'outgoing', status: 'Connected', timestamp: '2026-06-26T10:30:00' },
      { id: 102, type: 'incoming', status: 'Voicemail', timestamp: '2026-06-25T14:00:00' },
    ],
    messages: [
      { id: 201, sender: 'them', text: 'Hi! Are we still on for the demo tomorrow?', timestamp: '2026-06-26T10:15:00' },
      { id: 202, sender: 'me', text: 'Yes, absolutely. 2 PM works great.', timestamp: '2026-06-26T10:20:00' },
      { id: 203, sender: 'them', text: 'Perfect. I\'ll have the team ready.', timestamp: '2026-06-26T10:25:00' },
    ],
  },
  {
    id: 2,
    number: '(212) 555-0456',
    name: 'Mike Peters',
    avatarColor: 'bg-green-500',
    initial: 'M',
    isBlocked: false,
    isSaved: true,
    calls: [
      { id: 103, type: 'incoming', status: 'Voicemail', timestamp: '2026-06-26T10:05:00' },
    ],
    messages: [
      { id: 204, sender: 'them', text: 'Can you send me the proposal?', timestamp: '2026-06-26T09:15:00' },
    ],
  },
  {
    id: 3,
    number: '(310) 555-0789',
    name: 'Emily Davis',
    avatarColor: 'bg-purple-500',
    initial: 'E',
    isBlocked: false,
    isSaved: true,
    calls: [
      { id: 104, type: 'outgoing', status: 'Connected', timestamp: '2026-06-25T16:15:00' },
    ],
    messages: [
      { id: 205, sender: 'them', text: 'Thanks for the follow up!', timestamp: '2026-06-25T16:20:00' },
    ],
  },
  {
    id: 4,
    number: '(512) 555-0321',
    name: null,
    avatarColor: 'bg-yellow-500',
    initial: 'J',
    isBlocked: false,
    isSaved: false,
    calls: [
      { id: 105, type: 'missed', status: 'No Answer', timestamp: '2026-06-25T14:30:00' },
    ],
    messages: [],
  },
  {
    id: 5,
    number: '(617) 555-0654',
    name: 'Lisa Chen',
    avatarColor: 'bg-pink-500',
    initial: 'L',
    isBlocked: false,
    isSaved: true,
    calls: [
      { id: 106, type: 'outgoing', status: 'Connected', timestamp: '2026-06-25T11:00:00' },
    ],
    messages: [
      { id: 206, sender: 'me', text: 'Meeting confirmed for Friday', timestamp: '2026-06-24T15:00:00' },
      { id: 207, sender: 'them', text: 'Great, see you then!', timestamp: '2026-06-24T15:05:00' },
    ],
  },
];

export function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatCallTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}