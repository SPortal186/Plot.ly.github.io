// Fetch the JSON data and console log it
d3.json("samples.json").then(function createPlotly(data) {
    console.log(data);
    var sabjectId = data.names;
    console.log(sabjectId);
  
    // Create responsive dropdown menu
    d3.select("#selDataset").selectAll("option").data(sabjectId).enter().append("option").html(function(d) {
        return `<option>${d}</option`;
      });
  
    //Pull out requested options and get index
    var dropdownMenu = d3.select("#selDataset");
    var dropdownValue = dropdownMenu.property("value");
    var index = sabjectId.indexOf(dropdownValue);
  
    //Create responsive demographic table
    d3.select("#sample-metadata").html("");
    d3.select("#sample-metadata").selectAll("p").data(Object.entries(data.metadata[index])).enter().append("p").html(function(d) {
        return `${d[0]} : ${d[1]}`;
      });
  
    console.log(Object.entries(data.metadata[index]));
  
    //Display the default plot using index
    var defaultsampleData = data.samples[index].sample_values.slice(0, 10).reverse();
    var defaultotuData = data.samples[index].otu_ids.slice(0, 10).reverse();
    var defaultotuLabels = data.samples[index].otu_labels.slice(0, 10).reverse();
    var defaultyxis = defaultotuData.map(out => "OTU" + out);
   
    var trace1 = [
      {
        x: defaultsampleData,
        y: defaultyxis,
        type: "bar",
        orientation: "h",
        text: defaultotuLabels
      }
    ];
  
    var barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 50
      }
    };
  
    Plotly.newPlot("bar", trace1, barLayout);
  
    // Create a bubble chart
    var trace2 = [
      {
        x: data.samples[index].otu_ids,
        y: data.samples[index].sample_values,
        mode: "markers",
        text: data.samples[index].otu_labels,
        marker: {
          size: data.samples[index].sample_values,
          color: data.samples[index].otu_ids,
          colorscale: "Viridis"
        }
      }
    ];
  
    var bubbleLabels = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
  
    Plotly.newPlot("bubble", trace2, bubbleLabels);

    // Gauge chart
    var washFrequency = 10 - data.metadata[index].wfreq;
    var trace3 = [{
        domain: {x: [0, 1], y: [0,1]},
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washes Per Week <br> Scrubs per Week" },
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#669999" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "rgb(247,242,236)"},
            { range: [1, 2], color: "rgb(243,240,229)" },
            { range: [2, 3], color: "rgb(233,231,201)" },
            { range: [3, 4], color: "rgb(229,233,177)" },
            { range: [4, 5], color: "rgb(213,229,149)" },
            { range: [5, 6], color: "rgb(183,205,139)" },
            { range: [6, 7], color: "rgb(135,192,128)" },
            { range: [7, 8], color: "rgb(133,188,139)" },
            { range: [8, 9], color: "rgb(128,181,134)" }
  
          ],
        }
      }];
  
      var layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
      };
  
      Plotly.newPlot("gauge", trace3, layout);


  // When different test ID is selected, call an function optionChanged
  d3.select("#selDataset").on("change", optionChanged);

  function optionChanged() {
    console.log("Different item was selected.");
    var dropdownMenu = d3.select("#selDataset");
    var dropdownValue = dropdownMenu.property("value");
    console.log(`Currently test id ${dropdownValue} is shown on the page`);

    // Update graph
    createPlotly(data);
  }
});