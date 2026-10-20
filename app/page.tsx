'use client';
import { FormEvent, useRef, useState } from 'react';

function Icon({kind,className=''}:{kind:string,className?:string}){return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='arrow'?<path d="M5 12h14m-5-5 5 5-5 5"/>:kind==='check'?<path d="m5 12 4 4L19 6"/>:kind==='heart'?<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>:kind==='users'?<><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-2-4"/></>:kind==='bolt'?<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>:<path d="m12 2 2.9 7.1L22 12l-7.1 2.9L12 22l-2.9-7.1L2 12l7.1-2.9L12 2Z"/>}</svg>}

async function post(path:string,body:unknown){const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});const data=await response.json().catch(()=>({})) as {error?:string;canAnswer?:boolean};if(!response.ok)throw new Error(data.error||'Something went wrong. Please try again.');return data;}

export default function Home(){
 const [email,setEmail]=useState('');const [status,setStatus]=useState<'idle'|'loading'|'success'>('idle');const [error,setError]=useState('');const [canAnswer,setCanAnswer]=useState(false);const [answer,setAnswer]=useState('');const [saving,setSaving]=useState(false);const [answerError,setAnswerError]=useState('');const [privacy,setPrivacy]=useState(false);const [unsubscribed,setUnsubscribed]=useState(false);const [removing,setRemoving]=useState(false);const [demo,setDemo]=useState('');const successRef=useRef<HTMLHeadingElement>(null);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(status==='loading')return;setError('');setStatus('loading');try{const result=await post('/api/waitlist',{email,website:(new FormData(e.currentTarget)).get('website')});setCanAnswer(!!result.canAnswer);setStatus('success');requestAnimationFrame(()=>successRef.current?.focus());}catch(e){setError(e instanceof Error&&e.name!=='TimeoutError'?e.message:'We couldn’t connect. Please check your connection and try again.');setStatus('idle');}}
 async function saveInterest(value:string){if(saving)return;setSaving(true);setAnswerError('');try{await post('/api/interest',{interest:value});setAnswer(value);}catch{setAnswerError('Your email is saved. We couldn’t save your answer—please try again.');}finally{setSaving(false);}}
 async function unsubscribe(){setRemoving(true);setAnswerError('');try{await post('/api/unsubscribe',{});setUnsubscribed(true);}catch{setAnswerError('We couldn’t remove your signup. Please try again.');}finally{setRemoving(false);}}
 return <div className="site-shell">
  <a href="#main" className="skip-link">Skip to content</a>
  <header className="header"><a className="logo" href="/" aria-label="Repvyn home"><svg viewBox="205 273 875 220" role="img" aria-label="repvyn"><image href="/brand.jpg" width="1280" height="853"/></svg></a><span className="status-pill"><span/>In development</span></header>
  <main id="main" className="main-grid">
   <section className="offer" aria-labelledby="hero-title">
    <p className="eyebrow"><span className="tiny-line"/>A little movement. A fresh start.</p>
    <h1 id="hero-title">Your next 30 days<br className="desktop-break"/> of home fitness.<br/><span className="together">Together.<svg viewBox="0 0 370 16" aria-hidden="true"><path d="M3 11C102 1 258 1 366 8"/></svg></span></h1>
    <p className="intro">Equipment-free workouts, a 30-day starting plan and community support.</p>
    <div className="ai-note"><Icon kind="spark"/><p>AI guidance based on the time, experience and progress you share.</p></div>
    <div className="price"><p>Proposed founding membership</p><div><strong>US$39</strong><span>for your first 90 days</span></div><small>Access starts when beta access is delivered.</small></div>
    <div className="signup-area">
    {status==='success'?<div className="confirmation" aria-live="polite">
      <div className="confirmation-heading"><span className="success-icon"><Icon kind="check"/></span><div><h2 tabIndex={-1} ref={successRef}>{unsubscribed?'You’ve been removed.':'You’re on the list.'}</h2><p>{unsubscribed?'Your waitlist signup is no longer active.':'Your email is saved. We’ll share news as Repvyn takes shape.'}</p></div></div>
      {canAnswer&&!unsubscribed&&<>{answer?<p className="answer-thanks"><Icon kind="check"/>Thanks. Your answer is saved.</p>:<fieldset disabled={saving} className="interest"><legend>Would you be interested at US$39 for 90 days?</legend><p>Optional. This isn’t a commitment.</p><div className="interest-options">{[['yes','Yes, interested'],['maybe','Maybe'],['no','Not for me']].map(([value,label])=><button type="button" key={value} onClick={()=>saveInterest(value)}>{label}</button>)}</div>{saving&&<p role="status">Saving your answer…</p>}</fieldset>}<button className="text-button unsubscribe" onClick={unsubscribe} disabled={removing}>{removing?'Removing…':'Remove my signup'}</button></>}
      {answerError&&<p className="error" role="alert">{answerError}</p>}
    </div>:<form onSubmit={submit} className="signup-form" aria-busy={status==='loading'}>
      <label htmlFor="email">Be there from the beginning.</label><div className="form-row"><input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254} disabled={status==='loading'} aria-describedby={error?'signup-error signup-note':'signup-note'}/><button className="join-button" type="submit" disabled={status==='loading'}>{status==='loading'?<><span className="spinner"/>Joining…</>:<>Join the free waitlist<Icon kind="arrow"/></>}</button></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"/></div>
      {error&&<p id="signup-error" className="error" role="alert">{error}</p>}
      <p id="signup-note" className="signup-note"><strong>No payment today.</strong> Launch updates only. Unsubscribe anytime.</p>
    </form>}
    </div>
   </section>
   <aside className="preview-wrap" aria-label="Repvyn concept preview"><div className="concept-card">
     <div className="concept-top"><span className="concept-label">Concept preview</span><span className="mini-mark" aria-hidden="true"><i/><i/></span></div>
     <h2>Today, together.</h2><p className="card-subtitle">A little progress, on your terms.</p>
     <div className="workout-image"><svg viewBox="738 228 452 238" role="img" aria-label="A woman stretching at home in a bright living room"><image href="/reference.jpg" width="1280" height="853"/></svg><span className="image-label"><span/>Your space. Your pace.</span></div>
     <div className="workout-title"><h3>Full-body basics</h3><span className="workout-arrow" aria-hidden="true"><Icon kind="arrow"/></span></div>
     <p className="workout-meta">15 min<span>·</span>Beginner<span>·</span>No equipment</p>
     <div className="check-in"><span className="people-icon"><Icon kind="users"/></span><div><h3>Your daily check-in</h3><p>What will help you show up today?</p></div></div>
     <div className="check-in-options"><button type="button" aria-pressed={demo==='short'} onClick={()=>setDemo(demo==='short'?'':'short')}><Icon kind="bolt"/>A shorter session</button><button type="button" aria-pressed={demo==='encouragement'} onClick={()=>setDemo(demo==='encouragement'?'':'encouragement')}><Icon kind="heart"/>Some encouragement</button></div>
     <p className="demo-response" aria-live="polite">{demo==='short'?'A few minutes can be a good place to start.':demo==='encouragement'?'Start where you are. Every little step counts.':'An idea of what’s ahead. Repvyn is not available yet.'}</p>
   </div><div className="preview-caption"><span className="tiny-line"/>Progress that fits real life.</div></aside>
  </main>
  <footer><p>Your plan. Your pace. Your people.</p><div><button className="text-button" onClick={()=>setPrivacy(true)}>Privacy</button><span>© {new Date().getFullYear()} Repvyn</span></div></footer>
  {privacy&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setPrivacy(false)}}><div className="privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onKeyDown={e=>{if(e.key==='Escape')setPrivacy(false);if(e.key==='Tab')e.preventDefault();}}><span className="eyebrow">Your information</span><h2 id="privacy-title">A simple waitlist.</h2><p>We save your email address and signup date to manage the Repvyn waitlist and share launch updates. If you answer the optional price question, we also save that answer.</p><p>Joining is free and creates no payment commitment. You can remove your signup from the confirmation screen on this device. Future launch emails will include an unsubscribe option.</p><p>We use a necessary, secure cookie to let you manage your signup. This page uses no advertising trackers.</p><button className="join-button" autoFocus onClick={()=>setPrivacy(false)}>Got it<Icon kind="check"/></button></div></div>}
 </div>;
}
