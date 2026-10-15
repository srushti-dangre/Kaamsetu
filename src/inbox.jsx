import { MessageCircle, CalendarCheck, LayoutDashboard } from 'lucide-react'
import { t } from './lang'
import { jl } from './data'
import { Chat, threadsFor } from './employer'

const L = {
  en: {
    title: 'Messages', empty: 'No conversations yet',
    emptyText: 'When you express interest in work, or a worker responds to your job, your chat appears here.',
    browse: 'Browse work', login: 'Log in or sign up',
    gMsgT: 'Log in to chat', gMsgX: 'Sign in to message workers and employers about your jobs.',
    gBookT: 'Log in to see your bookings', gBookX: 'Sign in to track the work you have applied for.',
    gDashT: 'Log in to open your dashboard', gDashX: 'Sign in to post work and manage workers who showed interest.',
    noMsg: 'No messages yet. Say hello.', you: 'You: ',
  },
  hi: {
    title: 'संदेश', empty: 'अभी कोई बातचीत नहीं',
    emptyText: 'जब आप किसी काम में रुचि दिखाएँगे, या कोई कामगार आपके काम पर जवाब देगा, तो चैट यहाँ दिखेगी।',
    browse: 'काम खोजें', login: 'लॉग इन या साइन अप करें',
    gMsgT: 'चैट के लिए लॉग इन करें', gMsgX: 'अपने काम के बारे में कामगारों और नियोक्ताओं को संदेश भेजने के लिए साइन इन करें।',
    gBookT: 'अपनी बुकिंग देखने के लिए लॉग इन करें', gBookX: 'जिन कामों के लिए आपने आवेदन किया है, उन्हें देखने के लिए साइन इन करें।',
    gDashT: 'डैशबोर्ड खोलने के लिए लॉग इन करें', gDashX: 'काम पोस्ट करने और रुचि दिखाने वाले कामगारों को देखने के लिए साइन इन करें।',
    noMsg: 'अभी कोई संदेश नहीं। नमस्ते कहें।', you: 'आप: ',
  },
}

export function Gate({ lang, kind, onLogin }) {
  const l = L[lang]
  const map = {
    messages: [MessageCircle, l.gMsgT, l.gMsgX],
    bookings: [CalendarCheck, l.gBookT, l.gBookX],
    dashboard: [LayoutDashboard, l.gDashT, l.gDashX],
  }
  const [Icon, title, text] = map[kind]
  return (
    <div className="empty">
      <span className="eicon"><Icon size={32} /></span>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p className="muted" style={{ margin: 0, maxWidth: 360 }}>{text}</p>
      <button className="btn primary" onClick={onLogin}>{l.login}</button>
    </div>
  )
}

const when = (lang, d) => new Date(d).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })

export function Inbox({ lang, st, jobs, openKey, setOpenKey, go }) {
  const l = L[lang]
  const me = st.s.user
  const list = threadsFor(st, me, jobs)
  const open = list.find(x => x.key === openKey)

  if (open) {
    return <Chat lang={lang} st={st} me={me} other={open.other} threadKey={open.key} title={jl(open.j, lang).title} onBack={() => setOpenKey(null)} />
  }
  if (!list.length) {
    return (
      <div className="empty">
        <span className="eicon"><MessageCircle size={32} /></span>
        <h2 style={{ margin: 0 }}>{l.empty}</h2>
        <p className="muted" style={{ margin: 0, maxWidth: 360 }}>{l.emptyText}</p>
        <button className="btn primary" onClick={() => go('home')}>{l.browse}</button>
      </div>
    )
  }
  return (
    <div className="inbox">
      <h2>{l.title}</h2>
      <div className="convs">
        {list.map(x => {
          const msgs = st.s.messages[x.key] || []
          const last = msgs[msgs.length - 1]
          const name = x.other ? x.other.name : '?'
          return (
            <div key={x.key} className="conv" role="button" tabIndex={0} onClick={() => setOpenKey(x.key)} onKeyDown={e => { if (e.key === 'Enter') setOpenKey(x.key) }}>
              <span className="cavatar">{name[0]}</span>
              <div className="cbody">
                <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                  <b>{name}</b>
                  {last ? <span className="muted">{when(lang, last.at)}</span> : null}
                </div>
                <div className="muted">{jl(x.j, lang).title}</div>
                <div className="csnip">{last ? (last.from === me.id ? l.you : '') + last.text : l.noMsg}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}