document.addEventListener('DOMContentLoaded', function() {
    const data = {
        'USDC': {'USDC': 100.0, 'USDT': 35.0, 'WETH': 27.4, 'wstETH': 27.6, 'DAI': 45.5, 'WBTC': 40.1, 'GHO': 40.0, 'LUSD': 54.1, 'PYUSD': 58.7, 'crvUSD': 51.4},
        'USDT': {'USDC': 32.5, 'USDT': 100.0, 'WETH': 22.9, 'wstETH': 23.1, 'DAI': 40.4, 'WBTC': 38.3, 'GHO': 30.0, 'LUSD': 48.6, 'PYUSD': 53.5, 'crvUSD': 52.7},
        'WETH': {'USDC': 13.3, 'USDT': 11.9, 'WETH': 100.0, 'wstETH': 36.6, 'DAI': 16.2, 'WBTC': 30.3, 'GHO': 17.2, 'LUSD': 17.9, 'PYUSD': 20.6, 'crvUSD': 24.7},
        'wstETH': {'USDC': 2.7, 'USDT': 2.5, 'WETH': 7.5, 'wstETH': 100.0, 'DAI': 4.5, 'WBTC': 8.0, 'GHO': 5.9, 'LUSD': 8.6, 'PYUSD': 5.2, 'crvUSD': 11.6},
        'DAI': {'USDC': 11.6, 'USDT': 11.1, 'WETH': 8.6, 'wstETH': 11.7, 'DAI': 100.0, 'WBTC': 14.0, 'GHO': 17.3, 'LUSD': 32.8, 'PYUSD': 26.1, 'crvUSD': 35.6},
        'WBTC': {'USDC': 5.4, 'USDT': 5.6, 'WETH': 8.5, 'wstETH': 11.0, 'DAI': 7.4, 'WBTC': 100.0, 'GHO': 6.4, 'LUSD': 11.7, 'PYUSD': 9.0, 'crvUSD': 15.1},
        'GHO': {'USDC': 9.1, 'USDT': 7.3, 'WETH': 8.1, 'wstETH': 13.4, 'DAI': 15.4, 'WBTC': 10.7, 'GHO': 100.0, 'LUSD': 31.3, 'PYUSD': 31.0, 'crvUSD': 35.6},
        'LUSD': {'USDC': 2.2, 'USDT': 2.2, 'WETH': 1.5, 'wstETH': 3.6, 'DAI': 5.3, 'WBTC': 3.6, 'GHO': 5.7, 'LUSD': 100.0, 'PYUSD': 13.5, 'crvUSD': 18.5},
        'PYUSD': {'USDC': 1.8, 'USDT': 1.8, 'WETH': 1.3, 'wstETH': 1.6, 'DAI': 3.1, 'WBTC': 2.0, 'GHO': 4.2, 'LUSD': 10.0, 'PYUSD': 100.0, 'crvUSD': 14.4},
        'crvUSD': {'USDC': 0.7, 'USDT': 0.8, 'WETH': 0.7, 'wstETH': 1.7, 'DAI': 2.0, 'WBTC': 1.6, 'GHO': 2.3, 'LUSD': 6.5, 'PYUSD': 6.8, 'crvUSD': 100.0}
    };

    const tokens = Object.keys(data);

    // Flip rows and columns
    const flippedData = tokens.map(tokenB => ({
        name: tokenB,
        data: tokens.map(tokenA => ({
            x: tokenA,
            y: parseFloat(data[tokenA][tokenB].toFixed(1))
        }))
    }));

    const options = {
        series: flippedData,
        chart: {
            type: 'heatmap',
            height: 600,
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#000'],
                fontWeight: 100,
            },
            formatter: function(val) {
                return val.toFixed(1) + '%';
            }
        },
        colors: ["#008FFB"],
        title: {
            text: 'Borrowed Asset Co-utilization Heatmap',
            align: 'center'
        },
        tooltip: {
            custom: function({series, seriesIndex, dataPointIndex, w}) {
                const tokenA = w.globals.seriesNames[seriesIndex];
                const tokenB = w.globals.labels[dataPointIndex];
                const value = series[seriesIndex][dataPointIndex];
                return `<div class="custom-tooltip">
                    ${value}% of users who borrowed ${tokenA} also borrowed ${tokenB}
                </div>`;
            }
        },
        xaxis: {
            type: 'category',
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            reversed: true
        }
    };

    const chart = new ApexCharts(document.querySelector("#borrowedHeatmap"), options);
    chart.render();
});