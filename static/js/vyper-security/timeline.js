
const data = [
    ['9/14/2023', '11/4/2023', 'CodeHawks', 'Competitive Audit', 2, 7, 22, 'https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md'],
    ['9/22/2023', '10/6/2023', 'OtterSec', 'Release v0.3.10rc1', 2, 0, 4, 'https://github.com/vyperlang/audits/blob/master/audits/OtterSec_Vyper_September_2023_audit.pdf'],
    ['9/7/2023', '9/13/2023', 'ChainSecurity', 'Semantic analysis, codegen', 3, 2, 9, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_September_2023_limited_review.pdf'],
    ['11/26/2023', '11/30/2023', 'OtterSec', 'Built-ins', 0, 1, 4, 'https://github.com/vyperlang/audits/blob/master/audits/OtterSec_Vyper_November_2023_audit.pdf'],
    ['12/1/2023', '12/13/2023', 'ChainSecurity', 'Built-ins, bytecode gen', 0, 1, 17, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_December_2023_limited_review.pdf'],
    ['1/29/2024', '3/8/2024', 'Statemind', 'Storage layout', 0, 0, 4, 'https://github.com/vyperlang/audits/blob/master/audits/Statemind_Vyper_January_2024_audit.pdf'],
    ['2/14/2024', '2/28/2024', 'ChainSecurity', 'Modules, v0.4.0', 1, 4, 19, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_February_2024_limited_review.pdf'],
    ['3/11/2024', '5/23/2024', 'Statemind', 'Storage layout, modules', 0, 4, 10, 'https://github.com/vyperlang/audits/blob/master/audits/Statemind_Vyper_June_2024_audit.pdf'],
    ['6/2/2024', '6/21/2024', 'ChainSecurity', 'ABI decoder, v0.4.0', 0, 0, 7, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_June_2024_limited_review.pdf']
];

const margin = {top: 40, right: 40, bottom: 40, left: 170};
const width = 700 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;
const barHeight = 15;

const parseDate = d3.timeParse("%m/%d/%Y");
const formatDate = d3.timeFormat("%b %y");

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleBand().range([height, 0]).padding(0);

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const processedData = data.map((d, i) => ({
    start: parseDate(d[0]),
    end: parseDate(d[1]),
    auditor: d[2],
    target: d[3],
    high: d[4],
    medium: d[5],
    low: d[6],
    link: d[7],
    id: i
})).sort((a, b) => a.start - b.start);

// Add one month padding to start and end dates
const startDate = d3.min(processedData, d => d.start);
const endDate = d3.max(processedData, d => d.end);
x.domain([d3.timeMonth.offset(startDate, -1), d3.timeMonth.offset(endDate, 1)]);
y.domain(processedData.map(d => d.id));

// Add alternating background
svg.selectAll(".background-rect")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("class", "background-rect")
    .attr("x", 0)
    .attr("y", d => y(d.id))
    .attr("width", width)
    .attr("height", y.bandwidth())
    .attr("fill", (d, i) => i % 2 === 0 ? "#f0f0f0" : "white");

// Add bars
svg.selectAll(".bar")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.start))
    .attr("y", d => y(d.id) + (y.bandwidth() - barHeight) / 2)
    .attr("width", d => x(d.end) - x(d.start))
    .attr("height", barHeight)
    .attr("rx", 5)
    .attr("ry", 5)
    .on("mouseover", showTooltip)
    .on("mouseout", scheduleHideTooltip);

let hideTooltipTimer;

function showTooltip(event, d) {
    clearTimeout(hideTooltipTimer);
    tooltip.html(`
                <div><span class="tooltip-dot" style="background-color: #FF0000;"></span><strong>High:</strong> ${d.high}</div>
                <div><span class="tooltip-dot" style="background-color: #FFA500;"></span>Medium: ${d.medium}</div>
                <div><span class="tooltip-dot" style="background-color: #008000;"></span>Low: ${d.low}</div>
                <a href="${d.link}" target="_blank">Read full audit</a>
            `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px")
        .attr("class", "tooltip active")
        .style("opacity", .9)
        .style("pointer-events", "auto");

    tooltip.on("mouseover", function() {
        clearTimeout(hideTooltipTimer);
    }).on("mouseleave", scheduleHideTooltip);
}

function scheduleHideTooltip() {
    clearTimeout(hideTooltipTimer);
    hideTooltipTimer = setTimeout(hideTooltip, 100);
}

function hideTooltip() {
    tooltip.transition()
        .duration(300)
        .style("opacity", 0)
        .on("end", function() {
            tooltip.style("pointer-events", "none");
        });
}

// Add auditor labels
svg.selectAll(".auditor-label")
    .data(processedData)
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -10)
    .attr("y", d => y(d.id) + y.bandwidth() / 2 - 7)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(d => d.auditor)
    .style("font-weight", "bold")
    .style("font-size", "16px");

// Add target labels
svg.selectAll(".target-label")
    .data(processedData)
    .enter()
    .append("text")
    .attr("class", "target-label")
    .attr("x", -10)
    .attr("y", d => y(d.id) + y.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "hanging")
    .text(d => d.target)
    .style("font-style", "italic")
    .style("font-size", "10px");

// Add x-axis
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(2)).tickFormat(formatDate))
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
    .text("Vyper Audit Timeline 2023-24");

