// Plot 5 ~ 7
// bubble cluster (child cost)
// Child Costs Associated with Untreated PMADs

// import data
d3.csv("./pmad_childcost.csv", function(error,data) {
    if(error) {
        throw error;
    }

// mapping
data = data.map(d => ({
    Outcome : d.Outcome, // keep the same
    Cost : +d.Cost, // make numeric
}));
    console.log(data);

// set margins and dimensions
var margin = {top: 20, right: 50, bottom: 50, left: 70};
const width = 500 - margin.left - margin.right;
const height = 250 - margin.top; // - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select("#plot5")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("Child Costs Associated with Untreated PMADs in the US");

// Color palette
var color = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.Cost; }), d3.max(data, function(d) { return d.Cost; })])
    .range(["#00b4d8", "#2E4760"]); // Light blue to dark blue

// Size scale for bubbles
var size = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.Cost; }), d3.max(data, function(d) { return d.Cost; })]) // range of data values
    .range([15,80]);  // range of size of the circles

// create a tooltip
const chartDiv = d3.select("#plot5");

// Append the tooltip to the chart div
const tooltip = chartDiv.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("stroke", "white");

// Initialize the circle: all located at the center of the svg area
var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", function(d){ return size(d.Cost)})
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", d => color(d.Cost)) // fill according to Cost
    .style("fill-opacity", 1)
    .attr("stroke", "black")
    .style("stroke-width", 0) // no stroke for now
    .on("mouseover", function (event, d) { 
        d3.select(this)
        .transition()
        .style('fill', "#dbdce1")  // grey on hover
        .style('stroke', "black")
        .style("stroke-width", 1)
        .style("opacity", 1)

        tooltip // tooltip effects on mouseover
        .transition()
        .duration(200)
        .style("opacity", 0.8); // tooltip visible
     }) 
    // .on("mousemove", function(d) {
    //     tooltip // tooltip effects on mousemove
    //     .html(d.Outcome + "<br> Cost: $" + d.Cost + " (million)")
    //     .style("left", (d3.mouse(this)[0] + 120) + "px")
    //     .style("top", (d3.mouse(this)[1] + 130 ) + "px")
    //     .style("font-family", "Arial");

    //   })
      // Update mousemove event to calculate position relative to the chart div
    .on("mousemove", function(d) {
        const [xPos, yPos] = d3.mouse(chartDiv.node());
        tooltip
            .html(d.Outcome + "<br> Cost: $" + d.Cost + " (million)")
            .style("left", (xPos + 940) + "px") // Adjust as needed
            .style("top", (yPos + 490) + "px") // Adjust as needed
            .style("font-family", "Arial");
    })
    .on("mouseleave", function (d,i) {
        d3.select(this)
        .transition()
        .style("opacity", 1)
        .style("stroke", "black")
        .style('stroke-width', 0)
        .style("fill", d => color(d.Cost)); 


        tooltip.style("opacity", 0); 
      }); 

// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y((height / 2) + 25)) // Attraction to the center of the svg area, with a slight downward shift
    .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.Cost)+3) }).iterations(1)); // Force that avoids circle overlapping

// wrap function
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", 0).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}


var labelGroups = svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "labelGroup")
    .attr("transform", `translate(${width / 2},${height / 2})`);

labelGroups.append("text")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .style("font-family", "Arial")
    .style("font-size", function(d) { return size(d.Cost) / 4 + "px"; }) // Adjust font size based on circle radius
    .text(d => d.Outcome)
    .style("fill", "white")
    .each(function(d) {
        wrap(d3.select(this), size(d.Cost) * 2);
    });


// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(data)
    .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
    
    labelGroups
            .attr("transform", function(d) {
                return `translate(${d.x},${d.y})`; });

    });
    
});