Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    },
    chart: {
        style: {
            fontFamily: "'Open Sans', sans-serif"
        }
    }
});

var crimeTypesChart = new Highcharts.chart('crimeTypesChart', {
      chart: {
        type: 'bar',
        height: 440,
        width: 400
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        title: {
          text: "Precinct"
        },
        lineColor: '#2F4F4F',
        tickLength: 4,
        tickColor: '#2F4F4F',
      },
      yAxis: {
        opposite: true,
        min: 0,
        tickColor: '#2F4F4F',
        title: {
          text: null
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        enabled: true,
        headerFormat: '<span style="font-size: 10px"> Precinct: {point.key} </span><br/>'
      },
      plotOptions: {
        bar: {
          color: '#99cccc',
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 1,
          borderColor: 'grey',
          allowPointSelect: true,
          dataLabels: {
            enabled: false
          }
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Crimes',
        data: null,
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              appendLayerQuery(crimeDataset, sqlCrimeBase, "WHERE precinct = " + this.name + "");
            }
          }
        }
      },],
      exporting: {
        enabled: false
      }
    });

var map = L.map('map')
            .setView([40.692908,-73.9896452],
                     11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);

    L.control.scale().addTo(map);

    var cto = new carto.Client({
      apiKey: 'NotNeeded',
      username: 'mjdsauter'
    });

    var sqlCrimeBase = "SELECT * FROM mjdsauter.nyccrimedata";
    var crimeDataset = new carto.source.SQL(sqlCrimeBase);
    var crimeDatasetForWidget = new carto.source.SQL(sqlCrimeBase);
 var crimeDatasetForWidget2 = new carto.source.SQL(sqlCrimeBase);
    var crimePointStyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: 4;
  marker-fill: ramp([crimetype], (#EE4D5A, #51e656, #FF710F, #7d25d4, #efe705, #72efde), ("GRAND LARCENY", "GRAND THEFT AUTO", "ROBBERY", "FELONY ASSAULT", "BURGLARY", "MURDER"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: false;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 0.5;
}`);

    function titleCase(str) {
  return str.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
}

    var crimeLayer = new carto.layer.Layer(crimeDataset, crimePointStyle, {
      featureClickColumns: ['precinct', 'crimetype', 'month', 'year', 'date']
    });

    cto.addLayer(crimeLayer);

    cto.getLeafletLayer().addTo(map);

/**/
var client2 = new carto.Client({
      apiKey: 'NotNeeded',
      username: 'sgo2303'
    });
var sqlBase = "SELECT * FROM sgo2303.police_precincts";
    var pDataset = new carto.source.SQL(sqlBase);
    var pPointStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0.21;
}
#layer::outline {
  line-width: 0.5;
  line-color: #000000;
}
#layer::labels {
  text-name: [precinct];
  text-face-name: 'DejaVu Sans Book';
  text-size: 10;
  text-fill: #FFFFFF;
  text-label-position-tolerance: 0;
  text-halo-radius: 1;
  text-halo-fill: #6F808D;
  text-dy: -10;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}`);

    var pLayer = new carto.layer.Layer(pDataset, pPointStyle);

    client2.addLayer(pLayer);

    client2.getLeafletLayer().addTo(map);
/**/


    var popup = L.popup();
    crimeLayer.on('featureClicked', function(featureEvent) {
      popup.setLatLng(featureEvent.latLng);
      popup.setContent('Precinct: ' + featureEvent.data.precinct + '<br/>' + 'Crime: ' + titleCase(featureEvent.data.crimetype)+ '<br/>' + 'Date: ' + featureEvent.data.month + '/' + featureEvent.data.date + '/'+ featureEvent.data.year);
      popup.openOn(map);
    });

    var crimeTypesDataview = new carto.dataview.Category(crimeDatasetForWidget, 'precinct', {
      limit: 30
    });

    var numberOfCrimes = new carto.dataview.Formula(crimeDataset, 'crimetype', {
      operation: carto.operation.COUNT
    });


    crimeTypesDataview.on('dataChanged', function(newData) {
      var crimeTypes = newData.categories.map(function(category) {
        return [category.name, category.value];
      }).sort(function(a, b) {
        return b[1] - a[1]
      });
      refreshCrimetypesWidget(crimeTypes);
    });

    numberOfCrimes.on('dataChanged', function(newData) {
      refreshNumberOfCrimesWidget(newData.result);
    });

    var refreshNumberOfCrimesWidget = function(numCrimes) {
      var widget = document.querySelector('#numCrimesWidget');
      var labelCrimes = $("#crime-count-result").text(Math.round(numCrimes));
    };

    function refreshCrimetypesWidget(crimeTypes) {
      crimeTypesChart.series[0].setData(crimeTypes.slice(1), true);
    };

    function appendLayerQuery(dataset, sqlBase, appendText) {
      var sql = sqlBase + ' ' + appendText;
      dataset.setQuery(sql);
    };

    function resetLayerQuery(dataset, sqlBase) {
      dataset.setQuery(sqlBase);
      var selectedPoints = crimeTypesChart.getSelectedPoints();
      $.each(selectedPoints, function(i, p) {
        p.select(); //Set the selected points to unselected
      });
      crimeTypesChart.redraw();
    };

    cto.addDataview(crimeTypesDataview);
    cto.addDataview(numberOfCrimes);




