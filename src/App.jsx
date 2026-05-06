import { useMemo, useState } from 'react'

const stats = ['2 дня', '20+ кейсов', '300+ участников', '∞ идей']
const navItems = ['О хакатоне', 'Кейсы', 'Программа', 'Участники', 'Партнеры']

const landingVariants = [
  {
    id: 'dark-interface',
    tab: 'Вариант 1 — Темный интерфейс',
    cardTitle: 'Темный интерфейс города',
    mood: 'Статусно, технологично',
    description: 'Интерфейс управления городской системой: темная карта, узлы, маршруты и акцент на технологичность.',
    whatChoose: 'Выбираем основу главного экрана, плотную сетку, статусные карточки TEAM/CASE/ROUTE/SOLUTION и сильный “дорогой” тон.',
    strengths: 'Лучший вариант для основного сайта и партнерской презентации.',
    risks: 'Может восприниматься мрачновато без светлых пауз.',
    recommendedFor: 'Основной лендинг и официальная коммуникация.',
    previewClass: 'preview-dark',
  },
  {
    id: 'light-interface',
    tab: 'Вариант 2 — Светлый интерфейс',
    cardTitle: 'Светлый интерфейс',
    mood: 'Чисто, современно, понятно',
    description: 'Белый фон, легкая сетка и воздушная композиция для администраций, партнеров и широкой аудитории.',
    whatChoose: 'Выбираем чистоту, тонкие маршруты, карточки с обводкой и дружелюбную подачу без киберпанк-перегруза.',
    strengths: 'Универсально и безопасно для согласования.',
    risks: 'Меньше вау-эффекта, чем у темных/постерных решений.',
    recommendedFor: 'Официальные разделы, презентации и документы.',
    previewClass: 'preview-light',
  },
  {
    id: 'poster',
    tab: 'Вариант 3 — Постерный стиль',
    cardTitle: 'Постерный стиль',
    mood: 'Смело, молодежно, событийно',
    description: 'Крупная типографика, контрастные цветовые плоскости, стикерная пластика и эффект афиши.',
    whatChoose: 'Выбираем самые яркие плакатные акценты и энергетику для соцсетей и анонсов.',
    strengths: 'Максимальная заметность и вирусность контента.',
    risks: 'Для части заказчиков может быть слишком смело.',
    recommendedFor: 'Соцсети, афиши, мерч и промо-баннеры.',
    previewClass: 'preview-poster',
  },
  {
    id: 'dynamic-white',
    tab: 'Вариант 4 — Динамичный белый',
    cardTitle: 'Динамичный белый',
    mood: 'Быстро, живо, дружелюбно',
    description: 'Много воздуха, диагональные маршруты и ощущение скорости команды от идеи к решению.',
    whatChoose: 'Выбираем динамику, диагонали и активные лаймовые маркеры без перегруза темными блоками.',
    strengths: 'Сильная молодежная подача и хорошая читабельность.',
    risks: 'Менее статусно, чем темные версии.',
    recommendedFor: 'Молодежные блоки, вовлекающие экраны, stories.',
    previewClass: 'preview-dynamic',
  },
  {
    id: 'dashboard',
    tab: 'Вариант 5 — Dashboard / система',
    cardTitle: 'Dashboard / система',
    mood: 'Продуктово, IT-first',
    description: 'Хакатон как цифровая система: статусы, панели, активные команды и маршрут от идеи до питча.',
    whatChoose: 'Выбираем интерфейсную метафору, панели состояния и логику “event platform”.',
    strengths: 'Лучше всего подчеркивает IT-суть хакатона.',
    risks: 'Может быть сложновато для части аудитории без упрощений.',
    recommendedFor: 'Техничные страницы и экраны для участников.',
    previewClass: 'preview-dashboard',
  },
  {
    id: 'obninsk',
    tab: 'Вариант 6 — Обнинск / наукоград',
    cardTitle: 'Обнинск / наукоград',
    mood: 'Городски, официально, уверенно',
    description: 'Фокус на связи с городом и статусом первого наукограда: среда + цифровые маршруты + команда.',
    whatChoose: 'Выбираем блок про Обнинск, мягкую палитру и аккуратные научные отсылки без визуального шума.',
    strengths: 'Максимально понятная связка с городом для заказчика.',
    risks: 'Может быть менее молодежно, если не добавить динамики.',
    recommendedFor: 'Официальные коммуникации и партнерские страницы.',
    previewClass: 'preview-obninsk',
  },
]

