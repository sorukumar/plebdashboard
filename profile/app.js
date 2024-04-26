document.addEventListener('DOMContentLoaded', function() {
    // Function to parse URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the alias from the URL
    const alias = getQueryParam('alias');

    // Set the alias in the search input
    const searchBox = document.getElementById('searchBox');
    if (alias) {
        searchBox.value = decodeURIComponent(alias);
    }

  const suggestions = document.getElementById('suggestions');
  const dataView = document.getElementById('dataView');
  let csvData = [];

  // Fetching and parsing CSV data
  fetch('https://raw.githubusercontent.com/sorukumar/plebdashboard/site/data/node_profile.csv')
    .then(response => response.text())
    .then(data => {
      csvData = data.split('\n').map(row => {
        const columns = row.split(',');
        return {
          pub_key: columns[0],  
          alias: columns[1], 
          address_1: columns[2],
          address_2: columns[3],
          Source: columns[4],
          last_update_dt: columns[5],
          capacity: columns[6],
          avg_chnl_size: columns[7],
          med_chnl_size: columns[8],
          min_chnl_size: columns[9],
          max_chnl_size: columns[10],
          Active_channel_cnt: columns[11],
          Clearnet_Tor_Status: columns[12],
          active_chnl_y_n: columns[13],
          Capacity_Y_N: columns[14],
          formatted_capacity: columns[15],
          avg_base_fee: columns[16],
          med_base_fee: columns[17],
          max_base_fee: columns[18],
          min_base_fee: columns[19],
          avg_fee_rate: columns[20],
          med_fee_rate: columns[21],
          max_fee_rate: columns[22],
          min_fee_rate: columns[23],
          bin5_bfee: columns[24],
          bin5_rfee: columns[25],
          bin5_chnl:  columns[26],
          bin10_chnl: columns[27],
          bin20_chnl: columns[28],
          bin5_cpcty: columns[29],
          bin10_cpcty: columns[30],
          bin20_cpcty: columns[31],
          bin100_cpcty: columns[32],
          bin200_cpcty: columns[33],
          // Add more fields as necessary
          Degree_Centrality: columns[34],
          Betweenness_Centrality: columns[35],
          Closeness_Centrality: columns[36],
          Eigenvector_Centrality: columns[37],
          Degree_Centrality_Rank: columns[38],
          Betweenness_Centrality_Rank: columns[39],
          Closeness_Centrality_Rank: columns[40],
          Eigenvector_Centrality_Rank: columns[41],
          Active_channel_cnt_Rank: columns[42],
          Capacity_Rank: columns[43]
        };
      });
    });

  searchBox.addEventListener('input', () => {
    const value = searchBox.value.toLowerCase();
    const filteredData = csvData.filter(row => {
        if (row.alias && row.pub_key) {
            return row.alias.toLowerCase().includes(value) || row.pub_key.toLowerCase().includes(value);
        } else if (row.alias) {
            return row.alias.toLowerCase().includes(value);
        } else if (row.pub_key) {
            return row.pub_key.toLowerCase().includes(value);
        } else {
            return false;
        }
    });
    suggestions.innerHTML = '';

    filteredData.forEach(row => {
        const div = document.createElement('div');
        if (row.alias) {
            div.textContent = row.alias;
        } else {
            div.textContent = row.pub_key;
        }
        div.onclick = () => selectAlias(row);
        suggestions.appendChild(div);
    });
});




  function selectAlias(row) {
    searchBox.value = row.alias;
    suggestions.innerHTML = '';
    dataView.innerHTML = `<div>Pub Key: ${row.pub_key}</div>
                          <div>Alias: ${row.alias}</div>
                          <div>Address 1: ${row.address_1}</div>
                          <div>Address 2: ${row.address_2}</div>
                          <div>Source: ${row.source}</div>
                          <div>Last Update: ${row.last_update_dt}</div>
                          <div>Capacity: ${row.capacity}</div>
                          <div>Average Channel Size: ${row.avg_chnl_size}</div>
                          <div>Median Channel Size: ${row.med_chnl_size}</div>
                          <div>Minimum Channel Size: ${row.min_chnl_size}</div>
                          <div>Maximum Channel Size: ${row.max_chnl_size}</div>
                          <div>Active Channel Count: ${row.active_channel_cnt}</div>
                          <div>Clearnet/Tor Status: ${row.clearnet_tor_status}</div>
                          <div>Active Channel: ${row.active_chnl_y_n}</div>
                          <div>Capacity: ${row.Capacity_Y_N}</div>
                          <div>Formatted Capacity: ${row.formatted_capacity}</div>
                          <div>Average Base Fee: ${row.avg_base_fee}</div>
                          <div>Median Base Fee: ${row.med_base_fee}</div>
                          <div>Minimum Base Fee: ${row.min_base_fee}</div>
                          <div>Maximum Base Fee: ${row.max_base_fee}</div>
                          <div>Average Fee Rate: ${row.avg_fee_rate}</div>
                          <div>Median Fee Rate: ${row.med_fee_rate}</div>
                          <div>Minimum Fee Rate: ${row.min_fee_rate}</div>
                          <div>Maximum Fee Rate: ${row.max_fee_rate}</div>
                          <div>Bin 5 Base Fee: ${row.bin5_bfee}</div>
                          <div>Bin 5 Route Fee: ${row.bin5_rfee}</div>
                          <div>Bin 5 Channel: ${row.bin5_chnl}</div>
                          <div>Bin 10 Channel: ${row.bin10_chnl}</div>
                          <div>Bin 20 Channel: ${row.bin20_chnl}</div>
                          <div>Bin 5 Capacity: ${row.bin5_cpcty}</div>
                          <div>Bin 10 Capacity: ${row.bin10_cpcty}</div>
                          <div>Bin 20 Capacity: ${row.bin20_cpcty}</div>
                          <div>Bin 100 Capacity: ${row.bin100_cpcty}</div>
                          <div>Bin 200 Capacity: ${row.bin200_cpcty}</div>
                          <div>Degree Centrality: ${row.Degree_Centrality}</div>
                          <div>Betweenness Centrality: ${row.Betweenness_Centrality}</div>
                          <div>Closeness Centrality: ${row.Closeness_Centrality}</div>
                          <div>Eigenvector Centrality: ${row.Eigenvector_Centrality}</div>
                          <div>Degree Centrality Rank: ${row.Degree_Centrality_Rank}</div>
                          <div>Betweenness Centrality Rank: ${row.Betweenness_Centrality_Rank}</div>
                          <div>Closeness Centrality Rank: ${row.Closeness_Centrality_Rank}</div>
                          <div>Eigenvector Centrality Rank: ${row.Eigenvector_Centrality_Rank}</div>
                          <div>Active Channel Count Rank: ${row.Active_channel_cnt_Rank}</div>
                          <div>Capacity Rank: ${row.Capacity_Rank}</div>`;
}
});
