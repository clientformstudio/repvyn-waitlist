import {database,json,readBody,getToken,failure} from '../helpers';
// Keep legacy price-interest values distinct from the new trial-interest answers.
// Accept old values during rollout for visitors with an already open page.
const allowedInterest=['very_interested','interested_need_more','just_exploring','yes','maybe','no'];
export async function POST(request:Request){try{const body=await readBody(request);if(!allowedInterest.includes(body.interest))return json({error:'Please choose one of the three answers.'},400);const token=getToken(request);if(!token)return json({error:'Please join the waitlist first.'},401);const result=await database().prepare('UPDATE waitlist SET interest=?,interest_updated_at=? WHERE manage_token=? AND unsubscribed_at IS NULL').bind(body.interest,Date.now(),token).run();if(!result.meta.changes)return json({error:'Please join the waitlist first.'},401);return json({ok:true});}catch(error){return failure(error);}}
