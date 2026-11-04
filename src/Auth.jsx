import {useState} from 'react';
import {Brand,Field,Form} from './ui';
import {api} from './api';
import {ArrowUpRight,PackageCheck} from 'lucide-react';
export default function Auth({onLogin}) {
 const [register,setRegister]=useState(false),[notice,setNotice]=useState('');
 return <main className="auth-layout"><section className="auth-story"><Brand/><div><PackageCheck size={64} strokeWidth={1.2}/><h1>A home for<br/>every handoff.</h1><p>Your facilities, people and packages.<br/>Connected.</p></div><footer>DEN Global Warehouse Network <ArrowUpRight size={18}/></footer></section><section className="auth-form"><div className="auth-inner"><p className="muted">Warehouse partner workspace</p><h2>{register?'Join the network.':'Welcome back.'}</h2><p className="muted">{register?'Register your account to prepare your warehouse business for verification.':'Sign in to manage your warehouse network.'}</p>{notice?<p role="status" className="notice">{notice}</p>:null}<Form key={String(register)} submit={register?'Create account':'Sign in'} onSubmit={async data=>{
 if(register){await api('/auth/register','POST',data);setRegister(false);setNotice('Your account is ready. Sign in to continue.');}
 else{await api('/auth/login','POST',data);await onLogin();}
 }}>
 {register?<Field label="Full name" name="name" required autoComplete="name" maxLength={100}/>:null}
 <Field label="Email address" type="email" name="email" required autoComplete="email"/>
 <Field label="Password" name="password" type="password" required minLength={register?12:1} maxLength={128} autoComplete={register?'new-password':'current-password'}/>
 {!register?<Field label="Authenticator code (if enabled)" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}/>:null}
 {register?<p className="small muted">Use at least 12 characters. Registration does not approve your business or activate live shipments.</p>:null}
 </Form><p className="auth-switch">{register?'Already part of DEN?':'New to the network?'} <button className="text-button" onClick={()=>{setRegister(!register);setNotice('');}}>{register?'Sign in':'Create an account'}</button></p><p className="small muted">International Trade is locked by default. No payment collection is enabled.</p></div></section></main>;
}
