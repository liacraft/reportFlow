const content=document.getElementById('content'), title=document.getElementById('title');

const projects=[
  {name:'MTF Mobile',pic:'Nadia Pratama',status:'In Review',progress:78,color:'blue',desc:'Payment report'},
  {name:'1Access',pic:'Raka Wijaya',status:'Approved',progress:100,color:'green',desc:'Product performance'},
  {name:'RCDE',pic:'Raka Wijaya',status:'Waiting Data',progress:42,color:'amber',desc:'Business performance'}
];

// Metric configuration = structure only. Values belong to the reporting period data.
const metricSets={
  'MTF Mobile':[
    {name:'Jumlah Transaksi (MTD)',value:'187518210487',unit:'IDR',type:'Number',required:true},
    {name:'Pelunasan Dipercepat',value:'97443303500',unit:'IDR',type:'Number',required:true},
    {name:'Pembayaran Angsuran',value:'90006784067',unit:'IDR',type:'Number',required:true},
    {name:'Pembayaran Denda',value:'2357744965',unit:'IDR',type:'Number',required:true},
    {name:'Biaya Tagih',value:'382225128',unit:'IDR',type:'Number',required:true},
    {name:'Fee Based',value:'107290870',unit:'IDR',type:'Number',required:true},
    {name:'User Active',value:'31680',unit:'USERS',type:'Number',required:true},
    {name:'Jumlah Transaksi (YTD)',value:'1293718210487',unit:'IDR',type:'Number',required:true}
  ],
  '1Access':[
    {name:'Total Registered User',value:'24580',unit:'USERS',type:'Number',required:true},
    {name:'Active User',value:'18420',unit:'USERS',type:'Number',required:true},
    {name:'New Registration',value:'2340',unit:'USERS',type:'Number',required:true},
    {name:'Transaction Volume',value:'45280',unit:'TRANSACTIONS',type:'Number',required:true},
    {name:'Transaction Value',value:'12450000000',unit:'IDR',type:'Number',required:true},
    {name:'Conversion Rate',value:'76.4',unit:'%',type:'Percentage',required:true},
    {name:'System Availability',value:'99.8',unit:'%',type:'Percentage',required:true}
  ],
  'RCDE':[
    {name:'Total Request',value:'1240',unit:'REQUESTS',type:'Number',required:true},
    {name:'Completed',value:'1180',unit:'REQUESTS',type:'Number',required:true},
    {name:'Pending',value:'42',unit:'REQUESTS',type:'Number',required:true},
    {name:'Rejected',value:'18',unit:'REQUESTS',type:'Number',required:true},
    {name:'Completion Rate',value:'95.2',unit:'%',type:'Percentage',required:true},
    {name:'Average Processing Time',value:'2.4',unit:'DAYS',type:'Decimal',required:true}
  ]
};



// Report visual structure: presentation rules are separate from submitted values.
// A project can have its own KPI, bar, pie, and stacked-bar blocks.
const reportVisuals={
  'MTF Mobile':[
    {type:'bar',title:'Payment volume by month',description:'Monthly transaction volume (illustrative historical values).',metrics:['Volume Transaksi (MTD)'],data:[['Jul',162000000000],['Aug',162000000000],['Sep',187518210487]]},
    {type:'pie',title:'September transaction mix',description:'Composition of payment categories for the current period.',metrics:['Pembayaran Angsuran','Pelunasan Dipercepat','Pembayaran Denda']},
    {type:'stacked',title:'Payment composition',description:'Monthly composition by payment category.',metrics:['Pembayaran Angsuran','Pelunasan Dipercepat','Pembayaran Denda'],data:[['Jul',72000000000,68000000000,2200000000],['Aug',82000000000,76000000000,2300000000],['Sep',90006784067,97443303500,2357374965]]}
  ],
  '1Access':[
    {type:'bar',title:'User activity',description:'Registered, active, and new users.',metrics:['Total Registered User','Active User','New Registration']},
    {type:'pie',title:'Active vs inactive users',description:'Current user base composition.',metrics:['Total Registered User','Active User']}
  ],
  'RCDE':[
    {type:'bar',title:'Request status',description:'Current request volume by status.',metrics:['Completed','Pending','Rejected']},
    {type:'stacked',title:'Request composition',description:'Requests split by completion status.',metrics:['Completed','Pending','Rejected'],data:[['Current',1180,42,18]]}
  ]
};

const templates=[
  {name:'September Minimal',status:'Active',background:'',backgroundColor:'#ffffff',accentColor:'#315efb',fontSize:12,charts:{bar:true,pie:true,stacked:true}},
  {name:'Corporate Blue',status:'Available',background:'',backgroundColor:'#f7f9ff',accentColor:'#0a71cc',fontSize:12,charts:{bar:true,pie:true,stacked:false}},
  {name:'Executive Summary',status:'Available',background:'',backgroundColor:'#ffffff',accentColor:'#17191e',fontSize:13,charts:{bar:true,pie:false,stacked:true}}
];
let activeTemplateName='September Minimal';
let currentPeriod='September 2026';
let overviewProject='MTF Mobile';
let modalState={type:null,project:null,index:null};
let demoRole='Monthly Report PIC';
let dataFlowStep={};

const history=[
  ['September 2026','3 projects','2 submitted','In Review','blue','68%','Sep 15, 2026'],
  ['August 2026','3 projects','3 submitted','Approved','green','100%','Aug 31, 2026'],
  ['July 2026','3 projects','3 submitted','Approved','green','100%','Jul 31, 2026'],
  ['June 2026','3 projects','3 submitted','Approved','green','100%','Jun 30, 2026'],
  ['May 2026','3 projects','3 submitted','Approved','green','100%','May 29, 2026']
];


const activityLog=[
  {date:'Sep 16, 2026',time:'14:32',actor:'Raka Wijaya',role:'Project PIC',project:'RCDE',period:'September 2026',category:'Data',action:'Updated metric value',detail:'Total Request',change:'1,220 → 1,240'},
  {date:'Sep 16, 2026',time:'14:18',actor:'Raka Wijaya',role:'Project PIC',project:'1Access',period:'September 2026',category:'Submission',action:'Submitted monthly data',detail:'7 metrics completed',change:''},
  {date:'Sep 16, 2026',time:'13:52',actor:'Amalia',role:'Monthly Report PIC',project:'RCDE',period:'September 2026',category:'Report',action:'Generated report',detail:'September Minimal template',change:''},
  {date:'Sep 15, 2026',time:'16:40',actor:'Raka Wijaya',role:'Project PIC',project:'RCDE',period:'August 2026',category:'Review',action:'Requested revision',detail:'Total request differs from source recap',change:''},
  {date:'Sep 15, 2026',time:'16:02',actor:'Amalia',role:'Monthly Report PIC',project:'RCDE',period:'August 2026',category:'Workflow',action:'Reopened data submission',detail:'Revision requested by Project PIC',change:''},
  {date:'Sep 15, 2026',time:'14:32',actor:'Nadia Pratama',role:'Project PIC',project:'MTF Mobile',period:'September 2026',category:'Data',action:'Updated metric value',detail:'Jumlah Transaksi (MTD)',change:'IDR 182.4B → IDR 187.5B'},
  {date:'Sep 15, 2026',time:'14:10',actor:'Amalia',role:'Monthly Report PIC',project:'MTF Mobile',period:'September 2026',category:'Report',action:'Generated report',detail:'September Minimal template',change:''},
  {date:'Sep 15, 2026',time:'13:45',actor:'Amalia',role:'Monthly Report PIC',project:'RCDE',period:'October 2026',category:'Structure',action:'Added metric',detail:'Average Resolution Time',change:'New metric'},
  {date:'Sep 12, 2026',time:'11:20',actor:'Amalia',role:'Monthly Report PIC',project:'MTF Mobile',period:'October 2026',category:'Structure',action:'Changed metric requirement',detail:'User Active',change:'Optional → Required'},
  {date:'Aug 28, 2026',time:'15:06',actor:'Amalia',role:'Monthly Report PIC',project:'1Access',period:'September 2026',category:'Structure',action:'Deactivated metric',detail:'Legacy Registration Count',change:'Active → Inactive'}
];
const annualOverview={
  'MTF Mobile':{
    months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
    volume:[132000000000,145000000000,151000000000,149000000000,158000000000,154000000000,162000000000,162000000000,187518210487],
    kpis:[['Payment volume','IDR 1.40T','+12.4% YoY'],['User Active','31,680','+8.2% YoY'],['Early payoff','IDR 97.4B','+18.1% YoY']],
    mix:[['Pembayaran Angsuran',90006784067],['Pelunasan Dipercepat',97443303500],['Pembayaran Denda',2357374965]]
  },
  '1Access':{
    months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
    volume:[31000,33500,35200,36100,37800,40100,42200,43800,45280],
    kpis:[['Registered user','24,580','+10.1% YoY'],['Active user','18,420','+8.7% YoY'],['Conversion rate','76.4%','+4.3 pts']],
    mix:[['Active User',18420],['Inactive User',6160]]
  },
  'RCDE':{
    months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
    volume:[820,900,940,1010,980,1080,1120,1190,1240],
    kpis:[['Total request','1,240','+9.8% YoY'],['Completion rate','95.2%','+3.1 pts'],['Avg. processing time','2.4 days','-0.6 days']],
    mix:[['Completed',1180],['Pending',42],['Rejected',18]]
  }
};
const badge=(s,c)=>`<span class="status ${c}">${s}</span>`;

// Monthly recap data used by the generated infographic. Each metric keeps a monthly history.
// In the real product these rows come from submitted reporting-period data.
const monthlyReportData={
  'MTF Mobile':{
    'Jumlah Transaksi (MTD)':[119200000000,110200000000,107200000000,126200000000,133300000000,160600000000,162000000000,187500000000,187518210487],
    'Pelunasan Dipercepat':[57200000000,46900000000,41600000000,56300000000,60400000000,74800000000,74200000000,76800000000,97443303500],
    'Pembayaran Angsuran':[64100000000,67300000000,69400000000,72500000000,72300000000,85700000000,84100000000,90000000000,90006784067],
    'Pembayaran Denda':[822000000,909700000,769700000,1100000000,1300000000,1600000000,1800000000,2300000000,2357744965],
    'Biaya Tagih':[167300000,184200000,151700000,212300000,227900000,273500000,305000000,382000000,382225128],
    'Fee Based':[60500000,57700000,64300000,78700000,90600000,94100000,106700000,107000000,107290870],
    'User Active':[23312,22933,23298,25229,28089,30160,30763,31600,31680],
    'Jumlah Transaksi (YTD)':[77590000000,369100000000,1060000000000,1106393362737]
  },
  '1Access':{
    'Total Registered User':[15200,16100,16900,17800,19100,20500,21800,23200,24580],
    'Active User':[10800,11400,12100,12800,13700,14900,15800,17100,18420],
    'New Registration':[1200,1300,1250,1400,1550,1600,1750,2100,2340],
    'Transaction Volume':[18000,21000,23500,26000,29000,33000,36500,41000,45280],
    'Transaction Value':[6200000000,7100000000,7600000000,8200000000,9100000000,10100000000,11200000000,11800000000,12450000000],
    'Conversion Rate':[71.1,70.8,71.6,71.9,71.7,72.7,72.5,73.7,76.4],
    'System Availability':[99.1,99.3,99.4,99.5,99.6,99.6,99.7,99.7,99.8]
  },
  'RCDE':{
    'Total Request':[820,900,940,1010,980,1080,1120,1190,1240],
    'Completed':[770,840,880,950,920,1015,1050,1140,1180],
    'Pending':[32,38,39,42,41,47,51,34,42],
    'Rejected':[18,22,21,18,19,18,19,16,18],
    'Completion Rate':[93.9,93.3,93.6,94.1,93.9,94.0,93.8,95.8,95.2],
    'Average Processing Time':[3.1,3.0,2.9,2.9,2.8,2.7,2.6,2.5,2.4]
  }
};
const recapMonths=['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP'];
const recapMonthLabels=['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP'];

