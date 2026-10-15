import { useState, useMemo, useEffect } from 'react'
import { Search, MapPin, Navigation, Home as HomeIcon, Compass, Bookmark, CalendarCheck, LayoutDashboard, MessageCircle, User, Languages } from 'lucide-react'
import { t } from './lang'
import { CATEGORIES, JOBS, jl } from './data'
import { useStore, wpPct } from './store'
import { JobCard, Details, ProfilePage } from './pages'
import { Auth } from './auth'
import { Dashboard, BookingsPage } from './employer'
import { Inbox, Gate } from './inbox'
import WorkerProfile from './workerProfile'

const km = (a, b) => {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  useEffect(() => { localStorage.setItem('lang', lang); document.documentElement.lang = lang }, [lang])
  const T = k => t(lang, k)
  const st = useStore()
  const u = st.s.user
  const isC = u ? u.role === 'customer' : false
  const isW = u ? u.role === 'worker' : false
  const wpDone = !!(u && u.wp && u.wp.done)
  const [note, setNote] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(null)
  const [type, setType] = useState('paid')
  const [mode, setMode] = useState('all')
  const [sort, setSort] = useState('newest')
  const [me, setMe] = useState(null)
  const [locMsg, setLocMsg] = useState('')
  const [tab, setTab] = useState('home')
  const [openKey, setOpenKey] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [wiz, setWiz] = useState(false)

  // When a worker logs in or registers without a finished profile, open the wizard.
  const uid = u ? u.id : null
  useEffect(() => {
    setWiz(!!(u && u.role === 'worker' && !(u.wp && u.wp.done)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  const jobs = useMemo(() => [...JOBS.map(j => ({ ...j, owner: 'c1' })), ...st.s.jobs], [st.s.jobs])
  const loc = id => { const j = jobs.find(x => x.id === id); return j ? jl(j, lang) : null }
  const sentIds = new Set(st.s.interests.filter(i => i.userId === (u ? u.id : '')).map(i => i.jobId))
  const go = (id, key) => { setWiz(false); setTab(id); setOpenKey(key || null); setNote('') }
  const toLogin = () => go('profile')

  const onInterest = id => {
    if (!u || u.role !== 'worker') {
      setNote(T('needWorker'))
      if (!u) go('profile')
      return
    }
    if (!wpDone) {
      setDetailId(null)
      setNote(lang === 'hi' ? 'पहले अपनी प्रोफ़ाइल पूरी करें।' : 'Finish your profile first.')
      setWiz(true)
      return
    }
    setNote('')
    st.interest(id)
  }

  const askLocation = () => {
    if (!window.confirm(T('locWhy'))) return
    if (!navigator.geolocation) { setLocMsg(T('locDenied')); return }
    navigator.geolocation.getCurrentPosition(
      p => { setMe({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocMsg('') },
      () => setLocMsg(T('locDenied'))
    )
  }

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    let r = jobs.filter(j => {
      if (type !== 'all' && j.type !== type) return false
      if (cat && j.cat !== cat) return false
      if (mode !== 'all' && j.mode !== mode) return false
      if (!kw) return true
      const h = j.hi || {}
      const hay = [j.title, j.desc, j.area, ...j.skills, h.title, h.desc, h.area, ...(h.skills || []), t('en', 'cat.' + j.cat), t('hi', 'cat.' + j.cat)]
      return hay.join(' ').toLowerCase().includes(kw)
    })
    r = r.map(j => ({ ...jl(j, lang), d: me ? km(me, j) : null }))
    if (sort === 'distance' && me) r.sort((a, b) => a.d - b.d)
    else r.sort((a, b) => a.posted - b.posted)
    return r
  }, [jobs, q, cat, type, mode, sort, me, lang])

  const card = j => (
    <JobCard key={j.id} job={j} lang={lang} dist={j.d} sent={sentIds.has(j.id)} saved={st.s.saved.includes(j.id)}
      onSave={st.toggleSave} onDetails={setDetailId} onInterest={onInterest} />
  )

  const selects = (
    <div className="row">
      {tab === 'explore' ? (
        <>
          <select className="field" style={{ flex: 'none', minWidth: 0 }} value={type} onChange={e => setType(e.target.value)} aria-label={T('filter')}>
            <option value="all">{T('allTypes')}</option>
            <option value="paid">{T('paid')}</option>
            <option value="volunteer">{T('volunteer')}</option>
          </select>
          <select className="field" style={{ flex: 'none', minWidth: 0 }} value={cat || ''} onChange={e => setCat(e.target.value || null)} aria-label={T('categories')}>
            <option value="">{T('allCats')}</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{T('cat.' + c.id)}</option>)}
          </select>
        </>
      ) : null}
      <select className="field" style={{ flex: 'none', minWidth: 0 }} value={mode} onChange={e => setMode(e.target.value)} aria-label={T('filter')}>
        {['all', 'urgent', 'scheduled', 'flexible'].map(m => <option key={m} value={m}>{T(m)}</option>)}
      </select>
      <select className="field" style={{ flex: 'none', minWidth: 0 }} value={sort} onChange={e => setSort(e.target.value)} aria-label={T('sortBy')}>
        <option value="newest">{T('newest')}</option>
        {me ? <option value="distance">{T('distance')}</option> : null}
      </select>
    </div>
  )

  const feed = (
    <div>
      {tab === 'home' ? (
        <>
          <p className="muted">{T('tagline')} · {T('demoNote')} {locMsg ? <b style={{ color: 'var(--red)' }}>{locMsg}</b> : null}</p>
          <div className="tabs" role="group">
            {['paid', 'volunteer'].map(k => (
              <button key={k} className="btn ghost tab" aria-pressed={type === k} onClick={() => setType(k)}>{T(k)}</button>
            ))}
          </div>
          <h2>{T('categories')}</h2>
          <div className="cats">
            {CATEGORIES.map(({ id, Icon }) => (
              <button key={id} className="cat" aria-pressed={cat === id} onClick={() => setCat(cat === id ? null : id)}>
                <Icon size={24} />{T('cat.' + id)}
              </button>
            ))}
          </div>
        </>
      ) : null}
      <div className="row" style={{ margin: '20px 0 12px', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{tab === 'explore' ? T('explore') : T('nearby')}</h2>
        {selects}
      </div>
      {list.length ? <div className="grid">{list.map(card)}</div> : <p className="panel">{T('noResults')}</p>}
    </div>
  )

  const savedJobs = st.s.saved.map(id => loc(id)).filter(Boolean)
  const savedPage = (
    <div>
      <h2>{T('savedWork')}</h2>
      {savedJobs.length ? <div className="grid">{savedJobs.map(j => card({ ...j, d: null }))}</div> : <p className="panel">{T('noSaved')}</p>}
    </div>
  )

  const hi = lang === 'hi'
  const pct = u ? wpPct(u.wp) : 0
  const wpLabel = wpDone
    ? (hi ? 'वर्कर प्रोफ़ाइल बदलें' : 'Edit worker profile')
    : (hi ? 'अपनी वर्कर प्रोफ़ाइल बनाएं' : 'Create your worker profile')
  const wpTitle = hi ? 'वर्कर प्रोफ़ाइल' : 'Worker profile'
  const wpDoneTxt = hi ? 'पूरी' : 'complete'

  const workerCard = isW ? (
    <div className="panel" style={{ marginBottom: 16 }}>
      <b>{wpTitle}: {pct}% {wpDoneTxt}</b>
      <div style={{ height: 8, background: '#ddd', borderRadius: 4, margin: '8px 0 12px' }}>
        <div style={{ height: 8, width: pct + '%', background: '#1a7f4b', borderRadius: 4 }} />
      </div>
      <button className="btn" onClick={() => setWiz(true)}>{wpLabel}</button>
    </div>
  ) : null

  let body = feed
  if (tab === 'saved') body = savedPage
  else if (tab === 'bookings' || tab === 'dashboard') {
    if (!u) body = <Gate lang={lang} kind={isC || tab === 'dashboard' ? 'dashboard' : 'bookings'} onLogin={toLogin} />
    else if (isC) body = <Dashboard lang={lang} st={st} jobs={jobs} go={go} />
    else body = <BookingsPage lang={lang} st={st} jobs={jobs} go={go} />
  } else if (tab === 'messages') {
    body = u ? <Inbox lang={lang} st={st} jobs={jobs} openKey={openKey} setOpenKey={setOpenKey} go={go} /> : <Gate lang={lang} kind="messages" onLogin={toLogin} />
  } else if (tab === 'profile') {
    body = u ? (
      <>
        {workerCard}
        <ProfilePage key={u.id} lang={lang} st={st} go={go} setLang={setLang} />
      </>
    ) : <Auth lang={lang} st={st} />
  }

  if (wiz && isW) {
    body = (
      <WorkerProfile
        key={u.id}
        user={u}
        onSave={st.saveWorkerProfile}
        onCancel={() => { setWiz(false); setTab('profile') }}
        onDone={() => { setWiz(false); setNote(''); setTab('bookings') }}
      />
    )
  }

  const nav = [
    ['home', HomeIcon], ['explore', Compass], ['saved', Bookmark],
    isC ? ['dashboard', LayoutDashboard] : ['bookings', CalendarCheck],
    ['messages', MessageCircle], ['profile', User],
  ]
  const cur = tab === 'bookings' && isC ? 'dashboard' : tab

  return (
    <>
      <header className="top">
        <div className="logo"><MapPin size={22} />{T('appName')}</div>
        <label className="field">
          <Search size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} onFocus={() => { if (tab !== 'home' && tab !== 'explore') go('explore') }} placeholder={T('search')} aria-label={T('search')} />
        </label>
        <button className="btn ghost" onClick={askLocation}><Navigation size={18} />{T('useLocation')}</button>
        <button className="btn ghost" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} aria-label="Language">
          <Languages size={18} />{lang === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </header>
      <main className="wrap">
        {note ? <p role="alert" className="panel"><b>{note}</b></p> : null}
        {body}
      </main>
      {detailId && loc(detailId) ? <Details job={loc(detailId)} lang={lang} sent={sentIds.has(detailId)} onInterest={onInterest} onClose={() => setDetailId(null)} /> : null}
      <nav className="bottom" aria-label="Main">
        {nav.map(([id, Icon]) => (
          <button key={id} aria-current={cur === id ? 'page' : undefined} onClick={() => go(id)}>
            <Icon size={22} />{T(id)}
          </button>
        ))}
      </nav>
    </>
  )
}