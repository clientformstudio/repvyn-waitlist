import { env } from 'cloudflare:workers';
export function database():D1Database {if(!env.DB)throw new Error('Waitlist storage unavailable');return env.DB;}
export function json(value:unknown,status=200,headers:Record<string,string>={}){return Response.json(value,{status,headers:{'Cache-Control':'no-store',...headers}});}
export async function readBody(request:Request){
 const origin=request.headers.get('Origin');
 if(request.headers.get('Sec-Fetch-Site')==='cross-site'||(origin&&origin!==new URL(request.url).origin))throw new Error('ORIGIN');
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Error('INVALID');
 if(Number(request.headers.get('Content-Length')||0)>2048)throw new Error('INVALID');
 const raw=await request.text();if(raw.length>2048)throw new Error('INVALID');return JSON.parse(raw);
}
export function getToken(request:Request){return request.headers.get('Cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith('repvyn_signup='))?.slice(14)||'';}
export function cookie(token:string,secure:boolean){return `repvyn_signup=${token}; Path=/; Max-Age=7776000; HttpOnly; SameSite=Strict${secure?'; Secure':''}`;}
export function failure(error:unknown){const reason=error instanceof Error?error.message:'';if(reason==='ORIGIN')return json({error:'Please submit the form from this page.'},403);if(reason==='INVALID'||error instanceof SyntaxError)return json({error:'Please enter a valid email address and try again.'},400);console.error('Waitlist storage request failed');return json({error:'We couldn’t save that right now. Please try again in a moment.'},503);}
