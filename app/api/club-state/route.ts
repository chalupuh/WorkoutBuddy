import { getDb } from "../../../db";
import { authorizeRequest } from "../auth";
export const dynamic="force-dynamic";
const STATE_KEY="falcon-bench-club";
async function ensureSchema(){await getDb().prepare("CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY NOT NULL, data_json TEXT NOT NULL, revision TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL)").run();}
function validState(value:unknown){const state=value as Record<string,unknown>;return Boolean(state&&Array.isArray(state.members)&&state.members.length&&state.logs&&typeof state.logs==="object"&&Array.isArray(state.challengeLibrary)&&Array.isArray(state.weekChallenges)&&Array.isArray(state.accessories));}
export async function GET(request:Request){
  const auth=authorizeRequest(request);if(!auth.identity)return Response.json({error:"Not authorized"},{status:auth.status});
  await ensureSchema();const row=await getDb().prepare("SELECT data_json,revision,updated_at FROM app_state WHERE key = ?").bind(STATE_KEY).first<Record<string,string>>();
  if(!row)return Response.json({state:null,revision:null,updatedAt:null});
  return Response.json({state:JSON.parse(row.data_json),revision:row.revision,updatedAt:row.updated_at});
}
export async function PUT(request:Request){
  const auth=authorizeRequest(request);if(!auth.identity)return Response.json({error:"Not authorized"},{status:auth.status});
  if(!auth.identity.owner)return Response.json({error:"Only the club owner can update shared club data."},{status:403});
  const body=await request.json() as {state?:unknown};if(!validState(body.state))return Response.json({error:"Invalid club state"},{status:400});
  await ensureSchema();const now=new Date().toISOString(),revision=crypto.randomUUID(),json=JSON.stringify(body.state);
  await getDb().prepare("INSERT INTO app_state (key,data_json,revision,updated_at,updated_by) VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET data_json=excluded.data_json,revision=excluded.revision,updated_at=excluded.updated_at,updated_by=excluded.updated_by").bind(STATE_KEY,json,revision,now,auth.identity.email).run();
  return Response.json({revision,updatedAt:now});
}
