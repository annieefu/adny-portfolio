var margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 50
},


width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%m/%d/%Y");
var formatDate = d3.timeFormat("%m/%y");
var formatCount = d3.format(",.0f");

var x = d3.scaleTime().range([0, width]); // ADD DOMAIN LATER???
var y = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x)
    .tickFormat(formatDate);

var yAxis = d3.axisLeft().scale(y)
    .ticks(12);

var stack = d3.stack()
stack.value(function(d) {
    return d.values;
});


// Create the SVG drawing area
var svg = d3.select("#histo")
.append("svg")
.attr("id", "histoid")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Get the data
d3.csv("./assets/all_retail.csv").then(function(d){
    
    d.forEach(function(d){
        d.opened_date = parseDate(d["Move In/Open Date"]);
        d.closed_date = parseDate(d["Move Out/Close Date"]);
      })
      
        console.log(d)

    
    var monthExtent = d3.extent(d, (d) => d.closed_date)

    // // Create one bin per month, use an offset to include the first and last months
    var monthBins = d3.timeMonths([d3.timeMonth.offset(monthExtent[0], -1), d3.timeMonth.offset(monthExtent[1], 1)]);
    

    // // Use the histogram layout to create a function that will bin the data
    var binByMonth = d3.histogram()
        .value(function(d) {
            return d.closed_date;
        })
        .thresholds(monthBins);


    const mapToObject = (map = new Map) => Array.from(
        map.entries(), 
        ([k, v]) => ({
          "key": k,
          "values": v instanceof Map ? mapToObject(v) : v
        })
      );
      
    //   // get the data and apply the sorting logic
    //   const data = d3.csvParse(csv)
    //     .sort((a, b) => d3.descending(a.city, b.city)
    //       || d3.ascending(a.type, b.type)
    //       || d3.descending(+a.price, +b.price));
      
      // call the helper function with output of d3.group
      const nestedData = mapToObject(
        d3.group(
          d,
          d => d.openclosed
        )
      );
      

    // var dataGrouped = d3.nest()
    //     .key(function(d) {
    //         return d["openclosed"]
    //     })
    //     .map(d, d3.map);

    // // Apply the histogram binning function to the data and convert from
    // // a map to an array so that the stack layout can consume it

    console.log(nestedData)
    var histDataByOpening = [];
    nestedData.forEach(function(key, value) {
        // Bin the data for each borough by month
        var histData = binByMonth(value);
        console.log(histData)
        histDataByOpening.push({
            key: key,
            values: histData
        });
    });

    console.log(histDataByOpening)

    var stackedHistData = stack(histDataByOpening);

    // // Scale the range of the data by setting the domain
    x.domain(["03/01/2020", monthExtent[1]]);
    y.domain([0, d3.max(stackedHistData[stackedHistData.length - 1].values, function(d) {
        return d.y + d.y0;
    })]);

    // // Set up one group for each borough
    // // Note that color doesn't have a domain set, so colors are assigned to boroughs
    // // below on a first come, first serve basis
    // var borough = svg.selectAll(".borough")
    //     .data(stackedHistData)
    //   .enter().append("g")
    //     .attr("class", "borough")
    //     .style("fill", function(d, i) {
    //         return color(d.borough);
    //     })
    //     .style("stroke", function(d, i) {
    //         return d3.rgb(color(d.borough)).darker();
    //     });

    // // Months have slightly different lengths so calculate the width for each bin
    // // Draw the rectangles, starting from the upper left corner and going down
    // borough.selectAll(".bar")
    //     .data(function(d) {
    //         return d.values;
    //     })
    //   .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) {
    //         return x(d.x);
    //     })
    //     .attr("width", function(d) {
    //         return x(new Date(d.x.getTime() + d.dx)) - x(d.x) - 2;
    //     })
    //     .attr("y", function(d) {
    //         return y(d.y0 + d.y);
    //     })
    //     .attr("height", function(d) {
    //         return y(d.y0) - y(d.y0 + d.y);
    //     });

    // // Add the X Axis
    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    // // Add the Y Axis and label
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Number of Rat Sightings");

    // // Add the legend and center it horizontally
    // var maxLegendWidth = 110;
    // var xStart = (width - maxLegendWidth * color.domain().length) / 2;
    // var legend = svg.selectAll(".legend")
    //     .data(color.domain().slice())
    //   .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) {
    //         return "translate(" + i * maxLegendWidth + ",0)";
    //     });

    // legend.append("rect")
    //     .attr("x", xStart)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", color);

    // legend.append("text")
    //     .attr("x", xStart + 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "start")
    //     .text(function(d) {
    //         return d;
    //     });
});


