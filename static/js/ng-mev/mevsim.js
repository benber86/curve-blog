document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('tvlSlider2').addEventListener('input', e => document.getElementById('tvlNumber2').value = e.target.value);
    document.getElementById('tvlNumber2').addEventListener('input', e => document.getElementById('tvlSlider2').value = e.target.value);
    document.getElementById('feeSlider2').addEventListener('input', e => document.getElementById('feeNumber2').value = e.target.value);
    document.getElementById('feeNumber2').addEventListener('input', e => document.getElementById('feeSlider2').value = e.target.value);
    document.getElementById('offpegSlider2').addEventListener('input', e => document.getElementById('offpegNumber2').value = e.target.value);
    document.getElementById('offpegNumber2').addEventListener('input', e => document.getElementById('offpegSlider2').value = e.target.value);
    document.getElementById('slippageSlider2').addEventListener('input', e => document.getElementById('slippageNumber2').value = e.target.value);
    document.getElementById('slippageNumber2').addEventListener('input', e => document.getElementById('slippageSlider2').value = e.target.value);

    document.getElementById('aSlider').addEventListener('input', e => document.getElementById('aValue').value = e.target.value);
    document.getElementById('aValue').addEventListener('input', e => document.getElementById('aSlider').value = e.target.value);

    let fixedFeesMEVChart, dynamicFeesMEVChart, fixedFeesChart, dynamicFeesChart;

    document.getElementById('tvlSlider2').addEventListener('change', updateCharts);
    document.getElementById('feeSlider2').addEventListener('change', updateCharts);
    document.getElementById('offpegSlider2').addEventListener('change', updateCharts);
    document.getElementById('slippageSlider2').addEventListener('change', updateCharts);
    document.getElementById('aSlider').addEventListener('change', updateCharts);

    document.getElementById('tvlNumber2').addEventListener('change', updateCharts);
    document.getElementById('feeNumber2').addEventListener('change', updateCharts);
    document.getElementById('offpegNumber2').addEventListener('change', updateCharts);
    document.getElementById('slippageNumber2').addEventListener('change', updateCharts);
    document.getElementById('aValue').addEventListener('change', updateCharts);

    function updateCharts() {
        const tvl = parseInt(document.getElementById('tvlNumber2').value, 10);
        const fee = parseInt(document.getElementById('feeNumber2').value, 10);
        const feeMul = parseInt(document.getElementById('offpegNumber2').value, 10);
        const A = parseInt(document.getElementById('aValue').value, 10);
        const slippage = parseFloat(document.getElementById('slippageNumber2').value);

        const balances = [tvl / 2, tvl / 2];
        const victimTrades = [100000, 1000000, 2000000, 5000000, 7500000, 9000000, 10000000, 20000000]; // Example trade sizes

        let dataFixed = { tradeSizes: [], mev: [], fees: [], profits: [] };
        let dataDynamic = { tradeSizes: [], mev: [], fees: [], profits: [] };

        victimTrades.forEach(trade => {
            let poolFixed = new CurvePool(A, [...balances], 2, fee);
            let originalBalanceFixed = solveForSlippage(trade, fee, null, slippage, 0.0001, balances);
            let [frontRun, frontRunFixedFees] = poolFixed.exchange(1, 0, originalBalanceFixed);
            poolFixed.exchange(1, 0, trade);
            let [backRun, backRunFixedFees] = poolFixed.exchange(0, 1, frontRun);
            let mevFixed = backRun - originalBalanceFixed;
            let feesFixed = frontRunFixedFees + backRunFixedFees

            let poolDynamic = new CurvePool(A, [...balances], 2, fee, feeMul);
            let originalBalanceDynamic = solveForSlippage(trade, fee, feeMul, slippage, 0.0001, balances);
            let [frontRunDyn, frontRunDynFees] = poolDynamic.exchange(1, 0, originalBalanceDynamic);
            poolDynamic.exchange(1, 0, trade);
            let [backRunDyn, backRunDynFees] = poolFixed.exchange(0, 1, frontRunDyn);

            let mevDynamic = backRunDyn - originalBalanceDynamic;
            let feesDynamic = frontRunDynFees + backRunDynFees

            dataFixed.tradeSizes.push(trade);
            dataFixed.mev.push(mevFixed);
            dataFixed.fees.push(feesFixed);
            dataFixed.profits.push(mevFixed - feesFixed);

            dataDynamic.tradeSizes.push(trade);
            dataDynamic.mev.push(mevDynamic);
            dataDynamic.fees.push(feesDynamic);
            dataDynamic.profits.push(mevDynamic - feesDynamic);
        });

        drawCharts(dataFixed, dataDynamic);
    }

    function drawCharts(dataFixed, dataDynamic) {
        const formatWithAbbreviations = (value) => {
            if (Math.abs(value) >= 1e9) {
                return (value / 1e9).toFixed(0) + 'b';
            } else if (Math.abs(value) >= 1e6) {
                return (value / 1e6).toFixed(0) + 'm';
            } else if (Math.abs(value) >= 1e3) {
                return (value / 1e3).toFixed(0) + 'k';
            }
            return value.toString(); // Handle values less than 1000
        };
        const tradeSizesFormatted = dataFixed.tradeSizes.map(tradeSize => formatWithAbbreviations(tradeSize));
        if (fixedFeesMEVChart) fixedFeesMEVChart.destroy();
        fixedFeesMEVChart = new Chart(document.getElementById('fixedFeesMEVChart'), {
            type: 'bar',
            data: {
                labels: tradeSizesFormatted,
                datasets: [{
                    label: 'MEV',
                    data: dataFixed.mev,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }, {
                    label: 'Profits',
                    data: dataFixed.profits,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                scales: {
                    y: {beginAtZero: false,
                        ticks: {callback: formatWithAbbreviations}},
                }
            }
        });

        if (dynamicFeesMEVChart) dynamicFeesMEVChart.destroy();
        dynamicFeesMEVChart = new Chart(document.getElementById('dynamicFeesMEVChart'), {
            type: 'bar',
            data: {
                labels: tradeSizesFormatted,
                datasets: [{
                    label: 'MEV',
                    data: dataDynamic.mev,
                    backgroundColor: 'rgba(255, 159, 64, 0.5)'
                }, {
                    label: 'Profits',
                    data: dataDynamic.profits,
                    backgroundColor: 'rgba(153, 102, 255, 0.5)'
                }]
            },
            options: {
                scales: {
                    y: {beginAtZero: false,
                        ticks: {callback: formatWithAbbreviations}},
                }
            }
        });

        // Fixed Fees: Fees Chart
        if (fixedFeesChart) fixedFeesChart.destroy();
        fixedFeesChart = new Chart(document.getElementById('fixedFeesChart'), {
            type: 'line',
            data: {
                labels: tradeSizesFormatted,
                datasets: [{
                    label: 'Fees',
                    data: dataFixed.fees,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            boxHeight: 1
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {callback: formatWithAbbreviations}
                    },
                }
            }
        });

        // Dynamic Fees: Fees Chart
        if (dynamicFeesChart) dynamicFeesChart.destroy();
        dynamicFeesChart = new Chart(document.getElementById('dynamicFeesChart'), {
            type: 'line',
            data: {
                labels: tradeSizesFormatted,
                datasets: [{
                    label: 'Fees',
                    data: dataDynamic.fees,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            boxHeight: 1
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {callback: formatWithAbbreviations}
                    },
                }
            }
        });
    }

// Call updateCharts initially and after each slider change
    updateCharts();
});