import { spawnSync } from 'node:child_process';
import { openSync, writeSync, closeSync, renameSync, rmSync, existsSync } from 'node:fs';
const destination='repvyn-active-emails.csv';
if(existsSync(destination)){console.error(`${destination} already exists. Move or rename it before exporting again.`);process.exit(1);}
const cell=value=>{const text=String(value??'');const safe=/^[=+\-@\t\r]/.test(text)?"'"+text:text;return '"'+safe.replaceAll('"','""')+'"';};
const temporary=destination+'.tmp';let handle;let count=0;
try{
 handle=openSync(temporary,'wx',0o600);
 writeSync(handle,['email','interest','joined_at_utc','consent_version'].map(cell).join(',')+'\r\n');
 let cursor='';
 while(true){
  const sql=`SELECT id,email,interest,created_at,consent_version FROM waitlist WHERE unsubscribed_at IS NULL AND id > '${cursor.replaceAll("'","''")}' ORDER BY id LIMIT 1000`;
  const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','repvyn-waitlist',process.argv.includes('--local')?'--local':'--remote','--command',sql,'--json'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.status!==0)throw new Error('Cloudflare query failed. Check your login and database permissions.');
  const blocks=JSON.parse(result.stdout);if(!Array.isArray(blocks)||blocks.some(block=>block.success===false))throw new Error('Cloudflare returned an unsuccessful query.');
  const rows=blocks.flatMap(block=>block.results||[]);
  for(const row of rows){writeSync(handle,[row.email,row.interest,new Date(row.created_at).toISOString(),row.consent_version].map(cell).join(',')+'\r\n');count++;}
  if(rows.length<1000)break;
  const next=rows.at(-1).id;if(next<=cursor)throw new Error('Export cursor did not advance.');cursor=next;
 }
 closeSync(handle);handle=undefined;renameSync(temporary,destination);
 console.log(`Exported ${count} active signups to ${destination}. Unsubscribed records and management tokens are excluded.`);
}catch(error){if(handle!==undefined)closeSync(handle);rmSync(temporary,{force:true});console.error('Email export failed:',error.message);process.exit(1);}
