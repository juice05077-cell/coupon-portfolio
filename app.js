// Add actual content first, then give its chapter an anchor and capability group.
// Entries without an existing anchor stay non-clickable.
const reportChapters=[
 {title:'一、项目背景与分析目标',children:[{id:'background',title:'1.1 项目背景'},{id:'objectives',title:'1.2 分析目标'}]},
 {title:'二、数据来源与处理',children:[{id:'source',title:'2.1 数据来源'},{id:'cleaning',title:'2.2 数据清洗'},{id:'metrics',title:'2.3 核心指标'}]},
 {id:'overview',title:'三、整体核销情况'},
 {title:'四、优惠券核销行为分析',children:[
  {id:'distance',title:'4.1 商户距离与核销率',anchor:'distance',group:'methods',parts:[{anchor:'findings',title:'观察结果'},{anchor:'interpretation',title:'可能解释'},{anchor:'implications',title:'业务参考'}]},
  {id:'threshold',title:'4.2 满减门槛与核销率'},
  {id:'discount',title:'4.3 优惠力度与核销率'},
  {id:'scale',title:'4.4 领取规模与核销率'},
  {id:'stratification',title:'4.5 领取规模分层下的优惠力度分析'},
  {id:'case',title:'4.6 高优惠力度低核销率案例分析'}]},
 {id:'timing',title:'五、核销时间特征'},
 {title:'六、主要结论与业务启示',children:[{id:'conclusions',title:'6.1 主要发现'},{id:'business',title:'6.2 业务启示'}]},
 {id:'limitations',title:'七、分析局限与后续方向'},
 {id:'summary',title:'八、项目总结'}
];
const chapterParts={"threshold":[{"anchor":"threshold-findings","title":"观察结果"},{"anchor":"threshold-interpretation","title":"可能解释"},{"anchor":"threshold-implications","title":"业务参考"}],"discount":[{"anchor":"discount-performance","title":"优惠表现"},{"anchor":"discount-trend","title":"趋势判断"},{"anchor":"discount-analysis","title":"深入分析"}],"scale":[{"anchor":"scale-distribution","title":"规模分布"},{"anchor":"scale-extremes","title":"极端值解释"},{"anchor":"scale-plan","title":"分层分析思路"}],"stratification":[{"anchor":"stratification-method","title":"分层方法"},{"anchor":"stratification-results","title":"分层结果"},{"anchor":"stratification-conclusion","title":"分析结论"}],"case":[{"anchor":"case-anomaly","title":"异常案例"},{"anchor":"case-behavior","title":"用户行为排查"},{"anchor":"case-limits","title":"分析局限"}]};
for(const item of reportChapters.flatMap(chapter=>chapter.children||[chapter])){
 if(chapterParts[item.id])item.parts=chapterParts[item.id];
 if(document.getElementById(item.id)){item.anchor=item.id;if(!item.group)item.group=['source','cleaning','metrics'].includes(item.id)?'processing':['threshold','discount','scale','stratification','case','timing'].includes(item.id)?'methods':['conclusions','business','limitations','summary'].includes(item.id)?'results':undefined;}
}
const capabilities=[
 {id:'processing',title:'数据处理',text:'使用 SQL 清洗与分类百万级 O2O 用户行为数据，识别异常状态，统一核销指标口径。',entries:['source','cleaning','metrics']},
 {id:'methods',title:'分析方法',text:'分析距离、券类型、门槛及优惠力度与核销率的关系，针对小样本极端值进行领取规模分层比较。',entries:['distance','threshold','discount','scale','stratification','case']},
 {id:'results',title:'项目成果',text:'使用 Tableau 制作交互式仪表板及分析报告，归纳核销特征并提出优化建议。',entries:['tableau','full-report','conclusions','business','limitations']}
];
const entries=new Map(reportChapters.flatMap(c=>c.children||[c]).map(c=>[c.id,c]));
entries.set('tableau',{id:'tableau',title:'Tableau 交互式仪表板',anchor:'tableau-dashboard',group:'results'});
entries.set('full-report',{id:'full-report',title:'完整分析报告（PDF）',anchor:'report-download',group:'results'});
const available=c=>c.anchor&&document.getElementById(c.anchor);
function entryHTML(c,showParts=false){
 if(!available(c))return `<span class="pending-entry">${c.title}<small>${c.pending||'待上线'}</small></span>`;
 const link=`<a href="#${c.anchor}" data-chapter="${c.id}">${c.title}</a>`;
 const children=(c.parts||[]).filter(p=>document.getElementById(p.anchor));
 if(!showParts||!children.length)return link;
 return `<div class="chapter-entry"><div class="chapter-entry-row">${link}<button class="chapter-toggle" type="button" aria-expanded="false" aria-controls="parts-${c.id}" data-toggle-chapter="${c.id}" aria-label="展开或收起${c.title}子目录"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button></div><div id="parts-${c.id}" class="part-links" hidden>${children.map(p=>`<a href="#${p.anchor}">${p.title}</a>`).join('')}</div></div>`;

}
document.querySelector('#report-directory').innerHTML=reportChapters.map(c=>c.children?`<div class="directory-section"><div class="directory-heading">${c.title}</div>${c.children.map(x=>entryHTML(x)).join('')}</div>`:entryHTML(c)).join('');
document.querySelector('#capability-groups').innerHTML=capabilities.map((c,i)=>`<section class="capability" data-group="${c.id}"><h3><button type="button" class="group-toggle" aria-expanded="${c.id==='methods'}" aria-controls="links-${c.id}"><span>${i+1}. ${c.title}</span><svg class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button></h3><p class="resume-text">${c.text}</p><nav id="links-${c.id}" aria-label="${c.title}对应章节" ${c.id==='methods'?'':'hidden'}>${c.entries.map(id=>entryHTML(entries.get(id),true)).join('')}</nav></section>`).join('');
const targets=new Map();for(const chapter of entries.values())if(available(chapter)){targets.set(chapter.anchor,{chapter,label:chapter.title});for(const p of chapter.parts||[])if(document.getElementById(p.anchor))targets.set(p.anchor,{chapter,label:`${chapter.title} · ${p.title}`})}
targets.set('full-report',{chapter:entries.get('full-report'),label:'完整分析报告正文'});
const parts=[...targets.keys()].map(id=>document.getElementById(id)).sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1),context=document.querySelector('.context'),toggle=document.querySelector('#nav-toggle');
const media=matchMedia('(max-width:900px)');
// Focusing controls inside the sticky navigation must not scroll the report.
context.addEventListener('mousedown',e=>{const control=e.target.closest('button,summary');if(control){e.preventDefault();control.focus({preventScroll:true})}});
let active='distance',marker=null,resizing=false,lastWidth=innerWidth,travel=false,settleTimer;
const offset=()=>document.querySelector('.masthead').getBoundingClientRect().height+(media.matches?document.querySelector('.mobile-bar').getBoundingClientRect().height+12:24);
function expandGroup(id,open){const group=document.querySelector(`[data-group="${id}"]`);if(!group)return;group.querySelector('button').setAttribute('aria-expanded',String(open));group.querySelector('nav').hidden=!open}
function expandChapter(id,open){const button=document.querySelector('[data-toggle-chapter="'+id+'"]');if(!button)return;button.setAttribute('aria-expanded',String(open));document.getElementById(button.getAttribute('aria-controls')).hidden=!open}
document.querySelectorAll('.chapter-toggle').forEach(button=>button.addEventListener('click',()=>expandChapter(button.dataset.toggleChapter,button.getAttribute('aria-expanded')!=='true')));
function select(id,force=false){const target=targets.get(id);if(!target)return;const previousChapter=targets.get(active)?.chapter.id;const changed=active!==id;active=id;
 document.querySelector('#location').textContent=target.label;document.querySelector('#mobile-location').textContent=target.label.replace('4.1 商户距离与核销率','4.1 商户距离');
 document.querySelectorAll('.capability').forEach(g=>g.classList.toggle('is-current',g.dataset.group===target.chapter.group));
 document.querySelectorAll('.context a[href^="#"]').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');a.classList.toggle('chapter-current',a.dataset.chapter===target.chapter.id)});
 if(changed||force)expandGroup(target.chapter.group,true);
 if(previousChapter!==target.chapter.id||force)expandChapter(target.chapter.id,true);
 document.documentElement.style.setProperty('--offset',offset()+'px');
}
document.querySelectorAll('.group-toggle').forEach(b=>b.addEventListener('click',()=>expandGroup(b.closest('[data-group]').dataset.group,b.getAttribute('aria-expanded')!=='true')));
function panel(open){context.classList.toggle('nav-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'＋'}
toggle.addEventListener('click',()=>panel(toggle.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&context.classList.contains('nav-open')){panel(false);toggle.focus({preventScroll:true})}});
document.addEventListener('click',e=>{if(media.matches&&!context.contains(e.target))panel(false)});
function remember(){const nodes=[...document.querySelectorAll('main h1,article h2,article p,figure,.reading-label')];const line=offset();const el=nodes.find(n=>n.getBoundingClientRect().bottom>line);if(el){const r=el.getBoundingClientRect();marker={el,fraction:Math.max(0,Math.min(1,(line-r.top)/r.height)),gap:r.top>line?r.top-line:0}}}
function sync(){if(resizing||travel)return;let id=parts[0].id;for(const el of parts)if(el.getBoundingClientRect().top<=offset()+45)id=el.id;select(id);remember()}
function finishTravel(){travel=false;remember()}
function go(id,smooth=false){if(!targets.has(id))return;clearTimeout(settleTimer);travel=true;select(id,true);if(media.matches){panel(false);if(context.contains(document.activeElement))toggle.focus({preventScroll:true})}document.getElementById(id).scrollIntoView({behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});settleTimer=setTimeout(finishTravel,1000);remember()}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||!targets.has(a.hash.slice(1)))return;e.preventDefault();if(location.hash!==a.hash)history.pushState(null,'',a.hash);go(a.hash.slice(1),true)});
history.scrollRestoration='manual';
let historyFrame;function restore(){cancelAnimationFrame(historyFrame);historyFrame=requestAnimationFrame(()=>{const id=location.hash.slice(1);if(targets.has(id))go(id);else if(!location.hash){travel=false;scrollTo(0,0);sync()}})}
addEventListener('popstate',restore);addEventListener('hashchange',restore);
addEventListener('scroll',()=>{if(travel){clearTimeout(settleTimer);settleTimer=setTimeout(finishTravel,120)}else if(innerWidth===lastWidth)sync()},{passive:true});
addEventListener('resize',()=>{if(innerWidth===lastWidth)return;resizing=true;lastWidth=innerWidth;const saved=marker;select(active);requestAnimationFrame(()=>{if(saved){const r=saved.el.getBoundingClientRect();scrollBy(0,r.top+r.height*saved.fraction-offset()-saved.gap)}resizing=false;remember()})});
// Restore once on entry/history, not after third-party iframe loading.
select('background',true);restore();addEventListener('pageshow',restore);

