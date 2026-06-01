import { useState } from 'react'

const Arrow = ({ direction = 'right' }) => <span className={`arrow arrow-${direction}`} aria-hidden="true">→</span>
const Plus = () => <span className="plus" aria-hidden="true">+</span>

const nav = [
  ['О хакатоне', 'about'], ['Кейсы', 'cases'], ['Программа', 'program'], ['Участники', 'route'],
  ['Эксперты', 'experts'], ['Партнеры', 'partners'], ['FAQ', 'faq'], ['Контакты', 'contacts'],
]

const stats = [
  ['02', 'дня интенсивной работы'], ['20+', 'реальных кейсов'], ['300+', 'участников'], ['∞', 'идей для города'],
]

const systemNodes = [
  ['01', 'ИДЕЯ', 'INPUT'], ['02', 'КОМАНДА', 'TEAM_04'], ['03', 'КЕЙС', 'CASE_12'], ['04', 'ПРОТОТИП', 'BUILD'], ['05', 'РЕШЕНИЕ', 'OUTPUT'],
]

const aboutCards = [
  ['01', 'Реальные кейсы', 'Задачи от города и компаний, для которых нужны новые работающие решения.'],
  ['02', 'Работа в командах', 'Объединяйтесь с теми, кто дополняет ваши навыки и разделяет амбиции.'],
  ['03', 'Поддержка экспертов', 'Получайте обратную связь от практиков и точечно усиливайте проект.'],
  ['04', 'Финальная защита', 'Представьте прототип жюри и получите возможность запустить пилот.'],
]

const cases = [
  { id: '01', type: 'ИИ', title: 'Умный городской помощник', text: 'Сервис на базе ИИ для быстрой навигации по городским услугам.', org: 'Администрация Обнинска', level: 'MEDIUM', prize: '150 000 ₽' },
  { id: '02', type: 'Городская среда', title: 'Карта доступного города', text: 'Интерактивная карта доступности городской инфраструктуры.', org: 'Городские сервисы', level: 'START', prize: '100 000 ₽' },
  { id: '03', type: 'Образование', title: 'Наукоград: открытая лаборатория', text: 'Цифровая платформа для школьных исследовательских проектов.', org: 'Обнинск Тех', level: 'MEDIUM', prize: '120 000 ₽' },
  { id: '04', type: 'IT', title: 'Предиктивная аналитика ЖКХ', text: 'Инструмент прогнозирования обращений и аварийных ситуаций.', org: 'Умный город', level: 'HARD', prize: '200 000 ₽' },
  { id: '05', type: 'Медиа', title: 'Город говорит', text: 'Медиаархив истории наукограда с открытым доступом.', org: 'Городской музей', level: 'START', prize: '80 000 ₽' },
  { id: '06', type: 'ИИ', title: 'Экологический мониторинг', text: 'Панель анализа показателей городской среды и оповещений.', org: 'ЭкоЛаб', level: 'HARD', prize: '180 000 ₽' },
]

const tracks = [
  ['01', 'Цифровой город', 'CITY_SYS'], ['02', 'Искусственный интеллект', 'AI_CORE'], ['03', 'Веб-разработка', 'WEB_APP'],
  ['04', 'Медиа', 'MEDIA_LAB'], ['05', 'Образование', 'EDU_TECH'], ['06', 'Городские сервисы', 'URBAN_API'],
]

const route = [
  ['01', 'Регистрация', '01 — 20 августа', 'Соберите команду или зарегистрируйтесь самостоятельно.'],
  ['02', 'Отбор участников', '21 — 24 августа', 'Команда организаторов проверит заявки и распределит кейсы.'],
  ['03', 'Открытие хакатона', '29 августа · 10:00', 'Знакомство, презентация кейсов и старт проектной работы.'],
  ['04', 'Разработка решений', '29 — 30 августа', 'Работа с экспертами, менторские сессии и сборка прототипа.'],
  ['05', 'Финальная защита', '30 августа · 17:00', 'Презентации перед жюри, обратная связь и награждение.'],
]

const schedules = {
  'День 1': [
    ['09:00', 'Регистрация участников', 'Команда хакатона', 'Главный холл'], ['10:00', 'Открытие и презентация кейсов', 'Организаторы', 'Большой зал'],
    ['12:00', 'Старт работы команд', 'Трекеры направлений', 'Коворкинг'], ['15:30', 'Экспертные сессии', 'Эксперты треков', 'Переговорные'], ['20:00', 'Check-point #01', 'Трекеры', 'Коворкинг'],
  ],
  'День 2': [
    ['09:00', 'Утренний check-point', 'Трекеры', 'Коворкинг'], ['11:00', 'Менторские сессии', 'Эксперты', 'Переговорные'],
    ['14:00', 'Сборка презентаций', 'Команды', 'Коворкинг'], ['16:00', 'Технический стоп', 'Организаторы', 'Большой зал'],
  ],
  'Финал': [
    ['17:00', 'Защита проектов', 'Финалисты', 'Большой зал'], ['19:30', 'Совещание жюри', 'Жюри', 'Переговорная'], ['20:00', 'Награждение', 'Организаторы', 'Большой зал'],
  ],
}

