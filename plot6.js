// Plot 6 ~ 2
// Line chart (years vs maternal mortality rate by race)
// Maternal Mortality 1998 to 2020 by Race

// import data
d3.csv("./MMR_years.csv", function(error, data) {
    if(error) {
        throw error;
    }

// mapping
data = data.map(d => ({
    Year : +d.Year, // make numeric
    prm : parseFloat(d.prm), // parse as a float
    Race : d.Race, // keep the same
}));
    console.log(data);

// dimensions 
var margin = {top: 20, right: 50, bottom: 50, left: 70};
const width = 500 - margin.left - margin.right;
const height = 250 - margin.top; // - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add a title
d3.select("#plot6")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("US Maternal Mortality Rate From 1998 to 2020 by Race");

// group the data: I want to draw one line per group
var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Race;})
    .entries(data);
    console.log(sumstat);

// Define the bisect function to find the closest X index of the mouse
var bisect = d3.bisector(function(d) { return d.Year; }).left;

// color scale, categorical
var res = sumstat.map(function(d){ return d.key; }) // list of group names
    console.log(res);
var color = d3.scaleOrdinal()
    .domain(res)
    .range(["#a4161a", "#ba181b", "#660708"]); // three shades of red

// define values for x axis
var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width ]);

// x axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d3.format("d")));

// label x axis
svg.append("text")
    .attr("class", "axis-label") 
    .attr("y", height + 35)
    .attr("x", width / 2)
    .attr("text-anchor", "end")
    .text("Year");

// Add values to Y axis
var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.prm; })])
    .range([ height, 0 ]);

svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

// label y axis
svg.append("text")
    .attr("class", "axis-label") 
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -height / 2)
    .attr("dy", "1em") // Adjust vertical alignment
    .style("text-anchor", "middle") // Center horizontally
    .text("Deaths per 100,000 live births");

// interactive tooltip
const chartDiv = d3.select("#plot6");

const tooltip = chartDiv.append("div")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("stroke", "white");


// Draw the line
svg.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", function(d){ return color(d.key) }) // color of line, category
    .attr("stroke-width", 5)
    .attr("d", function(d){
        return d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(+d.prm); })
        (d.values)
    })

    .each(function() { // Apply the animation to each path
        const path = d3.select(this);
        const length = path.node().getTotalLength(); // Get line length

        path.attr("stroke-dasharray", length + " " + length)
            .attr("stroke-dashoffset", length)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .delay(0) // start animation right away (aka no delay)
            .duration(2000);
    })
    

     .on("mouseover", function (event, d) {
        d3.select(this)
        .transition()
        .attr('stroke', "#dbdce1")
        .attr("stroke-width", 10)
        .style("opacity", 1)

        tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.8);
     }) 

     .each(function(d) {
    // Delay label creation after animation is complete
    const that = this;
    setTimeout(function() {
        svg.append("text")
            .attr("class", "line-label")
            .attr("x", x(d.values[d.values.length - 1].Year) + 10) // Adjust position here
            .attr("y", y(d.values[d.values.length - 1].prm)) // Adjust position here
            .text(d.key)
            .attr("text-anchor", "start") // Adjust text-anchor as needed
            .style("font-size", "10px")
            // .style("fill", color(d.key)) // for visual purposes, changed to white
            .style("fill", "white")
            .style("font-weight", "bold")
            .style("font-family", "Arial")
            .style("opacity", 0) // Initially hide the labels
            .transition()
            .duration(400) // Transition duration for labels to appear
            .style("opacity", 1); // Fade in the labels
    }, 2000)}) // Adjust the delay as needed
     
    // .on("mousemove", function(d) { // display information about each line plot
    //     tooltip
    //     // had to get creative with the html since it pulls from sumstat, not directly from data
    //     .html("Years: " + d.values[0].Year + "-" + d.values[d.values.length - 1].Year + "<br> Race: " + d.key + "<br> Peak Maternal Mortality Rate: " + d.values[d.values.length - 1].prm)
    //     .style("left", (d3.mouse(this)[0] + 120) + "px")
    //     .style("top", (d3.mouse(this)[1] + 130 ) + "px")
    //     .style("font-family", "Arial");
    //   })
    // Update mousemove event to calculate position relative to the chart div
    .on("mousemove", function(d) {
        const [xPos, yPos] = d3.mouse(chartDiv.node());
        tooltip
            .html("Years: " + d.values[0].Year + "-" + d.values[d.values.length - 1].Year + "<br> Race: " + d.key + "<br> Peak Maternal Mortality Rate: " + d.values[d.values.length - 1].prm)
            .style("left", (xPos + 540) + "px") // Adjust as needed
            .style("top", (yPos + 100) + "px") // Adjust as needed
            .style("font-family", "Arial");
    })
    
      .on("mouseleave", function (d,i) {
        d3.select(this)
        .transition()
        .style("opacity", 1)
        .attr('stroke-width', 5)
        .attr("stroke", d => color(d.key));


        tooltip.style("opacity", 0); // tooltip no longer visible
    });

// Add labels near the end of each line
// MOVED THE LABELS AFTER ANIMATION
// svg.selectAll(".line-label")
//     .data(sumstat)
//     .enter()
//     .append("text")
//     .attr("class", "line-label")
//     .attr("x", function(d) { return x(d.values[d.values.length - 1].Year) + 10; }) // Adjust position here
//     .attr("y", function(d) { return y(d.values[d.values.length - 1].prm); }) // Adjust position here
//     .text(function(d) { return d.key; })
//     .attr("text-anchor", "start") // Adjust text-anchor as needed
//     .style("font-size", "16px")
//     .style("fill", d => color(d.key))
//     .style("font-weight", "bold")
//     .style("font-family", "Arial");


});