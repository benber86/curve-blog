document.addEventListener('DOMContentLoaded', function() {
    let chart;
    const ctx = document.getElementById('violinChart').getContext('2d');

    const dropdown = document.createElement('select');
    dropdown.id = 'dataSelector';
    const options = ['Wallet Age', 'Nonce'];
    options.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option.toLowerCase().replace(' ', '_');
        dropdown.appendChild(el);
    });
    ctx.canvas.parentNode.insertBefore(dropdown, ctx.canvas);

    Promise.all([
        fetch('../../js/gho-users/wallet_ages_series.json').then(response => response.json()),
        fetch('../../js/gho-users/wallet_nonce_series.json').then(response => response.json())
    ]).then(([ageData, nonceData]) => {
        const data = {
            wallet_age: ageData,
            nonce: nonceData
        };

        function updateChart(selectedData) {
            const labels = ['AAVE v3 Users', 'GHO Borrowers'];
            const datasets = [{
                label: selectedData === 'wallet_age' ? 'Wallet Age (Months)' : 'Nonce',
                data: labels.map(label => data[selectedData][label === 'AAVE v3 Users' ? 'v3' : 'gho']),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ],
                borderWidth: 1,
                outlierColor: '#999999',
                padding: 10,
                itemRadius: 0,
            }];

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'violin',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: selectedData === 'wallet_age' ? 'Wallet Age Distribution' : 'Nonce Distribution'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const rawData = context.raw;
                                    const sortedData = [...rawData].sort((a, b) => a - b);

                                    const min = sortedData[0];
                                    const max = sortedData[sortedData.length - 1];
                                    const mean = rawData.reduce((sum, value) => sum + value, 0) / rawData.length;

                                    const mid = Math.floor(sortedData.length / 2);
                                    const median = sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;

                                    const q1Index = Math.floor(sortedData.length / 4);
                                    const q3Index = Math.floor(3 * sortedData.length / 4);
                                    const q1 = sortedData[q1Index];
                                    const q3 = sortedData[q3Index];

                                    return [
                                        `Min: ${min.toFixed(2)}`,
                                        `Q1 (25%): ${q1.toFixed(2)}`,
                                        `Median: ${median.toFixed(2)}`,
                                        `Mean: ${mean.toFixed(2)}`,
                                        `Q3 (75%): ${q3.toFixed(2)}`,
                                        `Max: ${max.toFixed(2)}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: selectedData === 'wallet_age' ? 'Wallet age in months' : 'Nonce'
                            }
                        }
                    }
                }
            });
        }

        dropdown.addEventListener('change', function() {
            updateChart(this.value);
        });

        updateChart('wallet_age');
    });
});