// Shared by report charts, the full dashboard and the local preview.
function createLoadingUI({container,status,kind,alternate,onStatic,onRetry}) {
 const dashboard=kind==='dashboard';
 let state='loading',timer,earlyTimer;
 const content=document.createElement('div');content.className='loading-content';
 const spinner=document.createElement('span');spinner.className='chart-spinner';spinner.setAttribute('aria-hidden','true');
 const description=document.createElement('p');description.className='loading-description';
 const actions=document.createElement('div');actions.className='loading-actions';
 const wait=document.createElement('button');wait.type='button';wait.className='loading-primary';wait.textContent='继续等待';
 // The top navigation stays anchored; only the central action changes style.
 const fallback=alternate?alternate.cloneNode(true):document.createElement('button');
 fallback.removeAttribute('id');
 if(!alternate){fallback.type='button';fallback.textContent='查看静态图';fallback.addEventListener('click',onStatic)}
 status.classList.add('loading-title');status.setAttribute('role','status');
 content.append(spinner,status,description,actions);actions.append(wait);container.append(content);
 const retry=onRetry?document.createElement('button'):null;
 if(retry){retry.type='button';retry.className='loading-secondary';retry.textContent='重试加载';retry.addEventListener('click',onRetry);actions.append(retry)}
 function render(){
  container.dataset.state=state;status.dataset.state=state;
  container.hidden=state==='ready';status.hidden=state==='ready';
  spinner.hidden=!['loading','delayed','waiting'].includes(state);
  const noun=dashboard?'完整仪表板':'交互图表';
  status.textContent=state==='slow'?'加载时间较长':state==='waiting'?`仍在加载${noun}…`:state==='error'?`${noun}加载失败`:`正在加载${noun}…`;
  description.textContent=dashboard?'你可以继续等待，或在 Tableau Public 中查看。':'你可以继续等待，或先查看静态图。';
  if(state==='loading')description.textContent='交互图表支持条件筛选和鼠标悬停查看详情。';
  if(state==='delayed')description.textContent=alternate?'加载较慢时，你可以先在 Tableau Public 中查看。':'加载较慢时，你可以先查看静态图。';
  if(state==='error')description.textContent=dashboard?'请检查网络，或在 Tableau Public 中查看。':'你可以先查看静态图。';
  description.hidden=!['loading','delayed','slow','error'].includes(state);
  wait.hidden=state!=='slow';
  if(retry)retry.hidden=state!=='error';
  const showFallback=['delayed','slow','waiting','error'].includes(state);
  if(showFallback){
   actions.append(fallback);fallback.hidden=false;
   fallback.className=['delayed','waiting'].includes(state)?'loading-text':'loading-secondary';
   if(alternate)fallback.textContent='在 Tableau Public 中打开';
  }else{fallback.hidden=true}
  actions.hidden=!showFallback;
 }
 function setState(next){clearTimeout(timer);clearTimeout(earlyTimer);state=next;render()}
 wait.addEventListener('click',()=>{setState('waiting');fallback.focus({preventScroll:true})});
 function start(){
  setState('loading');
  earlyTimer=setTimeout(()=>{if(state==='loading'){state='delayed';render()}},3000);
  timer=setTimeout(()=>{if(['loading','delayed'].includes(state))setState('slow')},10000);
 }
 render();return {start,setState};
}
