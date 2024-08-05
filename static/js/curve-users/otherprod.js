
let otherProdChart = null;
const otherProdData = {
    'all': {'Lending': 0.24064171122994651, 'Trading': 0.21330778609998258, 'crvUSD': 0.09133964817320704, 'LP': 0.09058226420414493, 'DAO': 0.08290155440414508, 'UI Router': 0.06948709572035283},
    'ethereum': {'Trading': 0.26777262289704296, 'Lending': 0.17293233082706766, 'UI Router': 0.1318736803451758, 'DAO': 0.09047619047619047, 'crvUSD': 0.08718980549966465, 'LP': 0.08488314271506713},
    'polygon': {'LP': 0.03883823032759203, 'Trading': 0.02939166097060834, 'UI Router': 0.008293838862559242},
    'arbitrum': {'Lending': 0.30246913580246915, 'LP': 0.10202020202020202, 'UI Router': 0.06994545976461583, 'Trading': 0.061366806136680614},
    'optimism': {'LP': 0.08498402555910543, 'Trading': 0.036715620827770364, 'UI Router': 0.03593073593073593},
    'base': {'LP': 0.09827357237715803, 'Trading': 0.07348242811501597, 'UI Router': 0.015113699389905713},
    'fantom': {'LP': 0.08097165991902834, 'Trading': 0.027649769585253458, 'UI Router': 0.011049723756906077},
    'fraxtal': {'LP': 0.2838709677419355, 'Trading': 0.2807017543859649, 'UI Router': 0.16714697406340057},
    'xdai': {'LP': 0.2828282828282828, 'UI Router': 0.07317073170731707, 'Trading': 0.039655172413793106}
};

function otherProdCreateChart(chain) {
    const canvas = document.getElementById('otherProdChart');
    if (!canvas) {
        console.error('Canvas with id "otherProdChart" not found');
        return null;
    }

    const ctx = canvas.getContext('2d');
    const chainData = otherProdData[chain];

    const labels = Object.keys(chainData);
    const values = Object.values(chainData).map(x => x * 100);

    if (otherProdChart && typeof otherProdChart.destroy === 'function') {
        otherProdChart.destroy();
    }

    otherProdChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probability',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            aspectRatio: 1.95,
            plugins: {
                title: {
                    display: true,
                    text: [`Percentage of users who subsequently use a different product - ${chain.charAt(0).toUpperCase() + chain.slice(1)}`, "per product used for their first transaction"]
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probability'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Product'
                    }
                }
            }
        }
    });
}

function otherProdInitChart() {
    if (typeof createChainSelector !== 'function') {
        console.error('createChainSelector function not found. Make sure chainlist.js is loaded.');
        return;
    }

    const initialChain = createChainSelector('otherProdChainSelector', (selectedChain) => {
        otherProdCreateChart(selectedChain);
    });

    if (initialChain) {
        otherProdCreateChart(initialChain);
    } else {
        console.error('Failed to get initial chain');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', otherProdInitChart);
} else {
    otherProdInitChart();
}