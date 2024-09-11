// Parsing the CSV and preparing the data
Papa.parse("data/ChannelES.csv", {
    download: true,
    header: true,
    complete: function(results) {
        console.log('Parsed Data:', results.data); // Log the parsed data to verify

        // Filter out any empty rows and parse necessary data
        const filteredData = results.data.filter(item => item.Channel_Percentage && item.Capacity_Percentage);

        // Aggregate data for each category
        const aggregateData = {
            Myway: { Channel: 0, Capacity: 0 },
            Highway: { Channel: 0, Capacity: 0 },
            Freeway: { Channel: 0, Capacity: 0 }
        };

        filteredData.forEach(item => {
            if (item.Channel_Size_Tier === 'My Way') {
                aggregateData.Myway.Channel += parseFloat(item.Channel_Percentage);
                aggregateData.Myway.Capacity += parseFloat(item.Capacity_Percentage);
            } else if (item.Channel_Size_Tier === 'Highway') {
                aggregateData.Highway.Channel += parseFloat(item.Channel_Percentage);
                aggregateData.Highway.Capacity += parseFloat(item.Capacity_Percentage);
            } else if (item.Channel_Size_Tier === 'Freeway') {
                aggregateData.Freeway.Channel += parseFloat(item.Channel_Percentage);
                aggregateData.Freeway.Capacity += parseFloat(item.Capacity_Percentage);
            }
        });

        // Normalize data
        const totalChannel = aggregateData.Myway.Channel + aggregateData.Highway.Channel + aggregateData.Freeway.Channel;
        const totalCapacity = aggregateData.Myway.Capacity + aggregateData.Highway.Capacity + aggregateData.Freeway.Capacity;

        const normalizedData = {
            Channel: {
                Myway: (aggregateData.Myway.Channel / totalChannel) * 100,
                Highway: (aggregateData.Highway.Channel / totalChannel) * 100,
                Freeway: (aggregateData.Freeway.Channel / totalChannel) * 100
            },
            Capacity: {
                Myway: (aggregateData.Myway.Capacity / totalCapacity) * 100,
                Highway: (aggregateData.Highway.Capacity / totalCapacity) * 100,
                Freeway: (aggregateData.Freeway.Capacity / totalCapacity) * 100
            }
        };

        drawChart(normalizedData);
    }
});

function drawChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Channel Percentage', 'Capacity Percentage'],
            datasets: [
                {
                    label: 'Myway',
                    data: [data.Channel.Myway, data.Capacity.Myway],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Red for Myway
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Highway',
                    data: [data.Channel.Highway, data.Capacity.Highway],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue for Highway
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Freeway',
                    data: [data.Channel.Freeway, data.Capacity.Freeway],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)', // Green for Freeway
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100, // Ensure the x-axis goes from 0 to 100 for percentage
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Show percentage sign on the x-axis
                        }
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
                            const datasetLabel = tooltipItem.dataset.label;
                            const value = tooltipItem.raw;
                            return `${datasetLabel}: ${value.toFixed(2)}%`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    display: false // This disables the legend

                }
            }
        }
    });
}