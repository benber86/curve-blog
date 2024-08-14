const labelsUsers = ["1", "2", "3", "4", "5", "6"];

const chainDataUsersCount = {
    'all': {1: 96858, 2: 16661, 3: 3453, 4: 268, 5: 61, 6: 11},
    'ethereum': {1: 48705, 2: 12628, 3: 2503, 4: 177, 5: 38, 6: 8},
    'fantom': {1: 1351, 2: 79, 3: 3, 4: 0, 5: 0, 6: 0},
    'optimism': {1: 7314, 2: 540, 3: 79, 4: 8, 5: 0, 6: 0},
    'polygon': {1: 17339, 2: 487, 3: 89, 4: 4, 5: 0, 6: 0},
    'xdai': {1: 1180, 2: 88, 3: 4, 4: 0, 5: 0, 6: 0},
    'fraxtal': {1: 620, 2: 179, 3: 39, 4: 1, 5: 0, 6: 0},
    'base': {1: 21455, 2: 874, 3: 81, 4: 2, 5: 0, 6: 0},
    'arbitrum': {1: 16302, 2: 2321, 3: 494, 4: 49, 5: 4, 6: 0}
};

let barChartUsersCount;

function createBarChartUsersCount(data) {
    const ctx = document.getElementById('userCountChart').getContext('2d');

    if (barChartUsersCount) {
        barChartUsersCount.destroy();
    }

    barChartUsersCount = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsUsers,
            datasets: [{
                label: 'User Count',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
                        text: 'Number of Users'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Number of Products Used'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'User Count by Number of Products Used'
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

function updateBarChartUsersCount(selectedChain) {
    const data = Object.values(chainDataUsersCount[selectedChain]);
    createBarChartUsersCount(data);
}

document.addEventListener('DOMContentLoaded', () => {
    const initialChainUsersCount = createChainSelector('chainSelectUsersCount', updateBarChartUsersCount);

    if (initialChainUsersCount) {
        updateBarChartUsersCount(initialChainUsersCount);
    } else {
        console.error('Failed to initialize chain selector for user count chart');
    }
});