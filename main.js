var ZIPCODE_URL = "https://raw.githubusercontent.com/hvo/datasets/master/nyc_zip.geojson";

var RES_BY_CUISINE_URL = "https://raw.githubusercontent.com/hvo/datasets/master/nyc_restaurants_by_cuisine.json";

d3.queue()
  .defer(d3.json, ZIPCODE_URL)
  .defer(d3.json, RES_BY_CUISINE_URL)
  .await(createChart);

function createChart(error, zipcodes, byCuisine) {
  var svg        =  d3.select("svg"),
      gMap       =  svg.append("g"),
      canvasSize =  [600,600],
      projection =  d3.geoMercator()
                      .scale(Math.pow(2, 10.66 + 5.34))
                      .center([-73.975,40.7])
                      .translate([canvasSize[0]/3, canvasSize[1]/3]),
      path       =  d3.geoPath()
                      .projection(projection);
  
  gMap.selectAll(".zipcode")
    .data(zipcodes.features)
    .enter().append("path")
      .attr("class", "zipcode")
      .attr("d", path);
  
  
  var counts     = byCuisine[0].perZip,
      data       = Object.entries(counts),
      maxCount   = d3.max(data, d=> d[1]),
      color      = d3.scaleThreshold()
                     .domain(d3.range(0, maxCount, maxCount/5))
                     .range(d3.schemeBlues[5])
      zc         = gMap.selectAll(".zipcode")
                     .data(data);
  
  zc.style("fill", d=> color(d[1]));
}