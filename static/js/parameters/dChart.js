let ctx = document.getElementById('ammChart').getContext('2d');
let x1Slider = document.getElementById('x1Slider');
let x2Slider = document.getElementById('x2Slider');
let x1Value = document.getElementById('x1Value');
let x2Value = document.getElementById('x2Value');

let ammChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({length: 100}, (_, i) => i), // A values from 0 to 200
        datasets: [{
            label: 'D',
            data: [],
            borderColor: 'blue',
            backgroundColor: 'transparent',
            pointRadius: 0,
            fill: false,
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Amplification Coefficient (A)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Invariant (D)'
                },
                beginAtZero: true
            }
        }
    }
});

function calculateD(xp, A) {
    let Dprev = 0;
    let S = xp.reduce((a, b) => a + b, 0);
    let D = S;
    let n = xp.length;
    let Ann = A * n;
    while (Math.abs(D - Dprev) > 1) {
        let D_P = D;
        xp.forEach(x => {
            D_P = D_P * D / (n * x);
        });
        Dprev = D;
        D = (Ann * S + D_P * n) * D / ((Ann - 1) * D + (n + 1) * D_P);
    }
    return D;
}

function updateChart() {
    let xp = [parseInt(x1Slider.value), parseInt(x2Slider.value)];
    x1Value.textContent = x1Slider.value;
    x2Value.textContent = x2Slider.value;
    let D_values = Array.from({length: 100}, (_, A) => calculateD(xp, A + 1)); // Adjust A to start from 1

    // Calculate min and max of D with leeway
    let minD = Math.min(...D_values);
    let maxD = Math.max(...D_values);
    let leeway = 0.05; // 10% leeway
    let minDWithLeeway = Math.round((minD - (minD * leeway)) / 100) * 100;
    let maxDWithLeeway = Math.round((maxD + (maxD * leeway)) / 100) * 100;

    // Use suggestedMin and suggestedMax for the y-axis to avoid explicit min/max
    ammChart.options.scales.y.min = minDWithLeeway;
    ammChart.options.scales.y.max = maxDWithLeeway;
    ammChart.options.plugins.legend.display = false; // Disable the legend

    ammChart.data.datasets[0].data = D_values;
    ammChart.update();
}

x1Slider.oninput = updateChart;
x2Slider.oninput = updateChart;

updateChart();

