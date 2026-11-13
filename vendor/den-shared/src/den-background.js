const asset=name=>new URL(name,import.meta.url).href;
export function attachReveal(host,source=host){
 let tx=0,ty=0,x=0,y=0,frame=0;const media=matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>{const snap=media.matches;x+=(tx-x)*(snap?1:.18);y+=(ty-y)*(snap?1:.18);host.style.setProperty('--spot-x',`${x}px`);host.style.setProperty('--spot-y',`${y}px`);if(Math.abs(tx-x)+Math.abs(ty-y)>.5)frame=requestAnimationFrame(update);else frame=0;};
 const move=e=>{const r=host.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;host.dataset.revealing='true';if(!frame)frame=requestAnimationFrame(update);};
 const focus=()=>{const r=host.getBoundingClientRect();tx=r.width*.75;ty=r.height*.43;host.dataset.revealing='true';if(!frame)frame=requestAnimationFrame(update);};
 const leave=()=>{delete host.dataset.revealing;};
 source.addEventListener('pointermove',move,{passive:true});source.addEventListener('pointerdown',move,{passive:true});host.addEventListener('focus',focus);host.addEventListener('blur',leave);source.addEventListener('pointerleave',leave);
 return()=>{cancelAnimationFrame(frame);source.removeEventListener('pointermove',move);source.removeEventListener('pointerdown',move);host.removeEventListener('focus',focus);host.removeEventListener('blur',leave);source.removeEventListener('pointerleave',leave);};
}
export function mountBackground(){
 if(document.querySelector('.den-site-background'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href=asset('den-background.css');document.head.append(link);
 const host=document.createElement('div');host.className='den-site-background den-reveal-art';host.setAttribute('aria-hidden','true');
 for(const [name,cls] of [['fruit-market.jpg','den-art-base'],['fruit-market.jpg','den-art-reveal']]){const img=document.createElement('img');img.src=asset(name);img.alt='';img.className=cls;host.append(img);}
 document.body.prepend(host);attachReveal(host,document.body);
}
