document.addEventListener('DOMContentLoaded', function() {
    const absoluteData = {
        labels: ['$0-0.01', '$0.01-0.1', '$0.1-0.5', '$0.5-1', '$1-10', '$10-100', '$100-1000', '$1000+'],
        datasets: [{
            label: 'Frequency',
            data: [103, 4, 4, 0, 20, 9, 3, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const percentageData = {
        labels: ['0-0.005%', '0.005-0.01%', '0.01-0.05%', '0.05-0.1%', '0.1-0.5%', '0.5-1%', '1-10%', '10-50%', '50%+'],
        datasets: [{
            label: 'Frequency',
            data: [109, 0, 2, 0, 14, 7, 9, 2, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    new Chart(document.getElementById('absoluteChartUni'), {
        type: 'bar',
        data: absoluteData,
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: ['Distribution of USD Denominated', 'Sandwichable Value Left Unextracted', '(Uniswap v2)']
                }
            },
            scales: {
                ...options.scales,
                x: {
                    title: {
                        display: false,
                        text: 'USD Amount'
                    }
                }
            }
        }
    });

    new Chart(document.getElementById('percentageChartUni'), {
        type: 'bar',
        data: percentageData,
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: ["Distribution of Differences Between Victim's", 'Execution Price and Minimum Acceptable Price', '(Uniswap v2))']
                }
            },
            scales: {
                ...options.scales,
                x: {
                    title: {
                        display: false,
                        text: 'Percentage Difference'
                    }
                }
            }
        }
    });
});