(function() {
    function createHorizontalBarChart(data, chartId, title) {
        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
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
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.x.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: false,
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

    const v3UsersData = {
        'LIDO': 3.75701390583069,
        'Uniswap V3': 3.0088639505570463,
        'Pendle V2': 2.7323737496950473,
        'EigenLayer': 2.5941286492640483,
        'ether.fi': 2.553468325607872,
        'ZeroLend': 2.1631292185085793,
        'Stargate': 2.122468894852403,
        'Fuel': 1.837846629259169,
        'Compound V3': 1.6508091404407579,
        'Swell': 1.528828169472229
    };

    const ghoUsersData = {
        'Pendle V2': 7.705703090988246,
        'Curve': 7.18328254244667,
        'ether.fi': 6.835002176752286,
        'EigenLayer': 6.356116673922507,
        'Uniswap V3': 6.225511536787113,
        'Convex': 5.572485851110144,
        'LIDO': 5.398345668262952,
        'Aerodrome': 4.919460165433174,
        'GMX': 4.266434479756204,
        'Velodrome V2': 4.092294296909012
    };

    const newGhoUsersData = {
        'ether.fi': 6.826241134751773,
        'Pendle V2': 6.648936170212766,
        'EigenLayer': 6.560283687943262,
        'Uniswap V3': 5.2304964539007095,
        'LIDO': 5.141843971631205,
        'Curve': 4.964539007092199,
        'Aerodrome': 4.609929078014184,
        'GMX': 3.8120567375886525,
        'Convex': 3.6347517730496453,
        'Beefy': 3.546099290780142};

    const existingAaveUsersData = {
        'Curve': 9.32420872540633,
        'Pendle V2': 8.72540633019675,
        'Convex': 7.442258340461934,
        'Uniswap V3': 7.18562874251497,
        'ether.fi': 6.8434559452523525,
        'EigenLayer': 6.159110350727117,
        'LIDO': 5.645851154833191,
        'Synthetix': 5.645851154833191,
        'Aerodrome': 5.218135158254919,
        'GMX': 4.704875962360992}

    function createOverallTitle() {
        const subTitleElement = document.createElement('div');
        subTitleElement.textContent = "The v3 Users category comprises all users who either borrowed or supplied on Aave. GHO users are the subset of v3 users who borrowed GHO. New GHO users are the subset of GHO users who made their first transaction on Aave by borrowing GHO, while existing users refers to users who had already used Aave to borrow other tokens prior to borrowing GHO.";
        subTitleElement.style.textAlign = 'center';
        // subTitleElement.style.fontStyle = 'italic';
        subTitleElement.style.color = '#666';
        subTitleElement.style.marginLeft = '5%';
        subTitleElement.style.marginRight = '5%';
        subTitleElement.style.fontSize = '12px';
        document.getElementById('chartContainer').prepend(subTitleElement);
        const titleElement = document.createElement('h4');
        titleElement.textContent = 'Cross Protocol Usage per User Type';
        titleElement.style.textAlign = 'center';
        titleElement.style.color = '#666';
        titleElement.style.marginBottom = '8px';
        document.getElementById('chartContainer').prepend(titleElement);
    }

    document.addEventListener('DOMContentLoaded', function() {
        createOverallTitle();
        createHorizontalBarChart(v3UsersData, 'v3UsersChart', 'v3 Users');
        createHorizontalBarChart(ghoUsersData, 'ghoUsersChart', 'GHO Users');
        createHorizontalBarChart(newGhoUsersData, 'newGhoUsersChart', 'New GHO Users');
        createHorizontalBarChart(existingAaveUsersData, 'existingAaveUsersChart', 'Existing AAVE Users who borrowed GHO');
    });
})();