import { useState } from 'react'

const variants = [
  { id: 'v1', label: 'Вариант 1 · Темный city interface' },
  { id: 'v2', label: 'Вариант 2 · Постерный' },
  { id: 'v3', label: 'Вариант 3 · Динамичный белый' },
]

const stats = ['2 дня', '20+ кейсов', '300+ участников', '∞ идей']
const features = ['РЕАЛЬНЫЕ КЕЙСЫ', 'ЭКСПЕРТЫ', 'ПРИЗЫ, СТАЖИРОВКИ', 'СООБЩЕСТВО']

function Header({ dark = false }) {
  return (
    <div className={`h ${dark ? 'd' : ''}`}>
      <div className="logo">OX <span>ОБНИНСКИЙ ХАКАТОН</span></div>
      <div className="menu">О хакатоне · Кейсы · Программа · Участники · Партнеры</div>
      <button>Подать заявку</button>
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
      <img src="/src/Image_bars.png" alt="Снежный барс" loading="lazy" />
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
    </main>
  )
}
