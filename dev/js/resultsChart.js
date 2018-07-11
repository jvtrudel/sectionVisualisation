function resultChart(data){
	var data=data;
	function exports(){};

	exports.initOptions=  function (container){
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = +container.attr("width") - margin.left - margin.right,
			height = +container.attr("height") - margin.top - margin.bottom;
			 console.log(width, height, margin, container.attr("width"),- margin.top - margin.bottom);
			return {
				margin: margin,
				width: width,
				height: height
			}
		};

	exports.initScales=function (width,height){
			//console.log(width,height);
			return {
			x0: d3.scaleBand()
			    .rangeRound([0,height])
			    .paddingInner(0.1),
			x1: d3.scaleBand()
			    .padding(0.05),
			y: d3.scaleLinear()
			 	    .rangeRound([0,width]),
		   z: d3.scaleOrdinal()
				 		.range(["#DB6700","#270797" , "#DB0000","#026B88" ])
					}
		};







		// function typeElectionResult()

		/**
		 *  Initialisation du graphique
		 *
		 **/
		exports.init=function (svg, scales, options){

		    var x0=scales.x0;
			 var x1=scales.x1;
			 var y=scales.y;
			 var z=scales.z;

			 var margin=options.margin;
			 var height=options.height;
			 var width=options.width;

		   // main content group
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","content-group");


			d3.csv(data,function(d, i, columns) {
			  for (var i = 1, n = columns.lenght; i < n; ++i)
			  	d[columns[i]] = +d[columns[i]];
			  	return d;
			}).then( function( data) {


			  var tdata= data.map(function (d){
				  //console.log(d);
				  return {
				  SV:d.SV,
				  qs:parseInt(d.qs),
				  pq:parseInt(d.pq),
				  plq:parseInt(d.plq),
				  caq:parseInt(d.caq)
			  };});
			  tdata.sort(function(a,b){return b.qs-a.qs}) ;



			  var keys = d3.keys(tdata[0]).slice(1);



			  x0.domain(tdata.map(function(d) {return d.SV; }));
			  //console.log(x0);
			  x1.domain(keys).rangeRound([x0.bandwidth(),0]);


			  y.domain([0,d3.max(tdata, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

			  g.append("g")
			    .selectAll("g")
			    .data(tdata)
			    .enter().append("g")
				 	.attr("id",function(d) { return "group-"+d.SV})
			      .attr("transform", function(d) { return "translate(0, " +( x0(d.SV)-height +margin.top/2)+")"; })
					//.attr("stroke",function(d) { return "green"; })
					.on("click",toggleHighlight)
			    .selectAll("rect")
			    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
			    .enter().append("rect")
			      .attr("y", function(d) {return height - x1(d.key); })
			      .attr("x", function(d) { return 0; }) //y(d.value)
			      .attr("height", x1.bandwidth())
			      .attr("width", function(d) { return y(d.value); })
			      .attr("fill", function(d) { return z(d.key); })
					.attr("class",function(d) { return d.key+"-item"; });


					//  X axis
			  g.append("g")
			      .attr("class", "axis")
			      .call(d3.axisLeft(x0));

					// Y axis
			  g.append("g")
			      .attr("class", "axis")
					.attr("transform", "translate(0," + height+")")
			      .call(d3.axisBottom(y).ticks(null, "s"))
			    .append("text")
			      .attr("x", 2)
			      .attr("Y", y(y.ticks().pop()) + 0.5)
			      .attr("dy", "0.32em")
			      .attr("fill", "#000")
			      .attr("font-weight", "bold")
			      .attr("text-anchor", "start")

					g.append("g")
						 .attr("class", "axis")
						 .attr("transform", "translate(0," +"0)")
						 .call(d3.axisTop(y).ticks(null, "s"))
					  .append("text")
						 .attr("x", 2)
						 .attr("Y", y(y.ticks().pop()) + 0.5)
						 .attr("dy", "0.32em")
						 .attr("fill", "#000")
						 .attr("font-weight", "bold")
						 .attr("text-anchor", "start")
						 .text("Vote");

			  var legend = g.append("g")
			      .attr("font-family", "sans-serif")
			      .attr("font-size", 10)
			      .attr("text-anchor", "end")
			    .selectAll("g")
			    .data(keys.slice().reverse())
			    .enter().append("g")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			  legend.append("rect")
			      .attr("x", width - 19)
			      .attr("width", 19)
			      .attr("height", 19)
			      .attr("fill", z);

			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9.5)
			      .attr("dy", "0.32em")
			      .text(function(d) { return d; });
			});

		};

	return exports;
}

function toggleHighlight(d,i){
	d3.select(this).attr("stroke",function(d) {
		if ( d.highlight == "on" ){
			d.highlight = "off";
			currentColor="none";
		}else{
			d.highlight = "on";
			currentColor="black";
		}
		return currentColor; });
}
