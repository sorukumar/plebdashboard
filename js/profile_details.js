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


function generateQRCode(text) {
    // Clear previous QR code (if any)
    document.getElementById('qrcode').innerHTML = "";

    // Create new QR code
    new QRCode(document.getElementById("qrcode"), {
        text: text,
        width: 90,
        height: 90
    });
}

   // Function that copies the text passed to it
   function copyText(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert("Copied the text: " + text);
    }).catch(function(err) {
        console.error("Error copying text: ", err);
    });
}




// Function to display node details (Alias, Pub Key, Node Type, etc.)
function displayNodeDetails(node) {
    // Log the node object to check its structure
    console.log('Node Object:', node);

    // Store the pub_key in a temporary variable
    const pubKey = node.pub_key;

    let html = `
    <div class="row d-flex justify-content-around mb-4">
        <div class="col-md-4 mb-3">
                <div class=" align-items-center">
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.alias || 'N/A'}</div>
                    <div class="row align-items-center ">
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.pub_key ? node.pub_key.slice(0, 4) + '...' + node.pub_key.slice(-4): 'N/A'}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick="generateQRCode('${pubKey}')" class="ml-1 " width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12v3M12 3v3m6 6v3m-6 3h9m-3 3h3M6 12h3M6 6.011L6.01 6M12 12.011l.01-.011M3 12.011L3.01 12M12 9.011L12.01 9M12 15.011l.01-.011M15 21.011l.01-.011m-3.01.011l.01-.011M21 12.011l.01-.011M21 15.011l.01-.011M18 6.011L18.01 6M9 3.6v4.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6m12 0v4.8a.6.6 0 0 1-.6.6h-4.8a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6M6 18.011L6.01 18M9 15.6v4.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6v-4.8a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6"/></svg>
                   <svg xmlns="http://www.w3.org/2000/svg"  onClick="copyText('${pubKey}')" class="ml-1 " width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2"/><path fill="currentColor" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"/></svg>
                    </div>
                    <div class="mt-2 ml-2" id="qrcode"></div>
                </div>
            
        </div>

        <div class="col-md-8 mb-3">
            <div class="card shadow h-100 py-2">
                <div class="card-body row">
                 <div class="ml-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Node Type</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Type || 'N/A'}</div>
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 mt-3">Node Capacity Tier</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Node_Cap_Tier || 'N/A'}</div>
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 mt-3">Capacity Percentile</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">${node.Capacity_Percentile || 'N/A'}</div>
                 </div>
                    <div class="ml-4">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Rank</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Pleb Rank: ${node.Pleb_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Capacity Rank: ${node.Total_Capacity_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Channel Rank: ${node.Total_Channels_Rank || 'N/A'}</div>
                   </div>

                 <div class="ml-4">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Centrality Ranks</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Betweenness Centrality Rank: ${node.Betweenness_Centrality_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Eigenvector Centrality Rank: ${node.Eigenvector_Centrality_Rank || 'N/A'}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Capacity Weighted Degree Rank: ${node.Capacity_Weighted_Degree_Rank || 'N/A'}</div>
                 </div>

                
                
                </div>
            </div>
        </div>
    </div>
    
    <div class="row ">
        <div class="col-md-3 ">
            <div class="card shadow h-100 ">
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

   

   
    `;

    document.getElementById('nodeDetails').innerHTML = html;
}

// bhghvfrtyuiop
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
                        appendTables(node); // Call to append the tables
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

// Function to display the Channels table (My Way, Highway, Freeway)
function displayChannelTable(node) {
    let categoryCounts = {};
    try {
        categoryCounts = JSON.parse(node.Category_Counts);
    } catch (error) {
        console.error('Error parsing Category_Counts:', error);
    }

    return `
    <div class="table-responsive mt-2">
        <table class="table table-sm table-bordered">
            <thead class="bg-primary text-white">
                <tr>
                    <th>Channel Type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>My Way</td><td>${categoryCounts["My Way"] || '0'}</td></tr>
                <tr><td>Highway</td><td>${categoryCounts["Highway"] || '0'}</td></tr>
                <tr><td>Freeway</td><td>${categoryCounts["Freeway"] || '0'}</td></tr>
            </tbody>
        </table>
    </div>`;
}

