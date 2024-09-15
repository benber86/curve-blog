document.addEventListener('DOMContentLoaded', function() {
    const data = {
        'GHO': {'WETH': 25.92, 'wstETH': 13.19, 'WBTC': 12.38, 'USDC': 12.29, 'AAVE': 6.68, 'USDT': 6.06, 'LINK': 5.90, 'DAI': 4.60, 'Others': 12.99},
        'All v3': {'WETH': 37.13, 'WBTC': 15.36, 'wstETH': 10.34, 'USDC': 9.66, 'USDT': 5.76, 'LINK': 5.66, 'DAI': 4.38, 'AAVE': 2.83, 'Others': 8.86},
        'USDC': {'WETH': 35.33, 'WBTC': 16.78, 'wstETH': 11.06, 'USDC': 9.88, 'LINK': 6.62, 'USDT': 4.11, 'DAI': 3.57, 'AAVE': 3.54, 'Others': 9.09},
        'USDT': {'WETH': 35.81, 'WBTC': 18.59, 'wstETH': 9.70, 'USDT': 7.14, 'USDC': 6.88, 'LINK': 6.78, 'AAVE': 4.07, 'DAI': 2.56, 'Others': 8.47},
        'DAI': {'WETH': 28.99237933954276,
            'WBTC': 15.87,
            'wstETH': 10.72,
            'USDC': 8.40,
            'DAI': 7.38,
            'LINK': 6.45,
            'USDT': 5.71,
            'AAVE': 3.70,
            'Others': 12.78},
        'crvUSD': {'WETH': 20.27,
            'WBTC': 17.08,
            'wstETH': 12.07,
            'USDC': 10.48,
            'USDT': 6.60,
            'AAVE': 6.60,
            'LINK': 4.10,
            'Others': 22.78},
        'LUSD': {'WETH': 21.45, 'WBTC': 13.34, 'wstETH': 11.40, 'USDC': 10.81, 'DAI': 6.59, 'USDT': 6.50, 'LINK': 5.83, 'Others': 24.07},
        'WETH': {'WETH': 25.95, 'USDC': 14.12, 'wstETH': 13.61, 'WBTC': 12.77, 'USDT': 7.93, 'DAI': 7.07, 'LINK': 4.09, 'AAVE': 2.92, 'Others': 11.54},
        'WBTC': {'WETH': 25.75, 'WBTC': 18.29, 'USDC': 15.24, 'USDT': 9.88, 'wstETH': 8.14, 'DAI': 5.75, 'LINK': 4.07, 'AAVE': 2.72, 'Others': 10.15},
        'LINK': {'WETH': 25.92, 'LINK': 16.90, 'USDC': 12.62, 'WBTC': 11.12, 'USDT': 9.24, 'wstETH': 6.09, 'AAVE': 5.63, 'DAI': 4.73, 'Others': 7.74},
        'CRV': {'WETH': 21.02, 'USDC': 17.18, 'WBTC': 10.60, 'wstETH': 9.32, 'USDT': 9.14, 'DAI': 7.86, 'Others': 24.86}
    };

    const tokens = ['WETH', 'wstETH', 'WBTC', 'USDC', 'AAVE', 'USDT', 'LINK', 'DAI', 'Others'];
    const colors = ['#FF6384CC', '#36A2EBCC', '#FFCE56CC', '#4BC0C0CC', '#9966FFCC',
        '#FF9F40CC', '#00CC99CC', '#FF66F2CC', '#695999CC'];

    const ctx = document.getElementById('collatPreference').getContext('2d');

    const datasets = tokens.map((token, index) => ({
        label: token,
        data: Object.keys(data).map(borrower => data[borrower][token] || 0),
        backgroundColor: colors[index],
        borderColor: 'white',
        borderWidth: 0.5
    }));

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Collateral Preference by Borrower Type',
                    font: { size: 18 }
                },

                tooltip: {
                    callbacks: {

                        title: () => {return ''},
                        label: function(context) {
                            const borrower = context.chart.data.labels[context.dataIndex];
                            const token = context.dataset.label;
                            const percentage = context.raw.toFixed(1);
                            return `${percentage}% of ${borrower} borrowers supplied ${token} as collateral`;
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: false,
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
                    }
                }
            }
        },
        plugins: {

        }
    });
});