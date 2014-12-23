///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Legend ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Outline taken from http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend

function createLegend() {
		var legendRectSize = 7;                                  
		var legendSpacing = 20;                                    

		var stellarClass = [
			  { "sClassName": 'A [7500K - 10000K]', "sClass": "A", "color": "#AADBEA" },
			  { "sClassName": 'F [6000K - 7500K]', "sClass": "F", "color": "#F6F3D0" },
			  { "sClassName": 'G [5200K - 6000K]', "sClass": "G", "color": "#F9F862" },
			  { "sClassName": 'K [3700K - 5200K]', "sClass": "K", "color": "#FBA10D" },
			];	

		//Initiate container around Legend
		var legendContainer = svg.append("g").attr("class","legendContainer")
			  .attr("transform", "translate(" + 30 + "," + (y - 90) + ")");
		//Create title of Legend
		var legendTitle = legendContainer.append('text')                                     
			  .attr('x', 0)              
			  .attr('y', legendRectSize - legendSpacing)  
			  .attr("dy", "1em")
			  .attr('class', 'legendTitle')
			  .attr('transform', function() {                     
				var height = legendRectSize + legendSpacing;          
				var offset =  height * stellarClass.length / 2;     
				var horz = -2 * legendRectSize;                       
				var vert = -2.3 * height - offset;                       
				return 'translate(' + horz + ',' + vert + ')';        
			  })
			  .text("Stellar class of the star around which the planet orbits")
			  .call(wrap, 200);
			  
		//Create container per circle/text pair  
		var legend = legendContainer
			  .selectAll('.legend')  	
			  .data(stellarClass)                              
			  .enter()                                                
			  .append('g')   
			  .attr('class', 'legend')                                
			  .attr('transform', function(d, i) {                     
				var height = legendRectSize + legendSpacing;          
				var offset =  height * stellarClass.length / 2;     
				var horz = -2 * legendRectSize;                       
				var vert = i * height - offset;                       
				return 'translate(' + horz + ',' + vert + ')';        
			  })
			  .on("mouseover", classSelect(0.02))
			  .on("mouseout", classSelect(0.6));                                                     
			//Append circles to Legend
			legend.append('circle')                                     
			  .attr('r', legendRectSize)  
			  .attr('cx', 4)              
			  .attr('cy', legendRectSize/2 - legendSpacing)
			  .attr("opacity", 0.5)  		  
			  .style('fill', function(d) {return d.color;});                                  
			//Append text to Legend
			legend.append('text')                                     
			  .attr('x', legendRectSize + legendSpacing/2)              
			  .attr('y', legendRectSize - legendSpacing)  
			  .text(function(d) { return d.sClassName; });  
	  
};//function createLegend