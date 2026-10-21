import { Brand } from './brand';

export function SiteFooter({onPrivacy}:{onPrivacy:()=>void}) {
  return <footer className="site-footer">
    <div className="footer-brand"><Brand onDark/><p>Your plan. Your pace. Your people.</p></div>
    <div className="footer-meta"><div className="footer-controls"><button type="button" className="text-button" onClick={onPrivacy}>Privacy</button><span>© 2026 Repvyn</span></div><p className="footer-concept-note">In development. Product concepts shown.</p></div>
  </footer>;
}
