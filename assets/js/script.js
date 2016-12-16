$(document).ready(function(){

//Retrieve In-Out Board and populate DOM
  retrieveStatusAll(retrieveCalendar);


}); //End Retrieve In-Out Board

//In-Out Event Listener

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


function udpateStatus (empID, newStatus) {
  $.ajax({
    url: "/api/update/" + empID + "/" + newStatus,
    type: "PUT"
  }).done(function(result) {
    console.log(result);
  });
}

function retrieveStatusAll(cb) {
   $.ajax({
    url: "/api/inout"
  }).done(function(data){
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

    cb(kitchenDuty);
    
  })
  .fail(function (err) {
    console.log(err);
  });
}

function kitchenDuty() {
 $.ajax({
  url: "/api/kitchen"
 }).done(function(data) {
    $('#kd').text(data);
 });
}

function retrieveCalendar(cb) {
  $.ajax({
    url: "/api/calendar"
  }).done(function(data){
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

    cb();
  });


}

function printCalendar(date, data) {
  var cal = $('#calendar');

    var newCol = $('<div>');
    newCol.addClass('col-sm-4');

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

