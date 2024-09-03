document.addEventListener("DOMContentLoaded", function() {
    const severityData = [
        {start: '9/14/2023', end: '11/4/2023', auditor: 'CodeHawks', target: 'Competitive Audit', high: 2, medium: 7, low: 22},
        {start: '9/22/2023', end: '10/6/2023', auditor: 'OtterSec', target: 'Release v0.3.10rc1', high: 2, medium: 0, low: 4},
        {start: '9/7/2023', end: '9/13/2023', auditor: 'ChainSecurity', target: 'Semantic analysis and Code generation', high: 3, medium: 2, low: 9},
        {start: '11/26/2023', end: '11/30/2023', auditor: 'OtterSec', target: 'Built-ins', high: 0, medium: 1, low: 4},
        {start: '12/1/2023', end: '12/13/2023', auditor: 'ChainSecurity', target: 'Built-ins and Bytecode Generation', high: 0, medium: 1, low: 17},
        {start: '1/29/2024', end: '3/8/2024', auditor: 'Statemind', target: 'Storage layout v0.1.0b16-v0.3.10', high: 0, medium: 0, low: 4},
        {start: '2/14/2024', end: '2/28/2024', auditor: 'ChainSecurity', target: 'Modules, v0.4.0', high: 1, medium: 4, low: 19},
        {start: '3/11/2024', end: '5/23/2024', auditor: 'Statemind', target: 'Storage layout and Modules v0.3.10-v0.4.0rc4', high: 0, medium: 4, low: 10},
        {start: '6/2/2024', end: '6/21/2024', auditor: 'ChainSecurity', target: 'ABI decoder and v0.4.0 PRs', high: 0, medium: 0, low: 7}
    ];

    const margin = {top: 60, right: 30, bottom: 60, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(".severity-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatDate = d3.timeFormat("%b %Y");

    // Calculate midpoint dates
    severityData.forEach(d => {
        const startDate = parseDate(d.start);
        const endDate = parseDate(d.end);
        d.midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
    });

    // Sort data by midDate
    severityData.sort((a, b) => a.midDate - b.midDate);

    const x0 = d3.scaleBand()
        .domain(severityData.map(d => d.midDate))
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(['high', 'medium', 'low'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(severityData, d => Math.max(d.high, d.medium, d.low))])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['high', 'medium', 'low'])
        .range(['rgba(255, 99, 132, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)']);

    svg.append("g")
        .selectAll("g")
        .data(severityData)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(d.midDate)},0)`)
        .selectAll("rect")
        .data(d => ['high', 'medium', 'low'].map(key => ({key, value: d[key]})))
        .enter().append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0).tickFormat(formatDate))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Severity of Findings over Time");

    // Add legend
    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(['high', 'medium', 'low'].slice().reverse())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d.charAt(0).toUpperCase() + d.slice(1));

    // Add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("rect")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.key}: ${d.value}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});