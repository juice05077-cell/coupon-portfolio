// The URL alone determines the resume guide; no persisted preference.
const operationsView=new URLSearchParams(location.search).get('view')==='operations';
if(operationsView){
 document.querySelectorAll('.work-entries a,.site-brand a').forEach(link=>{
  const url=new URL(link.getAttribute('href'),location.href);
  url.searchParams.set('view','operations');
  link.setAttribute('href',url.pathname.split('/').pop()+url.search+url.hash);
 });
 if(document.body.classList.contains('posters-page')){
  const sidebar=document.querySelector('aside.context');
  sidebar.querySelector('.project-summary').textContent='围绕烤肉店「鲜切现烤」的核心卖点，使用 Canva 制作门店宣传海报及横幅，用于实际宣传。';
  const items=sidebar.querySelectorAll('.capability');
  items[0].querySelector('h2').textContent='内容策划';
  items[0].querySelector('.resume-text').textContent='根据门店宣传需求，提炼鲜切食材、现烤特色等产品卖点，组织画面信息与宣传文案。';
  items[1].querySelector('.resume-text').textContent='参考构图方案，独立完成图片素材筛选、字体搭配、配色调整及画面排版，交付多张宣传物料。';
 }
}