function LeopardMark() {
  return <div className="leopard-mark" aria-hidden>СНЕЖНЫЙ БАРС</div>
}

function VariantPreview({ variant }) {
  return (
    <section className={`variant-preview ${variant.previewClass}`}>
      <div className="vp-header">
        <div className="logo">ОХ · Обнинский Хакатон</div>
        <nav>{navItems.map((item) => <span key={item}>{item}</span>)}</nav>
        <button>Подать заявку</button>
      </div>

      <div className="vp-body">
        <div>
          <h3>Код города.<br />Решаем вместе.</h3>
          <p>Хакатон для тех, кто создает решения для города, технологий и людей.</p>
          <div className="cta-row">
            <a href="#">Подать заявку</a>
            <a href="#" className="ghost">Смотреть кейсы</a>
          </div>
        </div>
        <div className="visual-zone">
          <LeopardMark />
          <div className="route route-a" />
          <div className="route route-b" />
          <div className="node n1" />
          <div className="node n2" />
          <div className="node n3" />
        </div>
      </div>

      <div className="stats-row">{stats.map((item) => <article key={item}>{item}</article>)}</div>
      <div className="benefits-row">
        <article>TEAM_ACTIVE</article><article>CASE_FLOW</article><article>ROUTE_01</article><article>SOLUTION_READY</article>
      </div>
      <div className="mobile-preview-note">Mobile preview: адаптация карточек и CTA в один столбец.</div>
    </section>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(landingVariants[0].id)
  const active = useMemo(() => landingVariants.find((v) => v.id === activeId) || landingVariants[0], [activeId])

export default function App() {
  return (
    <main className="options-page">
      <section className="heading">
        <p className="kicker">Варианты лендинга · согласование визуальной концепции</p>
        <h1>Обнинский Хакатон — Код города</h1>
        <p>Город становится интерфейсом: маршруты, кейсы и команды подаются как цифровая система, в которой участники двигаются от идеи к решению.</p>
        <div className="palette">
          {['#0B1D3A', '#111827', '#2563EB', '#FFFFFF', '#B8FF2E'].map((color) => <span key={color}><i style={{ background: color }} />{color}</span>)}
        </div>
      </section>

      <section className="variant-switcher">
        <div className="tabs" role="tablist" aria-label="Варианты лендинга">
          {landingVariants.map((v) => (
            <button key={v.id} className={v.id === activeId ? 'active' : ''} onClick={() => setActiveId(v.id)}>{v.tab}</button>
          ))}
        </div>
        <select value={activeId} onChange={(e) => setActiveId(e.target.value)} aria-label="Выбрать вариант" className="mobile-select">
          {landingVariants.map((v) => <option key={v.id} value={v.id}>{v.tab}</option>)}
        </select>

        <VariantPreview variant={active} />

        <article className="variant-meta">
          <div className="meta-head">
            <h2>{active.cardTitle}</h2>
            {(active.id === 'dark-interface' || active.id === 'dashboard') && <span className="recommended">Рекомендуемый вариант</span>}
          </div>
          <p><strong>Настроение:</strong> {active.mood}</p>
          <p>{active.description}</p>
          <h3>Что выбираем в этом варианте</h3>
          <p>{active.whatChoose}</p>
        </article>
      </section>

      <section className="compare">
        <h2>Сравнение вариантов</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Вариант</th><th>Настроение</th><th>Сильная сторона</th><th>Риск</th><th>Где использовать</th></tr></thead>
            <tbody>
              {landingVariants.map((v) => (
                <tr key={v.id}><td>{v.cardTitle}</td><td>{v.mood}</td><td>{v.strengths}</td><td>{v.risks}</td><td>{v.recommendedFor}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn">Согласовать направление “Код города”</button>
        <p className="note">Это предварительная концепция визуального направления. После согласования выбранного подхода на его основе разрабатываются финальные элементы брендбука, медиашаблоны, стикерпак и дизайн действующего сайта.</p>
      </section>

      <section className="recommend-block">
        <h2>Рекомендуемая сборка</h2>
        <p><strong>Основа</strong> — Вариант 1 или 5, <strong>светлые блоки</strong> — из Варианта 2/4, <strong>городская связка</strong> — из Варианта 6, <strong>соцсети и афиши</strong> — из Варианта 3.</p>
        <p>Итог: не выбираем один экран целиком, а собираем финальный стиль из сильных частей каждой версии.</p>
      </section>
    </main>
  )
}
