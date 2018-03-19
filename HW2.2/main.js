var ZIPCODE_URL = "https://raw.githubusercontent.com/hvo/datasets/master/nyc_zip.geojson";

var RES_BY_CUISINE_URL = "https://raw.githubusercontent.com/hvo/datasets/master/nyc_restaurants_by_cuisine.json";

d3.queue()
  .defer(d3.json, ZIPCODE_URL)
  .defer(d3.json, RES_BY_CUISINE_URL)
  .await(createChart);

function createChart(error, zipcodes, byCuisine) {
  
  // start of bar chart
  
  data2 = byCuisine.map(x => [x.cuisine, x.total])
        
  
  data3 = data2.slice(0,25)
  
  
  var maxValue = d3.max(data3, function(d) {return d[1];});
  
  var xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, 175]);
  
  var svg = d3.select("svg");
var g = svg.append("g");

var x = d3.scaleLinear()
  .domain([0, maxValue])
  .rangeRound([0, 175]);
  
  var yb = d3.scaleBand()
  .domain(data3.map(function (d, i) {return d[0];}))
  .rangeRound([25, 350]);
  
  var y = d3.scaleLinear()
  .domain([0, 25])
  .rangeRound([50, 450]);
  
  g.append("g")
  .attr("class", "axis axis--y")
  .attr("transform", "translate(115,0)")
  .call(d3.axisLeft(yb))
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -yb.range()[1]*0.5)
    .attr("y", -35)
    //.text("");
 
  g.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(125,20)")
    .call(d3.axisTop(xScale)
        .ticks(4))
  
  g.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(125,355)")
    .call(d3.axisBottom(xScale)
        .ticks(4))
  
  g.append("text") 
    .attr("class","xlabel")
    .attr("transform", "translate(165,390)")
     .text("Number of Restaurants");
  
  g.selectAll(".bar")
    .data(data3)
    .enter().append("rect")
      .attr("class", "bar")
  .attr("transform", "translate(125,0)")
      .attr("x", x(0))
      .attr("y", function(d,i) {return yb(d[0]);
  })
      .attr("width", function(d,i) { return x(d[1]); })
      .attr("height", yb.bandwidth()-2)
      .on("mouseover", function(d, i) {
    
        new_index = i
        
      //regenerate map on mouseover 
      var svg        =  d3.select("svg"),
      gMap       =  svg.append("g"),
      canvasSize =  [550,550],
      projection =  d3.geoMercator()
                      .scale(Math.pow(2, 10.66 + 4.7))
                      .center([-73.975,40.7])
      path       =  d3.geoPath()
                      .projection(projection);  
  
  gMap.selectAll(".zipcode")
    .data(zipcodes.features)
    .enter().append("path")
      .attr("class", "zipcode")
      .attr("d", path)
      .attr("transform", "translate(80,-40)");
  
  var counts     = byCuisine[new_index].perZip,
      data       = Object.entries(counts),
      maxCount   = d3.max(data, d=> d[1]),
      color      = d3.scaleThreshold()
                     .domain(d3.range(0, maxCount, maxCount/5))
                     .range(d3.schemeBlues[5])
      zc         = gMap.selectAll(".zipcode")
                     .data(data, d=> (d[0]?d[0]:d.properties.zipcode));
  
  zc.style("fill", d=> color(d[1]));
        
        d3.select(this)
          .transition().duration(300)
          .attr("x", x(0)-10)
          .attr("y", yb(d[0])-2)
          .attr("width", x(d[1])+20)
          .attr("height", yb.bandwidth()+2)
        ;
    
  g.selectAll(".legendtitle").remove()
    
  g.append("text") 
    .attr("class","legendtitle")
    .attr("transform", "translate(355,10)")
     .text("Number of " + data3[new_index][0] + " Restaurants");
  
    var kFormat = function(num){
    return Math.round(num/1000 * 10) / 10 + 'k'
               };
  
  
  var x2Scale = d3.scaleLinear()
    .domain([0, maxCount])
    .range([0, 150]);
  
  increment = maxCount / 4
  
  g.selectAll(".legendticks").remove()
  
  g.append("g")
    .attr("class", "legendticks")
    .attr("transform", "translate(360,20)")
    .call(d3.axisBottom(x2Scale)
        .tickValues([0, increment, increment * 2, increment * 3, maxCount])
        .tickFormat(kFormat))
  
      })
  
  
  
  
  
      .on("mouseout", function(d, i) { 
        
        d3.select(this)
          .transition().duration(300)
          .attr("x", x(0))
          .attr("y", yb(d[0]))
          .attr("width", x(d[1]))
          .attr("height", yb.bandwidth()-2)
        ;
        
      });
  
  // map 
  
  var svg        =  d3.select("svg"),
      gMap       =  svg.append("g"),
      canvasSize =  [550,550],
      projection =  d3.geoMercator()
                      .scale(Math.pow(2, 10.66 + 4.7))
                      .center([-73.975,40.7])
      path       =  d3.geoPath()
                      .projection(projection);  
  
  gMap.selectAll(".zipcode")
    .data(zipcodes.features)
    .enter().append("path")
      .attr("class", "zipcode")
      .attr("d", path)
      .attr("transform", "translate(80,-40)");
  
  var counts     = byCuisine[0].perZip,
      data       = Object.entries(counts),
      maxCount   = d3.max(data, d=> d[1]),
      color      = d3.scaleThreshold()
                     .domain(d3.range(0, maxCount, maxCount/5))
                     .range(d3.schemeBlues[5])
      zc         = gMap.selectAll(".zipcode")
                     .data(data, d=> (d[0]?d[0]:d.properties.zipcode));
  
  zc.style("fill", d=> color(d[1]));
  
  

  
  var colordict = {
    0: 'rgb(190,215,230)',
    1: 'rgb(109,175,212)',
    2: 'rgb(54,131,187)',
    3: 'rgb(16,83,154)'
}
  
  g.selectAll(".bar2")
    .data([0,1,2,3])
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d){
    return 360 + d * 37.5})
      .attr("transform", "translate(0,17)")
      .attr("y", 0)
      .attr("width", 37.5)
      .attr("height", 10)
      .style("fill", function(d, i){
      return colordict[i]
  })
  
    g.append("text") 
    .attr("class","legendtitle")
    .attr("transform", "translate(355,10)")
     .text("Number of American Restaurants");
  
    var kFormat = function(num){
    return Math.round(num/1000 * 10) / 10 + 'k'
               };
  
  
  var x2Scale = d3.scaleLinear()
    .domain([0, maxCount])
    .range([0, 150]);
  
  increment = maxCount / 4
  
  g.append("g")
    .attr("class", "legendticks")
    .attr("transform", "translate(360,20)")
    .call(d3.axisBottom(x2Scale)
        .tickValues([0, increment, increment * 2, increment * 3, maxCount])
        .tickFormat(kFormat))

  
}




function myKey(d) {
  return (d[0]?d[0]:d.properties.zipcode)
}