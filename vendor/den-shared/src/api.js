let csrf='';
export async function api(path,method='GET',body,headers={}) {
 const response=await fetch(`/api${path}`,{method,credentials:'same-origin',headers:{'content-type':'application/json',...(csrf?{'x-csrf-token':csrf}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const result=await response.json();if(result.csrfToken)csrf=result.csrfToken;
 if(!response.ok){const error=new Error(({FRESH_MFA_REQUIRED:'Open Security and verify your password and authenticator code to continue.',PAGE_LOCKED_BY_OWNER:'The Owner Admin has locked this section. Only the owner can access it.',OWNER_ACCOUNT_PROTECTED:'The Owner Admin account is protected.',OWNER_OR_SELF_PROTECTED:'The owner and your own account cannot be changed here.',REVISION_CONFLICT:'This record changed. Refresh and try again.'})[result.error]??result.error?.replaceAll('_',' ').toLowerCase()??'Request failed');error.status=response.status;error.code=result.error;throw error;}return result;
}
export const date=value=>value?new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date(value)):'Not started';
export const label=value=>value.replaceAll('_',' ').replace(/^./,s=>s.toUpperCase());
