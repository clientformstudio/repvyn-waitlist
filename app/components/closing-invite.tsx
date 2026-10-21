import { Icon } from './icon';

export function ClosingInvite({onJoin}:{onJoin:()=>void}) {
  return <section className="closing-invite" aria-labelledby="closing-title">
    <div><h2 id="closing-title">You don’t need a perfect month to take a first step.</h2><p>Imagine opening Repvyn, knowing your next session—and having somewhere to check in afterwards.</p><p>If that’s something you’ve been looking for, join us while we build it.</p></div>
    <div className="closing-action"><button type="button" className="join-button" onClick={onJoin}>Join the free waitlist<Icon kind="arrow"/></button><p>Free to join. No payment today.</p></div>
  </section>;
}
