const viewer=document.getElementById('poster-viewer');
const largeImage=document.getElementById('viewer-img');
let opener;
document.querySelectorAll('.poster-open').forEach(button=>button.addEventListener('click',()=>{
 const image=button.querySelector('img');opener=button;
 largeImage.src=image.src;largeImage.alt=image.alt;
 document.getElementById('viewer-title').textContent=image.alt;
 viewer.showModal();document.documentElement.classList.add('poster-modal-open');
}));
document.getElementById('viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{
 if(event.target!==viewer)return;
 const rect=viewer.getBoundingClientRect();
 if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)viewer.close();
});
viewer.addEventListener('close',()=>{
 document.documentElement.classList.remove('poster-modal-open');
 opener?.focus({preventScroll:true});
});
