import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('./app.js',import.meta.url),'utf8').replace(/setup\(\);\s*$/,'')+`\n;globalThis.__qa={competitionPlan,defaultMembers,prescription,pointsFor,rankFor,rankLogo,rankMinimum,setState:value=>state=value};`;
const storage=new Map();
const context={
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
  setTimeout,clearTimeout,console
};
vm.createContext(context);
vm.runInContext(source,context);

const qa=context.__qa;
const members=JSON.parse(JSON.stringify(qa.defaultMembers));
const baseState={activeWeek:1,members,logs:{},challengeLibrary:[{id:'standard-1',name:'AMRAP Last Set',detail:'test',active:true}],weekChallenges:Array(16).fill('standard-1'),accessories:[]};
qa.setState(baseState);

const pardo=members.find(member=>member.id==='pardo');
for(const week of [5,6,7,9,10,11,13,14,15]){
  const rx=qa.prescription(pardo,week);
  assert.ok(rx.backLoad>0,`Week ${week} should include back-off work`);
  assert.ok(rx.backLoad<rx.main,`Week ${week} back-off load should be lighter than primary load`);
}
for(const week of [1,2,3,4,8,12,16])assert.equal(qa.prescription(pardo,week).backLoad,0,`Week ${week} should not include back-off work`);

baseState.logs['pardo-1']={attendance:true,allReps:false,programWeek:1};
assert.equal(qa.prescription(pardo,2).programWeek,1,'A missed Week 1 should repeat Program Week 1');
baseState.logs['pardo-2']={attendance:true,allReps:true,programWeek:1};
assert.equal(qa.prescription(pardo,3).programWeek,2,'Completing the repeated workout should advance to Program Week 2');
baseState.logs['pardo-3']={attendance:true,allReps:true,programWeek:2};
assert.equal(qa.prescription(pardo,4).programWeek,3,'Individual progression should advance one program week at a time');

assert.equal(qa.pointsFor({attendance:true,beatLast:true,allReps:true,challenge:true,pr:true}),45,'Weekly maximum should be 45 points');
assert.equal(qa.rankFor(650),'Falcon Champion','Top attainable rank threshold should be valid');
assert.equal(qa.competitionPlan.length,16,'Competition plan should contain all 16 weeks');
const rankNames=['Recruit','Airman','Falcon','OverWatch','Strike Leader','Black Wing','Falcon Champion'];
const rankLogos=rankNames.map(rank=>qa.rankLogo(rank,'large'));
assert.equal(new Set(rankLogos).size,7,'Every rank should have a distinct insignia');
assert.ok(rankLogos.every(logo=>logo.includes('<svg')),'Every rank insignia should be vector based');
assert.ok(qa.rankMinimum('Airman')>qa.rankMinimum('Recruit'),'Rank thresholds should increase with promotions');

console.log('QA logic checks passed');
