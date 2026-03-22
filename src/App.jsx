import { useEffect, useState } from 'react'

const numberFormat = new Intl.NumberFormat('ru-RU')

const FILTER_DEFAULTS = {
  technology: '',
  type: '',
  tags: '',
  rooms: '',
  status: '',
  area: '',
  price: '',
  hasTerrace: '',
  q: '',
  sort: 'newest',
  page: 1,
  limit: 12,
}

const RANGE_LIMITS = {
  area: { min: 20, max: 180, step: 1 },
  price: { min: 1000000, max: 15000000, step: 100000 },
}

const parseQuery = (search) => {
  const params = new URLSearchParams(search)
  return {
    ...FILTER_DEFAULTS,
    technology: params.get('technology') || '',
    type: params.get('type') || '',
    tags: params.get('tags') || '',
    rooms: params.get('rooms') || '',
    status: params.get('status') || '',
    area: params.get('area') || '',
    price: params.get('price') || '',
    hasTerrace: params.get('hasTerrace') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || FILTER_DEFAULTS.sort,
    page: Number(params.get('page') || FILTER_DEFAULTS.page),
    limit: Number(params.get('limit') || FILTER_DEFAULTS.limit),
  }
}

const parseRangeQuery = (value, fallback) => {
  if (!value?.includes('-')) return fallback
  const [minRaw, maxRaw] = value.split('-')
  const min = Number(minRaw)
  const max = Number(maxRaw)
  if (Number.isNaN(min) || Number.isNaN(max)) return fallback
  return [min, max]
}

const buildQuery = (filters) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value == null) return
    params.set(key, String(value))
  })
  return params.toString()
}

const slugLabelMap = {
  'karkasno-modulnaya': 'Каркасно-модульная',
  karkas: 'Каркасная',
  'kleenyy-brus': 'Клеёный брус',
  kombinirovannyy: 'Комбинированная',
  odnoetazhnyy: 'Одноэтажный',
  dvukhetazhnyy: 'Двухэтажный',
  dom: 'Дом',
  banya: 'Баня',
  terrace: 'Терраса',
  panorama: 'Панорамные окна',
  'smart-home': 'Умный дом',
  'for-rent': 'Для аренды',
  catalog: 'В каталоге',
  built: 'Реализован',
}

const humanize = (value) => slugLabelMap[value] || value.replaceAll('-', ' ')

const formatPrice = (value) => `${numberFormat.format(value)} ₽`

const Header = () => (
  <header className="topbar glass">
    <a className="brand" href="/">
      <span className="brand-logo">TM</span>
      <span>
        <strong>TM House</strong>
        <small>Каталог модульных домов</small>
      </span>
    </a>
    <nav>
      <a href="/catalog">Каталог</a>
      <a href="/admin">Админка</a>
      <a className="cta-mini" href="#lead">Заявка</a>
    </nav>
  </header>
)

