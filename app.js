const sections=[
{id:'vocation',number:'01',name:'Vocation & Work',purpose:'Employment, calling, boundaries, obligations and purposeful work.'},
{id:'formation',number:'02',name:'Faith & Formation',purpose:'Prayer, study, experiments, reading and development.'},
{id:'stewardship',number:'03',name:'Household & Stewardship',purpose:'Finances, home, administration and practical order.'},
{id:'community',number:'04',name:'Community & Relationship',purpose:'Family, friends, parish, civic life and service.'},
{id:'renewal',number:'05',name:'Rest & Renewal',purpose:'Leisure, recovery, hobbies and proper stopping.'},
{id:'health',number:'06',name:'Health & Personal',purpose:'Health, routines and essential private instructions.'}
];
const launchers=[
{name:'Google Drive',url:'https://drive.google.com/drive/my-drive',note:'Folders, records and source documents'},
{name:'Gmail · account 1',url:'https://mail.google.com/mail/u/0/#inbox',note:'Primary Gmail desk'},
{name:'Gmail · account 2',url:'https://mail.google.com/mail/u/1/#inbox',note:'Second Gmail desk'},
{name:'Microsoft 365',url:'https://www.office.com/',note:'Office home and applications'},
{name:'Outlook',url:'https://outlook.office.com/mail/',note:'Microsoft email'},
{name:'OneDrive',url:'https://onedrive.live.com/',note:'Microsoft files'},
{name:'Google Calendar',url:'https://calendar.google.com/calendar/u/0/r',note:'Fixed commitments'},
{name:'GitHub',url:'https://github.com/Wally189',note:'Sites, repositories and code'}
];
const key='playtrix.helm.v2';
const defaults={focus:'',today:[{text:'',done:false},{text:'',done:false},{text:'',done:false}],inbox:[],weeklyNote:'',sections:{}};
sections.forEach(s=>defaults.sections[s.id]={position:'',actions:[],waiting:[],links:[],backlog:[]});
let state=load(),currentSection=null;
const $=s=>document.querySelector(s);
function clone(v){return JSON.parse(JSON.stringify(v))}
function load(){try{return merge(defaults,JSON.parse(localStorage.getItem(key)||localStorage.getItem('playtrix.helm.v1')||'{}'))}catch{return clone(defaults)}}
function merge(base,extra){const out=clone(base);Object.assign(out,extra);out.sections=out.sections||{};sections.forEach(s=>out.sections[s.id]=Object.assign({},base.sections[s.id],extra.sections?.[s.id]||{}));return out}
function save(){localStorage.setItem(key,JSON.stringify(state));renderSignals()}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function setView(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$('#'+id).classList.add('active');document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id||(id==='sectionView'&&b.dataset.view===currentSection)));document.body.dataset.section=id==='sectionView'?currentSection:'';scrollTo({top:0,behavior:'smooth'})}
function renderFront(){const d=new Date();$('#todayHeading').textContent=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});$('#principalFocus').value=state.focus;$('#todayList').innerHTML='';state.today.forEach((item,i)=>{const row=document.createElement('div');row.className='task-row';row.innerHTML=`<input type="checkbox" ${item.done?'checked':''} aria-label="Complete"><input type="text" value="${esc(item.text)}" placeholder="${['Essential outcome','Useful outcome','Small outcome'][i]}">`;const [check,text]=row.querySelectorAll('input');check.onchange=()=>{item.done=check.checked;save()};text.oninput=()=>{item.text=text.value;save()};$('#todayList').append(row)});
$('#sectionCards').innerHTML=sections.map(s=>`<button data-section="${s.id}"><span class="num">${s.number}</span><span><strong>${s.name}</strong><br><em>${s.purpose}</em></span><span>Open →</span></button>`).join('');document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>openSection(b.dataset.section));renderInbox();renderSignals()}
function renderInbox(){const box=$('#inboxList');box.innerHTML='';if(!state.inbox.length)box.innerHTML='<p>No loose items.</p>';state.inbox.forEach((item,i)=>{const row=document.createElement('div');row.className='plain-row';row.innerHTML=`<input type="checkbox" ${item.done?'checked':''}><input type="text" value="${esc(item.text)}"><button aria-label="Delete">×</button>`;const [check,text,del]=row.children;check.onchange=()=>{item.done=check.checked;save()};text.oninput=()=>{item.text=text.value;save()};del.onclick=()=>{state.inbox.splice(i,1);renderInbox();save()};box.append(row)})}
function renderSignals(){const waiting=sections.flatMap(s=>state.sections[s.id].waiting||[]);$('#waitingCount').textContent=waiting.length;$('#inboxCount').textContent=state.inbox.filter(x=>!x.done).length;$('#activeCount').textContent=sections.filter(s=>{const d=state.sections[s.id];return d.position||d.actions.length||d.waiting.length||d.backlog.length}).length;const dated=waiting.filter(x=>x.date).sort((a,b)=>a.date.localeCompare(b.date));$('#nearestDeadline').textContent=dated[0]?.date||'Not set'}
function openSection(id){currentSection=id;const s=sections.find(x=>x.id===id),data=state.sections[id];$('#sectionNumber').textContent=s.number;$('#sectionName').textContent=s.name;$('#sectionPurpose').textContent=s.purpose;$('#sectionPosition').value=data.position;renderItems('#sectionActions',data.actions,'Next action');renderItems('#sectionWaiting',data.waiting,'Waiting for');renderItems('#sectionBacklog',data.backlog,'Later item');renderLinks();setView('sectionView')}
function renderItems(selector,items,placeholder){const box=$(selector);box.innerHTML='';if(!items.length)box.innerHTML='<p>Nothing recorded.</p>';items.forEach((item,i)=>{const row=document.createElement('div');row.className='plain-row';row.innerHTML=`<input type="text" value="${esc(item.text||'')}" placeholder="${placeholder}"><button aria-label="Delete">×</button>`;row.querySelector('input').oninput=e=>{item.text=e.target.value;save()};row.querySelector('button').onclick=()=>{items.splice(i,1);openSection(currentSection);save()};box.append(row)})}
function renderLinks(){const links=state.sections[currentSection].links,box=$('#sectionLinks');box.innerHTML='';if(!links.length)box.innerHTML='<p>No links added.</p>';links.forEach((link,i)=>{const row=document.createElement('div');row.className='plain-row';row.innerHTML=`<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.name)}</a><button aria-label="Delete">×</button>`;row.querySelector('button').onclick=()=>{links.splice(i,1);renderLinks();save()};box.append(row)})}
function addItem(kind,label){const text=prompt(label);if(text){state.sections[currentSection][kind].push({text});openSection(currentSection);save()}}
function renderTools(){$('#launcherGrid').innerHTML=launchers.map((l,i)=>`<div class="tool-row"><div><strong>${l.name}</strong><p>${l.note}</p></div><div class="tool-actions"><button data-viewer="${i}">View here</button><a href="${l.url}" target="_blank" rel="noopener">Open app</a></div></div>`).join('');document.querySelectorAll('[data-viewer]').forEach(b=>b.onclick=()=>openViewer(launchers[+b.dataset.viewer]))}
function openViewer(item){$('#viewerTitle').textContent=item.name;$('#viewerExternal').href=item.url;$('#viewerFrame').src=item.url;$('#viewerPanel').hidden=false;$('#viewerPanel').scrollIntoView({behavior:'smooth'})}
function route(view){if(sections.some(s=>s.id===view))openSection(view);else{currentSection=null;document.body.dataset.section='';setView(view);if(view==='tools')renderTools()}}
$('#principalFocus').oninput=e=>{state.focus=e.target.value;save()};$('#weeklyNote').value=state.weeklyNote;$('#weeklyNote').oninput=e=>{state.weeklyNote=e.target.value;save()};
function openCapture(){$('#captureDialog').showModal()}$('#captureButton').onclick=openCapture;$('#mobileCapture').onclick=openCapture;
$('#captureSection').innerHTML='<option value="inbox">General inbox</option>'+sections.map(s=>`<option value="${s.id}">${s.number} ${s.name}</option>`).join('');
$('#saveCapture').onclick=e=>{e.preventDefault();const text=$('#captureText').value.trim(),section=$('#captureSection').value;if(!text)return;if(section==='inbox')state.inbox.push({text,done:false,created:new Date().toISOString()});else state.sections[section].actions.push({text});$('#captureText').value='';save();$('#captureDialog').close();renderFront()};
$('#clearInbox').onclick=()=>{state.inbox=state.inbox.filter(x=>!x.done);renderInbox();save()};
$('#addAction').onclick=()=>addItem('actions','What is the next action?');$('#addWaiting').onclick=()=>addItem('waiting','What are you waiting for?');$('#addBacklog').onclick=()=>addItem('backlog','What belongs in the backlog?');
$('#addLink').onclick=()=>{const name=prompt('Link name');if(!name)return;const url=prompt('Paste the full web address');if(url){state.sections[currentSection].links.push({name,url});renderLinks();save()}};
$('#sectionPosition').oninput=e=>{state.sections[currentSection].position=e.target.value;save()};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>route(b.dataset.view));renderFront();renderTools();