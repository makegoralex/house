import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const app = express()
const PORT = Number(process.env.PORT || 3002)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'demo-admin-token'

app.use(express.json({ limit: '2mb' }))

const parseCsvLine = (line) => {
  const result = []
  let current = ''
  let quoted = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        quoted = !quoted
      }
      continue
    }

    if (char === ',' && !quoted) {
      result.push(current)
      current = ''
      continue
    }

    current += char
  }

  result.push(current)
  return result.map((item) => item.trim())
}

const toCsvValue = (value) => {
  const stringValue = String(value ?? '')
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replaceAll('"', '""')}"`
  }
  return stringValue
}

const readJson = async (filePath, fallback) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return fallback
  }
}

const writeJson = async (filePath, payload) => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8')
}

const safeNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const parseRange = (value) => {
  if (!value || typeof value !== 'string' || !value.includes('-')) return null
  const [rawMin, rawMax] = value.split('-')
  const min = safeNumber(rawMin)
  const max = safeNumber(rawMax)
  if (min === null && max === null) return null
  return {
    min: min ?? 0,
    max: max ?? Number.MAX_SAFE_INTEGER,
  }
}

const csvToProjects = (text) => {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line)
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? '']))
    const now = new Date().toISOString()
    const id = row.id || `prj_${Date.now()}_${index}`
    return {
      id,
      slug: row.slug || id,
      title: row.title || row.slug || `Project ${index + 1}`,
      sourceUrl: row.sourceUrl || '',
      status: row.status || 'catalog',
      technology: row.technology || 'karkasno-modulnaya',
      type: row.type || 'dom',
      modulesCount: safeNumber(row.modulesCount),
      roomsCount: safeNumber(row.roomsCount),
      areaTotalM2: safeNumber(row.areaTotalM2) ?? 0,
      areaWarmM2: safeNumber(row.areaWarmM2),
      terraceM2: safeNumber(row.terraceM2),
      hasTerrace: String(row.hasTerrace).toLowerCase() === 'true' || (safeNumber(row.terraceM2) ?? 0) > 0,
      dimensions: row.dimensions || '',
      ceilingHeightMinM: safeNumber(row.ceilingHeightMinM),
      ceilingHeightMaxM: safeNumber(row.ceilingHeightMaxM),
      priceFromRub: safeNumber(row.priceFromRub) ?? 0,
      priceNote: row.priceNote || 'Стоимость зависит от комплектации',
      coverImage: row.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      galleryImages: (row.galleryImages || '').split(',').map((item) => item.trim()).filter(Boolean),
      planImages: (row.planImages || '').split(',').map((item) => item.trim()).filter(Boolean),
      descriptionShort: row.descriptionShort || 'Современный дом для круглогодичного проживания.',
      descriptionFull: row.descriptionFull || '',
      tags: (row.tags || '').split(',').map((item) => item.trim()).filter(Boolean),
      createdAt: row.createdAt || now,
      updatedAt: now,
    }
  })
}

const projectsToCsv = (items) => {
  const headers = [
    'id', 'title', 'slug', 'status', 'technology', 'type', 'areaTotalM2', 'priceFromRub',
    'modulesCount', 'roomsCount', 'tags', 'coverImage', 'galleryImages', 'planImages',
    'hasTerrace', 'sourceUrl', 'descriptionShort', 'descriptionFull', 'createdAt', 'updatedAt'
  ]

  const rows = items.map((item) => headers.map((header) => {
    if (header === 'tags') return toCsvValue((item.tags || []).join(','))
    if (header === 'galleryImages') return toCsvValue((item.galleryImages || []).join(','))
    if (header === 'planImages') return toCsvValue((item.planImages || []).join(','))
    return toCsvValue(item[header] ?? '')
  }).join(','))

  return [headers.join(','), ...rows].join('\n')
}

