import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {useTheme} from './ThemeToggle';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const smooth=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};

export default function NetworkCanvas({time,onReady}){
 const {dark}=useTheme();const darkRef=useRef(dark);
 const host=useRef(null),engine=useRef(null),playhead=useRef(time),ready=useRef(onReady);
 useEffect(()=>{playhead.current=time;engine.current?.render(time);},[time]);
 useEffect(()=>{darkRef.current=dark;engine.current?.setTheme(dark);},[dark]);
 useEffect(()=>{
  const container=host.current;let renderer;const cleanups=[];
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{container.dataset.fallback='true';ready.current?.();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=1.05;
  container.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,80),pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.8;
  const world=new THREE.Group();scene.add(world);
  scene.add(new THREE.HemisphereLight(0xffffff,0x99c7b5,2.4));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(3,6,5);scene.add(key);
  const fill=new THREE.DirectionalLight(0xb9f7df,2);fill.position.set(-4,1,-3);scene.add(fill);
  const materials={white:new THREE.MeshStandardMaterial({color:0xf5faf5,roughness:.28,metalness:.15}),green:new THREE.MeshStandardMaterial({color:0x164f42,roughness:.3,metalness:.3}),lime:new THREE.MeshStandardMaterial({color:0xd7f466,roughness:.3,metalness:.05}),steel:new THREE.MeshStandardMaterial({color:0x96b9ac,roughness:.22,metalness:.7}),teal:new THREE.MeshStandardMaterial({color:0x138b78,roughness:.3,metalness:.2}),glass:new THREE.MeshPhysicalMaterial({color:0xb0e8d1,transparent:true,opacity:.48,roughness:.15,metalness:.1,side:THREE.DoubleSide})};
  const box=(w,h,d,material,x=0,y=0,z=0,parent=world)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:0x537b6c,transparent:true,opacity:.22}));mesh.add(edges);return mesh;};
  const core=new THREE.Group();world.add(core);core.position.y=.3;
  // Natural greenhouse architecture with a continuous pitched glass roof.
  const frame=new THREE.MeshStandardMaterial({color:0xddd7c5,roughness:.5,metalness:.25});
  const stone=new THREE.MeshStandardMaterial({color:0xb9b5a2,roughness:.92});
  const glazing=new THREE.MeshPhysicalMaterial({color:0xd4e5dc,transparent:true,opacity:.32,roughness:.08,metalness:.05,side:THREE.DoubleSide});
  const bottom=box(2.3,.24,1.95,stone,0,-.78,0,core);
  const body=box(2.12,1.35,1.78,glazing,0,0,0,core);
  const lid=new THREE.Group();lid.position.y=.79;core.add(lid);
  const slope=Math.atan2(.76,1.16),roofWidth=Math.hypot(.76,1.16);
  for(const side of [-1,1]){
   const panel=box(roofWidth,.025,2.04,glazing,side*.58,.3,0,lid);panel.rotation.z=-side*slope;
   for(const z of [-1,-.5,0,.5,1]){const beam=box(roofWidth,.045,.045,frame,side*.58,.32,z,lid);beam.rotation.z=-side*slope;}
   box(.045,.045,2.08,frame,side*1.16,-.08,0,lid);
  }
  box(.065,.065,2.12,frame,0,.7,0,lid);
  for(const z of [-.91,.91]){
   const triangle=new THREE.Shape();triangle.moveTo(-1.06,0);triangle.lineTo(1.06,0);triangle.lineTo(0,.7);triangle.closePath();
   const pane=new THREE.Mesh(new THREE.ShapeGeometry(triangle),glazing);pane.position.set(0,.65,z);core.add(pane);
  }
  for(const x of [-1.04,-.35,.35,1.04]){
   box(.065,1.5,.07,frame,x,0,.91,core);
   box(.065,1.5,.07,frame,x,0,-.91,core);
  }
  for(const z of [-.9,0,.9])for(const x of [-1.07,1.07])box(.065,1.5,.07,frame,x,0,z,core);
  for(const y of [-.64,.2,.67]){
   box(2.19,.065,.07,frame,0,y,.92,core);
   box(2.19,.065,.07,frame,0,y,-.92,core);
   for(const x of [-1.08,1.08])box(.07,.065,1.86,frame,x,y,0,core);
  }
  const strap=box(.48,.95,.07,frame,0,-.22,.96,core);
  box(.3,.7,.075,glazing,0,-.16,1.01,core);
  box(.04,.06,.04,materials.lime,.13,-.2,1.07,core);
  const face=new THREE.Group();core.add(face);
  box(.62,.17,.06,materials.green,0,.43,.99,face);
  for(let i=0;i<4;i++)box(.045,.045,.02,materials.lime,(i%2)*.065-.03,.46-Math.floor(i/2)*.065,1.03,face);
  for(const x of [-.73,.73])for(const z of [-.45,.38]){
   box(.44,.14,.46,materials.green,x,-.58,z,core);
   for(let i=0;i<3;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.14,12,8),materials.teal);leaf.scale.set(.65,1.5,.8);leaf.position.set(x+(i-1)*.13,-.35,z);core.add(leaf);}
  }
  for(let i=0;i<3;i++)box(.7+i*.22,.1,.25,stone,0,-.72-i*.1,1.05+i*.19,core);
  const scanner=box(2.25,.025,1.94,materials.glass.clone(),0,.1,0,core);
  const nodePositions=[new THREE.Vector3(-3.1,-.8,1.15),new THREE.Vector3(2.65,-.55,1.8),new THREE.Vector3(2.5,.3,-2.1),new THREE.Vector3(-2.25,.1,-2.3)];
  const nodes=nodePositions.map((point,index)=>{const group=new THREE.Group();group.position.copy(point);world.add(group);const base=new THREE.Mesh(new THREE.CylinderGeometry(.67,.79,.18,48),materials.white);base.position.y=-.22;group.add(base);box(.62,.58,.58,index===1?materials.lime:materials.white,0,.18,0,group);box(.12,.6,.6,materials.teal,0,.18,0,group);return group;});
  nodes.forEach(node=>{node.visible=false;});
  const routes=[],pulses=[];
  for(let i=0;i<nodes.length;i++){
   const start=nodePositions[i].clone().add(new THREE.Vector3(0,-.35,0)),end=nodePositions[(i+1)%4].clone().add(new THREE.Vector3(0,-.35,0));
   const curve=new THREE.CatmullRomCurve3([start,new THREE.Vector3(start.x,-1.1,start.z),new THREE.Vector3((start.x+end.x)/2,-1.12,(start.z+end.z)/2),new THREE.Vector3(end.x,-1.1,end.z),end]);
   const line=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.012,5,false),materials.teal);line.visible=false;world.add(line);routes.push(curve);
   const pulse=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),materials.lime);pulse.visible=false;world.add(pulse);pulses.push(pulse);
  }
  const ringMaterial=new THREE.LineBasicMaterial({color:0x90b7a6,transparent:true,opacity:.35});
  for(let i=0;i<3;i++){const points=[];for(let j=0;j<=120;j++){const a=j/120*Math.PI*2,r=2.2+i*.67;points.push(new THREE.Vector3(Math.cos(a)*r,-1.26-i*.005,Math.sin(a)*r));}const ring=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),ringMaterial);ring.visible=false;world.add(ring);}
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const context=shadowCanvas.getContext('2d');let shadowTexture;
  if(context){const gradient=context.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(20,65,45,.22)');gradient.addColorStop(1,'rgba(20,65,45,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);shadowTexture=new THREE.CanvasTexture(shadowCanvas);const plane=new THREE.Mesh(new THREE.PlaneGeometry(7,5),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));plane.rotation.x=-Math.PI/2;plane.visible=false;plane.position.y=-1.3;world.add(plane);}
  let drag=null,azimuth=-.35,elevation=.48,width=1,height=1;
  const render=value=>{
   const t=Number.isFinite(value)?Math.max(0,Math.min(value,25)):0;
   const explode=smooth(16,19,t)*(1-smooth(22,25,t));
   lid.position.y=.79;bottom.position.y=-.78-explode*.25;strap.scale.set(1+explode*.17,1+explode*.24,1+explode*.17);face.position.z=explode*.2;scanner.position.y=Math.sin(t*.8)*.35;scanner.material.opacity=.12+smooth(8,11,t)*(1-smooth(14,17,t))*.25;
   core.rotation.y=.13*Math.sin(t*.25);core.position.y=.3+Math.sin(t*.65)*.08;world.rotation.y=azimuth;
   nodes.forEach((node,index)=>{node.position.y=nodePositions[index].y+Math.sin(t*.8+index)*.04;});pulses.forEach((pulse,index)=>pulse.position.copy(routes[index].getPointAt((t*.12+index*.22)%1)));
   const distance=width/height<1?9.5:8.8;camera.position.set(0,distance*Math.sin(elevation),distance*Math.cos(elevation));camera.lookAt(0,-.12,0);renderer.render(scene,camera);
  };
  const resize=()=>{width=container.clientWidth;height=container.clientHeight;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render(playhead.current);};
  const observer=new ResizeObserver(resize);observer.observe(container);
  const down=event=>{drag=[event.clientX,event.clientY];renderer.domElement.setPointerCapture(event.pointerId);};
  const move=event=>{if(!drag)return;azimuth+=(event.clientX-drag[0])*.007;elevation=THREE.MathUtils.clamp(elevation+(event.clientY-drag[1])*.005,.15,1);drag=[event.clientX,event.clientY];render(playhead.current);};
  const up=()=>{drag=null;};for(const [event,handler] of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up]]){renderer.domElement.addEventListener(event,handler);cleanups.push(()=>renderer.domElement.removeEventListener(event,handler));}
  const lost=event=>{event.preventDefault();container.dataset.fallback='true';};renderer.domElement.addEventListener('webglcontextlost',lost);cleanups.push(()=>renderer.domElement.removeEventListener('webglcontextlost',lost));
  const setTheme=isDark=>{
   materials.lime.color.set(0xb8ed49);materials.white.color.set(isDark?0x769962:0xf0f5df);materials.green.color.set(isDark?0x114527:0x245b35);materials.steel.color.set(isDark?0x739582:0x96b9ac);materials.teal.color.set(isDark?0x4b9953:0x50864b);materials.glass.color.set(isDark?0x94c68c:0xc1e0b0);
   ringMaterial.color.set(isDark?0x578c70:0x90b7a6);ringMaterial.opacity=isDark?.4:.35;renderer.toneMappingExposure=isDark?1:1.05;scene.environmentIntensity=isDark?.55:.8;key.intensity=isDark?2.4:4;fill.intensity=isDark?1:2;render(playhead.current);
  };
  engine.current={render,setTheme};setTheme(darkRef.current);resize();ready.current?.();
  return()=>{engine.current=null;observer.disconnect();cleanups.forEach(fn=>fn());scene.traverse(object=>{object.geometry?.dispose();if(object.material&&!Object.values(materials).includes(object.material)){if(Array.isArray(object.material))object.material.forEach(m=>m.dispose());else object.material.dispose();}});Object.values(materials).forEach(m=>m.dispose());shadowTexture?.dispose();environment.dispose();room.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="network-webgl" ref={host}><div className="network-webgl-fallback" aria-hidden="true">DEN<span>Every journey. Connected.</span></div></div>;
}
