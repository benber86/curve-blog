const survivalData = {'ethereum': {'DAO': {'Stop': 0.16, '1 or more': 0.84, '2 or more': 0.55, '3 or more': 0.5, '4 or more': 0.38, '5 or more': 0.35, '6 or more': 0.3, '7 or more': 0.29, '8 or more': 0.25, '9 or more': 0.24, '10 or more': 0.19}, 'Trading': {'Stop': 0.66, '1 or more': 0.34, '2 or more': 0.14, '3 or more': 0.08, '4 or more': 0.05, '5 or more': 0.04, '6 or more': 0.03, '7 or more': 0.03, '8 or more': 0.03, '9 or more': 0.02, '10 or more': 0.02}, 'LP': {'Stop': 0.42, '1 or more': 0.58, '2 or more': 0.21, '3 or more': 0.13, '4 or more': 0.07, '5 or more': 0.05, '6 or more': 0.04, '7 or more': 0.03, '8 or more': 0.02, '9 or more': 0.02, '10 or more': 0.02}, 'UI Router': {'Stop': 0.66, '1 or more': 0.34, '2 or more': 0.18, '3 or more': 0.12, '4 or more': 0.09, '5 or more': 0.06, '6 or more': 0.05, '7 or more': 0.04, '8 or more': 0.04, '9 or more': 0.03, '10 or more': 0.03}, 'crvUSD': {'Stop': 0.2, '1 or more': 0.8, '2 or more': 0.63, '3 or more': 0.53, '4 or more': 0.45, '5 or more': 0.39, '6 or more': 0.35, '7 or more': 0.31, '8 or more': 0.27, '9 or more': 0.25, '10 or more': 0.23}, 'Lending': {'Stop': 0.25, '1 or more': 0.75, '2 or more': 0.46, '3 or more': 0.34, '4 or more': 0.26, '5 or more': 0.22, '6 or more': 0.19, '7 or more': 0.16, '8 or more': 0.14, '9 or more': 0.13, '10 or more': 0.12}}, 'polygon': {'Trading': {'Stop': 0.81, '1 or more': 0.19, '2 or more': 0.14, '3 or more': 0.12, '4 or more': 0.12, '5 or more': 0.11, '6 or more': 0.09, '7 or more': 0.09, '8 or more': 0.08, '9 or more': 0.08, '10 or more': 0.07}, 'LP': {'Stop': 0.65, '1 or more': 0.35, '2 or more': 0.15, '3 or more': 0.1, '4 or more': 0.07, '5 or more': 0.06, '6 or more': 0.05, '7 or more': 0.04, '8 or more': 0.04, '9 or more': 0.03, '10 or more': 0.03}, 'UI Router': {'Stop': 0.64, '1 or more': 0.36, '2 or more': 0.11, '3 or more': 0.04, '4 or more': 0.02, '5 or more': 0.01, '6 or more': 0.01, '7 or more': 0.01, '8 or more': 0.01, '9 or more': 0.0, '10 or more': 0.0}}, 'arbitrum': {'Trading': {'Stop': 0.72, '1 or more': 0.28, '2 or more': 0.16, '3 or more': 0.12, '4 or more': 0.1, '5 or more': 0.08, '6 or more': 0.07, '7 or more': 0.06, '8 or more': 0.06, '9 or more': 0.06, '10 or more': 0.05}, 'LP': {'Stop': 0.4, '1 or more': 0.6, '2 or more': 0.36, '3 or more': 0.28, '4 or more': 0.22, '5 or more': 0.18, '6 or more': 0.15, '7 or more': 0.13, '8 or more': 0.11, '9 or more': 0.1, '10 or more': 0.09}, 'UI Router': {'Stop': 0.62, '1 or more': 0.38, '2 or more': 0.19, '3 or more': 0.12, '4 or more': 0.09, '5 or more': 0.07, '6 or more': 0.05, '7 or more': 0.04, '8 or more': 0.04, '9 or more': 0.03, '10 or more': 0.03}, 'Lending': {'Stop': 0.1, '1 or more': 0.9, '2 or more': 0.68, '3 or more': 0.55, '4 or more': 0.46, '5 or more': 0.39, '6 or more': 0.34, '7 or more': 0.31, '8 or more': 0.27, '9 or more': 0.25, '10 or more': 0.22}}, 'optimism': {'Trading': {'Stop': 0.44, '1 or more': 0.56, '2 or more': 0.35, '3 or more': 0.2, '4 or more': 0.12, '5 or more': 0.09, '6 or more': 0.07, '7 or more': 0.06, '8 or more': 0.06, '9 or more': 0.06, '10 or more': 0.05}, 'LP': {'Stop': 0.61, '1 or more': 0.39, '2 or more': 0.19, '3 or more': 0.13, '4 or more': 0.09, '5 or more': 0.08, '6 or more': 0.06, '7 or more': 0.05, '8 or more': 0.04, '9 or more': 0.04, '10 or more': 0.03}, 'UI Router': {'Stop': 0.68, '1 or more': 0.32, '2 or more': 0.1, '3 or more': 0.06, '4 or more': 0.04, '5 or more': 0.03, '6 or more': 0.02, '7 or more': 0.02, '8 or more': 0.01, '9 or more': 0.01, '10 or more': 0.01}}, 'base': {'Trading': {'Stop': 0.35, '1 or more': 0.65, '2 or more': 0.55, '3 or more': 0.48, '4 or more': 0.4, '5 or more': 0.35, '6 or more': 0.28, '7 or more': 0.24, '8 or more': 0.23, '9 or more': 0.22, '10 or more': 0.21}, 'LP': {'Stop': 0.48, '1 or more': 0.52, '2 or more': 0.15, '3 or more': 0.1, '4 or more': 0.07, '5 or more': 0.05, '6 or more': 0.04, '7 or more': 0.04, '8 or more': 0.03, '9 or more': 0.03, '10 or more': 0.02}, 'UI Router': {'Stop': 0.65, '1 or more': 0.35, '2 or more': 0.11, '3 or more': 0.05, '4 or more': 0.03, '5 or more': 0.02, '6 or more': 0.01, '7 or more': 0.01, '8 or more': 0.01, '9 or more': 0.01, '10 or more': 0.01}}, 'fantom': {'Trading': {'Stop': 0.73, '1 or more': 0.27, '2 or more': 0.23, '3 or more': 0.2, '4 or more': 0.19, '5 or more': 0.18, '6 or more': 0.17, '7 or more': 0.17, '8 or more': 0.16, '9 or more': 0.15, '10 or more': 0.15}, 'LP': {'Stop': 0.62, '1 or more': 0.38, '2 or more': 0.27, '3 or more': 0.22, '4 or more': 0.17, '5 or more': 0.16, '6 or more': 0.14, '7 or more': 0.14, '8 or more': 0.11, '9 or more': 0.11, '10 or more': 0.11}, 'UI Router': {'Stop': 0.55, '1 or more': 0.45, '2 or more': 0.22, '3 or more': 0.14, '4 or more': 0.1, '5 or more': 0.08, '6 or more': 0.07, '7 or more': 0.05, '8 or more': 0.04, '9 or more': 0.02, '10 or more': 0.02}}, 'fraxtal': {'Trading': {'Stop': 0.4, '1 or more': 0.6, '2 or more': 0.45, '3 or more': 0.37, '4 or more': 0.32, '5 or more': 0.31, '6 or more': 0.29, '7 or more': 0.27, '8 or more': 0.27, '9 or more': 0.24, '10 or more': 0.24}, 'LP': {'Stop': 0.38, '1 or more': 0.62, '2 or more': 0.44, '3 or more': 0.34, '4 or more': 0.29, '5 or more': 0.23, '6 or more': 0.21, '7 or more': 0.18, '8 or more': 0.14, '9 or more': 0.13, '10 or more': 0.12}, 'UI Router': {'Stop': 0.33, '1 or more': 0.67, '2 or more': 0.47, '3 or more': 0.35, '4 or more': 0.27, '5 or more': 0.24, '6 or more': 0.21, '7 or more': 0.18, '8 or more': 0.16, '9 or more': 0.15, '10 or more': 0.14}}, 'xdai': {'Trading': {'Stop': 0.81, '1 or more': 0.19, '2 or more': 0.11, '3 or more': 0.09, '4 or more': 0.08, '5 or more': 0.07, '6 or more': 0.07, '7 or more': 0.06, '8 or more': 0.06, '9 or more': 0.05, '10 or more': 0.05}, 'LP': {'Stop': 0.53, '1 or more': 0.47, '2 or more': 0.33, '3 or more': 0.27, '4 or more': 0.22, '5 or more': 0.2, '6 or more': 0.18, '7 or more': 0.17, '8 or more': 0.17, '9 or more': 0.17, '10 or more': 0.15}, 'UI Router': {'Stop': 0.5, '1 or more': 0.5, '2 or more': 0.24, '3 or more': 0.17, '4 or more': 0.14, '5 or more': 0.11, '6 or more': 0.09, '7 or more': 0.08, '8 or more': 0.07, '9 or more': 0.06, '10 or more': 0.05}}, 'all': {'DAO': {'Stop': 0.16, '1 or more': 0.84, '2 or more': 0.55, '3 or more': 0.5, '4 or more': 0.38, '5 or more': 0.35, '6 or more': 0.3, '7 or more': 0.29, '8 or more': 0.25, '9 or more': 0.24, '10 or more': 0.19}, 'Trading': {'Stop': 0.65, '1 or more': 0.35, '2 or more': 0.17, '3 or more': 0.11, '4 or more': 0.08, '5 or more': 0.06, '6 or more': 0.05, '7 or more': 0.04, '8 or more': 0.04, '9 or more': 0.04, '10 or more': 0.04}, 'LP': {'Stop': 0.44, '1 or more': 0.56, '2 or more': 0.23, '3 or more': 0.15, '4 or more': 0.1, '5 or more': 0.07, '6 or more': 0.06, '7 or more': 0.05, '8 or more': 0.04, '9 or more': 0.04, '10 or more': 0.03}, 'UI Router': {'Stop': 0.56, '1 or more': 0.44, '2 or more': 0.22, '3 or more': 0.13, '4 or more': 0.08, '5 or more': 0.06, '6 or more': 0.04, '7 or more': 0.03, '8 or more': 0.03, '9 or more': 0.02, '10 or more': 0.02}, 'crvUSD': {'Stop': 0.2, '1 or more': 0.8, '2 or more': 0.63, '3 or more': 0.53, '4 or more': 0.45, '5 or more': 0.39, '6 or more': 0.35, '7 or more': 0.31, '8 or more': 0.27, '9 or more': 0.25, '10 or more': 0.23}, 'Lending': {'Stop': 0.16, '1 or more': 0.84, '2 or more': 0.6, '3 or more': 0.48, '4 or more': 0.39, '5 or more': 0.33, '6 or more': 0.29, '7 or more': 0.26, '8 or more': 0.22, '9 or more': 0.21, '10 or more': 0.18}}}