// Save the actual reading scrollers; the current layout uses window for the
// report and a separate sidebar. Also retain any scrollable report ancestors.
let readingReturn=null;
const dashboardJumps=[...document.querySelectorAll('[data-view-dashboard]')];
const readingBack=document.querySelector('#return-reading');
const dashboardRegion=document.querySelector('#tableau-dashboard');
function updateReadingBack(){
 const report=document.querySelector('main').getBoundingClientRect();
 readingBack.style.setProperty('--return-right',`${Math.max(16,innerWidth-report.right+12)}px`);
 const region=dashboardRegion.getBoundingClientRect();
 const readingLine=offset()+45;
 readingBack.hidden=!(readingReturn&&region.top<=readingLine&&region.bottom>readingLine);
}
let returnFrame;
function scheduleReadingBack(){cancelAnimationFrame(returnFrame);returnFrame=requestAnimationFrame(updateReadingBack)}
addEventListener('scroll',scheduleReadingBack,{passive:true,capture:true});
addEventListener('resize',scheduleReadingBack);
new ResizeObserver(scheduleReadingBack).observe(dashboardRegion);
[...dashboardJumps,readingBack].forEach(button=>button.addEventListener('mousedown',event=>{
 event.preventDefault();button.focus({preventScroll:true});
}));
dashboardJumps.forEach(dashboardJump=>dashboardJump.addEventListener('click',()=>{
 const containers=[];
 for(let el=dashboardJump.parentElement;el&&el!==document.body;el=el.parentElement){
  if(/auto|scroll/.test(getComputedStyle(el).overflowY))containers.push({el,x:el.scrollLeft,y:el.scrollTop});
 }
 readingReturn={x:scrollX,y:scrollY,containers,trigger:dashboardJump,active,url:location.href,state:history.state};
 readingBack.hidden=true;
 history.replaceState(history.state,'','#tableau-dashboard');
 go('tableau-dashboard',true);
 scheduleReadingBack();
}));
readingBack.addEventListener('click',()=>{
 if(!readingReturn)return;
 const saved=readingReturn;readingReturn=null;clearTimeout(settleTimer);travel=false;
 history.replaceState(saved.state,'',saved.url);
 for(const item of saved.containers)item.el.scrollTo({left:item.x,top:item.y,behavior:'instant'});
 window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
 readingBack.hidden=true;
 select(saved.active,true);remember();saved.trigger.focus({preventScroll:true});
});
