import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {MapPin} from 'lucide-react';
import {api} from './api';
import {startRiderGps} from './rider-gps';
const Context=createContext(null);
async function trackingApi(path,method='GET',body){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{return await api(path,method,body,{}, {signal:controller.signal});}finally{clearTimeout(timer);}}
export const useRiderTracking=()=>useContext(Context);
export default function RiderTracking({role,userId,children}){
 const session=useRef(null),[state,setState]=useState({phase:'stopped',orderId:null,message:''});
 const stop=()=>{session.current?.stop();session.current=null;};
 const start=orderId=>{stop();setState({phase:'locating',orderId,message:'Checking your delivery assignment…'});session.current=startRiderGps({geolocation:navigator.geolocation,validate:()=>trackingApi(`/services/orders/${orderId}/tracking`),send:point=>trackingApi(`/services/orders/${orderId}/tracking`,'POST',point),onState:next=>setState({...next,orderId}),visible:()=>!document.hidden,online:()=>navigator.onLine!==false});};
 useEffect(()=>{const update=()=>session.current?.refresh();document.addEventListener('visibilitychange',update);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{stop();document.removeEventListener('visibilitychange',update);window.removeEventListener('online',update);window.removeEventListener('offline',update);};},[role,userId]);
 const active=state.orderId&&!['stopped','error'].includes(state.phase);
 return <Context.Provider value={{...state,active,start,stop}}>{children}{role==='rider'&&state.orderId&&state.phase!=='stopped'?<aside className="gps-sharing-bar" aria-label="Delivery GPS sharing"><MapPin size={20}/><div><strong>{state.phase==='sharing'?'Sharing delivery GPS':state.phase==='paused'?'GPS sharing paused':state.phase==='error'?'GPS sharing stopped':'Connecting delivery GPS'}</strong><p role="status">{state.message}</p><small>Order {state.orderId.slice(0,8)}{state.lastShared?` · Last sent ${new Date(state.lastShared).toLocaleTimeString()}`:''}</small></div>{active?<button className="secondary" onClick={stop}>Stop sharing</button>:<button className="secondary" onClick={()=>setState({phase:'stopped',orderId:null,message:''})}>Dismiss</button>}</aside>:null}</Context.Provider>;
}
