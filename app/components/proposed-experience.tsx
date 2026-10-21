import { BrandMark } from './brand';
import { Icon } from './icon';

const steps = [
  {title:'A starting point you can understand.',description:'A guided 30-day home-workout plan, so you spend less time deciding where to begin.'},
  {title:'Support that starts with your real life.',description:'Only have ten minutes? Still a beginner? Missed a session? Share that information. Repvyn’s planned AI support will help you choose suitable workout options around it.'},
  {title:'People you can check in with.',description:'Share a small win, ask a question or say you’re struggling. The community is being built to make encouragement part of the experience.'},
];

export function ProposedExperience() {
  return <section className="proposed-experience customer-experience" aria-labelledby="experience-title">
    <div className="customer-story">
      <h2 id="experience-title">Started strong. Missed a few days. Now what?</h2>
      <p>Have you ever opened a workout app and thought:</p>
      <ul className="illustrative-thoughts" aria-label="Illustrative workout situations">
        <li>‘I don’t have time for all this today.’</li>
        <li>‘I missed yesterday. Do I start over?’</li>
        <li>‘I just need to know what to do next.’</li>
      </ul>
      <p>That’s the experience we want to make easier.</p>
    </div>
      <ol className="experience-steps">
        {steps.map((step,index)=><li key={step.title}>
          <span className="step-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
          <div><h3>{step.title}</h3><p>{step.description}</p></div>
        </li>)}
      </ol>
      <figure className="conversation-concept" aria-labelledby="conversation-label">
        <figcaption id="conversation-label" className="concept-label">Concept example</figcaption>
        <div className="concept-message"><span className="message-avatar"><Icon kind="person"/></span><blockquote><span className="message-sender">You</span><p>I missed yesterday. I only have ten minutes today.</p></blockquote></div>
        <div className="concept-message reply"><span className="message-avatar"><BrandMark/></span><blockquote><span className="message-sender">Repvyn</span><p>Let’s fit a shorter session into today.</p></blockquote></div>
        <p className="concept-disclaimer">Planned guidance based on information you provide.</p>
      </figure>
  </section>;
}
