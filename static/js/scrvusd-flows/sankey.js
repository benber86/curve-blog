let firstOrderVol, secondOrderVol;

function createSankeyChart() {
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = document.getElementById('sankey-chart').offsetWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    d3.select("#sankey-chart").html("");

    const svg = d3.select("#sankey-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .nodeAlign(d3.sankeyCenter)
        .extent([[1, 1], [width - 1, height - 6]]);

    const links = [];
    const nodes = new Map();

    function addNode(name, column) {
        if (!nodes.has(name)) {
            nodes.set(name, {name: name, column: column});
        }
        return nodes.get(name);
    }

    function addLink(source, target, value) {
        links.push({source: source, target: target, value: value});
    }

    // Add second order links (left to middle)
    secondOrderVol.forEach(d => {
        const source = addNode(d.from, 0);
        const target = addNode(d.to, 1);
        addLink(source, target, d.amount);
    });

    // Add first order links (middle to right)
    firstOrderVol.forEach(d => {
        const source = addNode(d.from, 1);
        const target = addNode(d.to, 2);
        addLink(source, target, d.amount);
    });

    const graph = {
        nodes: Array.from(nodes.values()),
        links: links
    };

    sankey(graph);

    const colorScale = d3.scaleOrdinal(d3.schemePastel2);

    svg.append("g")
        .selectAll("rect")
        .data(graph.nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => colorScale(d.name))
        .append("title")
        .text(d => `${d.name}\n${d.value}`);

    const link = svg.append("g")
        .attr("fill", "none")
        .selectAll("g")
        .data(graph.links)
        .join("g")
        .attr("class", "link")
        .on("mouseover", function() {
            d3.select(this).select("path").attr("stroke-opacity", 0.5);
            d3.select(this).select(".link-tooltip").style("display", "block");
        })
        .on("mouseout", function() {
            d3.select(this).select("path").attr("stroke-opacity", 0.2);
            d3.select(this).select(".link-tooltip").style("display", "none");
        });

    link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => colorScale(d.source.name))
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("stroke-opacity", 0.2);

    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

    link.append("text")
        .attr("class", "link-tooltip")
        .attr("dy", -5)
        .attr("text-anchor", "middle")
        .text(d => d.value.toFixed(2))
        .style("display", "none")
        .attr("transform", d => {
            const x = (d.source.x1 + d.target.x0) / 2;
            const y = (d.y1 + d.y0) / 2;
            return `translate(${x},${y})`;
        });

    svg.append("g")
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(graph.nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);
}

function loadData() {
    Promise.all([
        d3.json("../../js/scrvusd-flows/first_order_vol.json"),
        d3.json("../../js/scrvusd-flows/second_order_vol.json")
    ]).then(function([firstOrderVolData, secondOrderVolData]) {
        firstOrderVol = firstOrderVolData;
        secondOrderVol = secondOrderVolData;
        createSankeyChart();
    });
}

loadData();