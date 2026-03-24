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

const Header = ({ pageTitle }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <a className="brand" href="/">
        <strong className="brand-title">tmhouse</strong>
        <span className="brand-page">{pageTitle}</span>
      </a>
      <button className="burger" type="button" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Открыть меню">
        <span />
        <span />
        <span />
      </button>
      <nav className={menuOpen ? 'open' : ''}>
        <a href="/about">О нас</a>
        <a href="/catalog">Каталог</a>
        <a className="cta-mini" href="#lead">Заявка</a>
      </nav>
    </header>
  )
}

const SiteFooter = () => (
  <footer className="footer">
    <h3>Контакты</h3>
    <p><strong>ООО «ТМДОМ»</strong> · ИНН 5836897858 · КПП 583601001</p>
    <p>+7 (905) 365-47-39 · +7 (927) 377-54-97</p>
    <p>Пензенская обл., Пензенский район, село Засечное, ул. Механизаторов, 22А</p>
    <small>2023 © Все права защищены. Политика конфиденциальности.</small>
  </footer>
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

const HomePage = () => {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetch('/api/projects?limit=3').then((res) => res.json()).then((payload) => setFeatured(payload.items || []))
  }, [])

  return (
    <main className="home-page">
      <section className="hero-premium">
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2000" alt="Современный модульный дом" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="label dark">ООО «ТМДОМ» · производство в Пензе</span>
          <h1>Модульные дома премиального качества для круглогодичного проживания</h1>
          <p>Проектирование, производство, доставка и монтаж под ключ. Дорабатываем типовые проекты под ваш участок и задачи.</p>
          <div className="actions">
            <a className="btn" href="/catalog">Смотреть проекты</a>
            <a className="btn ghost-dark" href="#lead">Получить консультацию</a>
          </div>
          <div className="hero-trust">
            <span>Производство в Пензе</span>
            <span>Доставка и монтаж</span>
            <span>Проекты с ценами</span>
            <span>Адаптация под клиента</span>
          </div>
        </div>
      </section>

      <section className="split-section">
        <article>
          <h2>Одно-, двух-, трёх- и четырёхмодульные дома</h2>
          <p>Линейка проектов закрывает сценарии от дачного дома до постоянного семейного проживания и арендного бизнеса.</p>
          <div className="module-list">
            <span>01 · Одномодульные</span>
            <span>02 · Двухмодульные</span>
            <span>03 · Трёхмодульные</span>
            <span>04 · Четырёхмодульные</span>
          </div>
        </article>
        <aside>
          <img src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200" alt="Фасад модульного дома" />
        </aside>
      </section>

      <section className="dark-band">
        <div>
          <h2>Почему нам доверяют</h2>
          <p>Собственное производство, реальные построенные объекты, прозрачная стоимость и работа по договору.</p>
        </div>
        <div className="trust-metrics">
          <article><strong>7–14 дней</strong><span>монтаж на участке</span></article>
          <article><strong>1 подрядчик</strong><span>от проекта до запуска</span></article>
          <article><strong>LVL + термодерево</strong><span>стабильная геометрия и долговечность</span></article>
        </div>
      </section>

      <section className="zigzag">
        <article className="zig media"><img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400" alt="Интерьер модульного дома" /></article>
        <article className="zig text">
          <h3>Особенности технологии</h3>
          <p>Сборка модулей в тёплых заводских условиях даёт предсказуемое качество и быстрые сроки на участке без затяжной стройки.</p>
          <ul>
            <li>Всесезонный монтаж и запуск</li>
            <li>Понятный договор и фиксированные этапы</li>
            <li>Продуманные планировки для жизни круглый год</li>
          </ul>
        </article>
        <article className="zig text">
          <h3>Материалы: LVL брус и термодерево</h3>
          <p>Каркас из LVL бруса обеспечивает высокую прочность и геометрическую стабильность, а отделка термодеревом повышает устойчивость к влаге и перепадам температур.</p>
        </article>
        <article className="zig media"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400" alt="Текстура натурального дерева" /></article>
      </section>

      <section className="catalog-preview">
        <header>
          <h2>Каталог проектов</h2>
          <a className="btn ghost" href="/catalog">Открыть весь каталог</a>
        </header>
        <div className="cards-grid">
          {featured.map((item) => <ProjectCard key={item.id} project={item} />)}
        </div>
      </section>

      <section className="workflow">
        <h2>Как проходит работа</h2>
        <div className="workflow-grid">
          {['Заявка', 'Консультация', 'Подбор проекта', 'Согласование изменений', 'Производство', 'Доставка и монтаж'].map((step, i) => (
            <article key={step}><span>{String(i + 1).padStart(2, '0')}</span><p>{step}</p></article>
          ))}
        </div>
      </section>

      <section id="house-request" className="custom-request">
        <div>
          <h2>Понравился дом из интернета?</h2>
          <p>Пришлите изображение — адаптируем проект под модульную технологию и рассчитаем стоимость.</p>
        </div>
        <form className="request-form">
          <input placeholder="Ваше имя*" />
          <input placeholder="Ваш телефон*" />
          <input type="file" accept=".jpg,.png" />
          <small>* Принимаем .jpg/.png до 2 Мб.</small>
          <button className="btn" type="button">Получить подборку проектов</button>
        </form>
      </section>

      <section id="lead" className="lead-grid">
        <LeadForm />
        <aside className="messengers">
          <h3>Быстрая связь</h3>
          <p>Напишите нам в мессенджер — ответим по срокам, цене и комплектациям.</p>
          <a className="messenger tg" href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
          <a className="messenger wa" href="https://wa.me/79053654739" target="_blank" rel="noreferrer">WhatsApp</a>
        </aside>
      </section>

    </main>
  )
}

