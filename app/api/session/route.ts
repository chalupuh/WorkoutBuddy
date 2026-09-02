import { authorizeRequest } from "../auth";
export const dynamic="force-dynamic";
export async function GET(request:Request){const auth=authorizeRequest(request);if(!auth.identity)return Response.json({error:auth.status===403?"This account is not invited.":"Sign in required."},{status:auth.status});return Response.json({email:auth.identity.email,isOwner:auth.identity.owner});}
