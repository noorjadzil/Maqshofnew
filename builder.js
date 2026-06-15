
let selected=null;
document.addEventListener('click',e=>{
 if(!document.body.classList.contains('builder-mode')) return;
 if(e.target.closest('#builderPanel')) return;
 e.preventDefault();e.stopPropagation();
 document.querySelectorAll('.builder-selected').forEach(x=>x.classList.remove('builder-selected'));
 selected=e.target; selected.classList.add('builder-selected');
 txt.value=selected.innerText||'';
},{capture:true});

function applyBuilder(){
 if(!selected) return;
 selected.innerText=txt.value;
 selected.style.color=tcolor.value;
 selected.style.backgroundColor=bgcolor.value;
 selected.style.fontSize=fsize.value+'px';
 selected.style.borderRadius=radius.value+'px';
 localStorage.setItem('builder_html',document.body.innerHTML);
}
