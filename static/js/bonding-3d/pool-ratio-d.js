document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('poolRatioChartD').getContext('2d');

    const data = {
        labels: [
            ['0.05', '30', '500'],
            ['0.1', '30', '400'],
            ['0.1', '10', '500'],
            ['0.2', '30', '400'],
            ['0.25', '30', '400'],
            ['0.25', '100', '800'],
            ['0.3', '100', '500'],
        ],
        datasets: [
            {
                label: 'Regular Pool stETH/ETH ratio',
                data: [0.9661265123557414, 0.9661265123557414, 0.9661265123557414, 0.9661265123557414, 0.9661265123557414, 0.9661265123557414, 0.9661265123557414],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Dynamic Pool stETH/ETH ratio',
                data: [0.9223037478080613, 0.9079766845703125, 0.8491470336914062, 0.8943333625793457, 0.8883256912231445, 0.9564409255981445, 0.9450740814208984],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Pool stETH/ETH Ratio Comparison'
                },
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Parameters'
                    },

                    ticks: {

                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 10
                        },
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'stETH/ETH Ratio'
                    },
                    beginAtZero: false
                }
            }
        }
    });
});