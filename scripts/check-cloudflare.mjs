import { unstable_readConfig } from 'wrangler';
const config = unstable_readConfig({config:'wrangler.jsonc'});
const database=config.d1_databases?.find(binding=>binding.binding==='DB');
if(!database?.database_id || database.database_id==='00000000-0000-4000-8000-000000000000'){
 console.error('Create the Cloudflare database first: npm run cloudflare:database');
 process.exit(1);
}
console.log('Cloudflare database DB is configured.');
