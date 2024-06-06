// Plot 4 ~ 5
// bubble cluster (maternal cost)
// Maternal Costs Associated with Untreated PMADs

// import data
d3.csv("./pmad_momcost.csv", function(error,data) {
    if(error) {
        throw error;
    }

// mapping
data = data.map(d => ({
    Outcome : d.Outcome, // keep the same
    Cost : +d.Cost, // make numeric
}));
    console.log(data);

//  set margins and dimensions
var margin = {top: 20, right: 50, bottom: 50, left: 70};
const width = 500 - margin.left - margin.right;
const height = 250 - margin.top; // - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select("#plot4")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("Maternal Costs Associated with Untreated PMADs in the US");

// Color palette
var color = d3.scaleLinear()
        .domain([20, 4652]) // this color works
        .range(["#F1042B", "#780216"]); // Light red to dark red gradient

// Size scale for bubbles
var size = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.Cost; }), d3.max(data, function(d) { return d.Cost; })]) // range of data values
    .range([15,80]);  // range of size of the circles

// interactive element
const chartDiv = d3.select("#plot4");

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
            .style("left", (xPos + 25) + "px") // Adjust as needed
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
    .force("center", d3.forceCenter().x(width / 2).y(height / 2 + 25)) // Attraction to the center of the svg area, move down a little
    .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.Cost)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Append text labels
    var labels = svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-family", "Arial")
        //.style("font-size", "12px")
        .style("font-size", function(d) { return size(d.Cost) / 5 + "px"; }) // Adjust font size based on circle radius
        .text(d => d.Outcome)
        .style("fill", "white");

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node // for each circle
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })

            labels // for each label
                .attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y; });
        });
});