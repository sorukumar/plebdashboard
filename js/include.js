function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  var remainingIncludes = 0;

  function checkAllIncludesLoaded() {
    remainingIncludes--;
    if (remainingIncludes === 0 && callback) {
      callback();
    }
  }

  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      remainingIncludes++;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(elmnt, file) {
        return function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              elmnt.innerHTML = this.responseText;
              elmnt.removeAttribute("include-html");
              includeHTML(checkAllIncludesLoaded);
            }
            if (this.status == 404) {
              elmnt.innerHTML = "Page not found.";
              checkAllIncludesLoaded();
            }
          }
        };
      }(elmnt, file);
      xhttp.open("GET", file, true);
      xhttp.send();
    }
  }

  if (remainingIncludes === 0 && callback) {
    callback();
  }
}
