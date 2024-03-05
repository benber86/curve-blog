document.addEventListener('DOMContentLoaded', function () { mevDistribution = new Chart(document.getElementById('mevDistribution'), {

    type: 'bar',
    data: {
        labels: ['$0-$10', '$10-$50', '$50-$100', '$100-$250', '$250-$500', '$500-$1000', '$1000-$1500', '$1500-$3000', '$3000 and over'],
        datasets: [{
            label: 'Count',
            data: [167, 889, 1092, 2006, 1736, 1544, 578, 579, 169],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            },

            x: {
                title: {
                    display: true,
                    text: 'Sandwich USD Profit'
                },
            }
        }
    }
})});