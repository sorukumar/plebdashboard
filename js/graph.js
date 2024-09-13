 // Step 2: Fetch data from FeeES.csv
 fetch('data/FeeES.csv')
 .then(response => response.text())
 .then(csvText => {
     // Convert CSV text into an array of rows
     const rows = csvText.split('\n').map(row => row.split(','));

     // Step 3: Extract labels and data from CSV
     const labels = [];
     const feeRates = [];

     // Loop through the CSV rows starting from the second row (skip headers)
     for (let i = 1; i < rows.length; i++) {
         const row = rows[i];
         if (row.length > 1) {
             labels.push(row[0]); // Transaction Size
             feeRates.push(parseFloat(row[4])); // Effective Fee Rate BPS
         }
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
