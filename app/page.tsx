'use client';
import { useRef, useState } from 'react';
import { Icon } from './components/icon';
import { Brand, BrandMark } from './components/brand';
import { WaitlistForm, type WaitlistHandle } from './components/waitlist-form';
import { ProposedExperience } from './components/proposed-experience';
import { ClosingInvite } from './components/closing-invite';
import { SiteFooter } from './components/site-footer';

export default function Home(){
 const [privacy,setPrivacy]=useState(false);
 const [demo,setDemo]=useState('');
 const waitlistRef=useRef<WaitlistHandle>(null);
 return <div className="site-shell">
  <a href="#main" className="skip-link">Skip to content</a>
  <header className="header"><Brand/></header>
  <main id="main"><div className="main-grid">
   <section className="offer" aria-labelledby="hero-title">
    <p className="hero-badge">IN DEVELOPMENT · EQUIPMENT-FREE HOME FITNESS</p>
    <h1 id="hero-title">Imagine a workout plan that fits the day you actually have.</h1>
    <div className="hero-story">
      <p>Some days, you’re ready for a full session. Other days, you have ten minutes—and you’re trying not to give up again.</p>
      <p className="hero-both">We’re building Repvyn for both.</p>
      <p>A 30-day starting plan, equipment-free home workouts and a community to keep showing up with.</p>
    </div>
    <div className="ai-note"><Icon kind="spark"/><p>Tell us your time, your experience and how things are going. Our planned AI guidance will use what you share to help you find your next step.</p></div>
    <div className="price customer-price"><p>Planned founding membership: <strong>US$39</strong> for your first 90 days.</p><small>Access starts when beta access is delivered.</small></div>
    <WaitlistForm ref={waitlistRef}/>
   </section>
   <aside className="preview-wrap" aria-label="Repvyn concept preview"><div className="concept-card">
     <div className="concept-top"><span className="concept-label">Concept preview</span><BrandMark/></div>
     <h2>Today, together.</h2><p className="card-subtitle">A little progress, on your terms.</p>
     <div className="workout-image"><svg viewBox="738 228 452 238" role="img" aria-label="A woman stretching at home in a bright living room"><image href="/reference.jpg" width="1280" height="853"/></svg><span className="image-label"><span/>Your space. Your pace.</span></div>
     <div className="workout-title"><h3>Full-body basics</h3><span className="workout-arrow" aria-hidden="true"><Icon kind="arrow"/></span></div>
     <p className="workout-meta">15 min<span>·</span>Beginner<span>·</span>No equipment</p>
     <div className="check-in"><span className="people-icon"><Icon kind="users"/></span><div><h3>Your daily check-in</h3><p>What will help you show up today?</p></div></div>
     <div className="check-in-options"><button type="button" aria-pressed={demo==='short'} onClick={()=>setDemo(demo==='short'?'':'short')}><Icon kind="bolt"/>A shorter session</button><button type="button" aria-pressed={demo==='encouragement'} onClick={()=>setDemo(demo==='encouragement'?'':'encouragement')}><Icon kind="heart"/>Some encouragement</button></div>
     <p className="demo-response" aria-live="polite">{demo==='short'?'A few minutes can be a good place to start.':demo==='encouragement'?'Start where you are. Every little step counts.':'An idea of what’s ahead. Repvyn is not available yet.'}</p>
   </div></aside>
  </div><ProposedExperience/><ClosingInvite onJoin={()=>waitlistRef.current?.focusSignup()}/>
  </main>
  <SiteFooter onPrivacy={()=>setPrivacy(true)}/>
  {privacy&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setPrivacy(false)}}><div className="privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onKeyDown={e=>{if(e.key==='Escape')setPrivacy(false);if(e.key==='Tab')e.preventDefault();}}><span className="eyebrow">Your information</span><h2 id="privacy-title">A simple waitlist.</h2><p>We save your email address and signup date to manage the Repvyn waitlist and share launch updates. If you answer the optional interest question, we also save that answer.</p><p>Joining is free and creates no payment commitment. You can remove your signup from the confirmation screen on this device. Future launch emails will include an unsubscribe option.</p><p>We use a necessary, secure cookie to let you manage your signup. This page uses no advertising trackers.</p><button className="join-button" autoFocus onClick={()=>setPrivacy(false)}>Got it<Icon kind="check"/></button></div></div>}
 </div>;
}
