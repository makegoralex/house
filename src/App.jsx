import { useState } from 'react'

const variants = [
  { id: 'v1', label: 'Вариант 1 · Темный city interface' },
  { id: 'v2', label: 'Вариант 2 · Постерный' },
  { id: 'v3', label: 'Вариант 3 · Динамичный белый' },
]

const socialFormats = [
  { id: 'vk-cover', label: 'VK cover', size: '1590×400', title: 'Широкая обложка сообщества VK' },
  { id: 'tg-post', label: 'TG post', size: '1080×1080', title: 'Квадратный пост Telegram' },
  { id: 'vk-post', label: 'VK post', size: '1080×1350', title: 'Вертикальный пост VK' },
  { id: 'stories', label: 'Stories', size: '1080×1920', title: 'Stories / Reels cover' },
  { id: 'program', label: 'Program', size: '1080×1080', title: 'Обложка программы' },
  { id: 'partners', label: 'Partners', size: '1080×1080', title: 'Обложка партнеров' },
]

const stats = ['2 дня', '20+ кейсов', '300+ участников', '∞ идей']
const features = ['РЕАЛЬНЫЕ КЕЙСЫ', 'ЭКСПЕРТЫ', 'ПРИЗЫ, СТАЖИРОВКИ', 'СООБЩЕСТВО']
const BARS_URL = 'https://s10.iimage.su/s/06/gQJ2qsCxcpb1JssejBpiw02oIwzWBVrwD56qDKVE7.png'
const LOGO1_URL = 'https://s10.iimage.su/s/06/gTXn8EhxDAcFGFXHaGGGbiplLpn634f2wFb9Lt5Iv.png'
const LOGO2_URL = 'https://s10.iimage.su/s/06/gEKZmLdxuDFwC4ulUizqOEyXfyQCeVDKy8JreV5DA.png'

const Deco = () => <><span className="deco d1">CASE_01</span><span className="deco d2">TEAM_ACTIVE</span><span className="deco d3">ROUTE</span><span className="deco d4">&lt;/&gt;</span></>

function Header({ dark = false }) { return <div className={`h ${dark ? 'd' : ''}`}><div className="logo">OX <span>ОБНИНСКИЙ ХАКАТОН</span></div><div className="menu">О хакатоне · Кейсы · Программа · Участники · Партнеры</div><div className="head-right"><button>Подать заявку</button></div></div> }
function BaseInfo({ dark = false, compact = false }) { return <div className={`info ${dark ? 'd' : ''} ${compact ? 'compact' : ''}`}><h2>КОД ГОРОДА.<br />РЕШАЕМ <span>ВМЕСТЕ.</span></h2><p>Хакатон для тех, кто хочет менять город через технологии, идеи и командную работу.</p><div className="cta"><a href="#">Подать заявку</a><a href="#" className="g">Смотреть кейсы</a></div></div> }
function Foot({ dark=false }) { return <><div className={`st ${dark?'d':''}`}>{stats.map((s)=><div key={s}>{s}</div>)}</div><div className={`ft ${dark?'d':''}`}>{features.map((f)=><div key={f}>{f}</div>)}</div></> }
function Leopard({ mode }) { return <div className={`leo ${mode}`}><img src={BARS_URL} alt="Снежный барс" loading="lazy" /></div> }

function Preview({ id }) {
  if (id === 'v2') return <section className="p p3"><Header /><div className="body split"><BaseInfo compact /><div className="poster"><Leopard mode="poster" /></div></div><Foot /></section>
  if (id === 'v3') return <section className="p p4"><Header /><div className="body"><BaseInfo /><div className="rush"><Leopard mode="rush" /></div></div><Foot /></section>
  return <section className="p p1"><Header dark /><div className="body"><BaseInfo dark /><div className="map"><div className="tag">КОМАНДЫ</div><div className="tag">МАРШРУТЫ</div><div className="tag">ИДЕИ</div><div className="tag">РЕШЕНИЯ</div><Leopard mode="dark" /></div></div><Foot dark /></section>
}

