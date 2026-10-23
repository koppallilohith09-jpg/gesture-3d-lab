import {$,notify} from './common.js';import {handControl} from './core.js';import * as THREE from './vendor/three.module.js';
const canvas=$('#scene');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true})}catch{notify('WebGL unavailable. Enable graphics acceleration.');throw Error('WebGL required')}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.z=6;
scene.add(new THREE.HemisphereLight(0xadeaff,0x13253f,2));const light=new THREE.DirectionalLight(0xffd496,3);light.position.set(3,4,5);scene.add(light);
const group=new THREE.Group();scene.add(group);
const blue=new THREE.MeshStandardMaterial({color:0x3d9fae,metalness:.5,roughness:.35}),gold=new THREE.MeshStandardMaterial({color:0xffc56c,metalness:.6,roughness:.3});
function mesh(geo,mat,x=0,y=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,0);group.add(m);return m}
function build(){
 while(group.children.length){const c=group.children[0];c.geometry.dispose();group.remove(c)}
 const v=$('#model').value;
 if(v==='planet'){mesh(new THREE.SphereGeometry(1,48,32),blue);const ring=mesh(new THREE.TorusGeometry(1.6,.025,8,100),gold);ring.rotation.x=1.2;mesh(new THREE.SphereGeometry(.13,16,12),gold,1.6)}
 else if(v==='molecule'){
  mesh(new THREE.SphereGeometry(.55,32,24),blue);mesh(new THREE.SphereGeometry(.3,24,16),gold,-.8,-.6);mesh(new THREE.SphereGeometry(.3,24,16),gold,.8,-.6);
  for(const side of[-1,1]){const bond=mesh(new THREE.CylinderGeometry(.07,.07,1,12),gold,side*.4,-.3);bond.rotation.z=side*-.93}
 }else mesh(new THREE.IcosahedronGeometry(1.25,0),blue);
 draw();
}
function draw(){renderer.render(scene,camera)}
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,drag=false,lastX=0,lastY=0,lastTime=performance.now(),animation=0;
function animate(now){if(!paused&&!drag&&!running)group.rotation.y+=Math.min(now-lastTime,50)*.0002;lastTime=now;draw();animation=requestAnimationFrame(animate)}
$('#model').onchange=build;
function zoom(n){camera.position.z=Math.max(3.3,Math.min(9,camera.position.z+n));draw()}
$('#left').onclick=()=>group.rotation.y-=.2;$('#right').onclick=()=>group.rotation.y+=.2;
$('#zoom-in').onclick=()=>zoom(-.4);$('#zoom-out').onclick=()=>zoom(.4);
$('#reset').onclick=()=>{camera.position.z=6;group.rotation.set(0,0,0)};
function label(){$('#pause').textContent=paused?'Resume motion':'Pause motion'}label();$('#pause').onclick=()=>{paused=!paused;label()};
canvas.onpointerdown=e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)};
canvas.onpointermove=e=>{if(!drag)return;group.rotation.y+=(e.clientX-lastX)*.01;group.rotation.x+=(e.clientY-lastY)*.01;lastX=e.clientX;lastY=e.clientY};
canvas.onpointerup=()=>drag=false;canvas.onpointercancel=()=>drag=false;
const resize=new ResizeObserver(()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();draw()});resize.observe(canvas);
let stream=null,landmarker=null,running=false,cameraFrame=0,previousVideo=-1,lastDetect=0,generation=0;
function stop(){generation++;running=false;cancelAnimationFrame(cameraFrame);stream?.getTracks().forEach(t=>t.stop());stream=null;$('#camera').srcObject=null;$('#start-camera').disabled=false;$('#stop-camera').disabled=true;$('#tracking').textContent='Camera off.'}
$('#stop-camera').onclick=stop;
$('#start-camera').onclick=async()=>{
 const token=++generation;$('#start-camera').disabled=true;$('#stop-camera').disabled=false;
 try{
  $('#tracking').textContent='Loading local hand tracking…';
  if(!landmarker){
   const {FilesetResolver,HandLandmarker}=await import('/deps/vision/vision_bundle.mjs'),vision=await FilesetResolver.forVisionTasks('/deps/vision/wasm');
   landmarker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'/models/hand_landmarker.task'},runningMode:'VIDEO',numHands:1});
  }
  if(token!==generation)return;
  const acquired=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480},audio:false});
  if(token!==generation){acquired.getTracks().forEach(t=>t.stop());return}
  stream=acquired;$('#camera').srcObject=stream;await $('#camera').play();running=true;previousVideo=-1;
  function track(now){
   if(!running)return;
   try{
    if($('#camera').currentTime!==previousVideo&&now-lastDetect>65){
     previousVideo=$('#camera').currentTime;lastDetect=now;
     const result=landmarker.detectForVideo($('#camera'),now),control=handControl(result.landmarks[0]);
     if(control){if(control.pinching){camera.position.z=control.zoom;$('#tracking').textContent='Pinch detected / zoom control'}else{group.rotation.y=control.yaw;group.rotation.x=control.pitch;$('#tracking').textContent='Hand detected / rotate control'}}
     else $('#tracking').textContent='Show one hand to the camera.';
    }
    cameraFrame=requestAnimationFrame(track);
   }catch(e){stop();notify('Tracking stopped: '+e.message)}
  }
  cameraFrame=requestAnimationFrame(track);
 }catch(e){stop();notify('Camera could not start: '+e.message+'. Run npm install and npm run setup:model first.')}
};
window.addEventListener('pagehide',()=>{stop();cancelAnimationFrame(animation);resize.disconnect();landmarker?.close();renderer.dispose()});
build();animation=requestAnimationFrame(animate);
