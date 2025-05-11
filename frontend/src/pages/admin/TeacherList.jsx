import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const TeacherList = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    userId: '',
    maxHoursPerDay: 6
  })
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Fetch teachers, subjects, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, subjectsRes] = await Promise.all([
          axios.get('/teachers'),
          axios.get('/subjects')
        ])
        
        setTeachers(teachersRes.data.data)
        setSubjects(subjectsRes.data.data)
        
        // In a real application, you would have an endpoint to fetch users with teacher role
        // For now, we'll just use the existing teachers' user data
        const teacherUsers = teachersRes.data.data.map(teacher => teacher.user)
        setUsers(teacherUsers)
      } catch (err) {
        toast.error('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const { userId, maxHoursPerDay } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value
    if (e.target.checked) {
      setSelectedSubjects([...selectedSubjects, subjectId])
    } else {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId))
    }
  }

  const resetForm = () => {
    setFormData({
      userId: '',
      maxHoursPerDay: 6
    })
    setSelectedSubjects([])
    setEditMode(false)
    setCurrentId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // Update teacher
        await axios.put(`/teachers/${currentId}`, {
          ...formData,
          subjects: selectedSubjects
        })
        toast.success('Teacher updated successfully')
      } else {
        // Create new teacher
        await axios.post('/teachers', {
          ...formData,
          subjects: selectedSubjects
        })
        toast.success('Teacher created successfully')
      }
      
      // Refresh teacher list
      const res = await axios.get('/teachers')
      setTeachers(res.data.data)
      
      // Reset form
      resetForm()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving teacher')
    }
  }

  const handleEdit = (teacher) => {
    setFormData({
      userId: teacher.user._id,
      maxHoursPerDay: teacher.maxHoursPerDay
    })
    setSelectedSubjects(teacher.subjects.map(subject => subject._id))
    setEditMode(true)
    setCurrentId(teacher._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`/teachers/${id}`)
        toast.success('Teacher deleted successfully')
        
        // Update teacher list
        setTeachers(teachers.filter(teacher => teacher._id !== id))
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error deleting teacher')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-purple-600 text-white">
            <h2 className="text-xl font-bold">Teachers</h2>
          </div>
          
          {teachers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No teachers found. Add a teacher to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Hours/Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map(teacher => (
                    <tr key={teacher._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.user.email}</td>
                      <td className="px-6 py-4">
                        {teacher.subjects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map(subject => (
                              <span key={subject._id} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {subject.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">No subjects</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.maxHoursPerDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                Teacher
              </label>
              <select
                id="userId"
                name="userId"
                value={userId}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                disabled={editMode}
              >
                <option value="">Select a teacher</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {editMode && (
                <p className="text-gray-500 text-xs italic mt-1">
                  Teacher cannot be changed. Create a new record instead.
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxHoursPerDay">
                Maximum Hours Per Day
              </label>
              <input
                type="number"
                id="maxHoursPerDay"
                name="maxHoursPerDay"
                value={maxHoursPerDay}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
                max="12"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Subjects
              </label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {subjects.length === 0 ? (
                  <p className="text-gray-500 text-sm">No subjects available. Add subjects first.</p>
                ) : (
                  subjects.map(subject => (
                    <div key={subject._id} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={subject._id}
                          checked={selectedSubjects.includes(subject._id)}
                          onChange={handleSubjectChange}
                          className="form-checkbox h-4 w-4 text-purple-600"
                        />
                        <span className="ml-2">{subject.name}</span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editMode ? 'Update Teacher' : 'Add Teacher'}
              </button>
              
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TeacherList
