import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ClassList = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    section: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])

  // Fetch classes and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get('/classes'),
          axios.get('/subjects')
        ])
        setClasses(classesRes.data.data)
        setSubjects(subjectsRes.data.data)
      } catch (err) {
        toast.error('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const { name, section } = formData

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
    setFormData({ name: '', section: '' })
    setSelectedSubjects([])
    setEditMode(false)
    setCurrentId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // Update class
        await axios.put(`/classes/${currentId}`, {
          ...formData,
          subjects: selectedSubjects
        })
        toast.success('Class updated successfully')
      } else {
        // Create new class
        await axios.post('/classes', {
          ...formData,
          subjects: selectedSubjects
        })
        toast.success('Class created successfully')
      }
      
      // Refresh class list
      const res = await axios.get('/classes')
      setClasses(res.data.data)
      
      // Reset form
      resetForm()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving class')
    }
  }

  const handleEdit = (cls) => {
    setFormData({
      name: cls.name,
      section: cls.section || ''
    })
    setSelectedSubjects(cls.subjects.map(subject => subject._id))
    setEditMode(true)
    setCurrentId(cls._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/classes/${id}`)
        toast.success('Class deleted successfully')
        
        // Update class list
        setClasses(classes.filter(cls => cls._id !== id))
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error deleting class')
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
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-xl font-bold">Classes</h2>
          </div>
          
          {classes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No classes found. Add a class to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map(cls => (
                    <tr key={cls._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{cls.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cls.section || '-'}</td>
                      <td className="px-6 py-4">
                        {cls.subjects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {cls.subjects.map(subject => (
                              <span key={subject._id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {subject.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">No subjects</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
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
          <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Class' : 'Add New Class'}</h2>
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Class Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter class name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
                Section (Optional)
              </label>
              <input
                type="text"
                id="section"
                name="section"
                value={section}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter section"
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
                          className="form-checkbox h-4 w-4 text-blue-600"
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editMode ? 'Update Class' : 'Add Class'}
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

export default ClassList
