'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Edu = {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl?: string
  imageUrl?: string
  created_at?: string
}

const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbWFxYnJ2d2Jvc2JpbmpyeGVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4OTI1NiwiZXhwIjoyMDc2OTY1MjU2fQ.g8kTWYNtaaNeakqNATVY5M0Dxi7dH8anx2M7ka_g_SU'

export default function AdminEducation() {
  const [items, setItems] = useState<Edu[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Edu, 'id'>>({ title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '' })
  const [uploading, setUploading] = useState(false)

  async function fetchItems() {
    try {
      const res = await fetch('/api/education')
      const json = await res.json()
      setItems(json.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await fetch('/api/education/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceRole: SERVICE_ROLE }) })
      } catch {}
      fetchItems()
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { serviceRole: SERVICE_ROLE, data: form }
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { ...payload, id: editingId } : payload
    const res = await fetch('/api/education', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j.error || 'Failed to save')
      return
    }
    setForm({ title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '' })
    setEditingId(null)
    fetchItems()
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/education?id=${id}&serviceRole=${SERVICE_ROLE}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j.error || 'Failed to delete')
      return
    }
    fetchItems()
  }

  async function uploadImage(file: File) {
    try {
      setUploading(true)
      const ext = file.name.split('.').pop()
      const fileName = `education/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('portfolio').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: pub } = supabase.storage.from('portfolio').getPublicUrl(data.path)
      setForm((f) => ({ ...f, imageUrl: pub.publicUrl }))
    } catch (e: any) {
      alert(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Education' : 'Add Education'}</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <input className="p-2 rounded bg-gray-700 w-full" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
            <p className="text-xs text-gray-300 mt-1">Title: Nama sertifikat/kursus.</p>
          </div>
          <div>
            <input className="p-2 rounded bg-gray-700 w-full" placeholder="Issuer" value={form.issuer} onChange={(e)=>setForm({...form,issuer:e.target.value})} required />
            <p className="text-xs text-gray-300 mt-1">Issuer: Penerbit (mis. Coursera, AWS, Dicoding).</p>
          </div>
          <div>
            <input className="p-2 rounded bg-gray-700 w-full" placeholder="Year" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} required />
            <p className="text-xs text-gray-300 mt-1">Year: Tahun terbit (mis. 2024).</p>
          </div>
          <div>
            <input className="p-2 rounded bg-gray-700 w-full" placeholder="Credential URL (optional)" value={form.credentialUrl||''} onChange={(e)=>setForm({...form,credentialUrl:e.target.value})} />
            <p className="text-xs text-gray-300 mt-1">Credential URL (optional): Link verifikasi sertifikat (jika ada).</p>
          </div>
          <div className="col-span-full">
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(f) uploadImage(f)}} />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-14 rounded" />}
            </div>
            <p className="text-xs text-gray-300 mt-1">Upload Image: Unggah gambar sertifikat/thumbnail.</p>
          </div>
          <div className="col-span-full">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">{editingId? 'Save Changes':'Add'}</button>
            {editingId && <button type="button" className="bg-gray-600 px-4 py-2 rounded" onClick={()=>{setEditingId(null); setForm({ title:'', issuer:'', date:'', credentialUrl:'', imageUrl:'' })}}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Items</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(it=> (
            <div key={it.id} className="bg-gray-700 rounded p-4 flex gap-4 items-start">
              {it.imageUrl && <img src={it.imageUrl} alt={it.title} className="h-16 w-16 object-cover rounded" />}
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-300">{it.issuer} • {it.date}</div>
                {it.credentialUrl && <a className="text-blue-400 text-sm" href={it.credentialUrl} target="_blank">View</a>}
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-blue-600 rounded" onClick={()=>{setEditingId(it.id); setForm({ title:it.title, issuer:it.issuer, date:it.date, credentialUrl:it.credentialUrl, imageUrl:it.imageUrl })}}>Edit</button>
                <button className="px-2 py-1 bg-red-600 rounded" onClick={()=>handleDelete(it.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
