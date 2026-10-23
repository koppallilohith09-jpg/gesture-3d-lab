export function handControl(points){
 if(!points||points.length<21)return null;
 const pinch=Math.hypot(points[4].x-points[8].x,points[4].y-points[8].y),scale=Math.hypot(points[0].x-points[9].x,points[0].y-points[9].y)||.1;
 return{yaw:(.5-points[9].x)*Math.PI*2,pitch:(points[9].y-.5)*Math.PI,pinching:pinch/scale<.35,zoom:Math.max(3.3,Math.min(9,8-scale*12))};
}
