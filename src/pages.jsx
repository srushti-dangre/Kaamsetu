import { useState } from 'react'
import { MapPin, IndianRupee, Clock, Bookmark, Bell, Eye, Languages, LifeBuoy, LogOut, ChevronRight, X, Send, ArrowLeft, Briefcase } from 'lucide-react'
import { t } from './i18n'
import { CATEGORIES } from './data'

export function JobCard({ job, lang, dist, onInterest, sent, saved, onSave, onDetails }) {
  const T = k => t(lang, k)
  const Cat = CATEGORIES.find(c => c.id === job.cat).Icon
  const vol = job.type === 'volunteer'
  const ago = job.posted < 24 ? job.posted + T('hr') : Math.round(job.posted / 24) + T('day')
  const label = sent ? T('interestSent') : (vol || job.mode === 'urgent') ? T('expressInterest') : T('bookNow')
  return (
    <article className={'card' + (job.mode === 'urgent' ? ' urgent' : '')}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row">
          <span className="ico"><Cat size={22} /></span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{job.title}</h3>
            <div className="muted">{T('cat.' + job.cat)} · {job.who}</div>
          </div>
        </div>
        <span className="muted">{ago}</span>
      </div>
      <div className="row">
        <span className={'tag ' + (vol ? 'vol' : '')}>{vol ? T('volunteer') : T('paid')}</span>
        <span className={'tag ' + (job.mode === 'urgent' ? 'urgent' : '')}>{T(job.mode)}</span>
      </div>
      <div className="panel">
        <div className="row"><MapPin size={16} />{job.area}{dist != null ? ' · ' + dist.toFixed(1) + ' ' + T('km') : ' · ' + T('locDemo')}</div>
        <div className="row"><IndianRupee size={16} /><b>{vol ? T('unpaid') : job.pay}</b></div>
        <div className="row"><Clock size={16} />{job.when} · {job.dur}</div>
        <div className="row">{job.skills.map(s => <span className="chip" key={s}>{s}</span>)}</div>
      </div>
      <p style={{ margin: 0 }}>{job.desc}</p>
      <div className="row">
        <button className="btn ghost" aria-pressed={saved} aria-label={saved ? T('unsave') : T('save')} onClick={() => onSave(job.id)}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="btn ghost" style={{ flex: 1 }} onClick={() => onDetails(job.id)}>{T('viewDetails')}</button>
        <button className="btn primary" style={{ flex: 1 }} disabled={sent} onClick={() => onInterest(job.id)}>{label}</button>
      </div>
    </article>
  )
}

export function Details({ job, lang, onClose, onInterest, sent }) {
  const T = k => t(lang, k)
  const vol = job.type === 'volunteer'
  const item = (k, v) => <div><div className="muted">{T(k)}</div><div>{v}</div></div>
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={job.title} onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>{job.title}</h2>
          <button className="btn ghost" aria-label={T('close')} onClick={onClose}><X size={18} /></button>
        </div>
        <div className="row">
          <span className={'tag ' + (vol ? 'vol' : '')}>{vol ? T('volunteer') : T('paid')}</span>
          <span className={'tag ' + (job.mode === 'urgent' ? 'urgent' : '')}>{T(job.mode)}</span>
          <span className="tag">{T('cat.' + job.cat)}</span>
        </div>
        <p style={{ margin: 0 }}>{job.desc}</p>
        <div className="panel">
          {item('where', job.area)}
          {item('pay', vol ? T('unpaid') : job.pay)}
          {item('when', job.when)}
          {item('dur', job.dur)}
          {item('skillsLbl', job.skills.join(', '))}
        </div>
        {vol ? <p className="panel" style={{ margin: 0 }}>{T('volWarn')}</p> : null}
        <button className="btn primary" disabled={sent} onClick={() => { onInterest(job.id); onClose() }}>
          {sent ? T('interestSent') : T('expressInterest')}
        </button>
      </div>
    </div>
  )
}

