import {useEffect,useRef,useState} from 'react';
import {X,Warehouse} from 'lucide-react';
export function Brand(){return <div className="brand"><div className="brand-row"><span className="mark" aria-hidden="true"><i/><i/><i/><i/></span><strong>DEN Global</strong></div><small>One network. Every journey.</small></div>;}
export function Field({label,children,...props}){return <label className="field"><span>{label}</span>{children??<input {...props}/>}</label>;}
export function Form({onSubmit,children,submit='Save',className=''}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 return <form className={className} onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{await onSubmit(Object.fromEntries(new FormData(e.currentTarget)));}catch(err){setError(err.message);}finally{setBusy(false);}}}>
 {children}{error?<p role="alert" className="error">{error}</p>:null}<button className="primary" disabled={busy} type="submit">{busy?'Saving…':submit}</button></form>;
}
export function Drawer({title,onClose,children}){
 const ref=useRef();useEffect(()=>{const dialog=ref.current;dialog.showModal();return()=>dialog.close();},[]);
 return <dialog ref={ref} className="drawer" onCancel={onClose}><header><h2>{title}</h2><button aria-label="Close panel" className="icon-button" onClick={onClose}><X size={22}/></button></header><div className="drawer-body">{children}</div></dialog>;
}
export function Empty({title,description,action}){return <div className="empty"><Warehouse size={66} strokeWidth={1.4}/><h3>{title}</h3><p>{description}</p>{action}</div>;}
export function Status({value}){return <span className={`status ${value}`}>{value.replaceAll('_',' ')}</span>;}
