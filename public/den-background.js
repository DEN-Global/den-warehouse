const INTRO_KEY='den.opening.blue-glass.v1';
function openingAnimation(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 try{if(sessionStorage.getItem(INTRO_KEY))return;sessionStorage.setItem(INTRO_KEY,'seen');}catch{if(window.denOpeningSeen)return;window.denOpeningSeen=true;}
 const intro=document.createElement('div');intro.className='den-opening';
 // Original vector circuitry inspired by the selected motion reference.
 intro.innerHTML=`<svg class="den-opening-circuit" viewBox="0 0 800 800" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5"><path pathLength="100" d="M0 160H180L250 230V340H330M800 120H640L580 180V300H470M0 620H180L250 550V460H330M800 640H650L570 560V460H470M120 0V90L300 270V330M700 0V140L500 340M100 800V670L300 470M720 800V660L500 470M0 400H300M800 400H500M400 0V300M400 800V500"/><circle cx="400" cy="400" r="120"/><circle cx="400" cy="400" r="145" stroke-dasharray="5 12"/><rect x="340" y="340" width="120" height="120" rx="26"/></g><g fill="currentColor"><circle cx="180" cy="160" r="4"/><circle cx="640" cy="120" r="4"/><circle cx="180" cy="620" r="4"/><circle cx="650" cy="640" r="4"/></g></svg><div class="den-opening-brand"><span class="den-opening-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>DEN Global</strong><span>One network. Every journey.</span></div><button type="button" class="den-opening-skip">Skip intro</button>`;
 document.body.append(intro);let timer;
 const finish=()=>{clearTimeout(timer);intro.remove();};intro.querySelector('button').addEventListener('click',finish,{once:true});timer=setTimeout(finish,2400);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');motion.addEventListener('change',()=>{if(motion.matches)finish();},{once:true});
}
export function mountBackground(){
 if(document.querySelector('.den-page-background'))return;
 let link=document.querySelector('[data-den-design]');if(!link){link=document.createElement('link');link.rel='stylesheet';link.dataset.denDesign='blue-liquid-glass';link.href=new URL('./den-background.css',import.meta.url).href;document.head.append(link);}
 const scene=document.createElement('div');scene.className='den-page-background';scene.setAttribute('aria-hidden','true');document.body.prepend(scene);
 // Run after the shared stylesheet loads so the intro never flashes unstyled.
 if(link.sheet)openingAnimation();else link.addEventListener('load',openingAnimation,{once:true});
}
