'use client';
import { FormEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Icon } from './icon';

export type WaitlistHandle = { focusSignup:()=>void };
type Interest = 'very_interested' | 'interested_need_more' | 'just_exploring';
const interestOptions: {value:Interest;label:string}[] = [
  {value:'very_interested',label:'Very interested—I’d like to try it'},
  {value:'interested_need_more',label:'Interested, but I need to see more'},
  {value:'just_exploring',label:'Just exploring'},
];

async function post(path:string,body:unknown) {
  const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  const data=await response.json().catch(()=>({})) as {error?:string;canAnswer?:boolean;interest?:string|null};
  if(!response.ok)throw new Error(data.error||'Something went wrong. Please try again.');
  return data;
}

export const WaitlistForm = forwardRef<WaitlistHandle>(function WaitlistForm(_,ref) {
  const [email,setEmail]=useState('');
  const [status,setStatus]=useState<'idle'|'loading'|'success'>('idle');
  const [error,setError]=useState('');
  const [canAnswer,setCanAnswer]=useState(false);
  const [answer,setAnswer]=useState<Interest|null>(null);
  const [skipped,setSkipped]=useState(false);
  const [saving,setSaving]=useState(false);
  const [answerError,setAnswerError]=useState('');
  const [unsubscribed,setUnsubscribed]=useState(false);
  const [removing,setRemoving]=useState(false);
  const areaRef=useRef<HTMLDivElement>(null);
  const emailRef=useRef<HTMLInputElement>(null);
  const successRef=useRef<HTMLHeadingElement>(null);

  useImperativeHandle(ref,()=>({focusSignup(){
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    areaRef.current?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});
    if(emailRef.current&&!emailRef.current.disabled)emailRef.current.focus({preventScroll:true});
    else successRef.current?.focus({preventScroll:true});
  }}));

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(status==='loading')return;
    const website=new FormData(event.currentTarget).get('website');
    setError('');setStatus('loading');
    try {
      const result=await post('/api/waitlist',{email,website});
      setCanAnswer(!!result.canAnswer);
      setAnswer(interestOptions.find(option=>option.value===result.interest)?.value??null);
      setStatus('success');
      requestAnimationFrame(()=>successRef.current?.focus({preventScroll:true}));
    } catch(error) {
      setError(error instanceof Error&&error.name!=='TimeoutError'?error.message:'We couldn’t connect. Please check your connection and try again.');setStatus('idle');
    }
  }

  async function saveInterest(value:Interest) {
    if(saving)return;setSaving(true);setAnswerError('');
    try {await post('/api/interest',{interest:value});setAnswer(value);}
    catch {setAnswerError('Your signup is saved. We couldn’t save your answer. Try again, or skip for now.');}
    finally {setSaving(false);}
  }

  function skipQuestion() {setSkipped(true);setAnswerError('');}

  async function unsubscribe() {
    setRemoving(true);setAnswerError('');
    try {await post('/api/unsubscribe',{});setUnsubscribed(true);}
    catch {setAnswerError('We couldn’t remove your signup. Please try again.');}
    finally {setRemoving(false);}
  }

  return <div id="signup" className="signup-area" ref={areaRef}>
    {status==='success'?<div className="confirmation">
      <div className="confirmation-heading"><span className="success-icon"><Icon kind="check"/></span><div><h2 tabIndex={-1} ref={successRef}>{unsubscribed?'You’ve been removed.':'You’re on the list!'}</h2><p>{unsubscribed?'Your waitlist signup is no longer active.':'Your email is saved. We’ll share news as Repvyn takes shape.'}</p></div></div>
      {canAnswer&&!unsubscribed&&<>
        {answer?<p className="answer-thanks" role="status"><Icon kind="check"/>Thanks—that helps us shape Repvyn.</p>:!skipped&&<div className="optional-question">
          <fieldset disabled={saving||removing} className="interest" aria-describedby="interest-note" aria-busy={saving}>
            <legend>How interested are you in trying Repvyn?</legend>
            <p id="interest-note">Optional. Help us understand what you’re looking for.</p>
            <div className="interest-options">{interestOptions.map(option=><button type="button" key={option.value} onClick={()=>saveInterest(option.value)}>{option.label}</button>)}</div>
          </fieldset>
          {saving&&<p className="answer-saving" role="status"><span className="spinner"/>Saving your answer…</p>}
          {answerError&&<p className="error" role="alert">{answerError}</p>}
          <button type="button" className="text-button skip-interest" disabled={saving} onClick={skipQuestion}>Skip for now</button>
        </div>}
        {skipped&&<p className="skip-confirmation" role="status">You’re all set. Your signup is saved.</p>}
        <button type="button" className="text-button unsubscribe" onClick={unsubscribe} disabled={removing||saving}>{removing?'Removing…':'Remove my signup'}</button>
      </>}
      {answerError&&(answer||skipped)&&<p className="error" role="alert">{answerError}</p>}
    </div>:<form onSubmit={submit} className="signup-form" aria-busy={status==='loading'}>
      <label htmlFor="email">Be there from the beginning.</label>
      <div className="form-row"><input id="email" ref={emailRef} name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254} disabled={status==='loading'} aria-describedby={error?'signup-error signup-note':'signup-note'}/><button className="join-button" type="submit" disabled={status==='loading'}>{status==='loading'?<><span className="spinner"/>Joining…</>:<>Join the free waitlist<Icon kind="arrow"/></>}</button></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"/></div>
      {error&&<p id="signup-error" className="error" role="alert">{error}</p>}
      <p id="signup-note" className="signup-note"><strong>No payment today.</strong> Get launch updates and an invitation when access is ready. Unsubscribe anytime.</p>
    </form>}
  </div>;
});
