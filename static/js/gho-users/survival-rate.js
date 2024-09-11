document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('survivalChart').getContext('2d');

    const tokens = ['USDC', 'USDT', 'DAI', 'crvUSD', 'GHO', 'WBTC', 'WETH', 'LUSD', 'PYUSD'];
    const data = {
        'PYUSD': [0.8372093023255814, 0.7558139534883721, 0.627906976744186, 0.5813953488372093, 0.5232558139534884, 0.4883720930232558, 0.4186046511627907, 0.38372093023255816, 0.3372093023255814],
        'LUSD': [0.7966101694915254, 0.6101694915254238, 0.5508474576271186, 0.4915254237288136, 0.4491525423728814, 0.3813559322033898, 0.3559322033898305, 0.3474576271186441, 0.3220338983050847],
        'USDC': [0.7564457702961858, 0.6369060302578308, 0.5329213722565523, 0.450884295759642, 0.38866396761133604, 0.34327722139356487, 0.30428297464308546, 0.27551672704027275, 0.25335606222032814],
        'USDT': [0.7537757437070938, 0.6299771167048055, 0.5283752860411899, 0.45423340961098396, 0.39748283752860414, 0.34210526315789475, 0.30045766590389017, 0.26704805491990846, 0.2411899313501144],
        'DAI': [0.7668393782383419, 0.6404145077720207, 0.522279792746114, 0.4466321243523316, 0.39481865284974094, 0.35233160621761656, 0.32020725388601035, 0.2911917098445596, 0.26528497409326424],
        'crvUSD': [0.8205128205128205, 0.5384615384615384, 0.4358974358974359, 0.41025641025641024, 0.3076923076923077, 0.28205128205128205, 0.20512820512820512, 0.1282051282051282, 0.1282051282051282],
        'GHO': [0.6188118811881188, 0.504950495049505, 0.41707920792079206, 0.36386138613861385, 0.29826732673267325, 0.2660891089108911, 0.24504950495049505, 0.22153465346534654, 0.2004950495049505],
        'WBTC': [0.7510204081632653, 0.6040816326530613, 0.5183673469387755, 0.43673469387755104, 0.37551020408163266, 0.32857142857142857, 0.3020408163265306, 0.2755102040816326, 0.2530612244897959],
        'WETH': [0.6659646166807077, 0.527379949452401, 0.4132266217354676, 0.3138163437236731, 0.2750631844987363, 0.2350463352990733, 0.20850884582982307, 0.18576242628475148, 0.16849199663016007],
    };

    const labels = ['Stop', '1 or more', '2 or more', '3 or more', '4 or more', '5 or more', '6 or more', '7 or more', '8 or more'];

    const datasets = tokens.map(token => ({
        label: token,
        data: data[token],
        borderWidth: token === 'GHO' ? 3 : 1,
        borderColor: getColorForToken(token,  token === 'GHO' ? 1 : 0.5),
        backgroundColor: getColorForToken(token, token === 'GHO' ? 0.8 : 0.5),
        fill: false,
        tension: 0.1
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Trades'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Survival Rate'
                    },
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += (context.parsed.y * 100).toFixed(2) + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
});

function getColorForToken(token, alpha = 1) {
    const colors = {
        'PYUSD': `rgba(66, 140, 18, ${alpha})`,
        'LUSD': `rgba(188, 170, 242, ${alpha})`,
        'USDT': `rgba(75, 192, 192, ${alpha})`,   // Soft teal
        'DAI': `rgba(255, 206, 86, ${alpha})`,    // Soft yellow
        'crvUSD': `rgba(255, 129, 152, ${alpha})`, // Soft pink
        'GHO': `rgba(243, 82, 85, ${alpha})`,   // Soft purple
        'WBTC': `rgba(255, 159, 64, ${alpha})`,   // Soft orange
        'WETH': `rgba(131, 232, 117, ${alpha})`,  // Soft green
        'USDC': `rgba(84, 162, 235, ${alpha})`,   // Soft blue
    };
    return colors[token] || `rgba(128, 128, 128, ${alpha})`;
}