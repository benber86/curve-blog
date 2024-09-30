document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('averageMedianAChart').getContext('2d');

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
                data: [323.28812505551116, 176.5904609645617, 204.3127572016461, 91.88657962518874, 70.96672291796193, 178.00195399236168, 129.71178612665423],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Median A',
                data: [325.0, 175.0, 203.0, 87.0, 66.0, 168.0, 124.0],
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