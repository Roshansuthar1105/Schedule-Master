import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ClassList from './pages/admin/ClassList'
import SubjectList from './pages/admin/SubjectList'
import TeacherList from './pages/admin/TeacherList'
import TimeSlotList from './pages/admin/TimeSlotList'
import TimetableManagement from './pages/admin/TimetableManagement'

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherTimetable from './pages/teacher/Timetable'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentTimetable from './pages/student/Timetable'

// Auth Components
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'
import TeacherRoute from './components/auth/TeacherRoute'
import StudentRoute from './components/auth/StudentRoute'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/classes" element={<AdminRoute><ClassList /></AdminRoute>} />
            <Route path="/admin/subjects" element={<AdminRoute><SubjectList /></AdminRoute>} />
            <Route path="/admin/teachers" element={<AdminRoute><TeacherList /></AdminRoute>} />
            <Route path="/admin/timeslots" element={<AdminRoute><TimeSlotList /></AdminRoute>} />
            <Route path="/admin/timetable" element={<AdminRoute><TimetableManagement /></AdminRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
            <Route path="/teacher/timetable" element={<TeacherRoute><TeacherTimetable /></TeacherRoute>} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
            <Route path="/student/timetable" element={<StudentRoute><StudentTimetable /></StudentRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  )
}

export default App