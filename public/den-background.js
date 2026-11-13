export function mountBackground(){
 if(document.querySelector('[data-den-design]'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.dataset.denDesign='green-community';link.href=new URL('./den-background.css',import.meta.url).href;document.head.append(link);
 const scene=document.createElement('div');scene.className='den-page-background';scene.setAttribute('aria-hidden','true');
 const video=document.createElement('video');video.src=new URL('./green-community.mp4',import.meta.url).href;video.poster=new URL('./green-community-poster.jpg',import.meta.url).href;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';scene.append(video);document.body.prepend(scene);
 const control=document.createElement('button');control.type='button';control.className='den-background-control';document.body.append(control);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let wanted=!motion.matches&&!navigator.connection?.saveData;
 const label=()=>{control.textContent=video.paused?'Play background':'Pause background';control.setAttribute('aria-label',control.textContent+' animation');};
 const update=()=>{if(wanted&&!document.hidden)void video.play().catch(label);else video.pause();label();};
 control.addEventListener('click',()=>{wanted=video.paused;update();});video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('error',()=>{control.hidden=true;scene.style.backgroundImage=`url("${video.poster}")`;});document.addEventListener('visibilitychange',update);motion.addEventListener('change',()=>{if(motion.matches)wanted=false;update();});update();
}
