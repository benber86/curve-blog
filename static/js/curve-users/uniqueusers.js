const labels = ["DAO", "Trading", "LP", "UI Router", "crvUSD", "Lend"];

const chainDataUsers = {
    all: [417, 33932, 40630, 63522, 2696, 785],
    ethereum: [417, 25084, 29815, 24074, 2696, 330],
    fantom: [0, 466, 276, 359, 0, 0],
    optimism: [0, 1636, 1870, 4740, 0, 0],
    polygon: [0, 1609, 3203, 13367, 0, 0],
    xdai: [0, 594, 123, 234, 0, 0],
    fraxtal: [0, 105, 312, 265, 0, 0],
    base: [0, 417, 2155, 20465, 0, 0],
    arbitrum: [0, 5086, 5303, 11351, 0, 485],
};

let barChart;

function createBarChart(data) {
    const ctx = document.getElementById('userChart').getContext('2d');

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unique Users',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Unique Users'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Unique Users per Product'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Users: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function updateBarChart(selectedChain) {
    createBarChart(chainDataUsers[selectedChain]);
}

document.addEventListener('DOMContentLoaded', () => {
    const initialChainUsers = createChainSelector('chainSelectUsers', updateBarChart);

    if (initialChainUsers) {
        updateBarChart(initialChainUsers);
    } else {
        console.error('Failed to initialize chain selector');
    }
});
