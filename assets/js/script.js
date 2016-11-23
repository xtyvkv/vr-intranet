$(document).ready(function(){

//Retrieve In-Out Board and populate DOM

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
  });

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

//Update status
function udpateStatus (empID, newStatus) {
  $.ajax({
    url: "/api/update/" + empID + "/" + newStatus,
    type: "PUT"
  }).done(function(result) {
    console.log(result);
  });
}

