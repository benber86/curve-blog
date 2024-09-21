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
                    text: [['Proportion of Users who'], ['Experienced a Liquidation'], ['(Any Asset/Loan)']],
                    font: {
                        size: 16
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
                        display: true,
                        text: 'Percentage'
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