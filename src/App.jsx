import { useEffect, useMemo, useState } from 'react'

const numberFormat = new Intl.NumberFormat('ru-RU')

const parseQuery = (search) => {
  const params = new URLSearchParams(search)
  return {
    technology: params.get('technology') || '',
    type: params.get('type') || '',
    tags: params.get('tags') || '',
    rooms: params.get('rooms') || '',
    status: params.get('status') || '',
    area: params.get('area') || '',
    price: params.get('price') || '',
    hasTerrace: params.get('hasTerrace') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || 'newest',
    page: Number(params.get('page') || 1),
    limit: Number(params.get('limit') || 12),
  }
}

const buildQuery = (filters) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value == null) return
    if (typeof value === 'number' && Number.isNaN(value)) return
    params.set(key, String(value))
  })
  return params.toString()
}

const FilterGroup = ({ title, items, value, onChange }) => {
  const selected = value ? value.split(',').filter(Boolean) : []
  const toggle = (itemValue) => {
    const next = selected.includes(itemValue)
      ? selected.filter((item) => item !== itemValue)
      : [...selected, itemValue]
    onChange(next.join(','))
  }

  return (
    <div className="filter-group">
      <h4>{title}</h4>
      <div className="chips">
        {items.map((item) => (
          <button
            type="button"
            key={item.value}
            className={selected.includes(item.value) ? 'chip active' : 'chip'}
            onClick={() => toggle(item.value)}
          >
            {item.value} ({item.count})
          </button>
        ))}
      </div>
    </div>
  )
}

const LeadForm = ({ projectId = null }) => {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' })
  const [status, setStatus] = useState('idle')

  const submit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, projectId }),
    })

    setStatus(response.ok ? 'success' : 'error')
    if (response.ok) {
      setForm({ name: '', phone: '', comment: '' })
    }
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <h3>Оставить заявку</h3>
      <input
        aria-label="Имя"
        placeholder="Ваше имя"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <input
        aria-label="Телефон"
        placeholder="Телефон"
        value={form.phone}
        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
      />
      <textarea
        aria-label="Комментарий"
        placeholder="Комментарий"
        value={form.comment}
        onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
      />
      <button type="submit" disabled={status === 'loading'}>Отправить</button>
      {status === 'success' && <p className="success">Спасибо! Мы свяжемся с вами.</p>}
      {status === 'error' && <p className="error">Ошибка отправки. Попробуйте ещё раз.</p>}
    </form>
  )
}

const ProjectCard = ({ project }) => (
  <article className="card">
    <img src={project.coverImage} alt={project.title} loading="lazy" />
    <div className="card-content">
      <h3><a href={`/projects/${project.slug}`}>{project.title}</a></h3>
      <p>{project.areaTotalM2} м² • {project.modulesCount || '—'} модуля • {project.roomsCount || '—'} комнаты</p>
      <strong>от {numberFormat.format(project.priceFromRub)} ₽</strong>
    </div>
  </article>
)

const HomePage = () => (
  <main>
    <section className="hero">
      <h1>Демо-сайт каталога модульных домов</h1>
      <p>Подберите проект по площади, цене и характеристикам. Оставьте заявку в 1 клик.</p>
      <div className="actions">
        <a className="btn" href="/catalog">Подобрать проект</a>
        <a className="btn ghost" href="#lead">Получить консультацию</a>
      </div>
    </section>

    <section className="grid-3">
      <div><h3>Одномодульные</h3><p>Компактные решения для дачи и аренды.</p></div>
      <div><h3>Двухмодульные</h3><p>Баланс цены и функциональности.</p></div>
      <div><h3>Четырёхмодульные</h3><p>Семейные дома с террасами.</p></div>
    </section>

    <section className="grid-3 muted">
      <div><h3>Преимущества</h3><p>Быстрый монтаж, фиксированные сроки, прозрачная смета.</p></div>
      <div><h3>Как работаем</h3><p>Подбор проекта → договор → производство → монтаж.</p></div>
      <div><h3>FAQ</h3><p>5–8 ответов на ключевые вопросы клиента.</p></div>
    </section>

    <section id="lead">
      <LeadForm />
    </section>
  </main>
)

