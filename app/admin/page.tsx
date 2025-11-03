'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'

interface Project {
  id: number
  title: string
  description: string
  image_url: string
  demo_url: string
  github_url: string
  technologies: string[]
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: ''
  })

  // Redirect: panel admin dipusatkan ke /chupscupagent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/chupscupagent')
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const technologiesArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            demo_url: formData.demo_url,
            github_url: formData.github_url,
            technologies: technologiesArray
          })
          .eq('id', editingId)

        if (error) throw error
        alert('Project updated!')
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            demo_url: formData.demo_url,
            github_url: formData.github_url,
            technologies: technologiesArray
          }])

        if (error) throw error
        alert('Project created!')
      }

      setFormData({
        title: '',
        description: '',
        image_url: '',
        demo_url: '',
        github_url: '',
        technologies: ''
      })
      setEditingId(null)
      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving project')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      demo_url: project.demo_url,
      github_url: project.github_url,
      technologies: project.technologies.join(', ')
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Project deleted!')
      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting project')
    }
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout title="Projects">
      {/* Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
          <input
            type="url"
            placeholder="Demo URL"
            value={formData.demo_url}
            onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={formData.github_url}
            onChange={(e) => setFormData({...formData, github_url: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
          <input
            type="text"
            placeholder="Technologies (comma separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    title: '',
                    description: '',
                    image_url: '',
                    demo_url: '',
                    github_url: '',
                    technologies: ''
                  })
                }}
                className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Projects ({projects.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 p-4 rounded flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-gray-400">{project.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tech: {project.technologies.join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
