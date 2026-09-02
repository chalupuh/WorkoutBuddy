import { requireAllowedUser } from "./chatgpt-auth";
export const dynamic="force-dynamic";
export default async function Home(){
  const {allowed}=await requireAllowedUser("/");
  if(!allowed)return <main className="access-shell"><section className="access-card"><span>Falcon Bench Club</span><h1>This account is not on the flight roster.</h1><p>Sign in with an invited ChatGPT account or ask the club owner to add your email.</p><a href="/signout-with-chatgpt?return_to=%2F" target="_top">Switch account</a></section></main>;
  return <iframe className="club-frame" title="Falcon Bench Club" src="/club"/>;
}
