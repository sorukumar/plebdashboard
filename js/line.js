// Register the plugin
Chart.register(ChartDataLabels);

// Function to create the node chart
function createNodeChart() {
    Papa.parse("data/NodeES.csv", {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Papa Parse Results:', results);
            if (results.errors.length > 0) {
                console.error('Papa Parse Errors:', results.errors);
            }
            if (results.data && results.data.length > 0) {
                const { chartData, tooltipData } = processNodeData(results.data);
                drawNodeChart(chartData, tooltipData);
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
function processNodeData(rawData) {
    console.log('Raw Data:', rawData);

    const categories = ['Powerhouses', 'Pillars', 'Plebs'];
    const metrics = ['Node', 'Capacity', 'Channel'];

    const tooltipData = {};
    categories.forEach(category => {
        const item = rawData.find(item => item.Node_Cap_Tier === category);
        if (item) {
            tooltipData[category] = {
                Num_Nodes: item.Num_Nodes,
                Node_Percentage: item.Node_Percentage,
                Capacity_Percentage: item.Capacity_Percentage,
                Channel_Percentage: item.Channel_Percentage,
                Lowest_PRank: item.Lowest_PRank,
                Highest_PRank: item.Highest_PRank
            };
        } else {
            console.warn(`Data for ${category} not found`);
            tooltipData[category] = {
                Num_Nodes: '0',
                Node_Percentage: '0',
                Capacity_Percentage: '0',
                Channel_Percentage: '0',
                Lowest_PRank: '0',
                Highest_PRank: '0'
            };
        }
    });

    console.log('Tooltip Data:', tooltipData);

    const chartData = {};
    metrics.forEach(metric => {
        chartData[metric] = {};
        categories.forEach(category => {
            const value = parseFloat(tooltipData[category][`${metric}_Percentage`]);
            chartData[metric][category] = isNaN(value) ? 0 : value * 100;
        });
    });

    console.log('Chart Data:', chartData);

    return { chartData, tooltipData };
}

// Function to draw the node chart
function drawNodeChart(data, tooltipData) {
    const ctx = document.getElementById('nodeChart').getContext('2d');

    // Define chart colors and descriptive labels
    const categoryConfig = {
        Powerhouses: { color: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)', label: 'Powerhouses (> 5 BTC)' },
        Pillars: { color: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)', label: 'Pillars (> 10M Sats)' },
        Plebs: { color: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)', label: 'Plebs (<= 10M Sats)' }
    };

    const labels = ['Node', 'Capacity', 'Channel'];
    const datasets = Object.keys(categoryConfig).map(category => ({
        label: categoryConfig[category].label,
        data: [data.Node[category], data.Capacity[category], data.Channel[category]],
        backgroundColor: categoryConfig[category].color,
        borderColor: categoryConfig[category].border,
        borderWidth: 1
    }));

    new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    display: false, // This hides the entire x-axis including ticks and labels
                    grid: {
                        display: false // This removes the grid lines
                    },
                    title: {
                        display: false
                    }
                },
                y: { 
                    stacked: true,
                    grid: {
                        display: false // This removes the grid lines
                    },
                    ticks: {
                        display: true // Ensures the y-axis labels are displayed
                    },
                    border: {
                        display: false // This removes the y-axis line
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const category = context.dataset.label.split(' ')[0];
                            const value = context.raw;
                            const nodeData = tooltipData[category];
                            return [
                                `${context.dataset.label}: ${value > 15 ? value.toFixed(0) : value.toFixed(1)}%`,
                                `Nodes: ${nodeData.Num_Nodes}`,
                                `Node: ${nodeData.Node_Percentage}%`,
                                `Capacity: ${nodeData.Capacity_Percentage}%`,
                                `Channel: ${nodeData.Channel_Percentage}%`,
                                `Lowest PRank: ${nodeData.Lowest_PRank}`,
                                `Highest PRank: ${nodeData.Highest_PRank}`
                            ];
                        }
                    }
                },
                legend: {
                    position: 'top',
                    display: true,
                    labels: { font: { size: 12 } }
                },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value, context) => value > 5 ? value.toFixed(1) + '%' : ''
                }
            }
        }
    });
}

// Call the function to create the chart
createNodeChart();
