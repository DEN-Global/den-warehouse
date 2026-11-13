import {lazy,Suspense} from 'react';
const NetworkCanvas=lazy(()=>import('./NetworkCanvas'));
export default function NetworkScene({compact=false}){return <section className={`network-scene ${compact?'network-scene--compact':''}`} aria-label="Interactive DEN greenhouse illustration"><div className="network-scene-canvas"><Suspense fallback={<p className="muted">Loading greenhouse…</p>}><NetworkCanvas time={0}/></Suspense></div><span className="network-scene-accessible">Drag to explore the greenhouse. This is an illustration, not live tracking.</span></section>;}
