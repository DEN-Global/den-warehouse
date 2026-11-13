// DEN is dark-only. Ignore older light preferences in this and other tabs.
(function(){
 if(typeof window==='undefined'||window.DENTheme)return;
 const root=document.documentElement;
 function apply(){root.dataset.theme='dark';root.style.colorScheme='dark';try{localStorage.setItem('den.theme','dark');}catch{}}
 window.DENTheme={get:()=> 'dark',set:apply,toggle:apply};
 window.addEventListener('storage',event=>{if(event.key==='den.theme'||event.key===null)apply();});
 apply();
})();

// One decorative renderer shared by every workspace, without requiring React.
(()=>{const source=document.currentScript?.src;if(!source)return;const start=()=>import(new URL('./den-background.js',source).href).then(m=>m.mountBackground()).catch(()=>{});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();
