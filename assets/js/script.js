$(document).ready(function(){

//Load data
get("/api/kitchen")
  .then(function(kd){
    $('#kd').text(kd);
    return get("/api/inout");
  })
  .then(function(status){
    processStatusAll(status);
    return get("/api/calendar");
  })
  .then(function(cals){
    processCalendar(cals);
    return get("/api/ann");
  })
  .then(function(anns) {
    printAnn(anns);
  })
  .catch(function(err){
    console.log(err)
  });

}); 



//In-Out event listener
$('#inoutboard').on('click', 'label', function() {
  var emp = $(this);
  var empID = emp.parents('tr').data('empID');
  var status = emp.parents('tr').data('status');
  var label = emp.attr('class');
  var clicked = label.substring(0, label.indexOf("-"));
  console.log(clicked);
  udpateStatus(empID, clicked);

  switch (clicked){
    case "in":
      emp.siblings('.inBox').attr('checked', true);
      emp.siblings('.outBox').attr('checked', false);
      emp.siblings('.remoteBox').attr('checked', false);
      break;

    case "out":
      emp.siblings('.outBox').attr('checked', true);
      emp.siblings('.inBox').attr('checked', false);
      emp.siblings('.remoteBox').attr('checked', false);
      break;

    case "home":
      emp.siblings('.remoteBox').attr('checked', true);
      emp.siblings('.inBox').attr('checked', false);
      emp.siblings('.outBox').attr('checked', false);
      break;

  }

});

//End In-Out Event Listener
$('#btnSubmitFormAnn').on('click', function() {
  var newAnn = $('#txtAnn').val().trim();
  post("/api/ann", "msg=" + newAnn)
  .then(function(res){
    console.log(res);
    return get("/api/ann");
  })
  .then(function(anns){
    printAnn(anns);
  })
  .catch(function(err) {
    console.log(err);
  });

  resetForm($('#formAnn'));
  $('#modalFormAnn').modal("hide");
  return false;
});

$('#modalFormAnn').on('shown.bs.modal', function () {
  $('#txtAnn').focus();
});

$('#ulAnn').on('click', '.ann-del', function(){
  var id = $(this).data('ann-id');
  put("/api/ann/" + id)
    .then(function(result){
      console.log(result);
      $('#row-ann-' + id).remove();

    }).catch(function(err){
      console.log(err);
    });
});

function udpateStatus (empID, newStatus) {
  $.ajax({
    url: "/api/update/" + empID + "/" + newStatus,
    type: "PUT"
  }).done(function(result) {
    console.log(result);
  });
}

function processStatusAll(data){
    // console.log(data);
  data.users.forEach(function(el) {
    var newRow = $('<tr>');
    newRow.data('empID', el.EmpID);

    var name = $('<th>');
    name.text(el.FirstName);
    newRow.append(name);

    var status = $('<td>');

    var stsIn = $('<label>');
    stsIn.text("In");
    stsIn.addClass('in-label');
    var inBox = $('<input>');
    inBox.attr('type', 'checkbox');
    if(el.InOffice){
      inBox.attr('checked', true);
      newRow.data('status', 'in');
    } else {
      inBox.attr('checked', false);
    }
    inBox.addClass("switcher inBox");
    status.append(inBox);
    status.append(stsIn);

    var stsOut = $('<label>');
    stsOut.text("Out");
    stsOut.addClass("out-label");
    var OutBox = $('<input>');
    OutBox.attr('type', 'checkbox');

    if(el.OutOffice) {
      OutBox.attr('checked', true);
      newRow.data('status', 'out')
    } else {
      OutBox.attr('checked', false);
    }

    OutBox.addClass("switcher outBox");
    status.append(OutBox);
    status.append(stsOut);

    var stsRemote = $('<label>');
    stsRemote.text("Remote");
    stsRemote.addClass("home-label");
    var RemoteBox = $('<input>');
    RemoteBox.attr('type', 'checkbox');
    if(el.Home){
      RemoteBox.attr('checked', true);
      newRow.data('status', 'remote');
    } else{
      RemoteBox.attr('checked', false);
    }
    RemoteBox.addClass("switcher remoteBox");
    status.append(RemoteBox);
    status.append(stsRemote);

    newRow.append(status);

    var extension = $('<td>');
    extension.text(el.Extension);
    newRow.append(extension);

    $('#inoutboard').append(newRow);

  });
    
  }

function processCalendar(data){
    var tempObj = {};
    var pos = 0;

    data.forEach(function(el){
      var date = moment(el.ItemDate).format("MM/DD");

      if(date in tempObj) {
        tempObj[date].items.push(el.ItemText);
      } else {
        tempObj[date] = {};
        tempObj[date].column = pos;
        pos++;
        tempObj[date].items = [];
        tempObj[date].items.push(el.ItemText);
      }

    });

    var dates = Object.keys(tempObj);

    dates.forEach(function(el) {
      printCalendar(el, tempObj[el].items)
    });
}

function printCalendar(date, data) {
  var cal = $('#calendar');

    var newCol = $('<div>');
    newCol.addClass('day');

    var newUL = $('<ul>');
    newUL.addClass('list-group')
    newUL.append('<li class="list-group-item eventDay">' + date + '</li>');

    data.forEach(function(el) {
      var newLI = $('<li>');
      newLI.addClass('list-group-item')
      newLI.text(el);
      newUL.append(newLI);
    });

    newCol.append(newUL);
    cal.append(newCol);
}


function printAnn(data) {
    var contAnn = $('#ulAnn');
    contAnn.empty();
    if (data.length > 0) {

      data.forEach(function(el) {
        var newRow = $('<li>');
        newRow.addClass('list-group-item');
        newRow.attr('id', 'row-ann-' + el.id)
        newRow.text(el.text);

        var newBtn = $('<button>');
        newBtn.text('X');
        newBtn.data('ann-id', el.id);
        newBtn.addClass('ann-del');
        newRow.append(newBtn);

        contAnn.append(newRow);
      });

    } 

    else {
      contAnn.append("<li><h3>No announcements</h3></li>");
    }
}

function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected')
         .prop('checked', false);
}


function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        // resolve(req.response);
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

    //Handle network errors
    req.onerror = function() {
      reject(Error("Network error"));
    };

    //Make the request
    req.send();

  });
}


function post(url, data) {
  return new Promise(function(resolve, reject){
    var req = new XMLHttpRequest();
    req.open("POST", url, true);

    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.addEventListener("load", function(re){
      resolve(req.response);
    });

    req.addEventListener("error", function(err){
      reject(Error("Network error"));
    });

    req.send(data);
  
  });
}

function put(url, data) {
  return new Promise(function(resolve, reject){
    var req = new XMLHttpRequest();
    req.open("PUT", url, true);

    req.addEventListener("load", function(re){
      resolve(req.response);
    });

    req.addEventListener("error", function(err){
      reject(Error("Network error: \n", err));
    });

    req.send(data);

  });
}
