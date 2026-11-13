import {useEffect,useRef,useState} from 'react';
import {Map,Marker,NavigationControl,setWorkerUrl} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './live-map.css';
import {useTheme} from './ThemeToggle';
import {accuracyArea,validMapPoint} from './map-geometry';
setWorkerUrl(workerUrl);
export default function LiveMap({point,stale=false,simulated=false}){
 const {dark}=useTheme(),host=useRef(null),map=useRef(null),marker=useRef(null),latest=useRef(point),follow=useRef(true),[following,setFollowing]=useState(true),[status,setStatus]=useState('loading'),[retry,setRetry]=useState(0);
 latest.current=point;
 useEffect(()=>{
  if(!validMapPoint(latest.current)){setStatus('invalid');return;}
  let instance,observer,timeout,alive=true;
  const paint=()=>{const p=latest.current;if(!instance?.isStyleLoaded()||!validMapPoint(p))return;const data=accuracyArea(p);if(instance.getSource('den-accuracy'))instance.getSource('den-accuracy').setData(data);else{instance.addSource('den-accuracy',{type:'geojson',data});instance.addLayer({id:'den-accuracy-fill',type:'fill',source:'den-accuracy',paint:{'fill-color':'#10b981','fill-opacity':.14}});instance.addLayer({id:'den-accuracy-edge',type:'line',source:'den-accuracy',paint:{'line-color':'#08794f','line-width':1.5,'line-opacity':.6}});}};
  try{
   const p=latest.current;instance=new Map({container:host.current,style:`https://tiles.openfreemap.org/styles/${dark?'dark':'liberty'}`,center:[p.longitude,p.latitude],zoom:15,attributionControl:{compact:false},cooperativeGestures:true,renderWorldCopies:false});map.current=instance;instance.denTheme=dark;
   const pin=document.createElement('div');pin.className='den-rider-marker';pin.setAttribute('role','img');pin.setAttribute('aria-label','Reported rider GPS location');marker.current=new Marker({element:pin}).setLngLat([p.longitude,p.latitude]).addTo(instance);
   instance.addControl(new NavigationControl({showCompass:false}),'top-right');
   instance.on('style.load',()=>{if(!alive)return;paint();clearTimeout(timeout);setStatus('ready');});
   instance.on('error',()=>{if(alive)setStatus('error');});
   instance.on('idle',()=>{if(alive&&instance.isStyleLoaded())setStatus('ready');});
   instance.on('movestart',event=>{if(event.originalEvent){follow.current=false;setFollowing(false);}});
   observer=new ResizeObserver(()=>instance.resize());observer.observe(host.current);
   timeout=setTimeout(()=>{if(alive&&!instance.isStyleLoaded())setStatus('error');},18000);
   instance.on('load',()=>{instance.getCanvas().setAttribute('aria-label','Delivery map. Use arrow keys to pan and plus or minus to zoom.');});
   map.current.denUpdateAccuracy=paint;
  }catch{setStatus('unsupported');}
  return()=>{alive=false;clearTimeout(timeout);observer?.disconnect();marker.current?.remove();marker.current=null;instance?.remove();map.current=null;};
 },[retry]);
 useEffect(()=>{const instance=map.current;if(instance&&instance.denTheme!==dark){instance.denTheme=dark;instance.setStyle(`https://tiles.openfreemap.org/styles/${dark?'dark':'liberty'}`);}},[dark]);
 useEffect(()=>{if(!validMapPoint(point))return;const instance=map.current;marker.current?.setLngLat([point.longitude,point.latitude]);const el=marker.current?.getElement();if(el){el.dataset.state=simulated?'simulated':stale?'stale':'reported';el.setAttribute('aria-label',simulated?'Simulated rider position':stale?'Out-of-date rider position':'Reported rider GPS location');}instance?.denUpdateAccuracy?.();if(instance&&follow.current)instance.easeTo({center:[point.longitude,point.latitude],duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650});},[point.latitude,point.longitude,point.accuracyMeters,stale,simulated,retry]);
 const recenter=()=>{follow.current=true;setFollowing(true);map.current?.easeTo({center:[latest.current.longitude,latest.current.latitude],duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:500});};
 return <div className="live-map-panel"><div className="live-map-toolbar"><span>{simulated?'Simulated position':stale?'Last known position':'Rider GPS position'}</span><button type="button" className="secondary" onClick={recenter} disabled={status==='unsupported'||status==='invalid'}>{following?'Following rider':'Follow rider'}</button></div><div className="live-map-stage"><div ref={host} className="live-map-canvas"/>{status==='loading'?<p role="status" className="live-map-message">Loading delivery map…</p>:null}{['error','unsupported','invalid'].includes(status)?<div className="live-map-message" role="status"><strong>{status==='unsupported'?'This device could not display the interactive map.':status==='invalid'?'This GPS position cannot be displayed.':'Map tiles could not be loaded.'}</strong><p>Your location updates remain available below.</p>{status==='error'?<button className="secondary" type="button" onClick={()=>{setStatus('loading');setRetry(n=>n+1);}}>Retry map</button>:null}</div>:null}</div><p className="small muted">The shaded area shows the reported GPS accuracy. Drag to explore, then choose Follow rider to recenter.</p></div>;
}
