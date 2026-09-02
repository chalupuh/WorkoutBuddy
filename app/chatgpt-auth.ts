import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser={userId:string;email:string;displayName:string};
export async function getChatGPTUser():Promise<ChatGPTUser|null>{
  const requestHeaders=await headers(),host=requestHeaders.get("host")||"";
  if(host.startsWith("localhost")||host.startsWith("127.0.0.1"))return {userId:"local-owner",email:"newhart.it@gmail.com",displayName:"Local owner"};
  const userId=requestHeaders.get("oai-authenticated-user-id"),email=requestHeaders.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if(!userId||!email)return null;
  return {userId,email,displayName:email};
}
const DEFAULT_OWNER_EMAIL="newhart.it@gmail.com";
export function allowedEmails(){return [process.env.OWNER_EMAIL||DEFAULT_OWNER_EMAIL,...(process.env.ALLOWED_USER_EMAILS||"").split(",")].map(value=>value.trim().toLowerCase()).filter(Boolean);}
export function isAllowed(user:ChatGPTUser){return allowedEmails().includes(user.email.toLowerCase());}
export function isOwner(user:ChatGPTUser){return user.email.toLowerCase()===(process.env.OWNER_EMAIL||DEFAULT_OWNER_EMAIL).trim().toLowerCase();}
export async function requireAllowedUser(returnTo="/"){const user=await getChatGPTUser();if(!user)redirect(`/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`);return {user,allowed:isAllowed(user),owner:isOwner(user)};}
