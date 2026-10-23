import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createServer} from './server.mjs';
test('serves public files and rejects cross-origin and hostile-host requests',async()=>{
 const app=createServer();await new Promise(r=>app.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+app.address().port;
 try{
  assert.equal((await fetch(base)).status,200);
  assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await fetch(base+'/../server.mjs')).status,404);
  assert.equal((await fetch(base,{headers:{Origin:'https://example.invalid'}})).status,403);
  const hostile=await new Promise((resolve,reject)=>{
   const r=http.get(base,{headers:{Host:'attacker.invalid'}},res=>{res.resume();resolve(res.statusCode)});r.on('error',reject);
  });assert.equal(hostile,403);
 }finally{app.closeAllConnections();await new Promise(r=>app.close(r))}
});
