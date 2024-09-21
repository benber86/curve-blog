const volumeData = {
    before: {'Others': 7.0601173794268774, 'GhoAToken': 26.368345670785526, 'UniswapV3Pool': 12.820243841905556, 'ParaSwap': 10.99118462280943, 'Balancer': 10.95174283426872, '1inch': 9.046622707243571, 'DeFi Saver': 6.88884715156559, 'CowSwap': 5.772784830645803, 'Maverick': 4.164041290106433, 'GHO Staking': 3.8331680848257284, '0x Exchange': 0.828358069569634, 'Curve': 0.7109441547486193, 'AirSwap': 0.38759545085423397, 'Odos': 0.1760039112442538},
    after: {'Others': 14.814680487037442, 'GhoAToken': 19.903342158243376, 'GHO Staking': 19.07012995009374, 'CowSwap': 13.534577563998418, '1inch': 8.015124642920433, 'ParaSwap': 7.479805859885773, 'DeFi Saver': 5.7519112069062945, 'Maverick': 2.041217008408768, 'Curve': 2.027662326331488, 'GHO Stability Module': 1.9164801975378973, 'Balancer': 1.7983541047690292, 'Odos': 1.1703255030174986, 'UniswapV3Pool': 1.1522473141960305, 'Gearbox': 1.1304801500603665, '0x Exchange': 0.12273346375545544, 'AirSwap': 0.0709280628379815}
};

const txCountData = {
    before: {'Others': 5.602816075095336, 'UniswapV3Pool': 27.676738046347904, 'GhoAToken': 22.63127016720446, 'ParaSwap': 11.645643883836902, '1inch': 8.213552361396303, 'CowSwap': 7.788207685538281, 'DeFi Saver': 7.0401877383396885, 'Balancer': 2.478732766207099, 'AirSwap': 2.097389263713699, 'GHO Staking': 1.9360516280434146, 'Curve': 1.1880316808448226, 'Maverick': 0.9680258140217073, '0x Exchange': 0.6746846582575535, 'Odos': 0.05866823115283074},
    after: {'Others': 8.728988498967857, 'GhoAToken': 22.279563550575052, 'GHO Staking': 17.472721910940724, 'ParaSwap': 10.616337363609555, 'CowSwap': 10.291949277499263, 'UniswapV3Pool': 10.129755234444117, 'DeFi Saver': 5.485107637864937, '1inch': 5.337658507814804, 'Curve': 3.06694190504276, 'Maverick': 1.8136242996166323, 'Balancer': 1.3417870834562076, 'AirSwap': 1.0173989973459157, 'Odos': 0.8846947803007963, 'Gearbox': 0.8257151282807431, '0x Exchange': 0.48658212916543786, 'GHO Stability Module': 0.22117369507519907}
};

let chart;

function createChart(dataType) {
    const ctx = document.getElementById('beforeAfterChart').getContext('2d');
    const data = dataType === 'volume' ? volumeData : txCountData;

    const protocols = [...new Set([...Object.keys(data.before), ...Object.keys(data.after)])];
    protocols.sort((a, b) => {
        if (a === 'GHO Staking') return -1;
        if (b === 'GHO Staking') return 1;
        if (a === 'Others') return 1;
        if (b === 'Others') return -1;
        return 0;
    });

    const colors = [
        '#FF6384CC', '#36A2EBCC', '#FFCE56CC', '#4BC0C0CC', '#9966FFCC', '#FF9F40CC',
        '#FFD700CC', '#83D475CC', '#F78C6CCC', '#7B7FECCC', '#C284B5CC', '#F66D44CC',
        '#B29868CC', '#68AACCCC', '#FF7070CC', '#9EC2E6CC', '#E0B3FCCC', '#C9CBCFCC',
    ];

    const datasets = protocols.map((protocol, index) => ({
        label: protocol,
        data: [data.before[protocol] || 0, data.after[protocol] || 0],
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderWidth: 1
    }));

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Before Incentives', 'After Incentives'],
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,

                    font: {
                        size: 16
                    },
                    text: dataType === 'volume' ? 'First Order Flow Destinations Before and After Incentives (USD Volume)' : 'First Order Flow Destinations Before and After Incentives (Transaction Count)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) {
                                label += context.parsed.x.toFixed(1) + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    title: {
                        display: false,
                        text: 'Percentage'
                    }
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const chartContainer = document.getElementById('beforeAfterChart').parentNode;

    // Create and append the dropdown
    const dropdown = document.createElement('select');
    dropdown.id = 'data-type';
    const options = [
        { value: 'volume', text: 'USD Volume' },
        { value: 'transactions', text: 'Number of Transactions' }
    ];
    options.forEach(option => {
        const el = document.createElement('option');
        el.value = option.value;
        el.textContent = option.text;
        dropdown.appendChild(el);
    });
    chartContainer.insertBefore(dropdown, document.getElementById('beforeAfterChart'));

    createChart('volume');

    dropdown.addEventListener('change', function() {
        createChart(this.value);
    });
});