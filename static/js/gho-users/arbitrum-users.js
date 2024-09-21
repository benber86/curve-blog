function createArbiCompareChart() {
    const ctx = document.getElementById('arbiCompare').getContext('2d');

    const data = {
        labels: [['GHO Loans', 'liquidated (%)'], ['Estimated Leverage', 'prevalence (%)'], 'Median Health'],
        datasets: [
            {
                label: 'Mainnet',
                data: [6.62, 2.26, 1.67],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Arbitrum',
                data: [2.51, 1.57, 1.74],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
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
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Metrics'
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: 'Value'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: ['Health, Leverage & Liquidations', 'Mainnet vs Arbitrum'],
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', createArbiCompareChart);