const ensureData = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const hasProjects = await readJson(PROJECTS_FILE, null)
  if (!hasProjects) {
    const now = new Date().toISOString()
    await writeJson(PROJECTS_FILE, [
      {
        id: 'prj_001',
        slug: 'barus-4m-100',
        title: 'Barus-4M-100',
        sourceUrl: 'https://tmdom.ru/catalog/barus-4m-1.5_65-100',
        status: 'catalog',
        technology: 'karkasno-modulnaya',
        type: 'dvukhetazhnyy',
        modulesCount: 4,
        roomsCount: 4,
        areaTotalM2: 85,
        areaWarmM2: 70.2,
        terraceM2: 25,
        hasTerrace: true,
        dimensions: '11.8 x 6.8 x 6.11',
        ceilingHeightMinM: 2.65,
        ceilingHeightMaxM: 5.4,
        priceFromRub: 5700000,
        priceNote: 'Стоимость зависит от комплектации',
        coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200',
        galleryImages: [
          'https://images.unsplash.com/photo-1600566753056-00f18fb6b3ea?w=1200',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
        ],
        planImages: [
          'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200'
        ],
        descriptionShort: 'Современный модульный дом для круглогодичного проживания.',
        descriptionFull: 'Просторная гостиная-кухня, 4 комнаты, терраса и высокие потолки.',
        tags: ['terrace', 'panorama'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj_002',
        slug: 'arctica-2m-48',
        title: 'Arctica-2M-48',
        sourceUrl: 'https://tmdom.ru/catalog',
        status: 'catalog',
        technology: 'karkas',
        type: 'odnoetazhnyy',
        modulesCount: 2,
        roomsCount: 2,
        areaTotalM2: 48,
        areaWarmM2: 40,
        terraceM2: 8,
        hasTerrace: true,
        dimensions: '8.2 x 5.9 x 3.2',
        ceilingHeightMinM: 2.6,
        ceilingHeightMaxM: 2.8,
        priceFromRub: 3200000,
        priceNote: 'Стоимость зависит от комплектации',
        coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
        galleryImages: [
          'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200'
        ],
        planImages: [],
        descriptionShort: 'Компактный энергоэффективный дом с быстрой сборкой.',
        descriptionFull: 'Оптимален под дачу и аренду, в том числе для глэмпинга.',
        tags: ['terrace', 'for-rent'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj_003',
        slug: 'brus-neo-120',
        title: 'Brus Neo 120',
        sourceUrl: 'https://tmdom.ru/catalog',
        status: 'built',
        technology: 'kleenyy-brus',
        type: 'dvukhetazhnyy',
        modulesCount: 4,
        roomsCount: 5,
        areaTotalM2: 120,
        areaWarmM2: 95,
        terraceM2: 0,
        hasTerrace: false,
        dimensions: '10.6 x 9.8 x 6.1',
        ceilingHeightMinM: 2.7,
        ceilingHeightMaxM: 5,
        priceFromRub: 8900000,
        priceNote: 'Стоимость зависит от комплектации',
        coverImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200',
        galleryImages: [],
        planImages: [],
        descriptionShort: 'Дом из клеёного бруса для семьи с детьми.',
        descriptionFull: 'Большая кухня-гостиная, мастер-спальня и кабинет.',
        tags: ['smart-home'],
        createdAt: now,
        updatedAt: now,
      }
    ])
  }

  const hasLeads = await readJson(LEADS_FILE, null)
  if (!hasLeads) {
    await writeJson(LEADS_FILE, [])
  }
}

const listProjects = async () => readJson(PROJECTS_FILE, [])

const saveProjects = async (items) => {
  await writeJson(PROJECTS_FILE, items)
}

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  return next()
}

const computeFacets = (items) => {
  const bucket = {
    technology: new Map(),
    type: new Map(),
    tags: new Map(),
    rooms: new Map(),
    status: new Map(),
  }

  items.forEach((item) => {
    bucket.technology.set(item.technology, (bucket.technology.get(item.technology) || 0) + 1)
    bucket.type.set(item.type, (bucket.type.get(item.type) || 0) + 1)
    bucket.status.set(item.status, (bucket.status.get(item.status) || 0) + 1)
    if (item.roomsCount != null) {
      const roomValue = item.roomsCount >= 4 ? '4+' : String(item.roomsCount)
      bucket.rooms.set(roomValue, (bucket.rooms.get(roomValue) || 0) + 1)
    }
    ;(item.tags || []).forEach((tag) => {
      bucket.tags.set(tag, (bucket.tags.get(tag) || 0) + 1)
    })
  })

  return Object.fromEntries(
    Object.entries(bucket).map(([key, map]) => [
      key,
      Array.from(map.entries()).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
    ])
  )
}

