import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {Pause,Play,RotateCcw,MoveUpRight} from 'lucide-react';

const NetworkCanvas=lazy(()=>import('./NetworkCanvas'));
const stages=[{name:'Network',time:0,detail:'Every journey starts with a connection.'},{name:'Handoffs',time:9,detail:'From your community to the next destination.'},{name:'Parcel',time:17,detail:'One parcel. Every part connected.'}];

export default function NetworkScene({compact=false}){
 const [time,setTime]=useState(0),[playing,setPlaying]=useState(()=>!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches),[ready,setReady]=useState(false);
 const clock=useRef(0),range=useRef(null);
 useEffect(()=>{if(!playing)return;let frame,last=performance.now();const tick=now=>{const dt=Math.max(0,Math.min((now-last)/1000,.1));last=now;clock.current=(clock.current+dt)%25;setTime(clock.current);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing]);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{if(query.matches)setPlaying(false);};query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 const seek=value=>{clock.current=value;setTime(value);};
 const stage=time<8?0:time<16?1:2;
 return <section className={`network-scene ${compact?'network-scene--compact':''}`} aria-label="Interactive DEN delivery network illustration">
  <div className="network-scene-header"><span className="network-scene-wordmark"><i/>DEN / NETWORK</span><span>3D illustration <MoveUpRight size={13}/></span></div>
  <div className="network-scene-canvas"><Suspense fallback={<div className="network-fallback" aria-hidden="true"><span className="mark"><i/><i/><i/><i/></span></div>}><NetworkCanvas time={time} onReady={()=>setReady(true)}/></Suspense></div>
  <div className="network-scene-label network-scene-label--origin"><span>ORIGIN</span><strong>Your community</strong><i/></div>
  <div className="network-scene-label network-scene-label--destination"><span>DESTINATION</span><strong>Closer together</strong><i/></div>
  <div className="network-scene-caption"><span className="network-stage-indicator"/> {stages[stage].detail}</div>
  <div className="network-scene-controls">
   <div className="network-scene-tabs" role="group" aria-label="Illustration focus">{stages.map((item,index)=><button type="button" key={item.name} aria-pressed={stage===index} onClick={()=>seek(item.time)}>{item.name}</button>)}</div>
   <div className="network-scene-playback"><button type="button" onClick={()=>setPlaying(value=>!value)} aria-label={playing?'Pause network animation':'Play network animation'}>{playing?<Pause size={14}/>:<Play size={14}/>}</button><input ref={range} type="range" min="0" max="25" step=".1" value={time} aria-label="Network illustration timeline" onChange={event=>{setPlaying(false);seek(Number(event.target.value));}}/><output aria-label="Animation time">{String(Math.floor(time)).padStart(2,'0')} / 25s</output><button type="button" aria-label="Restart network animation" onClick={()=>seek(0)}><RotateCcw size={14}/></button></div>
  </div>
  <span className="network-scene-accessible" role="status">{ready?'Drag the model to explore the illustrative delivery network.':'Loading the network illustration.'} This is an illustration, not live tracking.</span>
 </section>;
}
