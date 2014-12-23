//Width and Height of the SVG
var 
	w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;

window.onresize = updateWindow;	

///////////////////////////////////////////////////////////////////////////
///////////////////////// Initiate elements ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

var stopTooltip = false;	
//Planet orbit variables
//The larger this is the more accurate the speed is
var resolution = 1, //perhaps make slider?
	speedUp = 400,
	au = 149597871, //km
	radiusSun = 695800, //km
	radiusJupiter = 69911, //km
	phi = 0, //rotation of ellipses
	radiusSizer = 6, //Size increaser of radii of planets
	planetOpacity = 0.6;

//Create SVG
var svg = d3.select("#planetarium").append("svg")
	.attr("width", x)
	.attr("height", y);


//Create a container for everything with the centre in the middle
var container = svg.append("g").attr("class","container")
					.attr("transform", "translate(" + x/2 + "," + y/2 + ")")
  
//Create star in the Middle - scaled to the orbits
//Radius of our Sun in these coordinates (taking into account size of circle inside image)
var ImageWidth = radiusSun/au * 3000 * (2.7/1.5);
container.
append("svg:image")
	.attr("x", -ImageWidth)
	.attr("y", -ImageWidth)
	.attr("class", "sun")
	.attr("xlink:href", "img/sun.png")
	.attr("width", ImageWidth*2)
	.attr("height", ImageWidth*2)
	.attr("text-anchor", "middle");	

//d3.json("exoplanets.json", function(error, planets) {

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Create Scales ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Create color gradient for planets based on the temperature of the star that they orbit
var colors = ["#FB1108","#FD150B","#FA7806","#FBE426","#FCFB8F","#F3F5E7","#C7E4EA","#ABD6E6","#9AD2E1","#42A1C1","#1C5FA5", "#172484"];
var colorScale = d3.scale.linear()
	  .domain([2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 14000, 20000, 30000]) // Temperatures
	  .range(colors);
	
//Set scale for radius of circles
var rScale = d3.scale.linear()
	.range([1, 20])
	.domain([0, d3.max(planets, function(d) { return d.Radius; })]);	

//Format with 2 decimals
var formatSI = d3.format(".2f");

//Create the gradients for the planet fill
var gradientChoice = "Temp";
createGradients();

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Plot and move planets /////////////////////////
///////////////////////////////////////////////////////////////////////////

//Drawing a line for the orbit
var orbitsContainer = container.append("g").attr("class","orbitsContainer");
var orbits = orbitsContainer.selectAll("g.orbit")
				.data(planets).enter().append("ellipse")
				.attr("class", "orbit")
				.attr("cx", function(d) {return d.cx;})
				.attr("cy", function(d) {return d.cy;})
				.attr("rx", function(d) {return d.major;})
				.attr("ry", function(d) {return d.minor;})
				.style("fill", "#3E5968")
				.style("fill-opacity", 0)
				.style("stroke", "white")
				.style("stroke-opacity", 0);	

//Drawing the planets			
var planetContainer = container.append("g").attr("class","planetContainer");
var planets = planetContainer.selectAll("g.planet")
				.data(planets).enter()
				//.append("g")
				//.attr("class", "planetWrap")					
				.append("circle")
				.attr("class", "planet")
				.attr("r", function(d) {return radiusSizer*d.Radius;})//rScale(d.Radius);})
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;})
				.style("fill", function(d){return "url(#gradientRadial-" + d.ID + ")";})
				.style("opacity", planetOpacity)
				.style("stroke-opacity", 0)
				.style("stroke-width", "3px")
				.style("stroke", "white")
				.on("mouseover", function(d, i) {
					stopTooltip = false					
					showTooltip(d);
					showEllipse(d, i, 0.8);
				})
				.on("mouseout", function(d, i) {
					showEllipse(d, i, 0);
				});

//Remove tooltip when clicking anywhere in body
d3.select("svg")
	.on("click", function(d) {stopTooltip = true;});

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Explanation Texts ////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Intro Text Wrapper
var introText = svg.append("g").attr("class", "introWrapper");
					//.attr("transform", "translate(" + -x/2 + "," + -y/2 + ")");
//Title				
var Title = introText.append("text")
	.attr("class", "title")
	.attr("x", 10 + "px")
	.attr("y", 10 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 1)
	.text("EXOPLANETS");
	
