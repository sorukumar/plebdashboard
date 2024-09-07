
        // Parse the CSV file and prepare the data
        Papa.parse("data/NodeES.csv", {
            download: true,
            header: true,
            complete: function(results) {
                console.log('Parsed Data:', results.data); // Log the parsed data to verify

                // Filter out any empty rows and rows with missing data
                const filteredData = results.data.filter(item => 
                    item.Node_Cap_Tier &&
                    item.Node_Percentage &&
                    item.Capacity_Percentage &&
                    item.Channel_Percentage
                );

                console.log('Filtered Data:', filteredData); // Log filtered data

                // Aggregate data for normalization
                const aggregateData = {
                    Powerhouse: { Node: 0, Capacity: 0, Channel: 0 },
                    Pillers: { Node: 0, Capacity: 0, Channel: 0 },
                    Plebs: { Node: 0, Capacity: 0, Channel: 0 }
                };

                filteredData.forEach(item => {
                    const category = item.Node_Cap_Tier.trim(); // Ensure no leading/trailing spaces
                    if (aggregateData[category] !== undefined) {
                        // Log individual values for debugging
                        aggregateData[category].Node += parseFloat(item.Node_Percentage) || 0;
                        aggregateData[category].Capacity += parseFloat(item.Capacity_Percentage) || 0;
                        aggregateData[category].Channel += parseFloat(item.Channel_Percentage) || 0;
                    } else {
                        console.warn('Unexpected Category:', category); // Log unexpected categories
                    }
                });

                console.log('Aggregated Data:', aggregateData); // Log aggregated data

                // Normalize data to 0-1 range
                const normalizeCategory = (categoryData) => {
                    const total = categoryData.Powerhouse + categoryData.Pillers + categoryData.Plebs;
                    console.log(`Total for normalization: ${total}`); // Log total for normalization
                    return {
                        Powerhouse: (categoryData.Powerhouse / total) || 0,
                        Pillers: (categoryData.Pillers / total) || 0,
                        Plebs: (categoryData.Plebs / total) || 0
                    };
                };

                const normalizedNodeData = normalizeCategory({
                    Powerhouse: aggregateData.Powerhouse.Node,
                    Pillers: aggregateData.Pillers.Node,
                    Plebs: aggregateData.Plebs.Node
                });

                const normalizedCapacityData = normalizeCategory({
                    Powerhouse: aggregateData.Powerhouse.Capacity,
                    Pillers: aggregateData.Pillers.Capacity,
                    Plebs: aggregateData.Plebs.Capacity
                });

                const normalizedChannelData = normalizeCategory({
                    Powerhouse: aggregateData.Powerhouse.Channel,
                    Pillers: aggregateData.Pillers.Channel,
                    Plebs: aggregateData.Plebs.Channel
                });

                console.log('Normalized Data:', {
                    Node: normalizedNodeData,
                    Capacity: normalizedCapacityData,
                    Channel: normalizedChannelData
                });

                // Draw the chart with the normalized data
                drawStackedBarChart([
                    {
                        Node_Powerhouse_Percentage: normalizedNodeData.Powerhouse,
                        Capacity_Powerhouse_Percentage: normalizedCapacityData.Powerhouse,
                        Channel_Powerhouse_Percentage: normalizedChannelData.Powerhouse,
                        Node_Pillers_Percentage: normalizedNodeData.Pillers,
                        Capacity_Pillers_Percentage: normalizedCapacityData.Pillers,
                        Channel_Pillers_Percentage: normalizedChannelData.Pillers,
                        Node_Plebs_Percentage: normalizedNodeData.Plebs,
                        Capacity_Plebs_Percentage: normalizedCapacityData.Plebs,
                        Channel_Plebs_Percentage: normalizedChannelData.Plebs
                    }
                ]);
            }
        });

        function drawStackedBarChart(data) {
            const ctx = document.getElementById('nodeChart').getContext('2d');

            console.log('Chart Data:', data); // Log data passed to the chart

            const labels = ['Node Percentage', 'Capacity Percentage', 'Channel Percentage'];
            const datasets = [
                {
                    label: 'Powerhouse',
                    data: [
                        data[0].Node_Powerhouse_Percentage || 0,
                        data[0].Capacity_Powerhouse_Percentage || 0,
                        data[0].Channel_Powerhouse_Percentage || 0
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Red
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pillers',
                    data: [
                        data[0].Node_Pillers_Percentage || 0,
                        data[0].Capacity_Pillers_Percentage || 0,
                        data[0].Channel_Pillers_Percentage || 0
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Plebs',
                    data: [
                        data[0].Node_Plebs_Percentage || 0,
                        data[0].Capacity_Plebs_Percentage || 0,
                        data[0].Channel_Plebs_Percentage || 0
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)', // Green
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ];

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
                            max: 0.01, // Set x-axis maximum to 0.01 for fractional percentages
                            stacked: true,
                            ticks: {
                                callback: function(value) {
                                    return (value * 100).toFixed(2) + '%'; // Show percentage sign on the x-axis
                                }
                            },
                            title: {
                                display: true,
                                text: 'Fractional Percentage'
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
                                    const datasetLabel = tooltipItem.dataset.label;
                                    const value = tooltipItem.raw;
                                    return `${datasetLabel}: ${(value * 100).toFixed(2)}%`; // Format tooltip value
                                }
                            }
                        },
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }