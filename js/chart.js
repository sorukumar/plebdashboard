// Register the plugin
Chart.register(ChartDataLabels);

// Function to parse CSV and create chart
function createChannelChart() {
    Papa.parse("data/ChannelES.csv", {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Papa Parse Results:', results);
            if (results.errors.length > 0) {
                console.error('Papa Parse Errors:', results.errors);
            }
            if (results.data && results.data.length > 0) {
                const data = processData(results.data);
                drawChart(data.normalizedData, data.aggregateData);
            } else {
                console.error('No data parsed from CSV');
            }
        },
        error: function(error) {
            console.error('Papa Parse Error:', error);
        }
    });
}

// Function to process CSV data
function processData(rawData) {
    console.log('Raw Data:', rawData);

    const categories = ['Myway', 'Highway', 'Freeway'];
    const metrics = ['Channel', 'Capacity'];
    
    const aggregateData = categories.reduce((acc, category) => {
        const item = rawData.find(item => item.Channel_Size_Tier === (category === 'Myway' ? 'My Way' : category));
        acc[category] = item || {
            Num_Channels: '0',
            Channel_Percentage: '0',
            Capacity_Percentage: '0',
            Num_Unique_Nodes: '0'
        };
        return acc;
    }, {});

    console.log('Aggregate Data:', aggregateData);

    const totals = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((sum, category) => sum + parseFloat(aggregateData[category][`${metric}_Percentage`] || 0), 0);
        return acc;
    }, {});

    const normalizedData = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((innerAcc, category) => {
            const value = parseFloat(aggregateData[category][`${metric}_Percentage`] || 0);
            innerAcc[category] = totals[metric] > 0 ? (value / totals[metric]) * 100 : 0;
            return innerAcc;
        }, {});
        return acc;
    }, {});

    console.log('Normalized Data:', normalizedData);

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
        Myway: 'Myway (Small Channels)',
        Highway: 'Highway (Medium Channels)',
        Freeway: 'Freeway (Large Channels)'
    };

    new Chart(ctx, {
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
                        label: function(context) {
                            const category = context.dataset.label.split(' ')[0];
                            const value = context.raw;
                            const extraInfo = aggregateData[category];

                            return [
                                `${context.dataset.label}: ${value > 20 ? value.toFixed(0) : value.toFixed(1)}%`,
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
                    display: true,
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value, context) => value > 5 ? value.toFixed(1) + '%' : ''
                }
            }
        }
    });
}

// Call the function to create the chart
createChannelChart();
