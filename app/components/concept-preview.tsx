'use client';
import { useState } from 'react';
import { Icon } from './icon';

export function ConceptPreview() {
  const [demo,setDemo]=useState('');
  return <aside className="preview-wrap" aria-label="Repvyn concept preview">
    <div className="concept-card">
      <div className="preview-heading"><span className="concept-label">Concept preview</span><h2>Today, together.</h2><p>A little progress, on your terms.</p><small>Your space. Your pace.</small></div>
      <div className="preview-photo"><img src="/home-stretch.webp" width="1536" height="1024" alt="A woman enjoying a gentle stretch in a bright living room" loading="lazy"/></div>
      <div className="preview-controls">
        <div className="workout-summary"><span className="people-icon"><Icon kind="workout"/></span><div><h3>Full-body basics</h3><p>15 min · Beginner · No equipment</p></div></div>
        <div className="check-in"><span className="people-icon"><Icon kind="person"/></span><div><h3>Your daily check-in</h3><p>What will help you show up today?</p></div></div>
        <div className="check-in-options"><button type="button" aria-pressed={demo==='short'} onClick={()=>setDemo(demo==='short'?'':'short')}><Icon kind="bolt"/>A shorter session</button><button type="button" aria-pressed={demo==='encouragement'} onClick={()=>setDemo(demo==='encouragement'?'':'encouragement')}><Icon kind="heart"/>Some encouragement</button></div>
      </div>
      <p className="demo-response" aria-live="polite">{demo==='short'?'A few minutes can be a good place to start.':demo==='encouragement'?'Start where you are. Every little step counts.':'An idea of what’s ahead. Repvyn is not available yet.'}</p>
    </div>
  </aside>;
}