const applyFilters = (items, query) => {
  const technologies = (query.technology || '').split(',').map((item) => item.trim()).filter(Boolean)
  const types = (query.type || '').split(',').map((item) => item.trim()).filter(Boolean)
  const tags = (query.tags || '').split(',').map((item) => item.trim()).filter(Boolean)
  const statuses = (query.status || '').split(',').map((item) => item.trim()).filter(Boolean)
  const rooms = (query.rooms || '').split(',').map((item) => item.trim()).filter(Boolean)
  const q = String(query.q || '').toLowerCase().trim()
  const area = parseRange(query.area)
  const price = parseRange(query.price)

  return items.filter((item) => {
    if (technologies.length > 0 && !technologies.includes(item.technology)) return false
    if (types.length > 0 && !types.includes(item.type)) return false
    if (tags.length > 0 && !tags.every((tag) => (item.tags || []).includes(tag))) return false
    if (statuses.length > 0 && !statuses.includes(item.status)) return false
    if (rooms.length > 0) {
      const roomValue = item.roomsCount >= 4 ? '4+' : String(item.roomsCount)
      if (!rooms.includes(roomValue)) return false
    }
    if (query.hasTerrace === 'true' && !item.hasTerrace) return false
    if (query.hasTerrace === 'false' && item.hasTerrace) return false
    if (area && (item.areaTotalM2 < area.min || item.areaTotalM2 > area.max)) return false
    if (price && (item.priceFromRub < price.min || item.priceFromRub > price.max)) return false
    if (q && !`${item.title} ${item.slug}`.toLowerCase().includes(q)) return false
    return true
  })
}

const applySort = (items, sort, q) => {
  const list = [...items]
  switch (sort) {
    case 'price_asc':
      return list.sort((a, b) => a.priceFromRub - b.priceFromRub)
    case 'price_desc':
      return list.sort((a, b) => b.priceFromRub - a.priceFromRub)
    case 'area_asc':
      return list.sort((a, b) => a.areaTotalM2 - b.areaTotalM2)
    case 'area_desc':
      return list.sort((a, b) => b.areaTotalM2 - a.areaTotalM2)
    case 'newest':
      return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    case 'relevance':
      if (q) {
        return list.sort((a, b) => a.title.toLowerCase().indexOf(q) - b.title.toLowerCase().indexOf(q))
      }
      return list
    default:
      return list
  }
}

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/projects', async (req, res) => {
  const allProjects = await listProjects()
  const filtered = applyFilters(allProjects, req.query)
  const sort = String(req.query.sort || (req.query.q ? 'relevance' : 'newest'))
  const sorted = applySort(filtered, sort, String(req.query.q || '').toLowerCase())

  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.max(1, Number(req.query.limit || 12))
  const offset = (page - 1) * limit

  const paged = sorted.slice(offset, offset + limit)

  res.json({
    meta: {
      page,
      limit,
      total: sorted.length,
      totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
      sort,
      appliedFilters: req.query,
    },
    facets: computeFacets(filtered),
    items: paged,
  })
})

app.get('/api/projects/:slug', async (req, res) => {
  const allProjects = await listProjects()
  const project = allProjects.find((item) => item.slug === req.params.slug)
  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }

  const similar = allProjects
    .filter((item) => item.slug !== project.slug)
    .sort((a, b) => Math.abs((a.areaTotalM2 || 0) - (project.areaTotalM2 || 0)) - Math.abs((b.areaTotalM2 || 0) - (project.areaTotalM2 || 0)))
    .slice(0, 3)

  return res.json({ ...project, similar })
})

app.get('/api/facets', async (req, res) => {
  const projects = await listProjects()
  res.json(computeFacets(projects))
})

