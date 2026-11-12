// Shared pre-paint theme controller for every DEN workspace, including vanilla pages.
(function(){
 if(typeof window==='undefined'||window.DENTheme)return;
 const key='den.theme',root=document.documentElement,media=window.matchMedia('(prefers-color-scheme: dark)');
 const valid=value=>value==='dark'||value==='light';
 let preference;try{preference=localStorage.getItem(key);}catch{}
 if(!valid(preference))preference=null;
 let current=preference??(media.matches?'dark':'light');
 function updateButtons(){document.querySelectorAll('[data-den-theme-toggle]').forEach(button=>{const label=`Switch to ${current==='dark'?'light':'dark'} mode`;button.setAttribute('aria-label',label);button.title=label;button.dataset.mode=current;const text=button.querySelector('[data-theme-label]');if(text)text.textContent=current==='dark'?'Light mode':'Dark mode';});}
 function apply(value){current=value;root.dataset.theme=value;root.style.colorScheme=value;updateButtons();window.dispatchEvent(new CustomEvent('den:theme',{detail:value}));}
 function set(value){if(!valid(value))return;preference=value;try{localStorage.setItem(key,value);}catch{}apply(value);}
 window.DENTheme={get:()=>current,set,toggle:()=>set(current==='dark'?'light':'dark')};
 window.addEventListener('storage',event=>{if(event.key!==key&&event.key!==null)return;preference=valid(event.newValue)?event.newValue:null;apply(preference??(media.matches?'dark':'light'));});
 media.addEventListener('change',event=>{if(!preference)apply(event.matches?'dark':'light');});
 document.addEventListener('click',event=>{if(event.target.closest?.('[data-den-theme-toggle]'))window.DENTheme.toggle();});
 document.addEventListener('DOMContentLoaded',updateButtons,{once:true});
 apply(current);
})();
