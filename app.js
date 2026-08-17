const STORAGE_KEY = 'falcon-bench-club-v1';
const CHALLENGE_CATALOG_VERSION = 2;

const defaultMembers = [
  {id:'nikki',name:'Nikki',max:85,body:0},
  {id:'pardo',name:'Pardo',max:190,body:0},
  {id:'joe',name:'Joe',max:225,body:0},
  {id:'garrett',name:'Garrett',max:245,body:0},
  {id:'chris',name:'Chris',max:255,body:0}
];

const phases = [
  {name:'Foundation',weeks:[1,2,3,4],goal:'Build the pattern. Own every rep.',detail:'Technique, higher volume and zero grinders.',top:'5 × 5',back:'—',accessory:'Full volume'},
  {name:'Growth',weeks:[5,6,7,8],goal:'Add muscle. Raise the floor.',detail:'A heavy set of five followed by productive back-off work.',top:'1 × 5',back:'4 × 6',accessory:'Full + weighted dips'},
  {name:'Overload',weeks:[9,10,11,12],goal:'Carry more. Stay precise.',detail:'Heavy fours, controlled back-offs and optional bands or chains.',top:'1 × 4',back:'4 × 5',accessory:'Heavier loading'},
  {name:'Peak',weeks:[13,14,15,16],goal:'Earn your wings.',detail:'Heavy triples, reduced accessories and a championship finish.',top:'1 × 2–3',back:'2–3 × 3–5',accessory:'Reduced volume'}
];

const challengeSeeds = [['AMRAP Last Set','Most Clean reps on the final set earns +10 points']];
const defaultChallengeLibrary = challengeSeeds.map((challenge,index)=>({id:`standard-${index+1}`,name:challenge[0],detail:challenge[1],active:true,builtIn:true}));
const defaultAccessories = [
  {name:'Incline Barbell Bench',scheme:'3 × 8–10',load:'Calculated load',note:'Odd weeks; add load after all sets reach 10'},
  {name:'Incline Dumbbell Bench',scheme:'3 × 10–12',load:'Calculated load',note:'Leave 1–2 reps in reserve'},
  {name:'Pec Deck / Cable Fly',scheme:'3 × 12–15',load:'RPE 8',note:'Controlled stretch and full range'},
  {name:'Tricep Rope Pushdown',scheme:'3 × 12–15',load:'RPE 8',note:'Add one rep per set before weight'},
  {name:'Lateral Raise',scheme:'3 × 15–20',load:'RPE 8',note:'No momentum; control the lowering'}
];

const competitionPlan = [
  {top:'5 × 5',topPct:.70},{top:'5 × 5',topPct:.725},{top:'5 × 5',topPct:.75},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 5',topPct:.80,back:'4 × 6',backPct:.70},{top:'1 × 5',topPct:.825,back:'4 × 6',backPct:.725},{top:'1 × 5',topPct:.85,back:'4 × 6',backPct:.75},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 4',topPct:.85,back:'4 × 5',backPct:.75},{top:'1 × 4',topPct:.875,back:'4 × 5',backPct:.775},{top:'1 × 4',topPct:.90,back:'4 × 5',backPct:.80},{top:'3 × 5',topPct:.60,deload:true},
  {top:'1 × 3',topPct:.875,back:'3 × 5',backPct:.725},{top:'1 × 3',topPct:.90,back:'3 × 5',backPct:.75},{top:'1 × 2–3',topPct:.925,back:'2 × 3',backPct:.75},{top:'Work to a new 1RM',topPct:1,test:true}
];
const rankDefs = [[650,'Falcon Champion'],[525,'Black Wing'],[400,'Strike Leader'],[300,'OverWatch'],[200,'Falcon'],[100,'Airman'],[0,'Recruit']];
const rankVisuals = {
  'Recruit':{code:'R',tone:'#777',shape:'chevron'},'Airman':{code:'A',tone:'#5c93b8',shape:'wings'},'Falcon':{code:'F',tone:'#c5a353',shape:'shield'},
  'OverWatch':{code:'O',tone:'#8b5fbf',shape:'eye'},'Strike Leader':{code:'S',tone:'#e35f28',shape:'bolt'},'Black Wing':{code:'B',tone:'#272727',shape:'blackwing'},'Falcon Champion':{code:'C',tone:'#e31b23',shape:'champion'}
};
const pointFields = {attendance:5,beatLast:5,allReps:5,challenge:10,pr:20};