// Function to display the Channel Size table
function displayChannelSizeTable(node) {
    return `
    <div class="table-responsive mt-2">
        <table class="table table-sm table-bordered">
            <thead class="bg-primary text-white">
                <tr>
                    <th>Channel Size Type</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Average Channel Size</td><td>${node.Avg_Channel_Size || 'N/A'}</td></tr>
                <tr><td>Max Channel Size</td><td>${node.Max_Channel_Size || 'N/A'}</td></tr>
                <tr><td>Median Channel Size</td><td>${node.Median_Channel_Size || 'N/A'}</td></tr>
                <tr><td>Min Channel Size</td><td>${node.Min_Channel_Size || 'N/A'}</td></tr>
                <tr><td>Mode Channel Size</td><td>${node.Mode_Channel_Size || 'N/A'}</td></tr>
            </tbody>
        </table>
    </div>`;
}

// Function to display the Base Fee table
function displayBaseFeeTable(node) {
    let html = `
    <div class="table-responsive mt-2">
        <table class="table table-sm table-bordered">
            <thead class="bg-primary text-white">
                <tr>
                    <th>Base Fee Type</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;

    for (const key in node) {
        if (key.endsWith('Base_Fee')) {
            html += `
                <tr>
                    <td>${key}</td>
                    <td>${node[key] || 'N/A'}</td>
                </tr>`;
        }
    }

    html += `
                </tbody>
            </table>
        </div>`;
    
    return html; // Return the HTML for the Base Fee table
}

// Append all tables in a single row
function appendTables(node) {
    const tablesRow = `
    <div class="row">
        <div class="col-md-4">
            ${displayChannelTable(node)}
        </div>
        <div class="col-md-4">
            ${displayChannelSizeTable(node)}
        </div>
        <div class="col-md-4">
            ${displayBaseFeeTable(node)}
        </div>
    </div>`;
    document.getElementById('nodeDetails').innerHTML += tablesRow; // Append tables to the nodeDetails container
}






// // Function to display the Channels table (My Way, Highway, Freeway)
// function displayChannelTable(node) {
//     let categoryCounts = {};
//     try {
//         categoryCounts = JSON.parse(node.Category_Counts);
//     } catch (error) {
//         console.error('Error parsing Category_Counts:', error);
//     }

//     let html = `
//     <div class="table-responsive mt-4">
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     <th>Channel Type</th>
//                     <th>Count</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>My Way</td>
//                     <td>${categoryCounts["My Way"] || '0'}</td>
//                 </tr>
//                 <tr>
//                     <td>Highway</td>
//                     <td>${categoryCounts["Highway"] || '0'}</td>
//                 </tr>
//                 <tr>
//                     <td>Freeway</td>
//                     <td>${categoryCounts["Freeway"] || '0'}</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>`;

//     document.getElementById('nodeDetails').innerHTML += html;
// }

// // Function to display the Channel Size table
// function displayChannelSizeTable(node) {
//     let html = `
//     <div class="table-responsive mt-4">
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     <th>Channel Size Type</th>
//                     <th>Value</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>Average Channel Size</td>
//                     <td>${node.Avg_Channel_Size || 'N/A'}</td>
//                 </tr>
//                 <tr>
//                     <td>Max Channel Size</td>
//                     <td>${node.Max_Channel_Size || 'N/A'}</td>
//                 </tr>
//                 <tr>
//                     <td>Median Channel Size</td>
//                     <td>${node.Median_Channel_Size || 'N/A'}</td>
//                 </tr>
//                 <tr>
//                     <td>Min Channel Size</td>
//                     <td>${node.Min_Channel_Size || 'N/A'}</td>
//                 </tr>
//                 <tr>
//                     <td>Mode Channel Size</td>
//                     <td>${node.Mode_Channel_Size || 'N/A'}</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>`;

//     document.getElementById('nodeDetails').innerHTML += html;
// }

// // Function to display the Base Fee table
// function displayBaseFeeTable(node) {
//     let html = `
//     <div class="table-responsive mt-4">
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     <th>Base Fee Type</th>
//                     <th>Value</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     for (const key in node) {
//         if (key.endsWith('Base_Fee')) {
//             html += `
//                 <tr>
//                     <td>${key}</td>
//                     <td>${node[key] || 'N/A'}</td>
//                 </tr>
//             `;
//         }
//     }

//     html += `
//             </tbody>
//         </table>
//     </div>`;

//     document.getElementById('nodeDetails').innerHTML += html;
// }