/*****/

var blah = new Highcharts.chart('blah', {
      chart: {
        type: 'column',
        height: 200,
        width: 400
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        title: {
          text: null
        },
        lineColor: '#2F4F4F',
        tickLength: 4,
        tickColor: '#2F4F4F',
      },
      yAxis: {
        opposite: false,
        min: 0,
        tickColor: '#2F4F4F',
        title: {
          text: '# of Crimes'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        enabled: true,
        headerFormat: '<span style="font-size: 10px"> Precinct: {point.key} </span><br/>'
      },
      plotOptions: {
        column: {
          color: '#99cccc',
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 1,
          borderColor: 'grey',
          allowPointSelect: true,
          dataLabels: {
            enabled: false
          }
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Crimes',
        data: null,
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              appendLayerQuery(crimeDataset, sqlCrimeBase, "WHERE borough = '" + this.name + "'")
            }
          }
        }
      },],
      exporting: {
        enabled: false
      }
    });

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


 var crimeTypesDataview2 = new carto.dataview.Category(crimeDatasetForWidget2, 'borough', {
      limit: 25
    });

    var numberOfCrimes2 = new carto.dataview.Formula(crimeDataset, 'crimetype', {
      operation: carto.operation.COUNT
    });


    crimeTypesDataview2.on('dataChanged', function(newData2) {
      var crimeTypes2 = newData2.categories.map(function(category) {
        return [category.name, category.value];
      }).sort(function(a, b) {
        return b[1] - a[1]
      });
      refreshCrimetypesWidget2(crimeTypes2);
    });

var refreshNumberOfCrimesWidget2 = function(numCrimes2) {
    };




    function refreshCrimetypesWidget2(crimeTypes2) {
  for (i=0; i<crimeTypes2.length;i++){
crimeTypes2[i][0] = toTitleCase(crimeTypes2[i][0])
}
  blah.series[0].setData(crimeTypes2.slice(0,5), true);
    };

    function appendLayerQuery(dataset, sqlBase, appendText) {
      var sql = sqlBase + ' ' + appendText;
      dataset.setQuery(sql);
    };

    function resetLayerQuery2(dataset, sqlBase) {
      dataset.setQuery(sqlBase);
      var selectedPoints = blah.getSelectedPoints();
      $.each(selectedPoints, function(i, p) {
        p.select(); //Set the selected points to unselected
      });
      blah.redraw();
    };

    cto.addDataview(crimeTypesDataview2);
    cto.addDataview(numberOfCrimes2);


function resetLayerQuery2(dataset, sqlBase) {
      dataset.setQuery(sqlBase);
      var selectedPoints = blah.getSelectedPoints();
      $.each(selectedPoints, function(i, p) {
        p.select(); //Set the selected points to unselected
      });
      blah.redraw();
    };

    cto.addDataview(crimeTypesDataview2);
    cto.addDataview(numberOfCrimes2);



var myBtn = document.getElementById('crimeUpdate');

myBtn.addEventListener('click', function(event) {
var e = document.getElementById("crimeSelector");
var selectedCrime = e.value;

var f = document.getElementById("yearSelector");
var selectedYear = f.value;

var h = document.getElementById("monthSelector");
var selectedMonth = h.value;

appendLayerQuery(crimeDataset, sqlCrimeBase, "WHERE crimetype = '" + selectedCrime + "'AND year ='" + selectedYear + "'AND month = '" + selectedMonth + "'");
});

var myBtn = document.getElementById('crimeUpdate');

myBtn.addEventListener('click', function(event) {
var e = document.getElementById("crimeSelector");
var selectedCrime = e.value;

var f = document.getElementById("yearSelector");
var selectedYear = f.value;

var h = document.getElementById("monthSelector");
var selectedMonth = h.value;

var updatedQuery = ("WHERE crimetype in ('" + selectedCrime + "') AND year in ('" + selectedYear + "') AND month in ('" + selectedMonth + "')");

appendLayerQuery(crimeDataset, sqlCrimeBase, updatedQuery);

});

var clearBtn = document.getElementById('crimeReset');

clearBtn.addEventListener('click', function(event) {
resetLayerQuery(crimeDataset, sqlCrimeBase);
});
