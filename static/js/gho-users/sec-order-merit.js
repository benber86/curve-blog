const beforeMeritData = {

    'Uniswap V3': {
        'Crypto assets': {sum: 2928691.143777008, percentage: 12.37626172420912},
        'Providing Liquidity': {sum: 8096565.143072222, percentage: 34.21501427034744},
        'Stablecoins': {sum: 12638522.074012477, percentage: 53.40872400544344}
    },

    'Balancer': {
        'Crypto assets': {sum: 9544.900527328246, percentage: 0.04263540953907979},
        'Providing Liquidity': {sum: 15169777.81184167, percentage: 67.76075746132007},
        'Stablecoins': {sum: 7207938.558287616, percentage: 32.196607129140844}
    },
    'Curve': {
        'Crypto assets': {sum: 5351.8396994141, percentage: 0.3835443818296424},
        'Providing Liquidity': {sum: 1174859.4892464487, percentage: 84.19735676856125},
        'Stablecoins': {sum: 215152.53321890978, percentage: 15.419098849609117}
    },
};

const afterMeritData = {

    'Uniswap V3': {
        'Crypto assets': {sum: 1867130.583866648, percentage: 66.4545039466639},
        'Providing Liquidity': {sum: 12654.296721804378, percentage: 0.45038896513596255},
        'Stablecoins': {sum: 929852.4998443302, percentage: 33.09510708820012}
    },

    'Balancer': {
        'Crypto assets': {sum: 3156990.406375305, percentage: 35.95009020242856},
        'Providing Liquidity': {sum: 1266830.0164518314, percentage: 14.425971415883126},
        'Stablecoins': {sum: 4357772.02547787, percentage: 49.62393838168831}
    },
    'Curve': {
        'Crypto assets': {sum: 204012.9700193825, percentage: 3.5284153159410305},
        'Providing Liquidity': {sum: 1502962.9431546635, percentage: 25.993825134818128},
        'Stablecoins': {sum: 4075023.986261606, percentage: 70.47775954924084}
    },
};

function createBarChart(ctx, data, title, dataType) {
    const dexes = Object.keys(data);
    const outcomes = ['Crypto assets', 'Providing Liquidity', 'Stablecoins'];
    const colors = ['#FF6384CC', '#36A2EBCC', '#FFCE56CC'];

    const datasets = outcomes.map((outcome, index) => ({
        label: outcome,
        data: dexes.map(dex => dataType === 'absolute' ? data[dex][outcome].sum : data[dex][outcome].percentage),
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderWidth: 1
    }));

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dexes,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {

                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += dataType === 'absolute'
                                    ?  context.parsed.y >= 5e5 ? '$' + (context.parsed.y / 1e6).toFixed(1) + 'm' : '$' + context.parsed.y
                                    : (context.parsed.y).toFixed(2) + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: dataType === 'absolute' ? 'Volume' : 'Percentage'
                    },
                    ticks: {
                        callback: function(value) {
                            return dataType === 'absolute'
                                ? value >= 5e5 ? '$' + (value / 1e6).toFixed(1) + 'm' : '$' + value
                                : (value).toFixed(0) + '%';
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('merit-charts');
    const chartContainer = document.getElementById('merit-chart-container');

    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.marginBottom = '20px';
    container.insertBefore(dropdownContainer, chartContainer);

    const dropdown = document.createElement('select');
    dropdown.id = 'data-type';
    const options = [
        { value: 'proportions', text: 'USD Volume (Proportions)' },
        { value: 'absolute', text: 'USD Volume (Absolute)' },
    ];
    options.forEach(option => {
        const el = document.createElement('option');
        el.value = option.value;
        el.textContent = option.text;
        dropdown.appendChild(el);
    });
    dropdownContainer.appendChild(dropdown);

    const beforeChartContainer = document.createElement('div');
    beforeChartContainer.style.width = '48%';
    beforeChartContainer.style.height = '100%';
    const beforeCanvas = document.createElement('canvas');
    beforeCanvas.id = 'before-merit-chart';
    beforeChartContainer.appendChild(beforeCanvas);

    const afterChartContainer = document.createElement('div');
    afterChartContainer.style.width = '48%';
    afterChartContainer.style.height = '100%';
    const afterCanvas = document.createElement('canvas');
    afterCanvas.id = 'after-merit-chart';
    afterChartContainer.appendChild(afterCanvas);

    chartContainer.appendChild(beforeChartContainer);
    chartContainer.appendChild(afterChartContainer);

    let beforeChart, afterChart;

    function updateCharts(dataType) {
        if (beforeChart) beforeChart.destroy();
        if (afterChart) afterChart.destroy();

        beforeChart = createBarChart(beforeCanvas.getContext('2d'), beforeMeritData, 'Before Incentives', dataType);
        afterChart = createBarChart(afterCanvas.getContext('2d'), afterMeritData, 'After Incentives', dataType);
    }

    updateCharts('proportions');

    dropdown.addEventListener('change', function() {
        updateCharts(this.value);
    });
});