const CatalogPage = () => {
  const [filters, setFilters] = useState(() => parseQuery(window.location.search))
  const [data, setData] = useState({ items: [], facets: {}, meta: { total: 0, page: 1, totalPages: 1 } })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const nextQuery = buildQuery(filters)
    window.history.replaceState({}, '', `/catalog?${nextQuery}`)
    setLoading(true)

    fetch(`/api/projects?${nextQuery}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [filters])

  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }))

  const showing = useMemo(() => data.items.length, [data.items])

  return (
    <main className="catalog-layout">
      <aside className="filters">
        <h2>Фильтр</h2>
        <input
          placeholder="Поиск по названию"
          value={filters.q}
          onChange={(e) => update({ q: e.target.value })}
        />

        <FilterGroup title="Технология" items={data.facets.technology || []} value={filters.technology} onChange={(value) => update({ technology: value })} />
        <FilterGroup title="Тип" items={data.facets.type || []} value={filters.type} onChange={(value) => update({ type: value })} />
        <FilterGroup title="Теги" items={data.facets.tags || []} value={filters.tags} onChange={(value) => update({ tags: value })} />

        <div className="filter-group">
          <h4>Площадь (м²)</h4>
          <input placeholder="например: 40-120" value={filters.area} onChange={(e) => update({ area: e.target.value })} />
        </div>

        <div className="filter-group">
          <h4>Цена (₽)</h4>
          <input placeholder="например: 2000000-7000000" value={filters.price} onChange={(e) => update({ price: e.target.value })} />
        </div>

        <div className="filter-group">
          <h4>Сортировка</h4>
          <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="newest">Сначала новые</option>
            <option value="price_asc">Цена по возрастанию</option>
            <option value="price_desc">Цена по убыванию</option>
            <option value="area_asc">Площадь по возрастанию</option>
            <option value="area_desc">Площадь по убыванию</option>
          </select>
        </div>

        <button
          type="button"
          className="btn ghost"
          onClick={() => setFilters({
            technology: '', type: '', tags: '', rooms: '', status: '', area: '', price: '', hasTerrace: '', q: '', sort: 'newest', page: 1, limit: 12,
          })}
        >
          Сбросить всё
        </button>
      </aside>

      <section>
        <header className="catalog-head">
          <h1>Каталог проектов</h1>
          <p>Найдено: {data.meta.total} • Показано: {showing}</p>
        </header>

        {loading && <p>Загрузка...</p>}
        {!loading && data.items.length === 0 && (
          <div className="empty">
            <p>0 проектов по выбранным фильтрам.</p>
            <button className="btn" type="button" onClick={() => update({ area: '', price: '', technology: '', type: '', tags: '' })}>Расширить диапазон</button>
          </div>
        )}

        <div className="cards-grid">
          {data.items.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>

        {data.meta.page < data.meta.totalPages && (
          <button className="btn show-more" type="button" onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}>
            Показать ещё
          </button>
        )}
      </section>
    </main>
  )
}

const ProjectPage = ({ slug }) => {
  const [project, setProject] = useState(null)

  useEffect(() => {
    fetch(`/api/projects/${slug}`).then((res) => res.json()).then(setProject)
  }, [slug])

  if (!project) return <main><p>Загрузка проекта...</p></main>

  return (
    <main className="project-page">
      <section className="project-hero">
        <img src={project.coverImage} alt={project.title} />
        <div>
          <h1>{project.title}</h1>
          <p>{project.descriptionShort}</p>
          <ul>
            <li>Площадь: {project.areaTotalM2} м²</li>
            <li>Модули: {project.modulesCount || '—'}</li>
            <li>Комнаты: {project.roomsCount || '—'}</li>
            <li>Технология: {project.technology}</li>
            <li>Цена от: {numberFormat.format(project.priceFromRub)} ₽</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>О проекте</h2>
        <p>{project.descriptionFull}</p>
      </section>

      <section>
        <h2>Похожие проекты</h2>
        <div className="cards-grid">
          {(project.similar || []).map((item) => <ProjectCard key={item.id} project={item} />)}
        </div>
      </section>

      <LeadForm projectId={project.id} />
    </main>
  )
}

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [projects, setProjects] = useState([])
  const [auth, setAuth] = useState({ username: 'admin', password: 'admin123' })
  const [editor, setEditor] = useState(null)

  const load = () => {
    fetch('/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((payload) => setProjects(payload.items || []))
  }

  useEffect(() => {
    if (token) load()
  }, [token])

  const login = async (event) => {
    event.preventDefault()
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auth),
    })
    const payload = await response.json()
    if (payload.token) {
      localStorage.setItem('adminToken', payload.token)
      setToken(payload.token)
    }
  }

  const save = async () => {
    const method = editor.id ? 'PUT' : 'POST'
    const endpoint = editor.id ? `/api/admin/projects/${editor.id}` : '/api/admin/projects'
    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...editor, tags: (editor.tags || '').split(',').map((x) => x.trim()).filter(Boolean) }),
    })
    setEditor(null)
    load()
  }

  const remove = async (id) => {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  const doExport = async (format) => {
    const response = await fetch(`/api/admin/projects/export?format=${format}`, { headers: { Authorization: `Bearer ${token}` } })
    const payload = await response.json()
    alert(payload.content)
  }

  const doImport = async (format) => {
    const content = prompt(`Вставьте ${format.toUpperCase()} контент`) || ''
    if (!content) return
    await fetch(`/api/admin/projects/import?format=${format}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
    load()
  }

  if (!token) {
    return (
      <main>
        <h1>Admin Login</h1>
        <form className="lead-form" onSubmit={login}>
          <input value={auth.username} onChange={(e) => setAuth((p) => ({ ...p, username: e.target.value }))} />
          <input type="password" value={auth.password} onChange={(e) => setAuth((p) => ({ ...p, password: e.target.value }))} />
          <button type="submit">Войти</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <header className="admin-head">
        <h1>Админка проектов</h1>
        <div>
          <button className="btn" onClick={() => setEditor({ title: '', slug: '', areaTotalM2: 0, priceFromRub: 0, technology: 'karkasno-modulnaya', type: 'dom', status: 'catalog', tags: '' })}>Новый проект</button>
          <button className="btn ghost" onClick={() => doExport('json')}>Export JSON</button>
          <button className="btn ghost" onClick={() => doExport('csv')}>Export CSV</button>
          <button className="btn ghost" onClick={() => doImport('json')}>Import JSON</button>
          <button className="btn ghost" onClick={() => doImport('csv')}>Import CSV</button>
        </div>
      </header>

      {editor && (
        <div className="editor">
          <input placeholder="Название" value={editor.title} onChange={(e) => setEditor((p) => ({ ...p, title: e.target.value }))} />
          <input placeholder="Slug" value={editor.slug} onChange={(e) => setEditor((p) => ({ ...p, slug: e.target.value }))} />
          <input placeholder="Площадь" value={editor.areaTotalM2} onChange={(e) => setEditor((p) => ({ ...p, areaTotalM2: Number(e.target.value) }))} />
          <input placeholder="Цена" value={editor.priceFromRub} onChange={(e) => setEditor((p) => ({ ...p, priceFromRub: Number(e.target.value) }))} />
          <input placeholder="Теги (через запятую)" value={editor.tags} onChange={(e) => setEditor((p) => ({ ...p, tags: e.target.value }))} />
          <button className="btn" onClick={save}>Сохранить</button>
          <button className="btn ghost" onClick={() => setEditor(null)}>Отмена</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr><th>Название</th><th>Статус</th><th>Площадь</th><th>Цена</th><th>Теги</th><th /></tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.status}</td>
              <td>{project.areaTotalM2} м²</td>
              <td>{numberFormat.format(project.priceFromRub)} ₽</td>
              <td>{(project.tags || []).join(', ')}</td>
              <td>
                <button onClick={() => setEditor({ ...project, tags: (project.tags || []).join(', ') })}>Edit</button>
                <button onClick={() => remove(project.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

const Header = () => (
  <header className="topbar">
    <a href="/">Demo House</a>
    <nav>
      <a href="/catalog">Каталог</a>
      <a href="/admin">Админка</a>
    </nav>
  </header>
)

export default function App() {
  const path = window.location.pathname
  let page = <HomePage />

  if (path === '/catalog') page = <CatalogPage />
  if (path.startsWith('/projects/')) page = <ProjectPage slug={path.replace('/projects/', '')} />
  if (path === '/admin') page = <AdminPage />

  return (
    <>
      <Header />
      {page}
    </>
  )
}
