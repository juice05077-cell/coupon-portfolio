// Replace only these explicit placeholders when the actual resume is available.
const mappings={
 distance:{title:'可视化分析',text:'【占位】使用 Tableau 比较不同距离等级的优惠券核销表现，并结合图表展开分析。',label:'4.1 商户距离与核销率'},
 findings:{title:'趋势识别与比较',text:'【占位】识别距离分组的整体趋势与局部回升，区分行为记录量和核销率。',label:'4.1 · 观察结果'},
 interpretation:{title:'谨慎解释分析结果',text:'【占位】结合到店便利性与消费需求提出可能解释，保留推测性表达。',label:'4.1 · 可能解释'},
 implications:{title:'业务思考与分析边界',text:'【占位】从距离关联中提出差异化投放的研究方向，不将相关关系表述为因果关系。',label:'4.1 · 业务参考'}
};
const parts=[...document.querySelectorAll('[data-part]')],context=document.querySelector('.context');
let active='distance',marker=null,resizing=false,lastWidth=innerWidth;
const offset=()=>innerWidth<=900?context.getBoundingClientRect().height+12:24;
function select(id){active=id;const m=mappings[id];document.querySelector('#ability').textContent=m.title;document.querySelector('#resume').textContent=m.text;document.querySelector('#location').textContent=m.label;document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});document.documentElement.style.setProperty('--offset',offset()+'px')}
function remember(){const nodes=[...document.querySelectorAll('main h1,article h2,article p,figure,.reading-label')];const line=offset();const el=nodes.find(n=>n.getBoundingClientRect().bottom>line);if(el){const r=el.getBoundingClientRect();marker={el,fraction:Math.max(0,Math.min(1,(line-r.top)/r.height)),gap:r.top>line?r.top-line:0}}}
function sync(){if(resizing)return;let id='distance';for(const el of parts)if(el.getBoundingClientRect().top<=offset()+45)id=el.id;select(id);remember()}
function go(id){if(!mappings[id])return;select(id);document.getElementById(id).scrollIntoView();remember()}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||!mappings[a.hash.slice(1)])return;e.preventDefault();history.pushState(null,'',a.hash);go(a.hash.slice(1))});
addEventListener('hashchange',()=>go(location.hash.slice(1)));
addEventListener('scroll',()=>{if(innerWidth===lastWidth)sync()},{passive:true});
addEventListener('resize',()=>{resizing=true;lastWidth=innerWidth;const saved=marker;select(active);requestAnimationFrame(()=>{if(saved){const r=saved.el.getBoundingClientRect();scrollBy(0,r.top+r.height*saved.fraction-offset()-saved.gap)}resizing=false;remember()})});
document.querySelector('#copy').addEventListener('click',async()=>{const url=new URL(location.href);url.hash=active;try{await navigator.clipboard.writeText(url.href);document.querySelector('#status').textContent=(location.protocol==='file:'?'已复制（本地链接仅本机可用）':'已复制章节链接')}catch{const input=document.createElement('textarea');input.value=url.href;document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(ok)document.querySelector('#status').textContent=(location.protocol==='file:'?'已复制（本地链接仅本机可用）':'已复制章节链接');else prompt('请复制当前章节链接',url.href)}});
select('distance');addEventListener('load',()=>{if(mappings[location.hash.slice(1)])go(location.hash.slice(1));else sync()});
