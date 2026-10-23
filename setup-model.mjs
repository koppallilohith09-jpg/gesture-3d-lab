import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const dir=path.join(path.dirname(fileURLToPath(import.meta.url)),'public/models');fs.mkdirSync(dir,{recursive:true});
const response=await fetch('https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task');
if(!response.ok)throw Error('Model download failed: '+response.status);
fs.writeFileSync(path.join(dir,'hand_landmarker.task'),Buffer.from(await response.arrayBuffer()));
console.log('Official MediaPipe hand model saved locally.');
