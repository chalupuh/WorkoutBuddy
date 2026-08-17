import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
createServer(async (req,res)=>{
  try {
    const relative = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '') || 'index.html';
    const data = await readFile(join(root,relative));
    res.writeHead(200,{'Content-Type':mime[extname(relative)]||'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Falcon Bench Club: http://127.0.0.1:4173'));
