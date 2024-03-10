document.addEventListener('DOMContentLoaded', function () {

    let dynamicFeesMultiplierChart;

    document.getElementById('xpiSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('xpjSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('feeSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('offpegSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('slippageSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('aSlider3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('xpiNumber3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('xpjNumber3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('feeNumber3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('offpegNumber3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('slippageNumber3').addEventListener('change', updateDynamicFeesMultiplierChart);
    document.getElementById('aValue3').addEventListener('change', updateDynamicFeesMultiplierChart);



    document.getElementById('xpiSlider3').addEventListener('input', e => document.getElementById('xpiNumber3').value = e.target.value);
    document.getElementById('xpiNumber3').addEventListener('input', e => document.getElementById('xpiSlider3').value = e.target.value);
    document.getElementById('xpjSlider3').addEventListener('input', e => document.getElementById('xpjNumber3').value = e.target.value);
    document.getElementById('xpjNumber3').addEventListener('input', e => document.getElementById('xpjSlider3').value = e.target.value);
    document.getElementById('feeSlider3').addEventListener('input', e => document.getElementById('feeNumber3').value = e.target.value);
    document.getElementById('feeNumber3').addEventListener('input', e => document.getElementById('feeSlider3').value = e.target.value);
    document.getElementById('offpegSlider3').addEventListener('input', e => document.getElementById('offpegNumber3').value = e.target.value);
    document.getElementById('offpegNumber3').addEventListener('input', e => document.getElementById('offpegSlider3').value = e.target.value);
    document.getElementById('slippageSlider3').addEventListener('input', e => document.getElementById('slippageNumber3').value = e.target.value);
    document.getElementById('slippageNumber3').addEventListener('input', e => document.getElementById('slippageSlider3').value = e.target.value);

    document.getElementById('aSlider3').addEventListener('input', e => document.getElementById('aValue3').value = e.target.value);
    document.getElementById('aValue3').addEventListener('input', e => document.getElementById('aSlider3').value = e.target.value);
    
    function updateDynamicFeesMultiplierChart() {
        const xpi = parseInt(document.getElementById('xpiNumber3').value, 10);
        const xpj = parseInt(document.getElementById('xpjNumber3').value, 10);
        const fee = parseInt(document.getElementById('feeNumber3').value, 10);
        const feeMul = parseInt(document.getElementById('offpegNumber3').value, 10);
        const A = parseInt(document.getElementById('aValue3').value, 10);
        const slippage = parseFloat(document.getElementById('slippageNumber3').value);
        const balances = (xpi > xpj) ? [xpi, xpj] : [xpj, xpi];

        const multipliers = [0, 1, 2, 5, 10];
        const datasets = [];
        const colors = ["#d0000099", "#a2aebb99", "#f4acb799", "#0075c499", "#efa00b99"]
        const labels = ["Extractable", "Profit with Fee multiplier", "Profit with Fee Multiplier x2", "Profit with Fee Multiplier x5", "Profit with Fee Multiplier x10"]
        let i = 0;
        multipliers.forEach(multiplier => {
            const data = generateDataPoints(xpi, xpj, fee, feeMul * multiplier, A, slippage, balances);
            datasets.push({
                label: labels[i],
                data: data.profits,
                tradeSizes: data.tradeSizes,
                borderColor: colors[i],
                tension: 0.1,
                fill: false,
                pointRadius: 0,
            });
            i++;
        });

        console.log(datasets);
        drawDynamicFeesMultiplierChart(datasets);
    }

    function generateDataPoints(xpi, xpj, fee, feeMul, A, slippage, balances) {
        const tvl = xpi + xpj;
        let victimTrade = tvl * 0.1;
        let dataPoints = 100;
        let data = { tradeSizes: [], profits: [] };
        let precision = 10;

        let lowerBound = 0;
        let upperBound = victimTrade;
        let zeroProfit = victimTrade;
        while (upperBound - lowerBound > precision) {
            let pool = new CurvePool(A, [...balances], 2, fee, feeMul);
            let originalBalance = solveForSlippage(zeroProfit, fee, feeMul, slippage, 0.0001, balances);
            let [frontRun, frontRunFees] = pool.exchange(1, 0, originalBalance);
            pool.exchange(1, 0, zeroProfit);
            let [backRun, backRunFees] = pool.exchange(0, 1, frontRun);
            let mev = backRun - originalBalance;
            let fees = frontRunFees + backRunFees;
            let profits = mev - fees;
            if (profits > 0) {
                upperBound = zeroProfit;
            } else {
                lowerBound = zeroProfit;
            }
            zeroProfit = (lowerBound + upperBound) / 2;
        }

        victimTrade = zeroProfit;
        while (dataPoints > 0) {
            let pool = new CurvePool(A, [...balances], 2, fee, feeMul);
            let originalBalance = solveForSlippage(victimTrade, fee, feeMul, slippage, 0.0001, balances);
            let [frontRun, frontRunFees] = pool.exchange(1, 0, originalBalance);
            pool.exchange(1, 0, victimTrade);
            let [backRun, backRunFees] = pool.exchange(0, 1, frontRun);
            let mev = backRun - originalBalance;
            let fees = frontRunFees + backRunFees;
            let profits = mev - fees;
            data.tradeSizes.push(victimTrade);
            data.profits.push((feeMul == 0) ? mev : (profits > 0) ? profits : 0); // avoid rounding error that start chart below 0 on x axis
            victimTrade *= 1.005;
            dataPoints--;
        }
        return data;
    }

    function drawDynamicFeesMultiplierChart(datasets) {
        const formatWithAbbreviations = (value, precision = 1) => {
            if (Math.abs(value) >= 1e9) {
                return (value / 1e9).toFixed(precision) + 'b';
            } else if (Math.abs(value) >= 1e6) {
                return (value / 1e6).toFixed(3) + 'm';
            } else if (Math.abs(value) >= 1e3) {
                return (value / 1e3).toFixed(precision) + 'k';
            }
            return value.toString();
        };

        const formatWithAbbreviationsNormal = (value) => {
            return formatWithAbbreviations(value, 1);
        };

        if (dynamicFeesMultiplierChart) dynamicFeesMultiplierChart.destroy();

        dynamicFeesMultiplierChart = new Chart(document.getElementById('dynamicFeesMultiplierChart'), {
            type: 'line',
            data: {
                labels: datasets[0].tradeSizes.map(tradeSize => formatWithAbbreviations(tradeSize, 1)),
                datasets: datasets
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
                        ticks: {
                            callback: formatWithAbbreviationsNormal
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sandwiched Trade Size'
                        }
                    }
                }
            }
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Call updateDynamicFeesMultiplierChart initially
    updateDynamicFeesMultiplierChart();
});