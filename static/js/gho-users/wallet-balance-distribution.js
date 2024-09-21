(function() {
    function createWalletBalanceChart(data, chartId, title) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const total = values.reduce((sum, value) => sum + value, 0);
        const percentages = values.map(value => (value / total) * 100);

        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: percentages,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                                const value = context.raw.toFixed(2);
                                const category = context.label;
                                return `${value}% of wallets in the ${category} range`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage of Wallets'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    }

    const allUsersData = {
        '$0-$100': 2149.0,
        '$100-$1k': 1986.0,
        '$1k-$10k': 1855.0,
        '$10k-$100k': 2047.0,
        '$100k-$1m': 1413.0,
        '$1m-$10m': 473.0,
        '$10m+': 76.0};

    const ghoUsersData = {
        '$0-$100': 221.0,
        '$100-$1k': 218.0,
        '$1k-$10k': 396.0,
        '$10k-$100k': 720.0,
        '$100k-$1m': 571.0,
        '$1m-$10m': 149.0,
        '$10m+': 22.0
    };

    document.addEventListener('DOMContentLoaded', function() {
        createWalletBalanceChart(allUsersData, 'walletBalanceDistributionAll', 'Wallet Balance Distribution (v3 Users)');
        createWalletBalanceChart(ghoUsersData, 'walletBalanceDistributionGHO', 'Wallet Balance Distribution (GHO Users)');
    });
})();