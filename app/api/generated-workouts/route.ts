import { getDb } from "../../../db";
import { authorizeRequest } from "../auth";
export const dynamic="force-dynamic";

async function ensureSchema(){const db=getDb();await db.batch([
  db.prepare("CREATE TABLE IF NOT EXISTS generated_workouts (id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, email TEXT NOT NULL, visibility TEXT NOT NULL, title TEXT NOT NULL, data_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"),
  db.prepare("CREATE INDEX IF NOT EXISTS idx_generated_workouts_user_created ON generated_workouts(user_id, created_at)"),
  db.prepare("CREATE INDEX IF NOT EXISTS idx_generated_workouts_visibility_created ON generated_workouts(visibility, created_at)")
]);}
function parsed(row:Record<string,unknown>,mine:boolean){try{return {...JSON.parse(String(row.data_json)),id:row.id,visibility:row.visibility,createdAt:row.created_at,owner:mine?"My account":row.email,isMine:mine};}catch{return null;}}
export async function GET(request:Request){
  const auth=authorizeRequest(request);if(!auth.identity)return Response.json({error:"Not authorized"},{status:auth.status});
  await ensureSchema();const db=getDb(),[mine,club]=await Promise.all([
    db.prepare("SELECT * FROM generated_workouts WHERE user_id = ? ORDER BY created_at DESC LIMIT 100").bind(auth.identity.userId).all(),
    db.prepare("SELECT * FROM generated_workouts WHERE visibility = 'public' ORDER BY created_at DESC LIMIT 100").all()
  ]);
  return Response.json({mine:mine.results.map(row=>parsed(row,true)).filter(Boolean),club:club.results.map(row=>parsed(row,row.user_id===auth.identity!.userId)).filter(Boolean)});
}
export async function POST(request:Request){
  const auth=authorizeRequest(request);if(!auth.identity)return Response.json({error:"Not authorized"},{status:auth.status});
  const body=await request.json() as Record<string,unknown>,workout=body.workout as Record<string,unknown>,visibility=body.visibility==="public"?"public":"private";
  if(!workout||typeof workout.title!=="string"||!Array.isArray(workout.sections))return Response.json({error:"Invalid workout"},{status:400});
  await ensureSchema();const id=`generated-${crypto.randomUUID()}`,now=new Date().toISOString(),saved={...workout,id,visibility,createdAt:now,owner:"My account",isMine:true};
  await getDb().prepare("INSERT INTO generated_workouts (id,user_id,email,visibility,title,data_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)").bind(id,auth.identity.userId,auth.identity.email,visibility,workout.title,JSON.stringify(workout),now,now).run();
  return Response.json(saved,{status:201});
}