const projectByName=name=>projects.find(p=>p.name===name);
const esc=s=>String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));

function displayChartValue(project,value){
  const n=Number(value)||0;
  if(project==='MTF Mobile'){
    if(n>=1e12)return 'IDR '+(n/1e12).toFixed(2)+'T';
    if(n>=1e9)return 'IDR '+(n/1e9).toFixed(1)+'B';
    if(n>=1e6)return 'IDR '+(n/1e6).toFixed(1)+'M';
  }
  if(project==='1Access') return n>=1000?(n/1000).toFixed(1)+'K':n.toLocaleString('en-US');
  return n.toLocaleString('en-US');
}
function annualBarChart(project){
  return `<div class="chart-canvas-wrap"><canvas id="annual-chart" aria-label="${esc(project)} annual trend chart"></canvas></div>`;
}
function mixBars(project){
  return `<div class="chart-canvas-wrap mix-chart-wrap"><canvas id="mix-chart" aria-label="${esc(project)} reporting mix chart"></canvas></div>`;
}
function destroyCharts(){
  if(!window.__reportflowCharts)return;
  Object.values(window.__reportflowCharts).forEach(chart=>{try{chart.destroy()}catch(e){}});
  window.__reportflowCharts={};
}
function chartLabel(project,value){
  return displayChartValue(project,value);
}
function initDashboardCharts(){
  if(typeof Chart==='undefined')return;
  const d=annualOverview[overviewProject];
  const annualCanvas=document.getElementById('annual-chart');
  const mixCanvas=document.getElementById('mix-chart');
  if(!window.__reportflowCharts)window.__reportflowCharts={};
  if(window.ChartDataLabels)Chart.register(ChartDataLabels);
  const commonFont={family:'Inter, Arial, sans-serif',size:10};
  if(annualCanvas){
    window.__reportflowCharts.annual=new Chart(annualCanvas,{type:'bar',data:{labels:d.months,datasets:[{label:overviewProject,data:d.volume,backgroundColor:d.volume.map((_,i)=>i===d.volume.length-1?'#315efb':'#dce5ff'),borderRadius:7,borderSkipped:false,maxBarThickness:42}]},options:{responsive:true,maintainAspectRatio:false,animation:false,layout:{padding:{top:26,right:4,left:4,bottom:0}},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>chartLabel(overviewProject,ctx.raw)}},datalabels:{display:true,anchor:'end',align:'top',offset:3,color:'#5f6670',font:{...commonFont,weight:600},formatter:v=>chartLabel(overviewProject,v)}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:commonFont,color:'#8b919a'}},y:{beginAtZero:true,grid:{color:'#eef0f3',drawTicks:false},border:{display:false},ticks:{font:commonFont,color:'#8b919a',maxTicksLimit:5,callback:v=>chartLabel(overviewProject,v)}}}}});
  }
  if(mixCanvas){
    const total=d.mix.reduce((a,x)=>a+x[1],0);
    const labels=d.mix.map(x=>x[0]);
    const values=d.mix.map(x=>x[1]);
    window.__reportflowCharts.mix=new Chart(mixCanvas,{type:'doughnut',data:{labels,datasets:[{data:values,backgroundColor:['#315efb','#7897ff','#b4c4ff','#dbe3ff'],borderColor:'#fff',borderWidth:4,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',animation:false,plugins:{legend:{position:'bottom',labels:{font:commonFont,color:'#626973',usePointStyle:true,pointStyle:'circle',padding:14}},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${chartLabel(overviewProject,ctx.raw)} · ${(ctx.raw/total*100).toFixed(1)}%`}},datalabels:{display:true,color:'#fff',font:{...commonFont,weight:600},formatter:(v)=>`${(v/total*100).toFixed(1)}%`}}}});
  }
}
function dashboard(){
 const d=annualOverview[demoRole==='Project PIC'?'MTF Mobile':overviewProject];
 const visibleProjects=demoRole==='Project PIC'?projects.filter(p=>p.name==='MTF Mobile'):projects;
 return `<div class="head"><div><div class="eyebrow">${esc(currentPeriod)} reporting cycle</div><h2>${demoRole==='Project PIC'?'Good morning, Nadia.':'Good morning, Amalia.'}</h2><p>${demoRole==='Project PIC'?'Here’s what needs your attention for MTF Mobile.':'Here’s what needs your attention today.'}</p></div><button class="primary" onclick="openNewCycle()">＋ New reporting cycle</button></div>
<section class="card hero"><div class="cardhead"><div><div class="ctitle">${esc(currentPeriod)}</div><div class="csub">Overall reporting progress</div></div>${badge('In Review','blue')}</div><div class="progressrow"><div class="progress" style="flex:1"><i style="width:68%"></i></div><b>68%</b></div><div class="metrics"><div class="metric"><label>Projects</label><b>3</b></div><div class="metric"><label>Data submitted</label><b>2 / 3</b></div><div class="metric"><label>Awaiting review</label><b>1</b></div><div class="metric"><label>Approved</label><b>1</b></div></div></section>
<section class="card annual-overview dashboard-report-overview"><div class="overview-top"><div><div class="eyebrow">2026 report overview</div><div class="report-overview-title">Data at a glance</div><div class="csub">A consolidated view of reported data across the year.</div></div><div class="overview-controls"><label>Project<select class="overview-select" onchange="changeOverviewProject(this.value)">${visibleProjects.map(p=>`<option value="${p.name}" ${p.name===overviewProject?'selected':''}>${p.name}</option>`).join('')}</select></label><button class="secondary" onclick="show('reports')">View reports ↗</button></div></div>
<div class="overview-kpis">${d.kpis.map(k=>`<div class="overview-kpi"><span>${esc(k[0])}</span><b>${esc(k[1])}</b><small>${esc(k[2])}</small><div class="kpi-rule"></div></div>`).join('')}</div>
<div class="overview-charts"><section class="overview-chart trend-card"><div class="chart-head"><div><b>${overviewProject==='MTF Mobile'?'Payment volume':overviewProject==='1Access'?'Transaction volume':'Total requests'}</b><span>Monthly reported values · Jan–Sep 2026</span></div><span class="chart-unit">${overviewProject==='MTF Mobile'?'IDR':'Count'}</span></div>${annualBarChart(overviewProject)}</section><section class="overview-chart mix-card"><div class="chart-head"><div><b>${overviewProject==='MTF Mobile'?'September payment mix':overviewProject==='1Access'?'Current user mix':'September request status'}</b><span>Latest available reporting period</span></div><span class="chart-unit">${overviewProject==='MTF Mobile'?'IDR':'Count'}</span></div>${mixBars(overviewProject)}</section></div>
<div class="overview-foot"><span>${overviewProject} · ${d.months.length} months of data available</span><button class="text-btn" onclick="openData('${overviewProject}')">View detailed data →</button></div></section>
<div class="two dashboard-lower"><section class="card"><div class="cardhead"><div><div class="ctitle">Project progress</div><div class="csub">Status across all projects this month.</div></div><button class="secondary" onclick="show('data')">View all ↗</button></div>${visibleProjects.map(p=>`<div class="project"><div class="projecttop"><div><div class="pname">${p.name}</div><div class="owner">PIC · ${p.pic}</div></div>${badge(p.status,p.color)}</div><div class="pbar"><div class="progress"><i style="width:${p.progress}%"></i></div><span class="pct">${p.progress}%</span></div></div>`).join('')}</section>
<section class="card attention"><div class="cardhead"><div><div class="ctitle">Needs your attention</div><div class="csub">Items blocking the ${esc(currentPeriod)} report.</div></div>${badge('2 items','red')}</div><div class="attentiongrid"><div class="attentionitem"><div><b>RCDE data submission</b><small>Waiting for PIC Project · due 16 Sep</small></div><button class="secondary" onclick="openData('RCDE')">Open</button></div><div class="attentionitem"><div><b>MTF Mobile review</b><small>Project PIC review pending</small></div><button class="secondary" onclick="show('review')">Open</button></div></div></section></div>`;
}
function changeOverviewProject(project){overviewProject=project;show('dashboard')}

function reports(){return `<div class="head"><div><div class="eyebrow">Reporting archive</div><h2>Monthly reports</h2><p>View current and previous reporting cycles across all projects.</p></div><button class="primary" onclick="openNewCycle()">＋ Create reporting cycle</button></div>
<section class="archive"><div class="archive-year">2026</div>${history.map((r,i)=>`<section class="card archive-card"><div class="archive-main"><div><div class="archive-title">${r[0]}</div><div class="csub">${r[1]} · ${r[2]}</div></div>${badge(r[3],r[4])}</div><div class="archive-progress"><div class="mini"><i style="width:${r[5]}%"></i></div><span>${r[5]}</span></div><div class="archive-updated">Updated ${r[6]}</div><button class="secondary" onclick="openHistory('${r[0]}')">${i===0?'Open reports':'View report'}</button></section>`).join('')}</section>`}

function data(){return `<div class="head"><div><div class="eyebrow">${esc(currentPeriod)}</div><h2>Data collection</h2><p>Collect monthly data for each project. Project PICs review the previous period before creating the new monthly submission.</p></div><span class="status blue">${demoRole==='Monthly Report PIC'?'Monthly Report PIC · Full access':'Project PIC · Assigned project'}</span></div>
<section class="collection-note"><div><b>${demoRole==='Monthly Report PIC'?'Manage structure, review submissions, and monitor data.':'Review previous data before starting a new monthly submission.'}</b><span>${demoRole==='Monthly Report PIC'?' Project PICs only fill, review, and submit their assigned project data.':' Previous monthly values stay available for comparison and can be corrected before the new period is created.'}</span></div>${demoRole==='Monthly Report PIC'?`<button class="secondary" onclick="openMetrics('MTF Mobile')">Manage metrics</button>`:''}</section>
<div class="collection-list">${projects.filter(p=>demoRole==='Monthly Report PIC'||p.name==='MTF Mobile').map(p=>{const fields=metricSets[p.name];const action=dataFlowStep[p.name]?'Continue':'Create new';return `<section class="card collection-card"><div class="collection-top"><div class="projecticon">▦</div><div class="collection-title"><div class="ctitle">${p.name}</div><div class="csub">PIC · ${p.pic} · ${fields.length} active metrics</div></div>${badge(p.status,p.color)}</div><div class="collection-meta"><div><span>Previous period</span><b>${previousPeriod(currentPeriod)}</b></div><div><span>Current cycle</span><b>${currentPeriod}</b></div><div><span>Last updated</span><b>${p.name==='RCDE'?'—':'Sep '+(p.name==='MTF Mobile'?'15':'14')+', 2026'}</b></div></div><div class="collection-actions"><button class="primary" onclick="openData('${p.name}')">${action}</button><button class="secondary" onclick="openHistory('${previousPeriod(currentPeriod)}','${p.name}')">View previous report</button>${demoRole==='Monthly Report PIC'?`<button class="secondary manage-btn" onclick="openMetrics('${p.name}')">Manage structure</button>`:''}</div></section>`}).join('')}</div>`}
function previousPeriod(period){const [m,y]=period.split(' ');const names=['January','February','March','April','May','June','July','August','September','October','November','December'];let i=names.indexOf(m);let year=Number(y);i--;if(i<0){i=11;year--;}return `${names[i]} ${year}`;}
function previousDataSummary(project,month){
  const fields=metricSets[project]||[];
  return `<div class="previous-data-table"><div class="previous-table-head"><span>Metric</span><span>${esc(month)}</span></div>${fields.slice(0,6).map(m=>`<div class="previous-table-row"><span>${esc(m.name)}</span><b>${formatValue(m)}</b></div>`).join('')}</div>`;
}
function openData(project){title.textContent='Data Collection';content.innerHTML=dataForm(project);setActive('data')}
function dataForm(project){
  const p=projectByName(project), fields=metricSets[project]||[], previous=previousPeriod(currentPeriod), step=dataFlowStep[project]||'previous';
  if(step==='summary') return dataSummaryStep(project);
  if(step==='input') return currentInputStep(project);
  return `<div class="head"><div><div class="eyebrow">${esc(project)} · ${esc(currentPeriod)}</div><h2>Data collection</h2><p>Review the previous report before creating the new monthly submission.</p></div><div>${badge(p.status,p.color)}</div></div>
  <section class="card flow-card">
    <div class="flow-stepper"><div class="flow-step active"><span>1</span><div><b>Review previous data</b><small>Check ${esc(previous)} before starting the new cycle.</small></div></div><div class="flow-line"></div><div class="flow-step"><span>2</span><div><b>Input ${esc(currentPeriod)}</b><small>Enter the latest monthly values.</small></div></div><div class="flow-line"></div><div class="flow-step"><span>3</span><div><b>Summary & submit</b><small>Review your input before submission.</small></div></div></div>
    <div class="flow-section-head"><div><div class="eyebrow">Step 1 · Previous report</div><h3>Check ${esc(previous)} data</h3><p>Use the previous submission as a reference. If there is a correction, edit the previous data first.</p></div><span class="status gray">Historical data</span></div>
    ${previousDataSummary(project,previous)}
    <div class="flow-callout"><span class="callout-icon">i</span><div><b>Need to correct the previous period?</b><small>Make the correction before creating the ${esc(currentPeriod)} submission. Historical values remain tied to their original reporting period.</small></div><button class="secondary" onclick="editPreviousData('${project}','${previous}')">Edit ${esc(previous)}</button></div>
    <div class="formfooter"><button class="secondary" onclick="show('data')">Back</button><button class="primary" onclick="startNewData('${project}')">Create new ${esc(currentPeriod)} report →</button></div>
  </section>`;
}
function editPreviousData(project,month){
  openModal(`<div class="modal-head"><div><div class="eyebrow">Historical data · ${esc(project)}</div><h3>Edit ${esc(month)} data</h3><p>Corrections are saved to the selected historical reporting period, not to ${esc(currentPeriod)}.</p></div><button class="modal-close" onclick="closeModal()">×</button></div><form class="modal-form" onsubmit="savePreviousData(event,'${esc(project)}','${esc(month)}')">${(metricSets[project]||[]).slice(0,6).map((m,i)=>`<div class="modal-field full"><label>${esc(m.name)}</label><div class="inputwrap modal-inputwrap"><input id="prev-${i}" value="${esc(m.value)}"><span class="unit">${esc(m.unit)}</span></div></div>`).join('')}<div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary" type="submit">Save correction</button></div></form>`);
}
function savePreviousData(e,project,month){e.preventDefault();closeModal();openData(project);showToast(`${month} data updated. ${currentPeriod} is ready to be created.`);}
function startNewData(project){dataFlowStep[project]='input';openData(project)}
function currentInputStep(project){
  const p=projectByName(project), fields=metricSets[project]||[];
  return `<div class="head"><div><div class="eyebrow">${esc(project)} · ${esc(currentPeriod)}</div><h2>Input monthly data</h2><p>Enter the latest values for ${esc(currentPeriod)}.</p></div>${badge('Draft','gray')}</div>
  <section class="card flow-card"><div class="flow-stepper"><div class="flow-step done"><span>✓</span><div><b>Review previous data</b><small>${esc(previousPeriod(currentPeriod))} checked</small></div></div><div class="flow-line done"></div><div class="flow-step active"><span>2</span><div><b>Input ${esc(currentPeriod)}</b><small>Complete the current monthly values.</small></div></div><div class="flow-line"></div><div class="flow-step"><span>3</span><div><b>Summary & submit</b><small>Review before submission.</small></div></div></div>
  <div class="flow-section-head"><div><div class="eyebrow">Step 2 · Current report</div><h3>${esc(p.desc)}</h3><p>${fields.length} active metrics · Project PIC can enter values only.</p></div></div>
  <div class="formgrid">${fields.map(x=>`<div class="field"><label>${esc(x.name)}${x.required?' <span class="required">*</span>':''}</label><div class="inputwrap"><input value="${esc(x.value)}"><span class="unit">${esc(x.unit)}</span></div></div>`).join('')}</div>
  <div class="formfooter"><button class="secondary" onclick="dataFlowStep['${esc(project)}']='previous';openData('${esc(project)}')">← Previous</button><button class="secondary" onclick="showToast('Draft saved')">Save draft</button><button class="primary" onclick="openSummary('${esc(project)}')">Review summary →</button></div></section>`;
}
function openSummary(project){dataFlowStep[project]='summary';openData(project)}
function dataSummaryStep(project){
 const p=projectByName(project),fields=metricSets[project]||[];
 return `<div class="head"><div><div class="eyebrow">${esc(project)} · ${esc(currentPeriod)}</div><h2>Review & submit</h2><p>Check the summary before submitting the monthly report.</p></div>${badge('Ready to submit','green')}</div>
 <section class="card flow-card"><div class="flow-stepper"><div class="flow-step done"><span>✓</span><div><b>Review previous data</b><small>${esc(previousPeriod(currentPeriod))} checked</small></div></div><div class="flow-line done"></div><div class="flow-step done"><span>✓</span><div><b>Input ${esc(currentPeriod)}</b><small>Monthly values completed</small></div></div><div class="flow-line done"></div><div class="flow-step active"><span>3</span><div><b>Summary & submit</b><small>Final check before submission.</small></div></div></div>
 <div class="flow-section-head"><div><div class="eyebrow">Step 3 · Summary</div><h3>${esc(currentPeriod)} report summary</h3><p>Review the values below. Once submitted, the report moves to the review stage.</p></div></div>
 <div class="summary-grid">${fields.map(m=>`<div class="summary-item"><span>${esc(m.name)}</span><b>${formatValue(m)}</b></div>`).join('')}</div>
 <div class="flow-callout"><span class="callout-icon">✓</span><div><b>Ready to submit</b><small>After submission, the Project PIC can review the generated report and the Monthly Report PIC can continue the reporting workflow.</small></div></div>
 <div class="formfooter"><button class="secondary" onclick="dataFlowStep['${esc(project)}']='input';openData('${esc(project)}')">← Edit data</button><button class="primary" onclick="submitProjectData('${esc(project)}')">Submit ${esc(currentPeriod)} data</button></div></section>`;
}
function submitProjectData(project){dataFlowStep[project]='';const p=projectByName(project);p.status='In Review';p.progress=78;p.color='blue';logActivity({actor:demoRole==='Project PIC'?'Nadia Pratama':'Amalia',role:demoRole,project,period:currentPeriod,category:'Submission',action:'Submitted monthly data',detail:`${(metricSets[project]||[]).length} metrics completed`});closeModal();show('data');showToast(`${project} data submitted for ${currentPeriod}.`);}
function showToast(message){const existing=document.getElementById('toast');existing?.remove();const el=document.createElement('div');el.id='toast';el.className='toast';el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.classList.add('show'),10);setTimeout(()=>el.remove(),2800);}



function logActivity({actor,role,project,period=currentPeriod,category,action,detail='',change=''}){
  activityLog.unshift({date:'Sep 16, 2026',time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),actor,role,project,period,category,action,detail,change});
}
function activityBadge(category){
  const map={Data:'blue',Submission:'green',Report:'purple',Review:'amber',Workflow:'gray',Structure:'blue',Template:'purple',Access:'red'};
  return badge(category,map[category]||'gray');
}
function activityLogPage(){
  const assigned=demoRole==='Project PIC'?['MTF Mobile']:projects.map(p=>p.name);
  const rows=activityLog.filter(x=>assigned.includes(x.project));
  const projectsOptions=assigned.map(n=>`<option>${esc(n)}</option>`).join('');
  return `<div class="head"><div><div class="eyebrow">System history</div><h2>Activity Log</h2><p>Trace who changed what, when it happened, and which reporting period was affected.</p></div><span class="status ${demoRole==='Monthly Report PIC'?'blue':'gray'}">${demoRole==='Monthly Report PIC'?'All project activity':'Assigned project activity'}</span></div>
  <section class="card audit-toolbar"><div class="audit-filters"><label>Project<select id="activity-project-filter" onchange="renderActivityLog()"><option value="all">All projects</option>${projectsOptions}</select></label><label>Activity<select id="activity-category-filter" onchange="renderActivityLog()"><option value="all">All activities</option><option>Data</option><option>Submission</option><option>Report</option><option>Review</option><option>Workflow</option><option>Structure</option><option>Template</option></select></label><label>Period<select id="activity-period-filter" onchange="renderActivityLog()"><option value="all">All periods</option><option>September 2026</option><option>August 2026</option><option>July 2026</option></select></label><div class="audit-search"><span>⌕</span><input id="activity-search" oninput="renderActivityLog()" placeholder="Search activity..." /></div></div></section>
  <section class="card audit-card"><div class="audit-head"><div><div class="ctitle">Activity history</div><div class="csub">A complete audit trail for reporting activity within your access scope.</div></div><span class="audit-count" id="activity-count">${rows.length} activities</span></div><div id="activity-list"></div></section>`;
}
function filteredActivities(){
  const assigned=demoRole==='Project PIC'?['MTF Mobile']:projects.map(p=>p.name);
  const pf=document.getElementById('activity-project-filter')?.value||'all';
  const cf=document.getElementById('activity-category-filter')?.value||'all';
  const rf=document.getElementById('activity-period-filter')?.value||'all';
  const q=(document.getElementById('activity-search')?.value||'').toLowerCase();
  return activityLog.filter(x=>assigned.includes(x.project)&& (pf==='all'||x.project===pf) && (cf==='all'||x.category===cf) && (rf==='all'||x.period===rf) && (!q||`${x.actor} ${x.action} ${x.detail} ${x.project} ${x.period} ${x.change}`.toLowerCase().includes(q)));
}
function renderActivityLog(){
  const list=document.getElementById('activity-list'); if(!list)return;
  const rows=filteredActivities(); const count=document.getElementById('activity-count'); if(count)count.textContent=`${rows.length} activit${rows.length===1?'y':'ies'}`;
  if(!rows.length){list.innerHTML=`<div class="audit-empty"><b>No activity found</b><span>Try changing the filters or search term.</span></div>`;return;}
  let lastDate='';
  list.innerHTML=rows.map((x,i)=>{const day=x.date!==lastDate;lastDate=x.date;return `${day?`<div class="audit-day">${esc(x.date)}</div>`:''}<button class="audit-row" onclick="openActivityDetail(${activityLog.indexOf(x)})"><div class="audit-time">${esc(x.time)}</div><div class="audit-avatar">${esc(x.actor.split(' ').map(n=>n[0]).slice(0,2).join(''))}</div><div class="audit-main"><div><b>${esc(x.actor)}</b><span>${esc(x.role)}</span></div><strong>${esc(x.action)}</strong><small>${esc(x.project)} · ${esc(x.period)}${x.detail?' · '+esc(x.detail):''}</small></div><div class="audit-side">${activityBadge(x.category)}${x.change?`<small>${esc(x.change)}</small>`:''}<span class="audit-chevron">›</span></div></button>`}).join('');
}
function openActivityDetail(index){
  const x=activityLog[index]; if(!x)return;
  openModal(`<div class="modal-head"><div><div class="eyebrow">Activity detail · ${esc(x.category)}</div><h3>${esc(x.action)}</h3><p>Recorded automatically as part of the reporting workflow.</p></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="audit-detail"><div><span>Performed by</span><b>${esc(x.actor)}</b><small>${esc(x.role)}</small></div><div><span>Date & time</span><b>${esc(x.date)} · ${esc(x.time)}</b></div><div><span>Project</span><b>${esc(x.project)}</b></div><div><span>Reporting period</span><b>${esc(x.period)}</b></div><div><span>Activity</span><b>${esc(x.action)}</b></div><div><span>Detail</span><b>${esc(x.detail||'—')}</b></div>${x.change?`<div class="audit-change"><span>Change</span><b>${esc(x.change)}</b></div>`:''}</div><div class="modal-actions"><button class="primary" onclick="closeModal()">Close</button></div>`);
}

function metrics(project){
 const fields=metricSets[project];
 return `<div class="head"><div><div class="eyebrow">${project} · Report configuration</div><h2>Manage structure</h2><p>Configure the data fields used to generate this project's report.</p></div><button class="primary" onclick="addMetric('${project}')">＋ Add metric</button></div>
 <section class="card"><div class="cardhead"><div><div class="ctitle">Data collection fields</div><div class="csub">Only Monthly Report PIC can change the project form structure.</div></div>${badge(fields.length+' active metrics','green')}</div>
 <div class="metric-list">${fields.map((x,i)=>`<div class="metric-row"><div class="metric-index">${String(i+1).padStart(2,'0')}</div><div class="metric-info"><b>${esc(x.name)}</b><small>${esc(x.type)} · ${esc(x.unit)} · ${x.required?'Required':'Optional'}</small></div><span class="metric-state">Active</span><button class="iconbtn" title="Edit or remove metric" onclick="metricMenu('${project}',${i})">⋮</button></div>`).join('')}</div></section>
 <section class="card visual-config"><div class="cardhead"><div><div class="ctitle">Report template</div><div class="csub">Chart types, background, colors, and typography are managed in Templates.</div></div>${badge(templates.length+' templates','blue')}</div><div class="template-routing"><div><b>${esc(activeTemplateName)}</b><span>Active presentation template</span></div><button class="secondary" onclick="show('templates')">Manage templates</button></div><div class="visual-add"><button class="secondary" onclick="generateReport('${project}')">Preview generated report</button></div></section>
 <section class="card config-info"><div class="ctitle">How changes work</div><div class="config-points"><div><b>Structure only</b><span>Changing a field definition does not overwrite submitted values.</span></div><div><b>Future-proof</b><span>Projects can add or deactivate variables as reporting requirements change.</span></div><div><b>Auto-generated</b><span>KPI cards and chart blocks reflow to fit the active project structure.</span></div></div></section>
 <section class="card activity"><div class="ctitle">Recent changes</div><div class="activity-list"><div><b>Sep 15, 2026 · Amalia</b><span>Updated metric configuration</span></div><div><b>Sep 12, 2026 · Amalia</b><span>Changed User Active to required</span></div><div><b>Aug 28, 2026 · Amalia</b><span>Deactivated an unused metric</span></div></div></section>`
}
function openModal(html){
  closeModal();
  const wrap=document.createElement('div');
  wrap.id='modal-root';
  wrap.innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  document.body.appendChild(wrap);
}
function closeModal(){document.getElementById('modal-root')?.remove(); modalState={type:null,project:null,index:null};}

function metricForm(project,index=null){
  const edit=index!==null, m=edit?metricSets[project][index]:{name:'',type:'Number',unit:'VALUE',required:true};
  modalState={type:'metric',project,index};
  openModal(`<div class="modal-head"><div><div class="eyebrow">${edit?'Edit metric':'Add metric'} · ${esc(project)}</div><h3>${edit?'Edit metric':'Add metric'}</h3><p>Manage the field structure only. Submitted values are not changed here.</p></div><button class="modal-close" onclick="closeModal()">×</button></div>
  <form class="modal-form" onsubmit="saveMetric(event)">
    <div class="modal-field full"><label>Metric name</label><input id="metric-name" value="${esc(m.name)}" placeholder="e.g. Total Registered User" required></div>
    <div class="modal-field"><label>Field type</label><select id="metric-type"><option ${m.type==='Number'?'selected':''}>Number</option><option ${m.type==='Percentage'?'selected':''}>Percentage</option><option ${m.type==='Decimal'?'selected':''}>Decimal</option></select></div>
    <div class="modal-field"><label>Unit</label><input id="metric-unit" value="${esc(m.unit)}" placeholder="IDR, USERS, %, CASES"></div>
    <label class="check-field"><input id="metric-required" type="checkbox" ${m.required?'checked':''}><span><b>Required field</b><small>Project PIC must provide a value before submission.</small></span></label>
    <div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button>${edit?`<button type="button" class="danger-outline" onclick="deactivateMetricFromModal()">Deactivate</button>`:''}<button class="primary" type="submit">${edit?'Save changes':'Add metric'}</button></div>
  </form>`);
}
function saveMetric(e){
  e.preventDefault(); const {project,index}=modalState;
  const data={name:document.getElementById('metric-name').value.trim(),type:document.getElementById('metric-type').value,unit:document.getElementById('metric-unit').value.trim()||'VALUE',required:document.getElementById('metric-required').checked};
  if(!data.name)return;
  if(index===null){ metricSets[project].push({...data,value:''}); logActivity({actor:'Amalia',role:'Monthly Report PIC',project,period:currentPeriod,category:'Structure',action:'Added metric',detail:data.name,change:'New metric'}); } else { const old=metricSets[project][index]; metricSets[project][index]={...old,...data}; logActivity({actor:'Amalia',role:'Monthly Report PIC',project,period:currentPeriod,category:'Structure',action:'Edited metric',detail:data.name,change:`${old.name} configuration updated`}); }
  closeModal(); openMetrics(project);
}
function deactivateMetricFromModal(){
  const {project,index}=modalState; if(index===null)return;
  if(confirm('Deactivate this metric? It will no longer appear in the active collection structure, while historical report structures remain unchanged.')){const m=metricSets[project][index];metricSets[project].splice(index,1);logActivity({actor:'Amalia',role:'Monthly Report PIC',project,period:currentPeriod,category:'Structure',action:'Deactivated metric',detail:m.name,change:'Active → Inactive'});closeModal();openMetrics(project);}
}
function addMetric(project){metricForm(project);}
function editMetric(project,i){metricForm(project,i);}
function metricMenu(project,i){
  const m=metricSets[project][i];
  openModal(`<div class="modal-head"><div><div class="eyebrow">Metric actions · ${esc(project)}</div><h3>${esc(m.name)}</h3><p>Choose what you want to do with this metric structure.</p></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="action-list"><button class="action-row" onclick="closeModal();editMetric('${esc(project)}',${i})"><span class="action-icon">✎</span><span><b>Edit metric</b><small>Change name, field type, unit, or required state.</small></span><span>›</span></button><button class="action-row danger-row" onclick="deactivateMetricFromAction('${esc(project)}',${i})"><span class="action-icon">−</span><span><b>Deactivate metric</b><small>Remove it from the active structure without deleting historical reports.</small></span><span>›</span></button></div>`);
}
function deactivateMetricFromAction(project,i){
  if(confirm('Deactivate this metric? Historical report snapshots will remain unchanged.')){const m=metricSets[project][i];metricSets[project].splice(i,1);logActivity({actor:'Amalia',role:'Monthly Report PIC',project,period:currentPeriod,category:'Structure',action:'Deactivated metric',detail:m.name,change:'Active → Inactive'});closeModal();openMetrics(project);}
}

function visualForm(project,index=null){
  const edit=index!==null, v=edit?reportVisuals[project][index]:{type:'bar',title:'New chart',description:'',metrics:[]};
  modalState={type:'visual',project,index};
  const names=metricSets[project].map(m=>m.name);
  openModal(`<div class="modal-head"><div><div class="eyebrow">${edit?'Edit visual':'Add visual'} · ${esc(project)}</div><h3>${edit?'Edit chart block':'Add chart block'}</h3><p>Configure presentation rules. Data values remain in Data Collection.</p></div><button class="modal-close" onclick="closeModal()">×</button></div>
  <form class="modal-form" onsubmit="saveVisual(event)">
    <div class="modal-field full"><label>Chart title</label><input id="visual-title" value="${esc(v.title)}" placeholder="e.g. Payment volume by month" required></div>
    <div class="modal-field full"><label>Description</label><input id="visual-desc" value="${esc(v.description||'')}" placeholder="Short description for the infographic"></div>
    <div class="modal-field"><label>Chart type</label><select id="visual-type"><option value="bar" ${v.type==='bar'?'selected':''}>Bar chart</option><option value="pie" ${v.type==='pie'?'selected':''}>Pie chart</option><option value="stacked" ${v.type==='stacked'?'selected':''}>Stacked bar chart</option></select></div>
    <div class="modal-field full"><label>Metrics used</label><div class="metric-picker">${names.map((n,i)=>`<label><input type="checkbox" name="visual-metric" value="${esc(n)}" ${(v.metrics||[]).includes(n)?'checked':''}><span>${esc(n)}</span></label>`).join('')}</div></div>
    <div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button>${edit?`<button type="button" class="danger-outline" onclick="deactivateVisualFromModal()">Deactivate</button>`:''}<button class="primary" type="submit">${edit?'Save changes':'Add chart'}</button></div>
  </form>`);
}
function saveVisual(e){
  e.preventDefault(); const {project,index}=modalState;
  const selected=[...document.querySelectorAll('input[name="visual-metric"]:checked')].map(x=>x.value);
  const v={type:document.getElementById('visual-type').value,title:document.getElementById('visual-title').value.trim(),description:document.getElementById('visual-desc').value.trim()||'Generated from the selected project metrics.',metrics:selected};
  if(index===null)reportVisuals[project].push(v); else reportVisuals[project][index]={...reportVisuals[project][index],...v};
  closeModal();openMetrics(project);
}
function addVisual(project){visualForm(project);}
function editVisual(project,i){visualForm(project,i);}
function deactivateVisualFromModal(){const {project,index}=modalState;if(index===null)return;if(confirm('Deactivate this chart block?')){reportVisuals[project].splice(index,1);closeModal();openMetrics(project);}}
function visualMenu(project,i){
  const v=reportVisuals[project][i];
  openModal(`<div class="modal-head"><div><div class="eyebrow">Chart actions · ${esc(project)}</div><h3>${esc(v.title)}</h3><p>${v.type==='stacked'?'Stacked bar chart':v.type==='pie'?'Pie chart':'Bar chart'} · ${v.metrics.length} metrics</p></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="action-list"><button class="action-row" onclick="closeModal();editVisual('${esc(project)}',${i})"><span class="action-icon">✎</span><span><b>Edit chart</b><small>Change chart type, title, description, and metrics.</small></span><span>›</span></button><button class="action-row danger-row" onclick="deactivateVisual('${esc(project)}',${i})"><span class="action-icon">−</span><span><b>Deactivate chart</b><small>Remove this visual from future generated reports.</small></span><span>›</span></button></div>`);
}
function deactivateVisual(project,i){if(confirm('Deactivate this chart block?')){reportVisuals[project].splice(i,1);closeModal();openMetrics(project);}}

function templateForm(index=null){
  const edit=index!==null, t=edit?templates[index]:{name:'',status:'Available',background:'',backgroundColor:'#ffffff',accentColor:'#315efb',fontSize:12,charts:{bar:true,pie:true,stacked:true}};
  modalState={type:'template',index};
  openModal(`<div class="modal-head"><div><div class="eyebrow">${edit?'Edit template':'New template'}</div><h3>${edit?'Edit report template':'Create report template'}</h3><p>Only Monthly Report PIC can create or change presentation templates.</p></div><button class="modal-close" onclick="closeModal()">×</button></div>
  <form class="modal-form" onsubmit="saveTemplate(event)">
    <div class="modal-field full"><label>Template name</label><input id="template-name" value="${esc(t.name)}" placeholder="e.g. October Executive Report" required></div>
    <div class="modal-field full"><label>Infographic background</label><div class="upload-box"><input id="template-bg" type="file" accept="image/png,image/jpeg,image/webp"><div><b>${t.background?'Background image uploaded':'Upload background image'}</b><small>PNG, JPG, or WebP. The image becomes the report canvas background.</small></div></div>${t.background?'<div class="upload-preview"><img src="'+t.background+'" alt="Current template background"><button type="button" class="text-btn" onclick="clearTemplateBackground()">Remove background</button></div>':''}</div>
    <div class="modal-field"><label>Background color</label><div class="color-control"><input id="template-bg-color" type="color" value="${t.backgroundColor}"><input id="template-bg-color-text" value="${t.backgroundColor}" pattern="^#[0-9A-Fa-f]{6}$"></div></div>
    <div class="modal-field"><label>Accent color</label><div class="color-control"><input id="template-accent" type="color" value="${t.accentColor}"><input id="template-accent-text" value="${t.accentColor}" pattern="^#[0-9A-Fa-f]{6}$"></div></div>
    <div class="modal-field"><label>Base font size</label><select id="template-font"><option value="11" ${t.fontSize==11?'selected':''}>Small · 11px</option><option value="12" ${t.fontSize==12?'selected':''}>Default · 12px</option><option value="13" ${t.fontSize==13?'selected':''}>Large · 13px</option><option value="14" ${t.fontSize==14?'selected':''}>Extra large · 14px</option></select></div>
    <div class="modal-field full"><label>Chart types available in this template</label><div class="chart-checks"><label><input id="chart-bar" type="checkbox" ${t.charts.bar?'checked':''}><span><b>Bar chart</b><small>Category comparison</small></span></label><label><input id="chart-pie" type="checkbox" ${t.charts.pie?'checked':''}><span><b>Pie chart</b><small>Part-to-whole</small></span></label><label><input id="chart-stacked" type="checkbox" ${t.charts.stacked?'checked':''}><span><b>Stacked bar</b><small>Composition across periods</small></span></label></div></div>
    <div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button>${edit?`<button type="button" class="danger-outline" onclick="deleteTemplate(${index})">Delete</button>`:''}<button class="primary" type="submit">${edit?'Save changes':'Create template'}</button></div>
  </form>`);
  const bg=document.getElementById('template-bg'); if(bg)bg.addEventListener('change',handleTemplateBackground);
  syncColorPair('template-bg-color','template-bg-color-text');syncColorPair('template-accent','template-accent-text');
}
function syncColorPair(colorId,textId){const c=document.getElementById(colorId),t=document.getElementById(textId);if(!c||!t)return;c.oninput=()=>t.value=c.value;t.oninput=()=>{if(/^#[0-9A-Fa-f]{6}$/.test(t.value))c.value=t.value;};}
function handleTemplateBackground(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const existing=modalState.index!==null?templates[modalState.index]:null;window.__templateBackground=reader.result;const box=e.target.parentElement.querySelector('b');if(box)box.textContent=file.name;};reader.readAsDataURL(file);}
function clearTemplateBackground(){window.__templateBackground='';templateForm(modalState.index);}
function saveTemplate(e){
  e.preventDefault(); const index=modalState.index;
  const name=document.getElementById('template-name').value.trim();if(!name)return;
  const bg=document.getElementById('template-bg');
  const current=index!==null?templates[index]:null;
  const t={name,status:index!==null?current.status:'Available',background:window.__templateBackground!==undefined?window.__templateBackground:(current?.background||''),backgroundColor:document.getElementById('template-bg-color-text').value,accentColor:document.getElementById('template-accent-text').value,fontSize:Number(document.getElementById('template-font').value),charts:{bar:document.getElementById('chart-bar').checked,pie:document.getElementById('chart-pie').checked,stacked:document.getElementById('chart-stacked').checked}};
  if(index===null)templates.push(t);else {const wasActive=current?.name===activeTemplateName;templates[index]=t;if(wasActive)activeTemplateName=t.name;}
  window.__templateBackground=undefined;closeModal();show('templates');
}
function editTemplate(i){window.__templateBackground=templates[i].background||'';templateForm(i);}
function addTemplate(){window.__templateBackground='';templateForm();}
function deleteTemplate(i){if(templates.length===1)return;if(confirm('Delete this report template?')){if(activeTemplateName===templates[i].name)activeTemplateName=templates[0].name;templates.splice(i,1);closeModal();show('templates');}}
function useTemplate(i){activeTemplateName=templates[i].name;templates.forEach((t,n)=>t.status=n===i?'Active':'Available');show('templates');}

function openMetrics(project){title.textContent='Manage Structure';content.innerHTML=metrics(project);setActive('data')}


function formatValue(m){
  const n=Number(m.value);
  if(Number.isNaN(n)) return m.value;
  if(m.unit==='IDR'){
    if(n>=1e12) return 'IDR '+(n/1e12).toFixed(1)+'T';
    if(n>=1e9) return 'IDR '+(n/1e9).toFixed(1)+'B';
    if(n>=1e6) return 'IDR '+(n/1e6).toFixed(1)+'M';
    return 'IDR '+n.toLocaleString('en-US');
  }
  if(m.unit==='%') return n.toLocaleString('en-US',{maximumFractionDigits:1})+'%';
  return n.toLocaleString('en-US',{maximumFractionDigits:1})+(m.unit&&m.unit!=='VALUE'?' '+m.unit:'');
}


function reportMetricCards(fields,project,month=currentPeriod){
  return fields.map((m,i)=>reportMetricCard(m,project,i,month)).join('');
}
function reportMetricCard(m,project,index,month=currentPeriod){
  const series=monthlyReportData[project]?.[m.name] || recapMonths.map(()=>Number(m.value)||0);
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const selectedMonthIndex=Math.max(0,monthNames.findIndex(x=>month.startsWith(x)));
  const isYtd=/\(YTD\)/i.test(m.name);
  if(isYtd){
    const years=['2023','2024','2025','2026'];
    const currentYtd=(monthlyReportData[project]?.['Jumlah Transaksi (MTD)']||[]).slice(0,selectedMonthIndex+1).reduce((a,b)=>a+(Number(b)||0),0);
    const vals=project==='MTF Mobile'?[77590000000,369100000000,1060000000000,currentYtd||Number(m.value)||0]:(series.length===4?series:[0,0,0,Number(m.value)||0]);
    const chartId=`report-chart-${project.replace(/[^a-z0-9]+/gi,'-')}-${index}-${Date.now()}`;
    return `<article class="infographic-card ytd-card"><div class="info-card-title">${esc(m.name)}</div><div class="info-card-total">${formatValue(m)}</div><div class="report-mini-chart"><canvas id="${chartId}" data-chart-kind="ytd" data-project="${esc(project)}" data-metric="${esc(m.name)}" data-values="${esc(JSON.stringify(vals))}" data-labels="${esc(JSON.stringify(years))}" data-unit="${esc(m.unit||'VALUE')}"></canvas></div></article>`;
  }
  const vals=series.slice(0,Math.min(9,selectedMonthIndex+1));
  const labels=recapMonthLabels.slice(0,vals.length);
  const chartId=`report-chart-${project.replace(/[^a-z0-9]+/gi,'-')}-${index}-${Date.now()}`;
  return `<article class="infographic-card"><div class="info-card-title">${esc(m.name)}</div><div class="info-card-total">${formatValue(m)}</div><div class="report-mini-chart"><canvas id="${chartId}" data-chart-kind="monthly" data-project="${esc(project)}" data-metric="${esc(m.name)}" data-values="${esc(JSON.stringify(vals))}" data-labels="${esc(JSON.stringify(labels))}" data-unit="${esc(m.unit||'VALUE')}"></canvas></div></article>`;
}
function formatMiniValue(n,unit){
  const v=Number(n)||0;
  if(unit==='IDR'){
    if(v>=1e12)return (v/1e12).toFixed(1)+' T';
    if(v>=1e9)return (v/1e9).toFixed(1)+' B';
    if(v>=1e6)return (v/1e6).toFixed(1)+' M';
    if(v>=1e3)return (v/1e3).toFixed(1)+' K';
    return v.toLocaleString('en-US');
  }
  if(unit==='%')return v.toFixed(1)+'%';
  if(unit==='USERS')return Math.round(v).toLocaleString('en-US');
  return v>=1000?(v/1000).toFixed(1)+'K':v.toLocaleString('en-US');
}
function reportDensity(fields){return fields.length<=4?'compact':fields.length<=7?'standard':'dense'}
function initReportMiniCharts(){
  if(typeof Chart==='undefined')return;
  if(!window.__reportflowCharts)window.__reportflowCharts={};
  if(window.ChartDataLabels)Chart.register(ChartDataLabels);
  document.querySelectorAll('.report-mini-chart canvas').forEach((canvas,i)=>{
    if(window.__reportflowCharts[`mini${i}`])return;
    let values=[],labels=[];
    try{values=JSON.parse(canvas.dataset.values||'[]');labels=JSON.parse(canvas.dataset.labels||'[]')}catch(e){return;}
    const project=canvas.dataset.project||'';
    const unit=canvas.dataset.unit||'VALUE';
    const currentIndex=values.length-1;
    window.__reportflowCharts[`mini${i}`]=new Chart(canvas,{type:'bar',data:{labels,datasets:[{data:values,backgroundColor:values.map((_,idx)=>idx===currentIndex?'#315efb':'#d8e4ff'),borderRadius:5,borderSkipped:false,maxBarThickness:20}]},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>formatMiniValue(ctx.raw,unit)}},datalabels:{display:true,anchor:'end',align:'top',offset:1,color:'#7c838c',font:{family:'Inter, Arial, sans-serif',size:7,weight:600},formatter:v=>formatMiniValue(v,unit)}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Inter, Arial, sans-serif',size:7},color:'#9aa0a7',padding:2}},y:{display:false,beginAtZero:true,grid:{display:false},border:{display:false}}}}});
  });
}
function metricMap(project){return Object.fromEntries((metricSets[project]||[]).map(m=>[m.name,m]));}
function metricValue(project,name){const m=metricMap(project)[name];return m?Number(m.value)||0:0;}
function shortNumber(n){
  if(Math.abs(n)>=1e12)return (n/1e12).toFixed(1)+'T';
  if(Math.abs(n)>=1e9)return (n/1e9).toFixed(1)+'B';
  if(Math.abs(n)>=1e6)return (n/1e6).toFixed(1)+'M';
  if(Math.abs(n)>=1e3)return (n/1e3).toFixed(1)+'K';
  return n.toLocaleString('en-US');
}
function reportPreview(project, month=currentPeriod){
  const fields=metricSets[project]||[];
  const p=projectByName(project);
  const template=templates.find(t=>t.name===activeTemplateName)||templates[0];
  const bgStyle=template.background?`background-image:url('${esc(template.background)}');background-size:cover;background-position:center;`:`background:linear-gradient(135deg,#bfe8f5 0%,#e9f1ef 52%,#fae4c7 100%);`;
  const visibleFields=fields;
  return `<div class="manual-infographic" style="--report-accent:${esc(template.accentColor)};--report-font:${template.fontSize}px;--report-bg:${esc(template.backgroundColor)};${bgStyle}">
    <section class="infographic-hero">
      <div class="hero-brand"><b>mandiri</b><span>tunas finance</span></div>
      <div class="hero-copy"><div class="hero-kicker">PAYMENT REPORT</div><h3>${esc(project)}</h3><span class="period-pill">Per ${esc(month)}</span></div>
      <div class="hero-device" aria-hidden="true"><div class="phone"><div class="phone-notch"></div><div class="phone-screen"><b>MTF</b><em>mobile</em></div></div></div>
    </section>
    <section class="infographic-body">
      <div class="infographic-intro"><span>Digital Transformation</span><h2>Monthly Report Infographics</h2></div>
      <div class="infographic-controls"><select><option>${esc(project)}</option></select><div class="month-tabs"><button class="${month==='July 2026'?'active':''}">Juli</button><button class="${month==='August 2026'?'active':''}">Agustus</button><button class="${month==='September 2026'?'active':''}">September</button></div><button class="filter-pill">☷ &nbsp; Filters</button></div>
      <div class="infographic-grid">${reportMetricCards(visibleFields,project,month)}</div>
    </section>
    <footer class="infographic-footer"><span>© 2026 · Digital Transformation</span><span>ReportFlow</span></footer>
  </div>`;
}
function generateReport(project){
 logActivity({actor:'Amalia',role:'Monthly Report PIC',project,period:currentPeriod,category:'Report',action:'Generated report',detail:activeTemplateName});
 title.textContent='Generated Report';
 const template=templates.find(t=>t.name===activeTemplateName)||templates[0];
 content.innerHTML=`<div class="head"><div><div class="eyebrow">${project} · ${currentPeriod}</div><h2>Generated report</h2><p>Monthly input is consolidated with the available history to generate the infographic.</p></div><div class="report-actions"><button class="secondary" onclick="openData('${project}')">Back to data</button><button class="secondary" onclick="openTemplateFromReport()">Edit template</button><button class="primary" onclick="alert('Report exported successfully')">Export report</button></div></div>
 <section class="card generated-card"><div class="generated-toolbar"><div><div class="ctitle">Infographic preview</div><div class="csub">${esc(template.name)} · ${currentPeriod} with monthly recap history</div></div>${badge('Generated','green')}</div><div class="generated-preview infographic-preview-wrap">${reportPreview(project)}</div></section>`;
 setActive('reports');refreshIcons();requestAnimationFrame(()=>initReportMiniCharts());
}
function openTemplateFromReport(){const i=templates.findIndex(t=>t.name===activeTemplateName);if(i>=0)editTemplate(i);}

function openHistory(month,project='MTF Mobile'){
 title.textContent='Monthly Report';
 content.innerHTML=`<div class="head"><div><div class="eyebrow">Report archive · ${month}</div><h2>${month} report</h2><p>Historical report snapshot. Its metric structure is preserved from that reporting cycle.</p></div><button class="secondary" onclick="show('reports')">← Back to history</button></div><section class="card generated-card"><div class="generated-toolbar"><div><div class="ctitle">${project} · Payment report</div><div class="csub">Historical snapshot · structure is read-only</div></div>${badge('Approved','green')}</div><div class="generated-preview">${reportPreview(project,month)}</div></section>`;
 setActive('reports');
}

function review(){return `<div class="head"><div><div class="eyebrow">MTF Mobile · ${currentPeriod}</div><h2>Review & approval</h2><p>Review the generated report before final submission.</p></div>${badge('In Review','blue')}</div><div class="review"><section class="card"><div class="cardhead"><div><div class="eyebrow">PAYMENT REPORT</div><div class="ctitle" style="font-size:21px">MTF Mobile</div><div class="csub">${currentPeriod}</div></div><div class="csub">Generated<br><b style="color:#17191e">14 Sep 2026</b></div></div><div class="preview">${reportPreview('MTF Mobile')}</div></section><aside><section class="card"><div class="ctitle">Review checklist</div><div class="checklist">${['Data accuracy','Metric labels','Infographic layout','Month & period'].map(x=>`<div class="check"><span>${x}</span><em>✓</em></div>`).join('')}</div></section><section class="card" style="margin-top:14px"><div class="ctitle">Approval</div><div class="csub">Final review by Monthly Report PIC.</div><div class="actions"><button class="primary" onclick="alert('Report approved')">Approve report</button><button class="secondary">Request revision</button></div></section></aside></div>`}

function openNewCycle(){
  const next = nextMonthLabel(currentPeriod);
  openModal(`<div class="modal-head"><div><div class="eyebrow">Reporting cycle</div><h3>Create new reporting cycle</h3><p>Start a new reporting period. Existing reports remain unchanged.</p></div><button class="modal-close" onclick="closeModal()">×</button></div>
  <form class="modal-form" onsubmit="saveCycle(event)">
    <div class="modal-field full"><label>Reporting period</label><select id="cycle-period"><option>${esc(next)}</option><option>${esc(currentPeriod)}</option></select></div>
    <div class="modal-field full"><label>Projects included</label><div class="metric-picker cycle-projects">${projects.map(p=>`<label><input type="checkbox" name="cycle-project" value="${esc(p.name)}" checked><span>${esc(p.name)}<small>PIC · ${esc(p.pic)}</small></span></label>`).join('')}</div></div>
    <div class="modal-field full"><label>Metric structure</label><div class="structure-note"><b>Use each project's current active structure</b><small>New cycles read the latest metric configuration. Previous reporting periods keep their historical structure.</small></div></div>
    <div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary" type="submit">Create reporting cycle</button></div>
  </form>`);
}
function nextMonthLabel(period){const [m,y]=period.split(' ');const names=['January','February','March','April','May','June','July','August','September','October','November','December'];let i=names.indexOf(m);let year=Number(y);i++;if(i===12){i=0;year++;}return `${names[i]} ${year}`;}
function saveCycle(e){
  e.preventDefault();
  const period=document.getElementById('cycle-period').value;
  const selected=[...document.querySelectorAll('input[name="cycle-project"]:checked')].map(x=>x.value);
  if(!selected.length){alert('Select at least one project.');return;}
  currentPeriod=period;
  history.unshift([period,`${selected.length} projects`,'0 submitted','Draft','gray','0%', 'Created just now']);
  projects.forEach(p=>{if(selected.includes(p.name)){p.status='Waiting Data';p.progress=0;p.color='amber';}});
  const periodSelect=document.getElementById('period-select');if(periodSelect){if(![...periodSelect.options].some(o=>o.value===currentPeriod)){periodSelect.add(new Option(currentPeriod,currentPeriod));}periodSelect.value=currentPeriod;}
  closeModal();show('dashboard');
}

function generic(page){
  const d={projects:['Projects','Project scope and PIC assignments.'],templates:['Templates','Presentation themes and infographic rules.'],users:['Users & Access','Role + project scope.']}[page];
  if(page==='projects')return `<div class="head"><div><h2>${d[0]}</h2><p>${d[1]}</p></div></div><div class="grid3">${projects.map(p=>`<div class="projectcard"><div class="projecticon">▦</div><b>${p.name}</b><p>PIC · ${p.pic}</p>${badge(p.status,p.color)}<button class="secondary fullbtn" onclick="openMetrics('${p.name}')">Manage structure</button></div>`).join('')}</div>`;
  if(page==='templates')return `<div class="head"><div><div class="eyebrow">Presentation library</div><h2>${d[0]}</h2><p>${d[1]}</p></div><button class="primary" onclick="addTemplate()">＋ New template</button></div><section class="collection-note"><div><b>Template controls the presentation layer.</b><span> Background, colors, typography, and chart types can be configured independently from project metrics.</span></div><span class="status blue">Monthly Report PIC only</span></section><div class="grid3">${templates.map((t,i)=>`<div class="template"><div class="template-thumb" style="background-color:${esc(t.backgroundColor)};${t.background?`background-image:url('${esc(t.background)}');background-size:cover;background-position:center;`:''}"><div class="template-overlay"><span style="background:${esc(t.accentColor)}"></span><span style="background:${esc(t.accentColor)}"></span><span style="background:${esc(t.accentColor)}"></span></div></div><div class="template-row"><div><b>${esc(t.name)}</b><p>${t.status==='Active'?'Active template':'Available template'}</p></div>${t.status==='Active'?badge('Active','green'):''}</div><div class="template-meta"><span>${t.fontSize}px base</span><span>${Object.values(t.charts).filter(Boolean).length} chart types</span></div><div class="template-actions"><button class="secondary" onclick="editTemplate(${i})">Edit</button>${t.status!=='Active'?`<button class="secondary" onclick="useTemplate(${i})">Use template</button>`:''}</div></div>`).join('')}</div>`;
  return `<div class="head"><div><h2>${d[0]}</h2><p>${d[1]}</p></div><button class="primary">＋ Add user</button></div><div class="users">${[['Amalia','Monthly Report PIC','All projects'],['Nadia Pratama','Project PIC','MTF Mobile'],['Raka Wijaya','Project PIC','1Access, RCDE']].map(u=>`<div class="user"><div><b>${u[0]}</b><small>${u[1]}</small></div><span class="status gray">${u[2]}</span></div>`).join('')}</div>`
}

function setActive(page){document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===page))}
const pages={dashboard:['Dashboard',dashboard],reports:['Monthly Reports',reports],data:['Data Collection',data],review:['Review & Approval',review],projects:['Projects',()=>generic('projects')],templates:['Templates',()=>generic('templates')],users:['Users & Access',()=>generic('users')],activity:['Activity Log',activityLogPage]};

function isAuthenticated(){return sessionStorage.getItem('reportflow_auth')==='1' || localStorage.getItem('reportflow_auth')==='1';}
function setAuthenticated(remember=true){if(remember)localStorage.setItem('reportflow_auth','1');else sessionStorage.setItem('reportflow_auth','1');document.getElementById('login-screen')?.remove();document.getElementById('app-shell')?.classList.add('authenticated');}
function showLoginMessage(message){const el=document.getElementById('login-message');if(el){el.textContent=message;setTimeout(()=>{if(el.textContent===message)el.textContent='';},3500);}}
function togglePassword(){const input=document.getElementById('login-password'),btn=document.querySelector('.password-wrap button');if(!input)return;const show=input.type==='password';input.type=show?'text':'password';if(btn)btn.textContent=show?'Hide':'Show';}
function demoSSO(){document.getElementById('login-email').value='amalia@company.com';document.getElementById('login-password').value='company';setAuthenticated(true);show('dashboard');}
function toggleDemoRole(){demoRole=demoRole==='Monthly Report PIC'?'Project PIC':'Monthly Report PIC';showToast(`Demo role switched to ${demoRole}`);show('dashboard');}
function toggleAccountMenu(){const menu=document.getElementById('account-menu'),trigger=document.querySelector('.account-trigger');if(!menu)return;const open=menu.classList.toggle('open');trigger?.setAttribute('aria-expanded',open?'true':'false');}
function signOut(){localStorage.removeItem('reportflow_auth');sessionStorage.removeItem('reportflow_auth');document.getElementById('app-shell')?.classList.remove('authenticated');document.getElementById('account-menu')?.classList.remove('open');location.reload();}
document.addEventListener('click',e=>{const account=e.target.closest('.account');if(!account)document.getElementById('account-menu')?.classList.remove('open');});

function show(p){title.textContent=pages[p][0];destroyCharts();content.innerHTML=pages[p][1]();setActive(p);refreshIcons();if(p==='activity')renderActivityLog();requestAnimationFrame(()=>{initDashboardCharts();initReportMiniCharts();refreshIcons();});}
document.querySelectorAll('.nav[data-page]').forEach(n=>n.onclick=()=>show(n.dataset.page));
document.getElementById('login-form')?.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('login-email').value.trim();const pass=document.getElementById('login-password').value.trim();if(!email||!pass){showLoginMessage('Enter your email and password to continue.');return;}setAuthenticated(document.getElementById('remember-login')?.checked!==false);show('dashboard');});
if(isAuthenticated()){document.getElementById('login-screen')?.remove();document.getElementById('app-shell')?.classList.add('authenticated');show('dashboard');}

