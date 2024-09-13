// Function to fetch and parse the CSV file using PapaParse
function fetchCSVData() {
    Papa.parse('data/ES_Summary.csv', {
        download: true,
        header: true, // Treat first row as header
        skipEmptyLines: true, // Skip empty lines
        complete: function(results) {
            const parsedData = results.data;
            console.log('Parsed Data:', parsedData);  // Debug: Log parsed data
            if (parsedData.length > 0) {
                populateCards(parsedData[0]); // Assuming first row of data is to be displayed
            } else {
                console.error('No valid data found in CSV');
            }
        },
        error: function(error) {
            console.error('Error fetching the CSV file:', error);
        }
    });
}

// Function to display the data in the cards
function populateCards(data) {
    document.getElementById('1').textContent = data.Unique_Nodes || 'N/A';
    document.getElementById('2').textContent = data.Unique_Edges || 'N/A';
    document.getElementById('3').textContent = data.Median_Fee_Rate || 'N/A';
    document.getElementById('4').textContent = data.Median_Base_Fee || 'N/A';
}

// Call the function to fetch and display the data when the page loads
document.addEventListener('DOMContentLoaded', fetchCSVData);