function createSurvivalChart(chain) {

    let bgColors = [
        'rgb(255, 159, 164)',  // Stronger pastel red
        'rgb(255, 204, 153)',  // Stronger pastel orange
        'rgb(255, 233, 127)',  // Darker pastel yellow
        'rgb(127, 233, 127)',  // Darker pastel green
        'rgb(153, 204, 255)',  // Stronger pastel blue
        'rgb(204, 153, 255)'   // Stronger pastel purple
    ];

    const borderColors = [
        'rgba(255, 154, 162, 0.85)', // ff9aa2
        'rgba(255, 183, 178, 0.85)', // ffb7b2
        'rgba(255, 218, 193, 0.85)', // ffdac1
        'rgba(226, 240, 203, 0.85)', // e2f0cb
        'rgba(181, 234, 215, 0.85)', // b5ead7
        'rgba(199, 206, 234, 0.85)'  // c7ceea
    ];


    const canvas = document.getElementById('survivalChart');
    if (!canvas) {
        console.error('Canvas with id "survivalChart" not found');
        return null;
    }

    const ctx = canvas.getContext('2d');
    const chainData = survivalData[chain];

    const datasets = Object.keys(chainData).map((product, index) => {
        return {
            label: product,
            data: Object.entries(chainData[product]).map(([key, value]) => ({x: key, y: value})),
            borderColor: bgColors[index],
            backgroundColor: bgColors[index],
            fill: false,
            tension: 0.2
        };
    });

    if (survivalChart && typeof survivalChart.destroy === 'function') {
        survivalChart.destroy();
    }

    survivalChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `"Survival" probabilities per starting product - ${chain.charAt(0).toUpperCase() + chain.slice(1)}`
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Number of Transactions'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability'
                    },
                    min: 0,
                    max: 1
                }
            }
        }
    });
}

function initSurvivalChart() {
    if (typeof createChainSelector !== 'function') {
        console.error('createChainSelector function not found. Make sure chainlist.js is loaded.');
        return;
    }

    const initialChain = createChainSelector('survivalChainSelector', (selectedChain) => {
        createSurvivalChart(selectedChain);
    });

    if (initialChain) {
        createSurvivalChart(initialChain);
    } else {
        console.error('Failed to get initial chain');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSurvivalChart);
} else {
    initSurvivalChart();
}