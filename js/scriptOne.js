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
    document.getElementById('1').textContent = formatNumber(data.Unique_Nodes);
    document.getElementById('2').textContent = formatNumber(data.Total_Capacity);
    document.getElementById('3').textContent = formatNumber(data.Unique_Edges);
    document.getElementById('4').textContent = formatNumber(data.Effective_Fee_Rate_BPS);
}

// Helper function to format numbers with commas, even with text like 'bitcoin'
function formatNumber(value) {
    if (!value) return 'N/A';

    // Extract the numeric part from the string and format it
    const numberPart = parseFloat(value.replace(/,/g, '')); // Remove commas before parsing
    const textPart = value.replace(/[0-9,.]/g, '').trim(); // Extract non-numeric text like 'bitcoin'

    // Format the number part with commas
    const formattedNumber = !isNaN(numberPart) ? numberPart.toLocaleString() : value;

    // Return the formatted number with the text part if any
    return textPart ? `${formattedNumber} ${textPart}` : formattedNumber;
}

// Call the function to fetch and display the data when the page loads
document.addEventListener('DOMContentLoaded', fetchCSVData);
