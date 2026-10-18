/* ===== 資料區（想新增或修改就改這裡）=====
   音樂祭：[名稱, 月份, 地區, 地點, 緯度, 經度, 美食區代碼]
   月份為歷年大致舉辦時間；地點未公布者緯度經度填 null */
const F=[
["浮現祭 EMERGE FEST",2,"中","台中清水鰲峰山運動公園",24.268,120.575,"tc"],
["大港開唱 Megaport Festival",3,"南","高雄駁二藝術特區",22.620,120.2815,"ks"],
["台灣祭 Taiwan Music Festival",4,"南","屏東墾丁大灣遊樂區",21.944,120.789,"kt"],
["S2O Taiwan",6,"北","台北大佳河濱公園",25.073,121.534,"tp"],
["春浪音樂節",6,"中","台中圓滿劇場",24.133,120.644,"tc"],
["台北音樂不斷電",7,"北","台北流行音樂中心戶外廣場",25.054,121.599,"tp"],
["桃園珍珠海岸國際音樂節",8,"北","桃園竹圍漁港",25.117,121.237,"ty"],
["濱海祭",8,"中","台中港 MITSUI OUTLET PARK",24.263,120.523,"tc"],
["JAM JAM ASIA 亞洲音樂節",8,"北","台北流行音樂中心",25.054,121.599,"tp"],
["WATERBOMB KAOHSIUNG",9,"南","高雄夢時代旁廣場",22.595,120.306,"ks"],
["澎湖追風音樂燈光節",9,"離島","澎湖觀音亭園區",23.569,119.564,"ph"],
["Takao Rock 打狗節",10,"南","高雄流行音樂中心",22.6215,120.287,"ks"],
["潮派鹿港音樂祭",10,"中","鹿港體育館",24.056,120.434,"lg"],
["搖滾台中",10,"中","文心森林公園與圓滿戶外劇場",24.133,120.644,"tc"],
["浪人祭 Vagabond Festival",11,"南","台南安平觀夕平台旁大草皮",23.000,120.153,"tn"],
["Ultra Taiwan",11,"北","台北大佳河濱公園",25.073,121.534,"tp"],
["火球祭 FireBall Fest",11,"北","樂天桃園棒球場",24.986,121.200,"ty"],
["流浪者森林音樂祭",12,"待公布","地點尚未公布",null,null,null]
];
// 美食：[名稱, 類型, 推薦吃什麼, 緯度, 經度]（座標為約略位置）
const S={
tp:[["饒河街夜市","夜市","胡椒餅、藥燉排骨",25.0507,121.5776],["永康街","街區","芒果冰、牛肉麵",25.0330,121.5295],["西門町","小吃","麵線、雞蛋糕",25.0434,121.5071],["寧夏夜市","夜市","蚵仔煎、豆花",25.0565,121.5152]],
tc:[["逢甲夜市","夜市","大雞排、起司馬鈴薯",24.1790,120.6470],["宮原眼科","甜點","冰淇淋、伴手禮",24.1377,120.6850],["第二市場","市場","肉圓、麻薏湯",24.1430,120.6783],["梧棲觀光漁港","海鮮","現烤海產",24.2790,120.5130]],
ks:[["六合夜市","夜市","木瓜牛奶、海產粥",22.6310,120.3017],["瑞豐夜市","夜市","臭豆腐、烤玉米",22.6660,120.2995],["旗津老街","海鮮","炸花枝、烤魷魚",22.6130,120.2660],["鹽埕老街","小吃","鴨肉飯、冰店",22.6240,120.2850]],
kt:[["墾丁大街","夜市","烤玉米、芒果冰",21.9448,120.7968],["恆春古城","老街","豆乾、在地小吃",22.0034,120.7467],["後壁湖漁港","海鮮","生魚片、海鮮粥",21.9450,120.7440]],
ty:[["竹圍漁港","海鮮","現撈海產",25.1170,121.2370],["大溪老街","老街","豆乾、老街冰品",24.8830,121.2870],["中壢忠貞市場","市場","雲南米干、手工餅",24.9600,121.2260]],
ph:[["馬公中央老街","老街","仙人掌冰、黑糖糕",23.5670,119.5660]],
lg:[["鹿港老街","老街","蝦猴、牛舌餅",24.0570,120.4350],["鹿港天后宮周邊","小吃","蚵仔煎、肉圓",24.0580,120.4310]],
tn:[["安平老街","老街","蚵嗲、蜜餞",23.0013,120.1605],["國華街","小吃街","碗粿、牛肉湯",22.9930,120.1990],["神農街","街區","咖啡、甜點",22.9975,120.1975]]
};