const experts = [
  ['01', 'Алексей Морозов', 'VK Tech', 'Директор по продукту'], ['02', 'Елена Власова', 'Росатом', 'Руководитель цифровых проектов'],
  ['03', 'Михаил Орлов', 'Яндекс', 'ML Team Lead'], ['04', 'Мария Громова', 'Обнинск Тех', 'Директор акселератора'],
]

const prizes = [
  ['01', '650 000 ₽', 'Общий призовой фонд'], ['02', 'Стажировки', 'В командах партнеров'], ['03', 'Менторство', 'От лидеров индустрии'], ['04', 'Пилоты', 'Запуск решений в городе'],
]

const faqs = [
  ['Кто может участвовать?', 'Студенты, школьники старших классов, начинающие специалисты и опытные разработчики. Главное — желание создавать технологические решения для города.'],
  ['Можно ли прийти одному?', 'Да. Вы сможете присоединиться к команде на этапе формирования команд перед стартом хакатона.'],
  ['Сколько человек должно быть в команде?', 'Оптимальный состав команды — от 2 до 5 человек.'],
  ['Можно ли участвовать школьникам?', 'Да, к участию допускаются школьники старших классов. Для несовершеннолетних потребуется согласие родителей.'],
  ['Можно ли участвовать онлайн?', 'Основная программа пройдет очно в Обнинске. Отдельные консультации экспертов будут доступны онлайн.'],
  ['Что получают победители?', 'Победители получают денежные призы, поддержку партнеров и возможность запустить пилот своего решения.'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header">
    <a className="brand" href="#top" aria-label="Обнинский хакатон"><span className="brand-mark">ОХ<span>.</span></span><span className="brand-copy">ОБНИНСКИЙ<br />ХАКАТОН <b>2026</b></span></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Открыть меню"><i /><i /></button>
    <nav className={open ? 'nav open' : 'nav'}>{nav.map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{name}</a>)}</nav>
    <a className="button button-lime header-cta" href="#register">Подать заявку <Arrow /></a>
  </header>
}

function RouteVisual() {
  return <div className="route-visual" aria-label="Путь участника от идеи до решения">
    <div className="rv-meta mono">ROUTE_01 <span>STATUS: ACTIVE</span></div>
    <div className="rv-grid" />
    <div className="rv-track" />
    {systemNodes.map(([num, name, code], index) => <div className={`system-node node-${index + 1}`} key={name}>
      <span className="node-dot" /><span className="node-number mono">{num}</span><strong>{name}</strong><em className="mono">{code}</em>
    </div>)}
    <span className="coordinate mono coord-1">55°06' N</span><span className="coordinate mono coord-2">36°37' E</span>
  </div>
}

function SectionHead({ index, eyebrow, title, text, action }) {
  return <div className="section-head">
    <p className="eyebrow mono"><span>{index}</span> {eyebrow}</p>
    <div className="section-title-row"><h2>{title}</h2>{text && <p>{text}</p>}{action}</div>
  </div>
}

function Cases() {
  const [filter, setFilter] = useState('Все')
  const types = ['Все', 'IT', 'ИИ', 'Городская среда', 'Образование', 'Медиа']
  const visible = filter === 'Все' ? cases : cases.filter(item => item.type === filter)
  return <section className="section cases" id="cases">
    <SectionHead index="03" eyebrow="CASE_CATALOG" title={<>КЕЙСЫ <span>ХАКАТОНА</span></>} text="Выберите реальную задачу и создайте решение, которое сможет изменить город." />
    <div className="filter-row">{types.map(type => <button key={type} onClick={() => setFilter(type)} className={filter === type ? 'active' : ''}>{type}</button>)}</div>
    <div className="case-grid">{visible.map(item => <article className="case-card" key={item.id}>
      <div className="case-top mono"><span>CASE_{item.id}</span><b>{item.type}</b></div><h3>{item.title}</h3><p>{item.text}</p>
      <dl><div><dt>ОРГАНИЗАЦИЯ</dt><dd>{item.org}</dd></div><div><dt>СЛОЖНОСТЬ</dt><dd>{item.level}</dd></div></dl>
      <div className="case-bottom"><span><small>ПРИЗ</small>{item.prize}</span><a href="#register" aria-label={`Выбрать кейс ${item.title}`}><Arrow /></a></div>
    </article>)}</div>
  </section>
}

