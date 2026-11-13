export function mountBackground(){
 if(document.querySelector('[data-den-design]'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.dataset.denDesign='accessories-pattern';link.href=new URL('./den-background.css',import.meta.url).href;document.head.append(link);
 const scene=document.createElement('div');scene.className='den-page-background';scene.setAttribute('aria-hidden','true');document.body.prepend(scene);
}
