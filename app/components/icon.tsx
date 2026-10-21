export function Icon({kind,className=''}:{kind:string;className?:string}) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind==='workout'?<><path d="M7 9h10M7 15h10M4 7v10M7 5v14M17 5v14M20 7v10"/></>:
      kind==='arrow'?<path d="M5 12h14m-5-5 5 5-5 5"/>:
      kind==='check'?<path d="m5 12 4 4L19 6"/>:
      kind==='heart'?<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>:
      kind==='person'?<><circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>:
      kind==='users'?<><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-2-4"/></>:
      kind==='bolt'?<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>:
      <path d="m12 2 2.9 7.1L22 12l-7.1 2.9L12 22l-2.9-7.1L2 12l7.1-2.9L12 2Z"/>}
  </svg>;
}