function Program() {
  const [day, setDay] = useState('День 1')
  return <section className="section program" id="program">
    <SectionHead index="06" eyebrow="PROGRAM" title={<>ПРОГРАММА <span>СОБЫТИЯ</span></>} />
    <div className="program-tabs">{Object.keys(schedules).map(name => <button key={name} className={day === name ? 'active' : ''} onClick={() => setDay(name)}>{name}</button>)}</div>
    <div className="schedule"><div className="schedule-labels mono"><span>TIME</span><span>EVENT</span><span>SPEAKER</span><span>LOCATION</span></div>{schedules[day].map((item, i) => <div className="schedule-row" key={item[0]}><b>{item[0]}</b><strong><span className="mono">0{i + 1}</span>{item[1]}</strong><span>{item[2]}</span><em>{item[3]}</em></div>)}</div>
  </section>
}

function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="section faq" id="faq"><SectionHead index="10" eyebrow="FAQ" title={<>ЧАСТЫЕ <span>ВОПРОСЫ</span></>} />
    <div className="faq-list">{faqs.map(([question, answer], index) => <article className={open === index ? 'faq-item active' : 'faq-item'} key={question}>
      <button onClick={() => setOpen(open === index ? -1 : index)}><span className="mono">0{index + 1}</span><strong>{question}</strong><Plus /></button>{open === index && <p>{answer}</p>}
    </article>)}</div>
  </section>
}

function Register() {
  const [members, setMembers] = useState(1)
  const [sent, setSent] = useState(false)
  const submit = (event) => { event.preventDefault(); setSent(true) }
  return <section className="register" id="register"><div className="register-intro"><p className="eyebrow mono"><span>11</span> REGISTRATION</p><h2>СТАНЬ ЧАСТЬЮ<br /><span>СИСТЕМЫ</span></h2><p>Соберите команду, выберите кейс и подайте заявку. Следующий узел маршрута — ваш.</p><div className="register-route mono"><i /> IDEA <b>→</b> TEAM <b>→</b> <span>REGISTER</span></div></div>
    <form className="register-form" onSubmit={submit}>
      {sent ? <div className="success"><span className="success-icon">✓</span><p className="mono">APPLICATION_SENT</p><h3>Заявка принята</h3><p>Мы свяжемся с вами после завершения отбора участников.</p><button type="button" className="button button-outline" onClick={() => setSent(false)}>Заполнить еще одну</button></div> : <>
      <div className="form-head"><span className="mono">FORM_01</span><b className="mono">STATUS: INPUT</b></div><h3>ЗАЯВКА НА УЧАСТИЕ</h3>
      <fieldset><legend>01 / КАПИТАН КОМАНДЫ</legend><div className="form-grid"><label>ФИО<input required placeholder="Иванов Иван Иванович" /></label><label>Телефон<input required type="tel" placeholder="+7 999 000 00 00" /></label><label>Email<input required type="email" placeholder="name@email.ru" /></label><label>Город<input required placeholder="Обнинск" /></label></div></fieldset>
      <fieldset><legend>02 / КОМАНДА</legend><div className="form-grid"><label>Название команды<input required placeholder="Название" /></label><label>Количество участников<select value={members} onChange={e => setMembers(Number(e.target.value))}>{[1,2,3,4,5].map(num => <option key={num}>{num}</option>)}</select></label></div><div className="member-note mono">TEAM_CAPACITY: {members}/5</div></fieldset>
      <fieldset><legend>03 / ВЫБЕРИТЕ ТРЕК</legend><label>Направление<select><option>Цифровой город</option><option>Искусственный интеллект</option><option>Веб-разработка</option><option>Медиа</option><option>Образование</option></select></label></fieldset>
      <label className="check"><input required type="checkbox" /><span />Я согласен на обработку персональных данных и с правилами участия</label>
      <button className="button button-lime form-submit">Подать заявку <Arrow /></button></>}
    </form>
  </section>
}

