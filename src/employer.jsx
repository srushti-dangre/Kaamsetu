import { useState } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { t } from './lang'
import { CATEGORIES, jl } from './data'

const fmt = (lang, d) => new Date(d).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')

export function Chat({ lang, st, me, other, threadKey, title, onBack }) {
  const T = k => t(lang, k)
  const [text, setText] = useState('')
  const list = st.s.messages[threadKey] || []
  const send = (m, kind) => { if (m.trim()) { st.send(threadKey, m.trim(), kind); setText('') } }
  const quick = me.role === 'worker' ? ['q1', 'q2', 'q3', 'q4', 'q5'] : ['q3', 'q4']
  return (
    <div className="chat">
      <div className="row">
        <button className="btn ghost" aria-label={T('back')} onClick={onBack}><ArrowLeft size={18} /></button>
        <b>{title} · {other ? other.name : ''}</b>
      </div>
      <p className="muted">{T('msgNote')}</p>
      <div className="bubbles">
        {list.map((m, i) => (
          <div key={i} className={'bubble ' + (m.from === me.id ? 'mine' : 'theirs')}>
            {m.text}
            {m.kind === 'arrived' ? <div className="muted">{T('arrivedMark')}</div> : null}
            <div className="muted">{m.from === me.id ? T('you') : (other ? other.name : '')} · {fmt(lang, m.at)}</div>
          </div>
        ))}
      </div>
      <div className="row">
        {quick.map(k => (
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

export function threadsFor(st, me, jobs) {
  const out = []
  st.s.interests.forEach(i => {
    const j = jobs.find(x => x.id === i.jobId)
    if (!j) return
    const mine = me.role === 'worker' ? i.userId === me.id : j.owner === me.id
    if (!mine) return
    const w = st.s.accounts.find(a => a.id === i.userId)
    const c = st.s.accounts.find(a => a.id === j.owner)
    out.push({ i, j, key: i.jobId + '|' + i.userId, other: me.role === 'worker' ? c : w })
  })
  return out
}

export function MessagesPage({ lang, st, jobs, openKey, setOpenKey }) {
  const T = k => t(lang, k)
  const me = st.s.user
  const list = threadsFor(st, me, jobs)
  const open = list.find(x => x.key === openKey)
  if (open) {
    return <Chat lang={lang} st={st} me={me} other={open.other} threadKey={open.key} title={jl(open.j, lang).title} onBack={() => setOpenKey(null)} />
  }
  return (
    <div>
      <h2>{T('messages')}</h2>
      {!list.length ? <p className="panel">{T('noThreads')}</p> : null}
      <div className="grid">
        {list.map(x => {
          const msgs = st.s.messages[x.key] || []
          const last = msgs[msgs.length - 1]
          return (
            <div className="card" key={x.key} role="button" tabIndex={0} onClick={() => setOpenKey(x.key)} onKeyDown={e => { if (e.key === 'Enter') setOpenKey(x.key) }}>
              <b>{jl(x.j, lang).title}</b>
              <span className="muted">{x.other ? x.other.name : ''}</span>
              <span>{last ? last.text : T('typeMsg')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BookingsPage({ lang, st, jobs, go }) {
  const T = k => t(lang, k)
  const me = st.s.user
  const list = threadsFor(st, me, jobs)
  return (
    <div>
      <h2>{T('bookings')}</h2>
      <p className="muted">{T('bookNote')}</p>
      {!list.length ? <p className="panel">{T('noInterests')}</p> : null}
      <div className="grid">
        {list.map(x => (
          <div className="card" key={x.key}>
            <b>{jl(x.j, lang).title}</b>
            <span className="muted">{jl(x.j, lang).area} · {fmt(lang, x.i.at)}</span>
            <span className={'tag ' + (x.i.status === 'accepted' ? 'vol' : '')} style={{ alignSelf: 'flex-start' }}>{T(x.i.status)}</span>
            <div className="row">
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => go('messages', x.key)}>{T('openChat')}</button>
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => st.withdraw(x.i.jobId)}>{T('withdraw')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PostJob({ lang, st, onDone }) {
  const T = k => t(lang, k)
  const me = st.s.user
  const [f, setF] = useState({ title: '', cat: 'electrician', type: 'paid', mode: 'flexible', area: me.area || '', pay: '', when: '', dur: '', desc: '' })
  const [msg, setMsg] = useState('')
  const set = k => e => { setF({ ...f, [k]: e.target.value }); setMsg('') }
  const submit = e => {
    e.preventDefault()
    if (f.title.trim().length < 3 || f.desc.trim().length < 5) { setMsg(T('errJob')); return }
    st.addJob({
      id: 'j' + Date.now(), title: f.title.trim(), cat: f.cat, type: f.type, mode: f.mode, who: me.name,
      area: f.area || '—', lat: 19.0760, lng: 72.8777, pay: f.type === 'paid' && f.pay ? '₹' + f.pay : '',
      dur: f.dur, when: f.when, skills: [T('cat.' + f.cat)], posted: 0, desc: f.desc.trim(), owner: me.id,
    })
    setMsg(T('postedMsg'))
    onDone()
  }
  const box = (k, ph) => <label className="field"><input placeholder={ph} aria-label={ph} value={f[k]} onChange={set(k)} /></label>
  const sel = (k, opts, label) => (
    <label className="field">
      <select aria-label={label} value={f[k]} onChange={set(k)} style={{ border: 0, flex: 1, background: 'transparent', minHeight: 44 }}>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
  return (
    <form onSubmit={submit} className="card">
      <h3 style={{ margin: 0 }}>{T('postWork')}</h3>
      {box('title', T('jobTitle'))}
      {sel('cat', CATEGORIES.map(c => [c.id, T('cat.' + c.id)]), T('categories'))}
      <div className="row">
        {sel('type', [['paid', T('paid')], ['volunteer', T('volunteer')]], T('typeLbl'))}
        {sel('mode', [['urgent', T('urgent')], ['scheduled', T('scheduled')], ['flexible', T('flexible')]], T('urgencyLbl'))}
      </div>
      {box('area', T('where'))}
      {f.type === 'paid' ? box('pay', T('budget')) : null}
      {box('when', T('when'))}
      {box('dur', T('dur'))}
      <label className="field"><textarea placeholder={T('descr')} aria-label={T('descr')} value={f.desc} onChange={set('desc')} rows={3} style={{ border: 0, outline: 0, flex: 1, background: 'transparent', padding: '10px 0', font: 'inherit' }} /></label>
      {msg ? <b role="status" style={{ color: msg === T('postedMsg') ? 'var(--green)' : 'var(--red)' }}>{msg}</b> : null}
      <button className="btn primary" type="submit">{T('publish')}</button>
    </form>
  )
}

export function Dashboard({ lang, st, jobs, go }) {
  const T = k => t(lang, k)
  const hi = lang === 'hi'
  const me = st.s.user
  const [show, setShow] = useState(false)
  const mine = jobs.filter(j => j.owner === me.id)
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{T('dashboard')}</h2>
        <button className="btn primary" onClick={() => setShow(!show)}>{T('postWork')}</button>
      </div>
      {show ? <PostJob lang={lang} st={st} onDone={() => setShow(false)} /> : null}
      <h3>{T('myPosted')}</h3>
      {!mine.length ? <p className="panel">{T('noPosted')}</p> : null}
      <div className="grid">
        {mine.map(j0 => {
          const j = jl(j0, lang)
          const apps = st.s.interests.filter(i => i.jobId === j0.id)
          return (
            <div className="card" key={j0.id}>
              <b>{j.title}</b>
              <span className="muted">{j.area} · {j0.type === 'volunteer' ? T('unpaid') : j.pay}</span>
              <b>{T('applicants')} ({apps.length})</b>
              {!apps.length ? <span className="muted">{T('noApplicants')}</span> : null}
              {apps.map(i => {
                const w = st.s.accounts.find(a => a.id === i.userId)
                const p = w && w.wp && w.wp.done ? w.wp : null
                return (
                  <div key={i.userId} className="panel">
                    <div className="row">
                      {p && p.photo ? <img src={p.photo} alt="" width="40" height="40" style={{ borderRadius: '50%', objectFit: 'cover' }} /> : null}
                      <b>{w ? w.name : '?'}</b>
                      <span className={'tag ' + (i.status === 'accepted' ? 'vol' : '')}>{T(i.status)}</span>
                    </div>
                    {p ? (
                      <div style={{ lineHeight: 1.6, margin: '6px 0' }}>
                        <div><b>{p.profession}</b> · {p.experience} {hi ? 'वर्ष अनुभव' : 'yrs experience'}</div>
                        <div>₹{p.wage} {p.wageType === 'hourly' ? (hi ? 'प्रति घंटा' : 'per hour') : (hi ? 'प्रति दिन' : 'per day')}</div>
                        <div className="muted">{p.locality}, {p.city} · {p.availability}</div>
                      </div>
                    ) : (
                      <div className="muted" style={{ margin: '6px 0' }}>
                        {w && w.area ? w.area + ' · ' : ''}{hi ? 'प्रोफ़ाइल अधूरी' : 'Profile not completed'}
                      </div>
                    )}
                    <div className="row">
                      <button className="btn ghost" onClick={() => go('messages', j0.id + '|' + i.userId)}>{T('openChat')}</button>
                      <button className="btn ghost" onClick={() => st.setStatus(j0.id, i.userId, 'accepted')}>{T('accept')}</button>
                      <button className="btn ghost" onClick={() => st.setStatus(j0.id, i.userId, 'rejected')}>{T('reject')}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}