document.addEventListener('DOMContentLoaded', function() {
    const absoluteData = {
        labels: ['$0-0.01', '$0.01-0.1', '$0.1-0.5', '$0.5-1', '$1-10', '$10-100', '$100-1000', '$1000+'],
        datasets: [{
            label: 'Frequency',
            data: [253, 213, 102, 33, 62, 35, 30, 39],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const percentageData = {
        labels: ['0-0.005%', '0.005-0.01%', '0.01-0.05%', '0.05-0.1%', '0.1-0.5%', '0.5-1%', '1-10%', '10-50%', '50%+'],
        datasets: [{
            label: 'Frequency',
            data: [597, 27, 68, 25, 34, 1, 13, 0, 2],
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

    new Chart(document.getElementById('absoluteChart'), {
        type: 'bar',
        data: absoluteData,
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: ['Distribution of Sandwichable Value', 'Left Unextracted']
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

    new Chart(document.getElementById('percentageChart'), {
        type: 'bar',
        data: percentageData,
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: ['Distribution of Differences Between', 'Frontrun Price and Minimum Acceptable Price']
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