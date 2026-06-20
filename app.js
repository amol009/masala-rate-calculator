
const tbody=document.getElementById('tbody');

function save(){
 const data=[...tbody.querySelectorAll('tr')].map(r=>({
 item:r.children[0].querySelector('input').value,
 purchase:r.children[1].querySelector('input').value,
 transport:r.children[2].querySelector('input').value,
 packing:r.children[3].querySelector('input').value,
 other:r.children[4].querySelector('input').value,
 profit:r.children[6].querySelector('input').value
 }));
 localStorage.setItem('rateData',JSON.stringify(data));
}

function recalc(){
 [...tbody.querySelectorAll('tr')].forEach(r=>{
   const p=+r.children[1].querySelector('input').value||0;
   const t=+r.children[2].querySelector('input').value||0;
   const pa=+r.children[3].querySelector('input').value||0;
   const o=+r.children[4].querySelector('input').value||0;
   const pp=+r.children[6].querySelector('input').value||0;
   const total=p+t+pa+o;
   const profit=total*pp/100;
   const sell=total+profit;
   r.children[5].textContent=total.toFixed(2);
   r.children[7].textContent=profit.toFixed(2);
   r.children[8].textContent=sell.toFixed(2);
 });
 save();
}

function addRow(d={item:'',purchase:'',transport:'',packing:'',other:'',profit:'20'}){
 const tr=document.createElement('tr');
 tr.innerHTML=`
 <td><input value="${d.item||''}"></td>
 <td><input type="number" value="${d.purchase||''}"></td>
 <td><input type="number" value="${d.transport||''}"></td>
 <td><input type="number" value="${d.packing||''}"></td>
 <td><input type="number" value="${d.other||''}"></td>
 <td>0</td>
 <td><input type="number" value="${d.profit||20}"></td>
 <td>0</td>
 <td>0</td>
 <td><button onclick="this.closest('tr').remove();recalc()">X</button></td>`;
 tbody.appendChild(tr);
 tr.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalc));
 recalc();
}

function exportCSV(){
 let csv="Item,Purchase,Transport,Packing,Other,Total Cost,Profit %,Profit,Selling Price\n";
 [...tbody.rows].forEach(r=>{
  csv += [...r.cells].slice(0,9).map(c=>c.querySelector('input')?c.querySelector('input').value:c.textContent).join(",")+"\n";
 });
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv]));
 a.download='rates.csv';a.click();
}

function exportExcel(){
 const wb=XLSX.utils.table_to_book(document.getElementById('tbl'));
 XLSX.writeFile(wb,'rates.xlsx');
}

document.getElementById('themeBtn').onclick=()=>{
 document.body.classList.toggle('dark');
 localStorage.setItem('theme',document.body.classList.contains('dark'));
};

if(localStorage.getItem('theme')==='true') document.body.classList.add('dark');

const data=JSON.parse(localStorage.getItem('rateData')||'[]');
if(data.length) data.forEach(addRow);
else addRow();

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