function fi(name, attrs={}){
  try{
    const icon = window.feather && feather.icons && feather.icons[name];
    if(icon){
      return icon.toSvg({width:15,height:15,strokeWidth:1.8, ...attrs});
    }
  }catch(e){}
  const fallback={
    'chevron-down':'M6 9l6 6 6-6','chevron-left':'M15 18l-6-6 6-6','chevron-right':'M9 18l6-6-6-6',
    'x':'M18 6L6 18M6 6l12 12','check':'M20 6L9 17l-5-5','plus':'M12 5v14M5 12h14',
    'save':'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
    'edit-2':'M17 3a2.8 2.8 0 014 4L7 21l-4 1 1-4L17 3z','users':'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    'settings':'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.04 1.56V20h-2v-.5a1.7 1.7 0 00-1.04-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 009.4 15a1.7 1.7 0 00-1.56-1.04H7v-2h.84A1.7 1.7 0 009.4 10a1.7 1.7 0 00-.34-1.88L9 8.06l1.4-1.4.06.06a1.7 1.7 0 001.88.34A1.7 1.7 0 0013.38 5.5V5h2v.5a1.7 1.7 0 001.04 1.56 1.7 1.7 0 001.88-.34l.06-.06 1.4 1.4-.06.06A1.7 1.7 0 0019.4 10c.18.64.72 1.04 1.4 1.04h.7v2h-.7A1.7 1.7 0 0019.4 15z',
    'bell':'M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4','repeat':'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3','log-out':'M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 00-2-2h-6','layout-dashboard':'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z','file-text':'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h6','check-square':'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11','grid':'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z','layers':'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5','clock':'M12 8v4l3 2M12 22a10 10 0 100-20 10 10 0 000 20z','filter':'M22 3H2l8 9.46V19l4 2v-8.54L22 3z'
  };
  const d=fallback[name]||'';
  return d?`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"></path></svg>`:'';
}

