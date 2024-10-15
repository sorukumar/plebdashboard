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
                        displayChannelSizeTable(node);  // Add the Channel Size table
                        displayBaseFeeTable(node);  // Add the Base Fee table
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
    // Log the node object to check its structure
    console.log('Node Object:', node);

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
    </div>
    
    <div class="row mb-4">
        <div class="col-md-12 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">First Seen</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">`;

    // Parse block_tx_output if it exists
    let blockTxOutput;
    if (node.block_tx_output) {
        try {
            blockTxOutput = JSON.parse(node.block_tx_output);
            const block = blockTxOutput.block || 'N/A';
            const tx = blockTxOutput.tx || 'N/A';
            html += `Block: ${block}, Tx: ${tx}`;
        } catch (error) {
            console.error('Error parsing block_tx_output:', error);
            html += 'Block: N/A, Tx: N/A';
        }
    } else {
        html += 'Block: N/A, Tx: N/A';
    }

    html += `</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-md-12 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Rank</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Pleb Rank: ${node.Pleb_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Capacity Rank: ${node.Total_Capacity_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Channel Rank: ${node.Total_Channels_Rank || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Centrality Ranks Card -->
    <div class="row mb-4">
        <div class="col-md-12 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Centrality Ranks</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Betweenness Centrality Rank: ${node.Betweenness_Centrality_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Eigenvector Centrality Rank: ${node.Eigenvector_Centrality_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Capacity Weighted Degree Rank: ${node.Capacity_Weighted_Degree_Rank || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('nodeDetails').innerHTML = html;
}



// Function to display the Channels table (My Way, Highway, Freeway)
function displayChannelTable(node) {
    let categoryCounts = {};
    try {
        categoryCounts = JSON.parse(node.Category_Counts);
    } catch (error) {
        console.error('Error parsing Category_Counts:', error);
    }

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

    document.getElementById('nodeDetails').innerHTML += html;
}

// Function to display the Channel Size table
function displayChannelSizeTable(node) {
    let html = `
    <div class="table-responsive mt-4">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Channel Size Type</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Average Channel Size</td>
                    <td>${node.Avg_Channel_Size || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Max Channel Size</td>
                    <td>${node.Max_Channel_Size || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Median Channel Size</td>
                    <td>${node.Median_Channel_Size || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Min Channel Size</td>
                    <td>${node.Min_Channel_Size || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Mode Channel Size</td>
                    <td>${node.Mode_Channel_Size || 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    </div>`;

    document.getElementById('nodeDetails').innerHTML += html;
}

// Function to display the Base Fee table
function displayBaseFeeTable(node) {
    let html = `
    <div class="table-responsive mt-4">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Base Fee Type</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const key in node) {
        if (key.endsWith('Base_Fee')) {
            html += `
                <tr>
                    <td>${key}</td>
                    <td>${node[key] || 'N/A'}</td>
                </tr>
            `;
        }
    }

    html += `
            </tbody>
        </table>
    </div>`;

    document.getElementById('nodeDetails').innerHTML += html;
}