let state = loadState();

function loadState(){
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved?.members){
      saved.accessories=saved.accessories||defaultAccessories;
      const legacyPushdown=saved.accessories.find(exercise=>exercise.name==='Triceps Pushdown');
      if(legacyPushdown){legacyPushdown.name='Tricep Rope Pushdown';localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}
      saved.accessories.forEach(exercise=>{
        if(exercise.name==='Incline Barbell Bench'&&exercise.scheme==='4 × 8–10'){exercise.scheme='3 × 8–10';exercise.note='Odd weeks; add load after all sets reach 10';}
        if(exercise.name==='Tricep Rope Pushdown'&&exercise.scheme==='4 × 12–15')exercise.scheme='3 × 12–15';
        if(exercise.name==='Lateral Raise'&&exercise.scheme==='4 × 15–20')exercise.scheme='3 × 15–20';
      });
      localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      Object.values(saved.logs||{}).forEach(log=>{if(log.weight&&log.reps)log.estimated1RM=e1rm(+log.weight,+log.reps);});
      localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      if(saved.challengeCatalogVersion!==CHALLENGE_CATALOG_VERSION){
        saved.challengeLibrary=defaultChallengeLibrary;
        saved.weekChallenges=Array(16).fill(defaultChallengeLibrary[0].id);
        saved.challengeCatalogVersion=CHALLENGE_CATALOG_VERSION;
        localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      } else {
        saved.challengeLibrary=saved.challengeLibrary||defaultChallengeLibrary;
        saved.weekChallenges=saved.weekChallenges||Array(16).fill(defaultChallengeLibrary[0].id);
      }
      const amrapChallenge=saved.challengeLibrary.find(challenge=>challenge.id==='standard-1'&&challenge.name==='AMRAP Last Set');
      if(amrapChallenge?.detail==='Most clean reps on the final set wins'){
        amrapChallenge.detail='Most Clean reps on the final set earns +10 points';
        localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      }
      return saved;
    }
  } catch(e){}
  return {activeWeek:1,members:defaultMembers,logs:{},challengeLibrary:defaultChallengeLibrary,weekChallenges:Array(16).fill(defaultChallengeLibrary[0].id),challengeCatalogVersion:CHALLENGE_CATALOG_VERSION,accessories:defaultAccessories};
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function phaseFor(week){return phases.find(p=>p.weeks.includes(week));}
function challengeForWeek(week){return state.challengeLibrary.find(challenge=>challenge.id===state.weekChallenges[week-1])||state.challengeLibrary.find(challenge=>challenge.active)||{name:'No challenge assigned',detail:'Choose one from the Challenges page'};}
function roundLoad(n,member){const increment=member.max<100?2.5:5;return Math.max(increment,Math.round(n/increment)*increment);}
function latestEstimate(memberId,beforeWeek=17){
  for(let week=Math.min(16,beforeWeek-1);week>=1;week--){const estimate=getLog(memberId,week).estimated1RM;if(estimate)return estimate;}
  return state.members.find(member=>member.id===memberId)?.max||0;
}
function progressionFor(member,week){
  for(let prior=week-1;prior>=1;prior--){
    const log=getLog(member.id,prior);
    if(log.attendance){
      const completedProgramWeek=Math.min(16,Math.max(1,log.programWeek||prior));
      return {max:member.max,direction:log.allReps?'up':'hold',sourceWeek:prior,missed:!log.allReps,programWeek:log.allReps?Math.min(16,completedProgramWeek+1):completedProgramWeek};
    }
  }
  return {max:member.max,direction:'hold',sourceWeek:0,missed:false,programWeek:week};
}
function trainingMax(member,week){return progressionFor(member,week).max;}
function prescription(member,week){
  const progression=progressionFor(member,week),programWeek=progression.programWeek,plan=competitionPlan[programWeek-1],phase=phaseFor(programWeek),deload=!!plan.deload,max=trainingMax(member,week),pct=plan.topPct;
  const main=roundLoad(max*plan.topPct,member),backLoad=plan.backPct?roundLoad(max*plan.backPct,member):0;
  const inclinePct=deload?.50:Math.min(.72,.62+((programWeek-1)%4)*.025+(programWeek>4?.025:0));
  const incline=roundLoad(max*inclinePct,member);
  const db=roundLoad(max*(deload?.20:.245+Math.floor((programWeek-1)/4)*.01),member);
  const scheme=plan.top+(plan.back?` + ${plan.back}`:'');
  return {phase,deload,max,pct,main,backLoad,incline,db,scheme,topScheme:plan.top,backScheme:plan.back||'',backPct:plan.backPct||0,test:!!plan.test,programWeek,progression};
}
function logKey(memberId,week){return `${memberId}-${week}`;}
function getLog(memberId,week){return state.logs[logKey(memberId,week)]||{};}
function pointsFor(log){return Object.entries(pointFields).reduce((sum,[k,p])=>sum+(log[k]?p:0),0);}
function totalPoints(memberId){return Array.from({length:16},(_,i)=>pointsFor(getLog(memberId,i+1))).reduce((a,b)=>a+b,0);}
function rankFor(points){return rankDefs.find(([n])=>points>=n)[1];}
function rankMinimum(name){return rankDefs.find(([,rank])=>rank===name)?.[0]||0;}
function rankLogo(name,size='medium'){
  const visual=rankVisuals[name]||rankVisuals.Recruit;
  const marks={
    chevron:'<path d="M18 20 32 34 46 20M18 30l14 14 14-14"/>',
    wings:'<path d="M30 26 10 18l8 15-9 5 21 9M34 26l20-8-8 15 9 5-21 9"/><path d="M32 20v30"/>',
    shield:'<path d="M32 8 51 15v15c0 13-8 22-19 27C21 52 13 43 13 30V15Z"/><path d="m24 31 6 6 12-14"/>',
    eye:'<path d="M7 32s9-15 25-15 25 15 25 15-9 15-25 15S7 32 7 32Z"/><circle cx="32" cy="32" r="7"/>',
    bolt:'<path d="m37 6-20 30h13l-3 22 21-32H35Z"/><path d="M9 18h12M43 46h12"/>',
    blackwing:'<path d="M31 19C19 10 8 12 5 13c8 5 10 12 12 21L7 31c5 10 13 17 24 21M33 19c12-9 23-7 26-6-8 5-10 12-12 21l10-3c-5 10-13 17-24 21"/><path d="M32 17v38"/>',
    champion:'<path d="m12 20 11 8 9-16 9 16 11-8-4 27H16Z"/><path d="M16 47h32M22 54h20"/><circle cx="32" cy="35" r="5"/>'
  };
  return `<span class="rank-logo rank-logo-${size}" style="--rank-tone:${visual.tone}" role="img" aria-label="${name} insignia"><svg viewBox="0 0 64 64" aria-hidden="true">${marks[visual.shape]}</svg><b>${visual.code}</b></span>`;
}
function showRankUp(member,newRank){
  const dialog=document.querySelector('#rankUpDialog');
  document.querySelector('#rankUpLogo').innerHTML=rankLogo(newRank,'hero');
  document.querySelector('#rankUpTitle').textContent=newRank;
  document.querySelector('#rankUpMessage').textContent=`${member.name} has earned a promotion. The new insignia is now displayed across the club.`;
  dialog.showModal();
}
function e1rm(weight,reps){return weight&&reps?Math.round(weight*(1+reps/30)):0;}
function initials(name){return name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();}
function fmt(n){return Number.isInteger(n)?n:n.toFixed(1);}
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800);}