app.post('/api/leads', async (req, res) => {
  const { name, phone, comment = '', projectId = null } = req.body || {}
  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' })
  }

  const leads = await readJson(LEADS_FILE, [])
  const payload = {
    id: `lead_${Date.now()}`,
    name: String(name),
    phone: String(phone),
    comment: String(comment),
    projectId,
    createdAt: new Date().toISOString(),
  }
  leads.push(payload)
  await writeJson(LEADS_FILE, leads)
  return res.status(201).json({ ok: true, lead: payload })
})

app.post('/api/admin/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ token: ADMIN_TOKEN, user: { username } })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
  const projects = await listProjects()
  res.json({ items: projects })
})

app.post('/api/admin/projects', authenticateAdmin, async (req, res) => {
  const payload = req.body || {}
  const projects = await listProjects()
  const now = new Date().toISOString()
  const item = {
    id: payload.id || `prj_${Date.now()}`,
    slug: payload.slug || `project-${Date.now()}`,
    title: payload.title || 'Новый проект',
    sourceUrl: payload.sourceUrl || '',
    status: payload.status || 'catalog',
    technology: payload.technology || 'karkasno-modulnaya',
    type: payload.type || 'dom',
    modulesCount: safeNumber(payload.modulesCount),
    roomsCount: safeNumber(payload.roomsCount),
    areaTotalM2: safeNumber(payload.areaTotalM2) || 0,
    areaWarmM2: safeNumber(payload.areaWarmM2),
    terraceM2: safeNumber(payload.terraceM2),
    hasTerrace: Boolean(payload.hasTerrace),
    dimensions: payload.dimensions || '',
    ceilingHeightMinM: safeNumber(payload.ceilingHeightMinM),
    ceilingHeightMaxM: safeNumber(payload.ceilingHeightMaxM),
    priceFromRub: safeNumber(payload.priceFromRub) || 0,
    priceNote: payload.priceNote || 'Стоимость зависит от комплектации',
    coverImage: payload.coverImage || '',
    galleryImages: Array.isArray(payload.galleryImages) ? payload.galleryImages : [],
    planImages: Array.isArray(payload.planImages) ? payload.planImages : [],
    descriptionShort: payload.descriptionShort || '',
    descriptionFull: payload.descriptionFull || '',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    createdAt: now,
    updatedAt: now,
  }

  projects.push(item)
  await saveProjects(projects)
  return res.status(201).json(item)
})

app.put('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const projects = await listProjects()
  const index = projects.findIndex((item) => item.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Project not found' })

  const previous = projects[index]
  const payload = req.body || {}
  const next = {
    ...previous,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  projects[index] = next
  await saveProjects(projects)
  return res.json(next)
})

app.delete('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const projects = await listProjects()
  const next = projects.filter((item) => item.id !== req.params.id)
  if (next.length === projects.length) {
    return res.status(404).json({ error: 'Project not found' })
  }
  await saveProjects(next)
  return res.status(204).send()
})

app.post('/api/admin/projects/import', authenticateAdmin, async (req, res) => {
  const format = String(req.query.format || 'json').toLowerCase()
  const body = req.body?.content
  if (!body) {
    return res.status(400).json({ error: 'content is required' })
  }

  let imported = []
  if (format === 'json') {
    imported = JSON.parse(body)
  } else if (format === 'csv') {
    imported = csvToProjects(body)
  } else {
    return res.status(400).json({ error: 'Unsupported format' })
  }

  if (!Array.isArray(imported)) {
    return res.status(400).json({ error: 'import payload should be an array' })
  }

  await saveProjects(imported)
  return res.json({ ok: true, count: imported.length })
})

app.get('/api/admin/projects/export', authenticateAdmin, async (req, res) => {
  const format = String(req.query.format || 'json').toLowerCase()
  const projects = await listProjects()

  if (format === 'json') {
    return res.json({ content: JSON.stringify(projects, null, 2) })
  }

  if (format === 'csv') {
    return res.json({ content: projectsToCsv(projects) })
  }

  return res.status(400).json({ error: 'Unsupported format' })
})

app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

ensureData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
