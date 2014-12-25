///////////////////////////////////////////////////////////////////////////
//////////////////////////// Progress circle //////////////////////////////
///////////////////////////////////////////////////////////////////////////	

function progressCircle(time) {
//Create a small icon that starts when an animation is going on
var progressWrapper = container.append("g")
		.attr("class", "progressWrapper")
		.attr("transform", "translate(0,-220)")
		.style("pointer-events", "none");

//Circle in the back so the whole thing becomes clickable
var backCircle =  progressWrapper.append("circle")
	.attr("r", 12)
	.style("opacity", 0.01);
	
//Create the play button
var play =  progressWrapper.append("path")
	.attr("class", "play")
	.attr("d", d3.svg.symbol().type("triangle-up").size(35))
	.style("fill","#3B3B3B")
	.attr("transform", "translate(1,0) rotate(90)")
	.style("opacity", 0);

/*
//Create pause icon
var pause = container.selectAll(".pause")
				.data([-5,2])
				.enter()
				.append("rect")
				.attr("transform", "translate(0,-200)")
				.attr("x", function (d) {console.log(d); return d;})
				.attr("y",  -5)
				.attr("width", 3)
				.attr("height", 10)
				.style("fill", "white");
*/

/*
//The circle, already created in main script
var arc = d3.svg.arc()
	.innerRadius(10)
	.outerRadius(12);
*/

//Create the arc around the play button
var progress = progressWrapper.append("path")
	.datum({startAngle: 0,endAngle: 2*Math.PI})
	.attr("class", "playCircle")
	.style("fill", "white")
	.style("opacity", 0)
	.attr("d", arc);
 
};

function startCircle(time) {

	//Stop click event
	d3.select(".progressWrapper")
		.style("pointer-events", "none");
		
	//Dim the play button
	d3.selectAll(".play")
		.transition().delay(0).duration(500)
		.style("opacity", 1)
		.style("fill","#3B3B3B")
		.transition().delay(700 * time)
		.style("fill","white")
		;

	//Run the circle and at the end 
	d3.selectAll(".playCircle")
		.style("opacity", 1)
		.transition().duration(700 * time).ease("linear")
		.attrTween("d", function(d) {
		   var i = d3.interpolate(d.startAngle, d.endAngle);
		   return function(t) {
				d.endAngle = i(t);
				return arc(d);
		   }//return
		})
		.call(endall, function() {
			d3.select(".progressWrapper")
				.style("pointer-events", "auto");
		});
};