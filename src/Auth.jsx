import {useState} from 'react';
import {Brand,Field,Form} from './ui';
import {api} from './api';
import {ArrowUpRight,PackageCheck} from 'lucide-react';
const COUNTRIES=[['NG','Nigeria'],['GH','Ghana'],['GB','United Kingdom'],['US','United States'],['MA','Morocco'],['KE','Kenya'],['FR','France'],['DE','Germany']];
const friendly=error=>error.code==='EMAIL_DELIVERY_NOT_CONFIGURED'?new Error('Email verification is unavailable right now. Try again later.'):error;
export default function Auth({onLogin}) {
 const [register,setRegister]=useState(false),[phase,setPhase]=useState('details'),[pending,setPending]=useState(null),[notice,setNotice]=useState('');
 const leave=next=>{setRegister(next);setPhase('details');setPending(null);setNotice('');};
 async function resend(){try{await api('/auth/register-code','POST',pending);setNotice('A new code is on its way. It expires in 10 minutes.');}catch(error){setNotice(friendly(error).message);}}
 return <main className="auth-layout"><section className="auth-story"><Brand/><div><PackageCheck size={64} strokeWidth={1.2}/><h1>A home for<br/>every handoff.</h1><p>Your facilities, people and packages.<br/>Connected.</p></div><footer>DEN Global Warehouse Network <ArrowUpRight size={18}/></footer></section><section className="auth-form"><div className="auth-inner"><p className="muted">Warehouse partner workspace</p><h2>{register?(phase==='code'?'Check your email.':'Join the network.'):'Welcome back.'}</h2><p className="muted">{register?(phase==='code'?`Enter the 6-digit code we sent to ${pending?.email}. It expires in 10 minutes.`:'Register your account to prepare your warehouse business for verification.'):'Sign in to continue your DEN journey.'}</p>{notice?<p role="status" className="notice">{notice}</p>:null}
 {register?<Form key={`register-${phase}`} submit={phase==='code'?'Verify and create account':'Send verification code'} onSubmit={async data=>{
  try{
   if(phase==='code'){await api('/auth/register','POST',{...pending,emailCode:data.emailCode});leave(false);setNotice('Your account is ready. Sign in to continue.');}
   else{await api('/auth/register-code','POST',data);setPending(data);setNotice('');setPhase('code');}
  }catch(error){throw friendly(error);}
 }}>
  {phase==='code'?<>
   <Field label="Verification code" name="emailCode" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="123456"/>
   <p className="small muted">Sent to {pending?.email}. Nothing arrived? Check your spam folder, or resend the code below.</p>
  </>:<>
   <Field label="Full name" name="name" required autoComplete="name" maxLength={100}/>
   <Field label="Email address" type="email" name="email" required autoComplete="email"/>
   <Field label="Phone number" type="tel" name="phone" required autoComplete="tel" maxLength={40} placeholder="+234 800 000 0000"/>
   <Field label="Country"><select name="country" required defaultValue="NG">{COUNTRIES.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></Field>
   <Field label="Password" name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/>
   <p className="small muted">Use at least 12 characters. Registration does not approve your business or activate live shipments.</p>
  </>}
 </Form>:<Form key="signin" submit="Sign in" onSubmit={async data=>{await api('/auth/login','POST',data);await onLogin();}}>
  <Field label="Email address" type="email" name="email" required autoComplete="email"/>
  <Field label="Password" name="password" type="password" required maxLength={128} autoComplete="current-password"/>
  <Field label="Authenticator code (if enabled)" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}/>
 </Form>}
 {register&&phase==='code'?<p className="auth-switch"><button type="button" className="text-button" onClick={()=>{setPhase('details');setNotice('');}}>Change details</button><button type="button" className="text-button" onClick={resend}>Resend code</button></p>:<p className="auth-switch">{register?'Already part of DEN?':'New to the network?'} <button className="text-button" onClick={()=>leave(!register)}>{register?'Sign in':'Create an account'}</button></p>}<p className="small muted">International Trade is locked by default. No payment collection is enabled.</p></div></section></main>;
}
