// Plot 1 ~ 3
// icons (pmad maternal mortality rate)
// PMADs are the #1 complication of pregnancy and childbirth

// dimensions
var margin = {top: 20, right: 50, bottom: 50, left: 70};
const width = 376; // - margin.left - margin.right;
const height = 250 - margin.top; // - margin.bottom;

// svg container
const svg = d3.select("#plot1")
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("g");

// add a title
d3.select("#plot1")
    .insert("h2", ":first-child")
    .attr("class", "h2")
    .text("PMADs are the #1 complication of pregnancy and childbirth in the US");

var text = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height * 0.95)
    .attr("font-size", "12px")
    .text("They affect ")
    .attr("text-anchor", "middle")
    .style("fill", "white");

text.append("tspan")
    .text("1 in 5")
    .style("fill", "#A4031F")
    .style("font-weight", "bold");

text.append("tspan")
    .text(" pregnant and postpartum women")
    .style("fill", "white");

// bring in images/icons
var imageUrl1 = "./womangrey.png";
var imageUrl2 = "./womanred.png";
var imageSize = 100;
var yPosit = height * .3;

// // Append the image elements to the SVG
// svg.append("image")
//     .attr("xlink:href", imageUrl2)
//     .attr("width", imageSize) // Set the width and height of the image
//     .attr("height", imageSize)
//     .attr("x", 200)
//     .attr("y", yPosit);

// // Repeat the image 7 times
// for (var i = 0; i < 4; i++) {
//     svg.append("image")
//         .attr("xlink:href", imageUrl1)
//         .attr("width", imageSize) // Set the width and height of the image
//         .attr("height", imageSize)
//         .attr("x", 300 + i * 100)
//         .attr("y", yPosit);
// }

// five iterations of the icons
var images = [
    { url: imageUrl2, x: width / 2.65 - 100 },
    { url: imageUrl1, x: width / 2.65 - 50 },
    { url: imageUrl1, x: width / 2.65 },
    { url: imageUrl1, x: width / 2.65 + 50 },
    { url: imageUrl1, x: width / 2.65 + 100 }
];

// Initial position above the visible area
var initialY = -imageSize;

// animate the icons to appear from the top of the page and move down to their final positions
images.forEach(function(image) {
    svg.append("image") // append the image elements to the svg
        .attr("xlink:href", image.url)
        .attr("width", imageSize)
        .attr("height", imageSize)
        .attr("x", image.x)
        .attr("y", initialY) // starting position should be above the visible area
        .transition() // animate the pngs
        .duration(2000) // duration of the animation (ms)
        .attr("y", yPosit); // final position
});