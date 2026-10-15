import { useState } from 'react'

const SKILLS = ['electrician', 'plumber', 'carpenter', 'painter', 'cleaner', 'cook', 'driver', 'technician', 'mason', 'gardener']
const AVAIL = ['Weekdays', 'Weekends', 'Full time', 'Part time', 'Evenings']
const STEPS = ['Personal', 'Work', 'Wages & location', 'Review']

// Shrinks a photo to a small JPEG thumbnail so it fits in localStorage.
function toThumb(file, cb) {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const size = 160
      const c = document.createElement('canvas')
      c.width = size; c.height = size
      const ctx = c.getContext('2d')
      const min = Math.min(img.width, img.height)
      ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size)
      cb(c.toDataURL('image/jpeg', 0.7))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

const box = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }
const input = { padding: '10px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #bbb', width: '100%', boxSizing: 'border-box' }
const err = { color: '#c0392b', fontSize: 13 }
const chip = on => ({
  padding: '8px 12px', borderRadius: 20, border: '1px solid ' + (on ? '#1a7f4b' : '#bbb'),
  background: on ? '#1a7f4b' : 'transparent', color: on ? '#fff' : 'inherit', cursor: 'pointer', fontSize: 14,
})

export default function WorkerProfile({ user, onSave, onCancel, onDone }) {
  const old = user.wp || {}
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [f, setF] = useState({
    photo: old.photo || '',
    fullName: old.fullName || user.name || '',
    about: old.about || user.bio || '',
    profession: old.profession || '',
    skills: old.skills || user.skills || [],
    experience: old.experience ?? '',
    availability: old.availability || '',
    wageType: old.wageType || 'daily',
    wage: old.wage || '',
    city: old.city || '',
    locality: old.locality || user.area || '',
  })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const validate = s => {
    const e = {}
    if (s === 0) {
      if (f.fullName.trim().length < 2) e.fullName = 'Please enter your full name.'
      if (f.about.trim().length < 10) e.about = 'Write a short intro (at least 10 characters).'
    }
    if (s === 1) {
      if (!f.profession.trim()) e.profession = 'Tell us your main profession.'
      if (!f.skills.length) e.skills = 'Pick at least one skill.'
      if (f.experience === '' || Number(f.experience) < 0 || Number(f.experience) > 60) e.experience = 'Enter years of experience (0 to 60).'
      if (!f.availability) e.availability = 'Choose when you are available.'
    }
    if (s === 2) {
      if (!f.wage || Number(f.wage) <= 0) e.wage = 'Enter your expected wage.'
      if (!f.city.trim()) e.city = 'Enter your city.'
      if (!f.locality.trim()) e.locality = 'Enter your area or locality.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep(step + 1) }
  const back = () => { setErrors({}); setStep(step - 1) }
  const save = () => {
    onSave({
      ...f,
      fullName: f.fullName.trim(), about: f.about.trim(), profession: f.profession.trim(),
      city: f.city.trim(), locality: f.locality.trim(),
      experience: Number(f.experience), wage: Number(f.wage),
    })
    setSaved(true)
  }
  const toggleSkill = s => set('skills', f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s])

  if (saved) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <h2>Profile saved</h2>
        <p>Customers can now see your profession, experience, wage and area.</p>
        <button className="btn" onClick={onDone}>Continue</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{old.done ? 'Edit worker profile' : 'Create your worker profile'}</h2>
      <div style={{ fontSize: 13, marginBottom: 6 }}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</div>
      <div style={{ height: 8, background: '#ddd', borderRadius: 4, marginBottom: 18 }}>
        <div style={{ height: 8, width: ((step + 1) / STEPS.length) * 100 + '%', background: '#1a7f4b', borderRadius: 4, transition: 'width .2s' }} />
      </div>

      {step === 0 && (
        <>
          <div style={box}>
            <label>Photo (optional)</label>
            {f.photo && <img src={f.photo} alt="Your profile" width="80" height="80" style={{ borderRadius: '50%', objectFit: 'cover' }} />}
            <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) toThumb(file, d => set('photo', d)) }} />
            {f.photo && <button type="button" className="btn ghost" onClick={() => set('photo', '')}>Remove photo</button>}
          </div>
          <div style={box}>
            <label>Full name</label>
            <input style={input} value={f.fullName} onChange={e => set('fullName', e.target.value)} />
            {errors.fullName && <span style={err}>{errors.fullName}</span>}
          </div>
          <div style={box}>
            <label>Mobile number</label>
            <input style={{ ...input, background: '#f3f3f3' }} value={user.phone || 'Not added'} disabled />
          </div>
          <div style={box}>
            <label>About you</label>
            <textarea style={input} rows={3} maxLength={300} value={f.about} onChange={e => set('about', e.target.value)} placeholder="Example: 5 years of experience in home repairs." />
            {errors.about && <span style={err}>{errors.about}</span>}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div style={box}>
            <label>Main profession</label>
            <input style={input} value={f.profession} onChange={e => set('profession', e.target.value)} placeholder="Example: Electrician" />
            {errors.profession && <span style={err}>{errors.profession}</span>}
          </div>
          <div style={box}>
            <label>Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS.map(s => <button type="button" key={s} style={chip(f.skills.includes(s))} onClick={() => toggleSkill(s)}>{s}</button>)}
            </div>
            {errors.skills && <span style={err}>{errors.skills}</span>}
          </div>
          <div style={box}>
            <label>Years of experience</label>
            <input style={input} type="number" min="0" max="60" inputMode="numeric" value={f.experience} onChange={e => set('experience', e.target.value)} />
            {errors.experience && <span style={err}>{errors.experience}</span>}
          </div>
          <div style={box}>
            <label>Availability</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AVAIL.map(a => <button type="button" key={a} style={chip(f.availability === a)} onClick={() => set('availability', a)}>{a}</button>)}
            </div>
            {errors.availability && <span style={err}>{errors.availability}</span>}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={box}>
            <label>Wage type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={chip(f.wageType === 'daily')} onClick={() => set('wageType', 'daily')}>Per day</button>
              <button type="button" style={chip(f.wageType === 'hourly')} onClick={() => set('wageType', 'hourly')}>Per hour</button>
            </div>
          </div>
          <div style={box}>
            <label>Expected wage (₹ {f.wageType === 'daily' ? 'per day' : 'per hour'})</label>
            <input style={input} type="number" min="1" inputMode="numeric" value={f.wage} onChange={e => set('wage', e.target.value)} />
            {errors.wage && <span style={err}>{errors.wage}</span>}
          </div>
          <div style={box}>
            <label>City</label>
            <input style={input} value={f.city} onChange={e => set('city', e.target.value)} />
            {errors.city && <span style={err}>{errors.city}</span>}
          </div>
          <div style={box}>
            <label>Area / locality</label>
            <input style={input} value={f.locality} onChange={e => set('locality', e.target.value)} />
            {errors.locality && <span style={err}>{errors.locality}</span>}
            <span style={{ fontSize: 12 }}>Only city and area are shared. Do not enter your home address.</span>
          </div>
        </>
      )}

      {step === 3 && (
        <div style={{ lineHeight: 1.7 }}>
          {f.photo && <img src={f.photo} alt="Your profile" width="80" height="80" style={{ borderRadius: '50%', objectFit: 'cover' }} />}
          <div><b>Name:</b> {f.fullName}</div>
          <div><b>Mobile:</b> {user.phone || 'Not added'}</div>
          <div><b>About:</b> {f.about}</div>
          <div><b>Profession:</b> {f.profession}</div>
          <div><b>Skills:</b> {f.skills.join(', ')}</div>
          <div><b>Experience:</b> {f.experience} years</div>
          <div><b>Availability:</b> {f.availability}</div>
          <div><b>Expected wage:</b> ₹{f.wage} {f.wageType === 'daily' ? 'per day' : 'per hour'}</div>
          <div><b>Location:</b> {f.locality}, {f.city}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'space-between' }}>
        {step > 0 ? <button type="button" className="btn ghost" onClick={back}>Back</button>
          : onCancel ? <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button> : <span />}
        {step < STEPS.length - 1
          ? <button type="button" className="btn" onClick={next}>Next</button>
          : <button type="button" className="btn" onClick={save}>Save profile</button>}
      </div>
    </div>
  )
}