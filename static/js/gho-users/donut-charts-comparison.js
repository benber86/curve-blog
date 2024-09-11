document.addEventListener('DOMContentLoaded', function() {
    const data = {
        chains: {
            v3: {'Arbitrum': 2.8317737130010325, 'Ethereum': 92.94438520557951, 'Others': 4.223841081419457},
            gho: {'Arbitrum': 7.161821318550868, 'Base': 2.02332688079016, 'Ethereum': 84.34180686871849, 'Others': 6.473044931940483}
        },
        protocols: {
            v3: {'Aave V3': 50.331539165248685, 'LIDO': 5.828553909900142, 'Compound V3': 3.243393698307933, 'ether.fi': 7.053622380593481, 'StakeFish': 5.938833832076734, 'Others': 27.6040570138732},
            gho: {'Aave V3': 47.57423822285428, 'Aave V2': 3.8889807155949736, 'Gnosis Safe': 4.973840929213128, 'Spark': 5.2588929278096685, 'Pendle V2': 2.9756756103735316, 'Maker': 3.739317294872934, 'Others': 31.589054299281074}
        },
        tokens: {
            v3: {'ETH': 2.699522659547145, 'Aave Ethereum USDT': 3.4377217062545595, 'Tether USD': 2.061395902768851, 'Aave Ethereum USDC': 3.8664322688510366, 'Aave Ethereum WETH': 9.355962728144851, 'Liquid staked Ether 2.0': 2.909949094530358, 'Aave Ethereum WBTC': 7.072219699372286, 'Aave Ethereum wstETH': 7.41539591247186, 'Wrapped Ether': 9.870923956644937, 'Wrapped BTC': 11.870284867109497, 'EtherFi wrapped ETH': 5.347070379752513, 'Aave Ethereum weETH': 5.165400315349687, 'Others': 28.9277205092025},
            gho: {'stk GHO': 3.2954146349804043, 'Aave Ethereum WETH': 7.747159570062283, 'Aave Ethereum wstETH': 16.220181758667874, 'Staked Aave': 3.754801533979244, 'Aave Ethereum AAVE': 3.524551178270903, 'Aave Ethereum WBTC': 12.048423925840138, 'Aave Ethereum weETH': 5.320052237192876, 'Aave Ethereum sDAI': 2.083814796597568, 'Gnosis Token': 3.9194522222476214, 'Pendle Market': 2.2587878020153522, 'Spark wstETH': 3.6457541807253144, 'Savings Dai': 4.847182147647669, 'Spark WETH': 2.7347295598567842, 'Others': 28.599694451916136}
        }
    };

    const colorPalette = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#C9CBCF', '#83D475', '#F78C6C', '#7B7FEC', '#C284B5', '#F66D44',
        '#B29868', '#68AACC', '#FF7070', '#9EC2E6', '#E0B3FC', '#FFD700'
    ];

    const customDataLabels = {
        id: 'customDataLabels',
        afterDraw(chart, args, options) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

            ctx.save();
            const fontSize = 12;
            ctx.font = `{fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.color = '#CCC'
            ctx.textBaseline = 'middle';

            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const radius = Math.min(width, height) / 2 * 0.8;

            chart.data.datasets[0].data.forEach((value, i) => {
                const meta = chart.getDatasetMeta(0);
                const arc = meta.data[i];
                const startAngle = arc.startAngle;
                const endAngle = arc.endAngle;
                const middleAngle = startAngle + (endAngle - startAngle) / 2;

                const x = centerX + Math.cos(middleAngle) * radius;
                const y = centerY + Math.sin(middleAngle) * radius;
                if (value > 1) {
                    ctx.fillStyle = 'white';
                    ctx.fillText(`${value.toFixed(1)}%`, x, y);
                }
            });

            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return ' ' + context.formattedValue + '%';
                    }
                },
                titleAlign: 'center',
            }
        },
        layout: {
            padding: {
                top: 20,
                bottom: 10
            }
        }
    };

    function createDonutChart(ctx, data, title) {
        const sortedData = Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(sortedData),
                datasets: [{
                    data: Object.values(sortedData),
                    backgroundColor: colorPalette.slice(0, Object.keys(sortedData).length),
                    borderWidth: 0,
                    rotation: 275
                }]
            },
            options: {
                ...options,
                cutout: '60%',
                plugins: {
                    ...options.plugins,
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: [customDataLabels]
        });
    }

    let chart1, chart2;

    function updateCharts(dataType) {
        if (chart1) {
            chart1.destroy();
        }
        if (chart2) {
            chart2.destroy();
        }

        const ctx1 = document.getElementById('donutChart10').getContext('2d');
        const ctx2 = document.getElementById('donutChart20').getContext('2d');

        updateMainTitle(dataType);
        chart1 = createDonutChart(ctx1, data[dataType].v3, `V3 Users`);
        chart2 = createDonutChart(ctx2, data[dataType].gho, `GHO Users`);
    }

    function updateMainTitle(dataType) {
        const mainTitle = document.getElementById('portfolioMainTitle');
        mainTitle.textContent = `Total Portfolio Value Breakdown by ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`;
    }

    const dropdown = document.createElement('select');
    dropdown.id = 'dataSelector';
    dropdown.style.padding = '5px';
    dropdown.style.fontSize = '16px';
    dropdown.style.marginBottom = '20px';

    const choices = ['Tokens', 'Protocols', 'Chains'];
    choices.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option.toLowerCase();
        dropdown.appendChild(el);
    });

    const chartContainer = document.getElementById('portfolioChart').closest('div');
    chartContainer.parentNode.insertBefore(dropdown, chartContainer);
    const mainTitle = document.createElement('h4');
    mainTitle.id = 'portfolioMainTitle';
    mainTitle.style.textAlign = 'center';
    mainTitle.style.color = '#666';
    mainTitle.style.marginBottom = '12px';

    chartContainer.parentNode.insertBefore(mainTitle, chartContainer);

    dropdown.addEventListener('change', function() {
        updateCharts(this.value);
    });

    updateCharts('tokens');
});