// Plot 7 ~ 1
// Bar chart (country vs maternal mortality rate)
// Maternal Mortality Rate in High-Income Countries

// import data
d3.csv("commonwealthfund.csv", function(error, data) {
    if (error) {
        throw error;
    }
    // mapping
        mortality = data.map(d => ({
            Country : d.Country, // keep the same
            mmr : +d.mmr, //make numeric
            Name : d.Name,
        }));
    
        console.log(mortality)
    
    // dimensions 
    var margin = {top: 20, right: 50, bottom: 50, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top; // - margin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#plot7")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add a title
    d3.select("#plot7")
        .insert("h2", ":first-child")
        .attr("class", "h2")
        .text("Maternal Mortality Rate in High-Income Countries");

    // variables
        var xScale = d3.scaleBand()
                .range([0, width])
                .padding(0.4)
                .domain(mortality.map(function(d) {return d.Country; }));
        
        var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0,25]);

    // axes
        svg.append("g")
        .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
            
        svg.append("text")
            .attr("class", "axis-label") 
            .attr("y", height + 35)
            .attr("x", width / 2)
            .attr("text-anchor", "end")
            .text("Country");
    
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale) 
            .ticks(5));
        
        svg.append("text")
            .attr("class", "axis-label") 
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("dy", "1em") // Adjust vertical alignment
            .style("text-anchor", "middle") // Center horizontally
            .text("Deaths per 100,000 live births");
    
        // interactive element
        // adjust tooltip positioning so that it is relative when combined with other plots on a dashboard
        const chartDiv = d3.select("#plot7");

        // Append the tooltip to the chart div
        const tooltip = chartDiv.append("div")
        // const tooltip = d3.select("#plot7")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("stroke", "white");
    
        var colorScale = d3.scaleLinear()
            .domain([0, d3.max(mortality, function(d) { return d.mmr; })])
            .range(["#F1042B", "#780216"]); // Light red to dark red gradient
        
        // bars for graph
        svg.append("g")
            .selectAll("bar")
            .data(mortality)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.Country); })
            .attr("width", xScale.bandwidth())
            .attr("fill", "#dbdce1") 
            .attr('fill', d => colorScale(d.mmr))
            .attr("height", function(d) { return height - yScale(0); }) // always equal to 0
            .attr("y", function(d) { return yScale(0); }) // start with no bars
            .on("mouseover", function (event, d) {
            d3.select(this) // rectangles/bars effects on mouseover
            .transition()
            .attr('fill', "#dbdce1")
            .attr('stroke', "black")
            .attr("stroke-width", 1)
            .style("opacity", 1)
    
            tooltip // tooltip effects on mouseover
            .transition()
            .duration(200)
            .style("opacity", 0.8); // tooltip visible
            }) 
    
            // .on("mousemove", function(d) {
            // tooltip // tooltip effects on mousemove
            // .html("Country: " + d.Name + "<br> Maternal Mortality Rate: " + d.mmr)
            // .style("left", (d3.mouse(this)[0] + 120) + "px")
            // .style("top", (d3.mouse(this)[1] + 130 ) + "px")
            // .style("font-family", "Arial");
            // })

            // Update mousemove event to calculate position relative to the chart div
            .on("mousemove", function(d) {
                const [xPos, yPos] = d3.mouse(chartDiv.node());
                tooltip
                    .html("Country: " + d.Name + "<br> Maternal Mortality Rate: " + d.mmr)
                    .style("left", (xPos + 20) + "px") // Adjust as needed
                    .style("top", (yPos + 110) + "px") // Adjust as needed
                    .style("font-family", "Arial");
            })
    
            .on("mouseleave", function (d,i) {
            d3.select(this)
            .transition()
            .style("opacity", 1)
            .attr("stroke", "black")
            .attr('stroke-width', 0)
            .attr("fill", function(d) { return colorScale(d.mmr);});
    
    
            tooltip.style("opacity", 0); // tooltip no longer visible
            }); 
    
        // Animation
        svg.selectAll("rect")
        .data(mortality)
        .transition()
        .duration(600)
        .attr("y", function(d) { return yScale(d.mmr); })
        .attr("height", function(d) { return height - yScale(d.mmr); })
        .delay(function(d,i){console.log(i) ; return(i*100)})
        .style("fill", function(d) { return colorScale(d.mmr);});
    
    
    });