/* ===== 地圖初始化 ===== */
const $=id=>document.getElementById(id);
const map=L.map("map").setView([23.7,121],7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:18}).addTo(map);
const fl=L.layerGroup().addTo(map), sl=L.layerGroup().addTo(map);
const icon=(e,c)=>L.divIcon({className:"",html:`<div class="pin ${c}">${e}</div>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-16]});
let cur=null;

/* ===== 篩選選單 ===== */
const months=[...new Set(F.map(f=>f[1]))].sort((a,b)=>a-b);
const regions=[...new Set(F.map(f=>f[2]))];
$("fm").innerHTML='<option value="">全部</option>'+months.map(m=>`<option value="${m}">${m}月</option>`).join("");
$("fr").innerHTML='<option value="">全部</option>'+regions.map(r=>`<option>${r}</option>`).join("");
$("fm").onchange=$("fr").onchange=render;

/* ===== 顯示清單與音樂祭圖釘 ===== */
function render(){
  const m=$("fm").value,r=$("fr").value;
  const items=F.map((f,i)=>({f,i})).filter(({f})=>(!m||f[1]==m)&&(!r||f[2]==r));
  $("list").innerHTML=items.length?items.map(({f,i})=>
    `<li><button class="fest${i===cur?" on":""}" data-i="${i}"><b>${f[1]}月</b><span>${f[0]}<small>${f[2]}・${f[3]}</small></span></button></li>`).join("")
    :'<li class="empty">這個條件沒有音樂祭，換個月份或地區試試</li>';
  fl.clearLayers();
  items.forEach(({f,i})=>{if(f[4])L.marker([f[4],f[5]],{icon:icon("🎵",i===cur?"sel":"")})
    .bindPopup(`<b>${f[0]}</b><br>${f[1]}月・${f[3]}`).on("click",()=>choose(i)).addTo(fl)});
}
$("list").onclick=e=>{const b=e.target.closest("button");if(b)choose(+b.dataset.i)};

/* ===== 選擇音樂祭並產生美食清單 ===== */
function choose(i){cur=i;render();pick();if(F[i][4])$("map").scrollIntoView({behavior:"smooth",block:"center"})}
function pick(){
  const f=F[cur];sl.clearLayers();$("out").hidden=false;
  if(!f[6]){$("ot").textContent=f[0];$("picks").innerHTML='<li class="empty">地點尚未公布，公布後再來看看</li>';$("re").hidden=true;return}
  $("re").hidden=false;
  const shops=[...S[f[6]]].sort(()=>Math.random()-.5).slice(0,4);
  $("ot").textContent=`${f[0]} 附近吃這些`;
  $("picks").innerHTML=shops.map(s=>`<li><b>🍜 ${s[0]}</b><em>${s[1]}</em><br>${s[2]}
    <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s[0])}">Google 地圖</a></li>`).join("");
  shops.forEach(s=>L.marker([s[3],s[4]],{icon:icon("🍜","food")}).bindPopup(`<b>${s[0]}</b><br>${s[2]}`).addTo(sl));
  map.fitBounds(L.latLngBounds([[f[4],f[5]],...shops.map(s=>[s[3],s[4]])]).pad(.25));
}
$("re").onclick=pick;
render();
