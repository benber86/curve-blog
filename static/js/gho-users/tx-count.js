const data = {
    'GHO': [52.9, 17.4, 9.1, 6.1, 3.7, 2.1, 1.9, 6.8],
    'USDC': [44.7, 18.0, 9.9, 6.4, 3.9, 3.2, 2.2, 11.7],
    'USDT': [43.1, 18.1, 10.6, 7.0, 4.6, 3.0, 2.0, 11.7],
    'DAI': [53.8, 19.2, 8.2, 4.4, 3.2, 2.6, 1.4, 7.2],
    'LUSD': [59.6, 19.6, 8.4, 4.1, 1.4, 1.4, 1.9, 3.6],
    'crvUSD': [69.2, 19.9, 4.8, 2.1, 0, 0, 0, 4.1],
    'WETH': [58.0, 15.7, 7.3, 4.4, 2.5, 2.2, 1.4, 8.5],
    'WBTC': [61.0, 15.8, 8.0, 4.0, 3.1, 1.9, 1.2, 4.8],
    'LINK': [67.3, 15.2, 5.7, 2.3, 1.2, 2.3, 0.8, 5.3],
    'CRV': [55.1, 17.6, 9.1, 4.8, 4.8, 1.1, 1.6, 5.9]
};


function createTxCountChart() {

    function getColorForToken(token, alpha = 1) {
        const colors = {
            'CRV': `rgba(246, 90, 188, ${alpha})`,
            'LUSD': `rgba(188, 170, 142, ${alpha})`,
            'USDT': `rgba(75, 192, 192, ${alpha})`,   // Soft teal
            'DAI': `rgba(255, 206, 86, ${alpha})`,    // Soft yellow
            'crvUSD': `rgba(255, 129, 152, ${alpha})`, // Soft pink
            'GHO': `rgba(243, 82, 85, ${alpha})`,   // Soft purple
            'WBTC': `rgba(255, 159, 64, ${alpha})`,   // Soft orange
            'WETH': `rgba(131, 232, 117, ${alpha})`,  // Soft green
            'USDC': `rgba(184, 162, 235, ${alpha})`,   // Soft blue
            'LINK': `rgba(84, 162, 135, ${alpha})`,   // Soft blue
        };
        return colors[token] || `rgba(128, 128, 128, ${alpha})`;
    }

    const ctx = document.getElementById('txCountChart').getContext('2d');

    const datasets = Object.keys(data).map((key, index) => ({
        label: key,
        data: data[key],
        backgroundColor: getColorForToken(key,  key === 'GHO' ? 1 : 0.5),
        borderColor: getColorForToken(key,  key === 'GHO' ? 1 : 0.5),
        borderWidth: 0,
        hidden: ['LINK', 'CRV', 'LUSD', 'WBTC'].includes(key)
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8+'],
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Number of Times User Borrows Asset'
                    }
                },
                y: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Percentage of Wallets'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Asset Borrow Count Distribution',
                    font: {
                        size: 16
                    }
                },

                subtitle: {
                    display: true,
                    text: '(click asset name in legend to toggle)',
                    font: {
                        size: 12,
                        italic: true
                    },
                    padding: {
                        bottom: 20,
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        cursor: 'pointer',
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(label => {
                                label.text = label.text;
                            });
                            return labels;
                        }
                    },
                    onHover: function(event, legendItem) {
                        event.native.target.style.cursor = 'pointer';
                    },
                    onLeave: function(event, legendItem) {
                        event.native.target.style.cursor = 'default';
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', createTxCountChart);