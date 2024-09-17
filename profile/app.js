document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pubKey = urlParams.get('pub_key');

    if (!pubKey) {
        document.getElementById('nodeDetails').innerHTML = '<p>No pub_key provided.</p>';
        return;
    }

    fetch('https://raw.githubusercontent.com/sorukumar/plebdashboard/main/data/node_profile.csv')
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                complete: function(results) {
                    const node = results.data.find(row => row.pub_key === pubKey);
                    if (node) {
                        displayNodeDetails(node);
                    } else {
                        document.getElementById('nodeDetails').innerHTML = '<p>Node not found.</p>';
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('nodeDetails').innerHTML = '<p>Error loading data.</p>';
        });
});

function displayNodeDetails(node) {
    let html = '<table>';
    for (const [key, value] of Object.entries(node)) {
        html += `<tr><th>${key}</th><td>${value}</td></tr>`;
    }
    html += '</table>';
    document.getElementById('nodeDetails').innerHTML = html;
}
