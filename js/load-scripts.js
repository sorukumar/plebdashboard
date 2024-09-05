document.addEventListener("DOMContentLoaded", function() {
    // Array of script URLs to be loaded
    var scripts = [
        <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>
        "vendor/jquery/jquery.min.js",
        "vendor/bootstrap/js/bootstrap.bundle.min.js",
        "vendor/jquery-easing/jquery.easing.min.js",
        "js/sb-admin-2.min.js",
        "vendor/datatables/jquery.dataTables.min.js",
        "vendor/datatables/dataTables.bootstrap4.min.js",
        "js/demo/datatables-demo.js"
    ];

    // Function to load each script
    function loadScript(src, callback) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.error("Failed to load script: " + src);
        };
        document.body.appendChild(script);
    }

    // Load scripts in sequence
    function loadScriptsSequentially(scripts, index) {
        if (index < scripts.length) {
            loadScript(scripts[index], function() {
                loadScriptsSequentially(scripts, index + 1);
            });
        }
    }

    // Start loading scripts
    loadScriptsSequentially(scripts, 0);
});