const FilterChips = ({ title, items, value, onChange }) => {
  const selected = value ? value.split(',').filter(Boolean) : []

  const toggle = (next) => {
    const updated = selected.includes(next)
      ? selected.filter((item) => item !== next)
      : [...selected, next]
    onChange(updated.join(','))
  }

  return (
    <section className="filter-section">
      <h4>{title}</h4>
      <div className="chips">
        {items.map((item) => (
          <button
            type="button"
            key={item.value}
            className={selected.includes(item.value) ? 'chip active' : 'chip'}
            onClick={() => toggle(item.value)}
          >
            {humanize(item.value)} <span>{item.count}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

const DualRange = ({ label, min, max, step, value, onChange, isPrice = false }) => {
  const [start, end] = value
  const updateStart = (next) => {
    const parsed = Number(next)
    if (parsed >= end) return
    onChange([parsed, end])
  }
  const updateEnd = (next) => {
    const parsed = Number(next)
    if (parsed <= start) return
    onChange([start, parsed])
  }

  return (
    <section className="filter-section">
      <h4>{label}</h4>
      <div className="range-values">
        <strong>{isPrice ? formatPrice(start) : `${start} м²`}</strong>
        <strong>{isPrice ? formatPrice(end) : `${end} м²`}</strong>
      </div>
      <div className="dual-range">
        <input type="range" min={min} max={max} step={step} value={start} onChange={(e) => updateStart(e.target.value)} />
        <input type="range" min={min} max={max} step={step} value={end} onChange={(e) => updateEnd(e.target.value)} />
      </div>
    </section>
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
    if (response.ok) setForm({ name: '', phone: '', comment: '' })
  }

  return (
    <form className="lead-form glass" onSubmit={submit}>
      <h3>Получить консультацию</h3>
      <p>Оставьте контакт — сделаем подборку проектов и расчёт стоимости.</p>
      <input placeholder="Ваше имя" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
      <input placeholder="Телефон" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
      <textarea rows={3} placeholder="Комментарий" value={form.comment} onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))} />
      <button type="submit" className="btn" disabled={status === 'loading'}>Отправить заявку</button>
      {status === 'success' && <p className="success">Спасибо! Заявка отправлена.</p>}
      {status === 'error' && <p className="error">Не удалось отправить форму.</p>}
    </form>
  )
}

const ProjectCard = ({ project }) => (
  <article className="project-card glass">
    <img src={project.coverImage} alt={project.title} loading="lazy" />
    <div className="project-card-content">
      <div className="badge-row">
        <span>{humanize(project.type)}</span>
        <span>{humanize(project.technology)}</span>
      </div>
      <h3><a href={`/projects/${project.slug}`}>{project.title}</a></h3>
      <p>{project.areaTotalM2} м² · {project.modulesCount || '—'} мод. · {project.roomsCount || '—'} комн.</p>
      <strong>от {formatPrice(project.priceFromRub)}</strong>
    </div>
  </article>
)

const HomePage = () => (
  <main>
    <section className="hero glass">
      <div>
        <span className="label">ООО «ТМДОМ»</span>
        <h1>Модульные дома высокого качества для круглогодичного проживания под ключ</h1>
        <p>Производим и монтируем современные дома в короткие сроки: от компактных одномодульных до просторных четырёхмодульных решений.</p>
        <div className="actions">
          <a className="btn" href="/catalog">Подобрать проект</a>
          <a className="btn ghost" href="#house-request">Рассчитать стоимость</a>
        </div>
      </div>
      <div className="hero-stats">
        <div><strong>7–14 дней</strong><span>Монтаж на участке</span></div>
        <div><strong>4 формата</strong><span>1 / 2 / 3 / 4 модуля</span></div>
        <div><strong>LVL + термодерево</strong><span>Прочность и стабильность</span></div>
      </div>
    </section>

    <section className="value-grid">
      <div className="glass"><img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900" alt="Одномодульный дом" /><h3>Одномодульные</h3><p>Компактные решения для дачи и глэмпингов.</p></div>
      <div className="glass"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900" alt="Двухмодульный дом" /><h3>Двухмодульные</h3><p>Баланс площади и бюджета для семьи 2–4 человека.</p></div>
      <div className="glass"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900" alt="Трёхмодульный дом" /><h3>Трёхмодульные</h3><p>Комфорт для круглогодичного проживания.</p></div>
      <div className="glass"><img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900" alt="Четырёхмодульный дом" /><h3>Четырёхмодульные</h3><p>Максимальная площадь, приватность и комфорт.</p></div>
    </section>

    <section className="infographics">
      <article className="glass block">
        <h2>Особенности технологии</h2>
        <p>Скепсис к модульным домам уходит, потому что технология даёт измеримые преимущества: скорость, предсказуемость и качество заводской сборки.</p>
        <div className="info-row">
          <div><strong>Скорость строительства</strong><span>Сборка в тёплых заводских условиях и быстрый монтаж на участке без долгой стройки.</span></div>
          <div><strong>Всесезонный монтаж</strong><span>Можно заезжать и праздновать новоселье в любое время года.</span></div>
          <div><strong>Контроль качества</strong><span>Единый подрядчик, фиксированные этапы и прозрачные сроки.</span></div>
        </div>
      </article>

      <article className="glass block">
        <h2>Наши преимущества</h2>
        <ul className="icon-list">
          <li>Никакой стройки на вашем участке</li>
          <li>Качество производства и эстетика дома</li>
          <li>Всесезонность поставки и скорость монтажа</li>
          <li>Многообразие планировок и мобильность дома</li>
          <li>Мы для вас — единственный подрядчик</li>
          <li>Отделка термодеревом от ООО «ТМДерево»</li>
        </ul>
      </article>
    </section>

    <section className="infographics">
      <article className="glass block">
        <h2>Применение</h2>
        <div className="steps">
          <div><span>1</span><p>Для турбаз и глэмпингов</p></div>
          <div><span>2</span><p>Для дачного участка</p></div>
          <div><span>3</span><p>Для постоянного проживания и аренды</p></div>
        </div>
        <p><strong>Дом по цене голых стен студии.</strong></p>
      </article>
      <article className="glass block">
        <h2>Почему LVL брус?</h2>
        <p>Каркас из LVL бруса обеспечивает максимальную геометрическую стабильность дома. Прочность LVL в 1.5–3 раза выше, чем у клеёного бруса.</p>
        <p>Термодерево в отделке — 100% натуральный материал с повышенной долговечностью и устойчивостью к влажности, плесени и перепадам температур.</p>
      </article>
    </section>

    <section id="house-request" className="glass block custom-request">
      <div>
        <h2>Понравился дом из интернета?</h2>
        <p>Пришлите изображение — построим его для вас с адаптацией под модульную технологию.</p>
      </div>
      <form className="request-form">
        <input placeholder="Ваше имя*" />
        <input placeholder="Ваш телефон*" />
        <input type="file" accept=".jpg,.png" />
        <small>* Принимаем .jpg/.png до 2 Мб. Отправляя форму, вы соглашаетесь с обработкой данных.</small>
        <button className="btn" type="button">Отправить</button>
      </form>
    </section>

    <section id="lead">
      <LeadForm />
    </section>

    <footer className="glass footer">
      <h3>Контакты</h3>
      <p><strong>ООО «ТМДОМ»</strong></p>
      <p>ИНН 5836897858 · КПП 583601001</p>
      <p>+7 (905) 365-47-39 · +7 (927) 377-54-97</p>
      <p>Пензенская обл., Пензенский район, село Засечное, ул. Механизаторов, 22А</p>
      <small>2023 © Все права защищены. Политика конфиденциальности.</small>
    </footer>
  </main>
)

const CatalogPage = () => {
  const [filters, setFilters] = useState(() => parseQuery(window.location.search))
  const [data, setData] = useState({ items: [], facets: {}, meta: { total: 0, page: 1, totalPages: 1 } })
  const [loading, setLoading] = useState(true)
  const [areaRange, setAreaRange] = useState(() => parseRangeQuery(parseQuery(window.location.search).area, [40, 120]))
  const [priceRange, setPriceRange] = useState(() => parseRangeQuery(parseQuery(window.location.search).price, [2000000, 9000000]))
  const [debouncedQ, setDebouncedQ] = useState(filters.q)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(filters.q.trim()), 350)
    return () => clearTimeout(timer)
  }, [filters.q])

  useEffect(() => {
    const controller = new AbortController()
    const next = {
      ...filters,
      q: debouncedQ,
      area: `${areaRange[0]}-${areaRange[1]}`,
      price: `${priceRange[0]}-${priceRange[1]}`,
    }
    const query = buildQuery(next)
    window.history.replaceState({}, '', `/catalog?${query}`)
    setLoading(true)

    fetch(`/api/projects?${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [filters, areaRange, priceRange, debouncedQ])

  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }))

  return (
    <main className="catalog-layout">
      <aside className="filters-panel glass">
        <div className="filters-head">
          <h2>Умный фильтр</h2>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setFilters(FILTER_DEFAULTS)
              setAreaRange([40, 120])
              setPriceRange([2000000, 9000000])
            }}
          >
            Сбросить
          </button>
        </div>

        <input className="search" placeholder="Поиск по названию" value={filters.q} onChange={(e) => update({ q: e.target.value })} />
        <DualRange label="Площадь" min={RANGE_LIMITS.area.min} max={RANGE_LIMITS.area.max} step={RANGE_LIMITS.area.step} value={areaRange} onChange={setAreaRange} />
        <DualRange label="Цена" min={RANGE_LIMITS.price.min} max={RANGE_LIMITS.price.max} step={RANGE_LIMITS.price.step} value={priceRange} onChange={setPriceRange} isPrice />

        <FilterChips title="Технология" items={data.facets.technology || []} value={filters.technology} onChange={(value) => update({ technology: value })} />
        <FilterChips title="Тип объекта" items={data.facets.type || []} value={filters.type} onChange={(value) => update({ type: value })} />
        <FilterChips title="Особенности" items={data.facets.tags || []} value={filters.tags} onChange={(value) => update({ tags: value })} />

        <section className="filter-section">
          <h4>Сортировка</h4>
          <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="newest">Сначала новые</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="area_asc">Площадь ↑</option>
            <option value="area_desc">Площадь ↓</option>
          </select>
        </section>
      </aside>

      <section>
        <header className="catalog-head glass">
          <div>
            <h1>Каталог проектов</h1>
            <p>{data.meta.total} проектов по вашим параметрам</p>
          </div>
          <button className="btn" type="button">Показать {data.items.length} проектов</button>
        </header>

        {loading && <div className="glass block">Загрузка проектов…</div>}

        {!loading && data.items.length === 0 && (
          <div className="glass block empty">
            <h3>Ничего не найдено</h3>
            <p>Попробуйте расширить диапазон площади и цены или очистить фильтр.</p>
            <button className="btn" onClick={() => setFilters(FILTER_DEFAULTS)}>Сбросить фильтры</button>
          </div>
        )}

        <div className="cards-grid">
          {data.items.map((item) => <ProjectCard key={item.id} project={item} />)}
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

  if (!project) return <main><div className="glass block">Загрузка проекта…</div></main>

  return (
    <main className="project-page">
      <section className="project-hero glass">
        <img src={project.coverImage} alt={project.title} />
        <div>
          <h1>{project.title}</h1>
          <p>{project.descriptionShort}</p>
          <ul>
            <li>Площадь: {project.areaTotalM2} м²</li>
            <li>Модули: {project.modulesCount || '—'}</li>
            <li>Комнаты: {project.roomsCount || '—'}</li>
            <li>Технология: {humanize(project.technology)}</li>
            <li>Цена от: {formatPrice(project.priceFromRub)}</li>
          </ul>
        </div>
      </section>

      <section className="glass block"><h2>О проекте</h2><p>{project.descriptionFull}</p></section>

      <section>
        <h2>Похожие проекты</h2>
        <div className="cards-grid">{(project.similar || []).map((item) => <ProjectCard key={item.id} project={item} />)}</div>
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
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(auth),
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
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...editor, tags: (editor.tags || '').split(',').map((x) => x.trim()).filter(Boolean) }),
    })
    setEditor(null)
    load()
  }

  if (!token) {
    return (
      <main>
        <form className="lead-form glass" onSubmit={login}>
          <h2>Вход в админку</h2>
          <input value={auth.username} onChange={(e) => setAuth((p) => ({ ...p, username: e.target.value }))} />
          <input type="password" value={auth.password} onChange={(e) => setAuth((p) => ({ ...p, password: e.target.value }))} />
          <button className="btn" type="submit">Войти</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <header className="catalog-head glass"><h1>Админка проектов</h1><button className="btn" onClick={() => setEditor({ title: '', slug: '', areaTotalM2: 0, priceFromRub: 0, tags: '' })}>Новый</button></header>
      {editor && (
        <div className="editor glass block">
          <input placeholder="Название" value={editor.title} onChange={(e) => setEditor((p) => ({ ...p, title: e.target.value }))} />
          <input placeholder="Slug" value={editor.slug} onChange={(e) => setEditor((p) => ({ ...p, slug: e.target.value }))} />
          <input placeholder="Площадь" value={editor.areaTotalM2} onChange={(e) => setEditor((p) => ({ ...p, areaTotalM2: Number(e.target.value) }))} />
          <input placeholder="Цена" value={editor.priceFromRub} onChange={(e) => setEditor((p) => ({ ...p, priceFromRub: Number(e.target.value) }))} />
          <input placeholder="Теги" value={editor.tags} onChange={(e) => setEditor((p) => ({ ...p, tags: e.target.value }))} />
          <button className="btn" onClick={save}>Сохранить</button>
        </div>
      )}
      <table className="admin-table glass">
        <thead><tr><th>Название</th><th>Площадь</th><th>Цена</th><th>Теги</th><th /></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.areaTotalM2} м²</td>
              <td>{formatPrice(project.priceFromRub)}</td>
              <td>{(project.tags || []).join(', ')}</td>
              <td><button onClick={() => setEditor({ ...project, tags: (project.tags || []).join(', ') })}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

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
