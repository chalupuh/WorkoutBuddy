import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('./app.js',import.meta.url),'utf8').replace(/setup\(\);\s*$/,'')+`\n;globalThis.__qa={competitionPlan,defaultMembers,prescription,pointsFor,pointRulesForWeek,rankFor,rankLogo,rankMinimum,wilksScore,attemptPlan,sessionTiming,buildNextSeason,setState:value=>state=value};`;
const storage=new Map();
const context={
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
  setTimeout,clearTimeout,console
};
vm.createContext(context);
vm.runInContext(source,context);

const qa=context.__qa;
const members=JSON.parse(JSON.stringify(qa.defaultMembers));
const baseState={season:1,seasonHistory:[],activeWeek:1,members,logs:{},challengeLibrary:[{id:'week-1',name:'Step Champion',detail:'test',active:true}],weekChallenges:Array(16).fill('week-1'),accessories:[]};
qa.setState(baseState);

const pardo=members.find(member=>member.id==='pardo');
for(const week of [5,6,7,9,10,11,13,14]){
  const rx=qa.prescription(pardo,week);
  assert.ok(rx.backLoad>0,`Week ${week} should include back-off work`);
  assert.ok(rx.backLoad<rx.main,`Week ${week} back-off load should be lighter than primary load`);
}
for(const week of [1,2,3,4,8,12,15,16])assert.equal(qa.prescription(pardo,week).backLoad,0,`Week ${week} should not include back-off work`);

baseState.logs['pardo-1']={attendance:true,allReps:false,programWeek:1};
assert.equal(qa.prescription(pardo,2).programWeek,1,'A missed Week 1 should repeat Program Week 1');
baseState.logs['pardo-2']={attendance:true,allReps:true,programWeek:1};
assert.equal(qa.prescription(pardo,3).programWeek,2,'Completing the repeated workout should advance to Program Week 2');
baseState.logs['pardo-3']={attendance:true,allReps:true,programWeek:2};
assert.equal(qa.prescription(pardo,4).programWeek,4,'Calendar Week 4 should use the protected deload');
assert.equal(qa.prescription(pardo,4).progression.recovery,true,'Calendar Week 4 should be marked as recovery');
baseState.logs['pardo-4']={attendance:true,allReps:true,programWeek:4,recoveryWeek:true};
assert.equal(qa.prescription(pardo,5).programWeek,3,'Protected deload should not advance or erase individual progression');

baseState.logs['pardo-5']={attendance:true,allReps:false,programWeek:3};
baseState.logs['pardo-6']={attendance:true,allReps:false,programWeek:3};
const resetRx=qa.prescription(pardo,7);
assert.equal(resetRx.programWeek,3,'Two misses should retain the unfinished prescription');
assert.equal(resetRx.progression.loadScale,.925,'Two misses should trigger a 7.5% load reset');

