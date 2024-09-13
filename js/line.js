Papa.parse("data/NodeES.csv", {
    download: true,
    header: true,
    complete: function(results) {
        console.log('Parsed Data:', results.data); // Check if the data is being loaded correctly

        const filteredData = results.data.filter(item => 
            item.Node_Cap_Tier &&
            item.Node_Percentage &&
            item.Capacity_Percentage &&
            item.Channel_Percentage
        );

        console.log('Filtered Data:', filteredData); // Check if the data is being filtered correctly

        // Prepare the tooltip data
        const tooltipData = {
            Powerhouse: null,
            Pillers: null,
            Plebs: null
        };

        filteredData.forEach(item => {
            let category = item.Node_Cap_Tier.trim();
            if (category === 'Powerhouses') category = 'Powerhouse';
            if (category === 'Pillars') category = 'Pillers';

            tooltipData[category] = {
                Num_Nodes: item.Num_Nodes,
                Node_Percentage: item.Node_Percentage,
                Capacity_Percentage: item.Capacity_Percentage,
                Channel_Percentage: item.Channel_Percentage,
                Lowest_PRank: item.Lowest_PRank,
                Highest_PRank: item.Highest_PRank
            };
        });

        console.log('Tooltip Data:', tooltipData); // Ensure tooltip data is correct

        // Use the parsed data directly without further normalization
        const nodeData = {
            Powerhouse: parseFloat(tooltipData.Powerhouse.Node_Percentage) * 100,
            Pillers: parseFloat(tooltipData.Pillers.Node_Percentage) * 100,
            Plebs: parseFloat(tooltipData.Plebs.Node_Percentage) * 100
        };

        const capacityData = {
            Powerhouse: parseFloat(tooltipData.Powerhouse.Capacity_Percentage) * 100,
            Pillers: parseFloat(tooltipData.Pillers.Capacity_Percentage) * 100,
            Plebs: parseFloat(tooltipData.Plebs.Capacity_Percentage) * 100
        };

        const channelData = {
            Powerhouse: parseFloat(tooltipData.Powerhouse.Channel_Percentage) * 100,
            Pillers: parseFloat(tooltipData.Pillers.Channel_Percentage) * 100,
            Plebs: parseFloat(tooltipData.Plebs.Channel_Percentage) * 100
        };

        // Draw the chart with this data
        drawStackedBarChart([{
            Node: nodeData,
            Capacity: capacityData,
            Channel: channelData
        }], tooltipData);
    }
});

function drawStackedBarChart(data, tooltipData) {
    const ctx = document.getElementById('nodeChart').getContext('2d');

    const labels = ['Node Percentage', 'Capacity Percentage', 'Channel Percentage'];
    const datasets = [
        {
            label: 'Powerhouse',
            data: [
                data[0].Node.Powerhouse || 0,
                data[0].Capacity.Powerhouse || 0,
                data[0].Channel.Powerhouse || 0
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.7)', // Red
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: 'Pillers',
            data: [
                data[0].Node.Pillers || 0,
                data[0].Capacity.Pillers || 0,
                data[0].Channel.Pillers || 0
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Plebs',
            data: [
                data[0].Node.Plebs || 0,
                data[0].Capacity.Plebs || 0,
                data[0].Channel.Plebs || 0
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.7)', // Green
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }
    ];

    console.log('Chart Data:', datasets); // Log chart data to make sure it's valid

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%'; 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                },
                y: {
                    stacked: true,
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label;
                            const value = tooltipItem.raw;

                            const category = datasetLabel === 'Powerhouse' ? 'Powerhouse' : 
                                             datasetLabel === 'Pillers' ? 'Pillers' : 'Plebs';

                            const nodeData = tooltipData[category];
                            return `${datasetLabel}: ${value > 15 ? value.toFixed(0) : value.toFixed(1)}%\n` +
                                   `Nodes: ${nodeData.Num_Nodes}\n` +
                                   `Node: ${nodeData.Node_Percentage}%\n` +
                                   `Capacity: ${nodeData.Capacity_Percentage}%\n` +
                                   `Channel: ${nodeData.Channel_Percentage}%\n` +
                                   `Lowest PRank: ${nodeData.Lowest_PRank}\n` +
                                   `Highest PRank: ${nodeData.Highest_PRank}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    display: false 
                }
            }
        }
    });
}
