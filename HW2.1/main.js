var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()
    .rangeRound([0, width]);

colors = [{
  "Dead": 0.8,
  "Stump": 0.6,
  "Poor": 0.7,
  "Fair": 0.8,
  "Good": 1  
}]

var greens = []

Object.values(colors[0]).forEach(function(element, i) {
  if(i <= 1){
  greens.push(d3.interpolatePurples(element));}
   else {          greens.push(d3.interpolateGreens(element));}
});
              
var z = d3.scaleOrdinal()
    .range(greens);

d3.csv("https://raw.githubusercontent.com/sgo230/CUSPDataVisualization/master/StreetCensusClean.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  y.domain(data.map(function(d) { return d.Borough; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");
  
  
  
  
  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return 30+y(d.data.Borough); })
      .attr("x", function(d) { return x(d[0]); })	
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth())
  .on('mouseover', function(d){
    d3.select(this)
      tooltip.text(d[1]);
      return tooltip.style("visibility", "visible")
      tooltip.style("font","red")
})
  .on("mousemove", function (d){
  return tooltip
      .style("top", d3.event.pageY+15 + "px")
      .style("left", d3.event.pageX+15 + "px")})
  .on('mouseout', function(d){
    d3.select(this)
      tooltip.text(d[1]);
      return tooltip.style("visibility", "hidden")
})

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,30)")
      .call(d3.axisLeft(y));

  g.append("text")
        .attr("class","title")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")  
        .style("font-size", "12px")  
        .text("Tree Health by Borough");
  
  g.append("text")
        .attr("class","footer")
        .attr("x", (width - 150))             
        .attr("y", height + (margin.bottom - 5))
        .attr("text-anchor", "right")  
        .style("font-size", "12px")  
        .text("Source: 2015 NYC Tree Census");
  
  g.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,25)")
      .call(d3.axisTop(x).ticks(null, "s"))
    .append("text")
      .attr("y", 2)	
      .attr("x", x(x.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
	 .attr("transform", function(d, i) { return "translate(10," + (220 + i * 20) + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});