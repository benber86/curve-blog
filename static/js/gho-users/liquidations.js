document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('liquidationChart').getContext('2d');

    const data = {
        labels: [
            ['AAVE v3', 'Borrowers', '(excl. GHO', 'minters)'],
            ['GHO', 'Minters'],
            ['New GHO', 'Minters'],
            ['GHO Minters', 'with Previous', 'Loans on',  'AAVE']
        ],
        datasets: [{
            type: 'bar',
            label: 'Liquidation Percentage',
            data: [7.9851879984808205, 10.274270787984326, 6.117021276595745, 14.285714285714285],
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
            borderWidth: 1,
            yAxisID: 'y'
        }, {
            type: 'line',
            label: 'Average Usage Length (Months)',
            data: [9.114807134363852, 11.200724258289702, 9.100541740674954, 13.228859348198974],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 0,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: false,
            yAxisID: 'y1'
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
                    text: ['Proportion of Users', 'who Experienced a Liquidation', 'and Average Usage Length'],
                    font: {
                        size: 16
                    },
                    padding: {
                        bottom: 48
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.type === 'bar') {
                                return 'Liquidation: ' + context.parsed.y.toFixed(2) + '%';
                            } else {
                                return 'Avg. Usage: ' + context.parsed.y.toFixed(2) + ' months';
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Liquidation Percentage'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            return value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Average Usage Length (Months)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 10
                        },
                    },
                }
            }
        }
    });
});