assert.equal(qa.pointsFor({attendance:true,additionalWorkout:true,beatLast:true,allReps:true,challenge:true,pr:true,mvp:true}),45,'Weekly maximum should be 45 points');
assert.equal(qa.rankFor(650),'Falcon Champion','Top attainable rank threshold should be valid');
assert.equal(qa.competitionPlan.length,16,'Competition plan should contain all 16 weeks');
assert.equal(qa.competitionPlan[12].top,'1 × 3','Week 13 should use a controlled triple');
assert.equal(qa.competitionPlan[13].top,'2 × 1','Week 14 should introduce opener-style singles');
assert.equal(qa.competitionPlan[14].topPct,.90,'Week 15 singles should cap at 90%');
assert.equal(qa.competitionPlan[15].test,true,'Week 16 should be a planned test day');
assert.equal(qa.prescription(pardo,15).programWeek,15,'The shared peak should stay synchronized to calendar Week 15');
const rankNames=['Recruit','Airman','Falcon','OverWatch','Strike Leader','Black Wing','Falcon Champion'];
const rankLogos=rankNames.map(rank=>qa.rankLogo(rank,'large'));
assert.equal(new Set(rankLogos).size,7,'Every rank should have a distinct insignia');
assert.ok(rankLogos.every(logo=>logo.includes('<svg')),'Every rank insignia should be vector based');
assert.ok(qa.rankMinimum('Airman')>qa.rankMinimum('Recruit'),'Rank thresholds should increase with promotions');
const mensWilks=qa.wilksScore(200,300,'men');
const womensWilks=qa.wilksScore(200,300,'women');
assert.ok(Number.isFinite(mensWilks)&&mensWilks>0,'Men\'s Wilks score should calculate from pounds');
assert.ok(Number.isFinite(womensWilks)&&womensWilks>0,'Women\'s Wilks score should calculate from pounds');
assert.equal(qa.wilksScore(0,300,'men'),null,'Wilks requires body weight');
assert.equal(qa.wilksScore(200,300,''),null,'Wilks requires a coefficient division');
assert.ok(qa.wilksScore(200,350,'men')>mensWilks,'Wilks should increase when the lift increases at the same body weight');
assert.equal(qa.pointRulesForWeek(1)[0].label,'Attended Club Session','Standard weeks should use the explicit attendance label');
assert.equal(qa.pointRulesForWeek(1)[4].label,'Step Champion winner','Winner label should use the assigned challenge');
baseState.challengeLibrary.push({id:'push-up',name:'Push-Up Challenge',detail:'test',active:true});
baseState.weekChallenges[0]='push-up';
assert.equal(qa.pointRulesForWeek(1)[4].label,'Push-Up Challenge winner','Winner label should update when the assigned challenge changes');
assert.equal(qa.pointRulesForWeek(1)[5].label,'Push-Up Challenge runner-up','Runner-up label should update when the assigned challenge changes');
baseState.weekChallenges[0]='week-1';
assert.equal(qa.pointRulesForWeek(4)[0].label,'Attended Deload Session','Recovery weeks should use recovery-specific attendance');
assert.equal(qa.pointRulesForWeek(1)[1].label,'1 other workout in last 7 days','Weeks 1–4 should require one other workout');
assert.equal(qa.pointRulesForWeek(5)[1].label,'2 other workouts in last 7 days','Weeks 5–8 should require two other workouts');
assert.equal(qa.pointRulesForWeek(9)[1].label,'3 other workouts in last 7 days','Weeks 9–16 should require three other workouts');
assert.equal(qa.pointRulesForWeek(16)[1].label,'3 other workouts in last 7 days','The workout target should cap at three');
assert.equal(qa.pointRulesForWeek(16).at(-2).label,'Step Champion runner-up','Week 16 should use its assigned challenge for the runner-up label');
assert.equal(qa.pointRulesForWeek(16).at(-1).label,'AMRAP Champ','Every week should include the Competition Bench AMRAP award');
assert.equal(qa.attemptPlan(pardo).length,3,'Week 16 should generate three planned attempts');
assert.ok(qa.attemptPlan(pardo)[0].load<qa.attemptPlan(pardo)[1].load,'Attempt loads should progress from opener to second');
assert.ok(qa.sessionTiming(5,members).totalMinutes>qa.sessionTiming(4,members).totalMinutes,'A volume week should take longer than a protected deload');

baseState.logs['pardo-16']={bestSuccessful:200,attendance:true};
pardo.nextSeasonMax=200;
const nextSeason=qa.buildNextSeason(baseState);
assert.equal(nextSeason.season,2,'Starting the next season should increment the season number');
assert.equal(nextSeason.members.find(member=>member.id==='pardo').max,200,'Confirmed Week 16 max should carry into the next season');
assert.equal(Object.keys(nextSeason.logs).length,0,'Starting the next season should reset weekly logs');
assert.equal(nextSeason.seasonHistory.length,1,'Completed season results should be archived');

console.log('QA logic checks passed');
