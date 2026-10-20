import { readFileSync, writeFileSync } from 'node:fs';
import { unstable_readConfig } from 'wrangler';

const supplied=process.env.REPVYN_DATABASE_ID?.trim();
if(supplied){
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(supplied)||supplied==='00000000-0000-4000-8000-000000000000'){
  console.error('REPVYN_DATABASE_ID must be the Database ID copied from your Cloudflare D1 database.');process.exit(1);
 }
 // The checked-in file is plain JSON. Database creation through Wrangler may
 // add comments, so obtain binding information through Wrangler when no
 // browser-build variable is supplied.
 const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));
 config.d1_databases=[{binding:'DB',database_name:'repvyn-waitlist',database_id:supplied}];
 writeFileSync('wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
}else{
 const config=unstable_readConfig({config:'wrangler.jsonc'});
 if(!config.d1_databases?.some(binding=>binding.binding==='DB'&&binding.database_id&&binding.database_id!=='00000000-0000-4000-8000-000000000000')){
  console.error('Add REPVYN_DATABASE_ID under Cloudflare Build variables. Copy its value from D1 SQL Database > repvyn-waitlist > Database ID.');process.exit(1);
 }
}
console.log('Cloudflare build configured with the DB database binding.');
