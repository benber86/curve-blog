document.addEventListener('DOMContentLoaded', function() {
    let ctx = document.getElementById('bondingChart').getContext('2d');
    let x1InputBond = document.getElementById('x1InputBond');
    let x2InputBond = document.getElementById('x2InputBond');
    let aSliderBond = document.getElementById('aSliderBond');
    let aValueBond = document.getElementById('aValueBond');

    let bondingChart = new Chart(ctx, {
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
                    label: 'Current Position',
                    data: [],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    pointRadius: 5,
                    fill: false,
                    type: 'bubble'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'X value'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y value'
                    },
                    beginAtZero: true
                }
            }
        },

        plugins: {
            legend: {
                display: false // This line hides the legend
            }
        }
    });

    function updateChart() {
        let A = parseInt(aSliderBond.value);
        let x1 = parseInt(x1InputBond.value);
        let x2 = parseInt(x2InputBond.value);
        let xp = [x1, x2];
        let D = calculateD(xp, A);
        let i = 0;
        let j = 1;

        let truncate = 0.0005
        let start = D * truncate;
        let end = getY(A, j, i,D * truncate, xp);

        let resolution = 100;
        let xs = Array.from({length: resolution}, (_, i) =>
            Math.floor(start + (i / (resolution - 1)) * (end - start)));

        let ys = xs.map(x => getY(A, i, j, x, xp));

        data =  xs.map((x, index) => ({x: x, y: ys[index]}));
        bondingChart.data.datasets[0].data = data;
        aValueBond.textContent = A;

        let dotY = getY(A, 0, 1, x1, xp);

        bondingChart.data.datasets[1].data = [{x: x1, y: dotY}];


        bondingChart.update();

    }

    x1InputBond.addEventListener('input', updateChart);
    x2InputBond.addEventListener('input', updateChart);
    aSliderBond.addEventListener('input', updateChart);

    updateChart(); // Initial chart update
});
