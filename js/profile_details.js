document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the pub_key from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const pubKey = urlParams.get('pub_key');

    // Check if pub_key is provided in the URL
    if (!pubKey) {
        document.getElementById('nodeDetails').innerHTML = '<p>No pub_key provided.</p>';
        return;
    }

    // Fetch the CSV data using PapaParse
    fetch('https://raw.githubusercontent.com/sorukumar/plebdashboard/main/data/node_profile.csv')
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true, // CSV has a header row
                complete: function (results) {
                    // Find the node matching the provided pub_key
                    const node = results.data.find(row => row.pub_key === pubKey);
                    if (node) {
                        displayNodeDetails(node); // Display node details if found
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

// Function to display the node details in cards and a table
function displayNodeDetails(node) {
    // Cards section
    let html = `
    <div class="row mb-4">
        <!-- Alias Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Alias</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.alias || 'N/A'}</div>
                </div>
            </div>
        </div>

        <!-- Node Key Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Node Key</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.node_key || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mb-4">
        <!-- Powerhouse Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Powerhouse</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Powerhouse || 'N/A'}</div>
                </div>
            </div>
        </div>

        <!-- Node Capacity Tier Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Node Capacity Tier</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Cap_Tier || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mb-4">
        <!-- Capacity Percentile Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Capacity Percentile</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Capacity_Percentile || 'N/A'}</div>
                </div>
            </div>
        </div>

        <!-- Node Type Card -->
        <div class="col-md-6 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-dark text-uppercase mb-1">Node Type</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Type || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>`;

    // Table section
    html += `
    <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;

    // Loop through the node details and populate the table rows
    for (const [key, value] of Object.entries(node)) {
        html += `<tr><th>${key}</th><td>${value || 'N/A'}</td></tr>`;
    }

    html += `</tbody></table></div>`;

    document.getElementById('nodeDetails').innerHTML = html;
}
