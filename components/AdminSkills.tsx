'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Skill = {
  id: string
  name: string
  level: number
  type: string
  note?: string
  category_id: string
}

type Category = {
  id: string
  title: string
  efficiency: number
  skills: Skill[]
}

export default function AdminSkills() {
  const [categories, setCategories] = useState<Category[]>([])
  const [softSkills, setSoftSkills] = useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ type: 'category' | 'skill' | 'soft-skill' | null, id: string | null }>({ type: null, id: null })
  const [newCategory, setNewCategory] = useState({ title: '', efficiency: 0 })
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 0,
    type: '',
    note: '',
    category_id: ''
  })
  const [newSoftSkill, setNewSoftSkill] = useState({ name: '' })

  // Fetch all data
  const fetchData = async () => {
    try {
      const { data: skillData, error: skillError } = await supabase
        .from('skill_categories')
        .select(`
          *,
          skills:skills(*)
        `)
        .order('created_at', { ascending: true })

      if (skillError) throw skillError

      const { data: softSkillData, error: softSkillError } = await supabase
        .from('soft_skills')
        .select('*')
        .order('created_at', { ascending: true })

      if (softSkillError) throw softSkillError

      setCategories(skillData || [])
      setSoftSkills(softSkillData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Seed dataset as requested
  const seedDataset = async () => {
    const payload = {
      categories: [
        {
          title: 'Analisis Sistem',
          efficiency: 75,
          skills: [
            { name: 'Pemodelan Proses Bisnis', level: 75, type: 'analysis' },
            { name: 'Rekayasa Kebutuhan', level: 70, type: 'analysis' },
            { name: 'Arsitektur Sistem', level: 72, type: 'analysis' },
            { name: 'Analisis Alur Data', level: 78, type: 'analysis' },
            { name: 'Penilaian Risiko', level: 65, type: 'analysis' },
          ]
        },
        {
          title: 'Inti Pengembangan',
          efficiency: 68,
          skills: [
            { name: 'Pengembangan FullStack', level: 68, type: 'development', note: 'PHP, HTML5, CSS/Tailwind, JavaScript/TypeScript, C++, C#, Java' },
            { name: 'Integrasi API (RESTful, Laravel)', level: 65, type: 'development' },
            { name: 'Desain Basis Data (SQL)', level: 75, type: 'development' },
            { name: 'Implementasi UI/UX (React.js, Next.js)', level: 70, type: 'development' },
            { name: 'Optimasi Kode', level: 67, type: 'development' },
          ]
        },
        {
          title: 'Infrastruktur',
          efficiency: 65,
          skills: [
            { name: 'Arsitektur Cloud', level: 62, type: 'infra' },
            { name: 'Pipeline CI/CD', level: 60, type: 'infra' },
            { name: 'Implementasi Keamanan', level: 68, type: 'infra' },
            { name: 'Pemantauan Kinerja', level: 65, type: 'infra' },
            { name: 'Penskalaan Sistem', level: 63, type: 'infra' },
          ]
        },
        {
          title: 'Kekuatan Utama',
          efficiency: 70,
          skills: [
            { name: 'Analisis Bisnis', level: 78, type: 'core' },
            { name: 'Desain Sistem', level: 72, type: 'core' },
            { name: 'Pengembangan FullStack', level: 68, type: 'core' },
            { name: 'Infrastruktur Cloud', level: 62, type: 'core' },
            { name: 'Pemodelan Data', level: 75, type: 'core' },
            { name: 'Integrasi API', level: 70, type: 'core' },
            { name: 'Keamanan', level: 68, type: 'core' },
            { name: 'Kinerja', level: 65, type: 'core' },
          ]
        }
      ],
      softSkills: [
        { name: 'Berpikir Kritis' },
        { name: 'Pemecahan Masalah Kreatif' },
        { name: 'Adaptasi Cepat' },
        { name: 'Orientasi Detail' },
        { name: 'Komunikasi Kuat' },
        { name: 'Kerja Sama Tim' },
        { name: 'Manajemen Proyek' },
      ]
    }

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'seed', data: payload, serviceRole: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbWFxYnJ2d2Jvc2JpbmpyeGVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4OTI1NiwiZXhwIjoyMDc2OTY1MjU2fQ.g8kTWYNtaaNeakqNATVY5M0Dxi7dH8anx2M7ka_g_SU' })
      })
      if (!res.ok) {
        let msg = 'Failed to seed dataset'
        try {
          const data = await res.json()
          msg = data?.error || msg
        } catch {}
        throw new Error(msg)
      }
      await fetchData()
      alert('Dataset System Analyst berhasil diterapkan!')
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : 'Gagal menerapkan dataset. Periksa koneksi/API.'
      alert(msg)
    }
  }

  // Add new category
  const addCategory = async () => {
    try {
      const response = await fetch('/api/skills', {
        method: editing.type === 'category' && editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editing.type === 'category' && editing.id
            ? { type: 'category', id: editing.id, data: newCategory }
            : { type: 'category', data: newCategory }
        )
      })

      if (!response.ok) throw new Error('Failed to save category')
      
      setNewCategory({ title: '', efficiency: 0 })
      setEditing({ type: null, id: null })
      fetchData()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  // Add new skill
  const addSkill = async () => {
    try {
      const response = await fetch('/api/skills', {
        method: editing.type === 'skill' && editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editing.type === 'skill' && editing.id
            ? { type: 'skill', id: editing.id, data: newSkill }
            : { type: 'skill', data: newSkill }
        )
      })

      if (!response.ok) throw new Error('Failed to save skill')
      
      setNewSkill({
        name: '',
        level: 0,
        type: '',
        note: '',
        category_id: ''
      })
      setEditing({ type: null, id: null })
      fetchData()
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  // Add new soft skill
  const addSoftSkill = async () => {
    try {
      const response = await fetch('/api/skills', {
        method: editing.type === 'soft-skill' && editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editing.type === 'soft-skill' && editing.id
            ? { type: 'soft-skill', id: editing.id, data: newSoftSkill }
            : { type: 'soft-skill', data: newSoftSkill }
        )
      })

      if (!response.ok) throw new Error('Failed to save soft skill')
      
      setNewSoftSkill({ name: '' })
      setEditing({ type: null, id: null })
      fetchData()
    } catch (error) {
      console.error('Error saving soft skill:', error)
    }
  }

  // Delete functions
  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/skills?type=category&id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete category')
      fetchData()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills?type=skill&id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete skill')
      fetchData()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const deleteSoftSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills?type=soft-skill&id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete soft skill')
      fetchData()
    } catch (error) {
      console.error('Error deleting soft skill:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8 p-4 text-brown-dark dark:text-cream-100">
      {/* Add Category Form */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{editing.type === 'category' ? 'Edit Category' : 'Add New Category'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category Title"
            value={newCategory.title}
            onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Efficiency (%)"
            value={newCategory.efficiency}
            onChange={(e) => setNewCategory({ ...newCategory, efficiency: parseInt(e.target.value) })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <button
            onClick={addCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editing.type === 'category' ? 'Save Changes' : 'Add Category'}
          </button>
          {editing.type === 'category' && (
            <button
              onClick={() => { setEditing({ type: null, id: null }); setNewCategory({ title: '', efficiency: 0 }) }}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Add Skill Form */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{editing.type === 'skill' ? 'Edit Skill' : 'Add New Skill'}</h3>
        <div className="space-y-4">
          <select
            value={newSkill.category_id}
            onChange={(e) => setNewSkill({ ...newSkill, category_id: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white border-cream-300 dark:border-gray-600"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Level (0-100)"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Type"
            value={newSkill.type}
            onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={newSkill.note || ''}
            onChange={(e) => setNewSkill({ ...newSkill, note: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <button
            onClick={addSkill}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editing.type === 'skill' ? 'Save Changes' : 'Add Skill'}
          </button>
          {editing.type === 'skill' && (
            <button
              onClick={() => { setEditing({ type: null, id: null }); setNewSkill({ name: '', level: 0, type: '', note: '', category_id: '' }) }}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Add Soft Skill Form */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{editing.type === 'soft-skill' ? 'Edit Soft Skill' : 'Add New Soft Skill'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Soft Skill Name"
            value={newSoftSkill.name}
            onChange={(e) => setNewSoftSkill({ ...newSoftSkill, name: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 border-cream-300 dark:border-gray-600"
          />
          <button
            onClick={addSoftSkill}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editing.type === 'soft-skill' ? 'Save Changes' : 'Add Soft Skill'}
          </button>
          {editing.type === 'soft-skill' && (
            <button
              onClick={() => { setEditing({ type: null, id: null }); setNewSoftSkill({ name: '' }) }}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Display Categories and Skills */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Current Skills</h3>
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-semibold">{category.title}</h4>
                <p className="text-brown-mid dark:text-cream-200">Efficiency: {category.efficiency}%</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing({ type: 'category', id: category.id }); setNewCategory({ title: category.title, efficiency: category.efficiency }) }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete Category
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {category.skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center bg-cream-50 dark:bg-gray-700 p-2 rounded">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-brown-mid dark:text-cream-200 ml-2">({skill.level}%)</span>
                    {skill.type && <span className="text-brown-mid dark:text-cream-200 ml-2">{skill.type}</span>}
                    {skill.note && <p className="text-sm text-brown-mid dark:text-cream-200">{skill.note}</p>}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditing({ type: 'skill', id: skill.id }); setNewSkill({ name: skill.name, level: skill.level, type: skill.type, note: skill.note || '', category_id: skill.category_id }) }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Display Soft Skills */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Soft Skills</h3>
        <div className="space-y-2">
          {softSkills.map((skill) => (
            <div key={skill.id} className="flex justify-between items-center bg-cream-50 dark:bg-gray-700 p-2 rounded">
              <span>{skill.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => { setEditing({ type: 'soft-skill', id: skill.id }); setNewSoftSkill({ name: skill.name }) }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSoftSkill(skill.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}