import { Navigate } from 'react-router-dom'

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  // If already logged in, redirect to dashboard instead of showing
  // login/signup/forgot-password. This prevents the browser back button
  // from letting authenticated users reach auth pages.
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default PublicRoute