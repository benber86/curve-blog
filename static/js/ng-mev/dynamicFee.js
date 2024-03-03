document.addEventListener('DOMContentLoaded', function () {
    const xpiSlider = document.getElementById('xpiSlider');
    const xpjSlider = document.getElementById('xpjSlider');
    const feeSlider = document.getElementById('feeSlider');
    const offpegSlider = document.getElementById('offpegSlider');
    const xpiNumber = document.getElementById('xpiNumber');
    const xpjNumber = document.getElementById('xpjNumber');
    const feeNumber = document.getElementById('feeNumber');
    const offpegNumber = document.getElementById('offpegNumber');

    const updateValues = () => {
        xpiNumber.value = xpiSlider.value;
        xpjNumber.value = xpjSlider.value;
        feeNumber.value = feeSlider.value;
        offpegNumber.value = offpegSlider.value;
        updateBarChart();
        updateLineChart();
    };

    xpiSlider.oninput = () => updateValues();
    xpjSlider.oninput = () => updateValues();
    feeSlider.oninput = () => updateValues();
    offpegSlider.oninput = () => updateValues();
    xpiNumber.oninput = () => updateValues();
    xpjNumber.oninput = () => updateValues();
    feeNumber.oninput = () => updateValues();
    offpegNumber.oninput = () => updateValues();

    let barChart, lineChart;

    const dynamicFee = (xpi, xpj, fee, offpeg) => {
        const FEE_DENOMINATOR = 1e10;
        if (offpeg <= FEE_DENOMINATOR) return fee;
        const xps2 = (Number(xpi) + Number(xpj)) ** 2;
        return (offpeg * fee) / ((offpeg - FEE_DENOMINATOR) * 4 * xpi * xpj / xps2 + FEE_DENOMINATOR);
    };

    const updateBarChart = () => {
        const xpi = xpiSlider.value;
        const xpj = xpjSlider.value;
        if (barChart) {
            barChart.data.datasets[0].data = [xpi, xpj];
            barChart.update();
        } else {
            const ctx = document.getElementById('barChart').getContext('2d');
            barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['xpi', 'xpj'],
                    datasets: [{
                        label: 'Pool Balances',
                        data: [xpi, xpj],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Pool Balances',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
        }
    };

    const updateLineChart = () => {
        let labels = [], data = [], userValue = [];
        for (let i = 1; i <= 99; i++) {
            labels.push(`${i}:${100 - i}`);
            data.push(dynamicFee(i , (100 - i), feeSlider.value, offpegSlider.value));
        }
        const xpSum = Number(xpiSlider.value) + Number(xpjSlider.value)
        const userXpi = Math.round((xpiSlider.value / xpSum) * 100)
        const userXpj = Math.round((xpjSlider.value / xpSum) * 100)
        const userDynamicFee = dynamicFee(userXpi, userXpj, feeSlider.value, offpegSlider.value);
        userValue.push({
            x: `${userXpi}:${userXpj}`,
            y: userDynamicFee
        });

        if (lineChart) {
            lineChart.data.labels = labels;
            lineChart.data.datasets[0].data = data;
            lineChart.data.datasets[1].data = userValue;
            lineChart.update();
        } else {
            const ctx = document.getElementById('lineChart').getContext('2d');
            lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Dynamic Fee vs Pool Balances',
                        data: data,
                        fill: false,
                        pointRadius: 0,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        order: 2
                    }, {
                        label: 'User Selected Value',
                        data: userValue,
                        fill: false,
                        pointRadius: 5,
                        pointBackgroundColor: 'red',
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        showLine: false,
                        order: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Dynamic Fee vs Ratio xpi/xpj',
                            font: {
                                size: 14
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'xpi:xpj proportions (%)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Dynamic fee'
                            }
                        }
                    }
                }
            });
        }
    };

    updateValues();
});