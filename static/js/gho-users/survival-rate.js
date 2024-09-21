document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('survivalChart').getContext('2d');

    const tokens = ['USDC', 'USDT', 'DAI', 'crvUSD', 'GHO', 'WBTC', 'WETH', 'LUSD', 'PYUSD'];
    const data = {
        'PYUSD': [0.8372093023255814,
            0.7558139534883721,
            0.627906976744186,
            0.5813953488372093,
            0.5232558139534884,
            0.4883720930232558,
            0.4186046511627907,
            0.38372093023255816,
            0.3372093023255814],
        'LUSD': [0.8360655737704918,
            0.639344262295082,
            0.5737704918032787,
            0.5081967213114754,
            0.4918032786885246,
            0.4262295081967213,
            0.39344262295081966,
            0.39344262295081966,
            0.3442622950819672],
        'USDC': [0.7562412342215988,
            0.6350631136044881,
            0.5273492286115007,
            0.44431977559607294,
            0.37952314165497897,
            0.33492286115007014,
            0.297054698457223,
            0.26956521739130435,
            0.24516129032258063],
        'USDT': [0.7591693635382956,
            0.6294498381877023,
            0.5218446601941747,
            0.4452535059331176,
            0.38727076591154264,
            0.33360302049622437,
            0.29395900755124055,
            0.261596548004315,
            0.23516720604099245],
        'DAI': [0.7903780068728522,
            0.6563573883161512,
            0.5309278350515464,
            0.44673539518900346,
            0.39347079037800686,
            0.34536082474226804,
            0.31099656357388317,
            0.2766323024054983,
            0.24570446735395188],
        'crvUSD': [0.8205128205128205,
            0.5384615384615384,
            0.4358974358974359,
            0.41025641025641024,
            0.3076923076923077,
            0.28205128205128205,
            0.20512820512820512,
            0.1282051282051282,
            0.1282051282051282],
        'GHO': [0.6188118811881188, 0.504950495049505, 0.41707920792079206, 0.36386138613861385, 0.29826732673267325, 0.2660891089108911, 0.24504950495049505, 0.22153465346534654, 0.2004950495049505],
        'WBTC': [0.7373737373737373,
            0.5883838383838383,
            0.49747474747474746,
            0.42424242424242425,
            0.37373737373737376,
            0.3282828282828283,
            0.30303030303030304,
            0.2878787878787879,
            0.26515151515151514],
        'WETH': [0.6483164083377873,
            0.51309460181721,
            0.4051309460181721,
            0.3180117584179583,
            0.2773917691074292,
            0.23516835916622128,
            0.21272047033671834,
            0.1902725815072154,
            0.1742383752004276],
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