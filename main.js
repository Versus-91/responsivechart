var d3; // Minor workaround to avoid error messages in editors

// Waiting until document has loaded
window.onload = () => {
  fetch("data/energy.csv")
    .then((response) => response.text())
    .then((csvString) => {
      let content = d3.csvParse(csvString);
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
        let width = 0
        let barWidth = 0
        const margin = { top: 20, right: 30, bottom: 65, left: 90 };
        var parentDiv = document.getElementById("parent-ctr");
        // let width = 500 - margin.left - margin.right;
        // let width = parentDiv.clientWidth - 100;
        let height = 360 - margin.top - margin.bottom;
        const windowWidthEm =
          window.innerWidth /
          parseFloat(
            getComputedStyle(document.querySelector("body"))["font-size"]
          );
        // Remove the existing chart
        d3.select("#chart-container").selectAll("*").remove();

        if (windowWidthEm >= 70) {
          width = 70 * 10;
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
            .attr("fill", "#69b3a2")
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
            .style("font-size", "12px")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 50) {
          width = 50 * 10;
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
            .attr("fill", "#69b3a2")
            .attr("height", (d) => height - y(+d["2022 (Billion kWh)"]));
          svg
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d) => x(d["Energy sources"]) + x.bandwidth() / 2)
            .attr("y", (d) => y(+d["2022 (Billion kWh)"]) - 5)
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 40) {
          width = 40 * 10;
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
            .padding(0.05)
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
            .attr("transform", "rotate(-25)")
            .style("font-size", "10px")
            .style("padding-bottom", "15px");

          // Add the y-axis
          svg.append("g").call(d3.axisLeft(y));
          barWidth = 50;
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
            .attr("fill", "#69b3a2")
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
            .style("font-size", "10px")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 30) {
          width = 30 * 10;
          // State 2: Reduce spacing between bars, reduce bar width, rotate bar labels ~25°
          // Create the SVG container
          const svg = d3
            .select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + (margin.botto + 20))
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          // Set up the x-scale
          const x = d3
            .scaleBand()
            .range([0, width])
            .padding(0.02)
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
            .attr("dx", "-1em")
            .attr("dy", "-1em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "8px");

          // Add the y-axis
          svg.append("g")
           .style("font-size", "8px")
          .call(d3.axisLeft(y));
          barWidth = 40;
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
            .attr("fill", "#69b3a2")
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
            .style("font-size", "8px")
            .text((d) => d["2022 (Billion kWh)"]);
        } else if (windowWidthEm >= 20) {
          width = 30 * 9
          // State 5: Switch to horizontal bars, reduce spacing between bars, reduce bar width, rotate bar labels ~60°, reduce font size of bar labels
          d3.select("#chart-container").selectAll("*").remove();
          const svg = d3
            .select("#chart-container")
            .append("svg")
            .attr("width", (width + margin.left + margin.right))
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
          svg.append("g")
          .style("font-size", "8px")
          .call(d3.axisLeft(y));

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
            .attr("fill", "#69b3a2")
            .attr("height", y.bandwidth() - 10);

          // Add labels to the bars
          svg
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("y", (d) => y(d["Energy sources"]) + y.bandwidth() / 2)
            .attr("x", (d) => x(+d["2022 (Billion kWh)"])+ 2)
            .attr("text-anchor", "start")
            .text((d) => d["2022 (Billion kWh)"])
            .style("font-size", "8px");
        }
      }
      updateChart();
      window.addEventListener("resize", updateChart);
    })
    .catch((error) => {
      console.error("Error loading the CSV file:", error);
    });
};
