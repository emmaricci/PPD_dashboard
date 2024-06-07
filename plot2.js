// Plot 2 ~ 4
// sankey plot (perinatal depression treatment casace by timeline)
// Antenatal (AND) and Postpartum (PPD) Depression Treatment Cascade")

// load the data
d3.json("./treatment_cascade2.json", function(error, data) {
  if (error) throw error;

  // set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 50, left: 10};
const width = 1407 - margin.left - margin.right;
const height = 300 - margin.top; // - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add a title
d3.select("#plot2")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("Antenatal (AND) and Postpartum (PPD) Depression Treatment Cascade");

  // make an x axis
  var categories = ["Prevalence", "Diagnosis", "Treatment", "Adequate Trial of Treatment", "Remission"];

  var xScale = d3.scaleBand()
      .range([margin.left, width]) // pixel space
      .domain(categories); // data space
        
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + 300 + ")") // adjust translate to show axis
      .call(d3.axisBottom(xScale))

// Define a custom color palette
var customColors = {
    "AND": "#e85d04", // light orange
    "PPD": "#dc2f02", // dark orange
    "Both": "#A4031F" // dark red
};

// Create a custom color scale
var colorz = d3.scaleOrdinal()
    .domain(Object.keys(customColors))
    .range(Object.values(customColors));

// set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(35)
    .nodePadding(20) // padding between nodes
    .size([width, height]); // set size of sankey to dimensions


  // construct sankey with generator
  sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32); // iterations

  // interactive element
  const chartDiv = d3.select("#plot2");

  // Append the tooltip to the chart div
  const tooltip = chartDiv.append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("stroke", "white");

  // add in the links
  var link = svg.append("g")
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("path")
      .attr("class", "link")
      .attr("d", sankey.link() )
      .style("stroke-width", function(d) { return Math.max(1, d.dy); }) // as a function of the value given
      // .sort(function(a, b) { return b.dy - a.dy; }); // sorting of how links will appear
      .sort(function(a, b) { return a.dy - b.dy; }) // thinner links first

    .on("mouseover", function(event, d) {
      tooltip
      .transition()
      .duration(200)
      .style("opacity", 0.8)
    })

    .on("mousemove", function(d) {
      const [xPos, yPos] = d3.mouse(chartDiv.node());
      tooltip
          .html(d.value + "%")
          .style("left", (xPos + 30) + "px") // Adjust as needed
          .style("top", (yPos + 485) + "px") // Adjust as needed
          .style("font-family", "Arial");
    })

    .on("mouseleave", function(d,i) {
      tooltip.style("opacity", 0);
    })

  // add in the nodes
  var node = svg.append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  // add the rectangles for the nodes
  node
    .append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return customColors[d.time]; }) // custom color palette
      .style("stroke", "none");

  // add in the title for the nodes
  node
    .append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.stage; }) // change the node names for labeling
      .style("fill", "black")
      .style("font-size","13.5px")
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  /////// ADD LEGEND (looping) /////
  const legend = svg.selectAll(".legend")
    .data(Object.keys(customColors))
    .enter().append("g")
    .attr("class", "legend");
    // .attr("style", "outline: thin solid red;"); // for debugging purposes
    // .attr("transform", (d, i) => `translate(${(i*50)+(0)}, -50)`); // horizontal legend 

  legend.append("rect")
      .attr("x", -80)
      .attr("y", 22)
      .attr("width", 10) // square
      .attr("height", 10)
      .style("fill", function(d) { return customColors[d]; });

  legend.append("text")
      .attr("x", -40)
      .attr("y", 32)
      .text(function(d) { return d; })
      .attr("text-anchor", "end");

    var totalWidth = 0;

    items = svg.selectAll('g.legend')
        .each(function() {
            var current = d3.select(this);
            current.attr('transform', `translate(${totalWidth + 110}, -50)`); // evenly space each legend item
            totalWidth += current.node().getBBox().width + 15; // space between each legend item
        });
  ///// END OF THE LEGEND //////  


});