function SocialPreview({ id }) {
  const common = <><Deco /><img src={BARS_URL} alt="Барс" className="soc-bars" /></>
  if (id === 'vk-cover') return <div className="soc-card vk-cover"><h4>КОД ГОРОДА. <span>РЕШАЕМ ВМЕСТЕ.</span></h4>{common}</div>
  if (id === 'tg-post') return <div className="soc-card sq"><p className="strap">ОБНИНСКИЙ ХАКАТОН</p><h4>РЕГИСТРАЦИЯ<br />ОТКРЫТА</h4><button>ПОДАТЬ ЗАЯВКУ</button>{common}</div>
  if (id === 'vk-post') return <div className="soc-card vk-post"><h4>КЕЙСЫ<br />ХАКАТОНА</h4><p>Реальные задачи от партнеров и города</p><div className="mini3"><span>ГОРОД</span><span>ТЕХНОЛОГИИ</span><span>КОМАНДЫ</span></div>{common}</div>
  if (id === 'stories') return <div className="soc-card stories"><h4><span>2</span> ДНЯ<br /><span>20+</span> КЕЙСОВ<br /><span>300+</span> УЧАСТНИКОВ</h4><button>СТАНЬ УЧАСТНИКОМ</button>{common}</div>
  if (id === 'program') return <div className="soc-card sq"><h4>ПРОГРАММА<br />МЕРОПРИЯТИЯ</h4><div className="timeline"><b>ДЕНЬ 1</b><b>ДЕНЬ 2</b><b>ФИНАЛ</b></div>{common}</div>
  return <div className="soc-card sq"><h4>ПАРТНЕРЫ<br />ХАКАТОНА</h4><p>Компании, эксперты и команды в одной системе</p><div className="partners-grid"><i /><i /><i /><i /></div>{common}</div>
}

function SocialCoversSection() {
  const [active, setActive] = useState('vk-cover')
  const fmt = socialFormats.find((x) => x.id === active)
  return <section className="social-wrap"><h2>Соцсети и публикационные материалы</h2><div className="tabs social-tabs">{socialFormats.map((f) => <button key={f.id} className={active===f.id?'a':''} onClick={() => setActive(f.id)}>{f.label}</button>)}</div><div className="social-layout"><SocialPreview id={active} /><aside><h3>{fmt.title}</h3><p>Собран кодом в стиле постерного направления: крупная типографика, синие плоскости, бело-лаймовые акценты, декор CASE/TEAM/ROUTE.</p><span className="size-pill">{fmt.size}</span></aside></div></section>
}

export default function App() {
  const [active, setActive] = useState('v1')
  return (
    <main className="page">
      <h1>Варианты лендинга и айдентики — Обнинский Хакатон</h1>
      <div className="tabs">{variants.map(v => <button className={active===v.id?'a':''} key={v.id} onClick={()=>setActive(v.id)}>{v.label}</button>)}</div>
      <Preview id={active} />
      <SocialCoversSection />
      <section className="brandbook"><h2>Предпросмотр брендбука: визуальная система «Обнинский Хакатон»</h2><p>Ниже — концентрат правил, на которых собран текущий интерфейс. Это помогает согласовать не только экран, но и общий стиль проекта: сайт, соцсети, презентации, мерч и навигационные материалы.</p><div className="bb-grid"><article><h3>Типографика</h3><p><strong>Geologica</strong> — заголовки и акцентные фразы: рублено, технологично, уверенно.</p><p><strong>Manrope</strong> — интерфейс, описания, подписи: читаемо и современно.</p></article><article><h3>Цветовая палитра</h3><ul><li><b>#0B1D3A</b> — глубокий синий (фон/статус)</li><li><b>#111827</b> — графит (текст/блоки)</li><li><b>#2563EB</b> — синий акцент (CTA/маршруты)</li><li><b>#FFFFFF</b> — базовый светлый фон</li><li><b>#B8FF2E</b> — лайм-акцент (сигналы/важные точки)</li></ul></article><article><h3>Композиция и UI</h3><p>Структура hero: логотип, навигация, крупный месседж, CTA, визуал барса, статистика, блок преимуществ.</p><p>Геометрия блоков — преимущественно прямоугольная, без лишних скруглений: это поддерживает «системный» технологичный характер айдентики.</p></article><article><h3>Принципы применения</h3><p>Темный вариант — для статусной коммуникации и основного сайта.</p><p>Постерный — для анонсов, соцсетей и событийного шума.</p><p>Динамичный белый — для легкой подачи, onboarding и молодежных сценариев.</p></article></div><div className="logo-variants"><h3>Варианты логотипа</h3><p>Ниже — загруженные варианты логотипа для согласования</p><div className="logo-grid"><figure><img src={LOGO1_URL} alt="Логотип вариант 1" /><figcaption>Вариант логотипа 1</figcaption></figure><figure><img src={LOGO2_URL} alt="Логотип вариант 2" /><figcaption>Вариант логотипа 2</figcaption></figure></div></div></section>
    </main>
  )
}
