import { useState, useEffect } from 'react'

const KEY = 'kaamsetu-v3'
const SK = 'kaamsetu-uid'

// Toy hash for the demo. NOT secure.
export const hp = s => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return String(h) }

// Worker profile completion (0-100). Used by the profile card and the interest gate.
export const wpPct = wp => {
  if (!wp) return 0
  const checks = [
    wp.fullName, wp.profession, wp.skills && wp.skills.length, wp.experience !== '' && wp.experience != null,
    wp.wage, wp.city, wp.locality, wp.about, wp.availability, wp.photo,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export const DEMO = [
  {
    id: 'w1', role: 'worker', name: 'Ravi Shinde', phone: '9000000001', email: '', pw: hp('demo123'),
    area: 'Andheri East', skills: ['electrician', 'technician'],
    bio: 'Electrician with 6 years of home wiring and repair experience.',
    wp: {
      done: true, photo: '', fullName: 'Ravi Shinde', profession: 'Electrician', skills: ['electrician', 'technician'],
      experience: 6, wageType: 'daily', wage: 900, city: 'Mumbai', locality: 'Andheri East', availability: 'Weekdays',
      about: 'Electrician with 6 years of home wiring and repair experience.', updatedAt: '2026-01-01T00:00:00.000Z',
    },
  },
  { id: 'c1', role: 'customer', name: 'Meera Joshi', phone: '9000000002', email: '', pw: hp('demo123'), area: 'Powai', skills: [], bio: '' },
]
const init = { accounts: DEMO, jobs: [], interests: [], saved: {}, messages: {}, prefs: { notify: true, visible: true } }

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...init, ...JSON.parse(raw) } : init
  } catch (e) {
    return init
  }
}

export function useStore() {
  const [sh, setSh] = useState(load)
  const [uid, setUid] = useState(() => sessionStorage.getItem(SK))

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(sh)) } catch (e) { console.warn('Storage full', e) }
  }, [sh])
  useEffect(() => {
    const f = e => { if (e.key === KEY) setSh(load()) }
    window.addEventListener('storage', f)
    return () => window.removeEventListener('storage', f)
  }, [])

  const user = sh.accounts.find(a => a.id === uid) || null
  const login = id => { sessionStorage.setItem(SK, id); setUid(id) }

  return {
    s: { ...sh, user, saved: sh.saved[uid] || [] },
    login,
    logout: () => { sessionStorage.removeItem(SK); setUid(null) },
    loginWith: (id, pw) => {
      const low = id.toLowerCase()
      const a = sh.accounts.find(x => x.phone === id || (x.email && x.email === low))
      if (!a) return 'noAccount'
      if (!a.pw || a.pw !== hp(pw)) return 'badLogin'
      login(a.id)
      return ''
    },
    signup: a => {
      const n = { ...a, id: 'u' + Date.now() }
      setSh(p => ({ ...p, accounts: [...p.accounts, n] }))
      login(n.id)
    },
    google: (email, role) => {
      const a = sh.accounts.find(x => x.email === email)
      if (a) { login(a.id); return }
      const n = { id: 'g' + Date.now(), role, name: email.split('@')[0], phone: '', email, pw: '', area: '', skills: [], bio: '' }
      setSh(p => ({ ...p, accounts: [...p.accounts, n] }))
      login(n.id)
    },
    resetPw: (phone, pw) => setSh(p => ({ ...p, accounts: p.accounts.map(a => (a.phone === phone ? { ...a, pw: hp(pw) } : a)) })),
    saveProfile: a => setSh(p => ({ ...p, accounts: p.accounts.map(x => (x.id === a.id ? a : x)) })),
    saveWorkerProfile: wp => setSh(p => ({
      ...p,
      accounts: p.accounts.map(x => (x.id === uid
        ? { ...x, name: wp.fullName || x.name, area: wp.locality || wp.city || x.area, skills: wp.skills || [], bio: wp.about || '', wp: { ...wp, done: true, updatedAt: new Date().toISOString() } }
        : x)),
    })),
    addJob: j => setSh(p => ({ ...p, jobs: [j, ...p.jobs] })),
    interest: jobId => setSh(p => {
      if (p.interests.some(i => i.jobId === jobId && i.userId === uid)) return p
      return { ...p, interests: [...p.interests, { jobId, userId: uid, status: 'requested', at: new Date().toISOString() }] }
    }),
    withdraw: jobId => setSh(p => ({ ...p, interests: p.interests.filter(i => !(i.jobId === jobId && i.userId === uid)) })),
    setStatus: (jobId, userId, status) => setSh(p => ({
      ...p, interests: p.interests.map(i => (i.jobId === jobId && i.userId === userId ? { ...i, status } : i)),
    })),
    toggleSave: id => setSh(p => {
      const cur = p.saved[uid] || []
      return { ...p, saved: { ...p.saved, [uid]: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] } }
    }),
    send: (key, text, kind) => setSh(p => {
      const m = { from: uid, text, kind: kind || 'text', at: new Date().toISOString() }
      return { ...p, messages: { ...p.messages, [key]: [...(p.messages[key] || []), m] } }
    }),
    pref: key => setSh(p => ({ ...p, prefs: { ...p.prefs, [key]: !p.prefs[key] } })),
    reset: () => { localStorage.removeItem(KEY); sessionStorage.removeItem(SK); window.location.reload() },
  }
}