//Intro text	
var TextIntro = introText.append("text")
	.attr("class", "intro")
	.attr("x", 10 + "px")
	.attr("y", 40 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 1)
	.text("Since the definitive discovery of the first exoplanet in 1992 "+
		  "more than 1800 exoplanets have been found. Depending on circumstances and method of discovery " +
		  "we might know enough of the exoplanet to simulate its orbit. " +
		  "Here you can see 288 exoplanets from exoplanets.org for which we know the eccentricity and " +
		  "semi-major axis of the orbit, radius of the planet and (effective) temperature of the star which it orbits")
	.call(wrap, 300);


//The explanation text during the introduction
var TextTop = container.append("text")
	.attr("class", "explanation")
	.attr("x", 0 + "px")
	.attr("y", -70 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 0)
	.text("");   
	
//Create the legend
createLegend();

//Initiate the progress Circle
var arc = d3.svg.arc()
	.innerRadius(10)
	.outerRadius(12);
progressCircle(8);

///////////////////////////////////////////////////////////////////////////
//////////////////////// Set up pointer events ////////////////////////////
///////////////////////////////////////////////////////////////////////////	
//Reload page
d3.select("#reset").on("click", function(e) {location.reload();});

//Show information
d3.select("#info").on("click", showInfo);

//Remove info
d3.select("#infoClose").on("click", closeInfo);

//Skip intro
d3.select("#remove")
	.on("click", function(e) {
	
		//Remove all non needed text
		d3.select(".introWrapper").transition().style("opacity", 0);
		d3.select("#start").transition().style("opacity", 0);
		d3.select(".explanation").transition().style("opacity", 0);
		d3.select(".progressWrapper").transition().style("opacity", 0);
		
		//Make skip intro less visible, since now it doesn't work any more
		d3.select("#remove")
			.transition().duration(1000)
			.style("pointer-events", "none")
			.style("opacity",0.3);
		
		//Legend visible
		d3.select(".legendContainer").transition().style("opacity", 1);
		//Bring all planets back
		dim(delayTime = 0);
		bringBack(opacity = planetOpacity, delayTime=1);
		
		//Reset any event listeners
		resetEvents();
	});

//Switch between different gradient options
d3.select("#color")
	.on("click", function(e) {
		gradientChoice = (gradientChoice == "Rainbow") ? "Temp" : "Rainbow";
		
		svg.selectAll(".planet")
			.transition()
			.style("fill", function(d){ 
					if (gradientChoice == "Temp") {return "url(#gradientRadial-" + d.ID + ")";}
					else if (gradientChoice == "Rainbow") {return "url(#gradientLinear)";}
				})
	});	
	
//Scale planets accordingly
var scale = false;
d3.select("#scale")
	.on("click", function(e) {
			
	if (scale == false) {
		d3.select("#scale").text("unscale planets");

		d3.selectAll(".planet")
			.transition().duration(2000)
			.attr("r", function(d) {
				var newRadius = radiusJupiter/au*3000*d.Radius;
				if  (newRadius < 1) {return 0;}
				else {return newRadius;}
			});
		
		scale = true;
	} else if (scale == true) {
		d3.select("#scale").text("scale planets");

		d3.selectAll(".planet")
			.transition().duration(2000)
			.attr("r", function(d) {return radiusSizer * d.Radius;});	
		
		scale = false;			
	}//else if
});

///////////////////////////////////////////////////////////////////////////
////////////////////// Start introductions steps //////////////////////////
///////////////////////////////////////////////////////////////////////////	

//Start introduction
d3.select("#start")
	.on("click", Draw0);
	
var counter = 1;
//Order of steps when clicking button
d3.select(".progressWrapper")      
	.on("click", function(e){

		if(counter == 1) Draw1();
		else if(counter == 2) Draw2();
		else if(counter == 3) Draw3();
		else if(counter == 4) Draw4();
		else if(counter == 5) Draw5();
		else if(counter == 6) Draw6();
		
		counter = counter + 1;
	});

///////////////////////////////////////////////////////////////////////////
//////////////////////// Storytelling steps ///////////////////////////////
///////////////////////////////////////////////////////////////////////////	