export default function App() {
  return <>
    <div className="topline mono"><span>OBNINSK / 55°06' N 36°37' E</span><b>SYSTEM STATUS: <i /> ONLINE</b><span>29—30 AUGUST 2026</span></div>
    <Header />
    <main>
      <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow mono"><span>01</span> OBNINSK_HACKATHON / 2026</p><h1>КОД<br />ГОРОДА.<br /><span>РЕШАЕМ ВМЕСТЕ.</span></h1><p className="hero-text">Хакатон для тех, кто хочет менять город через технологии, идеи и командную работу.</p><div className="hero-actions"><a className="button button-lime" href="#register">Подать заявку <Arrow /></a><a className="text-link" href="#cases">Смотреть кейсы <Arrow /></a></div></div><RouteVisual /></section>
      <section className="stats-bar">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
      <section className="section about" id="about"><SectionHead index="01" eyebrow="ABOUT_EVENT" title={<>СОЗДАЕМ РЕШЕНИЯ<br /><span>ДЛЯ РЕАЛЬНОГО ГОРОДА</span></>} text="Обнинский хакатон — это два дня интенсивной работы над задачами, которые имеют значение для жителей города." /><div className="about-grid">{aboutCards.map(([num, title, text]) => <article key={num}><div className="card-num mono">{num}</div><span className="card-node" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="science"><div className="science-map"><span className="map-core">ОБНИНСК</span><i className="orbit orbit-1" /><i className="orbit orbit-2" /><i className="orbit orbit-3" /><b className="map-point p-1" /><b className="map-point p-2" /><b className="map-point p-3" /><span className="map-label l-1 mono">NPP_01</span><span className="map-label l-2 mono">SCIENCE</span><span className="map-label l-3 mono">EDU_NODE</span></div><div className="science-copy"><p className="eyebrow mono"><span>02</span> SCIENCE_CITY</p><h2>ПЕРВЫЙ<br /><span>НАУКОГРАД</span><br />РОССИИ</h2><p>Обнинск — город, в ДНК которого уже заложены технологии, исследования и смелые идеи.</p><ul>{['История технологий', 'Инженерная школа', 'Молодежные проекты', 'Научное сообщество'].map((item, i) => <li key={item}><b className="mono">0{i + 1}</b>{item}</li>)}</ul></div></section>
      <Cases />
      <section className="section tracks"><SectionHead index="04" eyebrow="TRACKS" title={<>НАПРАВЛЕНИЯ <span>РАБОТЫ</span></>} /><div className="track-grid">{tracks.map(([num, title, code]) => <article key={num}><span className="mono">TRACK_{num}</span><h3>{title}</h3><footer><b className="mono">{code}</b><Arrow /></footer></article>)}</div></section>
      <section className="section route-section" id="route"><SectionHead index="05" eyebrow="EVENT_ROUTE" title={<>КАК ПРОХОДИТ <span>ХАКАТОН</span></>} text="Пять узлов маршрута от регистрации до готового решения." /><div className="timeline">{route.map(([num, title, date, text]) => <article key={num}><span className="timeline-node" /><b className="mono">{num}</b><div><p className="mono">{date}</p><h3>{title}</h3><span>{text}</span></div></article>)}</div></section>
      <Program />
      <section className="section experts" id="experts"><SectionHead index="07" eyebrow="EXPERTS" title={<>ЭКСПЕРТЫ <span>ХАКАТОНА</span></>} /><div className="expert-grid">{experts.map(([num, name, company, role]) => <article key={num}><div className="expert-visual"><span className="mono">EXPERT_{num}</span><strong>{name.split(' ').map(word => word[0]).join('')}</strong><i /></div><p className="mono">{company}</p><h3>{name}</h3><span>{role}</span></article>)}</div></section>
      <section className="prizes"><SectionHead index="08" eyebrow="PRIZES" title={<>ВОЗМОЖНОСТИ<br /><span>ДЛЯ ПОБЕДИТЕЛЕЙ</span></>} /><div className="prize-grid">{prizes.map(([num, value, label]) => <article key={num}><b className="mono">{num}</b><h3>{value}</h3><p>{label}</p></article>)}</div></section>
      <section className="section partners" id="partners"><SectionHead index="09" eyebrow="PARTNERS" title={<>ПАРТНЕРЫ <span>СИСТЕМЫ</span></>} /><div className="partner-grid">{['РОСАТОМ', 'VK TECH', 'ОБНИНСК.ТЕХ', 'НАУКА', 'УМНЫЙ ГОРОД', 'КАЛУЖСКАЯ ОБЛАСТЬ'].map((name, i) => <div key={name}><span className="mono">0{i + 1}</span><strong>{name}</strong></div>)}</div></section>
      <FAQ /><Register />
    </main>
    <footer className="footer" id="contacts"><div className="footer-main"><a className="brand" href="#top"><span className="brand-mark">ОХ<span>.</span></span><span className="brand-copy">ОБНИНСКИЙ<br />ХАКАТОН <b>2026</b></span></a><h2>СОБЕРИ КОМАНДУ.<br /><span>ИЗМЕНИ ГОРОД.</span></h2><div className="footer-contact"><a href="mailto:hello@ox-hack.ru">hello@ox-hack.ru</a><a href="tel:+74843900000">+7 (484) 390-00-00</a><p>г. Обнинск, ул. Ленина, 121<br />Технопарк «Обнинск»</p></div></div><div className="footer-bottom mono"><span>© 2026 ОБНИНСКИЙ ХАКАТОН</span><span>VK · TELEGRAM</span><span>CODE_THE_CITY</span></div></footer>
  </>
}
