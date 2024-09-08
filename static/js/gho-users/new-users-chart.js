(function() {
    function createUserGrowthChart() {
        fetch('../../js/gho-users/cumulative_users.json')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('linechart-new-users').getContext('2d');

                const chartData = Object.entries(data).map(([timestamp, value]) => ({
                    x: new Date(parseInt(timestamp) * 1000),
                    y: value
                }));

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Cumulative Unique Users',
                            data: chartData,
                            fill: true,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {

                            title: {
                                display: true,
                                text: 'Cumulative Unique Users Over Time',
                                font: {
                                    size: 16
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },

                            legend: {
                                display: false // Remove the legend
                            },
                            tooltip: {
                                callbacks: {
                                    title: function(context) {
                                        const date = new Date(context[0].parsed.x);
                                        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'month',
                                    displayFormats: {
                                        month: 'MMM yy'
                                    }
                                },
                                ticks: {
                                    maxTicksLimit: 12 // Limit the number of ticks on the x-axis
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error loading the data:', error));
    }

    // Call the function when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUserGrowthChart);
    } else {
        createUserGrowthChart();
    }
})();