import {useCallback,useEffect,useState} from 'react';
import {api} from './api';
export const platform=(path,method='GET',body)=>api(`/platform${path}`,method,body);
export function useResource(loader,deps=[]) {
 const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{setLoading(true);setError('');try{setData(await loader());}catch(e){setError(e.message);}finally{setLoading(false);}},deps);
 useEffect(()=>{void refresh();},[refresh]);return {data,error,loading,refresh};
}
export const money=(minor,currency='NGN')=>new Intl.NumberFormat(undefined,{style:'currency',currency}).format(Number(minor)/100);
export const timestamp=value=>new Date(value).toLocaleString();
