d3.csv("https://raw.githubusercontent.com/hvo/datasets/master/nyc_grads.csv", function (grads) {
  var data = grads
    .filter(function(row){ 
      return (row.Type=='Borough Total') &&
        (row.Cohort%2===0);
    })
    .map(function (row) {
      return [row.Advanced/row.Total*100,
              row.DroppedOut/row.Total*100,
              row.Cohort];
    });
  createPlot(data);
});

function updateDots(g, x, y, palette, data) {
  var dots = g.selectAll(".dot")
    .data(data, function key(d) {
      return [d[2], d[3]];
    });
  dots.enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", x(15))
      .attr("cx", y(15))
      .style("opacity", 0) // NEW
      .merge(dots)
      .transition().duration(500) // NEW
      .attr("cx", function (d,i) {return x(d[0]);})
      .attr("cy", function (d,i) {return y(d[1]);})
      .attr("r", 5)
      .style("opacity", 1) // NEW
      .style("fill", function(d,i) {
        return palette[(d[2]-2002)/2];
      });
  dots.exit()
    .transition().duration(500) // NEW
    .style("opacity", 0) // NEW 
}

function createPlot(data) {
  var canvasSize = [400, 400];
  var tickSize = 5;
  var pArea = [50, 50, 390, 360];
  var pSize = [pArea[2]-pArea[0], pArea[3]-pArea[1]];
  var palette = ['SteelBlue', 'SeaGreen', 'IndianRed'];

  var x = d3.scaleLinear()
    .domain([0, 30])
    .rangeRound([pArea[0], pArea[2]]);

  var y = d3.scaleLinear()
    .domain([0, 30])
    .rangeRound([pArea[3], pArea[1]]);

  var svg = d3.select("svg");
  var g = svg.append("g");

  g.append("text")
    .attr("class", "title")
    .attr("x", (x.range()[0]+x.range()[1])*0.5)
    .attr("y", 30)
    .text("NYC High School Graduate Statistics");

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${pArea[3]})`)
    .call(d3.axisBottom(x).ticks(5, "I"))
    .append("text")
      .attr("class", "label")
      .attr("x", (x.range()[0]+x.range()[1])*0.5)
      .attr("y", 35)
      .text("Advanced Regents (%)");

  g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", `translate(${pArea[0]},0)`)
    .call(d3.axisLeft(y).ticks(5, "I"))
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(y.range()[0]+y.range()[1])*0.5)
      .attr("y", -25)
      .text("Dropped Out (%)");
  
  updateDots(g, x, y, palette, data);

  var legend = g.append("g")
    .attr("transform", `translate(${pArea[2]-60}, ${pArea[1]+10})`);

  legend.append("rect")
    .attr("class", "legend--frame")
    .attr("x", -5)
    .attr("y", -5)
    .attr("width", 60)
    .attr("height", 60);

  var legendItems = legend.selectAll(".legend--item--box")
    .data([2002, 2004, 2006])
    .enter().append("g")
    .on("dblclick", function (d) {
      var fd = data.filter(function (row) { return row[2]==d;});
      updateDots(g, x, y, palette, fd);
    });

  legendItems.append("rect")
      .attr("class", "legend--item--box")
      .attr("x", 0)
      .attr("y", function(d,i) { return i*20; })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d,i) { return palette[i];});

  legendItems.append("text")
      .attr("class", "legend--item--label")
      .attr("x", 20)
      .attr("y", function(d,i) { return 5+i*20; })
      .text(function (d, i) { return d; });
}