function refreshIcons(){
  if(window.feather){
    try{feather.replace({width:15,height:15,strokeWidth:1.8});}catch(e){}
  }
}
function changePeriod(period){
  currentPeriod=period;
  const select=document.getElementById('period-select');
  if(select)select.value=period;
  show('dashboard');
}
/* v14 — sidebar collapse */
function toggleSidebar(){
  const sidebar=document.getElementById('sidebar');
  const main=document.querySelector('.main');
  const button=document.getElementById('sidebar-collapse');
  if(!sidebar||!main)return;
  const collapsed=sidebar.classList.toggle('collapsed');
  main.classList.toggle('collapsed',collapsed);
  button.innerHTML=collapsed?'<i data-feather="chevron-right"></i>':'<i data-feather="chevron-left"></i>';refreshIcons();
  button.setAttribute('aria-label',collapsed?'Expand sidebar':'Collapse sidebar');
  button.title=collapsed?'Expand sidebar':'Collapse sidebar';
  try{localStorage.setItem('reportflow-sidebar-collapsed',collapsed?'1':'0')}catch(e){}
}
(function(){
  try{
    if(localStorage.getItem('reportflow-sidebar-collapsed')==='1'){
      const sidebar=document.getElementById('sidebar');
      const main=document.querySelector('.main');
      const button=document.getElementById('sidebar-collapse');
      sidebar?.classList.add('collapsed');
      main?.classList.add('collapsed');
      if(button){button.innerHTML='<i data-feather="chevron-right"></i>';button.setAttribute('aria-label','Expand sidebar');button.title='Expand sidebar';}
    }
  }catch(e){}
})();

