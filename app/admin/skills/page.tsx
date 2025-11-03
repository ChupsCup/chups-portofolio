'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'

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

export default function AdminSkillsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [softSkills, setSoftSkills] = useState<{id: string, name: string}[]>([])
  const [editMode, setEditMode] = useState<{ type: 'category' | 'skill' | 'soft-skill' | null, id: string | null }>({
    type: null,
    id: null
  })
  const [formData, setFormData] = useState({
    category: {
      title: '',
      efficiency: 0
    },
    skill: {
      name: '',
      level: 0,
      type: '',
      note: '',
      category_id: ''
    },
    softSkill: {
      name: ''
    }
  })

  // Redirect: panel admin dipusatkan ke /chupscupagent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/chupscupagent')
    }
  }, [])

  // Fetch all data
  const fetchData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('skill_categories')
        .select(`
          *,
          skills:skills(*)
        `)
        .order('created_at', { ascending: true })

      if (categoriesError) throw categoriesError

      const { data: softSkillsData, error: softSkillsError } = await supabase
        .from('soft_skills')
        .select('*')
        .order('created_at', { ascending: true })

      if (softSkillsError) throw softSkillsError

      setCategories(categoriesData || [])
      setSoftSkills(softSkillsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let result

      if (editMode.type === 'category') {
        if (editMode.id) {
          // Update category
          result = await supabase
            .from('skill_categories')
            .update(formData.category)
            .eq('id', editMode.id)
        } else {
          // Create category
          result = await supabase
            .from('skill_categories')
            .insert([formData.category])
        }
      } else if (editMode.type === 'skill') {
        if (editMode.id) {
          // Update skill
          result = await supabase
            .from('skills')
            .update(formData.skill)
            .eq('id', editMode.id)
        } else {
          // Create skill
          result = await supabase
            .from('skills')
            .insert([formData.skill])
        }
      } else if (editMode.type === 'soft-skill') {
        if (editMode.id) {
          // Update soft skill
          result = await supabase
            .from('soft_skills')
            .update(formData.softSkill)
            .eq('id', editMode.id)
        } else {
          // Create soft skill
          result = await supabase
            .from('soft_skills')
            .insert([formData.softSkill])
        }
      }

      if (result?.error) throw result.error

      resetForm()
      fetchData()
      alert(editMode.id ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!')
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat menyimpan data')
    }
  }

  const handleDelete = async (type: 'category' | 'skill' | 'soft-skill', id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    try {
      const table = type === 'category' ? 'skill_categories' : type === 'skill' ? 'skills' : 'soft_skills'
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchData()
      alert('Data berhasil dihapus!')
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat menghapus data')
    }
  }

  const resetForm = () => {
    setEditMode({ type: null, id: null })
    setFormData({
      category: { title: '', efficiency: 0 },
      skill: { name: '', level: 0, type: '', note: '', category_id: '' },
      softSkill: { name: '' }
    })
  }

  if (!isAuthenticated || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout title="Skills">
      {/* Tombol untuk menambah data baru */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setEditMode({ type: 'category', id: null })}
          className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
        >
          Tambah Kategori
        </button>
        <button
          onClick={() => setEditMode({ type: 'skill', id: null })}
          className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
        >
          Tambah Skill
        </button>
        <button
          onClick={() => setEditMode({ type: 'soft-skill', id: null })}
          className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
        >
          Tambah Soft Skill
        </button>
      </div>

      {/* Form */}
      {editMode.type && (
        <div className="bg-cream-200 dark:bg-brown-mid p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">
            {editMode.id ? 'Edit' : 'Tambah'} {editMode.type === 'soft-skill' ? 'Soft Skill' : editMode.type === 'category' ? 'Kategori' : 'Skill'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {editMode.type === 'category' && (
              <>
                <input
                  type="text"
                  placeholder="Judul Kategori"
                  value={formData.category.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: { ...formData.category, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  required
                />
                <input
                  type="number"
                  placeholder="Efisiensi (%)"
                  value={formData.category.efficiency}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: { ...formData.category, efficiency: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  min="0"
                  max="100"
                  required
                />
              </>
            )}

            {editMode.type === 'skill' && (
              <>
                <input
                  type="text"
                  placeholder="Nama Skill"
                  value={formData.skill.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    skill: { ...formData.skill, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  required
                />
                <input
                  type="number"
                  placeholder="Level (%)"
                  value={formData.skill.level}
                  onChange={(e) => setFormData({
                    ...formData,
                    skill: { ...formData.skill, level: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  min="0"
                  max="100"
                  required
                />
                <input
                  type="text"
                  placeholder="Tipe"
                  value={formData.skill.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    skill: { ...formData.skill, type: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  required
                />
                <textarea
                  placeholder="Catatan (opsional)"
                  value={formData.skill.note}
                  onChange={(e) => setFormData({
                    ...formData,
                    skill: { ...formData.skill, note: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                />
                <select
                  value={formData.skill.category_id}
                  onChange={(e) => setFormData({
                    ...formData,
                    skill: { ...formData.skill, category_id: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </>
            )}

            {editMode.type === 'soft-skill' && (
              <input
                type="text"
                placeholder="Nama Soft Skill"
                value={formData.softSkill.name}
                onChange={(e) => setFormData({
                  ...formData,
                  softSkill: { ...formData.softSkill, name: e.target.value }
                })}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-brown-dark"
                required
              />
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
              >
                {editMode.id ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-brown-light hover:bg-brown-mid text-white rounded-lg"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Kategori dan Skills */}
      <div className="space-y-8 mt-8">
        {/* Daftar Kategori */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Kategori dan Skills</h2>
          <div className="grid gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-cream-200 dark:bg-brown-mid p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{category.title}</h3>
                    <p className="text-sm">Efisiensi: {category.efficiency}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode({ type: 'category', id: category.id })
                        setFormData({
                          ...formData,
                          category: {
                            title: category.title,
                            efficiency: category.efficiency
                          }
                        })
                      }}
                      className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete('category', category.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Skills dalam kategori */}
                <div className="space-y-2">
                  {category.skills?.map((skill) => (
                    <div key={skill.id} className="bg-cream-300 dark:bg-brown-dark p-4 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm space-x-4">
                          <span>Level: {skill.level}%</span>
                          <span>Tipe: {skill.type}</span>
                          {skill.note && <span>Catatan: {skill.note}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMode({ type: 'skill', id: skill.id })
                            setFormData({
                              ...formData,
                              skill: {
                                name: skill.name,
                                level: skill.level,
                                type: skill.type,
                                note: skill.note || '',
                                category_id: skill.category_id
                              }
                            })
                          }}
                          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('skill', skill.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daftar Soft Skills */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Soft Skills</h2>
          <div className="bg-cream-200 dark:bg-brown-mid p-6 rounded-lg">
            <div className="grid gap-4">
              {softSkills.map((skill) => (
                <div key={skill.id} className="bg-cream-300 dark:bg-brown-dark p-4 rounded flex justify-between items-center">
                  <div className="font-medium">{skill.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode({ type: 'soft-skill', id: skill.id })
                        setFormData({
                          ...formData,
                          softSkill: { name: skill.name }
                        })
                      }}
                      className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete('soft-skill', skill.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}