document.addEventListener('DOMContentLoaded', function () {
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
                complete: function (results) {
                    const node = results.data.find(row => row.pub_key === pubKey);
                    if (node) {
                        displayNodeDetails(node); 
                        displayChannelTable(node);  // Add the channel table
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

// Function to display node details (Alias, Pub Key, Node Type, etc.)
function displayNodeDetails(node) {
    let html = `
    <div class="row mb-4">
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Alias</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.alias || 'N/A'}</div>
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 mt-3">Pub Key</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.pub_key ? node.pub_key.slice(0, 4) + '...' : 'N/A'}</div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Node Type</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Type || 'N/A'}</div>
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 mt-3">Node Capacity Tier</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Cap_Tier || 'N/A'}</div>
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 mt-3">Capacity Percentile</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Capacity_Percentile || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>`;

    // Add First Seen card
    let firstSeen = '';
    try {
        const blockTxOutput = JSON.parse(node.block_tx_output);
        firstSeen = blockTxOutput.block ? blockTxOutput.block : 'N/A';
    } catch (error) {
        console.error('Error parsing block_tx_output:', error);
    }

    html += `
    <div class="row mb-4">
        <div class="col-md-12 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">First Seen (Block)</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${firstSeen}</div>
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById('nodeDetails').innerHTML = html;
}

// Function to display the Channels table (My Way, Highway, Freeway)
function displayChannelTable(node) {
    // Parse the Category_Counts field as it is stored as a JSON string
    let categoryCounts = {};
    try {
        categoryCounts = JSON.parse(node.Category_Counts);
    } catch (error) {
        console.error('Error parsing Category_Counts:', error);
    }

    // Create the table HTML
    let html = `
    <div class="table-responsive mt-4">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Channel Type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>My Way</td>
                    <td>${categoryCounts["My Way"] || '0'}</td>
                </tr>
                <tr>
                    <td>Highway</td>
                    <td>${categoryCounts["Highway"] || '0'}</td>
                </tr>
                <tr>
                    <td>Freeway</td>
                    <td>${categoryCounts["Freeway"] || '0'}</td>
                </tr>
            </tbody>
        </table>
    </div>`;

    // Append the table to the nodeDetails div
    document.getElementById('nodeDetails').innerHTML += html;
}
