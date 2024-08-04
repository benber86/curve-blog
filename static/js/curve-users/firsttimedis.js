const firstTimeUsersData = {
    'all': {'UI Router': 61220, 'Trading': 28706, 'LP': 28372, 'crvUSD': 1478, 'Lending': 374, 'DAO': 193},
    'ethereum': {'UI Router': 21179, 'Trading': 20904, 'LP': 19615, 'crvUSD': 1478, 'DAO': 193, 'Lending': 122},
    'polygon': {'UI Router': 12005, 'LP': 2684, 'Trading': 1427},
    'arbitrum': {'UI Router': 8078, 'Trading': 3872, 'LP': 3262, 'Lending': 252},
    'optimism': {'UI Router': 2987, 'Trading': 1211, 'LP': 1136},
    'base': {'UI Router': 16316, 'LP': 1343, 'Trading': 287},
    'fantom': {'Trading': 421, 'UI Router': 344, 'LP': 200},
    'fraxtal': {'UI Router': 147, 'LP': 60, 'Trading': 46},
    'xdai': {'Trading': 538, 'UI Router': 164, 'LP': 72}
};

const percentageData = {
    'all': {'DAO': 5.57, 'LP': 4.70, 'Lending': 4.34, 'Trading': 1.24, 'UI Router': 28.41, 'crvUSD': 8.77},
    'ethereum': {'DAO': 5.57, 'LP': 3.25, 'Lending': 1.42, 'Trading': 0.91, 'UI Router': 9.83, 'crvUSD': 8.77},
    'polygon': {'LP': 0.44, 'Trading': 0.06, 'UI Router': 5.57},
    'arbitrum': {'LP': 0.54, 'Lending': 2.92, 'Trading': 0.17, 'UI Router': 3.75},
    'optimism': {'LP': 0.19, 'Trading': 0.05, 'UI Router': 1.39},
    'base': {'LP': 0.22, 'Trading': 0.01, 'UI Router': 7.57},
    'fantom': {'LP': 0.03, 'Trading': 0.02, 'UI Router': 0.16},
    'fraxtal': {'LP': 0.01, 'Trading': 0.00, 'UI Router': 0.07},
    'xdai': {'LP': 0.01, 'Trading': 0.02, 'UI Router': 0.08}
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
                indexAxis: 'y',
                responsive: true,
                aspectRatio: 1.25,
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

    window.firstTimeUsersChart = createChart('firstTimeUsersChart', firstTimeUsersData[chain], 'First Time Users');
    window.percentageChart = createChart('percentageChart', percentageData[chain], '%age of First Transactions');
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