let csrf='';
export async function api(path,method='GET',body,headers={}) {
 const response=await fetch(`/api${path}`,{method,credentials:'same-origin',headers:{'content-type':'application/json',...(csrf?{'x-csrf-token':csrf}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const result=await response.json();if(result.csrfToken)csrf=result.csrfToken;
 if(!response.ok)throw new Error(result.error?.replaceAll('_',' ').toLowerCase()??'Request failed');return result;
}
export const date=value=>value?new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date(value)):'Not started';
export const label=value=>value.replaceAll('_',' ').replace(/^./,s=>s.toUpperCase());
