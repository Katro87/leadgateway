# Changelog
### v0.10.0 - Auth Protection & User Display ✅
- Added ProtectedRoute component — redirects to login if no token
- All dashboard routes now require authentication
- Topbar shows logged-in user's name and initials
- Logout button clears session and redirects to login
- Built and deployed to leadgateway.tech

### v0.9.0 - Frontend-Backend Connection ✅
- Created API helper (frontend/src/api/auth.js)
- Signup page connected to backend API with form state, loading, error handling
- Login page connected to backend API
- Token stored in localStorage after authentication
- Successful auth redirects to dashboard
- Error messages displayed for invalid credentials

### v0.8.0 - Backend Setup ✅
- Initialized Node.js + Express backend in `/backend`
- Installed express@4, mongoose, cors, dotenv, bcryptjs@2.4.3, jsonwebtoken
- Connected to MongoDB Atlas (free M0 cluster)
- Created User model with password hashing
- Built auth routes: POST /signup, POST /login, GET /profile
- JWT token generation (30-day expiry)
- Fixed Mongoose pre-save hook (bcryptjs v3 incompatibility)
- All endpoints tested and working

## v0.0.1 - Project Setup
- Created Vite + React project in `frontend/`
- Installed Tailwind CSS with Vite plugin
- Installed React Router DOM
- Configured dark theme (gray-900 background)
- Created README.md with setup instructions
- Created root folder structure (frontend, backend, docs)

## v0.0.2 - Landing Page
- Built full Landing Page UI with header, hero, features, footer
- Added working Login/Signup navigation buttons
- Features section with 3 cards (Dialer, SMS, Analytics)

## v0.0.3 - Authentication Pages
- Built Login Page (split layout: branding + form)
- Built Signup Page (name, email, password fields)
- Built Forgot Password Page
- All auth pages link to each other

## v0.0.4 - Dashboard Layout
- Created DashboardLayout with Sidebar + Topbar
- Built Sidebar with 7 navigation links + active highlighting
- Built Topbar with search, notifications bell, profile button

## v0.0.5 - Dashboard Content
- Stats cards (Total Calls, Contacts, Messages, Talk Time)
- Quick Actions section (New Call, Add Contact, Send Message)
- Recent Calls table with status badges
- Created dashboard dummy data file

## v0.0.6 - Contacts Page
- Full contacts table (name, company, email, phone, tags)
- Search functionality (name, company, email)
- Tag filter buttons (Lead, Client, Prospect, VIP)
- Favorite toggle (star/unstar)
- Placeholder pages for all sidebar routes

## v0.0.7 - Contact Detail
- Contact detail page with full info display
- Avatar with initials, all contact fields
- Edit and Delete buttons (placeholders)
- Notes section
- Clickable contact rows → detail page

## v0.0.8 - Dialer, Call History, Voicemail
- Dial pad with full keypad (0-9, *, #), number display, delete
- Call/Hang Up with Mute/Hold controls + timer
- Call History with 8 records, search + type filters
- Voicemail with play/download/delete buttons, unread indicators

## v0.0.9 - Messages/SMS
- Conversation list with avatars, last message preview
- Chat view with sent/received message bubbles
- Message input with Send button
- Unread count badges

## v0.0.10 - Settings & 404
- Settings page with 5 tabs (Profile, Password, Notifications, Integrations, Billing)
- Toggle switches for notification preferences
- Integrations placeholders (Twilio, Google Calendar, Slack, Zapier)
- 404 Not Found page for unknown routes

---

## Project Status: Frontend Complete ✅

All pages built with dark theme, responsive design, and dummy data.
Ready for Phase 7: MongoDB + Authentication integration.