var baseURL = "http://sandbox:8180/api/";
fetch(baseURL + "inout")
  .then(res => res.json())
  .then(data => {
    newStatus(data);
    return fetch(baseURL + "calendar");
  })
  .then(d => d.json())
  .then(d => {
      processCalendar(d);
  })
  .catch(err => console.log(err));

function newStatus(data) {
  // $('#inoutboard').empty();
  var iob = document.getElementById("inoutboard");
  iob.innerHTML = "";

  data.users.forEach(el => {
    var newRow = document.createElement("tr");
    newRow.classList.add("iob-row");
    newRow.setAttribute("data-empID", el.EmpID);

    var name = document.createElement("th");
    name.innerText = el.FirstName;

    var status = document.createElement("td");
    status.innerText = "In";

    var e = document.createElement("td");
    e.innerText = el.Extension;

    newRow.appendChild(name);
    newRow.appendChild(status);
    newRow.appendChild(e);
    iob.appendChild(newRow);
  });
  // data.users.forEach(function (el) {
  //     var newRow = $('<tr>');
  //     newRow.addClass('iob-row')
  //     newRow.data('empID', el.EmpID);

  //     var name = $('<th>');
  //     name.text(el.FirstName);

  //     var status = $('<td>');
  //     var stsButton = $('<button>');
  //     stsButton.addClass('statusButton');

  //     if (el.InOffice === true) {
  //         stsButton.addClass('statusIn');
  //         newRow.data('officeStatus', 'in');
  //     } else if (el.Home === true) {
  //         stsButton.addClass('statusRemote');
  //         newRow.data('officeStatus', 'remote');
  //     } else {
  //         newRow.data('officeStatus', 'out');
  //     }

  //     status.append(stsButton);

  //     var extension = $('<td>');
  //     extension.text(el.Extension);

  //     newRow.append(name)
  //         .append(status)
  //         .append(extension);

  //     $('#inoutboard').append(newRow);
  // });
}

function processCalendar(data) {
  $("#calendar").empty();
  var tempObj = {};
  var pos = 0;

  data.forEach(function(el) {
    // var date = el.ItemDate.substring(el.ItemDate.indexOf('-')+1, el.ItemDate.indexOf('T')).replace("-", "/");
    var date = moment(el.ItemDate)
      .add(1, "days")
      .format("dddd MM/DD"); //Moment js calculates time one day behind
    // console.log(date);

    if (date in tempObj) {
      tempObj[date].items.push(el);
    } else {
      tempObj[date] = {};
      tempObj[date].column = pos;
      pos++;
      tempObj[date].items = [];
      tempObj[date].items.push(el);
    }
  });

  var dates = Object.keys(tempObj);

  dates.forEach(function(el) {
    printCalendar(el, tempObj[el].items);
  });
}

function printCalendar(date, data) {
  var cal = $("#calendar");

  var newCol = $("<div>");
  newCol.addClass("calDay");

  var newUL = $("<ul>");
  newUL.addClass("list-group");
  newUL.append('<li class="list-group-item eventDay">' + date + "</li>");

  data
    .sort((a, b) => a.ItemText.charCodeAt(0) - b.ItemText.charCodeAt(0))
    .forEach(function(el) {
      var newLI = $("<li>");
      newLI.addClass("list-group-item");
      newLI.text(el.ItemText);

      var ex = $("<span>");
      ex.attr("data-event-id", el.ItemID);
      ex.attr("aria-hidden", "true");
      ex.addClass("glyphicon glyphicon-remove removeEvent del-cal-item");
      newLI.append(ex);

      newUL.append(newLI);
    });

  newCol.append(newUL);
  cal.append(newCol);
}