export function Login({ lang, st }) {
  const T = k => t(lang, k)
  const [f, setF] = useState({ name: '', role: 'worker', area: '' })
  const [err, setErr] = useState('')
  const go = e => {
    e.preventDefault()
    if (f.name.trim().length < 2) { setErr(T('errName')); return }
    st.signup({ ...f, name: f.name.trim(), skills: [], bio: '' })
  }
  return (
    <div className="card" style={{ maxWidth: 440, margin: '0 auto' }}>
      <h2 style={{ margin: 0 }}>{T('login')}</h2>
      <p className="muted">{T('demoAuth')}</p>
      <button className="btn primary" onClick={() => st.login('w1')}>{T('demoWorker')}</button>
      <button className="btn ghost" onClick={() => st.login('c1')}>{T('demoCustomer')}</button>
      <hr style={{ width: '100%', border: '1px solid #eee' }} />
      <h3 style={{ margin: 0 }}>{T('signUp')}</h3>
      <form onSubmit={go} className="card" style={{ boxShadow: 'none', padding: 0 }}>
        <label className="field"><input placeholder={T('name')} aria-label={T('name')} value={f.name} onChange={e => { setF({ ...f, name: e.target.value }); setErr('') }} /></label>
        <label className="field"><input placeholder={T('area')} aria-label={T('area')} value={f.area} onChange={e => setF({ ...f, area: e.target.value })} /></label>
        <div className="row">
          {['worker', 'customer'].map(r => (
            <button type="button" key={r} className="btn ghost" style={f.role === r ? { background: 'var(--ind)', color: '#fff' } : {}} onClick={() => setF({ ...f, role: r })}>{T(r)}</button>
          ))}
        </div>
        {err ? <b role="alert" style={{ color: 'var(--red)' }}>{err}</b> : null}
        <button className="btn primary" type="submit">{T('signUp')}</button>
      </form>
    </div>
  )
}

function Switch({ on, onChange, label }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={'switch' + (on ? ' on' : '')} onClick={onChange}><span /></button>
}

function Row({ icon: Icon, label, right, onClick, danger }) {
  const props = onClick ? { role: 'button', tabIndex: 0, onClick, onKeyDown: e => { if (e.key === 'Enter') onClick() } } : {}
  return (
    <div className={'rrow' + (danger ? ' danger' : '')} {...props}>
      <span className="ricon"><Icon size={18} /></span>
      <span style={{ flex: 1 }}>{label}</span>
      {right}
      {onClick && !danger ? <ChevronRight size={18} color="#9a9ab0" /> : null}
    </div>
  )
}

export function ProfilePage({ lang, st, go, setLang }) {
  const T = k => t(lang, k)
  const u = st.s.user
  const [p, setP] = useState(u)
  const [edit, setEdit] = useState(false)
  const [preview, setPreview] = useState('')
  const [msg, setMsg] = useState('')
  const nSaved = st.s.saved.length
  const nBook = st.s.interests.filter(i => i.userId === u.id).length

  const pick = e => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setMsg(T('errType')); return }
    if (file.size > 2 * 1024 * 1024) { setMsg(T('errSize')); return }
    setMsg('')
    setPreview(URL.createObjectURL(file))
  }
  const toggle = id => setP({ ...p, skills: p.skills.includes(id) ? p.skills.filter(x => x !== id) : [...p.skills, id] })
  const save = e => {
    e.preventDefault()
    if (p.name.trim().length < 2) { setMsg(T('errName')); return }
    st.saveProfile(p)
    setMsg(T('savedMsg'))
  }

  return (
    <div className="prof">
      {preview ? <img className="avatar" src={preview} alt="" /> : <div className="avatar">{u.name[0]}</div>}
      <h2 style={{ margin: '8px 0 0' }}>{u.name}</h2>
      <div className="muted">{u.area ? u.area + ' · ' : ''}{T(u.role)}</div>
      <button className="btn dark" onClick={() => setEdit(!edit)}>{edit ? T('done') : T('editProfile')}</button>

      {edit ? (
        <form onSubmit={save} className="card" style={{ width: '100%' }}>
          <label>{T('photo')} <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} /></label>
          <span className="muted">{T('photoNote')}</span>
          <label className="field"><input aria-label={T('name')} placeholder={T('name')} value={p.name} onChange={e => setP({ ...p, name: e.target.value })} /></label>
          <label className="field"><input aria-label={T('area')} placeholder={T('area')} value={p.area} onChange={e => setP({ ...p, area: e.target.value })} /></label>
          {u.role === 'worker' ? (
            <>
              <b>{T('skills')}</b>
              <div className="row">
                {CATEGORIES.map(c => (
                  <button type="button" key={c.id} className="chip" style={p.skills.includes(c.id) ? { background: 'var(--ind)', color: '#fff' } : {}} onClick={() => toggle(c.id)}>{T('cat.' + c.id)}</button>
                ))}
              </div>
              <label className="field"><input aria-label={T('bio')} placeholder={T('bio')} value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} /></label>
            </>
          ) : null}
          {msg ? <b role="status" style={{ color: msg === T('savedMsg') ? 'var(--green)' : 'var(--red)' }}>{msg}</b> : null}
          <button className="btn primary" type="submit">{T('saveProfile')}</button>
        </form>
      ) : null}

      <div className="gl">{T('myWork')}</div>
      <div className="group">
        <Row icon={Bookmark} label={T('savedWork')} right={<span className="badge">{nSaved}</span>} onClick={() => go('saved')} />
        <Row icon={Briefcase} label={T('bookings')} right={<span className="badge">{nBook}</span>} onClick={() => go('bookings')} />
        <Row icon={LifeBuoy} label={T('support')} onClick={() => window.alert(T('supportText'))} />
      </div>

      <div className="gl">{T('preferences')}</div>
      <div className="group">
        <Row icon={Bell} label={T('notifications')} right={<Switch on={st.s.prefs.notify} label={T('notifications')} onChange={() => st.pref('notify')} />} />
        <Row icon={Eye} label={T('visible')} right={<Switch on={st.s.prefs.visible} label={T('visible')} onChange={() => st.pref('visible')} />} />
        <Row icon={Languages} label={T('language')} right={<span className="muted">{lang === 'en' ? 'English' : 'हिन्दी'}</span>} onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} />
        <Row icon={LogOut} label={T('logout')} danger onClick={st.logout} />
      </div>
      <button className="link" onClick={st.reset}>{T('resetDemo')}</button>
    </div>
  )
}

