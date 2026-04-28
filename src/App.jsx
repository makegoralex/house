const contractItems = [
  'Брендбук',
  'Логотип и вариации',
  'Цвета и шрифты',
  'Паттерны и графические элементы',
  'Стикерпак 10–12 штук',
  'Медиашаблоны для соцсетей',
  '20 оформленных публикационных блоков',
  'Визуальная база для мерча',
  'Дизайн лендинга',
  'Внедрение на Tilda',
]

const concepts = [
  {
    title: 'Наукоград 2.0',
    idea: 'Обнинск как первый наукоград + современные цифровые команды. Соединяем научные схемы, координаты и интерфейсы.',
    palette: ['#0B1D3A', '#111827', '#2563EB', '#FFFFFF', '#B8FF2E'],
    graphics: ['Сетки', 'Координаты', 'Линии связи', 'Атомные орбиты', 'Пиктограммы задач'],
    plus: 'Серьезно и технологично для администрации и партнеров.',
    minus: 'Может быть менее эмоционально без живых акцентов.',
  },
  {
    title: 'Код города',
    badge: 'Рекомендуем',
    idea: 'Город становится интерфейсом: маршруты, кейсы и команды как “переписывание кода” городской среды.',
    palette: ['#111827', '#FF6B2C', '#2563EB', '#F3F4F6', '#2EE6A6'],
    graphics: ['Карты и маршруты', 'Пиксельные маркеры', 'Блоки кода', 'Карточки кейсов', 'Стикерные плашки'],
    plus: 'Самая сильная концепция для хакатона: понятно, молодежно, масштабируемо.',
    minus: 'Важно аккуратно зафиксировать связь с Обнинском, чтобы не стало слишком общим.',
  },
  {
    title: 'Реактор идей',
    idea: 'Отсылка к научной истории города: энергия, импульс и динамика команд в одном визуальном языке.',
    palette: ['#090B12', '#FF6B2C', '#7C3AED', '#FFFFFF', '#00D4FF'],
    graphics: ['Орбиты', 'Частицы', 'Световые линии', 'Круговые композиции', 'Маскот «Искра»'],
    plus: 'Ярко, событийно, запоминается.',
    minus: 'Нельзя уходить в слишком буквальную «атомную» тему.',
  },
]

const stickerPhrases = [
  'Я в потоке', 'Дедлайн близко', 'Собрали прототип', 'Есть идея', 'Фиксим баг',
  'Питч готов', 'Команда, пушим!', 'Нужен кофе', 'Мы в финале', 'Кейс принят',
]

const siteStructure = [
  'Главный экран', 'О хакатоне', 'Для кого', 'Как проходит', 'Кейсы / направления',
  'Программа', 'Призы / возможности', 'Партнеры', 'FAQ', 'Форма заявки', 'Контакты',
]

const deliverables = [
  'Главный экран сайта', 'Пост VK / Telegram', 'Сторис-анонс', 'Обложка программы',
  'Бейдж участника', 'Стикеры', 'Футболка / мерч', 'Ланъярд', 'Карточка команды', 'Карточка кейса',
]

