import './theme-init.js';
import {useSyncExternalStore} from 'react';

const subscribe=callback=>{window.addEventListener('den:theme',callback);return()=>window.removeEventListener('den:theme',callback);};
const snapshot=()=>window.DENTheme.get();
export function useTheme(){const theme=useSyncExternalStore(subscribe,snapshot,()=> 'dark');return {theme,dark:theme==='dark',setTheme:window.DENTheme.set,toggleTheme:window.DENTheme.toggle};}
export default function ThemeToggle(){return null;}
