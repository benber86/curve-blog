let chart;

function updateChart() {
    const minA = parseInt(document.getElementById('minA').value);
    const maxA = parseInt(document.getElementById('maxA').value);
    const p = parseFloat(document.getElementById('expp').value);
    const x1 = parseInt(document.getElementById('x1').value);
    const x2 = parseInt(document.getElementById('x2').value);
    const tradeSize = parseInt(document.getElementById('tradeSize').value);

    document.getElementById('minAValue').textContent = minA;
    document.getElementById('maxAValue').textContent = maxA;
    document.getElementById('pValue').textContent = p.toFixed(2);
    document.getElementById('x1Value').textContent = x1;
    document.getElementById('x2Value').textContent = x2;
    document.getElementById('tradeSizeValue').textContent = tradeSize;

    const totalBalance = x1 + x2;
    const delta = tradeSize / totalBalance;
    document.getElementById('deltaValue').textContent = delta.toFixed(4);

    const currentA = calculateDynamicA(minA, maxA, delta, p);
    document.getElementById('currentAValue').textContent = currentA.toFixed(2);

    const data = generateCurveData(currentA, [x1, x2]);
    updateChartData(data, totalBalance);
}


function calculateDynamicA(minA, maxA, delta, p) {
    return minA + (maxA - minA) * Math.pow(delta, p);
}

function getStableY(A, x, xp) {
    const D = getStableD(xp, A);
    const Ann = A * 2;
    let c = Math.floor((D * D) / (x * 2));
    c = Math.floor((c * D) / (Ann * 2));
    const b = x + Math.floor(D / Ann) - D;
    let yPrev = 0;
    let y = D;
    while (Math.abs(y - yPrev) > 1) {
        yPrev = y;
        y = Math.floor((y * y + c) / (2 * y + b));
    }
    return y;
}

function getStableD(xp, A) {
    let Dprev = 0;
    const S = xp[0] + xp[1];
    let D = S;
    const Ann = A * 2;
    while (Math.abs(D - Dprev) > 1) {
        const D_P = Math.floor((D * D) / (xp[0] * 2));
        const D_P_2 = Math.floor((D_P * D) / (xp[1] * 2));
        Dprev = D;
        D = Math.floor(((Ann * S + D_P_2 * 2) * D) / ((Ann - 1) * D + 3 * D_P_2));
    }
    return Math.floor(D);
}

function generateCurveData(A, xp) {
    const D = getStableD(xp, A);
    const balancedXp = [Math.floor(D / 2), Math.floor(D / 2)];
    const truncate = 0.0005;
    const xMin = Math.floor(D * truncate);
    const xMax = getStableY(A, xMin, balancedXp);

    const points = 1000;
    const data = [];
    for (let i = 0; i < points; i++) {
        const x = xMin + (xMax - xMin) * (i / (points - 1));
        const y = getStableY(A, Math.floor(x), balancedXp);
        data.push({x, y});
    }
    return data;
}

function updateChartData(data, totalBalance) {
    const maxRange = totalBalance * 2; // Adjust this multiplier as needed

    if (chart) {
        chart.data.datasets[0].data = data;
        chart.options.scales.x.min = 0;
        chart.options.scales.x.max = maxRange;
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = maxRange;
        chart.update();
    } else {
        const ctx = document.getElementById('curveChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'StableSwap Curve',
                    data: data,
                    showLine: true,
                    borderColor: 'rgba(173, 216, 230, 1)',
                    pointRadius: 0,
                    borderWidth: 2,
                    backgroundColor: 'transparent',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x'
                        },
                        min: 0,
                        max: maxRange
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'y'
                        },
                        min: 0,
                        max: maxRange
                    }
                }
            }
        });
    }
}

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateChart();

    // Add event listeners to all input elements
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(input => {
        input.addEventListener('input', updateChart);
    });
});