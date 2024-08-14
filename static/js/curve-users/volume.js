const volumeLabels = ["DAO", "Trading", "LP", "UI Router", "crvUSD", "Lend"];

const chainVolumeUsers = {
    all: [0,
        55713262079,
        8153772943,
        5633644325,
        46991515782,
        8792277104],
        'ethereum': [0, 52238633575, 6465000604, 5323389070, 46991515782, 8461237539],
        'fantom': [0, 54954316, 6384224, 510919, 0, 0],
        'optimism': [0, 568085188, 216969738, 38018787, 0, 0],
        'polygon': [0, 677643041, 160808773, 31000671, 0, 0],
        'xdai': [0, 15319184, 9900180, 885541, 0, 0],
        'fraxtal': [0, 4755832, 11789995, 2160967, 0, 0],
        'base': [0, 177279702, 23765120, 10489377, 0, 0],
        'arbitrum': [0, 1976591236, 1259154306, 227188990, 0, 7328914203]
};

let volumeBarChart;

function createVolumeBarChart(data) {
    const ctx = document.getElementById('userVolumeChart').getContext('2d');

    if (volumeBarChart) {
        volumeBarChart.destroy();
    }

    volumeBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: volumeLabels,
            datasets: [{
                label: 'Volume per Product',
                data: data,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
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
                        text: 'USD Volume'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'USD Volume per Product'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Volume: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function updateVolumeBarChart(selectedChain) {
    createVolumeBarChart(chainVolumeUsers[selectedChain]);
}

document.addEventListener('DOMContentLoaded', () => {
    const initialChainUsers = createChainSelector('chainSelectUsersVolume', updateVolumeBarChart);

    if (initialChainUsers) {
        updateVolumeBarChart(initialChainUsers);
    } else {
        console.error('Failed to initialize chain selector');
    }
});
