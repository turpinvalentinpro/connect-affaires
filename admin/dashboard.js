const search=document.getElementById('page-search');
const normalize=value=>value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const rows=[...document.querySelectorAll('.page-row')];
search.addEventListener('input',()=>{
 const query=normalize(search.value.trim());let visible=0;
 for(const row of rows){row.hidden=!normalize(row.dataset.search).includes(query);if(!row.hidden)visible++;}
 for(const group of document.querySelectorAll('.page-group'))group.hidden=![...group.querySelectorAll('.page-row')].some(row=>!row.hidden);
 document.getElementById('no-results').hidden=visible>0;
 document.getElementById('search-status').textContent=query?`${visible} page${visible>1?'s':''} trouvée${visible>1?'s':''}`:'';
});
for(const link of document.querySelectorAll('.sidebar nav a'))link.addEventListener('click',()=>{
 if(search.value){search.value='';search.dispatchEvent(new Event('input'));}
 for(const item of document.querySelectorAll('.sidebar nav a'))item.removeAttribute('aria-current');
 link.setAttribute('aria-current','true');
});
