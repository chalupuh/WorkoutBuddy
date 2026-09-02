const STORAGE_KEY = 'falcon-bench-club-v1';
const SIDEBAR_KEY = 'falcon-bench-club-sidebar-collapsed';
const CHECKPOINT_KEY = 'falcon-bench-club-checkpoints-v1';
const GENERATED_WORKOUTS_KEY = 'falcon-bench-club-generated-workouts-v1';
const GENERATOR_SESSION_KEY = 'falcon-bench-club-generator-session-v1';
const BACKUP_APP_ID = 'falcon-bench-club';
const BACKUP_VERSION = 1;
const CHALLENGE_CATALOG_VERSION = 4;
const RECOVERY_WEEKS = [4,8,12];

const defaultMembers = [
  {id:'nikki',name:'Nikki',max:85,body:0},
  {id:'pardo',name:'Pardo',max:190,body:0},
  {id:'joe',name:'Joe',max:225,body:0},
  {id:'garrett',name:'Garrett',max:245,body:0},
  {id:'chris',name:'Chris',max:255,body:0}
];

const phases = [
  {name:'Foundation',weeks:[1,2,3,4],goal:'Build the pattern. Own every rep.',detail:'Technique, higher volume and zero grinders.',top:'5 × 5',back:'—',accessory:'Full volume'},
  {name:'Growth',weeks:[5,6,7,8],goal:'Add muscle. Raise the floor.',detail:'A heavy set of five followed by productive back-off work.',top:'1 × 5',back:'4 × 6',accessory:'Press + pull volume'},
  {name:'Overload',weeks:[9,10,11,12],goal:'Carry more. Stay precise.',detail:'Heavy fours, controlled back-offs and no grinders.',top:'1 × 4',back:'4 × 5',accessory:'Press + upper back'},
  {name:'Peak',weeks:[13,14,15,16],goal:'Earn your wings.',detail:'Crisp triples and singles, reduced accessories, then a planned max day.',top:'Triples → singles',back:'Tapered',accessory:'Reduced each week'}
];

const challengeSeeds = [
  ['Step Champion','Most steps recorded on any single day this week'],
  ['Push-Up Challenge','Most clean push-ups completed in one set'],
  ['Plank Hold','Longest front-plank hold with good form'],
  ['Movement Streak','Most days with at least 20 minutes of intentional activity'],
  ['Cardio Captain','Most intentional cardio minutes completed this week'],
  ['Bodyweight Squat Set','Most controlled bodyweight squats completed in one set'],
  ['Outdoor Distance','Most distance covered walking, running, or hiking this week'],
  ['Mobility Streak','Most days with at least 10 minutes of mobility work'],
  ['Workout Variety','First to complete three different types of workouts'],
  ['Core Challenge','Longest hollow hold or dead-bug set completed with control'],
  ['Active Minutes','Most total intentional activity minutes this week'],
  ['Recovery Streak','Most nights with at least seven hours of sleep'],
  ['Three-Day Streak','Complete a workout on three different days this week'],
  ['Mile Improvement','Biggest improvement on a one-mile walk or run'],
  ['Workout Leader','Most total workouts completed in the last seven days'],
  ['Season Finisher','Complete the club session and the weekly workout target']
];
const defaultChallengeLibrary = challengeSeeds.map((challenge,index)=>({id:`week-${index+1}`,name:challenge[0],detail:challenge[1],active:true,builtIn:true}));
const defaultWeekChallenges = ()=>defaultChallengeLibrary.map(challenge=>challenge.id);
const defaultAccessories = [
  {name:'Incline Barbell Bench',scheme:'3 × 8–10',load:'Calculated load',note:'Even weeks; add load after all sets reach 10'},
  {name:'Incline Dumbbell Bench',scheme:'3 × 10–12',load:'Calculated load',note:'Odd weeks; leave 1–2 reps in reserve'},
  {name:'Chest-Supported Dumbbell Row',scheme:'3 × 10–12',load:'RPE 8',note:'Pull toward the ribs; pause without shrugging'},
  {name:'Tricep Rope Pushdown',scheme:'3 × 12–15',load:'RPE 8',note:'Add one rep per set before weight'},
  {name:'Face Pull / Rear-Delt Row',scheme:'3 × 12–15',load:'RPE 7',note:'Finish with shoulder blades moving freely'}
];

const competitionPlan = [
  {top:'5 × 5',topPct:.70},{top:'5 × 5',topPct:.725},{top:'5 × 5',topPct:.75},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 5',topPct:.80,back:'4 × 6',backPct:.70},{top:'1 × 5',topPct:.825,back:'4 × 6',backPct:.725},{top:'1 × 5',topPct:.85,back:'4 × 6',backPct:.75},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 4',topPct:.85,back:'4 × 5',backPct:.75},{top:'1 × 4',topPct:.875,back:'4 × 5',backPct:.775},{top:'1 × 4',topPct:.90,back:'4 × 5',backPct:.80},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 3',topPct:.85,back:'2 × 4',backPct:.725},{top:'2 × 1',topPct:.875,back:'2 × 3',backPct:.70},{top:'3 × 1',topPct:.90},{top:'Three planned attempts',topPct:1,test:true}
];
const rankDefs = [[650,'Falcon Champion'],[525,'Black Wing'],[400,'Strike Leader'],[300,'OverWatch'],[200,'Falcon'],[100,'Airman'],[0,'Recruit']];
const rankVisuals = {
  'Recruit':{code:'I',tier:'01',tone:'#7f8790',tone2:'#cbd0d4',bg:'#e7e9ea',ink:'#17191b',shape:'recruit',title:'Initiate'},
  'Airman':{code:'II',tier:'02',tone:'#4f9fd0',tone2:'#bde8ff',bg:'#dff2fc',ink:'#102836',shape:'airman',title:'Flight Ready'},
  'Falcon':{code:'III',tier:'03',tone:'#c79a2b',tone2:'#ffe49a',bg:'#f7edcf',ink:'#30250d',shape:'falcon',title:'Talon Proven'},
  'OverWatch':{code:'IV',tier:'04',tone:'#7e55c7',tone2:'#d8baff',bg:'#ebe2f7',ink:'#251638',shape:'overwatch',title:'Field Elite'},
  'Strike Leader':{code:'V',tier:'05',tone:'#ed642f',tone2:'#ffc09c',bg:'#f9dfd3',ink:'#3b170b',shape:'strike',title:'Squad Command'},
  'Black Wing':{code:'VI',tier:'06',tone:'#b7c5d1',tone2:'#ffffff',bg:'#171c21',ink:'#f5f8fa',shape:'blackwing',title:'Mythic Wing'},
  'Falcon Champion':{code:'VII',tier:'07',tone:'#ef233c',tone2:'#ffd76a',bg:'#0a0a0b',ink:'#ffffff',shape:'champion',title:'Season Apex'}
};
const pointFields = {attendance:5,additionalWorkout:5,beatLast:5,allReps:5,challenge:10,pr:5,mvp:10};
const weeklyScoring = [
  ['Attended Club Session','1 other workout in last 7 days','Completed the planned bench work','Logged the session results','Step Champion winner','Step Champion runner-up','30+ minute workout'],
  ['Attended Club Session','1 other workout in last 7 days','Completed the planned bench work','Logged the session results','Push-Up Challenge winner','Push-Up Challenge runner-up','30+ minute workout'],
  ['Attended Club Session','1 other workout in last 7 days','Completed the planned bench work','Logged the session results','Plank Hold winner','Plank Hold runner-up','30+ minute workout'],
  ['Attended Deload Session','1 other workout in last 7 days','Used the lighter deload load','Finished without grinding','Movement Streak winner','Movement Streak runner-up','30+ minute workout'],
  ['Attended Club Session','2 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Cardio Captain winner','Cardio Captain runner-up','30+ minute workout'],
  ['Attended Club Session','2 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Bodyweight Squat Set winner','Bodyweight Squat Set runner-up','30+ minute workout'],
  ['Attended Club Session','2 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Outdoor Distance winner','Outdoor Distance runner-up','30+ minute workout'],
  ['Attended Deload Session','2 other workouts in last 7 days','Used the lighter deload load','Finished without grinding','Mobility Streak winner','Mobility Streak runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Workout Variety winner','Workout Variety runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Core Challenge winner','Core Challenge runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Active Minutes winner','Active Minutes runner-up','30+ minute workout'],
  ['Attended Deload Session','3 other workouts in last 7 days','Used the lighter deload load','Finished without grinding','Recovery Streak winner','Recovery Streak runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Three-Day Streak winner','Three-Day Streak runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Mile Improvement winner','Mile Improvement runner-up','30+ minute workout'],
  ['Attended Club Session','3 other workouts in last 7 days','Completed the planned bench work','Logged the session results','Workout Leader winner','Workout Leader runner-up','30+ minute workout'],
  ['Attended Championship Session','3 other workouts in last 7 days','Successful opener','Logged all three attempts','Season Finisher winner','Season Finisher runner-up','30+ minute workout']
];
weeklyScoring.forEach(labels=>labels[6]='AMRAP Champ');

let state = loadState();
let generatorState = loadGeneratorState();
let generatedWorkouts = loadGeneratedWorkouts();
let currentAccess = {isOwner:true,email:null};
let hostedApiReady = false;
let hostedStateRevision = null;
let hostedStateTimer = null;
let hostedStatePoller = null;

function loadGeneratorState(){
  try{const saved=JSON.parse(localStorage.getItem(GENERATOR_SESSION_KEY));if(saved&&Array.isArray(saved.messages))return saved;}catch(e){}
  return {messages:[],draft:null,busy:false};
}
function loadGeneratedWorkouts(){
  try{const saved=JSON.parse(localStorage.getItem(GENERATED_WORKOUTS_KEY));return Array.isArray(saved)?saved:[];}catch(e){return [];}
}
function saveGeneratorState(){localStorage.setItem(GENERATOR_SESSION_KEY,JSON.stringify({...generatorState,busy:false}));}
function saveGeneratedWorkouts(){localStorage.setItem(GENERATED_WORKOUTS_KEY,JSON.stringify(generatedWorkouts));}
async function hydrateHostedData(){
  try{
    const session=await fetch('/api/session',{cache:'no-store'});if(!session.ok)return;currentAccess=await session.json();hostedApiReady=true;
    applyAccessRules();
    const shared=await fetch('/api/club-state',{cache:'no-store'});
    if(shared.ok){const data=await shared.json();if(data.state){state=data.state;hostedStateRevision=data.revision;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));document.querySelector('#activeWeek').value=state.activeWeek;renderAll();}else if(currentAccess.isOwner){await pushClubState(state);}}
    const response=await fetch('/api/generated-workouts',{cache:'no-store'});if(response.ok){const data=await response.json(),seen=new Set();generatedWorkouts=[...(data.mine||[]),...(data.club||[])].filter(item=>item?.id&&!seen.has(item.id)&&seen.add(item.id));saveGeneratedWorkouts();renderGeneratedLibraries();}
    hostedStatePoller=setInterval(refreshClubState,15000);
  }catch(error){/* Local static fallback keeps browser-saved workouts available. */}
}
async function pushClubState(nextState=state){
  if(!hostedApiReady||!currentAccess.isOwner)return true;
  const response=await fetch('/api/club-state',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({state:nextState})});
  if(!response.ok)throw new Error('Shared club data could not be saved');
  const data=await response.json();hostedStateRevision=data.revision;return true;
}
function scheduleClubStateSave(){
  if(!hostedApiReady||!currentAccess.isOwner)return;
  clearTimeout(hostedStateTimer);hostedStateTimer=setTimeout(()=>pushClubState(state).catch(()=>toast('Shared save failed — your browser copy is still safe')),350);
}
async function refreshClubState(){
  if(!hostedApiReady||currentAccess.isOwner)return;
  try{const response=await fetch('/api/club-state',{cache:'no-store'});if(!response.ok)return;const data=await response.json();if(!data.state||data.revision===hostedStateRevision)return;state=data.state;hostedStateRevision=data.revision;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));document.querySelector('#activeWeek').value=state.activeWeek;renderAll();toast('Club updates refreshed');}catch(error){}
}
function applyAccessRules(){
  document.body.classList.toggle('viewer-mode',!currentAccess.isOwner);
  document.querySelector('[data-view="log"]')?.toggleAttribute('hidden',!currentAccess.isOwner);
  ['addMember','addChallenge','editAccessories','startClubDay'].forEach(id=>document.querySelector(`#${id}`)?.toggleAttribute('hidden',!currentAccess.isOwner));
}

