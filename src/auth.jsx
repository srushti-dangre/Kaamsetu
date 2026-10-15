import { useState } from 'react'
import { t } from './lang'
import { hp } from './store'

export function Auth({ lang, st }) {
  const T = k => t(lang, k)
  const [mode, setMode] = useState('in')
  const [next, setNext] = useState('up')
  const [role, setRole] = useState('worker')
  const [f, setF] = useState({ name: '', phone: '', email: '', pw: '', id: '', otp: '', npw: '' })
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const accs = st.s.accounts

  const set = k => e => { setF({ ...f, [k]: e.target.value }); setErr('') }
  const go = m => { setMode(m); setErr(''); setInfo('') }
  const sendCode = n => {
    setCode(String(100000 + Math.floor(Math.random() * 900000)))
    setNext(n); setMode('otp'); setErr('')
  }
  const inp = (k, ph, type) => (
    <label className="field">
      <input type={type || 'text'} placeholder={ph} aria-label={ph} value={f[k]} onChange={set(k)} />
    </label>
  )

  const signIn = e => {
    e.preventDefault()
    const r = st.loginWith(f.id.trim(), f.pw)
    if (r) setErr(T(r))
  }
  const signUp = e => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr(T('errName'))
    if (!/^\d{10}$/.test(f.phone)) return setErr(T('badPhone'))
    if (f.email && !/\S+@\S+\.\S+/.test(f.email)) return setErr(T('badEmail'))
    if (f.pw.length < 6) return setErr(T('badPw'))
    const mail = f.email.toLowerCase()
    if (accs.some(a => a.phone === f.phone || (mail && a.email === mail))) return setErr(T('exists'))
    sendCode('up')
  }
  const forgot = e => {
    e.preventDefault()
    if (!accs.some(a => a.phone === f.phone)) return setErr(T('noAccount'))
    sendCode('reset')
  }
  const verify = e => {
    e.preventDefault()
    if (f.otp !== code) return setErr(T('badOtp'))
    if (next === 'up') {
      st.signup({ role, name: f.name.trim(), phone: f.phone, email: f.email.toLowerCase(), pw: hp(f.pw), area: '', skills: [], bio: '' })
    } else {
      setMode('reset'); setErr('')
    }
  }
  const reset = e => {
    e.preventDefault()
    if (f.npw.length < 6) return setErr(T('badPw'))
    st.resetPw(f.phone, f.npw)
    setF({ ...f, id: f.phone, pw: '', npw: '', otp: '' })
    setMode('in'); setErr(''); setInfo(T('pwUpdated'))
  }
  const google = () => {
    const m = (window.prompt(T('googlePrompt')) || '').trim().toLowerCase()
    if (/\S+@\S+\.\S+/.test(m)) st.google(m, role)
  }
  const msgs = (
    <>
      {err ? <b role="alert" style={{ color: 'var(--red)' }}>{err}</b> : null}
      {info ? <b role="status" style={{ color: 'var(--green)' }}>{info}</b> : null}
    </>
  )

  return (
    <div className="card auth">
      <div className="row">
        <span className="muted">{T('roleQ')}</span>
        {['worker', 'customer'].map(r => (
          <button type="button" key={r} className="btn ghost" aria-pressed={role === r}
            style={role === r ? { background: 'var(--ind)', color: '#fff' } : {}} onClick={() => setRole(r)}>{T(r)}</button>
        ))}
      </div>

      {mode === 'in' ? (
        <form onSubmit={signIn} className="stack">
          <h2 style={{ margin: 0 }}>{T('signIn')}</h2>
          {inp('id', T('idLabel'))}
          {inp('pw', T('password'), 'password')}
          {msgs}
          <button className="btn primary" type="submit">{T('signIn')}</button>
          <button type="button" className="link" onClick={() => go('forgot')}>{T('forgot')}</button>
          <button type="button" className="link" onClick={() => go('up')}>{T('newHere')}</button>
        </form>
      ) : null}

      {mode === 'up' ? (
        <form onSubmit={signUp} className="stack">
          <h2 style={{ margin: 0 }}>{T('signUp')}</h2>
          {inp('name', T('name'))}
          {inp('phone', T('phone'), 'tel')}
          {inp('email', T('emailOpt'), 'email')}
          {inp('pw', T('pwHint'), 'password')}
          {msgs}
          <button className="btn primary" type="submit">{T('sendOtp')}</button>
          <button type="button" className="link" onClick={() => go('in')}>{T('haveAcc')}</button>
        </form>
      ) : null}

      {mode === 'forgot' ? (
        <form onSubmit={forgot} className="stack">
          <h2 style={{ margin: 0 }}>{T('resetPw')}</h2>
          {inp('phone', T('phone'), 'tel')}
          {msgs}
          <button className="btn primary" type="submit">{T('sendOtp')}</button>
          <button type="button" className="link" onClick={() => go('in')}>{T('signIn')}</button>
        </form>
      ) : null}

      {mode === 'otp' ? (
        <form onSubmit={verify} className="stack">
          <h2 style={{ margin: 0 }}>{T('otpTitle')}</h2>
          <p className="panel" style={{ margin: 0 }}><b>{T('otpDemo')} {code}</b><span className="muted">{T('otpWhy')}</span></p>
          {inp('otp', T('otpLabel'))}
          {msgs}
          <button className="btn primary" type="submit">{T('verifyBtn')}</button>
        </form>
      ) : null}

      {mode === 'reset' ? (
        <form onSubmit={reset} className="stack">
          <h2 style={{ margin: 0 }}>{T('resetPw')}</h2>
          {inp('npw', T('newPw'), 'password')}
          {msgs}
          <button className="btn primary" type="submit">{T('resetPw')}</button>
        </form>
      ) : null}

            {mode === 'in' || mode === 'up' ? (
        <>
          <div className="muted" style={{ textAlign: 'center' }}>{T('or')}</div>
          <button type="button" className="btn ghost" onClick={google}>G&nbsp; {T('google')}</button>
        </>
      ) : null}
    </div>
  )
}