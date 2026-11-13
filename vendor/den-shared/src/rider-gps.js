// Foreground-only, explicit-consent GPS session. No coordinates are queued offline.
export function startRiderGps({geolocation,validate,send,onState,visible=()=>true,online=()=>true,now=Date.now,every=setInterval,cancel=clearInterval,interval=15000}){
 let ended=false,watchGeneration=0,watch=null,timer=null,pending=false,latest=null,lastRecorded=0,lastAttempt=-Infinity,lastShared=null;
 const state=(phase,message,extra={})=>{if(!ended)onState({phase,message,lastShared,...extra});};
 const clear=()=>{watchGeneration++;if(watch!==null){geolocation?.clearWatch(watch);watch=null;}latest=null;};
 const stop=(message='Location sharing stopped.',error=false)=>{if(ended)return;clear();cancel(timer);ended=true;onState({phase:error?'error':'stopped',message,lastShared});};
 const pause=()=>{clear();state('paused',!visible()?'Sharing paused while this tab is hidden.':'Offline. Sharing resumes when your connection returns.');};
 const tick=async()=>{
  if(ended)return;if(!visible()||!online()){pause();return;}if(pending)return;pending=true;
  try{
   const result=await validate();if(ended)return;if(!visible()||!online()){pause();return;}
   lastRecorded=Math.max(lastRecorded,result?.point?.recordedAt??0);
   if(watch===null){const generation=++watchGeneration;state('locating','Waiting for your phone’s GPS permission and position.');watch=geolocation.watchPosition(position=>{
    if(ended||generation!==watchGeneration||!visible()||!online())return;
    const {latitude,longitude,accuracy}=position.coords,recordedAt=Math.round(position.timestamp);
    if(!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude)||Math.abs(longitude)>180||!Number.isFinite(accuracy)||accuracy<0||accuracy>10000||!Number.isSafeInteger(recordedAt)||recordedAt>now()+30000||recordedAt<now()-300000)return;
    latest={latitude,longitude,accuracyMeters:accuracy,recordedAt,simulated:false};if(!pending&&now()-lastAttempt>=interval)void tick();
   },error=>{if(ended||generation!==watchGeneration)return;if(error.code===1)stop('Location permission was denied. Allow location in your browser settings, then start again.',true);else state('locating',error.code===3?'GPS timed out. Waiting for a fresh position.':'GPS is temporarily unavailable. Keep DEN open while it reconnects.');},{enableHighAccuracy:true,maximumAge:0,timeout:20000});}
   if(latest&&latest.recordedAt>lastRecorded&&latest.recordedAt>=now()-300000&&now()-lastAttempt>=interval){
    const point=latest;lastAttempt=now();await send({...point,idempotencyKey:crypto.randomUUID()});if(ended)return;
    lastRecorded=point.recordedAt;lastShared=now();if(!visible()||!online()){pause();return;}state('sharing','GPS sharing is on.',{accuracyMeters:point.accuracyMeters});
   }
  }catch(error){if(ended)return;if([400,401,403,404,409].includes(error.status))stop('Sharing stopped: this delivery is no longer available to your account. Reopen the order to check its status.',true);else state('reconnecting','Connection interrupted. Waiting to send a fresh GPS update.');}
  finally{pending=false;}
 };
 if(!geolocation){stop('GPS is unavailable in this browser. Use DEN over HTTPS on a location-enabled phone.',true);return{stop,refresh:()=>{}};}
 timer=every(()=>void tick(),interval);void tick();
 return{stop,refresh:()=>{if(!visible()||!online())pause();else void tick();}};
}