export default function App() {
  return (
    <main className="landing">
      <header className="hero section">
        <div className="pattern" aria-hidden />
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Предварительная концепция визуального направления</p>
            <h1>Обнинский Хакатон: айдентика для молодежного технологического события первого наукограда</h1>
            <p className="lead">Разрабатываем визуальную систему, которая связывает науку, городскую идентичность Обнинска и энергию молодых команд: от сайта и соцсетей до стикеров, программы и мерча.</p>
            <div className="cta-row">
              <a href="#concepts" className="btn">Смотреть концепции</a>
              <a href="#contract" className="btn ghost">Что войдет в брендбук</a>
            </div>
          </div>
          <div className="mock-stack">
            <div className="mock badge">бейдж · ОХ</div>
            <div className="mock screen">Главный экран сайта</div>
            <div className="mock sticker">стикер “Команда, пушим!”</div>
          </div>
        </div>
      </header>

      <section id="contract" className="section">
        <h2>Что нужно создать по контракту</h2>
        <p>Контракт требует единую визуальную систему для сайта, соцсетей, стикеров, публикационных материалов, программы и возможного мерча.</p>
        <div className="card-grid">
          {contractItems.map((item) => <article key={item} className="card">{item}</article>)}
        </div>
      </section>

      <section className="section">
        <h2>Не просто “хакатон про IT”, а событие города-науки</h2>
        <p>Визуальная система показывает точку соединения трех смыслов: <strong>Обнинск</strong> (научная история и инженерная культура), <strong>молодежь</strong> (команды, энергия, коммуникация), <strong>технологии</strong> (код, прототипы, цифровая среда). Задача — сделать проект узнаваемым, живым и применимым на всех носителях.</p>
      </section>

      <section id="concepts" className="section concepts">
        <h2>3 концепции айдентики</h2>
        {concepts.map((concept) => (
          <article className="concept" key={concept.title}>
            <div className="concept-head">
              <h3>{concept.title}</h3>
              {concept.badge && <span className="tag">{concept.badge}</span>}
            </div>
            <p>{concept.idea}</p>
            <div className="palette">
              {concept.palette.map((color) => (
                <div key={color} className="swatch" style={{ background: color }}>
                  <span>{color}</span>
                </div>
              ))}
            </div>
            <div className="chips">{concept.graphics.map((g) => <span key={g}>{g}</span>)}</div>
            <p><strong>Плюс:</strong> {concept.plus}</p>
            <p><strong>Минус:</strong> {concept.minus}</p>
          </article>
        ))}
      </section>

      <section className="section recommendation">
        <h2>Мы предлагаем развивать направление “Код города”</h2>
        <ul>
          <li>Связывает хакатон с городом, а не только с IT.</li>
          <li>Понятная метафора: участники создают решения для среды, людей и будущего города.</li>
          <li>Легко переносится на сайт, соцсети, программу, стикеры и мерч.</li>
          <li>Сохраняет научные отсылки к Обнинску без визуального перегруза.</li>
        </ul>
        <div className="slogans">
          <span>Код города начинается здесь</span>
          <span>Собери команду. Найди решение. Запусти город будущего</span>
          <span>Хакатон первого наукограда</span>
          <span>Идеи, которые становятся прототипами</span>
          <span>Обнинск. Команды. Код. Решения</span>
        </div>
      </section>

      <section className="section">
        <h2>Минимальная айдентика для демонстрации</h2>
        <div className="identity-grid">
          <article className="card"><h3>Логотип-направление</h3><p>Текстовый знак «Обнинский Хакатон» + короткая версия «ОХ», построенная на модулях, пикселях и координатной сетке.</p></article>
          <article className="card"><h3>Шрифты</h3><p>Заголовки: Manrope / Unbounded / Geologica. Текст: Inter / Manrope. Только бесплатные лицензии.</p></article>
          <article className="card"><h3>Графические элементы</h3><p>Карточки кейсов, линии маршрутов, пиксельные маркеры, стикерные плашки, элементы бейджа и паттерны из скобок/точек/линий.</p></article>
        </div>
      </section>

      <section className="section">
        <h2>Как это будет работать на носителях</h2>
        <div className="mock-grid">
          {deliverables.map((item) => <div key={item} className="mock-item">{item}</div>)}
        </div>
      </section>

      <section className="section">
        <h2>Стикерпак 10–12 штук</h2>
        <p>Маскот-концепт: технологичный символ (Искра / Курсор / Пиксель / Модуль), который выражает эмоции участников хакатона.</p>
        <div className="chips">{stickerPhrases.map((phrase) => <span key={phrase}>{phrase}</span>)}</div>
      </section>

      <section className="section">
        <h2>Структура будущего сайта хакатона</h2>
        <div className="card-grid">
          {siteStructure.map((item, i) => <article key={item} className="card">{String(i + 1).padStart(2, '0')} · {item}</article>)}
        </div>
        <p className="note">Форма заявки в рабочей версии сайта: команда, вуз, город, капитан, телефон, email, участники, контакты участников, согласие на обработку персональных данных.</p>
      </section>

      <section className="section final">
        <h2>Что согласовываем на этом этапе</h2>
        <div className="chips">
          <span>Общую метафору айдентики</span>
          <span>Основное визуальное направление</span>
          <span>Наличие / отсутствие маскота</span>
          <span>Цветовое настроение</span>
          <span>Стиль сайта и соцсетей</span>
          <span>Принцип стикеров и мерча</span>
        </div>
        <button className="btn">Согласовать направление “Код города”</button>
        <p className="note">Это предварительная концепция визуального направления. После согласования выбранного подхода на его основе разрабатываются финальные элементы брендбука, медиашаблоны, стикерпак и дизайн действующего сайта.</p>
      </section>
    </main>
  )
}
