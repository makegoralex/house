import { useState } from 'react'

const variants = [
  { id: 'v1', label: 'Вариант 1 · Темный city interface' },
  { id: 'v2', label: 'Вариант 2 · Постерный' },
  { id: 'v3', label: 'Вариант 3 · Динамичный белый' },
]

const stats = ['2 дня', '20+ кейсов', '300+ участников', '∞ идей']
const features = ['РЕАЛЬНЫЕ КЕЙСЫ', 'ЭКСПЕРТЫ', 'ПРИЗЫ, СТАЖИРОВКИ', 'СООБЩЕСТВО']
const ASSET_BASE = 'https://house.yago-app.ru/uploads'

function Header({ dark = false }) {
  return (
    <div className={`h ${dark ? 'd' : ''}`}>
      <div className="logo">OX <span>ОБНИНСКИЙ ХАКАТОН</span></div>
      <div className="menu">О хакатоне · Кейсы · Программа · Участники · Партнеры</div>
      <div className="head-right"><img className="head-bars" src={`${ASSET_BASE}/bars.png`} alt="Барс" /><button>Подать заявку</button></div>
    </div>
  )
}

function BaseInfo({ dark = false, compact = false }) {
  return (
    <div className={`info ${dark ? 'd' : ''} ${compact ? 'compact' : ''}`}>
      <h2>КОД ГОРОДА.<br />РЕШАЕМ <span>ВМЕСТЕ.</span></h2>
      <p>Хакатон для тех, кто хочет менять город через технологии, идеи и командную работу.</p>
      <div className="cta"><a href="#">Подать заявку</a><a href="#" className="g">Смотреть кейсы</a></div>
    </div>
  )
}

function Foot({ dark=false }) {
  return (
    <>
      <div className={`st ${dark?'d':''}`}>{stats.map((s)=><div key={s}>{s}</div>)}</div>
      <div className={`ft ${dark?'d':''}`}>{features.map((f)=><div key={f}>{f}</div>)}</div>
    </>
  )
}

function Leopard({ mode }) {
  return (
    <div className={`leo ${mode}`}>
      <img src={`${ASSET_BASE}/bars.png`} alt="Снежный барс" loading="lazy" />
    </div>
  )
}

function Preview({ id }) {
  if (id === 'v2') return <section className="p p3"><Header dark={false} /><div className="body split"><BaseInfo compact /><div className="poster"><Leopard mode="poster" /></div></div><Foot /></section>
  if (id === 'v3') return <section className="p p4"><Header dark={false} /><div className="body"><BaseInfo /><div className="rush"><Leopard mode="rush" /></div></div><Foot /></section>
  return <section className="p p1"><Header dark /><div className="body"><BaseInfo dark /><div className="map"><div className="tag">КОМАНДЫ</div><div className="tag">МАРШРУТЫ</div><div className="tag">ИДЕИ</div><div className="tag">РЕШЕНИЯ</div><Leopard mode="dark" /></div></div><Foot dark /></section>
}

export default function App() {
  const [active, setActive] = useState('v1')
  return (
    <main className="page">
      <h1>Варианты лендинга и айдентики — Обнинский Хакатон</h1>
      <div className="tabs">{variants.map(v => <button className={active===v.id?'a':''} key={v.id} onClick={()=>setActive(v.id)}>{v.label}</button>)}</div>
      <Preview id={active} />

      <section className="brandbook">
        <h2>Предпросмотр брендбука: визуальная система «Обнинский Хакатон»</h2>
        <p>Ниже — концентрат правил, на которых собран текущий интерфейс. Это помогает согласовать не только экран, но и общий стиль проекта: сайт, соцсети, презентации, мерч и навигационные материалы.</p>
        <div className="bb-grid">
          <article>
            <h3>Типографика</h3>
            <p><strong>Geologica</strong> — заголовки и акцентные фразы: рублено, технологично, уверенно.</p>
            <p><strong>Manrope</strong> — интерфейс, описания, подписи: читаемо и современно.</p>
          </article>
          <article>
            <h3>Цветовая палитра</h3>
            <ul>
              <li><b>#0B1D3A</b> — глубокий синий (фон/статус)</li>
              <li><b>#111827</b> — графит (текст/блоки)</li>
              <li><b>#2563EB</b> — синий акцент (CTA/маршруты)</li>
              <li><b>#FFFFFF</b> — базовый светлый фон</li>
              <li><b>#B8FF2E</b> — лайм-акцент (сигналы/важные точки)</li>
            </ul>
          </article>
          <article>
            <h3>Композиция и UI</h3>
            <p>Структура hero: логотип, навигация, крупный месседж, CTA, визуал барса, статистика, блок преимуществ.</p>
            <p>Геометрия блоков — преимущественно прямоугольная, без лишних скруглений: это поддерживает «системный» технологичный характер айдентики.</p>
          </article>
          <article>
            <h3>Принципы применения</h3>
            <p>Темный вариант — для статусной коммуникации и основного сайта.</p>
            <p>Постерный — для анонсов, соцсетей и событийного шума.</p>
            <p>Динамичный белый — для легкой подачи, onboarding и молодежных сценариев.</p>
          </article>
        </div>

        <div className="logo-variants">
          <h3>Варианты логотипа</h3>
          <p>Ниже — загруженные варианты логотипа для согласования после брендблоков.</p>
          <div className="logo-grid">
            <figure><img src={`${ASSET_BASE}/logo1.png`} alt="Логотип вариант 1" /><figcaption>Вариант логотипа 1</figcaption></figure>
            <figure><img src={`${ASSET_BASE}/logo2.png`} alt="Логотип вариант 2" /><figcaption>Вариант логотипа 2</figcaption></figure>
          </div>
        </div>
      </section>
    </main>
  )
}
