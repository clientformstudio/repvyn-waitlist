import {database,json,readBody,getToken,cookie,failure} from '../helpers';
export async function POST(request:Request){try{
 const body=await readBody(request);if(body.website)return json({ok:true,canAnswer:false});
 const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
 if(email.length>254||!/^([^\s@]+)@([^\s@.]+\.)+[^\s@.]{2,}$/.test(email))return json({error:'Please enter a valid email address.'},400);
 const db=database();const id=crypto.randomUUID();const token=crypto.randomUUID()+crypto.randomUUID();
 const result=await db.prepare('INSERT INTO waitlist (id,email,manage_token,consent_version,created_at) VALUES (?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET manage_token=excluded.manage_token, consent_version=excluded.consent_version, created_at=excluded.created_at, unsubscribed_at=NULL, interest=NULL, interest_updated_at=NULL WHERE waitlist.unsubscribed_at IS NOT NULL').bind(id,email,token,'waitlist-v1',Date.now()).run();
 if(result.meta.changes>0)return json({ok:true,canAnswer:true},201,{'Set-Cookie':cookie(token,new URL(request.url).protocol==='https:')});
 const previous=getToken(request);const owned=previous?await db.prepare('SELECT id FROM waitlist WHERE email=? AND manage_token=? AND unsubscribed_at IS NULL').bind(email,previous).first():null;
 return json({ok:true,canAnswer:!!owned});
 }catch(error){return failure(error);}}