/* =========================
   v18 stable UI patch
   Built on v14 functionality; UI fixes are layered without replacing core flows.
   ========================= */

function formatChartValue(project,value){
  const n=Number(value)||0;
  if(project==='MTF Mobile'){
    if(n>=1e12)return 'IDR '+(n/1e12).toFixed(2)+'T';
    if(n>=1e9)return 'IDR '+(n/1e9).toFixed(1)+'B';
    if(n>=1e6)return 'IDR '+(n/1e6).toFixed(1)+'M';
    return 'IDR '+Math.round(n).toLocaleString('en-US');
  }
  if(n>=1000000)return (n/1e6).toFixed(1)+'M';
  if(n>=1000)return (n/1000).toFixed(1)+'K';
  return n.toLocaleString('en-US');
}

const rfBarLabelPlugin={
  id:'rfBarLabel',
  afterDatasetsDraw(chart,args,opts){
    const ds=chart.data.datasets?.[0]; if(!ds)return;
    const meta=chart.getDatasetMeta(0); const ctx=chart.ctx;
    ctx.save();
    ctx.font='600 10px Inter, Arial, sans-serif'; ctx.fillStyle='#66707a'; ctx.textAlign='center'; ctx.textBaseline='bottom';
    meta.data.forEach((bar,i)=>{ const v=ds.data[i]; if(v==null)return; ctx.fillText((opts?.formatter||String)(v),bar.x,bar.y-6); });
    ctx.restore();
  }
};

