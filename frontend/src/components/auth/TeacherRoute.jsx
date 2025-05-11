import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (user && user.role !== 'teacher') {
    return <Navigate to="/" />
  }

  return children
}

export default TeacherRoute