// // Determine the first and list dates in the data set
// var monthExtent = d3.extent(data, function(d) {
//     return d.created_date;
// });

// // Create one bin per month, use an offset to include the first and last months
// var monthBins = d3.time.months(d3.time.month.offset(monthExtent[0], -1),
//     d3.time.month.offset(monthExtent[1], 1));

// // Use the histogram layout to create a function that will bin the data
// var binByMonth = d3.layout.histogram()
//     .value(function(d) {
//         return d.created_date;
//     })
//     .bins(monthBins);

// // Use D3's nest function to group the data by borough
// var dataGroupedByBorough = d3.nest()
//     .key(function(d) {
//         return d["Borough"]
//     })
//     .map(data, d3.map);

// // Apply the histogram binning function to the data and convert from
// // a map to an array so that the stack layout can consume it
// var histDataByBorough = [];
// dataGroupedByBorough.forEach(function(key, value) {
//     // Bin the data for each borough by month
//     var histData = binByMonth(value);
//     histDataByBorough.push({
//         borough: key,
//         values: histData
//     });
// });

// var stackedHistData = stack(histDataByBorough);

// // Scale the range of the data by setting the domain
// x.domain(d3.extent(monthBins));
// y.domain([0, d3.max(stackedHistData[stackedHistData.length - 1].values, function(d) {
//     return d.y + d.y0;
// })]);

// // Set up one group for each borough
// // Note that color doesn't have a domain set, so colors are assigned to boroughs
// // below on a first come, first serve basis
// var borough = svg.selectAll(".borough")
//     .data(stackedHistData)
//   .enter().append("g")
//     .attr("class", "borough")
//     .style("fill", function(d, i) {
//         return color(d.borough);
//     })
//     .style("stroke", function(d, i) {
//         return d3.rgb(color(d.borough)).darker();
//     });

// // Months have slightly different lengths so calculate the width for each bin
// // Draw the rectangles, starting from the upper left corner and going down
// borough.selectAll(".bar")
//     .data(function(d) {
//         return d.values;
//     })
//   .enter().append("rect")
//     .attr("class", "bar")
//     .attr("x", function(d) {
//         return x(d.x);
//     })
//     .attr("width", function(d) {
//         return x(new Date(d.x.getTime() + d.dx)) - x(d.x) - 2;
//     })
//     .attr("y", function(d) {
//         return y(d.y0 + d.y);
//     })
//     .attr("height", function(d) {
//         return y(d.y0) - y(d.y0 + d.y);
//     });

// // Add the X Axis
// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

// // Add the Y Axis and label
// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text("Number of Rat Sightings");

// // Add the legend and center it horizontally
// var maxLegendWidth = 110;
// var xStart = (width - maxLegendWidth * color.domain().length) / 2;
// var legend = svg.selectAll(".legend")
//     .data(color.domain().slice())
//   .enter().append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) {
//         return "translate(" + i * maxLegendWidth + ",0)";
//     });

// legend.append("rect")
//     .attr("x", xStart)
//     .attr("width", 18)
//     .attr("height", 18)
//     .style("fill", color);

// legend.append("text")
//     .attr("x", xStart + 24)
//     .attr("y", 9)
//     .attr("dy", ".35em")
//     .style("text-anchor", "start")
//     .text(function(d) {
//         return d;
//     });

// });
    