document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('dynamicDirectionChart').getContext('2d');
    const colors = ['#FF6384CC', '#36A2EBCC', '#FFCE56CC'];
    const data = {
        labels: [
            ['p=0.05', 'A_min=30', 'A_max=500'],
            ['p=0.1', 'A_min=30', 'A_max=400'],
            ['p=0.1', 'A_min=10', 'A_max=500'],
            ['p=0.2', 'A_min=30', 'A_max=400'],
            ['p=0.25', 'A_min=30', 'A_max=400'],
            ['p=0.25', 'A_min=100', 'A_max=800'],
            ['p=0.3', 'A_min=100', 'A_max=500'],
        ]
        ,
        datasets: [
            {
                label: 'ETH to stETH',
                data: [-469.951718, -195.079423, -322.699170, 162.181224, 358.723511, -310.630037, 29.289697],
                backgroundColor: '#36A2EBCC',
                borderColor: '#36A2EB',
                borderWidth: 1
            },
            {
                label: 'stETH to ETH',
                data: [454.431328, 157.881908, 286.819079, -258.048485, -489.689210, 251.961883, -97.718835],
                backgroundColor: '#FFCE56CC',
                borderColor: '#FFCE56',
                borderWidth: 1
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Difference in Trade Outcome vs Fixed A Pool per direction'
                },
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Difference in total received tokens'
                    },
                    ticks: {

                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 10
                        },
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Parameters'
                    }
                }
            }
        }
    });
});