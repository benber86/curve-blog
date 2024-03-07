const jsonData = {
    "dates": [
    "2024-01-26", "2024-01-27", "2024-01-28", "2024-01-29", "2024-01-30",
    "2024-01-31", "2024-02-01", "2024-02-02", "2024-02-03", "2024-02-04",
    "2024-02-05", "2024-02-06", "2024-02-07", "2024-02-08", "2024-02-09",
    "2024-02-10", "2024-02-11", "2024-02-12", "2024-02-13", "2024-02-14",
    "2024-02-15", "2024-02-16", "2024-02-17", "2024-02-18", "2024-02-19",
    "2024-02-20", "2024-02-21", "2024-02-22", "2024-02-23", "2024-02-24",
    "2024-02-25"
],
    "Stableswap-OG": {
        "Sandwiches": [
        0.20, 0.71, 0.67, 0.81, 0.34, 0.03, 0.00, 10.24, 0.29, 0.00,
        16.85, 4.23, 0.00, 0.76, 5.42, 0.00, 0.00, 0.00, 0.00, 0.02,
        0.06, 0.00, 0.00, 0.00, 1.90, 0.63, 5.06, 0.25, 0.37, 1.16,
        0.52
    ],
        "Atomic Arbitrages": [
        6.08, 8.53, 3.09, 3.18, 2.59, 2.26, 2.71, 1.71, 3.03, 1.60,
        2.37, 2.98, 2.83, 4.57, 8.33, 3.92, 3.42, 4.78, 7.25, 3.53,
        3.49, 4.08, 8.78, 10.53, 3.08, 1.85, 1.09, 14.76, 0.88, 2.51,
        2.07
    ],
        "Total MEV": [
        6.28, 9.33, 4.06, 4.00, 3.10, 2.29, 2.71, 11.95, 3.32, 1.60,
        19.21, 7.20, 2.83, 5.33, 16.45, 3.92, 3.42, 4.78, 7.25, 3.55,
        3.55, 4.08, 8.78, 10.53, 4.97, 2.65, 6.15, 15.00, 1.24, 3.67,
        2.58
    ]
},
    "Stableswap-NG": {
        "Sandwiches": [
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        0.00
    ],
        "Atomic Arbitrages": [
        1.15, 1.04, 5.48, 3.66, 3.16, 2.93, 6.80, 3.55, 9.10, 8.18,
        5.90, 5.60, 16.57, 6.72, 10.27, 10.62, 15.48, 11.11, 4.07, 0.72,
        4.43, 6.08, 7.91, 4.97, 3.56, 3.16, 3.35, 6.44, 4.15, 3.74,
        8.21
    ],
        "Total MEV": [
        1.15, 1.04, 5.48, 3.66, 3.16, 2.93, 6.80, 3.68, 9.10, 8.18,
        5.90, 5.60, 16.57, 6.72, 10.27, 10.62, 15.48, 11.11, 4.07, 0.72,
        4.43, 6.08, 7.93, 4.97, 3.56, 3.16, 3.35, 6.44, 4.15, 3.74,
        8.21
    ]
}
}

document.addEventListener('DOMContentLoaded', function () {
const updateChart = (feature) => {
    const ogData = jsonData['Stableswap-OG'][feature];
    const ngData = jsonData['Stableswap-NG'][feature];

    mevChart.data.datasets[0].data = ogData;
    mevChart.data.datasets[1].data = ngData;
    mevChart.options.plugins.title.text = `Stableswap Comparison - ${feature} as % of total USD volume`;
    mevChart.update();
};

const labels = jsonData.dates.map(date => {
    return date.substring(5).replace('-', '/');
});
const ctx = document.getElementById('mevChart').getContext('2d');
const mevChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels, // Add your date labels here
        datasets: [{
            label: 'Original Stablewap (Fixed Fees)',
            data: [], // Initial data set empty
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }, {
            label: 'NG Stableswap (Dynamic Fees)',
            data: [], // Initial data set empty
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "% of total USD volume"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Stableswap Comparison' // Default title
            }
        }
    }
});

// Event listener for dropdown
document.getElementById('dataSelect').addEventListener('change', (event) => {
    updateChart(event.target.value);
});

// Initialize chart with default feature
updateChart('Sandwiches');
});