function loadState(){
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved?.members){
      saved.season=saved.season||1;
      saved.seasonHistory=saved.seasonHistory||[];
      saved.completedWeeks=saved.completedWeeks||{};
      saved.accessories=saved.accessories||defaultAccessories;
      const legacyPushdown=saved.accessories.find(exercise=>exercise.name==='Triceps Pushdown');
      if(legacyPushdown){legacyPushdown.name='Tricep Rope Pushdown';localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}
      saved.accessories.forEach(exercise=>{
        if(exercise.name==='Incline Barbell Bench'&&exercise.scheme==='4 × 8–10'){exercise.scheme='3 × 8–10';exercise.note='Even weeks; add load after all sets reach 10';}
        if(exercise.name==='Incline Barbell Bench'&&/^Odd weeks;/.test(exercise.note||''))exercise.note=exercise.note.replace(/^Odd weeks;/,'Even weeks;');
        if(exercise.name==='Incline Dumbbell Bench'&&exercise.note==='Leave 1–2 reps in reserve')exercise.note='Odd weeks; leave 1–2 reps in reserve';
        if(exercise.name==='Tricep Rope Pushdown'&&exercise.scheme==='4 × 12–15')exercise.scheme='3 × 12–15';
        if(exercise.name==='Lateral Raise'&&exercise.scheme==='4 × 15–20')exercise.scheme='3 × 15–20';
        if(exercise.name==='Pec Deck / Cable Fly')Object.assign(exercise,{name:'Chest-Supported Dumbbell Row',scheme:'3 × 10–12',load:'RPE 8',note:'Pull toward the ribs; pause without shrugging'});
        if(exercise.name==='Lateral Raise')Object.assign(exercise,{name:'Face Pull / Rear-Delt Row',scheme:'3 × 12–15',load:'RPE 7',note:'Finish with shoulder blades moving freely'});
      });
      localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      Object.values(saved.logs||{}).forEach(log=>{if(log.weight&&log.reps)log.estimated1RM=e1rm(+log.weight,+log.reps);});
      localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      if(saved.challengeCatalogVersion!==CHALLENGE_CATALOG_VERSION){
        const customChallenges=(saved.challengeLibrary||[]).filter(challenge=>!challenge.builtIn);
        const customIds=new Set(customChallenges.map(challenge=>challenge.id));
        saved.challengeLibrary=[...defaultChallengeLibrary,...customChallenges];
        saved.weekChallenges=defaultWeekChallenges().map((defaultId,index)=>customIds.has(saved.weekChallenges?.[index])?saved.weekChallenges[index]:defaultId);
        saved.challengeCatalogVersion=CHALLENGE_CATALOG_VERSION;
        localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      } else {
        saved.challengeLibrary=saved.challengeLibrary||defaultChallengeLibrary;
        saved.weekChallenges=saved.weekChallenges||defaultWeekChallenges();
      }
      return saved;
    }
  } catch(e){}
  return {season:1,seasonHistory:[],completedWeeks:{},activeWeek:1,members:defaultMembers,logs:{},challengeLibrary:defaultChallengeLibrary,weekChallenges:defaultWeekChallenges(),challengeCatalogVersion:CHALLENGE_CATALOG_VERSION,accessories:defaultAccessories};
}
function readCheckpoints(){
  try{const checkpoints=JSON.parse(localStorage.getItem(CHECKPOINT_KEY));return Array.isArray(checkpoints)?checkpoints:[];}catch(e){return [];}
}
function storeCheckpoint(snapshot,reason='Automatic checkpoint',force=false){
  if(!snapshot?.members)return;
  const checkpoints=readCheckpoints(),now=Date.now(),last=checkpoints[0];
  if(!force&&last&&now-new Date(last.createdAt).getTime()<30*60*1000)return;
  checkpoints.unshift({id:`checkpoint-${now}`,createdAt:new Date(now).toISOString(),reason,state:snapshot});
  localStorage.setItem(CHECKPOINT_KEY,JSON.stringify(checkpoints.slice(0,6)));
}
function saveState(options={}){
  const previousRaw=localStorage.getItem(STORAGE_KEY);
  if(!options.skipCheckpoint&&previousRaw){try{storeCheckpoint(JSON.parse(previousRaw),options.reason||'Automatic checkpoint');}catch(e){}}
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  scheduleClubStateSave();
}
function backupPayload(){return {app:BACKUP_APP_ID,version:BACKUP_VERSION,exportedAt:new Date().toISOString(),season:state.season||1,state:JSON.parse(JSON.stringify(state)),generatedWorkouts:JSON.parse(JSON.stringify(generatedWorkouts))};}
function validBackup(payload){const saved=payload?.state;return payload?.app===BACKUP_APP_ID&&payload.version===BACKUP_VERSION&&saved&&Array.isArray(saved.members)&&saved.members.length>0&&saved.logs&&typeof saved.logs==='object'&&Array.isArray(saved.accessories)&&Array.isArray(saved.challengeLibrary)&&Number.isInteger(+saved.activeWeek)&&+saved.activeWeek>=1&&+saved.activeWeek<=16;}
async function exportBackup(){
  const payload=backupPayload(),date=payload.exportedAt.slice(0,10),filename=`falcon-bench-club-season-${payload.season}-${date}.json`,file=new File([JSON.stringify(payload,null,2)],filename,{type:'application/json'});
  try{
    if(navigator.canShare?.({files:[file]})){await navigator.share({title:'Falcon Bench Club backup',text:`Season ${payload.season} workout data backup`,files:[file]});}
    else{const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    localStorage.setItem('falcon-bench-club-last-export',payload.exportedAt);renderBackups();toast('Backup ready to save in Files');
  }catch(error){if(error?.name!=='AbortError')toast('Backup could not be created');}
}
async function importBackupFile(file){
  try{
    const payload=JSON.parse(await file.text());
    if(!validBackup(payload)){toast('That is not a valid Workout Buddy backup');return;}
    const saved=payload.state,when=new Date(payload.exportedAt).toLocaleString();
    if(!confirm(`Restore Season ${saved.season||1} with ${saved.members.length} members from ${when}? Current browser data will be preserved as a local checkpoint first.`))return;
    storeCheckpoint(JSON.parse(JSON.stringify(state)),'Before file restore',true);
    await pushClubState(saved);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));if(Array.isArray(payload.generatedWorkouts))localStorage.setItem(GENERATED_WORKOUTS_KEY,JSON.stringify(payload.generatedWorkouts));
    location.reload();
  }catch(error){toast('Backup file could not be read');}
}
function restoreCheckpoint(id){
  const checkpoint=readCheckpoints().find(item=>item.id===id);if(!checkpoint)return;
  if(!confirm(`Restore the checkpoint from ${new Date(checkpoint.createdAt).toLocaleString()}?`))return;
  storeCheckpoint(JSON.parse(JSON.stringify(state)),'Before checkpoint restore',true);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(checkpoint.state));location.reload();
}
function phaseFor(week){return phases.find(p=>p.weeks.includes(week));}
function challengeForWeek(week){return state.challengeLibrary.find(challenge=>challenge.id===state.weekChallenges[week-1])||state.challengeLibrary.find(challenge=>challenge.active)||{name:'No challenge assigned',detail:'Choose one from the Challenges page'};}
function roundLoad(n,member){const increment=member.max<100?2.5:5;return Math.max(increment,Math.round(n/increment)*increment);}
function latestEstimate(memberId,beforeWeek=17){
  for(let week=Math.min(16,beforeWeek-1);week>=1;week--){const estimate=getLog(memberId,week).estimated1RM;if(estimate)return estimate;}
  return state.members.find(member=>member.id===memberId)?.max||0;
}
function isRecoveryWeek(week){return RECOVERY_WEEKS.includes(week);}
function nextTrainingWeek(programWeek){
  let next=Math.min(16,programWeek+1);
  while(RECOVERY_WEEKS.includes(next))next++;
  return Math.min(16,next);
}
function progressionFor(member,week){
  if(isRecoveryWeek(week))return {max:member.max,direction:'recovery',sourceWeek:week,missed:false,programWeek:week,failureStreak:0,loadScale:1,recovery:true};
  if(week>=13)return {max:member.max,direction:week===16?'test':'peak',sourceWeek:week,missed:false,programWeek:week,failureStreak:0,loadScale:1,test:week===16,peak:true};
  let failureStreak=0;
  for(let prior=week-1;prior>=1;prior--){
    const log=getLog(member.id,prior);
    if(log.attendance&&!isRecoveryWeek(prior)&&!log.recoveryWeek){
      const completedProgramWeek=Math.min(16,Math.max(1,log.programWeek||prior));
      if(log.allReps)return {max:member.max,direction:'up',sourceWeek:prior,missed:false,programWeek:nextTrainingWeek(completedProgramWeek),failureStreak:0,loadScale:1};
      failureStreak=1;
      for(let earlier=prior-1;earlier>=1;earlier--){
        const previous=getLog(member.id,earlier);
        if(!previous.attendance||isRecoveryWeek(earlier)||previous.recoveryWeek)continue;
        if(!previous.allReps&&(previous.programWeek||earlier)===completedProgramWeek)failureStreak++;
        break;
      }
      return {max:member.max,direction:failureStreak>=2?'reset':'hold',sourceWeek:prior,missed:true,programWeek:completedProgramWeek,failureStreak,loadScale:failureStreak>=2?.925:1};
    }
  }
  const firstProgramWeek=week;
  return {max:member.max,direction:'hold',sourceWeek:0,missed:false,programWeek:firstProgramWeek,failureStreak:0,loadScale:1};
}
function trainingMax(member,week){return progressionFor(member,week).max;}
function prescription(member,week){
  const progression=progressionFor(member,week),programWeek=progression.programWeek,plan=competitionPlan[programWeek-1],phase=phaseFor(programWeek),deload=!!plan.deload,max=trainingMax(member,week),pct=plan.topPct;
  const loadScale=progression.loadScale||1,main=roundLoad(max*plan.topPct*loadScale,member),backLoad=plan.backPct?roundLoad(max*plan.backPct*loadScale,member):0;
  const inclinePct=deload?.50:Math.min(.72,.62+((programWeek-1)%4)*.025+(programWeek>4?.025:0));
  const incline=roundLoad(max*inclinePct*loadScale,member);
  const db=roundLoad(max*(deload?.20:.245+Math.floor((programWeek-1)/4)*.01)*loadScale,member);
  const scheme=plan.top+(plan.back?` + ${plan.back}`:'');
  return {phase,deload,max,pct,main,backLoad,incline,db,scheme,topScheme:plan.top,backScheme:plan.back||'',backPct:plan.backPct||0,test:!!plan.test,programWeek,progression};
}
function logKey(memberId,week){return `${memberId}-${week}`;}
function getLog(memberId,week){return state.logs[logKey(memberId,week)]||{};}
function pointsFor(log){return Object.entries(pointFields).reduce((sum,[k,p])=>sum+(log[k]?p:0),0);}
function pointRulesForWeek(week){
  const safeWeek=Math.max(1,Math.min(16,week)),labels=weeklyScoring[safeWeek-1],challengeName=challengeForWeek(safeWeek).name;
  return Object.keys(pointFields).map((field,index)=>({field,label:field==='challenge'?`${challengeName} winner`:field==='pr'?`${challengeName} runner-up`:field==='mvp'?'AMRAP Champ':labels[index],points:pointFields[field]}));
}
function totalPoints(memberId){return Array.from({length:16},(_,i)=>pointsFor(getLog(memberId,i+1))).reduce((a,b)=>a+b,0);}
function cumulativePoints(memberId,throughWeek){return Array.from({length:throughWeek},(_,i)=>pointsFor(getLog(memberId,i+1))).reduce((a,b)=>a+b,0);}
function rankFor(points){return rankDefs.find(([n])=>points>=n)[1];}
function rankMinimum(name){return rankDefs.find(([,rank])=>rank===name)?.[0]||0;}
function rankProgress(points){const rank=rankFor(points),index=rankDefs.findIndex(([,name])=>name===rank),minimum=rankDefs[index][0],next=index>0?rankDefs[index-1]:null,progress=next?Math.max(0,Math.min(100,((points-minimum)/(next[0]-minimum))*100)):100;return {rank,nextName:next?.[1]||'',needed:next?Math.max(0,next[0]-points):0,progress};}
function rankProgressMarkup(points,compact=false){const progress=rankProgress(points);return `<div class="next-rank ${compact?'compact':''}"><div><span>${progress.nextName?`${progress.needed} pts to ${progress.nextName}`:'Apex rank achieved'}</span><b>${Math.round(progress.progress)}%</b></div><i><span style="width:${progress.progress}%"></span></i></div>`;}
function renderRankProgression(){
  const width=1000,height=500,pad={top:24,right:24,bottom:48,left:72},plotW=width-pad.left-pad.right,plotH=height-pad.top-pad.bottom,maxPoints=720;
  const visibleWeeks=Math.max(1,Math.min(16,state.activeWeek));
  const x=week=>pad.left+(visibleWeeks===1?plotW:((week-1)/(visibleWeeks-1))*plotW),y=points=>pad.top+plotH-(points/maxPoints)*plotH;
  const colors=['#ef233c','#2686b9','#c08b13','#7551b5','#14805e','#d95d22','#49525a'];
  const thresholds=rankDefs.filter(([minimum])=>minimum>0);
  const rankGuides=thresholds.map(([minimum,name])=>`<g class="chart-rank-guide"><line x1="${pad.left}" y1="${y(minimum)}" x2="${pad.left+plotW}" y2="${y(minimum)}"/><text x="${pad.left-10}" y="${y(minimum)+3}" text-anchor="end">${minimum}</text><text x="${pad.left+8}" y="${y(minimum)-7}">${name}</text></g>`).join('');
  const weekGuides=Array.from({length:visibleWeeks},(_,i)=>i+1).map(week=>`<g class="chart-week-guide"><line x1="${x(week)}" y1="${pad.top}" x2="${x(week)}" y2="${pad.top+plotH}"/><text x="${x(week)}" y="${height-16}" text-anchor="middle">${week}</text></g>`).join('');
  const sorted=state.members.slice().sort((a,b)=>cumulativePoints(b.id,visibleWeeks)-cumulativePoints(a.id,visibleWeeks));
  const series=sorted.map(member=>{const index=state.members.indexOf(member),color=colors[index%colors.length],values=Array.from({length:visibleWeeks},(_,i)=>cumulativePoints(member.id,i+1)),points=values.map((value,i)=>`${x(i+1)},${y(value)}`).join(' '),dots=values.map((value,i)=>{const week=i+1,log=getLog(member.id,week),weekly=pointsFor(log),earned=pointRulesForWeek(week).filter(rule=>log[rule.field]).map(rule=>rule.label),session=log.weight&&log.reps?`${fmt(log.weight)} lb × ${log.reps} · ${log.estimated1RM||e1rm(+log.weight,+log.reps)} lb e1RM`:'';return `<circle cx="${x(week)}" cy="${y(value)}" r="${4+(index*.55)}" tabindex="0" aria-describedby="flightTooltip" data-name="${esc(member.name)}" data-week="${week}" data-weekly="${weekly}" data-total="${value}" data-rank="${esc(rankFor(value))}" data-earned="${esc(earned.join(' · ')||'No scoring objectives logged')}" data-session="${esc(session)}"/>`;}).join('');return `<g class="chart-series" style="--flight-color:${color}"><polyline class="chart-path-shadow" points="${points}"/><polyline class="chart-path" points="${points}"/>${dots}</g>`;}).join('');
  const leader=sorted[0],leaderPoints=leader?cumulativePoints(leader.id,visibleWeeks):0;
  const legend=sorted.map(member=>{const index=state.members.indexOf(member),color=colors[index%colors.length],score=cumulativePoints(member.id,visibleWeeks);return `<div class="chart-legend-item" style="--flight-color:${color}"><span></span><strong>${esc(member.name)}</strong><small>${score} pts · ${rankFor(score)}</small>${rankProgressMarkup(score,true)}</div>`;}).join('');
  return `<section class="rank-progression combined-chart" aria-labelledby="flightPathTitle"><div class="flight-head"><div><p class="eyebrow light">Live season telemetry</p><h3 id="flightPathTitle">The flight path</h3><p>Cumulative score through the current week. Future weeks appear only after you advance the season.</p></div><div class="flight-lead"><small>Leader through Week ${visibleWeeks}</small><strong>${leader?esc(leader.name):'—'}</strong><span>${leaderPoints} points · ${rankFor(leaderPoints)}</span></div></div><div class="chart-legend" aria-label="Member color legend">${legend}</div><div class="combined-chart-scroll"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Combined cumulative score progression through Week ${visibleWeeks}"><rect class="chart-plot-bg" x="${pad.left}" y="${pad.top}" width="${plotW}" height="${plotH}"/>${weekGuides}${rankGuides}<line class="chart-active-week" x1="${x(visibleWeeks)}" y1="${pad.top}" x2="${x(visibleWeeks)}" y2="${pad.top+plotH}"/>${series}<text class="chart-axis-title" x="18" y="${pad.top+plotH/2}" text-anchor="middle" transform="rotate(-90 18 ${pad.top+plotH/2})">Cumulative points</text><text class="chart-axis-title" x="${pad.left+plotW/2}" y="${height-2}" text-anchor="middle">Season week</text></svg></div><div id="flightTooltip" class="flight-tooltip" role="tooltip" aria-hidden="true"></div><p class="flight-note"><span></span> Orange guide marks the current Week ${visibleWeeks}. Dashed horizontal lines mark promotions.</p></section>`;
}
function bindFlightPathTooltips(){
  const chart=document.querySelector('.combined-chart'),tooltip=document.querySelector('#flightTooltip');if(!chart||!tooltip)return;
  const show=(point,clientX,clientY)=>{tooltip.innerHTML=`<div class="tooltip-kicker">Week ${point.dataset.week} · ${point.dataset.rank}</div><div class="tooltip-title"><strong>${esc(point.dataset.name)}</strong><span>+${point.dataset.weekly} pts</span></div><div class="tooltip-total"><b>${point.dataset.total}</b> cumulative points</div><p>${esc(point.dataset.earned)}</p>${point.dataset.session?`<div class="tooltip-session">${esc(point.dataset.session)}</div>`:''}`;tooltip.setAttribute('aria-hidden','false');tooltip.classList.add('show');const box=chart.getBoundingClientRect(),pointBox=point.getBoundingClientRect(),xPos=clientX??pointBox.left+pointBox.width/2,yPos=clientY??pointBox.top;const left=Math.min(box.width-tooltip.offsetWidth-12,Math.max(12,xPos-box.left+14));let top=yPos-box.top-tooltip.offsetHeight-14;if(top<12)top=yPos-box.top+18;tooltip.style.left=`${left}px`;tooltip.style.top=`${top}px`;};
  const hide=()=>{tooltip.classList.remove('show');tooltip.setAttribute('aria-hidden','true');};
  chart.querySelectorAll('.chart-series circle').forEach(point=>{point.addEventListener('pointerenter',event=>show(point,event.clientX,event.clientY));point.addEventListener('pointermove',event=>show(point,event.clientX,event.clientY));point.addEventListener('pointerleave',hide);point.addEventListener('focus',()=>show(point));point.addEventListener('blur',hide);});
}
function rankLogo(name,size='medium'){
  const visual=rankVisuals[name]||rankVisuals.Recruit;
  const marks={
    recruit:'<path class="rank-frame" d="m32 7 20 12v26L32 57 12 45V19Z"/><path class="rank-core" d="m22 25 10 10 10-10M22 34l10 10 10-10"/>',
    airman:'<path class="rank-frame" d="m32 6 22 13-4 27-18 12-18-12-4-27Z"/><path class="rank-wing" d="M29 27 9 18l8 16-7 5 19 8M35 27l20-9-8 16 7 5-19 8"/><path class="rank-core" d="M32 18v32"/>',
    falcon:'<path class="rank-frame" d="m32 4 23 13-3 30-20 13-20-13-3-30Z"/><path class="rank-wing" d="M29 25 11 15l5 18-8 5 21 10M35 25l18-10-5 18 8 5-21 10"/><path class="rank-core" d="M32 15 43 29 32 47 21 29Z"/><path class="rank-accent" d="m26 30 5 5 8-10"/>',
    overwatch:'<path class="rank-frame" d="M32 3 55 16v31L32 61 9 47V16Z"/><path class="rank-wing" d="M18 21 5 16l7 13-7 6 14 4M46 21l13-5-7 13 7 6-14 4"/><path class="rank-core" d="M13 32s7-12 19-12 19 12 19 12-7 12-19 12S13 32 13 32Z"/><circle class="rank-accent" cx="32" cy="32" r="6"/><path class="rank-detail-line" d="M32 9v7M32 48v7"/>',
    strike:'<path class="rank-frame" d="m32 2 24 14-3 32-21 14-21-14-3-32Z"/><path class="rank-wing" d="M24 21 6 11l7 17-9 6 20 12M40 21l18-10-7 17 9 6-20 12"/><path class="rank-core" d="m36 10-17 25h11l-2 20 18-28H35Z"/><path class="rank-accent" d="M9 48h13M42 48h13"/>',
    blackwing:'<path class="rank-frame" d="m32 1 25 14-2 34-23 14L9 49 7 15Z"/><path class="rank-wing" d="M30 20C19 8 6 9 2 11c9 7 10 14 12 23L4 29c5 14 14 22 26 28M34 20C45 8 58 9 62 11c-9 7-10 14-12 23l10-5c-5 14-14 22-26 28"/><path class="rank-core" d="M32 12 42 25 38 48 32 56 26 48 22 25Z"/><path class="rank-accent" d="M25 27 32 32 39 27M32 32v18"/>',
    champion:'<path class="rank-frame" d="m32 1 25 14-2 34-23 14L9 49 7 15Z"/><path class="rank-ray" d="M32 1v8M7 15l8 5M57 15l-8 5M9 49l8-4M55 49l-8-4"/><path class="rank-wing" d="M28 23 6 9l8 20-11 6 25 14M36 23 58 9l-8 20 11 6-25 14"/><path class="rank-core" d="m15 20 10 7 7-16 7 16 10-7-4 26H19Z"/><path class="rank-accent" d="M19 46h26M24 53h16"/><path class="rank-gem" d="m32 29 6 6-6 6-6-6Z"/>'
  };
  return `<span class="rank-logo rank-logo-${size} rank-tier-${visual.tier}" style="--rank-tone:${visual.tone};--rank-tone-2:${visual.tone2}" role="img" aria-label="${name} insignia"><i></i><svg viewBox="0 0 64 64" aria-hidden="true">${marks[visual.shape]}</svg><b>${visual.code}</b></span>`;
}
function showRankUp(member,newRank){
  const dialog=document.querySelector('#rankUpDialog');
  document.querySelector('#rankUpLogo').innerHTML=rankLogo(newRank,'hero');
  document.querySelector('#rankUpTitle').textContent=newRank;
  document.querySelector('#rankUpMessage').textContent=`${member.name} has earned a promotion. The new insignia is now displayed across the club.`;
  dialog.showModal();
}
function e1rm(weight,reps){return weight&&reps?Math.round(weight*(1+reps/30)):0;}
function wilksScore(bodyLb,liftLb,division){
  if(!bodyLb||!liftLb||!['men','women'].includes(division))return null;
  const bodyKg=bodyLb/2.2046226218,liftKg=liftLb/2.2046226218;
  const coefficients=division==='women'
    ?[594.31747775582,-27.23842536447,.82112226871,-.00930733913,.00004731582,-.00000009054]
    :[-216.0475144,16.2606339,-.002388645,-.00113732,.00000701863,-.00000001291];
  const denominator=coefficients.reduce((sum,coefficient,power)=>sum+coefficient*(bodyKg**power),0);
  return denominator>0?liftKg*500/denominator:null;
}
function attemptPlan(member){
  return [.90,.975,1.025].map((percentage,index)=>({label:['Opener','Second','PR attempt'][index],percentage,load:roundLoad(member.max*percentage,member)}));
}
function workSetsFor(plan){
  const sets=value=>+(String(value||'').match(/^\s*(\d+)/)?.[1]||0);
  return sets(plan.top||plan.topScheme)+sets(plan.back||plan.backScheme);
}
function sessionTiming(week,members=state.members){
  if(week===16)return {benchMinutes:55,totalMinutes:75,label:'70–80 min',flow:'Warm up together, then run three attempt rounds with one lifter on deck and one spotting.'};
  const sets=members.reduce((total,member)=>total+workSetsFor(prescription(member,week)),0);
  const benchMinutes=Math.round(15+sets*1.65),accessoryMinutes=isRecoveryWeek(week)?15:week>=13?18:25,totalMinutes=benchMinutes+accessoryMinutes;
  return {benchMinutes,totalMinutes,label:`${Math.max(40,totalMinutes-5)}–${totalMinutes+5} min`,flow:'Rotate one set per lifter in ascending load order; accessories begin only after competition bench.'};
}
function initials(name){return name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();}
function fmt(n){return Number.isInteger(n)?n:n.toFixed(1);}
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800);}

