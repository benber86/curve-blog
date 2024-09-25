(function() {
    function createGrowthAndUtilizationChart() {
        const canvas = document.getElementById('chart-growth-and-utilization');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');

        fetch('../../js/gho-users/growth_and_utilization_data.json')
            .then(response => response.json())
            .then(data => {
                const userGrowthData = data.user_growth_rate.map(item => ({
                    x: new Date(item.timestamp * 1000),
                    y: item.value
                }));

                const debtGrowthData = data.debt_growth_rate.map(item => ({
                    x: new Date(item.timestamp * 1000),
                    y: item.value
                }));

                const utilizationData = data.utilization_rate.map(item => ({
                    x: new Date(item.timestamp * 1000),
                    y: item.value
                }));

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [
                            {
                                label: 'User Growth Rate',
                                data: userGrowthData,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                tension: 0.1,
                                yAxisID: 'y-growth',
                                pointRadius: 0
                            },
                            {
                                label: 'Debt Growth Rate',
                                data: debtGrowthData,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                tension: 0.1,
                                yAxisID: 'y-growth',
                                pointRadius: 0
                            },
                            {
                                label: 'Utilization Rate',
                                data: utilizationData,
                                borderColor: 'rgba(255, 206, 86, 1)',
                                tension: 0.1,
                                yAxisID: 'y-growth',
                                pointRadius: 0
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: false,
                                    generateLabels: (chart) => {
                                        const datasets = chart.data.datasets;
                                        return datasets.map((dataset, i) => ({
                                            text: dataset.label,
                                            fillStyle: dataset.borderColor,
                                            strokeStyle: dataset.borderColor,
                                            lineWidth: 1,
                                            height: 1,
                                            hidden: !chart.isDatasetVisible(i),
                                            index: i
                                        }));
                                    }
                                },
                                onClick: (e, legendItem, legend) => {
                                    const index = legendItem.index;
                                    const ci = legend.chart;
                                    if (ci.isDatasetVisible(index)) {
                                        ci.hide(index);
                                        legendItem.hidden = true;
                                    } else {
                                        ci.show(index);
                                        legendItem.hidden = false;
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    title: function(context) {
                                        return context[0].raw.x.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                                    },
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += context.parsed.y.toFixed(2) + '%';
                                        }
                                        return label;
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
                                    maxTicksLimit: 12
                                }
                            },
                            'y-growth': {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Rate (%)'
                                },
                                ticks: {
                                    callback: function(value) {
                                        return value.toFixed(2) + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error loading the growth and utilization data:', error));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGrowthAndUtilizationChart);
    } else {
        createGrowthAndUtilizationChart();
    }
})();