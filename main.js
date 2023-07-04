var d3; // Minor workaround to avoid error messages in editors

// Waiting until document has loaded
window.onload = () => {
  const csvContent = `Energy sources,2019 (Billion kWh),2019 (%),2020 (Billion kWh),2020 (%),2021 (Billion kWh),2021 (%),2022 (Billion kWh),2022 (%)
Gross electricity production in total,602.3,100.0,568.1,100.0,581.8,100.0,571.3,100.0
Lignite,114.0,18.7,91.7,16.0,110.1,18.8,116.2,20.1
Hard coal,57.5,9.5,42.8,7.4,54.6,9.3,64.4,11.2
Nuclear energy,75.1,12.3,64.4,11.2,69.1,11.8,34.7,6.0
Natural gas,89.9,14.8,94.7,16.5,90.3,15.4,79.8,13.8
Mineral oil products,4.8,0.8,4.7,0.8,4.6,0.8,4.4,0.8
Renewable energy sources,241.6,39.7,251.1,43.8,233.9,39.8,254.0,44.0
Wind power,125.9,20.7,132.1,23.0,114.7,19.5,125.3,21.7
Water power,20.1,3.3,18.7,3.3,19.7,3.4,17.5,3.0
Biomass energy,44.3,7.3,45.1,7.8,44.3,7.5,44.6,7.7
Photovoltaic energy,45.2,7.4,49.5,8.6,49.3,8.4,60.8,10.5
Household waste,5.8,1.0,5.8,1.0,5.8,1.0,5.6,1.0
Geothermal,0.2,0.0,0.2,0.0,0.2,0.0,0.2,0.0
Other energy sources,25.4,4.2,24.8,4.3,24.5,4.2,23.8,4.1`;

  fetch("data/energy.csv")
    .then((response) => response.text())
    .then((csvString) => {
      let content = d3.csvParse(csvString);
      console.log(content); // Do something with the parsed data
      // Filter the data for the desired energy sources and the year 2022
      const data = content.filter(
        (d) =>
          (d["Energy sources"] === "Wind power" ||
            d["Energy sources"] === "Water power" ||
            d["Energy sources"] === "Biomass energy" ||
            d["Energy sources"] === "Photovoltaic energy" ||
            d["Energy sources"] === "Household waste" ||
            d["Energy sources"] === "Geothermal") &&
          d["2022 (Billion kWh)"]
      );
      function updateChart() {

        const margin = { top: 20, right: 30, bottom: 40, left: 90 };
        var parentDiv = document.getElementById("parent-ctr");
        // let width = 500 - margin.left - margin.right;
        // let width = parentDiv.clientWidth - 100;
        let height = 500 - margin.top - margin.bottom;
        const windowWidthEm =
          window.innerWidth /
          parseFloat(
            getComputedStyle(document.querySelector("body"))["font-size"]
          );
        // Remove the existing chart
        d3.select("#chart-container").selectAll("*").remove();

        if (windowWidthEm >= 70) {
          width = 70 * 10
          // State 1: Default state with full spacing between bars
          // Create the SVG container
          const svg = d3
            .select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          // Set up the x-scale
          const x = d3
            .scaleBand()
            .range([0, width])
            .padding(0.33)
            .domain(data.map((d) => d["Energy sources"]));

          // Set up the y-scale
          const y = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, (d) => +d["2022 (Billion kWh)"])]);

          // Add the x-axis
          svg
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

          // Add the y-axis
          svg.append("g").call(d3.axisLeft(y));

          // Add the bars
          svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d["Energy sources"]))
            .attr("y", (d) => y(+d["2022 (Billion kWh)"]))
            .attr("width", x.bandwidth())
            .attr("fill", "steelblue")
            .attr("height", (d) => height - y(+d["2022 (Billion kWh)"]));

          // Add labels to the bars
          svg
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d) => x(d["Energy sources"]) + x.bandwidth() / 2)
            .attr("y", (d) => y(+d["2022 (Billion kWh)"]) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 50) {
          console.log(windowWidthEm);
          width = 50 * 10
          console.log("state 2");
          // State 2: Reduce spacing between bars, reduce bar width, rotate bar labels ~25°
          // Create the SVG container
          const svg = d3
            .select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          // Set up the x-scale
          const x = d3
            .scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(data.map((d) => d["Energy sources"]));

          // Set up the y-scale
          const y = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, (d) => +d["2022 (Billion kWh)"])]);

          const xAxis = d3.axisBottom(x);
          svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.5em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)");
          // .style("font-size", "10px").style("padding-bottom", "10px");

          // Add the y-axis
          svg.append("g").call(d3.axisLeft(y));
          barWidth = 60;
          // Add the bars
          svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr(
              "x",
              (d) => x(d["Energy sources"]) + (x.bandwidth() - barWidth) / 2
            )
            .attr("y", (d) => y(+d["2022 (Billion kWh)"]))
            .attr("width", barWidth)
            .attr("fill", "steelblue")
            .attr("height", (d) => height - y(+d["2022 (Billion kWh)"]));
          svg
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d) => x(d["Energy sources"]) + x.bandwidth() / 2)
            .attr("y", (d) => y(+d["2022 (Billion kWh)"]) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 40) {
          console.log("state 3");
        } else if (windowWidthEm >= 30) {
          console.log("state 4");
        } else if (windowWidthEm >= 20) {
          console.log("s5");
          // State 5: Switch to horizontal bars, reduce spacing between bars, reduce bar width, rotate bar labels ~60°, reduce font size of bar labels
          d3.select("#chart-container").selectAll("*").remove();
          const svg = d3
            .select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
          const y = d3
            .scaleBand()
            .range([0, height])
            .padding(0.2)
            .domain(data.map((d) => d["Energy sources"]));

          // Set up the x-scale
          const x = d3
            .scaleLinear()
            .range([0, width - 30])
            .domain([0, d3.max(data, (d) => +d["2022 (Billion kWh)"])]);

          // Add the y-axis
          svg.append("g").call(d3.axisLeft(y));

          // Add the x-axis
          svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

          // Add the bars
          svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => y(d["Energy sources"]))
            .attr("x", 0)
            .attr("width", (d) => x(+d["2022 (Billion kWh)"]))
            .attr("fill", "steelblue")
            .attr("height", y.bandwidth());

          // Add labels to the bars
          svg
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("y", (d) => y(d["Energy sources"]) + y.bandwidth() / 2)
            .attr("x", (d) => x(+d["2022 (Billion kWh)"]) + 5)
            .attr("text-anchor", "start")
            .text((d) => d["2022 (Billion kWh)"])
            .style("font-size", "10px");
        }
      }
      updateChart();
      window.addEventListener("resize", updateChart);
    })
    .catch((error) => {
      console.error("Error loading the CSV file:", error);
    });
};
