function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var subjectNames = data.names;

    subjectNames.forEach((subject) => {
      selector
        .append("option")
        .text(subject)
        .property("value", subject);
    });

    // Use the first sample from the list to build the initial plots
    var firstSubject = subjectNames[0];
    buildCharts(firstSubject);
    buildMetadata(firstSubject);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSubject) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSubject);
  buildCharts(newSubject);
  
}

// Demographics Panel 
function buildMetadata(subjectId) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(subjectInfo=> subjectInfo.id == subjectId);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(subjectId) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data);
    //BUILD BAR CHART
    var samples = data['samples'];
    var matchArray = samples.filter(sample => sample.id == subjectId);
    var subjectSample=matchArray[0]
    
    var ids = subjectSample['otu_ids'];
    var labels = subjectSample['otu_labels'];
    var values = subjectSample['sample_values'];

    var yticks = ids.slice(0, 10).map(id => `OTU ${id}` );
    console.log(yticks)

    var trace1 = {
      y: yticks.reverse(),
      x: values.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }
    var ChartData1=[trace1];
    Plotly.newPlot('bar',ChartData1);


    //BUBBLE

    var trace2 = {
      x: ids,
      y: values,
      mode: 'markers',
      marker:{
        size: values,
        color: ids,
        colorscale: 'Earth'
      }
      
      
    };
    
    var data = [trace2];
    
    var layout = {
      title: 'Bacteria cultures per sample',
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', data, layout);

    //GAUGE

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 2,
        title: { text: "Belly Button Washing frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },

          ],
          // threshold: {
          //   line: { color: "red", width: 4 },
          //   thickness: 0.75,
          //   value: 490
          // }
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);


  })}
 
