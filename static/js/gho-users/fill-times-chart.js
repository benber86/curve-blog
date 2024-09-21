document.addEventListener('DOMContentLoaded', function() {
    fetch('../../js/gho-users/fill_times_data.json')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('barchart-fill-times').getContext('2d');

            // Sort data by timestamp
            data.sort((a, b) => a.timestamp - b.timestamp);

            const chartData = data.map(item => ({
                x: item.timestamp,
                y: item.fill_time
            }));

            const labels = data.map(item => {
                const date = new Date(item.timestamp * 1000);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            });

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Fill Time',
                        data: chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            ticks: {
                                maxRotation: 0,
                                minRotation: 0,
                                autoSkip: true,
                                callback: function(val, index) {
                                    // This will show every 3rd label
                                    return index % 4 === 0 ? this.getLabelForValue(val) : '';
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Fill Time (days)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Days to fill available borrowing cap over time'
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    const timestamp = tooltipItems[0].raw.x;
                                    const date = new Date(timestamp * 1000);
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                                },
                                label: function(context) {
                                    return `Fill Time: ${context.raw.y.toFixed(2)} days`;
                                }
                            }
                        }
                    },
                    barPercentage: 0.9,
                    categoryPercentage: 1.0
                }
            });
        });
});