function setup(){
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
  document.querySelector('#saveAccessories').addEventListener('click',saveAccessories);
  document.querySelectorAll('[data-close-accessories]').forEach(button=>button.addEventListener('click',closeAccessoryDialog));
  document.querySelectorAll('[data-close-challenge]').forEach(button=>button.addEventListener('click',closeChallengeDialog));
  document.querySelector('#closeRankUp').addEventListener('click',()=>document.querySelector('#rankUpDialog').close());
  renderAll();
}
function switchView(id){
  document.querySelectorAll('.view,.nav-item').forEach(el=>el.classList.remove('active'));
  document.querySelector(`#${id}`).classList.add('active');const nav=document.querySelector(`[data-view="${id}"]`);if(nav)nav.classList.add('active');
  const titles={dashboard:'Clubhouse',cycle:'Workout Cycle',log:'Log session',workouts:'Workouts',challenges:'Challenges',members:'Members',ranking:'Ranking Details'};document.querySelector('#pageTitle').textContent=titles[id];
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderAll(){renderDashboard();renderLogs();renderWorkoutPicker();renderWorkouts();renderChallenges();renderMembers();renderCycleDetails();renderRankingDetails();}
function renderCycleDetails(){
  document.querySelector('#cycleDetails').innerHTML=`<div class="cycle-summary"><article><span>01</span><small>Duration</small><strong>16 weeks</strong><p>Four progressive phases with recovery weeks built into the cycle.</p></article><article><span>02</span><small>Primary goal</small><strong>Bench strength</strong><p>Build repeatable technique, productive volume, and confidence under heavier loads.</p></article><article><span>03</span><small>Auto-regulation</small><strong>Earn the increase</strong><p>Complete every prescribed rep to advance. Missed targets repeat the full Competition Bench prescription.</p></article></div><div class="phase-grid">${phases.map((phase,index)=>`<article class="phase-card"><div class="phase-number">0${index+1}</div><p class="eyebrow">Weeks ${phase.weeks[0]}–${phase.weeks.at(-1)}</p><h3>${phase.name}</h3><strong>${phase.goal}</strong><p>${phase.detail}</p><dl><div><dt>Primary work</dt><dd>${phase.top}</dd></div><div><dt>Back-off work</dt><dd>${phase.back}</dd></div><div><dt>Accessories</dt><dd>${phase.accessory}</dd></div></dl></article>`).join('')}</div><div class="cycle-rules"><div><p class="eyebrow light">How progression works</p><h3>Every lifter advances individually</h3></div><ol><li><strong>Log the session.</strong><span>Attendance confirms the workout was attempted. Top weight and reps update e1RM as a separate performance indicator.</span></li><li><strong>Complete every rep.</strong><span>The lifter advances to the selected calendar week's primary and back-off prescription.</span></li><li><strong>Miss a target.</strong><span>The full prior prescription repeats—including percentage, primary load, back-off load, sets, and reps—until completed.</span></li><li><strong>Peak in Week 16.</strong><span>Use the accumulated work to build through safe attempts toward a new one-rep maximum.</span></li></ol></div>`;
}
function renderRankingDetails(){
  const scoring=[['Attendance',5],['Beat last week',5],['Hit every rep',5],['Win AMRAP challenge',10],['New PR',20]];
  document.querySelector('#rankingDetails').innerHTML=`<div class="rank-layout"><div class="rank-ladder">${rankDefs.map(([minimum,name],index)=>{const next=rankDefs[index-1]?.[0],range=next?`${minimum}–${next-1}`:`${minimum}+`;return `<article class="rank-detail ${minimum===650?'top-rank':''}">${rankLogo(name,'large')}<div><small>${range} points</small><h3>${name}</h3></div><p>${minimum===0?'The starting rank for every new club member.':`Earn at least ${minimum} cumulative season points to unlock this rank.`}</p></article>`}).join('')}</div><aside class="points-panel"><p class="eyebrow light">Weekly scoring</p><h3>45 points available</h3>${scoring.map(([label,points])=>`<div><span>${label}</span><strong>+${points}</strong></div>`).join('')}<p class="points-note">Ranks update instantly whenever a scorecard changes. With 16 weeks, the maximum possible season score is 720.</p></aside></div>`;
}
function renderDashboard(){
  const week=state.activeWeek,phase=phaseFor(week);document.querySelector('#phaseLabel').textContent=`Phase ${phases.indexOf(phase)+1} · ${phase.name} · Week ${week}`;
  document.querySelector('#missionTitle').textContent=phase.goal;document.querySelector('#missionCopy').textContent=phase.detail;
  const challenge=challengeForWeek(week);document.querySelector('#challengeName').textContent=challenge.name;document.querySelector('#challengeDetail').textContent=challenge.detail;
  const totals=state.members.map(m=>totalPoints(m.id));const attended=state.members.filter(m=>getLog(m.id,week).attendance).length;
  const prs=Object.values(state.logs).filter(x=>x.pr).length;const completed=Object.values(state.logs).filter(x=>x.allReps).length;
  document.querySelector('#clubStats').innerHTML=[['Week',`${week} / 16`],['Attendance',`${attended} / ${state.members.length}`],['Season PRs',prs],['Sessions cleared',completed]].map(([l,v])=>`<div class="stat-card"><small>${l}</small><strong>${v}</strong></div>`).join('');
  const sorted=[...state.members].sort((a,b)=>totalPoints(b.id)-totalPoints(a.id));
  document.querySelector('#leaderboard').innerHTML=sorted.map((m,i)=>{const pts=totalPoints(m.id),rank=rankFor(pts);return `<div class="leader-row"><span class="place">${i+1}</span><div class="leader-name"><strong>${esc(m.name)}</strong><small>${m.max} lb bench max</small></div><span class="rank-pill">${rankLogo(rank,'small')}<span>${rank}</span></span><span class="points">${pts}<small> pts</small></span></div>`}).join('');
  document.querySelector('#squadStatus').innerHTML=state.members.map(m=>{const done=getLog(m.id,week).attendance;return `<div class="status-row"><div class="status-person"><span class="avatar">${esc(initials(m.name))}</span><strong>${esc(m.name)}</strong></div><span class="status-chip ${done?'done':''}">${done?'Checked in':'Not logged'}</span></div>`}).join('');
}
function renderLogs(){
  const week=state.activeWeek;
  document.querySelector('#logCards').innerHTML=state.members.map(m=>{const log=getLog(m.id,week),p=pointsFor(log);return `<article class="log-card" data-member="${esc(m.id)}"><div class="log-card-head"><h3>${esc(m.name)}</h3><span class="week-score">${p}<small> / 45</small></span></div><div class="log-body"><div class="check-grid">${Object.entries({attendance:'Attendance',beatLast:'Beat last week',allReps:'Hit every rep',challenge:'Won challenge',pr:'New PR'}).map(([k,l])=>`<label class="point-check"><input type="checkbox" data-field="${k}" ${log[k]?'checked':''}>${l} <small>+${pointFields[k]}</small></label>`).join('')}</div><div class="result-fields"><label>Top weight<input type="number" data-field="weight" min="0" value="${log.weight||''}" placeholder="lb"></label><label>Top reps<input type="number" data-field="reps" min="0" value="${log.reps||''}" placeholder="reps"></label></div>${log.estimated1RM?`<p class="estimate-readout"><span>Session estimated 1RM</span><strong>${log.estimated1RM} lb</strong></p>`:''}</div></article>`}).join('');
  document.querySelectorAll('.log-card input').forEach(input=>input.addEventListener('change',handleLogChange));
}
function handleLogChange(e){
  const memberId=e.target.closest('.log-card').dataset.member,key=logKey(memberId,state.activeWeek),member=state.members.find(item=>item.id===memberId),previousRank=rankFor(totalPoints(memberId));state.logs[key]=state.logs[key]||{};
  const field=e.target.dataset.field,log=state.logs[key];
  if(!log.programWeek)log.programWeek=prescription(state.members.find(member=>member.id===memberId),state.activeWeek).programWeek;
  log[field]=e.target.type==='checkbox'?e.target.checked:(+e.target.value||0);
  if(e.target.type==='checkbox'&&field!=='attendance'&&e.target.checked)log.attendance=true;
  if(field==='attendance'&&!e.target.checked){['beatLast','allReps','challenge','pr'].forEach(pointField=>log[pointField]=false);}
  log.estimated1RM=log.weight&&log.reps?e1rm(+log.weight,+log.reps):0;
  saveState();renderAll();const newRank=rankFor(totalPoints(memberId));
  if(rankMinimum(newRank)>rankMinimum(previousRank))showRankUp(member,newRank);else toast(log.estimated1RM?`e1RM updated to ${log.estimated1RM} lb`:'Scorecard updated');
}
function renderWorkoutPicker(){
  const select=document.querySelector('#workoutMember'),current=select.value||state.members[0]?.id;
  select.innerHTML=`<option value="club">Entire club — bench table</option>`+state.members.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
  select.value=current==='club'||state.members.some(m=>m.id===current)?current:'club';
}
function renderWorkouts(){
  const selected=document.querySelector('#workoutMember').value;
  if(selected==='club'){renderClubBenchTable();return;}
  const member=state.members.find(m=>m.id===selected)||state.members[0];if(!member)return;
  const week=state.activeWeek,rx=prescription(member,week),challenge=challengeForWeek(week);
  const progressionCopy=rx.progression.direction==='up'?`Advanced after completing Week ${rx.progression.sourceWeek}.`:rx.progression.missed?`Repeating the complete Week ${rx.progression.sourceWeek} Competition Bench prescription because all reps were not completed.`:'Using the selected week prescription until a session is logged.';
  const heroLoad=rx.test?'Test':rx.backLoad?`${fmt(rx.main)} / ${fmt(rx.backLoad)} lb`:`${fmt(rx.main)} lb`;
  document.querySelector('#workoutSummary').innerHTML=`<div class="prescription-hero"><div><p class="eyebrow light">${rx.phase.name} / Program Week ${rx.programWeek}</p><h3>${esc(member.name)}'s flight plan</h3><p>Established training max: ${fmt(rx.max)} lb. ${progressionCopy}</p></div><div class="big-load"><small>Primary / back-off</small><strong>${heroLoad}</strong><span>${rx.scheme}</span></div></div>`;
  const volume=rx.deload?2:null;
  const calculatedLoads=[`${fmt(rx.incline)} lb`,`${fmt(rx.db)}s`];
  const accessories=state.accessories.map((exercise,index)=>({exercise,index})).filter(({exercise})=>{
    if(/incline barbell bench/i.test(exercise.name))return rx.programWeek%2===1;
    if(/incline dumbbell bench/i.test(exercise.name))return rx.programWeek%2===0;
    return true;
  }).map(({exercise,index})=>{const rotatingPushdown=/tricep.*(rope|pushdown)|pushdown/i.test(exercise.name),name=rotatingPushdown&&rx.programWeek%2===0?'Skull-crushers':exercise.name;return [name,rx.deload?`2 × ${exercise.scheme.split('×')[1]?.trim()||'8'}`:exercise.scheme,exercise.load==='Calculated load'?(calculatedLoads[index]||'RPE 8'):exercise.load,exercise.note];});
  const scheduledPct=Math.round(competitionPlan[week-1].topPct*1000)/10,currentPct=Math.round(rx.pct*1000)/10;
  const pctLabel=rx.progression.missed?`<span class="progression-pct" tabindex="0" data-tooltip="Calendar target for Week ${week}: ${scheduledPct}% primary work" aria-label="Current progression ${currentPct} percent. Calendar target for Week ${week}: ${scheduledPct} percent.">${currentPct}% primary</span>`:`<span class="progression-pct on-track" tabindex="0" data-tooltip="On track for Week ${week}">${currentPct}% primary</span>`;
  const competitionNote=`<span class="competition-meta">${pctLabel}<span class="competition-challenge"><strong>Challenge: ${esc(challenge.name)}</strong>${esc(challenge.detail)}</span></span>`;
  const competitionSchemes=rx.backScheme?`<span class="work-stack"><span><small>Primary</small>${rx.topScheme}</span><span><small>Back-off</small>${rx.backScheme}</span></span>`:rx.topScheme;
  const competitionLoads=rx.test?'Build through safe attempts':rx.backLoad?`<span class="work-stack"><span><small>Primary</small>${fmt(rx.main)} lb</span><span><small>Back-off</small>${fmt(rx.backLoad)} lb</span></span>`:`${fmt(rx.main)} lb`;
  const exercises=[['Competition Bench',competitionSchemes,competitionLoads,competitionNote],...accessories.map(exercise=>[esc(exercise[0]),esc(exercise[1]),esc(exercise[2]),esc(exercise[3])])];
  document.querySelector('#workoutList').innerHTML=exercises.map((x,i)=>`<div class="exercise-row"><span class="exercise-num">${String(i+1).padStart(2,'0')}</span><div><strong>${x[0]}</strong><div class="exercise-scheme">${x[1]}</div></div><span class="rx">${x[2]}</span><span class="exercise-note">${x[3]}</span></div>`).join('');
}
function renderClubBenchTable(){
  const week=state.activeWeek,phase=phaseFor(week);
  const rows=state.members.map(member=>({member,rx:prescription(member,week)})).sort((a,b)=>a.rx.main-b.rx.main);
  document.querySelector('#workoutSummary').innerHTML=`<div class="prescription-hero club-hero"><div><p class="eyebrow light">${phase.name} / Week ${week}</p><h3>Competition bench loading order</h3><p>Primary and back-off loads are calculated separately for every lifter.</p></div><div class="big-load"><small>Group session</small><strong>${competitionPlan[week-1].test?'Max day':rows[0]?.rx.scheme||'—'}</strong><span>${rows.length} lifters</span></div></div>`;
  document.querySelector('#workoutList').innerHTML=`<div class="bench-table-wrap"><table class="bench-table"><thead><tr><th>Order</th><th>Lifter</th><th>Primary</th><th>Back-off</th><th>Program week</th><th>Change bar by</th></tr></thead><tbody>${rows.map((row,i)=>{const prior=i?rows[i-1].rx.main:0;const jump=i?row.rx.main-prior:row.rx.main;return `<tr><td><span class="load-order">${String(i+1).padStart(2,'0')}</span></td><td><span class="table-lifter"><span class="avatar">${initials(row.member.name)}</span><strong>${row.member.name}</strong></span></td><td><strong class="table-weight">${row.rx.test?'Test':fmt(row.rx.main)+' lb'}</strong><small>${row.rx.topScheme}</small></td><td>${row.rx.backLoad?`<strong>${fmt(row.rx.backLoad)} lb</strong><small>${row.rx.backScheme}</small>`:'—'}</td><td>Week ${row.rx.programWeek}</td><td>${i?`+${fmt(jump)} lb`:'Load bar'}</td></tr>`}).join('')}</tbody></table><p class="table-note">Loading order uses each member's established bench max and individual progression status. Back-off work is intentionally lighter than primary work.</p></div>`;
}
function renderChallenges(){
  const week=state.activeWeek,current=challengeForWeek(week),active=state.challengeLibrary.filter(challenge=>challenge.active);
  document.querySelector('#challengeAssignment').innerHTML=`<div class="assignment-card"><div><p class="eyebrow light">Week ${week} assignment</p><h3>${esc(current.name)}</h3><p>${esc(current.detail)}</p></div><label>Challenge for this week<select id="weekChallengeSelect">${active.map(challenge=>`<option value="${esc(challenge.id)}" ${challenge.id===current.id?'selected':''}>${esc(challenge.name)}</option>`).join('')}</select></label></div>`;
  const selector=document.querySelector('#weekChallengeSelect');
  if(selector)selector.addEventListener('change',e=>{state.weekChallenges[week-1]=e.target.value;saveState();renderAll();toast(`Week ${week} challenge updated`);});
  document.querySelector('#challengeCounts').innerHTML=`<span>${active.length} active</span><span>${state.challengeLibrary.length-active.length} cycled out</span>`;
  document.querySelector('#challengeCards').innerHTML=state.challengeLibrary.map(challenge=>{const weeks=state.weekChallenges.map((id,index)=>id===challenge.id?index+1:null).filter(Boolean);return `<article class="challenge-card ${challenge.active?'':'inactive'}"><div class="challenge-card-top"><span class="status-chip ${challenge.active?'done':''}">${challenge.active?'In rotation':'Cycled out'}</span><span class="challenge-source">${challenge.builtIn?'Season':'Custom'}</span></div><h3>${esc(challenge.name)}</h3><p>${esc(challenge.detail)}</p><small>${weeks.length?`Assigned to week${weeks.length>1?'s':''} ${weeks.join(', ')}`:'Not currently assigned'}</small><div class="challenge-actions"><button class="edit-btn" data-edit-challenge="${esc(challenge.id)}">Edit</button><button class="edit-btn" data-cycle-challenge="${esc(challenge.id)}">${challenge.active?'Cycle out':'Return to rotation'}</button><button class="danger-btn" data-remove-challenge="${esc(challenge.id)}">Remove</button></div></article>`}).join('');
  document.querySelectorAll('[data-edit-challenge]').forEach(button=>button.addEventListener('click',()=>openChallengeDialog(button.dataset.editChallenge)));
  document.querySelectorAll('[data-cycle-challenge]').forEach(button=>button.addEventListener('click',()=>cycleChallenge(button.dataset.cycleChallenge)));
  document.querySelectorAll('[data-remove-challenge]').forEach(button=>button.addEventListener('click',()=>removeChallenge(button.dataset.removeChallenge)));
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
  if(!challenge.active){const fallback=state.challengeLibrary.find(item=>item.active);state.weekChallenges=state.weekChallenges.map(challengeId=>challengeId===id?fallback.id:challengeId);}
  saveState();renderAll();toast(challenge.active?'Challenge returned to rotation':'Challenge cycled out');
}
function removeChallenge(id){
  const fallback=state.challengeLibrary.find(challenge=>challenge.active&&challenge.id!==id);if(!fallback){toast('Keep at least one challenge in rotation');return;}
  state.challengeLibrary=state.challengeLibrary.filter(challenge=>challenge.id!==id);state.weekChallenges=state.weekChallenges.map(challengeId=>challengeId===id?fallback.id:challengeId);saveState();renderAll();toast('Challenge removed');
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
  document.querySelector('#memberCards').innerHTML=state.members.map(m=>{const pts=totalPoints(m.id),rank=rankFor(pts),current=latestEstimate(m.id),best=Array.from({length:16},(_,i)=>getLog(m.id,i+1)).reduce((a,l)=>Math.max(a,l.estimated1RM||0),m.max);return `<article class="member-card"><div class="member-identity">${rankLogo(rank,'medium')}<div><h3>${esc(m.name)}</h3><span class="member-rank">${rank} · ${pts} points</span></div></div><div class="member-numbers"><div class="member-number"><small>Current e1RM</small><strong>${current} lb</strong></div><div class="member-number"><small>Best e1RM</small><strong>${best} lb</strong></div><div class="member-number"><small>Attendance</small><strong>${Array.from({length:16},(_,i)=>getLog(m.id,i+1).attendance?1:0).reduce((a,b)=>a+b,0)}</strong></div><div class="member-number"><small>Body weight</small><strong>${m.body?m.body+' lb':'—'}</strong></div></div><button class="edit-btn" data-edit="${esc(m.id)}">Edit profile</button></article>`}).join('');
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openMemberDialog(b.dataset.edit)));
}
function openMemberDialog(id){
  const m=state.members.find(x=>x.id===id);document.querySelector('#dialogTitle').textContent=m?'Edit member':'Add member';document.querySelector('#memberId').value=m?.id||'';document.querySelector('#memberName').value=m?.name||'';document.querySelector('#memberMax').value=m?.max||'';document.querySelector('#memberBody').value=m?.body||'';document.querySelector('#memberDialog').showModal();
}
function saveMember(e){
  e.preventDefault();const name=document.querySelector('#memberName').value.trim(),max=+document.querySelector('#memberMax').value,body=+document.querySelector('#memberBody').value||0,id=document.querySelector('#memberId').value;
  if(!name||!Number.isFinite(max)||max<=0||body<0){toast('Enter a valid name, bench max, and body weight');return;}
  if(id){Object.assign(state.members.find(m=>m.id===id),{name,max,body});}else{state.members.push({id:`m${Date.now()}`,name,max,body});}
  saveState();document.querySelector('#memberDialog').close();renderAll();toast(id?'Member updated':'Member added');
}

setup();