function setup(){
  const sidebarToggle=document.querySelector('#sidebarToggle');
  const setSidebarCollapsed=collapsed=>{
    document.querySelector('.app-shell').classList.toggle('sidebar-collapsed',collapsed);
    sidebarToggle.setAttribute('aria-expanded',String(!collapsed));
    sidebarToggle.setAttribute('aria-label',collapsed?'Expand navigation':'Collapse navigation');
    sidebarToggle.title=collapsed?'Expand navigation':'Collapse navigation';
    sidebarToggle.querySelector('span').textContent=collapsed?'›':'‹';
  };
  setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY)==='true');
  sidebarToggle.addEventListener('click',()=>{
    const collapsed=!document.querySelector('.app-shell').classList.contains('sidebar-collapsed');
    setSidebarCollapsed(collapsed);
    localStorage.setItem(SIDEBAR_KEY,String(collapsed));
  });
  const weekSelect=document.querySelector('#activeWeek');
  weekSelect.innerHTML=Array.from({length:16},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join('');
  weekSelect.value=state.activeWeek;
  weekSelect.addEventListener('change',()=>{state.activeWeek=+weekSelect.value;saveState();renderAll();});
  document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));
  document.querySelector('#aboutCycle').addEventListener('click',()=>switchView('cycle'));
  document.querySelectorAll('[data-view-link]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.viewLink)));
  document.querySelector('#workoutMember').addEventListener('change',renderWorkouts);
  document.querySelector('#addMember').addEventListener('click',()=>openMemberDialog());
  document.querySelector('#saveMember').addEventListener('click',saveMember);
  document.querySelector('#addChallenge').addEventListener('click',()=>openChallengeDialog());
  document.querySelector('#saveChallenge').addEventListener('click',saveChallenge);
  document.querySelector('#editAccessories').addEventListener('click',openAccessoryDialog);
  document.querySelector('#startClubDay').addEventListener('click',openClubDay);
  document.querySelector('#saveAccessories').addEventListener('click',saveAccessories);
  document.querySelectorAll('[data-close-accessories]').forEach(button=>button.addEventListener('click',closeAccessoryDialog));
  document.querySelectorAll('[data-close-challenge]').forEach(button=>button.addEventListener('click',closeChallengeDialog));
  document.querySelector('#closeRankUp').addEventListener('click',()=>document.querySelector('#rankUpDialog').close());
  document.querySelector('#exportBackup').addEventListener('click',exportBackup);
  document.querySelector('#importBackup').addEventListener('click',()=>document.querySelector('#backupFile').click());
  document.querySelector('#backupFile').addEventListener('change',event=>{const file=event.target.files?.[0];if(file)importBackupFile(file);event.target.value='';});
  document.querySelector('#createCheckpoint').addEventListener('click',()=>{storeCheckpoint(JSON.parse(JSON.stringify(state)),'Manual checkpoint',true);renderBackups();toast('Local checkpoint created');});
  document.querySelector('#generatorForm').addEventListener('submit',submitGeneratorMessage);
  document.querySelector('#resetGenerator').addEventListener('click',resetGenerator);
  document.querySelector('#publishWorkout').addEventListener('click',publishGeneratedWorkout);
  renderAll();hydrateHostedData();
}
function switchView(id){
  document.querySelectorAll('.view,.nav-item').forEach(el=>el.classList.remove('active'));
  document.querySelector(`#${id}`).classList.add('active');const nav=document.querySelector(`[data-view="${id}"]`);if(nav)nav.classList.add('active');
  const titles={dashboard:'Clubhouse',cycle:'Workout Cycle',log:'Log session',workouts:'Workouts',generate:'Generate Workouts',challenges:'Challenges',members:'Members',ranking:'Ranking Details'};document.querySelector('#pageTitle').textContent=titles[id];
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderAll(){
  document.querySelector('#seasonHeader').textContent=`Falcon Bench Club / Season ${state.season}`;
  document.querySelector('#seasonStampNumber').textContent=`Season ${String(state.season).padStart(2,'0')}`;
  document.title=`Falcon Bench Club — Season ${state.season}`;
  renderDashboard();renderLogs();renderWorkoutPicker();renderWorkouts();renderChallenges();renderMembers();renderSeasonControl();renderCycleDetails();renderRankingDetails();renderSeasonHistory();renderBackups();renderGenerator();renderGeneratedLibraries();
}
function renderBackups(){
  const lastExport=localStorage.getItem('falcon-bench-club-last-export'),checkpoints=readCheckpoints(),status=document.querySelector('#backupStatus'),list=document.querySelector('#checkpointList');
  status.innerHTML=`<div><small>Browser save</small><strong>Active now</strong><span>Changes save immediately on this device.</span></div><div><small>Last file backup</small><strong>${lastExport?new Date(lastExport).toLocaleDateString():'Not created yet'}</strong><span>${lastExport?'Keep the file in iCloud Drive or On My iPad.':'Create one before relying on the iPad at club day.'}</span></div><div><small>Local checkpoints</small><strong>${checkpoints.length} / 6</strong><span>Useful for accidental edits; not protected from cleared cache.</span></div>`;
  list.innerHTML=checkpoints.length?`<div class="checkpoint-head"><strong>Recent local checkpoints</strong><small>Stored only in this browser</small></div>${checkpoints.map(checkpoint=>`<div class="checkpoint-row"><div><strong>${esc(checkpoint.reason)}</strong><small>${new Date(checkpoint.createdAt).toLocaleString()}</small></div><button class="edit-btn" type="button" data-restore-checkpoint="${esc(checkpoint.id)}">Restore</button></div>`).join('')}`:`<p class="empty">No local checkpoints yet. They are created periodically as changes are saved.</p>`;
  list.querySelectorAll('[data-restore-checkpoint]').forEach(button=>button.addEventListener('click',()=>restoreCheckpoint(button.dataset.restoreCheckpoint)));
}
function renderCycleDetails(){
  document.querySelector('#cycleDetails').innerHTML=`<div class="cycle-summary"><article><span>01</span><small>Duration</small><strong>16 weeks</strong><p>Four progressive phases with protected recovery in Weeks 4, 8, and 12.</p></article><article><span>02</span><small>Primary goal</small><strong>Bench strength</strong><p>Build repeatable technique, productive volume, and confidence under heavier loads.</p></article><article><span>03</span><small>Auto-regulation</small><strong>Earn the increase</strong><p>One miss repeats the prescription. Two misses trigger a 7.5% reset before rebuilding.</p></article></div><div class="phase-grid">${phases.map((phase,index)=>`<article class="phase-card"><div class="phase-number">0${index+1}</div><p class="eyebrow">Weeks ${phase.weeks[0]}–${phase.weeks.at(-1)}</p><h3>${phase.name}</h3><strong>${phase.goal}</strong><p>${phase.detail}</p><dl><div><dt>Primary work</dt><dd>${phase.top}</dd></div><div><dt>Back-off work</dt><dd>${phase.back}</dd></div><div><dt>Accessories</dt><dd>${phase.accessory}</dd></div></dl></article>`).join('')}</div><div class="cycle-rules"><div><p class="eyebrow light">How progression works</p><h3>Recover together. Progress individually.</h3></div><ol><li><strong>Log the session.</strong><span>Attendance confirms the workout was attempted. Top weight and reps update e1RM as a separate performance indicator.</span></li><li><strong>Complete every rep.</strong><span>The lifter advances to the next training prescription, skipping calendar recovery weeks.</span></li><li><strong>Miss a target.</strong><span>Repeat once. A second miss reduces the full prescription by 7.5% so technique can be rebuilt.</span></li><li><strong>Protect recovery.</strong><span>Weeks 4, 8, and 12 are deloads for everyone and never erase individual progression.</span></li><li><strong>Test in Week 16.</strong><span>Use a planned opener, second attempt, and PR attempt with a spotter and safeties.</span></li></ol></div>`;
}
function renderRankingDetails(){
  const scoring=[['Attended club session',5],['Weekly workout target',5],['Program work',5],['Results logged',5],['Weekly challenge winner',10],['Weekly challenge runner-up',5],['AMRAP Champ',10]];
  document.querySelector('#rankingDetails').innerHTML=`${renderRankProgression()}<div class="rank-layout"><div class="rank-ladder">${rankDefs.map(([minimum,name],index)=>{const next=rankDefs[index-1]?.[0],range=next?`${minimum}–${next-1}`:`${minimum}+`,visual=rankVisuals[name];return `<article class="rank-detail ${minimum===650?'top-rank':''}" style="--rank-tone:${visual.tone};--rank-tone-2:${visual.tone2};--rank-bg:${visual.bg};--rank-ink:${visual.ink}">${rankLogo(name,'large')}<div class="rank-nameplate"><small>Tier ${visual.tier} · ${range} points</small><h3>${name}</h3><span>${visual.title}</span></div><p>${minimum===0?'Begin the climb. Every Falcon starts here.':minimum===650?'The summit rank—reserved for an elite championship season.':`Cross ${minimum} season points to forge the next insignia.`}</p></article>`}).join('')}</div><aside class="points-panel"><p class="eyebrow light">Weekly scoring</p><h3>45 points available</h3>${scoring.map(([label,points])=>`<div><span>${label}</span><strong>+${points}</strong></div>`).join('')}<p class="points-note">The seven opportunities change with each phase so consistency, competition, and program execution are rewarded when they matter. Maximum season score: 720.</p></aside></div>`;
  bindFlightPathTooltips();
}
function renderDashboard(){
  const week=state.activeWeek,phase=phaseFor(week);document.querySelector('#phaseLabel').textContent=`Phase ${phases.indexOf(phase)+1} · ${phase.name} · Week ${week}`;
  document.querySelector('#missionTitle').textContent=phase.goal;document.querySelector('#missionCopy').textContent=phase.detail;
  const challenge=challengeForWeek(week);document.querySelector('#challengeName').textContent=challenge.name;document.querySelector('#challengeDetail').textContent=challenge.detail;
  const totals=state.members.map(m=>totalPoints(m.id));const attended=state.members.filter(m=>getLog(m.id,week).attendance).length;
  const bonuses=Object.values(state.logs).reduce((total,log)=>total+(log.challenge?1:0)+(log.pr?1:0)+(log.mvp?1:0),0),completed=Object.values(state.logs).filter(x=>x.allReps).length;
  document.querySelector('#clubStats').innerHTML=[['Week',`${week} / 16`],['Attendance',`${attended} / ${state.members.length}`],['Weekly bonuses',bonuses],['Sessions cleared',completed]].map(([l,v])=>`<div class="stat-card"><small>${l}</small><strong>${v}</strong></div>`).join('');
  const sorted=[...state.members].sort((a,b)=>totalPoints(b.id)-totalPoints(a.id));
  document.querySelector('#leaderboard').innerHTML=sorted.map((m,i)=>{const pts=totalPoints(m.id),rank=rankFor(pts);return `<div class="leader-row rank-aware"><span class="place">${i+1}</span><div class="leader-name"><strong>${esc(m.name)}</strong><small>${m.max} lb bench max</small>${rankProgressMarkup(pts,true)}</div><span class="rank-pill">${rankLogo(rank,'small')}<span>${rank}</span></span><span class="points">${pts}<small> pts</small></span></div>`}).join('');
  document.querySelector('#squadStatus').innerHTML=state.members.map(m=>{const done=getLog(m.id,week).attendance;return `<div class="status-row"><div class="status-person"><span class="avatar">${esc(initials(m.name))}</span><strong>${esc(m.name)}</strong></div><span class="status-chip ${done?'done':''}">${done?'Checked in':'Not logged'}</span></div>`}).join('');
  renderDashboardWeekStatus();renderWeekWorkflow();renderWeeklyRecap();
}
function renderDashboardWeekStatus(){
  const week=state.activeWeek,logged=state.members.filter(member=>getLog(member.id,week).attendance).length,done=!!state.completedWeeks?.[week];
  document.querySelector('#dashboardWeekStatus').innerHTML=`<button class="dashboard-week-status ${done?'complete':''}" id="openWeekLog" type="button"><span><small>${done?'Week complete':'Logging progress'}</small><strong>Week ${week}</strong></span><span>${done?'View finalized scorecards':`${logged} of ${state.members.length} lifters logged`} <b>→</b></span></button>`;
  document.querySelector('#openWeekLog').addEventListener('click',()=>switchView('log'));
}
function renderWeekWorkflow(){
  const week=state.activeWeek,attended=state.members.filter(member=>getLog(member.id,week).attendance),missing=state.members.filter(member=>!getLog(member.id,week).attendance),done=!!state.completedWeeks?.[week],pct=state.members.length?Math.round(attended.length/state.members.length*100):0;
  document.querySelector('#weekWorkflow').innerHTML=`<section class="week-workflow ${done?'complete':''}"><div class="week-meter"><span style="width:${pct}%"></span></div><div><p class="eyebrow ${done?'light':''}">${done?'Week secured':'Ready check'}</p><h2>${done?`Week ${week} is complete`:`${attended.length} of ${state.members.length} lifters logged`}</h2><p>${done?'Scores are recorded in the season flight path.':missing.length?`Still waiting on ${missing.map(member=>esc(member.name)).join(', ')}.`:'Every lifter has a session entry. Clear the week when awards are final.'}</p></div><button class="${done?'text-btn':'primary-btn'}" id="completeWeek" type="button">${done?(week<16?'Advance to Week '+(week+1):'Season complete'):(missing.length?'Complete with '+missing.length+' missing':'Complete Week '+week)}</button></section>`;
  document.querySelector('#completeWeek').addEventListener('click',()=>{if(done){if(week<16){state.activeWeek=week+1;document.querySelector('#activeWeek').value=state.activeWeek;saveState();renderAll();}return;}if(missing.length&&!confirm(`Complete Week ${week} with no attendance logged for ${missing.map(member=>member.name).join(', ')}?`))return;state.completedWeeks=state.completedWeeks||{};state.completedWeeks[week]=new Date().toISOString();saveState();renderAll();toast(`Week ${week} added to the season record`);});
}
function renderWeeklyRecap(){
  const completed=Object.keys(state.completedWeeks||{}).map(Number).filter(week=>week<=state.activeWeek).sort((a,b)=>b-a),week=completed[0];if(!week){document.querySelector('#weeklyRecap').innerHTML='';return;}
  const results=state.members.map(member=>({member,points:pointsFor(getLog(member.id,week)),log:getLog(member.id,week)})).sort((a,b)=>b.points-a.points),winner=results.find(result=>result.points>0),challengeWinner=results.find(result=>result.log.challenge),runnerUp=results.find(result=>result.log.pr),amrap=results.find(result=>result.log.mvp),bestEstimate=results.filter(result=>result.log.estimated1RM).sort((a,b)=>b.log.estimated1RM-a.log.estimated1RM)[0];
  document.querySelector('#weeklyRecap').innerHTML=`<section class="weekly-recap"><div class="recap-title"><p class="eyebrow light">Week ${week} debrief</p><h2>${winner?esc(winner.member.name):'Squad'} leads the week</h2><p>${winner?`${winner.points} points earned across the Week ${week} scorecard.`:'No scores were recorded.'}</p></div><div class="recap-grid"><article><small>Weekly leader</small><strong>${winner?esc(winner.member.name):'—'}</strong><span>${winner?.points||0} points</span></article><article><small>Challenge podium</small><strong>${challengeWinner?esc(challengeWinner.member.name):'—'}</strong><span>${runnerUp?`${esc(runnerUp.member.name)} runner-up`:'No runner-up logged'}</span></article><article><small>AMRAP Champ</small><strong>${amrap?esc(amrap.member.name):'—'}</strong><span>${amrap?'+10 points':'Not awarded'}</span></article><article><small>Top e1RM</small><strong>${bestEstimate?bestEstimate.log.estimated1RM+' lb':'—'}</strong><span>${bestEstimate?esc(bestEstimate.member.name):'No result logged'}</span></article></div></section>`;
}
function renderLogs(){
  const week=state.activeWeek;
  const rules=pointRulesForWeek(week);
  document.querySelector('#weeklyPointsKey').innerHTML=rules.map(rule=>`<span>${rule.points} ${esc(rule.label)}</span>`).join('');
  document.querySelector('#logCards').innerHTML=state.members.map(m=>{const log=getLog(m.id,week),p=pointsFor(log),testFields=week===16?`<div class="attempt-log"><p class="eyebrow">Championship result</p><label>Best successful bench<input type="number" data-field="bestSuccessful" min="0" step="0.5" value="${log.bestSuccessful||''}" placeholder="lb"></label><button class="edit-btn" type="button" data-adopt-max="${esc(m.id)}">${m.nextSeasonMax?`Next-season max: ${fmt(m.nextSeasonMax)} lb`:'Set next-season max'}</button></div>`:'';return `<article class="log-card" data-member="${esc(m.id)}"><div class="log-card-head"><h3>${esc(m.name)}</h3><span class="week-score">${p}<small> / 45</small></span></div><div class="log-body"><div class="check-grid">${rules.map(rule=>`<label class="point-check"><input type="checkbox" data-field="${rule.field}" ${log[rule.field]?'checked':''}>${esc(rule.label)} <small>+${rule.points}</small></label>`).join('')}</div><div class="result-fields"><label>Top weight<input type="number" data-field="weight" min="0" value="${log.weight||''}" placeholder="lb"></label><label>Top reps<input type="number" data-field="reps" min="0" value="${log.reps||''}" placeholder="reps"></label></div>${log.estimated1RM?`<p class="estimate-readout"><span>Session estimated 1RM</span><strong>${log.estimated1RM} lb</strong></p>`:''}${testFields}</div></article>`}).join('');
  document.querySelectorAll('.log-card input').forEach(input=>input.addEventListener('change',handleLogChange));
  document.querySelectorAll('[data-adopt-max]').forEach(button=>button.addEventListener('click',()=>adoptSeasonMax(button.dataset.adoptMax)));
}
function handleLogChange(e){
  const memberId=e.target.closest('.log-card').dataset.member,key=logKey(memberId,state.activeWeek),member=state.members.find(item=>item.id===memberId),previousRank=rankFor(totalPoints(memberId));state.logs[key]=state.logs[key]||{};
  const field=e.target.dataset.field,log=state.logs[key];
  if(!log.programWeek)log.programWeek=prescription(state.members.find(member=>member.id===memberId),state.activeWeek).programWeek;
  if(isRecoveryWeek(state.activeWeek))log.recoveryWeek=true;
  log[field]=e.target.type==='checkbox'?e.target.checked:(+e.target.value||0);
  if(e.target.type==='checkbox'&&!['attendance','additionalWorkout'].includes(field)&&e.target.checked)log.attendance=true;
  if(field==='attendance'&&!e.target.checked){['beatLast','allReps','challenge','pr','mvp'].forEach(pointField=>log[pointField]=false);}
  log.estimated1RM=log.weight&&log.reps?e1rm(+log.weight,+log.reps):0;
  saveState();renderAll();const newRank=rankFor(totalPoints(memberId));
  if(rankMinimum(newRank)>rankMinimum(previousRank))showRankUp(member,newRank);else toast(log.estimated1RM?`e1RM updated to ${log.estimated1RM} lb`:'Scorecard updated');
}
function adoptSeasonMax(memberId){
  const member=state.members.find(item=>item.id===memberId),best=+getLog(memberId,16).bestSuccessful;
  if(!member||!best){toast('Enter the best successful Week 16 bench first');return;}
  member.nextSeasonMax=Math.max(member.max,best);saveState();renderAll();toast(`${member.name}'s next-season max is ${fmt(member.nextSeasonMax)} lb`);
}
function renderWorkoutPicker(){
  const select=document.querySelector('#workoutMember'),current=select.value||state.members[0]?.id;
  select.innerHTML=`<option value="club">Entire club — bench table</option>`+state.members.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
  select.value=current==='club'||state.members.some(m=>m.id===current)?current:'club';
}
function challengeWorkoutRow(challenge){
  return `<div class="exercise-row challenge-workout-row"><span class="exercise-num" aria-hidden="true">◆</span><div><small class="challenge-kicker">Weekly challenge</small><strong>${esc(challenge.name)}</strong><div class="exercise-scheme">Complete any time before the next club session</div></div><span class="rx">+10 pts</span><span class="exercise-note">${esc(challenge.detail)}</span></div>`;
}
function renderWorkouts(){
  const selected=document.querySelector('#workoutMember').value;
  if(selected==='club'){renderClubBenchTable();return;}
  const member=state.members.find(m=>m.id===selected)||state.members[0];if(!member)return;
  const week=state.activeWeek,rx=prescription(member,week),challenge=challengeForWeek(week);
  const progressionCopy=rx.progression.direction==='recovery'?'Calendar-protected recovery week; individual progression resumes next session.':rx.progression.direction==='test'?'Championship test day with three planned attempts.':rx.progression.direction==='peak'?'Calendar-synchronized peak week; reduced volume protects the Week 16 test.':rx.progression.direction==='reset'?`Two misses triggered a 7.5% load reset for this prescription.`:rx.progression.direction==='up'?`Advanced after completing Week ${rx.progression.sourceWeek}.`:rx.progression.missed?`Repeating the Week ${rx.progression.sourceWeek} competition-bench prescription once.`:'Using the selected calendar-week prescription.';
  const heroLoad=rx.test?'Test':rx.backLoad?`${fmt(rx.main)} / ${fmt(rx.backLoad)} lb`:`${fmt(rx.main)} lb`;
  document.querySelector('#workoutSummary').innerHTML=`<div class="prescription-hero"><div><p class="eyebrow light">${rx.phase.name} / Program Week ${rx.programWeek}</p><h3>${esc(member.name)}'s flight plan</h3><p>Established training max: ${fmt(rx.max)} lb. ${progressionCopy}</p></div><div class="big-load"><small>Primary / back-off</small><strong>${heroLoad}</strong><span>${rx.scheme}</span></div></div>`;
  const volume=rx.deload?2:null;
  const calculatedLoads=[`${fmt(rx.incline)} lb`,`${fmt(rx.db)}s`];
  const accessories=state.accessories.map((exercise,index)=>({exercise,index})).filter(({exercise})=>{
    if(week===16)return false;
    if(week===15&&!/(row|face pull|rear-delt)/i.test(exercise.name))return false;
    if(/incline barbell bench/i.test(exercise.name))return rx.programWeek%2===0;
    if(/(?:incline|flat).*dumbbell bench/i.test(exercise.name))return rx.programWeek%2===1;
    return true;
  }).map(({exercise,index})=>{const rotatingPushdown=/tricep.*(rope|pushdown)|pushdown/i.test(exercise.name),name=rotatingPushdown&&rx.programWeek%2===0?'Skull-crushers':exercise.name,reduced=rx.deload||week>=13,scheme=reduced?`2 × ${exercise.scheme.split('×')[1]?.trim()||'8'}`:exercise.scheme;return [name,scheme,exercise.load==='Calculated load'?(calculatedLoads[index]||'RPE 8'):exercise.load,week===15?'Easy upper-back work only; stop at RPE 6–7':exercise.note];});
  const scheduledPct=Math.round(competitionPlan[week-1].topPct*1000)/10,currentPct=Math.round(rx.pct*1000)/10;
  const pctLabel=rx.progression.missed?`<span class="progression-pct" tabindex="0" data-tooltip="Calendar target for Week ${week}: ${scheduledPct}% primary work" aria-label="Current progression ${currentPct} percent. Calendar target for Week ${week}: ${scheduledPct} percent.">${currentPct}% primary</span>`:`<span class="progression-pct on-track" tabindex="0" data-tooltip="On track for Week ${week}">${currentPct}% primary</span>`;
  const competitionNote=`<span class="competition-meta">${pctLabel}<span class="amrap-champ-badge"><strong>AMRAP Champ · +10</strong><span>Most clean reps on the final Competition Bench set</span></span></span>`;
  const competitionSchemes=rx.backScheme?`<span class="work-stack"><span><small>Primary</small>${rx.topScheme}</span><span><small>Back-off</small>${rx.backScheme}</span></span>`:rx.topScheme;
  const competitionLoads=rx.test?'Build through safe attempts':rx.backLoad?`<span class="work-stack"><span><small>Primary</small>${fmt(rx.main)} lb</span><span><small>Back-off</small>${fmt(rx.backLoad)} lb</span></span>`:`${fmt(rx.main)} lb`;
  const attempts=week===16?`<section class="attempt-planner"><div><p class="eyebrow light">Week 16 attempt planner</p><h3>Three rounds. Three decisions.</h3><p>Use safeties and a competent spotter. Advance only after a successful attempt.</p></div><div class="attempt-grid">${attemptPlan(member).map((attempt,index)=>`<article><small>0${index+1} · ${attempt.label}</small><strong>${fmt(attempt.load)} lb</strong><span>${Math.round(attempt.percentage*1000)/10}% of ${fmt(member.max)} lb</span></article>`).join('')}</div><ol><li>Opener: a weight the lifter owns on any day.</li><li>Second: confirm current strength; adjust after the opener.</li><li>PR attempt: take it only if the second attempt is clean.</li></ol></section>`:'';
  const exercises=[['Competition Bench',competitionSchemes,competitionLoads,competitionNote],...accessories.map(exercise=>[esc(exercise[0]),esc(exercise[1]),esc(exercise[2]),esc(exercise[3])])];
  document.querySelector('#workoutList').innerHTML=attempts+exercises.map((x,i)=>`<div class="exercise-row"><span class="exercise-num">${String(i+1).padStart(2,'0')}</span><div><strong>${x[0]}</strong><div class="exercise-scheme">${x[1]}</div></div><span class="rx">${x[2]}</span><span class="exercise-note">${x[3]}</span></div>`).join('')+challengeWorkoutRow(challenge);
}
let clubDayIndex=0;
function clubDayQueue(){
  const lifters=state.members.map(member=>{const rx=prescription(member,state.activeWeek);return {member,rx,totalSets:Math.max(1,workSetsFor(rx))};}),rounds=Math.max(0,...lifters.map(lifter=>lifter.totalSets));
  return Array.from({length:rounds},(_,round)=>lifters.filter(lifter=>round<lifter.totalSets).map(lifter=>({...lifter,set:round+1}))).flat();
}
function openClubDay(){
  const queue=clubDayQueue();clubDayIndex=Math.max(0,queue.findIndex(item=>(getLog(item.member.id,state.activeWeek).clubDaySets||0)<item.set));if(clubDayIndex<0)clubDayIndex=queue.length;renderClubDay();document.querySelector('#clubDayDialog').showModal();
}
function renderClubDay(){
  const dialog=document.querySelector('#clubDayDialog'),queue=clubDayQueue(),current=queue[clubDayIndex],next=queue[clubDayIndex+1];
  if(!current){dialog.querySelector('#clubDayContent').innerHTML=`<section class="club-day-finish"><p class="eyebrow light">Rotation complete</p><h2>All wings cleared</h2><p>${queue.length} competition-bench turns are logged for Week ${state.activeWeek}.</p><button class="primary-btn" data-club-close type="button">Return to workouts</button></section>`;dialog.querySelector('[data-club-close]').addEventListener('click',()=>dialog.close());return;}
  const previous=queue[clubDayIndex-1],barChange=previous?current.rx.main-previous.rx.main:current.rx.main,rank=rankFor(totalPoints(current.member.id));
  dialog.querySelector('#clubDayContent').innerHTML=`<section class="club-day-stage"><header><div><p class="eyebrow light">Club Day · Week ${state.activeWeek}</p><h2>Competition bench</h2></div><button class="club-close" data-club-close type="button" aria-label="Close Club Day">×</button></header><div class="club-day-progress"><span style="width:${queue.length?clubDayIndex/queue.length*100:0}%"></span></div><div class="on-platform"><div class="platform-person">${rankLogo(rank,'hero')}<div><small>On the platform · Set ${current.set} of ${current.totalSets}</small><h3>${esc(current.member.name)}</h3><span>${rank}</span></div></div><div class="platform-load"><small>Current bar load</small><strong>${current.rx.test?'Attempt plan':fmt(current.rx.main)+' lb'}</strong><span>${current.rx.topScheme}${barChange?` · ${barChange>0?'+':''}${fmt(barChange)} lb change`:''}</span></div></div><div class="on-deck"><span>On deck</span><strong>${next?esc(next.member.name):'Final turn'}</strong><small>${next?`${fmt(next.rx.main)} lb · Set ${next.set} of ${next.totalSets}`:'Close out the session'}</small></div><footer><button class="text-btn" data-club-prev type="button" ${clubDayIndex===0?'disabled':''}>← Previous</button><span>${clubDayIndex+1} / ${queue.length} turns</span><button class="primary-btn" data-club-complete type="button">Complete turn →</button></footer></section>`;
  dialog.querySelector('[data-club-close]').addEventListener('click',()=>dialog.close());dialog.querySelector('[data-club-prev]').addEventListener('click',()=>{clubDayIndex=Math.max(0,clubDayIndex-1);renderClubDay();});dialog.querySelector('[data-club-complete]').addEventListener('click',()=>{const log=state.logs[logKey(current.member.id,state.activeWeek)]=getLog(current.member.id,state.activeWeek);log.attendance=true;log.clubDaySets=Math.max(log.clubDaySets||0,current.set);if(current.set===current.totalSets)log.allReps=true;saveState();clubDayIndex++;renderClubDay();renderAll();});
}
function renderClubBenchTable(){
  const week=state.activeWeek,phase=phaseFor(week),timing=sessionTiming(week),challenge=challengeForWeek(week);
  const rows=state.members.map(member=>({member,rx:prescription(member,week)})).sort((a,b)=>a.rx.main-b.rx.main);
  document.querySelector('#workoutSummary').innerHTML=`<div class="prescription-hero club-hero"><div><p class="eyebrow light">${phase.name} / Week ${week}</p><h3>Competition bench rotation</h3><p>Primary and back-off loads are calculated separately for every lifter.</p></div><div class="big-load"><small>Estimated group session</small><strong>${timing.label}</strong><span>${rows.length} lifters · bench ${timing.benchMinutes} min</span></div></div><div class="session-flow"><strong>Session flow</strong><span>${timing.flow}</span></div><div class="amrap-champ-banner"><span>Competition Bench award</span><strong>AMRAP Champ · +10 points</strong><p>Most clean reps on the final Competition Bench set.</p></div>`;
  document.querySelector('#workoutList').innerHTML=`<div class="bench-table-wrap"><table class="bench-table"><thead><tr><th>Order</th><th>Lifter</th><th>Primary</th><th>Back-off</th><th>Program week</th><th>Change bar by</th></tr></thead><tbody>${rows.map((row,i)=>{const prior=i?rows[i-1].rx.main:0;const jump=i?row.rx.main-prior:row.rx.main;return `<tr><td><span class="load-order">${String(i+1).padStart(2,'0')}</span></td><td><span class="table-lifter"><span class="avatar">${initials(row.member.name)}</span><strong>${row.member.name}</strong></span></td><td><strong class="table-weight">${row.rx.test?'Attempt plan':fmt(row.rx.main)+' lb'}</strong><small>${row.rx.topScheme}</small></td><td>${row.rx.backLoad?`<strong>${fmt(row.rx.backLoad)} lb</strong><small>${row.rx.backScheme}</small>`:'—'}</td><td>${row.rx.progression.recovery?'Protected deload':row.rx.test?'Max day':`Week ${row.rx.programWeek}`}</td><td>${i?`+${fmt(jump)} lb`:'Load bar'}</td></tr>`}).join('')}</tbody></table><p class="table-note">Rotate one set per lifter so each athlete receives natural rest while the bar changes. Keep one lifter on deck and one person spotting.</p></div>${challengeWorkoutRow(challenge)}`;
}
function renderChallenges(){
  const week=state.activeWeek,current=challengeForWeek(week),active=state.challengeLibrary.filter(challenge=>challenge.active);
  document.querySelector('#challengeAssignment').innerHTML=`<div class="assignment-card"><div><p class="eyebrow light">Week ${week} assignment</p><h3>${esc(current.name)}</h3><p>${esc(current.detail)}</p></div><label>Challenge for this week<select id="weekChallengeSelect">${active.map(challenge=>`<option value="${esc(challenge.id)}" ${challenge.id===current.id?'selected':''}>${esc(challenge.name)}</option>`).join('')}</select></label></div>`;
  const selector=document.querySelector('#weekChallengeSelect');
  if(selector)selector.addEventListener('change',e=>{state.weekChallenges[week-1]=e.target.value;saveState();renderAll();toast(`Week ${week} challenge updated`);});
  document.querySelector('#challengeCounts').innerHTML=`<span>${active.length} active</span><span>${state.challengeLibrary.length-active.length} cycled out</span>`;
  document.querySelector('#challengeCards').innerHTML=state.challengeLibrary.map((challenge,index)=>{const weeks=state.weekChallenges.map((id,weekIndex)=>id===challenge.id?weekIndex+1:null).filter(Boolean),firstWeek=weeks[0];return `<article class="challenge-card ${challenge.active?'':'inactive'}" draggable="true" data-challenge-tile="${esc(challenge.id)}"><div class="challenge-card-top"><span class="challenge-drag-handle" aria-hidden="true">⠿</span><span class="status-chip ${challenge.active?'done':''}">${challenge.active?'In rotation':'Cycled out'}</span><span class="challenge-source">${challenge.builtIn?'Season':'Custom'}</span></div><span class="challenge-week-badge">${firstWeek?`Week ${String(firstWeek).padStart(2,'0')}`:'Off deck'}</span><h3>${esc(challenge.name)}</h3><p>${esc(challenge.detail)}</p><small>${weeks.length?`Assigned to week${weeks.length>1?'s':''} ${weeks.join(', ')}`:'Not currently assigned'}</small><div class="challenge-order-actions"><button class="order-btn" data-move-challenge="earlier" data-challenge-id="${esc(challenge.id)}" ${index===0?'disabled':''} aria-label="Move ${esc(challenge.name)} earlier">← Earlier</button><button class="order-btn" data-move-challenge="later" data-challenge-id="${esc(challenge.id)}" ${index===state.challengeLibrary.length-1?'disabled':''} aria-label="Move ${esc(challenge.name)} later">Later →</button></div><div class="challenge-actions"><button class="edit-btn" data-edit-challenge="${esc(challenge.id)}">Edit</button><button class="edit-btn" data-cycle-challenge="${esc(challenge.id)}">${challenge.active?'Cycle out':'Return to rotation'}</button><button class="danger-btn" data-remove-challenge="${esc(challenge.id)}">Remove</button></div></article>`}).join('');
  document.querySelectorAll('[data-edit-challenge]').forEach(button=>button.addEventListener('click',()=>openChallengeDialog(button.dataset.editChallenge)));
  document.querySelectorAll('[data-cycle-challenge]').forEach(button=>button.addEventListener('click',()=>cycleChallenge(button.dataset.cycleChallenge)));
  document.querySelectorAll('[data-remove-challenge]').forEach(button=>button.addEventListener('click',()=>removeChallenge(button.dataset.removeChallenge)));
  document.querySelectorAll('[data-move-challenge]').forEach(button=>button.addEventListener('click',()=>moveChallengeBy(button.dataset.challengeId,button.dataset.moveChallenge==='earlier'?-1:1)));
  let draggedChallengeId='';
  document.querySelectorAll('[data-challenge-tile]').forEach(card=>{
    card.addEventListener('dragstart',event=>{draggedChallengeId=card.dataset.challengeTile;card.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',draggedChallengeId);});
    card.addEventListener('dragend',()=>{draggedChallengeId='';document.querySelectorAll('.challenge-card').forEach(tile=>tile.classList.remove('dragging','drag-before','drag-after'));});
    card.addEventListener('dragover',event=>{event.preventDefault();if(!draggedChallengeId||draggedChallengeId===card.dataset.challengeTile)return;document.querySelectorAll('.challenge-card').forEach(tile=>tile.classList.remove('drag-before','drag-after'));const rect=card.getBoundingClientRect(),after=event.clientY>rect.top+rect.height/2||(Math.abs(event.clientY-(rect.top+rect.height/2))<rect.height*.3&&event.clientX>rect.left+rect.width/2);card.classList.add(after?'drag-after':'drag-before');event.dataTransfer.dropEffect='move';});
    card.addEventListener('drop',event=>{event.preventDefault();const source=draggedChallengeId||event.dataTransfer.getData('text/plain'),rect=card.getBoundingClientRect(),after=event.clientY>rect.top+rect.height/2||(Math.abs(event.clientY-(rect.top+rect.height/2))<rect.height*.3&&event.clientX>rect.left+rect.width/2);moveChallenge(source,card.dataset.challengeTile,after);});
  });
}
function cascadeChallengeWeeks(){
  const activeIds=state.challengeLibrary.filter(challenge=>challenge.active).map(challenge=>challenge.id);
  if(!activeIds.length)return;
  state.weekChallenges=Array.from({length:16},(_,index)=>activeIds[index%activeIds.length]);
}
function moveChallenge(sourceId,targetId,after=false){
  if(!sourceId||sourceId===targetId)return;
  const sourceIndex=state.challengeLibrary.findIndex(challenge=>challenge.id===sourceId),targetIndex=state.challengeLibrary.findIndex(challenge=>challenge.id===targetId);
  if(sourceIndex<0||targetIndex<0)return;
  const [challenge]=state.challengeLibrary.splice(sourceIndex,1);
  let insertAt=state.challengeLibrary.findIndex(item=>item.id===targetId)+(after?1:0);
  state.challengeLibrary.splice(Math.max(0,insertAt),0,challenge);cascadeChallengeWeeks();saveState();renderAll();toast(`${challenge.name} moved; week assignments updated`);
}
function moveChallengeBy(id,direction){
  const index=state.challengeLibrary.findIndex(challenge=>challenge.id===id),target=state.challengeLibrary[index+direction];
  if(index<0||!target)return;
  moveChallenge(id,target.id,direction>0);
}
function saveChallenge(e){
  e.preventDefault();const id=document.querySelector('#challengeId').value,name=document.querySelector('#challengeTitle').value.trim(),detail=document.querySelector('#challengeDescription').value.trim();
  if(!name||!detail){toast('Name and instructions are required');return;}
  if(id){Object.assign(state.challengeLibrary.find(challenge=>challenge.id===id),{name,detail});}else{state.challengeLibrary.push({id:`challenge-${Date.now()}`,name,detail,active:true,builtIn:false});}
  saveState();document.querySelector('#challengeForm').reset();document.querySelector('#challengeDialog').close();renderAll();toast(id?'Challenge updated':'Challenge added to rotation');
}
function openChallengeDialog(id=''){
  const challenge=state.challengeLibrary.find(item=>item.id===id);document.querySelector('#challengeForm').reset();document.querySelector('#challengeId').value=challenge?.id||'';document.querySelector('#challengeTitle').value=challenge?.name||'';document.querySelector('#challengeDescription').value=challenge?.detail||'';document.querySelector('#challengeDialogEyebrow').textContent=challenge?'Edit challenge':'New challenge';document.querySelector('#challengeDialogTitle').textContent=challenge?'Update the challenge':'Add to the deck';document.querySelector('#saveChallenge').textContent=challenge?'Save changes':'Add challenge';document.querySelector('#challengeDialog').showModal();
}
function closeChallengeDialog(){
  document.querySelector('#challengeForm').reset();document.querySelector('#challengeDialog').close();
}
function cycleChallenge(id){
  const challenge=state.challengeLibrary.find(item=>item.id===id);if(!challenge)return;
  if(challenge.active&&state.challengeLibrary.filter(item=>item.active).length===1){toast('Keep at least one challenge in rotation');return;}
  challenge.active=!challenge.active;
  cascadeChallengeWeeks();saveState();renderAll();toast(challenge.active?'Challenge returned to rotation':'Challenge cycled out');
}
function removeChallenge(id){
  const fallback=state.challengeLibrary.find(challenge=>challenge.active&&challenge.id!==id);if(!fallback){toast('Keep at least one challenge in rotation');return;}
  state.challengeLibrary=state.challengeLibrary.filter(challenge=>challenge.id!==id);cascadeChallengeWeeks();saveState();renderAll();toast('Challenge removed');
}
function openAccessoryDialog(){
  document.querySelector('#accessoryFields').innerHTML=state.accessories.map((exercise,index)=>`<fieldset class="accessory-field"><legend>Accessory ${index+1}</legend><label>Movement<input data-accessory="name" data-index="${index}" value="${esc(exercise.name)}" required maxlength="45"></label><div class="field-row"><label>Sets × reps<input data-accessory="scheme" data-index="${index}" value="${esc(exercise.scheme)}" required maxlength="20"></label><label>Load target<input data-accessory="load" data-index="${index}" value="${esc(exercise.load)}" required maxlength="25"></label></div><label>Coaching note<input data-accessory="note" data-index="${index}" value="${esc(exercise.note)}" required maxlength="80"></label></fieldset>`).join('');
  document.querySelector('#accessoryDialog').showModal();
}
function closeAccessoryDialog(){document.querySelector('#accessoryDialog').close();}
function saveAccessories(e){
  e.preventDefault();
  const fields=[...document.querySelectorAll('[data-accessory]')];
  if(fields.some(field=>!field.value.trim())){toast('Complete every accessory field');return;}
  state.accessories=state.accessories.map((exercise,index)=>({name:document.querySelector(`[data-accessory="name"][data-index="${index}"]`).value.trim(),scheme:document.querySelector(`[data-accessory="scheme"][data-index="${index}"]`).value.trim(),load:document.querySelector(`[data-accessory="load"][data-index="${index}"]`).value.trim(),note:document.querySelector(`[data-accessory="note"][data-index="${index}"]`).value.trim()}));
  saveState();closeAccessoryDialog();renderAll();toast('Accessory lineup updated');
}
function renderMembers(){
  document.querySelector('#memberCards').innerHTML=state.members.map(m=>{const pts=totalPoints(m.id),rank=rankFor(pts),visual=rankVisuals[rank],current=latestEstimate(m.id),best=Array.from({length:16},(_,i)=>getLog(m.id,i+1)).reduce((a,l)=>Math.max(a,l.estimated1RM||0),m.max),wilks=wilksScore(m.body,m.max,m.wilksDivision);return `<article class="member-card ranked-member-card" style="--rank-tone:${visual.tone};--rank-tone-2:${visual.tone2};--rank-bg:${visual.bg};--rank-ink:${visual.ink}"><div class="member-identity">${rankLogo(rank,'medium')}<div><h3>${esc(m.name)}</h3><span class="member-rank">${rank} · ${pts} points</span></div></div>${rankProgressMarkup(pts)}<div class="member-numbers"><div class="member-number"><small>Current e1RM</small><strong>${current} lb</strong></div><div class="member-number"><small>Best e1RM</small><strong>${best} lb</strong></div><div class="member-number"><small>Attendance</small><strong>${Array.from({length:16},(_,i)=>getLog(m.id,i+1).attendance?1:0).reduce((a,b)=>a+b,0)}</strong></div><div class="member-number"><small>Body weight</small><strong>${m.body?fmt(m.body)+' lb':'—'}</strong></div><div class="member-number wilks-number"><small>Bench Wilks</small><strong>${wilks?wilks.toFixed(2):'—'}</strong><span>${wilks?'Based on entered bench 1RM':m.body?'Select a coefficient division':'Add body weight'}</span></div></div><button class="edit-btn" data-edit="${esc(m.id)}">Edit profile</button></article>`}).join('');
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openMemberDialog(b.dataset.edit)));
}
function buildNextSeason(current){
  const season=current.season||1;
  const archivedMembers=current.members.map(member=>{
    const points=Array.from({length:16},(_,index)=>pointsFor(current.logs[`${member.id}-${index+1}`]||{})).reduce((sum,value)=>sum+value,0);
    const tested=+(current.logs[`${member.id}-16`]?.bestSuccessful||0),endingMax=member.nextSeasonMax||Math.max(member.max,tested);
    const attendance=Array.from({length:16},(_,index)=>current.logs[`${member.id}-${index+1}`]?.attendance?1:0).reduce((sum,value)=>sum+value,0);
    return {id:member.id,name:member.name,startingMax:member.max,endingMax,points,attendance,rank:rankFor(points)};
  });
  return {...current,season:season+1,activeWeek:1,completedWeeks:{},logs:{},weekChallenges:defaultWeekChallenges(),seasonHistory:[...(current.seasonHistory||[]),{season,completedAt:new Date().toISOString(),members:archivedMembers}],members:current.members.map(member=>{const tested=+(current.logs[`${member.id}-16`]?.bestSuccessful||0),max=member.nextSeasonMax||Math.max(member.max,tested),next={...member,max};delete next.nextSeasonMax;return next;})};
}
function renderSeasonHistory(){
  const history=[...(state.seasonHistory||[])].reverse(),container=document.querySelector('#seasonHistory');
  if(!history.length){container.innerHTML=`<section class="history-empty"><p class="eyebrow">Hall of seasons</p><h2>Your first banner is still being earned</h2><p>Complete Week 16 and begin the next season to archive final standings, ranks, attendance, and strength gains here.</p></section>`;return;}
  container.innerHTML=`<section class="season-history"><div class="history-head"><p class="eyebrow light">Hall of seasons</p><h2>Archived campaigns</h2><p>Every completed season, preserved as a permanent club record.</p></div><div class="history-list">${history.map(season=>{const members=[...season.members].sort((a,b)=>b.points-a.points),champion=members[0];return `<article class="history-season"><div class="history-banner"><span>Season ${String(season.season).padStart(2,'0')}</span><strong>${champion?esc(champion.name):'No champion'}</strong><small>${champion?`${champion.points} points · ${champion.rank||rankFor(champion.points)}`:'No results'}</small></div><div class="history-standings">${members.map((member,index)=>`<div><b>${index+1}</b><strong>${esc(member.name)}</strong><span>${member.points} pts · ${member.rank||rankFor(member.points)}</span><small>${member.startingMax} → ${member.endingMax} lb${member.attendance!=null?` · ${member.attendance}/16 attended`:''}</small></div>`).join('')}</div></article>`;}).join('')}</div></section>`;
}
function renderSeasonControl(){
  const ready=state.members.filter(member=>member.nextSeasonMax).length;
  document.querySelector('#seasonControl').innerHTML=`<section class="season-control ${state.activeWeek===16?'ready':''}"><div><p class="eyebrow light">Season transition</p><h3>${state.activeWeek===16?'Prepare Season '+(state.season+1):'Week 16 unlocks the next season'}</h3><p>${state.activeWeek===16?`${ready} of ${state.members.length} members have a confirmed next-season max. Starting a new season archives standings and results.`:'Complete the championship test, record each successful max, then begin the next 16-week cycle.'}</p></div>${state.activeWeek===16?`<button class="primary-btn" id="startNextSeason" type="button">Start Season ${state.season+1}</button>`:''}</section>`;
  document.querySelector('#startNextSeason')?.addEventListener('click',startNextSeason);
}
function startNextSeason(){
  const missing=state.members.filter(member=>!member.nextSeasonMax).map(member=>member.name);
  const warning=missing.length?` No new max is confirmed for ${missing.join(', ')}; their current max will carry forward.`:'';
  if(!confirm(`Archive Season ${state.season} and start Season ${state.season+1}? Scores and weekly logs will reset.${warning}`))return;
  state=buildNextSeason(state);saveState();document.querySelector('#activeWeek').value='1';renderAll();switchView('dashboard');toast(`Season ${state.season} is ready`);
}
function openMemberDialog(id){
  const m=state.members.find(x=>x.id===id);document.querySelector('#dialogTitle').textContent=m?'Edit member':'Add member';document.querySelector('#memberId').value=m?.id||'';document.querySelector('#memberName').value=m?.name||'';document.querySelector('#memberMax').value=m?.max||'';document.querySelector('#memberBody').value=m?.body||'';document.querySelector('#memberWilksDivision').value=m?.wilksDivision||'';document.querySelector('#memberDialog').showModal();
}
function saveMember(e){
  e.preventDefault();const name=document.querySelector('#memberName').value.trim(),max=+document.querySelector('#memberMax').value,body=+document.querySelector('#memberBody').value||0,wilksDivision=document.querySelector('#memberWilksDivision').value,id=document.querySelector('#memberId').value;
  if(!name||!Number.isFinite(max)||max<=0||body<0||!['','men','women'].includes(wilksDivision)){toast('Enter a valid name, bench max, and body weight');return;}
  if(body&&!wilksDivision){toast('Select a Wilks coefficient division');return;}
  if(id){Object.assign(state.members.find(m=>m.id===id),{name,max,body,wilksDivision});}else{state.members.push({id:`m${Date.now()}`,name,max,body,wilksDivision});}
  saveState();document.querySelector('#memberDialog').close();renderAll();toast(id?'Member updated':'Member added');
}

function movementIcon(category='mobility'){
  const art={
    push:'<circle cx="24" cy="20" r="7"/><path d="M31 27l20 9 21 1M49 35l-7 18M42 53l-19 4M55 38l10 18"/><path class="moving" d="M31 28l21 9"/>',
    squat:'<circle cx="30" cy="17" r="7"/><path d="M31 24l8 23 20 8M39 47l-17 12M59 55l13 14M23 29l24 1"/><path class="moving" d="M39 47l20 8 13 14"/>',
    hinge:'<circle cx="25" cy="22" r="7"/><path d="M31 27l29 13M60 40l15-15M59 40l-4 24M55 64l19 8M50 38l-16 17"/><path class="moving" d="M31 27l29 13"/>',
    pull:'<circle cx="66" cy="20" r="7"/><path d="M59 27L44 42 27 40M45 42l9 18M54 60l18 10M50 58L35 70"/><path class="moving" d="M59 29L43 42 26 40"/>',
    core:'<circle cx="20" cy="56" r="7"/><path d="M27 56h25M39 55l4-25M43 30l17-16M43 31l20 13M52 56l22 13"/><path class="moving" d="M43 30l17-16M52 56l22 13"/>',
    cardio:'<circle cx="39" cy="16" r="7"/><path d="M37 23l-5 22 17 10M34 32l20 4 10-11M32 45L16 64M49 55l20 15"/><path class="moving" d="M32 45L16 64M49 55l20 15"/>',
    carry:'<circle cx="45" cy="16" r="7"/><path d="M45 23v27M45 50L33 72M45 50l13 22M44 30L27 43M46 30l17 13M18 43h17M57 43h16"/><path class="moving" d="M18 43h17M57 43h16"/>',
    mobility:'<circle cx="45" cy="17" r="7"/><path d="M45 24v27M45 34L23 20M45 34l22-14M45 51L31 72M45 51l14 21"/><path class="moving" d="M23 20l-8 8M67 20l8 8"/>'
  };
  return `<svg class="movement-icon" viewBox="0 0 90 82" role="img" aria-label="Simplified ${esc(category)} movement guide"><g>${art[category]||art.mobility}</g></svg>`;
}
function renderGenerator(){
  const messages=document.querySelector('#generatorMessages'),draft=document.querySelector('#generatorDraft');
  const intro={role:'assistant',content:'Tell me what kind of workout you need. Before I build it, I’ll confirm your available equipment, goal, time, training experience, and any pain or movement restrictions.'};
  const rows=generatorState.messages.length?generatorState.messages:[intro];
  messages.innerHTML=rows.map(message=>`<div class="coach-message ${message.role==='user'?'from-user':'from-coach'}"><small>${message.role==='user'?'You':'Falcon coach'}</small><p>${esc(message.content)}</p>${message.questions?.length?`<ul>${message.questions.map(question=>`<li>${esc(question)}</li>`).join('')}</ul>`:''}</div>`).join('')+(generatorState.busy?'<div class="coach-message from-coach thinking"><small>Falcon coach</small><p>Building the next step<span>...</span></p></div>':'');
  messages.scrollTop=messages.scrollHeight;
  draft.innerHTML=generatorState.draft?renderWorkoutSheet(generatorState.draft,true):`<div class="draft-empty"><span class="draft-watermark">WIP</span><div class="wing-mark"><span>F</span></div><p class="eyebrow">Build sheet</p><h3>Your draft will take shape here.</h3><p>Answer the coach’s questions, review every exercise, and request as many changes as you need. Nothing is published without your approval.</p><ol><li>Describe the need</li><li>Answer follow-up questions</li><li>Review and revise</li><li>Choose private or public</li></ol></div>`;
  bindWorkoutActions(draft);
  const input=document.querySelector('#generatorPrompt'),button=document.querySelector('#sendGeneratorPrompt');
  input.disabled=generatorState.busy;button.disabled=generatorState.busy;button.innerHTML=generatorState.busy?'Coach is working…':'Talk to coach <span>→</span>';
}
function renderWorkoutSheet(workout,isDraft=false){
  const sections=(workout.sections||[]).map((section,index)=>`<section class="generated-section"><header><span>${String(index+1).padStart(2,'0')}</span><div><h4>${esc(section.name)}</h4><small>${esc(section.duration||'')}</small></div></header>${section.note?`<p class="section-note">${esc(section.note)}</p>`:''}<div class="generated-exercises">${(section.exercises||[]).map(exercise=>`<article>${movementIcon(exercise.category)}<div><h5>${esc(exercise.name)} <em>${esc(exercise.prescription)}</em></h5><p>${(exercise.cues||[]).map(esc).join(' · ')}</p>${exercise.avoid?`<small><b>Avoid:</b> ${esc(exercise.avoid)}</small>`:''}${exercise.substitution?`<small><b>Swap:</b> ${esc(exercise.substitution)}</small>`:''}</div></article>`).join('')}</div></section>`).join('');
  return `<article class="workout-sheet ${isDraft?'is-draft':''}" data-print-workout><div class="workout-sheet-head"><div><p>Falcon Bench Club</p><h3>${esc(workout.title||'Custom workout')}</h3><strong>${esc(workout.subtitle||workout.goal||'')}</strong><small>${esc(workout.duration||'')} / ${esc(workout.intensity||'')} / ${(workout.equipment||[]).map(esc).join(', ')||'No equipment'}</small></div><div class="wing-mark"><span>F</span></div>${isDraft?'<b class="draft-stamp">Work in progress</b>':''}</div>${workout.safetyNote?`<div class="generated-safety"><b>Safety first</b><p>${esc(workout.safetyNote)}</p></div>`:''}${sections}<footer>${(workout.notes||[]).map(note=>`<p>${esc(note)}</p>`).join('')}<small>Generated workout guidance is not medical advice. Use good judgment and stop for pain, dizziness, chest pain, or unusual shortness of breath.</small></footer></article><div class="draft-actions"><button class="edit-btn" type="button" data-request-changes>Request changes</button><button class="edit-btn" type="button" data-print-generated>Print / save PDF</button>${isDraft?'<button class="primary-btn" type="button" data-approve-generated>Review & approve</button>':''}</div>`;
}
function bindWorkoutActions(container){
  container.querySelector('[data-request-changes]')?.addEventListener('click',()=>{document.querySelector('#generatorPrompt').focus();document.querySelector('#generatorPrompt').placeholder='Tell the coach exactly what you want changed or replaced…';});
  container.querySelector('[data-approve-generated]')?.addEventListener('click',()=>{document.querySelector('#publishWorkoutForm').reset();document.querySelector('#publishWorkoutDialog').showModal();});
  container.querySelector('[data-print-generated]')?.addEventListener('click',()=>printGeneratedWorkout(container));
}
async function submitGeneratorMessage(event){
  event.preventDefault();const input=document.querySelector('#generatorPrompt'),content=input.value.trim();if(!content||generatorState.busy)return;
  generatorState.messages.push({role:'user',content});generatorState.busy=true;input.value='';renderGenerator();
  try{
    const response=await fetch('/api/workout-agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:generatorState.messages.slice(-14),draft:generatorState.draft})});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'The coach could not respond.');
    generatorState.messages.push({role:'assistant',content:result.assistantMessage,questions:result.questions||[]});
    if(result.stage==='draft'&&result.workout)generatorState.draft=result.workout;
    saveGeneratorState();
  }catch(error){generatorState.messages.push({role:'assistant',content:error.message||'The coach could not respond. Keep this page open and try again.'});}
  generatorState.busy=false;saveGeneratorState();renderGenerator();
}
function resetGenerator(){
  if((generatorState.messages.length||generatorState.draft)&&!confirm('Clear this work-in-progress workout and start again? Published workouts will stay saved.'))return;
  generatorState={messages:[],draft:null,busy:false};saveGeneratorState();renderGenerator();
}
async function publishGeneratedWorkout(event){
  event.preventDefault();const form=document.querySelector('#publishWorkoutForm');if(!form.reportValidity()||!generatorState.draft)return;
  const visibility=new FormData(form).get('workoutVisibility')||'private';
  const button=document.querySelector('#publishWorkout');button.disabled=true;button.textContent='Publishing…';
  try{
    const response=await fetch('/api/generated-workouts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({workout:generatorState.draft,visibility})});
    let workout;if(response.ok)workout=await response.json();else workout={...JSON.parse(JSON.stringify(generatorState.draft)),id:`generated-${Date.now()}`,visibility,createdAt:new Date().toISOString(),owner:'My account',isMine:true};
    generatedWorkouts.unshift(workout);saveGeneratedWorkouts();document.querySelector('#publishWorkoutDialog').close();renderGeneratedLibraries();toast(visibility==='public'?'Workout published to you and the club':'Private workout published to your library');
  }catch(error){toast('Workout could not be published. Keep the draft open and try again.');}
  finally{button.disabled=false;button.textContent='Approve & publish';}
}
function renderGeneratedLibraries(){
  const mine=generatedWorkouts.filter(workout=>workout.isMine!==false),club=generatedWorkouts.filter(workout=>workout.visibility==='public');
  document.querySelector('#myWorkoutCount').textContent=mine.length;document.querySelector('#clubWorkoutCount').textContent=club.length;
  document.querySelector('#myGeneratedWorkouts').innerHTML=renderWorkoutCards(mine,'No approved workouts yet. Start with a request above.');
  document.querySelector('#clubGeneratedWorkouts').innerHTML=renderWorkoutCards(club,'No public club workouts yet.');
  document.querySelectorAll('[data-open-generated]').forEach(button=>button.addEventListener('click',()=>openGeneratedWorkout(button.dataset.openGenerated)));
}
function renderWorkoutCards(workouts,empty){return workouts.length?workouts.map(workout=>`<article class="generated-workout-card"><div><span>${workout.visibility==='public'?'Club':'Private'}</span><small>${new Date(workout.createdAt).toLocaleDateString()}</small></div><h3>${esc(workout.title)}</h3><p>${esc(workout.subtitle||workout.goal||'')}</p><dl><div><dt>Time</dt><dd>${esc(workout.duration||'Flexible')}</dd></div><div><dt>Equipment</dt><dd>${esc((workout.equipment||[]).join(', ')||'None')}</dd></div></dl><button class="edit-btn" type="button" data-open-generated="${esc(workout.id)}">Open workout</button></article>`).join(''):`<p class="generated-empty">${esc(empty)}</p>`;}
function openGeneratedWorkout(id){const workout=generatedWorkouts.find(item=>item.id===id);if(!workout)return;generatorState.draft=JSON.parse(JSON.stringify(workout));generatorState.messages=[{role:'assistant',content:`I opened “${workout.title}.” Ask for changes to create a new draft; the approved copy will remain saved.`}];saveGeneratorState();renderGenerator();document.querySelector('#generate').scrollIntoView({behavior:'smooth'});}
function printGeneratedWorkout(container){const sheet=container.querySelector('[data-print-workout]');if(!sheet)return;document.querySelectorAll('[data-print-workout]').forEach(item=>item.classList.remove('print-target'));sheet.classList.add('print-target');document.body.classList.add('printing-workout');window.print();setTimeout(()=>{document.body.classList.remove('printing-workout');sheet.classList.remove('print-target');},300);}

setup();
