document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('liqPropChart').getContext('2d');

    const data = {
        'USDC': {'Total borrowers': 10076, 'Total liqs': 822, 'Total liqs %:': 8.157999206034141},
        'USDT': {'Total borrowers': 9362, 'Total liqs': 834, 'Total liqs %:': 8.90835291604358},
        'WETH': {'Total borrowers': 4877, 'Total liqs': 97, 'Total liqs %:': 1.9889276194381793},
        'DAI': {'Total borrowers': 2573, 'Total liqs': 167, 'Total liqs %:': 6.490478041197047},
        'GHO': {'Total borrowers': 2297, 'Total liqs': 152, 'Total liqs %:': 6.617326948193296},
        'WBTC': {'Total borrowers': 1368, 'Total liqs': 49, 'Total liqs %:': 3.5818713450292394},
        'wstETH': {'Total borrowers': 1004, 'Total liqs': 16, 'Total liqs %:': 1.593625498007968},
        'LINK': {'Total borrowers': 513, 'Total liqs': 19, 'Total liqs %:': 3.7037037037037033},
        'LUSD': {'Total borrowers': 418, 'Total liqs': 14, 'Total liqs %:': 3.349282296650718},
        'PYUSD': {'Total borrowers': 310, 'Total liqs': 31, 'Total liqs %:': 10.0},
        'CRV': {'Total borrowers': 187, 'Total liqs': 4, 'Total liqs %:': 2.13903743315508},
        'crvUSD': {'Total borrowers': 146, 'Total liqs': 4, 'Total liqs %:': 2.73972602739726},
    };

    const labels = Object.keys(data);
    const totalLoans = labels.map(label => data[label]['Total borrowers']);
    const totalLiqs = labels.map(label => data[label]['Total liqs']);
    const liqPercentages = labels.map(label => data[label]['Total liqs %:']);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Non-liquidated Borrowers',
                    data: totalLoans.map((total, i) => total - totalLiqs[i]),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    stack: 'Stack 0',
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Liquidated Borrowers',
                    data: totalLiqs,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    stack: 'Stack 0',
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Liquidation Percentage',
                    data: liqPercentages,
                    type: 'line',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: ['Loans and Liquidations', 'by Specific Asset'],
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: function(context) {
                            if (context.datasetIndex === 2) {
                                return 'line';
                            }
                            return 'rect';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Loans'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Liquidation Percentage'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
});