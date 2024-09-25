document.addEventListener('DOMContentLoaded', function() {
    const data1 = {
        labels: ['Never borrowed GHO', 'Borrowed GHO', '                                                                          ', '                                                                          ', '                                                                           '],
        datasets: [{
            data: [90.2, 9.8, 0, 0, 0],
            borderWidth: 0,
            backgroundColor: ['#FF6384CC', '#36A2EBCC', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']
        }]
    };

    const data2 = {
        labels: [
            'Borrowed other tokens on AAVE v2 before borrowing GHO',
            'Borrowed other tokens on AAVE v3 before borrowing GHO',
            'Started by borrowing GHO then borrowed other tokens',
            'Started by borrowing GHO and never borrowed other tokens'
        ],
        datasets: [{
            data: [24.1, 26.7, 13.4, 35.8],
            borderWidth: 0,
            backgroundColor: ['#FF6384CC', '#36A2EBCC', '#FFCE56CC', '#4BC0C0CC'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    };

    const customDataLabels = {
        id: 'customDataLabels',
        afterDraw(chart, args, options) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

            ctx.save();
            const fontSize = 12;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const radius = Math.min(width, height) / 2 * 0.8;

            chart.data.datasets[0].data.forEach((value, i) => {
                const meta = chart.getDatasetMeta(0);
                const arc = meta.data[i];
                const startAngle = arc.startAngle;
                const endAngle = arc.endAngle;
                const middleAngle = startAngle + (endAngle - startAngle) / 2;

                const x = centerX + Math.cos(middleAngle) * radius;
                const y = centerY + Math.sin(middleAngle) * radius;
                if (value>0) {
                //ctx.fillStyle = 'white';
                ctx.fillText(`${value}%`, x, y);}
            });

            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                useborderRadius: true,
                borderRadius: 0,
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '  ' + context.formattedValue + '%';
                    }
                },
                titleAlign: 'center',
            }
        },
        layout: {
            padding: {
                top: 20,
                bottom: 10
            }
        }
    };

    function createDonutChart(ctx, data, title) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                ...options,
                cutout: '60%',
                plugins: {
                    ...options.plugins,
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: [customDataLabels]
        });
    }

    const ctx1 = document.getElementById('donutChart1').getContext('2d');
    const ctx2 = document.getElementById('donutChart2').getContext('2d');

    createDonutChart(ctx1, data1, ['GHO Borrowers', 'Among V3 Borrowers']);
    createDonutChart(ctx2, data2, ['Borrowing Patterns of GHO Borrowers', 'on AAVE']);
});