export type ApiIdentity={userId:string;email:string;owner:boolean};
export function authorizeRequest(request:Request):{identity:ApiIdentity|null;status:200|401|403}{
  const url=new URL(request.url),local=url.hostname==="localhost"||url.hostname==="127.0.0.1";
  const ownerEmail=(process.env.OWNER_EMAIL||"newhart.it@gmail.com").trim().toLowerCase();
  if(local)return {identity:{userId:"local-owner",email:ownerEmail,owner:true},status:200};
  const userId=request.headers.get("oai-authenticated-user-id"),email=request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if(!userId||!email)return {identity:null,status:401};
  const allowed=[ownerEmail,...(process.env.ALLOWED_USER_EMAILS||"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean)];
  if(!allowed.includes(email))return {identity:null,status:403};
  return {identity:{userId,email,owner:email===ownerEmail},status:200};
}
