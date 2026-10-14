let tableauAPI;
const getTableauAPI=()=>tableauAPI ||= import('https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js');
// Static-first chapter charts share the existing loading component.
document.querySelectorAll('[data-chart]').forEach(widget=>{
 const prefix=widget.dataset.chart,get=suffix=>document.getElementById(prefix+'-'+suffix);
 const canvasWidth=Number(widget.dataset.vizWidth)||900,canvasHeight=Number(widget.dataset.vizHeight)||700;
 widget.style.setProperty('--viz-width',canvasWidth+'px');widget.style.setProperty('--viz-height',canvasHeight+'px');
 const host=get('host'),stage=get('stage'),image=get('static'),status=get('status');
 const interactive=widget.querySelector('.chapter-interactive');
 const showStatic=get('show-static'),showInteractive=get('show-interactive');
 let mode='static',attempt=0,loadedAPI;
 const loader=createLoadingUI({container:widget.querySelector('.loading-panel'),status,kind:'chapter',onStatic:()=>setMode('static'),onRetry:()=>load()});
 function fit(){const scale=Math.min(1,stage.clientWidth/canvasWidth);host.style.transform='scale('+scale+')';interactive.style.height=canvasHeight*scale+'px'}
 function setMode(next){
  mode=next;const isStatic=mode==='static';
  image.hidden=!isStatic;interactive.hidden=isStatic;host.inert=isStatic;
  showInteractive.hidden=!isStatic;showStatic.hidden=isStatic;get('original').hidden=!isStatic;
  stage.dataset.mode=mode;fit();
  if(!isStatic&&!attempt)load();
  (isStatic?showInteractive:showStatic).focus({preventScroll:true});
 }
 showStatic.addEventListener('click',()=>setMode('static'));
 showInteractive.addEventListener('click',()=>setMode('interactive'));
 async function load(){
  const current=++attempt;host.replaceChildren();host.setAttribute('aria-busy','true');loader.start();
  const failed=()=>{if(current!==attempt)return;loader.setState('error');host.setAttribute('aria-busy','false')};
  try{
   const api=loadedAPI||(current===1?await getTableauAPI():await import('https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js?retry='+Date.now()));
   loadedAPI=api;if(current!==attempt)return;
   const viz=new api.TableauViz();viz.id=prefix+'-viz';
   viz.src='https://public.tableau.com/views/'+(widget.dataset.workbook||'_17918785760090')+'/'+widget.dataset.sheet;
   viz.width=canvasWidth+'px';viz.height=canvasHeight+'px';viz.toolbar='bottom';viz.hideTabs=widget.dataset.showTabs!=='true';
   if(widget.dataset.device)viz.device=widget.dataset.device;
   viz.addEventListener(api.TableauEventType.FirstInteractive,()=>{if(current!==attempt||status.dataset.state==='error')return;loader.setState('ready');host.setAttribute('aria-busy','false')});
   viz.addEventListener(api.TableauEventType.VizLoadError,failed);host.append(viz);
  }catch{failed()}
 }
 stage.dataset.mode='static';host.inert=true;fit();new ResizeObserver(fit).observe(stage);
});
