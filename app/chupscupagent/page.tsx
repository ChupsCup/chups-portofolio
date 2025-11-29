'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { setupProfilePhotosTable, setupStorageBucket, setupExperiencesTable } from '@/lib/setupDatabase'
import RichTextEditor from '@/components/RichTextEditor'
import AdminSkills from '@/components/AdminSkills'
import AdminEducation from '@/components/AdminEducation'

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

interface ProfilePhoto {
  id: number
  photo_url: string
  created_at: string
}

interface Experience {
  id: number
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  is_current: boolean
  technologies: string[]
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [capsOn, setCapsOn] = useState(false)
  const passRef = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [profilePhotos, setProfilePhotos] = useState<ProfilePhoto[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingExpId, setEditingExpId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupMessage, setSetupMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'profile' | 'experience' | 'about' | 'skills' | 'education' | 'hero'>('dashboard')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: ''
  })
  const [expFormData, setExpFormData] = useState({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    technologies: ''
  })

  // Auth check via localStorage token & optional auto setup
  useEffect(() => {
    const ok = typeof window !== 'undefined' && localStorage.getItem('admin_auth') === 'true'
    // Support force logout via query ?logout=1
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('logout') === '1') {
        localStorage.removeItem('admin_auth')
      }
    }
    if (ok) {
      setIsAuthenticated(true)
      setAuthChecked(true)
      const setup = async () => {
        try {
          console.log('Setting up database and storage...')

          // Call API to setup database and bucket
          const response = await fetch('/api/setup-database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'Samsungj7' })
          })

          if (response.ok) {
            const data = await response.json()
            console.log('Setup result:', data)
          } else {
            console.log('Setup API not available, trying client-side setup...')
            await setupProfilePhotosTable()
            await setupStorageBucket()
          }
        } catch (error) {
          console.error('Setup error:', error)
          console.log('Continuing without setup...')
        }

        // Try to setup experiences table
        try {
          await setupExperiencesTable()
        } catch (error) {
          console.log('Could not setup experiences table:', error)
        }

        fetchProjects()
        fetchProfilePhotos()
        fetchExperiences()
        // Setup about table silently
        try { await fetch('/api/setup-about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'Samsungj7' }) }) } catch {}
      }

      setup()
    } else {
      setAuthChecked(true)
    }
  }, [])

  // Shortcut: Ctrl/Cmd + K to focus password when login screen
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isAuthenticated && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        passRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isAuthenticated])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      const VALID = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Samsungj7')
      if (password === VALID) {
        localStorage.setItem('admin_auth', 'true')
        setIsAuthenticated(true)
        // After login, trigger initial loads
        fetchProjects()
        fetchProfilePhotos()
        fetchExperiences()
      } else {
        setAuthError('Password salah')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth')
      setIsAuthenticated(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.warn('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProfilePhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Silently handle table not found error
        if (error.code === 'PGRST116' || error.message?.includes('relation')) {
          console.log('profile_photos table not found yet')
          setProfilePhotos([])
          return
        }
        throw error
      }
      setProfilePhotos(data || [])
    } catch (error) {
      console.warn('Error fetching profile photos:', error)
      setProfilePhotos([])
    }
  }

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        // Silently handle table not found error
        const errorMsg = error.message || JSON.stringify(error)
        if (
          error.code === 'PGRST116' ||
          errorMsg.includes('relation') ||
          errorMsg.includes('does not exist') ||
          errorMsg.includes('404')
        ) {
          console.log('experiences table not found yet - this is normal if not set up')
          setExperiences([])
          return
        }
        throw error
      }
      setExperiences(data || [])
    } catch (error) {
      console.log('Error fetching experiences (table may not be created yet):', error)
      setExperiences([])
    }
  }

  // ABOUT CRUD
  const [aboutForm, setAboutForm] = useState({
    name: '',
    location: '',
    education: '',
    email: '',
    phone: '',
    status: '',
    cv_url: '',
  })
  const [aboutId, setAboutId] = useState<number | null>(null)

  const [aboutContentForm, setAboutContentForm] = useState({
    title_prefix: '',
    highlight: '',
    para1: '',
    para2: '',
    points: ''
  })

  const fetchAbout = async () => {
    try {
      // Try load from Storage JSON first (only about fields + about_content)
      try {
        const { data: file, error: fileErr } = await supabase.storage.from('portfolio').download('about/about.json')
        if (!fileErr && file) {
          const text = await file.text()
          const json = JSON.parse(text)
          setAboutId(json.id || null)
          setAboutForm({
            name: json.name || '',
            location: json.location || '',
            education: json.education || '',
            email: json.email || '',
            phone: json.phone || '',
            status: json.status || '',
            cv_url: json.cv_url || ''
          })
          if (json.about_content) {
            const c = json.about_content
            setAboutContentForm({
              title_prefix: c.title_prefix || aboutContentForm.title_prefix,
              highlight: c.highlight || aboutContentForm.highlight,
              para1: c.para1 || '',
              para2: c.para2 || '',
              points: Array.isArray(c.points) ? c.points.join('\n') : (c.points || ''),
            })
          } else if (json.hero) {
            const h = json.hero
            setAboutContentForm({
              title_prefix: h.title_prefix || aboutContentForm.title_prefix,
              highlight: h.highlight || aboutContentForm.highlight,
              para1: h.para1 || aboutContentForm.para1,
              para2: h.para2 || aboutContentForm.para2,
              points: Array.isArray(h.points) ? h.points.join('\n') : (h.points || aboutContentForm.points),
            })
          }
          return
        }
      } catch {}

      const { data, error } = await supabase.from('about_info').select('*').order('created_at', { ascending: false }).limit(1)
      if (!error && data && data.length > 0) {
        const a = data[0] as any
        setAboutId(a.id)
        setAboutForm({ name: a.name, location: a.location, education: a.education, email: a.email, phone: a.phone, status: a.status, cv_url: a.cv_url || '' })
      }
    } catch {}
  }

  // Load Hero content from Storage for Hero tab
  const fetchHero = async () => {
    try {
      const { data: file, error: fileErr } = await supabase.storage.from('portfolio').download('hero/hero.json')
      if (!fileErr && file) {
        const text = await file.text()
        const json = JSON.parse(text)
        setHeroForm({
          title_prefix: json.title_prefix || "Hi, I'm fahri yusuf",
          highlight: json.highlight || 'Developer',
          para1: json.para1 || 'I build beautiful and functional web applications. Passionate about creating great user experiences with modern technologies.',
          para2: json.para2 || '',
          points: Array.isArray(json.points) ? json.points.join('\n') : (json.points || 'Full Stack Developer\nFrontend Enthusiast\nUI Motion Addict'),
        })
      }
    } catch {}
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('File harus PDF')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran maksimal 10MB')
      return
    }
    try {
      const timestamp = Date.now()
      const filePath = `cv/cv-${timestamp}.pdf`
      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)
      setAboutForm({ ...aboutForm, cv_url: data.publicUrl })
      alert('CV berhasil diupload!')
    } catch (error) {
      console.error(error)
      alert('Gagal upload CV. Pastikan bucket "portfolio" tersedia dan public.')
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
      setPreviewImage(null)
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
    setPreviewImage(project.image_url)
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

  const handleSetupStorage = async () => {
    setSetupLoading(true)
    setSetupMessage(null)
    try {
      // Coba upload file test ke bucket untuk verify
      const testFileName = `.test-${Date.now()}.txt`
      const testContent = new Blob(['test'], { type: 'text/plain' })

      console.log('Testing bucket upload...')
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('portfolio')
        .upload(testFileName, testContent, {
          cacheControl: '3600',
          upsert: false,
        })

      console.log('Upload result:', { uploadError, uploadData })

      if (uploadError) {
        const errorMsg = uploadError.message || JSON.stringify(uploadError)
        console.error('Upload error:', errorMsg)

        if (errorMsg.includes('not found') || errorMsg.includes('404')) {
          setSetupMessage('⚠️ Bucket "portfolio" tidak ditemukan.\n\nSilakan:\n1. Buka https://supabase.com\n2. Storage → New bucket\n3. Nama: portfolio\n4. Centang "Public bucket"\n5. Create')
        } else if (errorMsg.includes('policy') || errorMsg.includes('permission') || errorMsg.includes('403')) {
          setSetupMessage('⚠️ RLS Policy belum benar.\n\nSilakan:\n1. Buka bucket "portfolio" di Supabase\n2. Klik "Policies"\n3. Pastikan ada policy untuk INSERT\n4. Atau disable RLS sementara untuk test')
        } else {
          setSetupMessage(`⚠️ Error: ${errorMsg}`)
        }
      } else {
        // Delete test file
        console.log('Deleting test file...')
        await supabase.storage.from('portfolio').remove([testFileName])
        setSetupMessage('✅ Bucket "portfolio" sudah ada dan siap digunakan untuk upload foto!')
      }
    } catch (error) {
      console.error('Setup error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setSetupMessage(`⚠️ Error: ${errorMsg}`)
    } finally {
      setSetupLoading(false)
    }
  }

  const handleSetupExperiencesTable = async () => {
    setSetupLoading(true)
    setSetupMessage(null)
    try {
      console.log('Setting up experiences table...')

      // Call API endpoint directly
      const response = await fetch('/api/create-experiences-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'Samsungj7' })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Setup response:', data)
        setSetupMessage('✅ Experiences table berhasil dibuat! Silakan refresh halaman dan coba add experience.')
        // Refresh experiences list
        setTimeout(() => {
          fetchExperiences()
        }, 1000)
      } else {
        const errorData = await response.json()
        console.log('Setup failed:', errorData)
        setSetupMessage('⚠️ Tidak bisa auto-create table.\n\nSilakan:\n1. Buka file SETUP_EXPERIENCES.md\n2. Copy SQL query\n3. Buka Supabase Dashboard → SQL Editor → New Query\n4. Paste SQL → Run')
      }
    } catch (error) {
      console.error('Setup error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setSetupMessage(`⚠️ Error: ${errorMsg}\n\nSilakan setup table secara manual via SETUP_EXPERIENCES.md`)
    } finally {
      setSetupLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Format file harus PNG, JPG, GIF, atau WebP')
      return
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name}`
      const filePath = `projects/${fileName}`

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      const imageUrl = data.publicUrl

      // Set preview dan update form data
      setPreviewImage(imageUrl)
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }))

      alert('Foto berhasil diupload!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const createProfilePhotosTableIfNotExists = async () => {
    try {
      // Try to query the table
      const { error } = await supabase
        .from('profile_photos')
        .select('id')
        .limit(1)

      if (error && (error.code === 'PGRST116' || error.message?.includes('relation'))) {
        // Table doesn't exist, try to create it via API
        console.log('Creating profile_photos table via API...')

        try {
          const response = await fetch('/api/setup-database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'Samsungj7' })
          })

          if (response.ok) {
            const data = await response.json()
            console.log('Table creation result:', data)
            if (data.tableCreated) {
              console.log('✅ Table created successfully!')
              return true
            }
          }
        } catch (apiError) {
          console.log('API setup not available, table needs manual creation')
        }

        console.log('Table does not exist and could not be auto-created')
        return false
      }

      if (error) {
        console.error('Error checking table:', error)
        return false
      }

      console.log('✅ Table exists')
      return true
    } catch (error) {
      console.error('Error checking table:', error)
      return false
    }
  }

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Format file harus PNG, JPG, GIF, atau WebP')
      return
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    try {
      // Check if table exists
      const tableExists = await createProfilePhotosTableIfNotExists()
      if (!tableExists) {
        const setupSQL = `CREATE TABLE IF NOT EXISTS profile_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON profile_photos;
CREATE POLICY "Allow public read" ON profile_photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON profile_photos;
CREATE POLICY "Allow authenticated insert" ON profile_photos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete" ON profile_photos;
CREATE POLICY "Allow authenticated delete" ON profile_photos
  FOR DELETE USING (true);`

        throw new Error(`Table "profile_photos" belum dibuat.\n\n📋 SETUP INSTRUCTIONS:\n1. Buka Supabase Dashboard\n2. Klik SQL Editor → New Query\n3. Copy-paste SQL di bawah:\n\n${setupSQL}\n\n4. Klik Run\n5. Refresh halaman ini`)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `profile-${timestamp}-${file.name}`
      const filePath = `profile/${fileName}`

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file)

      if (uploadError) {
        const errorMsg = uploadError.message || JSON.stringify(uploadError)
        if (errorMsg.includes('not found') || errorMsg.includes('404')) {
          throw new Error('Bucket "portfolio" tidak ditemukan.\n\nSilakan:\n1. Buka Supabase Dashboard\n2. Storage → New bucket\n3. Nama: portfolio\n4. Centang "Public bucket"\n5. Create')
        }
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      const photoUrl = data.publicUrl

      // Save ke database
      const { error: dbError } = await supabase
        .from('profile_photos')
        .insert([{ photo_url: photoUrl }])

      if (dbError) {
        const errorMsg = dbError.message || JSON.stringify(dbError)
        if (errorMsg.includes('relation') || errorMsg.includes('profile_photos')) {
          throw new Error('Table "profile_photos" belum dibuat.\n\nSilakan:\n1. Buka Supabase Dashboard\n2. SQL Editor → New Query\n3. Copy-paste SQL dari SETUP_PROFILE_PHOTOS.md\n4. Klik Run')
        }
        throw dbError
      }

      alert('Foto profile berhasil diupload!')
      fetchProfilePhotos()
      setPreviewImage(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error uploading profile photo:', error)
      alert(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProfilePhoto = async (id: number) => {
    if (!confirm('Yakin ingin menghapus foto profile ini?')) return

    try {
      const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Foto profile berhasil dihapus!')
      fetchProfilePhotos()
    } catch (error) {
      console.error('Error deleting profile photo:', error)
      alert('Error deleting profile photo')
    }
  }

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const technologiesArray = expFormData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    try {
      if (editingExpId) {
        // Update
        const { error } = await supabase
          .from('experiences')
          .update({
            company: expFormData.company,
            position: expFormData.position,
            description: expFormData.description,
            start_date: expFormData.start_date,
            end_date: expFormData.is_current ? null : expFormData.end_date,
            is_current: expFormData.is_current,
            technologies: technologiesArray
          })
          .eq('id', editingExpId)

        if (error) throw error
        alert('Experience berhasil diupdate!')
        setEditingExpId(null)
      } else {
        // Create
        const { error } = await supabase
          .from('experiences')
          .insert([{
            company: expFormData.company,
            position: expFormData.position,
            description: expFormData.description,
            start_date: expFormData.start_date,
            end_date: expFormData.is_current ? null : expFormData.end_date,
            is_current: expFormData.is_current,
            technologies: technologiesArray
          }])

        if (error) throw error
        alert('Experience berhasil ditambahkan!')
      }

      setExpFormData({
        company: '',
        position: '',
        description: '',
        start_date: '',
        end_date: '',
        is_current: false,
        technologies: ''
      })
      fetchExperiences()
    } catch (error) {
      console.error('Error saving experience:', error)
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.log('Full error object:', error)

      if (errorMsg.includes('relation') || errorMsg.includes('does not exist') || errorMsg.includes('PGRST205') || errorMsg.includes('PGRST116')) {
        alert('❌ Table "experiences" belum dibuat atau ada issue dengan schema cache!\n\nSilakan:\n1. Klik button "💼 Setup Experiences" di atas\n2. Tunggu sampai selesai\n3. Refresh halaman\n4. Coba add experience lagi')
      } else if (errorMsg.includes('policy') || errorMsg.includes('permission') || errorMsg.includes('403')) {
        alert('❌ RLS Policy error!\n\nSilakan:\n1. Buka Supabase Dashboard\n2. Cek RLS policies di table "experiences"\n3. Pastikan policies sudah benar')
      } else {
        alert(`Error saving experience: ${errorMsg}`)
      }
    }
  }

  const handleEditExperience = (exp: Experience) => {
    setEditingExpId(exp.id)
    setExpFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      technologies: exp.technologies.join(', ')
    })
  }

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Yakin ingin menghapus experience ini?')) return

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Experience berhasil dihapus!')
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Error deleting experience')
    }
  }

  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden text-cream-100">
        {/* Solid dark background */}
        <div className="absolute inset-0 -z-10 bg-[#0b1020]" />

        <div className="px-4 py-16 md:py-24 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="mb-6 text-center select-none">
              <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-accent/90" />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Login</h1>
              <p className="text-sm text-cream-300/80 mt-1">Masuk untuk mengelola konten</p>
            </div>
            {/* Matte card */}
            <div className={`rounded-2xl border border-white/10 bg-[#10131a] p-6 md:p-7 ${authError ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (authError) setAuthError('') }}
                      onKeyUp={(e) => setCapsOn((e as any).getModifierState && (e as any).getModifierState('CapsLock'))}
                      ref={passRef}
                      className="w-full pr-24 pl-4 py-2 rounded-lg bg-[#0f1220] border border-white/10 placeholder:text-cream-300/60 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v=>!v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/5"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    {capsOn && (
                      <span className="absolute right-16 top-1/2 -translate-y-1/2 text-[11px] px-2 py-0.5 rounded border border-yellow-400/30 text-yellow-300">Caps</span>
                    )}
                  </div>
                </div>

                {authError && <div className="text-sm text-red-400">{authError}</div>}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="group w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white border border-accent/60 hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/60 active:scale-[0.99] transition disabled:opacity-60"
                  aria-label="Masuk ke admin"
                >
                  <span>{authLoading ? 'Masuk...' : 'Masuk'}</span>
                  <svg className="h-4 w-4 opacity-90 group-hover:translate-x-0.5 transition" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>

              <div className="mt-6 text-xs text-center text-cream-300/70">© {new Date().getFullYear()} Admin • Panel</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-cream-100">
      {/* Solid dark background (no glass/orbs) */}
      <div className="fixed inset-0 -z-10 bg-[#0b1020]" />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">{activeTab === 'dashboard' ? '📊 Admin Dashboard' : '🔐 Admin Panel'}</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-md border border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        {setupMessage && (
          <div className={`p-4 rounded-2xl mb-8 whitespace-pre-wrap border ${setupMessage.includes('✅') ? 'border-green-400/30 bg-green-400/5 text-green-200' : 'border-yellow-400/30 bg-yellow-400/5 text-yellow-100'}`}>
            {setupMessage}
          </div>
        )}

        {/* Quick Nav (mobile) */}
        <div className="mb-6 md:mb-8 md:hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { key: 'projects', label: 'Projects', icon: '📁' },
              { key: 'experience', label: 'Experience', icon: '💼' },
              { key: 'hero', label: 'Hero', icon: '⚡' },
              { key: 'about', label: 'About', icon: '🧾' },
              { key: 'education', label: 'Education', icon: '🎓' },
              { key: 'skills', label: 'Skills', icon: '🛠' },
              { key: 'profile', label: 'Photos', icon: '👤' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => { if(item.key==='about'){ setActiveTab('about'); fetchAbout(); } else if(item.key==='hero'){ setActiveTab('hero'); fetchHero(); } else { setActiveTab(item.key as any) } }}
                className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-full border transition flex items-center justify-center gap-2 text-sm md:text-[0.95rem] ${
                  activeTab === (item.key as any)
                    ? 'bg-accent text-white border-accent'
                    : 'border-white/10 text-cream-300/85 hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop layout with sidebar */}
        <div className="hidden md:flex gap-6">
          <aside className="w-56 shrink-0 space-y-2">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { key: 'projects', label: 'Projects', icon: '📁' },
              { key: 'experience', label: 'Experience', icon: '💼' },
              { key: 'hero', label: 'Hero', icon: '⚡' },
              { key: 'about', label: 'About', icon: '🧾' },
              { key: 'education', label: 'Education', icon: '🎓' },
              { key: 'skills', label: 'Skills', icon: '🛠' },
              { key: 'profile', label: 'Photos', icon: '👤' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => { if(item.key==='about'){ setActiveTab('about'); fetchAbout(); } else if(item.key==='hero'){ setActiveTab('hero'); fetchHero(); } else { setActiveTab(item.key as any) } }}
                className={`w-full px-4 py-2 rounded-full border text-left transition flex items-center gap-2 ${
                  activeTab === (item.key as any)
                    ? 'bg-accent text-white border-accent'
                    : 'border-white/10 text-cream-300/85 hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </aside>
          <div className="flex-1">
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">Projects</div>
              <div className="mt-2 text-3xl font-extrabold">{projects.length}</div>
              <button onClick={() => setActiveTab('projects')} className="mt-4 text-sm text-accent hover:underline">Kelola Projects →</button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">Experiences</div>
              <div className="mt-2 text-3xl font-extrabold">{experiences.length}</div>
              <button onClick={() => setActiveTab('experience')} className="mt-4 text-sm text-accent hover:underline">Kelola Experience →</button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">Profile Photos</div>
              <div className="mt-2 text-3xl font-extrabold">{profilePhotos.length}</div>
              <button onClick={() => setActiveTab('profile')} className="mt-4 text-sm text-accent hover:underline">Kelola Photos →</button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">About</div>
              <div className="mt-2 text-3xl font-extrabold">—</div>
              <button onClick={() => { setActiveTab('about'); fetchAbout() }} className="mt-4 text-sm text-accent hover:underline">Kelola About →</button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">Education</div>
              <div className="mt-2 text-3xl font-extrabold">—</div>
              <button onClick={() => setActiveTab('education')} className="mt-4 text-sm text-accent hover:underline">Kelola Education →</button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#10131a] p-5">
              <div className="text-sm text-cream-300/70">Skills</div>
              <div className="mt-2 text-3xl font-extrabold">—</div>
              <button onClick={() => setActiveTab('skills')} className="mt-4 text-sm text-accent hover:underline">Kelola Skills →</button>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="rounded-2xl border border-white/5 bg-[#10131a] p-6 mb-8">
            <AdminEducation />
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="rounded-2xl border border-white/5 bg-[#10131a] p-6 mb-8">
            <AdminSkills />
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
        <>
        {/* Form */}
        <div className="rounded-2xl border border-white/5 bg-[#10131a] p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-[#0f1220] border border-white/10 text-cream-100 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="Describe your project in detail...&#10;&#10;💡 Tips:&#10;• Use bullet points for features&#10;• Press Enter for new lines&#10;• Be specific about technologies used"
              rows={6}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload Foto Project (PNG, JPG, GIF, WebP)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-2 rounded-lg bg-[#0f1220] border border-white/10 text-cream-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {uploading && <p className="text-yellow-400">Uploading...</p>}
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img src={previewImage} alt="Preview" className="w-full max-w-xs h-auto rounded" />
                </div>
              )}
            </div>

            <input
              type="url"
              placeholder="Image URL (atau gunakan upload di atas)"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-cream-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="url"
              placeholder="Demo URL"
              value={formData.demo_url}
              onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-cream-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.github_url}
              onChange={(e) => setFormData({...formData, github_url: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-cream-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-cream-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)]"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setPreviewImage(null)
                    setFormData({
                      title: '',
                      description: '',
                      image_url: '',
                      demo_url: '',
                      github_url: '',
                      technologies: ''
                    })
                  }}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20"
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
                <div key={project.id} className="rounded-2xl border border-white/5 bg-[#10131a] p-4 flex gap-4 justify-between items-start">
                  {/* Image Preview */}
                  {project.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="text-cream-300/80 whitespace-pre-line">{project.description}</div>
                    <p className="text-sm text-cream-300/60 mt-2">
                      Tech: {project.technologies.join(', ')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {/* Profile Photo Tab */}
        {activeTab === 'profile' && (
        <>
        {/* Setup Instructions */}
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 mb-8">
          <p className="text-blue-100 text-sm mb-3">
            <strong>⚠️ Setup Required (First Time Only):</strong> Buka Supabase Dashboard → SQL Editor → New Query → Copy-paste SQL di bawah → Run
          </p>
          <button
            onClick={() => {
              const sql = `CREATE TABLE IF NOT EXISTS profile_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON profile_photos;
CREATE POLICY "Allow public read" ON profile_photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON profile_photos;
CREATE POLICY "Allow authenticated insert" ON profile_photos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete" ON profile_photos;
CREATE POLICY "Allow authenticated delete" ON profile_photos
  FOR DELETE USING (true);`
              navigator.clipboard.writeText(sql)
              alert('✅ SQL copied to clipboard! Paste di Supabase SQL Editor')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition"
          >
            📋 Copy SQL Setup
          </button>
        </div>

        {/* Upload Profile Photo Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Profile Photo</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pilih Foto Profile (PNG, JPG, GIF, WebP)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleProfilePhotoUpload}
                disabled={uploading}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white cursor-pointer"
              />
              {uploading && <p className="text-yellow-400">Uploading...</p>}
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Photos List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile Photos ({profilePhotos.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : profilePhotos.length === 0 ? (
            <p className="text-gray-400">Belum ada foto profile. Upload foto pertama Anda!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profilePhotos.map((photo) => (
                <div key={photo.id} className="bg-gray-800 p-4 rounded-lg">
                  <img
                    src={photo.photo_url}
                    alt="Profile"
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                  <p className="text-sm text-gray-400 mb-4">
                    {new Date(photo.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <button
                    onClick={() => handleDeleteProfilePhoto(photo.id)}
                    className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
        <>
        {/* Add/Edit Experience Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">{editingExpId ? 'Edit Experience' : 'Add New Experience'}</h2>
          <form onSubmit={handleExperienceSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={expFormData.company}
              onChange={(e) => setExpFormData({...expFormData, company: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={expFormData.position}
              onChange={(e) => setExpFormData({...expFormData, position: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              required
            />
            <RichTextEditor
              label="Description"
              value={expFormData.description}
              onChange={(value) => setExpFormData({...expFormData, description: value})}
              placeholder="Describe your work experience in detail...&#10;&#10;💡 Tips:&#10;• List your key achievements&#10;• Use bullet points for responsibilities&#10;• Include specific metrics/results&#10;• Press Enter for new lines"
              rows={6}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Start Date"
                value={expFormData.start_date}
                onChange={(e) => setExpFormData({...expFormData, start_date: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="date"
                placeholder="End Date"
                value={expFormData.end_date}
                onChange={(e) => setExpFormData({...expFormData, end_date: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                disabled={expFormData.is_current}
              />
            </div>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={expFormData.is_current}
                onChange={(e) => setExpFormData({...expFormData, is_current: e.target.checked})}
                className="w-4 h-4"
              />
              Currently working here
            </label>
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={expFormData.technologies}
              onChange={(e) => setExpFormData({...expFormData, technologies: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                {editingExpId ? 'Update' : 'Create'}
              </button>
              {editingExpId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpId(null)
                    setExpFormData({
                      company: '',
                      position: '',
                      description: '',
                      start_date: '',
                      end_date: '',
                      is_current: false,
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

        {/* Experiences List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Experiences ({experiences.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : experiences.length === 0 ? (
            <p className="text-gray-400">Belum ada experience. Tambahkan experience pertama Anda!</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                      <p className="text-blue-400 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(exp.start_date).toLocaleDateString('id-ID')} -{' '}
                      {exp.is_current ? 'Present' : new Date(exp.end_date || '').toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className="text-gray-300 mb-3 whitespace-pre-line">{exp.description}</div>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 text-sm rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditExperience(exp)}
                      className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
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
        </>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
        <>
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Edit About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Nama' },
              { key: 'location', label: 'Domisili' },
              { key: 'education', label: 'Pendidikan' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'status', label: 'Status' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm text-gray-300">{label}</label>
                <input
                  type="text"
                  value={(aboutForm as any)[key]}
                  onChange={(e) => setAboutForm({ ...aboutForm, [key]: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">CV URL</label>
              <input
                type="url"
                value={aboutForm.cv_url}
                onChange={(e) => setAboutForm({ ...aboutForm, cv_url: e.target.value })}
                placeholder="https://.../cv.pdf"
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>

            {/* About Content */}
            <div className="md:col-span-2 border-t border-white/10 pt-4" />
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Judul About</label>
              <input
                type="text"
                value={aboutContentForm.title}
                onChange={(e) => setAboutContentForm({ ...aboutContentForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Paragraf 1 (About)</label>
              <textarea
                rows={3}
                value={aboutContentForm.para1}
                onChange={(e) => setAboutContentForm({ ...aboutContentForm, para1: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Paragraf 2 (About)</label>
              <textarea
                rows={3}
                value={aboutContentForm.para2}
                onChange={(e) => setAboutContentForm({ ...aboutContentForm, para2: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Poin About (satu per baris)</label>
              <textarea
                rows={4}
                value={aboutContentForm.points}
                onChange={(e) => setAboutContentForm({ ...aboutContentForm, points: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={async () => {
                try {
                  // Save About JSON (with about_content), hero saved in its own tab
                  const about_content = {
                    title_prefix: aboutContentForm.title_prefix,
                    highlight: aboutContentForm.highlight,
                    para1: aboutContentForm.para1,
                    para2: aboutContentForm.para2,
                    points: aboutContentForm.points.split('\n').map(s=>s.trim()).filter(Boolean),
                  }
                  const payload = { ...aboutForm, about_content }
                  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                  const { error: uploadError } = await supabase.storage.from('portfolio').upload('about/about.json', blob, { upsert: true })
                  if (uploadError) throw uploadError

                  // Also try to persist to DB if available (best-effort)
                  try {
                    if (aboutId) {
                      await supabase.from('about_info').update(aboutForm).eq('id', aboutId)
                    } else {
                      await supabase.from('about_info').insert([aboutForm])
                    }
                  } catch {}

                  alert('About saved!')
                } catch (e) {
                  console.error(e)
                  alert('Failed to save About')
                } finally {
                  fetchAbout()
                }
              }}
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => { setAboutId(null); setAboutForm({ name: '', location: '', education: '', email: '', phone: '', status: '', cv_url: '' }); setAboutContentForm({ title_prefix: '', highlight: '', para1: '', para2: '', points: '' }); }}
              className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Clear
            </button>
            <label className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-green-700 rounded hover:bg-green-800 cursor-pointer">
              <input type="file" accept="application/pdf" className="hidden" onChange={handleCvUpload} />
              Upload CV (PDF)
            </label>
          </div>
        </div>
        </>
        )}

        {/* Hero Tab */}
        {activeTab === 'hero' && (
        <>
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Edit Hero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm text-gray-300">Judul (prefix)</label>
              <input
                type="text"
                value={heroForm.title_prefix}
                onChange={(e) => setHeroForm({ ...heroForm, title_prefix: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm text-gray-300">Kata highlight</label>
              <input
                type="text"
                value={heroForm.highlight}
                onChange={(e) => setHeroForm({ ...heroForm, highlight: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Paragraf 1</label>
              <textarea
                rows={3}
                value={heroForm.para1}
                onChange={(e) => setHeroForm({ ...heroForm, para1: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Paragraf 2</label>
              <textarea
                rows={3}
                value={heroForm.para2}
                onChange={(e) => setHeroForm({ ...heroForm, para2: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-gray-300">Poin (satu per baris)</label>
              <textarea
                rows={4}
                value={heroForm.points}
                onChange={(e) => setHeroForm({ ...heroForm, points: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={async () => {
                try {
                  const payload = {
                    title_prefix: heroForm.title_prefix,
                    highlight: heroForm.highlight,
                    para1: heroForm.para1,
                    para2: heroForm.para2,
                    points: heroForm.points.split('\n').map(s => s.trim()).filter(Boolean),
                  }
                  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                  const { error: uploadError } = await supabase.storage.from('portfolio').upload('hero/hero.json', blob, { upsert: true })
                  if (uploadError) throw uploadError
                  alert('Hero saved!')
                } catch (e) {
                  console.error(e)
                  alert('Failed to save Hero')
                } finally {
                  fetchHero()
                }
              }}
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setHeroForm({
                title_prefix: "Hello! I'm a",
                highlight: 'passionate developer',
                para1: "I'm a full-stack developer with a passion for creating beautiful and functional web applications.",
                para2: "I specialize in building responsive, user-friendly applications using the latest technologies like React, Next.js, TypeScript, and more. I'm always eager to learn new technologies and improve my skills.",
                points: 'Clean & Maintainable Code\nResponsive Design\nPerformance Optimization\nModern Best Practices'
              })}
              className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
        </>
        )}
      </div>
      </div>
      </div>
    </div>
  )
}

