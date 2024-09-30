document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('averageMedianAChartD').getContext('2d');

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
                label: 'Average A',
                data: [177.89999111821655, 103.66610415371406, 107.15078307724191, 60.9445480652515, 50.40862125114723, 139.37723894958108, 114.81152855493383],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Median A',
                data: [174.0, 100.0, 102.0, 57.0, 47.0, 133.0, 111.0],
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
                    text: 'Average and Median A Comparison'
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
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'A Value'
                    },
                    beginAtZero: true
                }
            }
        }
    });
});