import { MetadataRoute } from 'next'

const SITE_URL = 'https://chups-portofolio.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-22T00:00:00.000Z')

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pengalaman`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sertifikasi`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
