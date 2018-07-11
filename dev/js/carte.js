// carte
function carte(params){

  // variable privée
	var width=3000,//500,
	height=1250,//500,
	data,
	anchor=params.anchor||"#carte",
	svg=d3.select(anchor).append("svg");

	var center=params.center| {"lat":48.4525,"lon":-68.5232};
	var scale=10000;

/*
	var projection=d3.geoMercator()
	  .scale(this.scale)
	  .center([center.lat, center.lon])
	  .translate([width/2, height/2]);

	var path=d3.geoPath()
	     .projection(projection);
*/

w = 3000;
	h = 1250;
	// variables for catching min and max zoom factors
	var minZoom;
	var maxZoom;

	// DEFINE FUNCTIONS/OBJECTS
	// Define map projection
	var projection = d3
	  .geoEquirectangular()
	  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
	  .scale([w / (2 * Math.PI)]) // scale to fit group width
	  .translate([w / 2, h / 2]) // ensure centred in group
	;

	// Define map path
	  var path = d3
		 .geoPath()
		 .projection(projection)
	  ;

  function exports(){};

   exports.dumpVar =function (){
		console.log("width: "+width);
		console.log("height: "+height);
		console.log(anchor);
		console.log(svg);
		console.log(center);
		console.log(scale);
		console.log(projection);
		console.log(path);
		return this;
	};


  exports.loadData=function(source){
	  // importe les donnée
	  d3.json(
		  "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json"
	//	  source
	  )
	  	.then(

			function(json){


		/*	   console.log(data);
			svg.append('g')
			 .attr('class','sections')
		 	.selectAll('path')
		 	.data(data.features)
		 	.enter().append('path')
		 	.attr("d",function(d){console.log(d)});
			*/


			countriesGroup = svg.append("g").attr("id", "map");
			// add a background rectangle
			countriesGroup
			  .append("rect")
			  .attr("x", 0)
			  .attr("y", 0)
			  .attr("width", w)
			  .attr("height", h);

			// draw a path for each feature/country
			countries = countriesGroup
			  .selectAll("path")
			  .data(json.features)
			  .enter()
			  .append("path")
			  .attr("d", path)
			  .attr("id", function(d, i) {
				 return "country" + d.properties.iso_a3;
			  })
			  .attr("class", "country")
		 }
	);

	};

	  //
  exports.postLoadFunction=function(){
	  console.log(data);
  };

	exports.init=function (){
	   // Initialisation de la carte




	};

	exports.setSections=function (index,sections){
	   // entre de nouvelles sections
	};

	exports.setDataSet=function (index,meta,data){
	   // entre des données
	};

	exports.setGeneralInfo=function (info){
	   // affiche les informations générales sur cette visualisation
	};

	exports.setControl=function (){
	   // affiche le menu de controle
	};

	exports.setLegend=function (){
	   // affiche la légende
	};

	exports.setChartBar=function (index){
	   // affiche l'histogramme

	};

	return exports;

}
