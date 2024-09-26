function generateSurfaceData(minA, maxA, p, x1, x2, maxTradeSize) {
    const data = [];
    const balancedXp = [x1, x2];
    const totalBalance = x1 + x2;
    const D = getStableD(balancedXp, minA);
    const truncate = 0.05;
    const xMin = Math.floor(D * truncate);
    const xMax = getStableY(minA, xMin, balancedXp);

    const xStep = (xMax - xMin) / 20;
    const tradeSizeStep = maxTradeSize / 20;

    for (let tradeSize = 0; tradeSize <= maxTradeSize; tradeSize += tradeSizeStep) {
        const row = {
            key: tradeSize,
            values: []
        };
        const delta = tradeSize / totalBalance;
        const currentA = calculateDynamicA(minA, maxA, delta, p);

        for (let x = xMin; x <= xMax; x += xStep) {
            const y = getStableY(currentA, Math.floor(x), balancedXp);
            row.values.push({
                key: x,
                value: y
            });
        }
        data.push(row);
    }
    return data;
}

let chart3d;
let myChart3d;

function updateChart3d() {
    const minA = parseInt(document.getElementById('minA3d').value);
    const maxA = parseInt(document.getElementById('maxA3d').value);
    const p = parseFloat(document.getElementById('p3d').value);
    const x1 = 5000;
    const x2 = 5000;
    const maxTradeSize = 4000;

    document.getElementById('minA3dValue').textContent = minA;
    document.getElementById('maxA3dValue').textContent = maxA;
    document.getElementById('p3dValue').textContent = p.toFixed(2);

    const surfaceData = generateSurfaceData(minA, maxA, p, x1, x2, maxTradeSize);

    if (!myChart3d) {
        myChart3d = d3.x3d.chart.surfacePlot()
            .width(800)
            .height(500)
            .xScale(d3.scaleLinear().domain([0, 20000]))
            .yScale(d3.scaleLinear().domain([0, 20000]))
            .zScale(d3.scaleLinear().domain([0, maxTradeSize]));
    }

    if (!chart3d) {
        const chartHolder = d3.select("#chartholder3d");
        chart3d = chartHolder.datum(surfaceData).call(myChart3d);
    } else {
        chart3d.datum(surfaceData).call(myChart3d);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateChart3d();

    // Add event listeners to the 3D chart input elements
    const inputs3d = document.querySelectorAll('#minA3d, #maxA3d, #p3d');
    inputs3d.forEach(input => {
        input.addEventListener('input', updateChart3d);
    });
});