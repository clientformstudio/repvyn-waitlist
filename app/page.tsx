'use client';
import { useRef, useState } from 'react';
import { Icon } from './components/icon';
import { Brand } from './components/brand';
import { ConceptPreview } from './components/concept-preview';
import { WaitlistForm, type WaitlistHandle } from './components/waitlist-form';
import { ProposedExperience } from './components/proposed-experience';
import { ClosingInvite } from './components/closing-invite';
import { SiteFooter } from './components/site-footer';

export default function Home(){
 const [privacy,setPrivacy]=useState(false);
 const waitlistRef=useRef<WaitlistHandle>(null);
 return <div className="site-shell">
  <a href="#main" className="skip-link">Skip to content</a>
  <header className="header"><Brand/></header>
  <main id="main"><div className="main-grid">
   <section className="offer" aria-labelledby="hero-title">
    <p className="hero-badge">IN DEVELOPMENT · EQUIPMENT-FREE HOME FITNESS</p>
    <h1 id="hero-title">Imagine a workout plan<br className="desktop-break"/> that <mark>fits the day</mark> you actually have.</h1>
    <div className="hero-story">
      <p>Some days, you’re ready for a full session. Other days, you have ten minutes—and you’re trying not to give up again.</p>
      <p className="hero-both">We’re building Repvyn for both.</p>
      <p>A 30-day starting plan, equipment-free home workouts and a community to keep showing up with.</p>
    </div>
    <div className="ai-note"><span className="guidance-dot" aria-hidden="true"/><p>Tell us your time, your experience and how things are going. Our planned AI guidance will use what you share to help you find your next step.</p></div>
    <WaitlistForm ref={waitlistRef}/>
    <div className="price customer-price"><p>Planned founding membership: <strong>US$39</strong> for your first 90 days.</p><small>Access starts when beta access is delivered.</small></div>
   </section>
   <ConceptPreview/>
  </div><ProposedExperience/><ClosingInvite onJoin={()=>waitlistRef.current?.focusSignup()}/>
  </main>
  <SiteFooter onPrivacy={()=>setPrivacy(true)}/>
  {privacy&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setPrivacy(false)}}><div className="privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onKeyDown={e=>{if(e.key==='Escape')setPrivacy(false);if(e.key==='Tab')e.preventDefault();}}><span className="eyebrow">Your information</span><h2 id="privacy-title">A simple waitlist.</h2><p>We save your email address and signup date to manage the Repvyn waitlist and share launch updates. If you answer the optional interest question, we also save that answer.</p><p>Joining is free and creates no payment commitment. You can remove your signup from the confirmation screen on this device. Future launch emails will include an unsubscribe option.</p><p>We use a necessary, secure cookie to let you manage your signup. This page uses no advertising trackers.</p><button className="join-button" autoFocus onClick={()=>setPrivacy(false)}>Got it<Icon kind="check"/></button></div></div>}
 </div>;
}
