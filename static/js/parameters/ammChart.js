document.addEventListener('DOMContentLoaded', function () {
    let ctx = document.getElementById('ammCompChart').getContext('2d');
    let aSliderComp = document.getElementById('aSliderComp');
    let aValueComp = document.getElementById('aValueComp');
    let ammChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'StableSwap',
                data: [],
                borderColor: 'blue',
                backgroundColor: 'transparent',
                pointRadius: 0,
                fill: false,
                borderWidth: 1
            },
                {
                    label: 'Constant Sum AMM',
                    data: [],
                    borderColor: 'green',
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    fill: false,
                    borderWidth: 1
                },
                {
                    label: 'Constant Product AMM',
                    data: [],
                    borderColor: 'red',
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    fill: false,
                    borderWidth: 1
                }

            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        boxHeight: 1
                    }
                }
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 30,
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'X value'
                    }
                },
                y: {
                    min: 0,
                    max: 30,
                    title: {
                        display: true,
                        text: 'Y value'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart() {
        let A = parseInt(aSliderComp.value);
        aValueComp.textContent = A;
        let x1 = 5;
        let x2 = 5;
        let xp = [x1, x2];
        let i = 0;
        let j = 1;

        let start = 0.01;
        let end = 30;

        let resolution = 500;
        let xs = Array.from({length: resolution}, (_, i) =>
            (start + (i / (resolution - 1)) * (end - start)))
        // Handle JS float precision issue by working in 1e4 units since not doing units of D
        let ys = xs.map(x => getY(A, i, j, x * 1000, xp.map(x => x * 1000)));

        data = xs.map((x, index) => ({x: x, y: ys[index] / 1000}));
        ammChart.data.datasets[0].data = data;
        let k_sum = x1 + x2;
        let k_product = x1 * x2;

        let constantSumData = xs.map(x => ({x: x, y: k_sum - x}));
        let constantProductData = xs.map(x => ({x: x, y: k_product / x}));
        ammChart.data.datasets[1].data = constantSumData;
        ammChart.data.datasets[2].data = constantProductData;



        ammChart.update();
    }

    aSliderComp.addEventListener('input', updateChart);

    updateChart();
});