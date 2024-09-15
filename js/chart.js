// Register the plugin
Chart.register(ChartDataLabels);

// Function to parse CSV and create chart
function createChannelChart() {
    console.log('Creating channel chart...');
    Papa.parse("data/ChannelES.csv", {
        download: true,
        header: true,
        complete: function(results) {
            console.log('CSV parsing complete');
            if (results.errors.length > 0) {
                console.error('CSV parsing errors:', results.errors);
            }
            if (results.data && results.data.length > 0) {
                console.log('Processing data...');
                const data = processData(results.data);
                drawChart(data.normalizedData, data.aggregateData);
            } else {
                console.error('No data parsed from CSV');
            }
        },
        error: function(error) {
            console.error('Papa Parse error:', error);
        }
    });
}

// Function to process CSV data
function processData(rawData) {
    console.log('Raw data:', rawData);

    const categories = ['My Way', 'Highway', 'Freeway'];
    const metrics = ['Channel', 'Capacity'];
    
    const aggregateData = categories.reduce((acc, category) => {
        const item = rawData.find(item => item.Channel_Size_Tier === category);
        if (item) {
            acc[category] = {
                Num_Channels: item.Num_Channels,
                Channel_Percentage: parseFloat(item.Channel_Percentage),
                Capacity_Percentage: parseFloat(item.Capacity_Percentage),
                Num_Unique_Nodes: item.Num_Unique_Nodes,
                Total_Capacity: item.Total_Capacity
            };
        } else {
            console.warn(`Data for ${category} not found`);
            acc[category] = {
                Num_Channels: '0',
                Channel_Percentage: 0,
                Capacity_Percentage: 0,
                Num_Unique_Nodes: '0',
                Total_Capacity: '0'
            };
        }
        return acc;
    }, {});

    console.log('Aggregate data:', aggregateData);

    const normalizedData = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((innerAcc, category) => {
            innerAcc[category] = aggregateData[category][`${metric}_Percentage`] * 100;
            return innerAcc;
        }, {});
        return acc;
    }, {});

    console.log('Normalized data:', normalizedData);

    return { normalizedData, aggregateData };
}

// Function to draw the chart
function drawChart(data, aggregateData) {
    console.log('Drawing chart...');
    const ctx = document.getElementById('myChart').getContext('2d');

    // Define chart colors
    const colors = {
        'My Way': { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },
        'Highway': { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },
        'Freeway': { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' }
    };

    // Define descriptive labels for legend
    const descriptiveLabels = {
        'My Way': 'My Way (Small Channels)',
        'Highway': 'Highway (Medium Channels)',
        'Freeway': 'Freeway (Large Channels)'
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
            responsive: true,
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
                            const category = context.dataset.label.split(' (')[0];
                            const value = context.raw;
                            const extraInfo = aggregateData[category];

                            return [
                                `${context.dataset.label}: ${value.toFixed(1)}%`,
                                `Num Channels: ${extraInfo.Num_Channels}`,
                                `Channel Percentage: ${(extraInfo.Channel_Percentage * 100).toFixed(1)}%`,
                                `Capacity Percentage: ${(extraInfo.Capacity_Percentage * 100).toFixed(1)}%`,
                                `Unique Nodes: ${extraInfo.Num_Unique_Nodes}`,
                                `Total Capacity: ${parseInt(extraInfo.Total_Capacity).toLocaleString()}`
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
    console.log('Chart drawn');
}

// Call the function to create the chart
console.log('Initializing chart creation...');
createChannelChart();
