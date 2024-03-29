document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('xpiSlider2').addEventListener('input', e => document.getElementById('xpiNumber2').value = e.target.value);
    document.getElementById('xpiNumber2').addEventListener('input', e => document.getElementById('xpiSlider2').value = e.target.value);
    document.getElementById('xpjSlider2').addEventListener('input', e => document.getElementById('xpjNumber2').value = e.target.value);
    document.getElementById('xpjNumber2').addEventListener('input', e => document.getElementById('xpjSlider2').value = e.target.value);
    document.getElementById('feeSlider2').addEventListener('input', e => document.getElementById('feeNumber2').value = e.target.value);
    document.getElementById('feeNumber2').addEventListener('input', e => document.getElementById('feeSlider2').value = e.target.value);
    document.getElementById('offpegSlider2').addEventListener('input', e => document.getElementById('offpegNumber2').value = e.target.value);
    document.getElementById('offpegNumber2').addEventListener('input', e => document.getElementById('offpegSlider2').value = e.target.value);
    document.getElementById('slippageSlider2').addEventListener('input', e => document.getElementById('slippageNumber2').value = e.target.value);
    document.getElementById('slippageNumber2').addEventListener('input', e => document.getElementById('slippageSlider2').value = e.target.value);

    document.getElementById('aSlider').addEventListener('input', e => document.getElementById('aValue').value = e.target.value);
    document.getElementById('aValue').addEventListener('input', e => document.getElementById('aSlider').value = e.target.value);

    let fixedFeesMEVChart, dynamicFeesMEVChart, fixedFeesChart, dynamicFeesChart;

    document.getElementById('xpiSlider2').addEventListener('change', updateCharts);
    document.getElementById('xpjSlider2').addEventListener('change', updateCharts);
    document.getElementById('feeSlider2').addEventListener('change', updateCharts);
    document.getElementById('offpegSlider2').addEventListener('change', updateCharts);
    document.getElementById('slippageSlider2').addEventListener('change', updateCharts);
    document.getElementById('aSlider').addEventListener('change', updateCharts);

    document.getElementById('xpiNumber2').addEventListener('change', updateCharts);
    document.getElementById('xpjNumber2').addEventListener('change', updateCharts);
    document.getElementById('feeNumber2').addEventListener('change', updateCharts);
    document.getElementById('offpegNumber2').addEventListener('change', updateCharts);
    document.getElementById('slippageNumber2').addEventListener('change', updateCharts);
    document.getElementById('aValue').addEventListener('change', updateCharts);

    function updateCharts() {
        const xpi = parseInt(document.getElementById('xpiNumber2').value, 10);
        const xpj = parseInt(document.getElementById('xpjNumber2').value, 10);
        const fee = parseInt(document.getElementById('feeNumber2').value, 10);
        const feeMul = parseInt(document.getElementById('offpegNumber2').value, 10);
        const A = parseInt(document.getElementById('aValue').value, 10);
        const slippage = parseFloat(document.getElementById('slippageNumber2').value);

        const balances = [xpi, xpj];
        const victimTrades = [100000, 500000, 750000, 1000000, 1500000, 2000000, 2500000]; // Example trade sizes

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
            let [backRunDyn, backRunDynFees] = poolDynamic.exchange(0, 1, frontRunDyn);

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
        const formatWithAbbreviations = (value, precision=1) => {
            if (Math.abs(value) >= 1e9) {
                return (value / 1e9).toFixed(precision) + 'b';
            } else if (Math.abs(value) >= 1e6) {
                return (value / 1e6).toFixed(precision) + 'm';
            } else if (Math.abs(value) >= 1e3) {
                return (value / 1e3).toFixed(precision) + 'k';
            }
            return value.toString(); // Handle values less than 1000
        };
        const formatWithAbbreviationsFloored = (value) => {return formatWithAbbreviations(value, 0)}
        const formatWithAbbreviationsNormal = (value) => {return formatWithAbbreviations(value, 1)}
        const tradeSizesFormatted = dataFixed.tradeSizes.map(tradeSize => formatWithAbbreviations(tradeSize, 1));
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
                        ticks: {callback: formatWithAbbreviationsFloored}},
                    x: {
                        title: {
                            display: true,
                            text: 'Sandwiched Trade Size'
                        },
                    }
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
                        ticks: {callback: formatWithAbbreviationsFloored}},
                    x: {
                        title: {
                            display: true,
                            text: 'Sandwiched Trade Size'
                        },
                    }
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
                        beginAtZero: false,
                        ticks: {callback: formatWithAbbreviationsNormal}
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sandwiched Trade Size'
                        },
                    }
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
                        beginAtZero: false,
                        ticks: {callback: formatWithAbbreviationsNormal}
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sandwiched Trade Size'
                        },
                    }
                }
            }
        });
    }

// Call updateCharts initially and after each slider change
    updateCharts();
});