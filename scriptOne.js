// Function to fetch and parse the CSV file
function fetchCSVData() {
    fetch('data/ES_Summary.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSVData(data);
            console.log(parsedData);  // Debug: Log parsed data to inspect structure
            populateCards(parsedData[0]); // Assuming first row of data is to be displayed
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

// Function to parse CSV data
function parseCSVData(data) {
    const rows = data.split('\n').map(row => row.split(','));

    return rows.slice(1)  // Skip header row
        .filter(row => row.length >= 4) // Ensure we have at least 4 columns
        .map(row => ({
            uniqueNodes: row[0]?.trim(),
            uniqueEdges: row[1]?.trim(),
            medianFeeRate: row[2]?.trim(),
            medianBaseFee: row[3]?.trim()
        }));
}

// Function to display the data in the cards
function populateCards(data) {
    document.getElementById('1').textContent = data.uniqueNodes || 'N/A';
    document.getElementById('2').textContent = data.uniqueEdges || 'N/A';
    document.getElementById('3').textContent = data.medianFeeRate || 'N/A';
    document.getElementById('4').textContent = data.medianBaseFee || 'N/A';
}

// Call the function to fetch and display the data when the page loads
document.addEventListener('DOMContentLoaded', fetchCSVData);
