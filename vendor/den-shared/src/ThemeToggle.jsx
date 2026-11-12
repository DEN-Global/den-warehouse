import './theme-init.js';
import {useSyncExternalStore} from 'react';
import {Moon,Sun} from 'lucide-react';

const subscribe=callback=>{window.addEventListener('den:theme',callback);return()=>window.removeEventListener('den:theme',callback);};
const snapshot=()=>window.DENTheme.get();
export function useTheme(){const theme=useSyncExternalStore(subscribe,snapshot,()=> 'light');return {theme,dark:theme==='dark',setTheme:window.DENTheme.set,toggleTheme:window.DENTheme.toggle};}
export default function ThemeToggle({className=''}){const {dark,toggleTheme}=useTheme();const label=`Switch to ${dark?'light':'dark'} mode`;return <button className={`theme-toggle ${className}`} type="button" onClick={toggleTheme} aria-label={label} title={label}>{dark?<Sun size={17}/>:<Moon size={17}/>}<span>{dark?'Light mode':'Dark mode'}</span></button>;}
