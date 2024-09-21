(function() {
const data = [
    ['9/14/2023', '11/4/2023', 'CodeHawks', 'Competitive Audit', 2, 7, 22, 'https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md'],
    ['9/15/2023', '10/13/2023', 'OtterSec', 'Release v0.3.10rc1', 2, 0, 4, 'https://github.com/vyperlang/audits/blob/master/audits/OtterSec_Vyper_September_2023_audit.pdf'],
    ['8/24/2023', '9/27/2023', 'ChainSecurity', 'Semantic analysis, codegen', 3, 2, 9, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_September_2023_limited_review.pdf'],
    ['8/24/2023', '7/27/2024', 'ChainSecurity', 'Security advisory', 0, 0, 0, 'Continuous review'],
    ['11/1/2023', '12/14/2023', 'OtterSec', 'Built-ins', 0, 1, 4, 'https://github.com/vyperlang/audits/blob/master/audits/OtterSec_Vyper_November_2023_audit.pdf'],
    ['11/14/2023', '12/27/2023', 'ChainSecurity', 'Built-ins, bytecode gen', 0, 1, 17, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_December_2023_limited_review.pdf'],
    ['12/1/2023', '7/30/2024', 'Cyberthirst', 'Continuous review', 0, 0, 0, 'Continuous review'],
    ['1/8/2024', '6/8/2024', 'OtterSec', 'v0.4.0', 0, 3, 2, 'To be released soon'],
    ['1/15/2024', '3/22/2024', 'Statemind', 'Storage layout', 0, 0, 4, 'https://github.com/vyperlang/audits/blob/master/audits/Statemind_Vyper_January_2024_audit.pdf'],
    ['2/1/2024', '3/13/2024', 'ChainSecurity', 'Modules, v0.4.0', 1, 4, 19, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_February_2024_limited_review.pdf'],
    ['2/1/2024', '3/13/2024', 'ChainSecurity', 'Modules, v0.4.0', 1, 4, 19, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_February_2024_limited_review.pdf'],
    ['3/1/2024', '3/20/2024', 'kuro', 'Codegen audit', 0, 0, 0, 'Ad hoc audit'],
    ['3/11/2024', '5/23/2024', 'Statemind', 'Storage layout, modules', 0, 4, 10, 'https://github.com/vyperlang/audits/blob/master/audits/Statemind_Vyper_June_2024_audit.pdf'],
    ['4/1/2024', '4/31/2024', 'ChainSecurity', 'Codegen', 0, 4, 16, 'To be released soon'],
    ['5/22/2024', '6/31/2024', 'ChainSecurity', 'ABI decoder, v0.4.0', 0, 0, 7, 'https://github.com/vyperlang/audits/blob/master/audits/ChainSecurity_Vyper_June_2024_limited_review.pdf']
];

const margin = {top: 80, right: 10, bottom: 60, left: 170};
const width = 720 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
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
    .attr("fill", (d, i) => i % 2 === 0 ? "var(--alt-background-color)" : "var(--background-color)");

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
    .attr("fill", function(d) {
        if (d.auditor === "Cyberthirst") return "rgba(159, 76, 242, 0.6)"; // Different color for Cyberthirst
        if (d.target === "Security advisory") return "rgba(159, 76, 242, 0.6)"; // Different color for long ChainSecurity audits
        return "rgba(159, 76, 242, 0.9)"; // Default color
    })
    .on("mouseover", showTooltip)
    .on("mouseout", scheduleHideTooltip);

let hideTooltipTimer;

function showTooltip(event, d) {
    clearTimeout(hideTooltipTimer);
    let tooltipContent = (d.link !== "Continuous review") ? (`
            <div><span class="tooltip-dot" style="background-color: #FF0000;"></span><strong>High:</strong> ${d.high}</div>
            <div><span class="tooltip-dot" style="background-color: #FFA500;"></span>Medium: ${d.medium}</div>
            <div><span class="tooltip-dot" style="background-color: #008000;"></span>Low: ${d.low}</div>` +
        ((d.link.startsWith('http')) ? `<a href="${d.link}" target="_blank">Read full audit</a>` : `${d.link}
        `)) : `<div>${d.link}</div>`;


        tooltip.html(tooltipContent)
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
    .style("fill", "var(--text-color)")
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
    .style("fill", "var(--text-color)")
    .style("font-style", "italic")
    .style("font-size", "10px");

// Add x-axis
svg.append("g")
    .attr("class", "x-axis")
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
    .style("fill", "var(--text-color)")
    .text("Vyper Audit Timeline 2023-24");

svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2 + 20) // Position this slightly below the title
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("font-style", "italic")
    .style("fill", "var(--text-color)")
    .text("(Retainer engagements marked with lighter colored bars)");

svg.select(".x-axis")
    .selectAll("line, path")
    .style("stroke", "var(--text-color)");
})();