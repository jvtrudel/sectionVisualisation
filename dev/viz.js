//  visualisation de données par section de vote
function init(){
   // initialisation du fond de carte

// set default parameters for
   if ( typeof mapParams == "undefined"){
      var mapParams={
         "lat":48.4525,
         "lon":-68.5232,
         "lat_offset":.20,
         "zoom":9
      }
   }
// set sefault parameters for feature
   sectionStyle = new styleData();


   params= new mapParameters(mapParams);
   map = L.map('map').setView([params.lat, params.lon], params.zoom);

   // échelle
   scale=L.control.scale({imperial:false}).addTo(map);

   //  légende
   legend = L.control({position: 'bottomright'});

   //  info
   info = L.control();


   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   	maxZoom: 18,
   	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
   		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
   		'Sections de vote © <a href="https://www.electionsquebec.qc.ca/francais/provincial/carte-electorale/geometrie-des-circonscriptions-provinciales-du-quebec-2014.php">DGEQ</a>'
   }).addTo(map);

}

function loadSections(data){
// Charge les sections de vote
   geojson = L.geoJson(data, {
   style: style
   //onEachFeature: onEachFeature
}
).addTo(map);
}


function onEachFeature(feature, layer) {
   layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
   });
}


function setResult2014(data,name){
   // add data to section
   /*
   console.log(data["map"]);
   console.log(parti)
   console.log(data["map"]["pourcent_total_qs"]);
   */
   idx=data["map"][name];

   geojson.remove();
   var min=9999999;
   var max=-9999999;
   for( var i = 0; i<data["data"].length;i++ ){
      var val=data["data"][i][idx];
      var section=data["data"][i][7];

      /*
      console.log(idx);
      console.log(data["data"][i]);
      console.log(val);
      */

      var found=0
      for (var j=0;j<sections["features"].length;j++){
         if(parseInt(sections["features"][j]["properties"]["NO_SV"])==section){
            sections["features"][j]["properties"][name]=val;
            found=1
         }
      }
      if (found === 1){
         if(val<parseInt(min)){
            min=val;
         }
         if(max<parseInt(val)){
            max=val;
         }
      }
      //console.log(min,val,max);
   }
   //console.log(min,max);
   sectionStyle.setFeature(name,min,max);
   sectionStyle.setTitle(data["headers"][idx]);
   //console.log(sections);
   loadSections(sections);

   //console.log(geojson);
}

function style(feature) {
   var color;
   /*
   console.log(sectionStyle.get("feature-name"));
   console.log(sectionStyle.get("feature-max"));
   console.log(sectionStyle.get("feature-min"));
   */
   if (typeof  sectionStyle.get("feature-name") == "undefined"){
      color="#ffffff";  // default fillColor
   }else{
      color=getColor(feature.properties[sectionStyle.get("feature-name")],sectionStyle.get("colors"),sectionStyle.get("feature-min"),sectionStyle.get("feature-max"));
   }
   //console.log(color);
   return {
      weight: sectionStyle.get("contour-weight"),
      opacity: sectionStyle.get("contour-opacity"),
      color: sectionStyle.get("contour-color"),
      dashArray: sectionStyle.get("contour-dashArray")
      ,fillOpacity: sectionStyle.get("contour-fillOpacity")
      ,fillColor: color
   };
}

class mapParameters {
   // Paramètres nécessaires à l'affichage des cartes
   constructor(params){
      if ("lat" in params){
         this.latitude=params["lat"];
      }
      if ("lon" in params){
         this.longitude=params["lon"];
      }
      if ("zoom" in params){
         this.zoome=params["zoom"];
      }
      if (! ("lat" in params) && ("lon" in params)){
         // position par défaut (rimouski)
         this.latitude=48.4525;
         this.longitude=-68.5232;
      }
      if ("lat_offset" in params){
         this.lat_offset=params["lat_offset"];
      }else {
         this.lat_offset=0.
      }
      if ("lon_offset" in params){
         this.lat_offset=params["lat_offset"];
      }else {
         this.lon_offset=0.
      }

   }
   get lat(){
      return this.latitude-this.lat_offset;
   }
   get lon(){
      return this.longitude-this.lon_offset;
   }
   get zoom(){
      return this.zoome;
   }
}