const CatalogPage = () => {
  const [filters, setFilters] = useState(() => parseQuery(window.location.search))
  const [data, setData] = useState({ items: [], facets: {}, meta: { total: 0, page: 1, totalPages: 1 } })
  const [loading, setLoading] = useState(true)
  const [areaRange, setAreaRange] = useState(() => parseRangeQuery(parseQuery(window.location.search).area, [40, 120]))
  const [priceRange, setPriceRange] = useState(() => parseRangeQuery(parseQuery(window.location.search).price, [2000000, 9000000]))
  const [debouncedQ, setDebouncedQ] = useState(filters.q)
  const [filterOpen, setFilterOpen] = useState(false)

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
      <div className="mobile-filter-trigger">
        <button className="btn ghost" type="button" onClick={() => setFilterOpen((prev) => !prev)}>
          {filterOpen ? 'Скрыть фильтр' : 'Показать фильтр'}
        </button>
      </div>
      <aside className={filterOpen ? 'filters-panel glass open' : 'filters-panel glass'}>
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
        <button type="button" className="close-mobile-filter" onClick={() => setFilterOpen(false)}>Готово</button>

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

const AboutPage = () => (
  <main className="about-page">
    <section className="about-hero">
      <h1>ООО ТМДом — твой модульный дом</h1>
      <p>Мы производим современные качественные деревянные модульные дома и бани круглогодичного использования в г. Пенза с доставкой и монтажом.</p>
    </section>

    <section className="about-grid">
      <article>
        <h2>Александр Осташков</h2>
        <h4>Генеральный директор</h4>
        <p>Современному потребителю не хочется жить годами на стройке и решать сложные строительные вопросы — хочется жить здесь и сейчас, быстро получая готовый результат «под ключ».</p>
        <p>Этим запросам идеально удовлетворяет каркасно-модульное домостроение. Специалисты нашей компании всегда готовы честно рассказать о преимуществах и ограничениях технологии.</p>
      </article>
      <article>
        <h2>Регина Котельникова</h2>
        <h4>Коммерческий директор</h4>
        <p>Проанализировав опыт коллег и различные строительные технологии, мы разработали эффективные конструктивные и планировочные решения, которые выгодно отличают нас от конкурентов.</p>
        <p>Мы тщательно подходим к подбору материалов и комплектующих. При заключении договора вы получаете гарантию качества и прозрачные условия.</p>
      </article>
    </section>

    <section className="about-note">
      <p>На сайте представлены типовые проекты, однако наши архитекторы и дизайнеры готовы внести желаемые корректировки или разработать индивидуальный проект с учётом особенностей модульной технологии.</p>
      <a className="btn" href="/catalog">Перейти в каталог проектов</a>
    </section>
  </main>
)

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
  let pageTitle = 'Главная'
  let page = <HomePage />
  if (path === '/catalog') {
    page = <CatalogPage />
    pageTitle = 'Каталог проектов'
  }
  if (path === '/about') {
    page = <AboutPage />
    pageTitle = 'О компании'
  }
  if (path.startsWith('/projects/')) {
    page = <ProjectPage slug={path.replace('/projects/', '')} />
    pageTitle = 'Карточка проекта'
  }
  if (path === '/admin') {
    page = <AdminPage />
    pageTitle = 'Админ-панель'
  }

  useEffect(() => {
    document.title = `${pageTitle} | TMHouse`
  }, [pageTitle])

  return (
    <>
      <Header pageTitle={pageTitle} />
      {page}
      <SiteFooter />
    </>
  )
}
