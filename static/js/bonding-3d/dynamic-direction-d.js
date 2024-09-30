document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('dynamicDirectionChartD').getContext('2d');
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
                data: [2071.045051, 2386.764062, 4852.904782, 2622.634832, 2693.442138, 564.455834, 676.163289],
                backgroundColor: '#36A2EBCC',
                borderColor: '#36A2EB',
                borderWidth: 1
            },
            {
                label: 'stETH to ETH',
                data: [455.435681, 213.419219, 518.069303, -96.017287, -265.943249, 207.927903, -125.886239],
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