function Draw0(){

	stopTooltip = true;	
	
	//Make other buttons invisible as to not distract
	d3.select("#start").transition().duration(1000).style("opacity", 0);
	//Remove button
	setTimeout(function() {
		d3.select("#start")
			.style("visibility","hidden");
		}, 1200);
	

	//Make legend invisible as to not distract
	d3.select(".legendContainer").transition().duration(1000).style("opacity", 0);
	d3.select(".introWrapper").transition().duration(1000).style("opacity", 0);
	
	//Remove event listeners during examples
	removeEvents();
							
	//Start
	startCircle(time = 29);
	
	changeText("Let me introduce you to this chaos of exoplanets that orbit many " + 
			   "different stars in our Milky Way", 
				delayDisappear = 0, delayAppear = 1);
	//Dim all planets
	dim(delayTime=0);
	
	//Highlight the biggest planet
	highlight(235, delayTime=8);
				
	changeText("Here we have WASP-12 b, one of the biggest planets in our dataset. " +
			   "Its radius is more than 20x bigger than Earth", 
				delayDisappear = 7, delayAppear = 8);


	changeText("As comparison, here we have Kepler-68 c, which is about the same size as Earth. " + 
			   "It's so small in comparison to the rest that you can barely see it",
				delayDisappear = 16, delayAppear = 17);
				
	//Highlight an Earth like chosen planet
	highlight(215, delayTime=17);

	changeText("As a note, although the sizes of the planet are scaled, and the orbits are scaled, " + 
			   "they are not scaled to each other. Otherwise most planets would become smaller than " +
			   "a pixel if I keep them on these orbits. ",
				delayDisappear = 27, delayAppear = 28);

}//function Draw0

//Scaling radii	
function Draw1() {

	startCircle(time = 5);
	
	changeText("Scaling the planetary radii to the orbits would give you this result. " +
			   "(The star in the center was already scaled to our Sun)",
				delayDisappear = 0, delayAppear = 3);
				
	//Dim all planets
	dim(delayTime = 0);
	//Bring all planets back
	bringBack(opacity = planetOpacity, delayTime = 1); 
		
	d3.selectAll(".planet")
		.transition().delay(700 * 2).duration(2000)
		.attr("r", function(d) {
			var newRadius = radiusJupiter/au*3000*d.Radius;
			if  (newRadius < 1) {return 0;}
			else {return newRadius;}
		});

}//function Draw1

//Radius of orbit
function Draw2() {

	startCircle(time = 26);
	
	//Dim all planets again
	dim(delayTime = 0);
	//Make planets bigger again
	d3.selectAll(".planet")
		.transition().delay(700 * 1).duration(1500)
		.attr("r", function(d) {return radiusSizer * d.Radius;});		

	//Highlight the biggest planet
	highlight(235, delayTime=4);
	changeText("Let's get back to WASP-12 b. The distance to the star it orbits is only 2% of the distance " +
			   "between the Earth and the Sun",
				delayDisappear = 0, delayAppear = 3);

	changeText("The distance between the Earth and the Sun is 150 million kilometers " +
			   "and is called an Astronomical Unit, or 'au'. Thus the distance of WASP-12 b to its star is 0.02 au",
				delayDisappear = 12, delayAppear = 13);

	changeText("This is extremely close. Even Mercury, the planet closest to our Sun, is stil 0.3 au away, which " +
			   "would not fit on most regular screen sizes ",
				delayDisappear = 24, delayAppear = 25);						
}//Draw2

//Orbital period
function Draw3(){
	startCircle(time = 18);
	
	changeText("The planets you see here are quite different from Earth because of more reasons. " +
			   "The average time it takes these 288 planets to go around their star is only 17 Earth days! ",
				delayDisappear = 0, delayAppear = 1);

	changeText("WASP-12 b goes around in just 26 hours",
				delayDisappear = 11, delayAppear = 12);	
				
	//Highlight an Earth like chosen planet
	highlight(215, delayTime=16);
	changeText("and Kepler-68 c in almost 10 days",
				delayDisappear = 16, delayAppear = 17);			

}//Draw3
		

//Elliptical orbits - Circles
function Draw4(){	

	//Start progress button
	startCircle(time = 22);
	
	changeText("Both of the planets highlighted now are on very circular orbits. " +
			   "However, this is not always the case",
				delayDisappear = 0, delayAppear = 1);	
				
	changeText("Most orbits are shaped more like stretched out circles: ellipses. " +
			   "The 'eccentricity' describes how round or how stretched out an ellipse is",
				delayDisappear = 10, delayAppear = 11);

	changeText("If the eccentricity is close to 0, the ellipse is more like a circle, " +
			   "like our planets here. However, if the eccentricity is close to 1, " +
			   "the ellipse is long and skinny",
				delayDisappear = 20, delayAppear = 21);
				
}//Draw4	

