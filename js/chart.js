// Function to parse CSV and create chart
function createChannelChart() {
    Papa.parse("data/ChannelES.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const data = processData(results.data);
            drawChart(data.normalizedData, data.aggregateData);
        }
    });
}

// Function to process CSV data
function processData(rawData) {
    const categories = ['Myway', 'Highway', 'Freeway'];
    const metrics = ['Channel', 'Capacity'];
    
    const aggregateData = categories.reduce((acc, category) => {
        acc[category] = rawData.find(item => item.Channel_Size_Tier === (category === 'Myway' ? 'My Way' : category)) || {};
        return acc;
    }, {});

    const totals = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((sum, category) => sum + parseFloat(aggregateData[category][`${metric}_Percentage`] || 0), 0);
        return acc;
    }, {});

    const normalizedData = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((innerAcc, category) => {
            innerAcc[category] = (parseFloat(aggregateData[category][`${metric}_Percentage`] || 0) / totals[metric]) * 100;
            return innerAcc;
        }, {});
        return acc;
    }, {});

    return { normalizedData, aggregateData };
}

// Function to draw the chart
function drawChart(data, aggregateData) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Define chart colors
    const colors = {
        Myway: { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },
        Highway: { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },
        Freeway: { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' }
    };

    // Define descriptive labels for legend
    const descriptiveLabels = {
        Myway: 'Myway (<= 5M Sats)',
        Highway: 'Highway (> 5M Sats)',
        Freeway: 'Freeway (> 1 BTC)'
    };

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Channel', 'Capacity'],
            datasets: Object.keys(data.Channel).map(category => ({
                label: descriptiveLabels[category],
                data: [data.Channel[category], data.Capacity[category]],
                backgroundColor: colors[category].bg,
                borderColor: colors[category].border,
                borderWidth: 1
            }))
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    stacked: true,
                    ticks: {
                        callback: value => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Metrics'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const category = tooltipItem.dataset.label.split(' ')[0];
                            const value = tooltipItem.raw;
                            const extraInfo = aggregateData[category];

                            return [
                                `${tooltipItem.dataset.label}: ${value > 20 ? value.toFixed(0) : value.toFixed(1)}%`,
                                `Num Channels: ${extraInfo.Num_Channels || 'N/A'}`,
                                `Channel Percentage: ${extraInfo.Channel_Percentage || 'N/A'}`,
                                `Capacity Percentage: ${extraInfo.Capacity_Percentage || 'N/A'}`,
                                `Unique Nodes: ${extraInfo.Num_Unique_Nodes || 'N/A'}`
                            ];
                        }
                    }
                },
                legend: {
                    position: 'top',
                    display: true, // Enable the legend
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                // Define data labels here
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value, context) => value > 5 ? value.toFixed(1) + '%' : ''
                }
            }
        },
        plugins: [ChartDataLabels] // Add this line to enable data labels
    });
}

// Call the function to create the chart
createChannelChart();
