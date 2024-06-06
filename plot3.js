// Plot 3 ~ 6
// pie plot (maternal vs child cost)
// Costs of Untreated Perinatal Mood and Anxiety Disorders (PMADs)

// import data
d3.csv("./2017_societal_costs_of_PMADs.csv", function(error,data){
    if (error) {
        throw error;
    }
// mapping
data = data.map(d => ({
    Cost : +d.Cost,
    Person : d.Person, // keep the same
    dollar : +d.dollar, // make numeric
}));
console.log(data);

// dimensions 
var margin = {top: 20, right: 50, bottom: 50, left: 70};
const width = 300 - margin.left;
const height = 250 - margin.top; // - margin.bottom;
const radius = Math.min(width, height) / 2;

// svg container
const svg = d3.select("#plot3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + 40})`); // Centered

d3.select("#plot3")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("Distribution of Costs of Untreated PMADs");

// Create a color scale
var keyz = ["Maternal", "Child"];
var colorz = ["#A4031F","#2E4760"];

var colorScale = d3.scaleOrdinal() // categorical scale for color
    .domain(keyz)
    .range(colorz);

// Create a pie generator
const pie = d3.pie()
    .sort(null) // Do not sort the data
    .value(d => d.Cost);

// Create an arc generator
const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// interactive element
const chartDiv = d3.select("#plot3");

// interactive element
const tooltip = chartDiv.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("stroke", "white");

// Append the pie chart
const arcs = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

arcs.append("path")
    .attr("d", arc)
    .data(data) // REMEMBER TO INCLUDE DATA. issues with not doing this
    .attr("fill", d => colorScale(d.Person))
        .on("mouseover", function (event, d) {  
            d3.select(this) 
            .transition()
            .attr('fill', "#dbdce1")
            .attr('stroke', "black")
            .attr("stroke-width", 1)
            .style("opacity", 1)

            tooltip 
            .transition()
            .duration(200)
            .style("opacity", 0.8); // tooltip visible
         })

        //  .on("mousemove", function(d) {
        //     tooltip
        //     .html(d.Person + " Outcomes"  + "<br> Cost: $" + d.dollar)
        //     // .style("left",  (event.pageX + 10) + "px") // d3.js version 7
        //     // .style("top", (event.pageY - 20) + "px")
        //     .style("left", (d3.mouse(this)[0] + 300) + "px")  // d3.js version
        //     .style("top", (d3.mouse(this)[1] + 450 ) + "px")
        //     .style("font-family", "Arial");

        //   })
        .on("mousemove", function(d) {
            const [xPos, yPos] = d3.mouse(chartDiv.node());
            tooltip
            .html(d.Person + " Outcomes"  + "<br> Cost: $" + d.dollar)
            .style("left", (xPos + 550) + "px")  // Adjust as needed
            .style("top", (yPos + 490) + "px")
            .style("font-family", "Arial");
    
        })

          .on("mouseleave", function (d,i) {
            d3.select(this)
            .transition()
            .style("opacity", 1)
            .attr('stroke', "white")
            .attr("stroke-width", 0)
            .attr("fill", d => colorScale(d.Person));


            tooltip.style("opacity", 0); // tooltip no longer visible
          });

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.Person + " Outcomes " + d.data.Cost + "%") // change the labels!?
        .style("font-size", "10px")
        .style("font-family", "Arial")
        .style("fill", "white");

    });
    