document.addEventListener("DOMContentLoaded", function() {
    const severityData = [
        {start: '9/14/2023', end: '11/4/2023', auditor: 'CodeHawks', target: 'Competitive Audit', high: 2, medium: 7, low: 22},
        {start: '9/15/2023', end: '10/13/2023', auditor: 'OtterSec', target: 'Release v0.3.10rc1', high: 2, medium: 0, low: 4},
        {start: '8/24/2023', end: '9/27/2023', auditor: 'ChainSecurity', target: 'Semantic analysis, codegen', high: 3, medium: 2, low: 9},
        {start: '8/24/2023', end: '7/27/2024', auditor: 'ChainSecurity', target: 'Security advisory', high: 0, medium: 0, low: 0},
        {start: '11/1/2023', end: '12/14/2023', auditor: 'OtterSec', target: 'Built-ins', high: 0, medium: 1, low: 4},
        {start: '11/14/2023', end: '12/27/2023', auditor: 'ChainSecurity', target: 'Built-ins, bytecode gen', high: 0, medium: 1, low: 17},
        {start: '12/1/2023', end: '7/30/2024', auditor: 'Cyberthirst', target: 'Continuous review', high: 0, medium: 0, low: 0},
        {start: '1/8/2024', end: '6/8/2024', auditor: 'OtterSec', target: 'v0.4.0', high: 0, medium: 3, low: 2},
        {start: '1/15/2024', end: '3/22/2024', auditor: 'Statemind', target: 'Storage layout', high: 0, medium: 0, low: 4},
        {start: '2/1/2024', end: '3/13/2024', auditor: 'ChainSecurity', target: 'Modules, v0.4.0', high: 1, medium: 4, low: 19},
        {start: '3/11/2024', end: '5/23/2024', auditor: 'Statemind', target: 'Storage layout, modules', high: 0, medium: 4, low: 10},
        {start: '4/1/2024', end: '4/31/2024', auditor: 'ChainSecurity', target: 'v0.4.0', high: 0, medium: 4, low: 16},
        {start: '5/22/2024', end: '6/31/2024', auditor: 'ChainSecurity', target: 'ABI decoder, v0.4.0', high: 0, medium: 0, low: 7}
    ];

    const margin = {top: 120, right: 30, bottom: 60, left: 60};
    const width = 740 - margin.left - margin.right;
    const height = 440 - margin.top - margin.bottom;

    const svg = d3.select(".severity-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatDate = d3.timeFormat("%b %y");

    // Calculate midpoint dates
    severityData.forEach(d => {
        const startDate = parseDate(d.start);
        const endDate = parseDate(d.end);
        d.midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
    });

    function selectEveryNth(arr, n) {
        return arr.filter((_, index) => index % n === 0);
    }
    severityData.sort((a, b) => a.midDate - b.midDate);

    const N = 3;
    const selectedDates = selectEveryNth(severityData.map(d => d.midDate), N);

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
        .call(d3.axisBottom(x0)
            .tickValues(selectedDates)
            .tickFormat(formatDate))
        .attr("class", "x-axis")
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "'JetBrains Mono', sans-serif")
        .style("font-weight", "normal");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "14px")
        .style("font-family", "'JetBrains Mono', sans-serif")
        .style("font-weight", "normal");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Audit Findings over Time");
    // Add legend
    const legend = svg.append("g")
        .style("font-family", "'JetBrains Mono', sans-serif")
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