function setLegend(name,colors,min,max){

   legend.remove();
   legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
         grades = getGrades(colors,min,max),//[0, 10, 20, 50, 100, 200, 500, 1000],
         labels = [],
         from, to;

      labels.push("<h4>"+name+"</h4>");

      for (var i = 0; i < grades.length; i++) {
         from = grades[i];
         to = grades[i + 1];
         if ( typeof to != "undefined"){
            to2=to.toFixed(2);
         }
         if ( typeof from != "undefined"){
            from2=from.toFixed(2);
         }

         labels.push(
            '<i style="background:' + getColor(from +1,colors,min,max) + '"></i> ' +
            from2 + (to ? '&ndash;' + to2 : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
   };
   legend.addTo(map);
}

function setInfo(){

      info.remove();
   	info.onAdd = function (map) {
   		this._div = L.DomUtil.create('div', 'info info-data');
         this._div.innerHTML = '<h4>'+"Élection 2014"+'</h4>'
         +"<i onclick=\"switchData('qs')\">"+"# QS"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pq')\">"+"# PQ"+'</i>'+"</br>"
         +"<i onclick=\"switchData('plq')\">"+"# PLQ"+'</i>'+"</br>"
         +"<i onclick=\"switchData('caq')\">"+"# CAQ"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_total_qs')\">"+"% QS/total"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_total_pq')\">"+"% PQ/total"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_total_plq')\">"+"% PLQ/total"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_total_caq')\">"+"% CAQ/total"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_vote_qs')\">"+"% QS/votes"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_vote_pq')\">"+"% PQ/votes"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_vote_plq')\">"+"% PLQ/votes"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_vote_caq')\">"+"% CAQ/votes"+'</i>'+"</br>"
         +"<i onclick=\"switchData('pourcent_vote')\">"+"% votes"+'</i>'+"</br>"
         +"<i onclick=\"switchData('vainqueur')\">"+"vaiqueur"+'</i>'+"</br>"




   		return this._div;
   	};
/*
var AP ={
   "target":'NO_SV'
   ,"desc_general":'NM_MUNCP'
   ,"desc_pre":'no. section:'
   ,"desc_post":''
   ,"metadata":NO_SV_metadata};
*/
   	info.addTo(map);
}

function initData(){
// initialise tout ce qui est en lien avec les données
   data=resultats2014;

   // couleurs par défauts
   datasetColors={
      "vainqueurs":"6-brun-turquoise",
      "qs":"6-brun-turquoise",
      "pq":"6-brun-turquoise",
      "plq":"6-brun-turquoise",
      "caq":"6-brun-turquoise",
      "pourcent_vote_qs":"6-brun-turquoise",
      "pourcent_vote_pq":"6-brun-turquoise",
      "pourcent_vote_plq":"6-brun-turquoise",
      "pourcent_vote_caq":"6-brun-turquoise",
      "pourcent_total_qs":"6-brun-turquoise",
      "pourcent_total_pq":"6-brun-turquoise",
      "pourcent_total_plq":"6-brun-turquoise",
      "pourcent_total_caq":"6-brun-turquoise",
      "pourcent_vote":"6-brun-turquoise",
      "vainqueur":"6-brun-turquoise"
   };

   // jeux de donnée par défaut
   activeData="vainqueur";

}








function switchData(name){
   activeData=name;
   sectionStyle.setColor({
      "colors":datasetColors[activeData]
   });
   setResult2014(data,activeData);
   setLegend(sectionStyle.get("title"),sectionStyle.get("colors"),sectionStyle.get("feature-min"),sectionStyle.get("feature-max"));



}


init();
//loadSections();
//initData();
//setInfo();

//switchData(activeData);

addPoint();
