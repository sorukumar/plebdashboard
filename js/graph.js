
        // Step 2: Fetch data from FeeES.csv
        fetch('data/FeeES.csv')
        .then(response => response.text())
        .then(csvText => {
            // Convert CSV text into an array of rows
            const rows = csvText.split('\n').map(row => row.split(','));

            // Step 3: Extract labels and data from CSV
            const labels = [];
            const feeRates = [];
            const detailedData = [];

            // Loop through the CSV rows starting from the second row (skip headers)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (row.length > 1) {
                    labels.push(row[0]); // Transaction Size
                    feeRates.push(parseFloat(row[4])); // Effective Fee Rate BPS
                    detailedData.push({
                        Transaction_Size: row[0],
                        Capable_Channels: row[1],
                        Median_Fee_Rate: row[2],
                        Median_Base_Fee: row[3],
                        Effective_Fee_Rate_BPS: row[4]
                    });
                }
<<<<<<< HEAD:graph.js
            }

            // Step 4: Create the line chart using Chart.js
            const ctx = document.getElementById('feeRateChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Effective Fee Rate (BPS)',
                        data: feeRates,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    // Use the label from the first item for the tooltip title
                                    return tooltipItems[0].label;
                                },
                                label: function(tooltipItem) {
                                    // Get the data point index
                                    const index = tooltipItem.dataIndex;
                                    const data = detailedData[index];
                                    
                                    // Return the custom label
                                    return [
                                        `Transaction Size: ${data.Transaction_Size}`,
                                        `Capable Channels: ${data.Capable_Channels}`,
                                        `Median Fee Rate: ${data.Median_Fee_Rate}`,
                                        `Median Base Fee: ${data.Median_Base_Fee}`,
                                        `Effective Fee Rate (BPS): ${data.Effective_Fee_Rate_BPS}`
                                    ];
                                }
                            }
                        },
                        legend: {
                            display: false // This disables the legend
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Transaction Size'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Effective Fee Rate (BPS)'
                            },
                            beginAtZero: false
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading the CSV file:', error));
=======
              },
             scales: {
                 x: {
                     title: {
                         display: true,
                         text: 'Transaction Size'
                     }
                 },
                 y: {
                     title: {
                         display: true,
                         text: 'Effective Fee Rate (BPS)'
                     },
                     beginAtZero: false
                 }
             }
         }
     });
 })
 .catch(error => console.error('Error loading the CSV file:', error));
>>>>>>> origin/main:js/graph.js