export function BookingsPage({ lang, st, loc, go }) {
  const T = k => t(lang, k)
  const u = st.s.user
  if (u.role !== 'worker') return <p className="panel">{T('custSoon')}</p>
  const mine = st.s.interests.filter(i => i.userId === u.id)
  return (
    <div>
      <h2>{T('bookings')}</h2>
      <p className="muted">{T('bookNote')}</p>
      {!mine.length ? <p className="panel">{T('noInterests')}</p> : null}
      <div className="grid">
        {mine.map(i => {
          const j = loc(i.jobId)
          return (
            <div className="card" key={i.jobId}>
              <b>{j.title}</b>
              <span className="muted">{j.area} · {new Date(i.at).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')}</span>
              <span className="tag" style={{ alignSelf: 'flex-start' }}>{T('requested')}</span>
              <div className="row">
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => go('messages', i.jobId)}>{T('openChat')}</button>
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => st.withdraw(i.jobId)}>{T('withdraw')}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MessagesPage({ lang, st, loc, openJob, setOpenJob }) {
  const T = k => t(lang, k)
  const u = st.s.user
  const [text, setText] = useState('')
  if (u.role !== 'worker') return <p className="panel">{T('custSoon')}</p>
  const mine = st.s.interests.filter(i => i.userId === u.id)
  const fmt = d => new Date(d).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')

  if (openJob) {
    const j = loc(openJob)
    const list = st.s.messages[openJob + '|' + u.id] || []
    const send = (m, kind) => { if (m.trim()) { st.send(openJob, m.trim(), kind); setText('') } }
    return (
      <div className="chat">
        <div className="row">
          <button className="btn ghost" aria-label={T('back')} onClick={() => setOpenJob(null)}><ArrowLeft size={18} /></button>
          <b>{j.title}</b>
        </div>
        <p className="muted">{T('msgNote')}</p>
        <div className="bubbles">
          {list.map((m, i) => (
            <div key={i} className="bubble">
              {m.text}
              {m.kind === 'arrived' ? <div className="muted">{T('arrivedMark')}</div> : null}
              <div className="muted">{T('you')} · {fmt(m.at)}</div>
            </div>
          ))}
        </div>
        <div className="row">
          {['q1', 'q2', 'q3', 'q4', 'q5'].map(k => (
            <button key={k} className="chip" onClick={() => send(T(k), k === 'q2' ? 'arrived' : 'text')}>{T(k)}</button>
          ))}
        </div>
        <form className="row" onSubmit={e => { e.preventDefault(); send(text) }}>
          <label className="field"><input value={text} onChange={e => setText(e.target.value)} placeholder={T('typeMsg')} aria-label={T('typeMsg')} /></label>
          <button className="btn primary" type="submit" aria-label={T('send')}><Send size={18} /></button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>{T('messages')}</h2>
      {!mine.length ? <p className="panel">{T('noThreads')}</p> : null}
      <div className="grid">
        {mine.map(i => {
          const j = loc(i.jobId)
          const list = st.s.messages[i.jobId + '|' + u.id] || []
          const last = list[list.length - 1]
          return (
            <div className="card" key={i.jobId} role="button" tabIndex={0} onClick={() => setOpenJob(i.jobId)} onKeyDown={e => { if (e.key === 'Enter') setOpenJob(i.jobId) }}>
              <b>{j.title}</b>
              <span className="muted">{last ? last.text : T('typeMsg')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}