//Elliptical orbits 
function Draw5() {

	//Start progress button
	startCircle(time = 10);
	
	changeText("Here we have Kepler-75 b, which is already on a very stretched orbit. " +
			   "Its eccentricity is 0.57",
				delayDisappear = 1, delayAppear = 2, xloc=200, yloc = -24*1);
				
	//Dim all planets again
	dim(delayTime = 0);
	
	//Highlight elliptical orbit
	highlight(237, delayTime=2);

	changeText("Let me speed things up a bit. Do you see that the planet is moving faster " +
			   "when it is close to the star? If you want to know why that happens, " +
			   "please look up Kepler's 2nd law",
				delayDisappear = 8, delayAppear = 9, xloc=200, yloc = -24*2);
	
	
	setTimeout(function() {speedUp = 50;}, 700*8);
			
}//Draw5

//Colour of the planet
function Draw6() {

	//Return planets to original speed
	speedUp = 400;
	
	//Start progress button
	startCircle(time = 33);
	
	//Dim all planets again
	dim(delayTime = 0);
	
	//Bring all planets back
	bringBack(opacity = 0.3, delayTime = 1);
		
	changeText("Wondering about the color of the planets? They are colored according to " +
			   "the approximate color of the star around which they orbit",
				delayDisappear = 0, delayAppear = 1);
				
	changeText("Depending on the mass of a star, its temperature is different and therefore " +
			   "the color in which we see it",
				delayDisappear = 8, delayAppear = 9);

	changeText("You can hover over the legend in the bottom right to highlight only planets " +
			  "that rotate around similar stars",
				delayDisappear = 16, delayAppear = 17);
				
	//Make legend invisible as to not distract
	d3.select(".legendContainer").transition().delay(17 * 700).duration(2000).style("opacity", 1);
	//Replace Legend events
	d3.selectAll('.legend')
		.on("mouseover", classSelect(0.04))
		.on("mouseout", classSelect(planetOpacity));  
		
	changeText("I'll admit, this coloring might be a bit confusing, since now they seem like little stars " +
			   "orbiting our Sun",
				delayDisappear = 24, delayAppear = 25);
				
	
	changeText("However, seeing that we've come to the end of the introduction, I'll let you " +
			   "decide what you like best...",
				delayDisappear = 32, delayAppear = 33);
				
	d3.select(".progressWrapper")
			.transition().delay(700 * 35).duration(1000)
			.style("opacity", 0);
	
	d3.select("#crazy")
		.style("visibility","visible")
		.style("left", (x/2 - 112/2 + 6) + "px")
		.style("top", (y/2 - 100) + "px")
		.transition().delay(700 * 35).duration(1000)
		.style("opacity", 1);		
				
}//Draw6

//Switch between different gradient options of Easter Egg
d3.select("#crazy")
	.on("click", function(e) {
		
		setTimeout(function() {resetEvents();}, 3000);
		
		//Remove text
		changeText("", delayDisappear = 0, delayAppear = 1);
		
		//Make skip intro less visible, since now it doesn't work any more
		d3.select("#remove")
			.transition().duration(1000)
			.style("pointer-events", "none")
			.style("opacity",0.3);
		
		//Bring all planets back to initial opacity
		bringBack(opacity = planetOpacity);
		
		//Bring color to the planets
		svg.selectAll(".planet")
			.transition().delay(1000)
			.style("fill", "url(#gradientLinear)");
		gradientChoice = "Rainbow";
		
		//Remove button				
		d3.select("#crazy")
			.transition().duration(2500)
			.style("top", y + "px")
			.style("left", 500 + "px")
			.style("opacity", 0);
		
		//Truly remove the button after it has become invisible
		setTimeout(function() {
				d3.select("#crazy").style("visibility","hidden");
			}, 2000);
		
		//Show the new button at the bottom
		d3.select("#color")
			.style("visibility", "visible")
			.transition().delay(1500).duration(1000)
			.style("opacity", 1);
	});
//});