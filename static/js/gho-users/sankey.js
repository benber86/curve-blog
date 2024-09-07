function createSankeyChart(firstOrder, secondOrder) {
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = document.getElementById('sankey-chart').offsetWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#sankey-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .nodeAlign(d3.sankeyLeft)
        .extent([[1, 1], [width - 1, height - 6]]);

    const links = [];
    const nodes = new Map();

    function addNode(name) {
        if (!nodes.has(name)) {
            nodes.set(name, {name: name, inLinks: [], outLinks: []});
        }
        return nodes.get(name);
    }

    function addLink(source, target, value) {
        const link = {source: addNode(source), target: addNode(target), value: value};
        links.push(link);
        link.source.outLinks.push(link);
        link.target.inLinks.push(link);
    }

    firstOrder.forEach(d => addLink(d.from, d.to, d.amount));
    secondOrder.forEach(d => addLink(d.from, d.to, d.amount));

    const graph = {
        nodes: Array.from(nodes.values()),
        links: links
    };

    sankey(graph);

    const colorScale = d3.scaleOrdinal(d3.schemePastel1);

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
        .text(d => d.value)
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