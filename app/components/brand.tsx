export function Brand({className=''}:{className?:string}) {
  return <a className={`logo ${className}`} href="/" aria-label="Repvyn home">
    <svg viewBox="205 273 875 220" role="img" aria-label="repvyn"><image href="/brand.jpg" width="1280" height="853"/></svg>
  </a>;
}

export function BrandMark() {
  return <span className="mini-mark" aria-hidden="true"><i/><i/></span>;
}
