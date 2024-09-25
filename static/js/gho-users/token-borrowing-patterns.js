document.addEventListener('DOMContentLoaded', function() {
    const data = {
        'GHO': [24.12, 26.69, 13.37, 35.83],
        'USDC': [13.03, 17.72, 24.48, 44.77],
        'USDT': [15.71, 20.77, 17.61, 45.91],
        'DAI': [27.11, 19.85, 27.86, 25.17],
        'LUSD': [33.26, 31.81, 19.75, 15.18],
        'PYUSD': [23.23, 45.16, 17.10, 14.52],
        'crvUSD': [24.66, 45.21, 13.70, 16.44],
        'WETH': [17.37, 19.51, 21.27, 41.85],
        'wstETH': [15.04, 34.46, 17.33, 33.17],
        'WBTC': [26.73, 25.79, 22.74, 24.74],
        'CRV': [42.16, 13.78, 26.76, 17.30],
    };

    const labels = [
        'Started with other token (V2) then borrowed token',
        'Started with other token (V3) then borrowed token',
        'Started by borrowing token then borrowed other tokens',
        'Started by borrowing token and never borrowed other tokens',
    ];

    const ctx = document.getElementById('tokenBorrowingPatterns').getContext('2d');

    const barLabelsPlugin = {
        id: 'barLabels',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

            ctx.save();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(0,0,0, 0.0)';

            data.datasets.forEach((dataset, datasetIndex) => {
                chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
                    const value = dataset.data[index];
                    if (value > 5) { // Only show label if value is greater than 5%
                        const xValue = bar.x;
                        const yValue = bar.y;
                        const barWidth = bar.width;
                        const barHeight = bar.height;

                        const labelX = xValue - barWidth / 2;
                        const labelY = yValue;

                        ctx.fillText(`${value}%`, labelX, labelY);
                    }
                });
            });

            ctx.restore();
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: labels.map((label, index) => ({
                label: label,
                data: Object.values(data).map(arr => arr[index]),
                backgroundColor: getColor(index),
            }))
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Users' Borrowing Patterns on AAVE per Borrowed Asset",
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.formattedValue}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    max: 100
                },
                y: {
                    stacked: true,
                    title: {
                        display: false,
                        text: 'Token'
                    },
                    ticks: {
                        font: function(context) {
                            if (context.tick.label === 'GHO') {
                                return {
                                    weight: 'bold'
                                };
                            }
                        }
                    }
                }
            }
        },
        plugins: [barLabelsPlugin]
    });

    function getColor(index) {
        const colors = ['#FF6384CC', '#36A2EBCC', '#FFCE56CC', '#4BC0C0CC'];
        return colors[index % colors.length];
    }
});