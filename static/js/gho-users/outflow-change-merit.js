document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('outflowChange').getContext('2d');

    const data = {
        labels: [
            ['Stablecoins'],
            ['Providing', 'Liquidity'],
            ['Crypto', 'Assets']
        ],
        datasets: [{
            data: [-24.62, -83.43, 6.76],
            backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 205, 86, 0.7)',
                'rgba(54, 162, 235, 0.7)'
            ],
            borderColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)'
            ],
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: ['Change in Outflows After Merit',],
                    font: {
                        size: 16
                    }
                },
                subtitle: {
                    display: true,
                    text: ['Normalized for time & supply',],
                    font: {
                        size: 12,
                        italic: true
                    },
                    padding: {
                        bottom: 20,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: false,
                    },
                    grid: {
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2;
                            }
                            return 1;
                        },
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return 'rgba(0, 0, 0, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        }
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    },
                }
            }
        }
    });
});