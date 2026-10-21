export function Brand({className='',onDark=false}:{className?:string;onDark?:boolean}) {
  return <a className={`logo ${className}`} href="/" aria-label="Repvyn home">
    <svg viewBox="205 273 875 220" role="img" aria-label="repvyn"><image href="/brand.jpg" width="1280" height="853"/></svg>{onDark&&<span className="footer-logo-mark"><BrandMark/></span>}
  </a>;
}

export function BrandMark() {
  return <span className="mini-mark" aria-hidden="true"><i/><i/></span>;
}
