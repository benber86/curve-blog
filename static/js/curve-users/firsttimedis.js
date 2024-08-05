const firstTimeUsersData = {
    'all': {
        'DAO': 83.69,
        'LP': 56.36,
        'Lending': 83.69,
        'Trading': 34.56,
        'UI Router': 43.51,
        'crvUSD': 80.29
    },
    'ethereum': {
        'DAO': 83.69,
        'LP': 58.37,
        'Lending': 75.15,
        'Trading': 34.43,
        'UI Router': 34.14,
        'crvUSD': 80.29
    },
    'polygon': {
        'LP': 35.19,
        'Trading': 18.58,
        'UI Router': 35.69
    },
    'arbitrum': {
        'LP': 59.78,
        'Lending': 89.90,
        'Trading': 28.47,
        'UI Router': 38.21
    },
    'optimism': {
        'LP': 38.66,
        'Trading': 55.50,
        'UI Router': 32.00
    },
    'base': {
        'LP': 52.02,
        'Trading': 64.51,
        'UI Router': 34.68
    },
    'fantom': {
        'LP': 38.41,
        'Trading': 27.47,
        'UI Router': 44.53
    },
    'fraxtal': {
        'LP': 61.86,
        'Trading': 60.00,
        'UI Router': 66.58
    },
    'xdai': {
        'LP': 47.15,
        'Trading': 19.19,
        'UI Router': 49.80
    }
};


const percentageData = {
    'all': {'UI Router': 50.871259649501845,
        'Trading': 23.8534854540771,
        'LP': 23.575945422666877,
        'crvUSD': 1.2281561868991133,
        'Lending': 0.3107783585252154,
        'DAO': 0.16037492832985717},
    'ethereum': {'UI Router': 33.35748373785261, 'Trading': 32.92435148288734, 'LP': 30.894142476886486, 'crvUSD': 2.3278889921406183, 'DAO': 0.30398009166653545, 'Lending': 0.192153218566411},
    'polygon': {'UI Router': 74.49118888061554, 'LP': 16.654256639364608, 'Trading': 8.854554480019857},
    'arbitrum': {'UI Router': 52.23745473357475, 'Trading': 25.038799793067774, 'LP': 21.09415416451112, 'Lending': 1.6295913088463527},
    'optimism': {'UI Router': 55.99925009373828, 'Trading': 22.703412073490814, 'LP': 21.297337832770904},
    'base': {'UI Router': 90.91719603254207, 'LP': 7.483561796500612, 'Trading': 1.5992421709573164},
    'fantom': {'Trading': 43.626943005181346, 'UI Router': 35.64766839378238, 'LP': 20.72538860103627},
    'fraxtal':  {'UI Router': 58.10276679841897, 'LP': 23.715415019762844, 'Trading': 18.181818181818183},
    'xdai': {'Trading': 69.50904392764858, 'UI Router': 21.188630490956072, 'LP': 9.30232558139535}
};

function createChart(chartId, data, title) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error(`Canvas with id "${chartId}" not found`);
        return null;
    }

    const ctx = canvas.getContext('2d');
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const labels = sortedData.map(item => item[0]);
    const values = sortedData.map(item => item[1]);

    try {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: values,
                    backgroundColor: chartId == 'firstTimeUsersChart' ? 'rgba(255, 99, 132, 0.6)': 'rgba(54, 162, 235, 0.6)',
                    borderColor: chartId == 'firstTimeUsersChart' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text:  title,
                    }
                },
                indexAxis: 'y',
                responsive: true,
                aspectRatio: 1.15,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error(`Error creating chart: ${error.message}`);
        return null;
    }
}

function updateCharts(chain) {
    if (window.firstTimeUsersChart && typeof window.firstTimeUsersChart.destroy === 'function') {
        window.firstTimeUsersChart.destroy();
    }
    if (window.percentageChart && typeof window.percentageChart.destroy === 'function') {
        window.percentageChart.destroy();
    }

    if (!firstTimeUsersData[chain] || !percentageData[chain]) {
        console.error(`Data not found for chain: ${chain}`);
        return;
    }

    window.firstTimeUsersChart = createChart('firstTimeUsersChart', firstTimeUsersData[chain], ['Probability of making a second transaction', 'per product used first']);
    window.percentageChart = createChart('percentageChart', percentageData[chain], ['Percentage of all first time transactions', 'per product']);
}

function initCharts() {
    if (typeof createChainSelector !== 'function') {
        console.error('createChainSelector function not found. Make sure chainlist.js is loaded.');
        return;
    }

    const initialChain = createChainSelector('chainSelector', (selectedChain) => {
        updateCharts(selectedChain);
    });

    if (initialChain) {
        updateCharts(initialChain);
    } else {
        console.error('Failed to get initial chain');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
} else {
    initCharts();
}