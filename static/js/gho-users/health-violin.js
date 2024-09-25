document.addEventListener('DOMContentLoaded', function() {
    const colorPalette = [
        'rgba(255, 154, 162, 0.5)', // ff9aa2
        'rgba(255, 183, 178, 0.5)', // ffb7b2
        'rgba(255, 218, 193, 0.5)', // ffdac1
        'rgba(226, 240, 203, 0.5)', // e2f0cb
        'rgba(181, 234, 215, 0.5)', // b5ead7
        'rgba(179, 235, 242, 0.5)',  // #b3ebf2
        'rgba(204, 204, 255, 0.5)',  // ##ccccff
        'rgba(199, 206, 234, 0.5)',  // c7ceea
    ];

    function calculateStats(data) {
        const sorted = data.slice().sort((a, b) => a - b);
        const len = sorted.length;
        return {
            min: sorted[0],
            q1: sorted[Math.floor(len * 0.25)],
            median: sorted[Math.floor(len * 0.5)],
            q3: sorted[Math.floor(len * 0.75)],
            max: sorted[len - 1]
        };
    }

    fetch('../../js/gho-users/health_violin_data.json')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('healthViolinChart').getContext('2d');
            new Chart(ctx, {
                type: 'boxplot',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        data: Object.values(data),
                        backgroundColor: colorPalette,
                        borderColor: colorPalette.map(color => color.replace('0.5', '1')),
                        borderWidth: 2,
                        outlierColor: '#999999',
                        padding: 10,
                        itemRadius: 0
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Health Factor Distribution of Asset Borrowers (September 13th, 2024)',
                            font: {
                                size: 18
                            }
                        },
                        subtitle: {
                            display: true,
                            text: ['The box displays the middle 50% of the data, bounded by the 25th and 75th percentiles, with the median marked by a vertical line.',
                                'Whiskers extend to show the data range, while individual points beyond the whiskers represent outliers that fall outside 1.5 times the interquartile range.',
                            'Extreme outliers are not displayed.'],
                            font: {
                                size: 12,
                                italic: true
                            },
                            padding: {
                                bottom: 20,
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '';
                                },
                                afterBody: function(tooltipItems) {
                                    const item = tooltipItems[0];
                                    const dataIndex = item.dataIndex;
                                    const rawData = item.dataset.data[dataIndex];
                                    const stats = calculateStats(rawData);

                                    return [
                                        `Min: ${stats.min.toFixed(3)}`,
                                        `Q1: ${stats.q1.toFixed(3)}`,
                                        `Median: ${stats.median.toFixed(3)}`,
                                        `Q3: ${stats.q3.toFixed(3)}`,
                                        `Max: ${stats.max.toFixed(3)}`,
                                    ];
                                }
                            }
                        }
                    },
                    scales: {

                        x: {
                            title: {
                                display: true,
                                text: 'Health Factor'
                            },

                            min: 0.85
                        },
                        y: {
                            title: {
                                display: false,
                                text: 'Assets'
                            }
                        }
                    }
                }
            });
        });
});