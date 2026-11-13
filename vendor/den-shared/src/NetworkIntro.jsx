import {useEffect,useRef,useState} from 'react';
const reduced=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// Original outline item icons: shopping bag, boot, cosmetic kit, lipstick, parcel.
const items=[
 'M-6-3H6V7H-6ZM-3-3V-5C-3-9 3-9 3-5V-3',
 'M-5-7H1V1L6 3V7H-6V3H-5ZM-6 5H6',
 'M-7-3H7V6H-7ZM-3-3V-6H3V-3M-7 0H7M-1-1V2H1V-1',
 'M-3 0H3V7H-3ZM-2 0V-6L2-8V0M-4 3H4',
 'M-6-4L0-7L6-4V4L0 7L-6 4ZM-6-4L0-1L6-4M0-1V7'
];
export default function NetworkIntro(){
 const canvas=useRef(null),[playing,setPlaying]=useState(()=>!reduced());
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>{if(query.matches)setPlaying(false);};query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');if(!ctx)return;
  const paths=items.map(d=>new Path2D(d));let frame,w=1,h=1,time=0,last=0,targets=[];
  const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  const makeTargets=()=>{const mask=document.createElement('canvas');mask.width=Math.ceil(w);mask.height=Math.ceil(h);const pen=mask.getContext('2d');const size=Math.min(w*.205,108);pen.fillStyle='#fff';pen.font=`700 ${size}px Arial,sans-serif`;pen.textAlign='center';pen.fillText('DEN',w/2,h*.57);pen.fillText('GLOBAL',w/2,h*.57+size*1.08);const data=pen.getImageData(0,0,mask.width,mask.height).data;targets=[];for(let y=0;y<h;y+=8)for(let x=0;x<w;x+=8)if(data[(y*mask.width+x)*4+3]>140)targets.push([x,y]);};
  const draw=now=>{if(last&&playing)time+=Math.min((now-last)/1000,.06);last=now;ctx.clearRect(0,0,w,h);const style=getComputedStyle(el),ink=style.getPropertyValue('--accent').trim();const phase=time%16,form=playing?ease((phase-3)/3)*(1-ease((phase-11)/3)):1;
   for(let i=0;i<targets.length;i++){
    const [tx,ty]=targets[i],seed=(i*137.508)%997;const x=((seed*1.93)%w)+Math.sin(time*.2+i)*12,y=h*.27+((seed*3.7)%(h*.65))+Math.cos(time*.16+i)*10;
    ctx.save();ctx.translate(x+(tx-x)*form,y+(ty-y)*form);const scale=.7*(1-form)+.26*form;ctx.scale(scale,scale);ctx.rotate(Math.sin(i*2.4+time*.15)*.25*(1-form));ctx.globalAlpha=(.12+form*.42)*(i%3===0?1:.8);ctx.strokeStyle=ink;ctx.lineWidth=form> .5?2.4:1.4;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke(paths[i%paths.length]);ctx.restore();
   }
   if(playing)frame=requestAnimationFrame(draw);
  };
  const resize=()=>{cancelAnimationFrame(frame);w=Math.max(1,el.clientWidth);h=Math.max(1,el.clientHeight);const d=Math.min(devicePixelRatio,2);el.width=w*d;el.height=h*d;ctx.setTransform(d,0,0,d,0,0);makeTargets();draw(performance.now());};
  const observer=new ResizeObserver(resize);observer.observe(el);const theme=new MutationObserver(()=>{if(!playing)draw(performance.now());});theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});resize();return()=>{cancelAnimationFrame(frame);observer.disconnect();theme.disconnect();};
 },[playing]);
 return <div className="den-item-background" aria-hidden="true"><canvas ref={canvas}/></div>;
}
