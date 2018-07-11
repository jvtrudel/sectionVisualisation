


function mapAndChart(mapData,chartData){

	var chartProps=[
		{header:"É.I.",label:"électeurs inscrits"},{header:"Besner Marie-Neige Q.S.",label:"QS"}];
   var geoProps=[{header:"NM_MUNCP",label:"municipalité"}];


	var tipProps=["municipalité","QS","électeurs inscrits"];

	var activeProp="QS";

	var max;
	var min;

	var center={"lat":48.4525,"lon":-68.5232};
	var scale=20000;

	var getChartId=function(d){return d["S.V."];};
	var getChartValue=function(d,key){
		return d[key];
	};

	var getGeoId=function(d){return d.properties["NO_SV"]};
	var getGeoValue=function(d,key){
		return d.properties[key];
	};


	var mapData=mapData;
	var chartData=chartData;

	// les données
   var featuresById = {};

	var format = d3.format(",");

	var margin = {top: 0, right: 0, bottom: 0, left: 0},
		 width = 960 - margin.left - margin.right,
		 			height = 500 - margin.top - margin.bottom;


   var printFeatures=function(d){
		var t="";
		tipProps.forEach(function(item){
			t+="<strong>"+item+": </strong><span class='details'>"+featuresById[getGeoId(d)][item]+ "<br></span>";
		});
		  return t;
	};

	// Set tooltips
	var tip = d3.tip()
	            .attr('class', 'd3-tip')
	            .offset([-10, 0])
	            .html(printFeatures);

	var color = d3.scaleThreshold()
	    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
	    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

	var setColor=function(min,max,colorRange){
		color=d3.scaleQuantize()
    .domain([min,max])
    .range(colorRange);
	};

	var colorArray=["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
	"#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"];

   var findMinMax=function(arr,val){
		min=9999999999999999999;
		max=-9999999999999999999;
		for(var key in arr){

			if (val in arr[key]){
				t=arr[key][val];
				if(t>max){
					max=t;
				}
				if(t<min){
					min=t;
				}
			}
		}

	};

	var path = d3.geoPath();

	var svg = d3.select("body")
	            .append("svg")
	            .attr("width", width)
	            .attr("height", height)
					.call(d3.zoom().on("zoom", function () {
              		svg.attr("transform", d3.event.transform)
      			}))
	            .append('g')
	            .attr('class', 'map');

	var projection = d3.geoMercator()
							.center([center.lon,center.lat])
	                   .scale(scale)
	                  .translate( [width / 2, height / 1.5]);

	var path = d3.geoPath().projection(projection);

	svg.call(tip);

	queue()
	    .defer(d3.json, mapData)
	    .defer(d3.csv, chartData)
	    .await(ready);

	function ready(error, mapdata, chartData) {

		/* prétraitement des données */





		//  transfert des données de chart
	  mapdata.features.forEach(function(d) {
		  var t ={};
		  geoProps.forEach(function(item){
			  t[item.label]= getGeoValue(d,item.header);
		  });
		  featuresById[getGeoId(d)] = t;
	  });


	  // Transfert des données de chart
	  chartData.forEach(function(d) {
		  if(getChartId(d) in featuresById){
			  chartProps.forEach(function(item){
				  featuresById[getChartId(d)][item.label]= getChartValue(d,item.header);
			  });
		  }
	   });


		findMinMax(featuresById,activeProp);

		setColor(min,max,colorArray);


	  svg.append("g")
	      .attr("class", "countries")
	    .selectAll("path")
	      .data(mapdata.features)
	    .enter().append("path")
	      .attr("d", path)
	      .style("fill", function(d) {
				if(getGeoId(d) in featuresById){
					return color(featuresById[getGeoId(d)][activeProp]);
				}else{
						return color(0);
				}; })
	      .style('stroke', 'white')
	      .style('stroke-width', 1.5)
	      .style("opacity",0.8)
	      // tooltips
	        .style("stroke","white")
	        .style('stroke-width', 0.3)
	        .on('mouseover',function(d){
	          tip.show(d);

	          d3.select(this)
	            .style("opacity", 1)
	            .style("stroke","white")
	            .style("stroke-width",3);
	        })
	        .on('mouseout', function(d){
	          tip.hide(d);

	          d3.select(this)
	            .style("opacity", 0.8)
	            .style("stroke","white")
	            .style("stroke-width",0.3);
	        });


	  svg.append("path")
	      .datum(topojson.mesh(mapdata.features, function(a, b) { return getGeoId(a) !== getGeoId(b); }))
	       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
	      .attr("class", "names")
	      .attr("d", path);
	};



  function exports(){};


  //
  exports.addDataSet=function(label){

  };

	return exports;


};
