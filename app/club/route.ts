import clubHtml from "../../index.html?raw";
import { getChatGPTUser, isAllowed } from "../chatgpt-auth";
export const dynamic="force-dynamic";
export async function GET(){const user=await getChatGPTUser();if(!user)return new Response("Sign in required",{status:401});if(!isAllowed(user))return new Response("Not invited",{status:403});return new Response(clubHtml,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Content-Security-Policy":"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'self'"}});}