function initDashboardCharts(){
  if(typeof Chart==='undefined')return;
  const d=annualOverview[overviewProject];
  const annualCanvas=document.getElementById('annual-chart');
  const mixCanvas=document.getElementById('mix-chart');
  if(!window.__reportflowCharts)window.__reportflowCharts={};
  if(annualCanvas){
    window.__reportflowCharts.annual=new Chart(annualCanvas,{type:'bar',plugins:[rfBarLabelPlugin],data:{labels:d.months,datasets:[{label:'Reported value',data:d.volume,backgroundColor:d.volume.map((_,i)=>i===d.volume.length-1?'#315efb':'#dce5ff'),borderRadius:7,borderSkipped:false,maxBarThickness:42}]},options:{responsive:true,maintainAspectRatio:false,animation:false,layout:{padding:{top:30,right:6,left:2,bottom:0}},plugins:{legend:{display:false},rfBarLabel:{formatter:v=>formatChartValue(overviewProject,v)},tooltip:{callbacks:{label:ctx=>formatChartValue(overviewProject,ctx.raw)}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Inter, Arial, sans-serif',size:10},color:'#7d858e'}},y:{beginAtZero:true,grid:{color:'#eef1f4',drawTicks:false},border:{display:false},ticks:{font:{family:'Inter, Arial, sans-serif',size:9},color:'#8b939c',maxTicksLimit:5,callback:v=>formatChartValue(overviewProject,v)}}}}});
  }
  if(mixCanvas){
    const total=d.mix.reduce((a,x)=>a+Number(x[1]||0),0);
    window.__reportflowCharts.mix=new Chart(mixCanvas,{type:'doughnut',data:{labels:d.mix.map(x=>x[0]),datasets:[{data:d.mix.map(x=>Number(x[1]||0)),backgroundColor:['#315efb','#7b97f7','#b9c8f8','#dce5ff'],borderColor:'#fff',borderWidth:4,hoverOffset:3}]},options:{responsive:true,maintainAspectRatio:false,animation:false,cutout:'70%',plugins:{legend:{position:'bottom',labels:{font:{family:'Inter, Arial, sans-serif',size:10},color:'#69727c',usePointStyle:true,pointStyle:'circle',padding:14}},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${formatChartValue(overviewProject,ctx.raw)} · ${total?((ctx.raw/total)*100).toFixed(1):0}%`}}}}});
  }
}

function initReportMiniCharts(){
  if(typeof Chart==='undefined')return;
  if(!window.__reportflowCharts)window.__reportflowCharts={};
  document.querySelectorAll('.report-mini-chart canvas').forEach((canvas,i)=>{
    if(window.__reportflowCharts[`mini${i}`])return;
    let values=[],labels=[]; try{values=JSON.parse(canvas.dataset.values||'[]');labels=JSON.parse(canvas.dataset.labels||'[]')}catch(e){return;}
    const project=canvas.dataset.project||''; const unit=canvas.dataset.unit||'VALUE'; const currentIndex=values.length-1;
    window.__reportflowCharts[`mini${i}`]=new Chart(canvas,{type:'bar',data:{labels,datasets:[{data:values,backgroundColor:values.map((_,idx)=>idx===currentIndex?'#315efb':'#dce5ff'),borderRadius:5,borderSkipped:false,maxBarThickness:22}]},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>formatMiniValue(ctx.raw,unit)}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Inter, Arial, sans-serif',size:7},color:'#8d959e',padding:2}},y:{display:false,beginAtZero:true,grid:{display:false},border:{display:false}}}}});
  });
}

function enhanceSelects(){
  document.querySelectorAll('select:not([data-rf-enhanced])').forEach(select=>{
    const wrapper=document.createElement('div'); wrapper.className='rf-select';
    select.parentNode.insertBefore(wrapper,select); wrapper.appendChild(select);
    select.setAttribute('data-rf-enhanced','1'); select.classList.add('rf-native-select');
    const button=document.createElement('button'); button.type='button'; button.className='rf-select-trigger';
    const value=document.createElement('span'); value.className='rf-select-value';
    const chevron=document.createElement('span'); chevron.className='rf-select-chevron'; chevron.innerHTML=fi('chevron-down');
    button.append(value,chevron); wrapper.appendChild(button);
    const menu=document.createElement('div'); menu.className='rf-select-menu'; menu.setAttribute('role','listbox'); wrapper.appendChild(menu);
    const rebuild=()=>{
      value.textContent=select.options[select.selectedIndex]?.text||''; menu.innerHTML='';
      [...select.options].forEach((opt,idx)=>{const item=document.createElement('button');item.type='button';item.className='rf-option'+(idx===select.selectedIndex?' selected':'');item.innerHTML=`<span>${esc(opt.text)}</span>${idx===select.selectedIndex?fi('check'):''}`;item.onclick=()=>{select.selectedIndex=idx;select.dispatchEvent(new Event('change',{bubbles:true}));closeAllSelects();rebuild();};menu.appendChild(item);});
    };
    button.onclick=e=>{e.stopPropagation();const open=menu.classList.contains('open');closeAllSelects();if(!open){menu.classList.add('open');button.classList.add('open');}};
    select.addEventListener('change',()=>{rebuild();});
    rebuild();
  });
}
function closeAllSelects(){document.querySelectorAll('.rf-select-menu.open').forEach(m=>m.classList.remove('open'));document.querySelectorAll('.rf-select-trigger.open').forEach(b=>b.classList.remove('open'));}
document.addEventListener('click',e=>{if(!e.target.closest('.rf-select'))closeAllSelects();});

function settings(){
  const saved=JSON.parse(localStorage.getItem('reportflow-settings')||'{}');
  return `<div class="head"><div><div class="eyebrow">Workspace preferences</div><h2>Settings</h2><p>Manage notification preferences and display behavior for your ReportFlow workspace.</p></div><button class="primary" onclick="saveSettings()">${fi('save')} Save changes</button></div>
  <section class="settings-layout">
    <div class="card settings-card"><div class="cardhead"><div><div class="ctitle">Notifications</div><div class="csub">Choose which workflow events should appear in your notification center.</div></div>${badge('Preferences','blue')}</div>
      ${settingToggle('submission','Data submission updates','Notify me when project data is submitted or changed.',saved.submission!==false)}
      ${settingToggle('review','Review & approval','Notify me when a report is ready for review, approved, or sent back.',saved.review!==false)}
      ${settingToggle('workflow','Workflow reminders','Notify me about pending actions and reporting deadlines.',saved.workflow!==false)}
    </div>
    <div class="card settings-card"><div class="ctitle">Appearance</div><div class="csub">Keep the reporting workspace clean and consistent.</div>
      <div class="settings-field"><label>Theme</label><div class="segmented"><button type="button" class="selected">Light</button><button type="button" disabled>System</button></div></div>
      <div class="settings-field"><label>Content density</label><div class="segmented"><button type="button">Comfortable</button><button type="button" class="selected">Standard</button></div></div>
    </div>
  </section>`;
}
function settingToggle(key,titleText,desc,checked){return `<label class="setting-row"><span><b>${titleText}</b><small>${desc}</small></span><input id="setting-${key}" type="checkbox" ${checked?'checked':''}><i class="toggle-ui"></i></label>`;}
function saveSettings(){
  const data={submission:document.getElementById('setting-submission')?.checked!==false,review:document.getElementById('setting-review')?.checked!==false,workflow:document.getElementById('setting-workflow')?.checked!==false};
  localStorage.setItem('reportflow-settings',JSON.stringify(data));showToast('Settings saved');
}

function toggleNotifications(){const p=document.getElementById('notification-panel');if(!p)return;const open=p.classList.toggle('open');if(open)document.getElementById('account-menu')?.classList.remove('open');}
function markNotificationsRead(){document.querySelectorAll('.notification-item.unread').forEach(x=>x.classList.remove('unread'));document.querySelector('.notification-dot')?.remove();document.getElementById('notification-empty')?.classList.add('show');showToast('All notifications marked as read');}
document.addEventListener('click',e=>{if(!e.target.closest('.notification-wrap'))document.getElementById('notification-panel')?.classList.remove('open');});

let rfUsers=[
 {name:'Amalia',email:'amalia@company.com',role:'Monthly Report PIC',scope:['MTF Mobile','1Access','RCDE'],status:'Active'},
 {name:'Nadia Pratama',email:'nadia@company.com',role:'Project PIC',scope:['MTF Mobile'],status:'Active'},
 {name:'Raka Wijaya',email:'raka@company.com',role:'Project PIC',scope:['1Access','RCDE'],status:'Active'}
];
function usersPage(){
 return `<div class="head"><div><div class="eyebrow">Access management</div><h2>Users & Access</h2><p>Manage roles and project scope for the reporting workspace.</p></div><button class="primary" onclick="openUserModal()">${fi('plus')} Add user</button></div><div class="users-list">${rfUsers.map((u,i)=>`<div class="user user-row"><div class="user-main"><div class="user-avatar">${esc(u.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</div><div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div></div><div class="user-role"><span>${esc(u.role)}</span></div><div class="user-scope">${u.scope.map(x=>`<span class="scope-chip">${esc(x)}</span>`).join('')}</div><div class="user-status">${badge(u.status,u.status==='Active'?'green':'gray')}</div><button class="iconbtn user-edit" onclick="openUserModal(${i})" title="Edit user" aria-label="Edit user">${fi('edit-2')}</button></div>`).join('')}</div>`;
}
function openUserModal(index=null){
 const u=index===null?{name:'',email:'',role:'Project PIC',scope:[],status:'Active'}:rfUsers[index];
 openModal(`<div class="modal-head"><div><div class="eyebrow">${index===null?'New user':'User access'}</div><h3>${index===null?'Add user':'Edit user access'}</h3><p>Assign the role and project scope used to control reporting access.</p></div><button class="modal-close" onclick="closeModal()" aria-label="Close">${fi('x')}</button></div><form class="modal-form" onsubmit="saveUser(event,${index===null?'null':index})"><div class="modal-field"><label>Full name</label><input id="user-name" value="${esc(u.name)}" required></div><div class="modal-field"><label>Email</label><input id="user-email" type="email" value="${esc(u.email)}" required></div><div class="modal-field"><label>Role</label><select id="user-role"><option ${u.role==='Project PIC'?'selected':''}>Project PIC</option><option ${u.role==='Monthly Report PIC'?'selected':''}>Monthly Report PIC</option></select></div><div class="modal-field"><label>Status</label><select id="user-status"><option ${u.status==='Active'?'selected':''}>Active</option><option ${u.status==='Inactive'?'selected':''}>Inactive</option></select></div><div class="modal-field full"><label>Project scope</label><div class="metric-picker user-projects">${projects.map(p=>`<label><input type="checkbox" name="user-project" value="${esc(p.name)}" ${u.scope.includes(p.name)?'checked':''}><span>${esc(p.name)}</span></label>`).join('')}</div><small class="field-help">Monthly Report PIC can access all projects. Project PIC should only receive assigned project access.</small></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary" type="submit">${index===null?'Add user':'Save changes'}</button></div></form>`);
 requestAnimationFrame(enhanceSelects);
}
function saveUser(e,index){e.preventDefault();const role=document.getElementById('user-role').value;let scope=[...document.querySelectorAll('input[name="user-project"]:checked')].map(x=>x.value);if(role==='Monthly Report PIC')scope=projects.map(p=>p.name);if(!scope.length){showToast('Select at least one project');return;}const item={name:document.getElementById('user-name').value.trim(),email:document.getElementById('user-email').value.trim(),role,scope,status:document.getElementById('user-status').value};if(index===null){rfUsers.push(item);logActivity({actor:'Amalia',role:'Monthly Report PIC',project:'All',period:currentPeriod,category:'Access',action:'Added user',detail:item.name,change:`${item.role} · ${item.scope.join(', ')}`});}else{const old=rfUsers[index];rfUsers[index]=item;logActivity({actor:'Amalia',role:'Monthly Report PIC',project:'All',period:currentPeriod,category:'Access',action:'Updated user access',detail:item.name,change:`${old.role} → ${item.role}; ${item.scope.join(', ')}`});}closeModal();show('users');showToast(index===null?'User added':'User access updated');}

/* Cleaner report template: management infographic, not a dashboard clone. */
function reportPreview(project,month=currentPeriod){
 const fields=metricSets[project]||[]; const template=templates.find(t=>t.name===activeTemplateName)||templates[0];
 const d=annualOverview[project]||annualOverview['MTF Mobile']; const id=project.replace(/[^a-z0-9]+/gi,'-').toLowerCase();
 const bg=template.background?`background-image:url('${esc(template.background)}');background-size:cover;background-position:center;`:`background:${esc(template.backgroundColor||'#ffffff')};`;
 const summary=fields.slice(0,3).map(m=>`<div class="report-summary-item"><span>${esc(m.name)}</span><b>${formatValue(m)}</b></div>`).join('');
 const metricCards=fields.map((m,i)=>reportMetricCard(m,project,i,month)).join('');
 return `<div class="report-infographic" style="--report-accent:${esc(template.accentColor||'#315efb')};--report-bg:${esc(template.backgroundColor||'#fff')};${bg}">
   <div class="report-cover"><div><span class="report-brand">REPORTFLOW · DIGITAL DIVISION</span><span class="report-kicker">MONTHLY PERFORMANCE REPORT</span><h3>${esc(project)}</h3><p>${esc(month)} · Consolidated reporting snapshot</p></div><div class="report-period">${esc(month)}</div></div>
   <div class="report-content"><div class="report-heading"><div><span>EXECUTIVE OVERVIEW</span><h2>Monthly report insights</h2></div><span class="report-status">Final data view</span></div>
   <div class="report-summary">${summary}</div>
   <div class="report-main-charts"><section class="report-chart-panel"><div class="report-panel-head"><div><b>${project==='MTF Mobile'?'Payment volume':'Monthly performance'}</b><small>Reported values · Jan–${month.slice(0,3)}</small></div><span>${project==='MTF Mobile'?'IDR':'Count'}</span></div><div class="report-large-chart"><canvas class="report-main-chart" data-report-chart="trend" data-project="${esc(project)}" data-values="${esc(JSON.stringify(d.volume))}" data-labels="${esc(JSON.stringify(d.months))}"></canvas></div></section><section class="report-chart-panel report-mix-panel"><div class="report-panel-head"><div><b>Latest period composition</b><small>Current reporting mix</small></div></div><div class="report-large-chart"><canvas class="report-main-chart" data-report-chart="mix" data-project="${esc(project)}" data-mix="${esc(JSON.stringify(d.mix))}"></canvas></div></section></div>
   <div class="report-section-title"><span>METRIC DETAILS</span><small>Current period values with historical movement</small></div><div class="infographic-grid">${metricCards}</div></div><div class="report-footer"><span>ReportFlow · Internal reporting workspace</span><span>© 2026 Amalia. All Rights Reserved.</span></div></div>`;
}

function initReportMiniCharts(){
  if(typeof Chart==='undefined')return; if(!window.__reportflowCharts)window.__reportflowCharts={};
  document.querySelectorAll('.report-main-chart').forEach((canvas,i)=>{
    const project=canvas.dataset.project||'';
    if(canvas.dataset.reportChart==='trend'){
      let vals=[],labels=[];try{vals=JSON.parse(canvas.dataset.values);labels=JSON.parse(canvas.dataset.labels)}catch(e){return;}
      window.__reportflowCharts[`main${i}`]=new Chart(canvas,{type:'bar',plugins:[rfBarLabelPlugin],data:{labels,datasets:[{data:vals,backgroundColor:vals.map((_,x)=>x===vals.length-1?'#315efb':'#dce5ff'),borderRadius:7,borderSkipped:false,maxBarThickness:42}]},options:{responsive:true,maintainAspectRatio:false,animation:false,layout:{padding:{top:28,left:3,right:3}},plugins:{legend:{display:false},rfBarLabel:{formatter:v=>formatChartValue(project,v)},tooltip:{callbacks:{label:c=>formatChartValue(project,c.raw)}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{size:9},color:'#7c858e'}},y:{beginAtZero:true,grid:{color:'#eef1f4'},border:{display:false},ticks:{font:{size:8},color:'#8c949c',maxTicksLimit:4,callback:v=>formatChartValue(project,v)}}}}});
    }else{
      let mix=[];try{mix=JSON.parse(canvas.dataset.mix)}catch(e){return;} const total=mix.reduce((a,x)=>a+Number(x[1]||0),0);
      window.__reportflowCharts[`main${i}`]=new Chart(canvas,{type:'doughnut',data:{labels:mix.map(x=>x[0]),datasets:[{data:mix.map(x=>Number(x[1]||0)),backgroundColor:['#315efb','#7b97f7','#b9c8f8','#dce5ff'],borderColor:'#fff',borderWidth:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{position:'bottom',labels:{font:{size:9},color:'#68727b',usePointStyle:true,pointStyle:'circle',padding:10}},tooltip:{callbacks:{label:c=>`${c.label}: ${formatChartValue(project,c.raw)} · ${total?((c.raw/total)*100).toFixed(1):0}%`}}}}});
    }
  });
  document.querySelectorAll('.report-mini-chart canvas').forEach((canvas,i)=>{
    if(window.__reportflowCharts[`mini${i}`])return; let values=[],labels=[];try{values=JSON.parse(canvas.dataset.values||'[]');labels=JSON.parse(canvas.dataset.labels||'[]')}catch(e){return;}
    const unit=canvas.dataset.unit||'VALUE';window.__reportflowCharts[`mini${i}`]=new Chart(canvas,{type:'bar',data:{labels,datasets:[{data:values,backgroundColor:values.map((_,x)=>x===values.length-1?'#315efb':'#dce5ff'),borderRadius:4,borderSkipped:false,maxBarThickness:18}]},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>formatMiniValue(c.raw,unit)}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{size:7},color:'#8c949c'}},y:{display:false,beginAtZero:true,grid:{display:false},border:{display:false}}}}});
  });
}

pages.settings=['Settings',settings];
pages.users=['Users & Access',usersPage];

/* Override navigation renderer so every newly injected form gets the same select/icon treatment. */
function show(p){
  if(!pages[p])return;
  title.textContent=pages[p][0]; destroyCharts(); content.innerHTML=pages[p][1](); setActive(p); refreshIcons(); enhanceSelects();
  if(p==='activity')renderActivityLog();
  requestAnimationFrame(()=>{initDashboardCharts();initReportMiniCharts();refreshIcons();enhanceSelects();});
}

/* Keep the existing period change flow, but sync the custom control too. */
function changePeriod(period){currentPeriod=period;const select=document.getElementById('period-select');if(select){select.value=period;select.dispatchEvent(new Event('change',{bubbles:true}));}show('dashboard');}

/* Sidebar icon button is intentionally tiny and never wraps. */
function toggleSidebar(){const sidebar=document.getElementById('sidebar'),main=document.querySelector('.main'),button=document.getElementById('sidebar-collapse');if(!sidebar||!main)return;const collapsed=sidebar.classList.toggle('collapsed');main.classList.toggle('collapsed',collapsed);button.innerHTML=collapsed?fi('chevron-right'):fi('chevron-left');button.setAttribute('aria-label',collapsed?'Expand sidebar':'Collapse sidebar');button.title=collapsed?'Expand sidebar':'Collapse sidebar';try{localStorage.setItem('reportflow-sidebar-collapsed',collapsed?'1':'0')}catch(e){}refreshIcons();}

requestAnimationFrame(()=>{refreshIcons();enhanceSelects();});
