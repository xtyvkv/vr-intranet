function post(url, data) {
  return new Promise(function(resolve, reject){
    var req = new XMLHttpRequest();
    req.open("POST", url, true);

    req.setRequestHeader("Content-type", "application/json");

    req.addEventListener("load", function(re){
      resolve(req.response);
    });

    req.addEventListener("error", function(err){
      reject(Error("Network error"));
    });

    req.send(data);
  
  });
}

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        //Attempt to convert response to a JSON object
        try {
          var d = JSON.parse(req.response);
          resolve(d);
        }
        catch (err){
          resolve(req.response);
        }
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error("Network error"));
    };
    req.send();

  });
}

function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected')
         .prop('checked', false);
}