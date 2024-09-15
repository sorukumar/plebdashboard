// Function to create the node chart
function createNodeChart() {
    Papa.parse("data/NodeES.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const { chartData, tooltipData } = processNodeData(results.data);
            drawNodeChart(chartData, tooltipData);
        }
    });
}

// Function to process CSV data
function processNodeData(rawData) {
    console.log('Raw Data:', rawData);

    const categories = ['Powerhouse', 'Pillers', 'Plebs'];
    const metrics = ['Node', 'Capacity', 'Channel'];

    const tooltipData = categories.reduce((acc, category) => {
        const item = rawData.find(item => {
            const nodeTier = item.Node_Cap_Tier && item.Node_Cap_Tier.trim();
            return nodeTier === (category === 'Powerhouse' ? 'Powerhouses' : 
                                 category === 'Pillers' ? 'Pillars' : 'Plebs');
        });
        
        if (item) {
            acc[category] = {
                Num_Nodes: item.Num_Nodes,
                Node_Percentage: item.Node_Percentage,
                Capacity_Percentage: item.Capacity_Percentage,
                Channel_Percentage: item.Channel_Percentage,
                Lowest_PRank: item.Lowest_PRank,
                Highest_PRank: item.Highest_PRank
            };
        } else {
            console.warn(`Data for ${category} not found`);
            acc[category] = {
                Num_Nodes: '0',
                Node_Percentage: '0',
                Capacity_Percentage: '0',
                Channel_Percentage: '0',
                Lowest_PRank: '0',
                Highest_PRank: '0'
            };
        }
        
        return acc;
    }, {});

    console.log('Tooltip Data:', tooltipData);

    const chartData = metrics.reduce((acc, metric) => {
        acc[metric] = categories.reduce((innerAcc, category) => {
            innerAcc[category] = parseFloat(tooltipData[category][`${metric}_Percentage`]) * 100;
            return innerAcc;
        }, {});
        return acc;
    }, {});

    console.log('Chart Data:', chartData);

    return { chartData, tooltipData };
}

// Function to draw the node chart
function drawNodeChart(data, tooltipData) {
    const ctx = document.getElementById('nodeChart').getContext('2d');

    // Define chart colors and descriptive labels
    const categoryConfig = {
        Powerhouse: { color: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)', label: 'Powerhouse (> 5BTC)' },
        Pillers: { color: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)', label: 'Pillers (> 10M Sats)' },
        Plebs: { color: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)', label: 'Plebs (<= 10M Sats)' }
    };

     const labels = ['Node Percentage', 'Capacity Percentage', 'Channel Percentage'];
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
                    beginAtZero: true,
                    max: 100,
                    stacked: true,
                    ticks: { callback: value => value + '%' },
                    title: { display: true, text: 'Percentage' }
                },
                y: { stacked: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const category = tooltipItem.dataset.label.split(' ')[0];
                            const value = tooltipItem.raw;
                            const nodeData = tooltipData[category];
                            return [
                                `${tooltipItem.dataset.label}: ${value > 15 ? value.toFixed(0) : value.toFixed(1)}%`,
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
                // Data labels configuration
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value, context) => value > 5 ? value.toFixed(1) + '%' : ''
                }
            }
        },
        plugins: [ChartDataLabels] // Enable data labels
    });
}

// Call the function to create the chart
createNodeChart();
