// wealthviolin.js

const data = {'all': {'DAO': [0, 1, 4, 60, 147, 133, 61, 11], 'Trading': [526, 155, 493, 932, 922, 487, 174, 34], 'LP': [171, 279, 523, 1226, 1165, 643, 243, 44], 'UI Router': [216, 841, 802, 805, 974, 614, 210, 34], 'crvUSD': [309, 60, 104, 263, 504, 262, 76, 14], 'Lending': [76, 21, 69, 164, 224, 169, 51, 11]}, 'arbitrum': {'Trading': [185, 37, 87, 67, 84, 48, 26, 5], 'LP': [33, 36, 64, 117, 221, 165, 66, 10], 'UI Router': [51, 173, 145, 196, 263, 145, 51, 5], 'Lending': [50, 17, 55, 112, 152, 79, 17, 3]}, 'ethereum': {'DAO': [0, 1, 4, 60, 147, 133, 61, 11], 'Trading': [156, 111, 352, 827, 820, 449, 159, 33], 'LP': [76, 136, 369, 1018, 925, 549, 223, 44], 'UI Router': [94, 123, 285, 478, 689, 530, 197, 32], 'crvUSD': [309, 60, 104, 263, 504, 262, 76, 14], 'Lending': [26, 4, 14, 53, 83, 103, 38, 9]}, 'base': {'Trading': [12, 3, 13, 11, 12, 6, 2, 0], 'LP': [2, 21, 65, 47, 39, 29, 9, 0], 'UI Router': [42, 423, 307, 82, 56, 29, 7, 0]}, 'xdai': {'Trading': [22, 1, 3, 3, 10, 4, 2, 0], 'LP': [2, 0, 1, 2, 7, 3, 1, 0], 'UI Router': [0, 0, 5, 1, 9, 4, 0, 1]}, 'polygon': {'Trading': [114, 8, 4, 14, 9, 8, 2, 0], 'LP': [43, 76, 17, 42, 49, 27, 11, 1], 'UI Router': [31, 367, 78, 59, 54, 31, 7, 1]}, 'optimism': {'Trading': [16, 2, 75, 27, 15, 18, 4, 1], 'LP': [14, 15, 17, 54, 50, 50, 25, 3], 'UI Router': [12, 80, 33, 55, 64, 43, 16, 1]}, 'fraxtal': {'Trading': [0, 0, 0, 2, 4, 10, 3, 0], 'LP': [0, 0, 1, 11, 17, 25, 11, 1], 'UI Router': [0, 0, 4, 9, 31, 27, 7, 1]}, 'fantom': {'Trading': [29, 1, 2, 3, 3, 0, 1, 0], 'LP': [3, 4, 2, 5, 5, 1, 2, 0], 'UI Router': [5, 5, 4, 6, 0, 0, 0, 0]}}



const borderColorPalette = [
    'rgb(255, 124, 142)',
    'rgb(255, 183, 178)',
    'rgb(255, 198, 173)',
    'rgb(226, 220, 183)',
    'rgb(181, 214, 195)',
    'rgb(199, 186, 214)'
];

const bins = ['$0-$10', '$10-$100', '$100-$1K', '$1K-$10K', '$10K-$100K', '$100K-$1M', '$1M-$10M', '$10M+'];

function createWealthViolin(selectedChain = 'all') {
    // Clear existing chart
    d3.select("#wealtChart").html("");

    const chainData = data[selectedChain];

    // Convert absolute values to percentages
    const percentageData = Object.fromEntries(
        Object.entries(chainData).map(([category, values]) => {
            const total = values.reduce((sum, value) => sum + value, 0);
            const percentages = values.map(value => (value / total) * 100);
            return [category, percentages];
        })
    );
    const maxPercentage = Math.max(...Object.values(percentageData).flatMap(arr => arr));


    // Set up dimensions
    const margin = {top: 40, right: 20, bottom: 50, left: 80};
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#wealtChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand()
        .domain(bins)
        .range([0, width])

    const categories = Object.keys(percentageData);
    const yCategory = d3.scaleBand()
        .domain(categories)
        .range([height, 0]);

    const y = d3.scaleLinear()
        .domain([0, maxPercentage * 1.05])
        .range([yCategory.bandwidth(), 0]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("padding", "10px");

    // Create ridgeline plot
    categories.forEach((category, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(0,${yCategory(category)})`);

        if (i < categories.length) {
            g.append("line")
                .attr("class", "grid-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("stroke", "#ddd")
                .attr("y1", yCategory.bandwidth())
                .attr("y2", yCategory.bandwidth());
        }

        const categoryColor = borderColorPalette[i % borderColorPalette.length];

        g.selectAll("rect")
            .data(percentageData[category])
            .enter().append("rect")
            .attr("x", (d, i) => x(bins[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => yCategory.bandwidth() - y(d))
            .attr("fill", categoryColor)
            .attr("opacity", 0.8)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 1);
                const binIndex = d3.select(this.parentNode).selectAll("rect").nodes().indexOf(this);
                const absoluteValue = chainData[category][binIndex];
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`${d.toFixed(2)}% of wallets in the ${bins[binIndex]} range`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("opacity", 0.8);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        g.append("text")
            .attr("x", -5)
            .attr("y", yCategory.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("font-size", "12px")  // Reduced font size for y-axis labels
            .text(category);
    });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(`Wealth Distribution - ${selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)}`);
}
// Export the function to make it accessible globally
window.createWealthViolin = createWealthViolin;

function updateWealthTable(selectedChain) {
    const tableContent = createWealthTable(selectedChain);
    document.getElementById('wealthTableContainer').innerHTML = tableContent;
}

document.addEventListener('DOMContentLoaded', function() {
    const initialChain = createChainSelector('chainWealthViolinSelector', (selectedChain) => {
        createWealthViolin(selectedChain);
        updateWealthTable(selectedChain);
    });
    createWealthViolin(initialChain);
    updateWealthTable(initialChain);
});