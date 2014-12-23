///////////////////////////////////////////////////////////////////////////
/////////////////////// Gradients per Planet or Total /////////////////////
///////////////////////////////////////////////////////////////////////////
function createGradients() {

	//Just for fun a gradient that runs over all planets in a rainbow patterns
	var gradientLinear = svg
		.append("linearGradient")
		.attr("id", "gradientLinear")
		.attr("gradientUnits", "userSpaceOnUse") 
		.attr("y1", "0")
		.attr("y2", "0")
		.attr("x1", "0")
		.attr("x2", "30%")
		.attr("spreadMethod", "reflect")
		.selectAll("stop") 
		.data([                             
				{offset: "0%", color: "#6363FF"}, 
				{offset: "6.16%", color: "#6373FF"}, 
				{offset: "12.4%", color: "#63A3FF"}, 
				{offset: "18.7%", color: "#63E3FF"}, 
				{offset: "24.9%", color: "#63FFFB"}, 
				{offset: "31.2%", color: "#63FFCB"}, 
				{offset: "37.5%", color: "#63FF9B"}, 
				{offset: "43.7%", color: "#63FF6B"}, 
				{offset: "50%", color: "#7BFF63"}, 
				{offset: "56.3%", color: "#BBFF63"}, 
				{offset: "62.5%", color: "#DBFF63"}, 
				{offset: "68.8%", color: "#FBFF63"}, 
				{offset: "75%", color: "#FFD363"}, 
				{offset: "81.3%", color: "#FFB363"}, 			
				{offset: "87.6%", color: "#FF8363"},   
				{offset: "93.8%", color: "#FF7363"}, 			
				{offset: "100%", color: "#FF6364"}    
			])                  
		.enter().append("stop") 
		.attr("offset", function(d) { return d.offset; })   
		.attr("stop-color", function(d) { return d.color; });

	//Radial gradient with the center at one end of the circle, as if illuminated from the side
	//A gradient is created for each planet and colored to the temperature of its star
	var gradientContainer = container.append("g").attr("class","gradientContainer");

	var gradientRadial = gradientContainer
		.selectAll("radialGradient").data(planets).enter()
		.append("radialGradient")
		.attr("cx", "50%")
		.attr("cy", "50%")
		.attr("r", "50%")
		.attr("fx", "0%")
		.attr("gradientUnits", "objectBoundingBox")
		.attr('id', function(d){return "gradientRadial-"+d.ID})

	gradientRadial.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", function(d) {return d3.rgb(colorScale(d.temp)).brighter(1);});

	gradientRadial.append("stop")
		.attr("offset", "40%")
		.attr("stop-color", function(d) {return colorScale(d.temp);});
		 
	gradientRadial.append("stop")
		.attr("offset",  "100%")
		.attr("stop-color", function(d) {return d3.rgb(colorScale(d.temp)).darker(1.75);});
	
};