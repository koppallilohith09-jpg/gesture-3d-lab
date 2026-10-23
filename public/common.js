export const $=s=>document.querySelector(s);
export function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
export const notify=text=>{$('#status').textContent=text};
export function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{notify('Storage is full or unavailable. Export your data before closing.');return false}}
export function download(name,data,type='application/json'){const u=URL.createObjectURL(new Blob([data],{type})),a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
export async function database(name){return new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('items',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function dbAction(db,mode,action){return new Promise((resolve,reject)=>{const tx=db.transaction('items',mode),req=action(tx.objectStore('items'));tx.oncomplete=()=>resolve(req?.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
export function action(label,fn,cls){const b=el('button',label,cls);b.addEventListener('click',()=>Promise.resolve().then(fn).catch(e=>notify(e.message)));return b}
export const bytes=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':n<1073741824?(n/1048576).toFixed(1)+' MB':(n/1073741824).toFixed(1)+' GB';
export async function request(url,options={}){const r=await fetch(url,{...options,headers:{'X-Workspace':'1',...options.headers}});const b=await r.json();if(!r.ok)throw Error(b.error||'Request failed');return b}
window.addEventListener('unhandledrejection',e=>notify(e.reason?.message||'Operation failed'));
