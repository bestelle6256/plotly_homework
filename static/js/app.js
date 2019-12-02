function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {

    // data = 
    //  {"AGE":49.0,"BBTYPE":"I","ETHNICITY":"Caucasian","GENDER":"M",
    // "LOCATION":"ChapelHill/NC","WFREQ":6.0,"sample":947}
  
    // Use d3 to select the panel with id of `#sample-metadata`
    sample_div = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_div.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Inside the loop, use d3 to append new tags for each key-value in the metadata.

    // Object.entries(data) = 
    // [["AGE",49.0],
    // ["BBTYPE","I"],
    // ["ETHNICITY","Caucasian"]]

    Object.entries(data).forEach(([key,value]) => {
      sample_div.append("h6").text(`${key}: ${value}`);
    })

  });

}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function (data) {

    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var otu_values =  data.sample_values;
    console.log("first_otu ",otu_ids[0],otu_labels[0],otu_labels[0]);
    console.log("10th otu ",otu_ids[9],otu_labels[9],otu_labels[9])


    // Build a Bubble Chart using the sample data

    var bubble_data_trace = {
      x: otu_ids,
      y: otu_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: otu_values,
        colors: otu_ids,
        colorscale: 'Greens'
      }
    };
    var bubble_data=[bubble_data_trace];

    var bubble_layouts = {
      title: "Belly Button Microenviornment",
      showlegend: false,
      xaxis: {title:"OTU_ID"}
    };

    BUBBLE = document.getElementById("bubble");
    Plotly.plot(BUBBLE,bubble_data,bubble_layouts);

    // Build a Pie Chart
    // use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).

    var pie_chart_trace = {
      values: otu_values.slice(0,10),
      labels: otu_labels.slice(0,10),
      type: "pie"
    };
    var pie_data = [pie_chart_trace];

    var pie_layouts = {
      title:"top otus",
      showlegend: true
    }

    PIE = document.getElementById('pie');
    Plotly.plot(PIE, pie_data, pie_layouts);

});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();