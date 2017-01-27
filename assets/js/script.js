var baseURL = "/api/";

$(document).ready(function(){
  init();
  setInterval(function(){ init() }, 1000 * 60);
}); 

function init() {
  //Load data
get(baseURL + "kitchen")
  .then(function(kd){
    $('#kd').text(kd);
    return get(baseURL + "inout");
  })
  .then(function(status){
    newStatus(status);
    return get(baseURL + "calendar");
  })
  .then(function(cals){
    processCalendar(cals);
    return get(baseURL + "ann");
  })
  .then(function(anns) {
    printAnn(anns);
    return get(baseURL + "projects")
  })
  .then(function(projs){
    printProjects(JSON.parse(projs));
    return get(baseURL + "workloads")
  })
  .then(function(workloads){
    printWorkloads(workloads);
  })
  .catch(function(err){
    console.log(err)
  });
}

$('#inoutboard').on('click', 'span', function(){
    var empID = $(this).parents('tr').data('empID');
    var label = $(this).attr('class');
    var clicked = label.substring(0, label.indexOf("-"));
    updateStatus(empID, clicked);

    switch (clicked) {
      case "in":
        $(this).addClass('in-label-checked');
        $(this).siblings('.out-label').removeClass('out-label-checked');
        $(this).siblings('.remote-label').removeClass('remote-label-checked');
        break;
      case "out":
        $(this).addClass('out-label-checked');
        $(this).siblings('.in-label').removeClass('in-label-checked');
        $(this).siblings('.remote-label').removeClass('remote-label-checked');
        break;
      case "remote":
        $(this).addClass('remote-label-checked');
        $(this).siblings('.out-label').removeClass('out-label-checked');
        $(this).siblings('.in-label').removeClass('in-label-checked');
        break;
    }
  });

//Toggle Annoucement Modal
$('#btnShowFormAnn').on('click', function(){
  $('#modalFormAnn').modal('show');

  $('#modalFormAnn').on('shown.bs.modal', function(){
    $('#txtAnn').focus();
  });
  
});

$('#btnSubmitFormAnn').on('click', function(){
  if($('#txtAnn').val().length == 0) {
    $('#txtAnn').siblings('small').css('color', 'red');
    $('#txtAnn').focus();
  } else {
    addAnnouncement();  
  }
  
  return false;
});

//Toggle Calendar Modal
$('#btnShowFormCal').on('click', function(){
  $('#modalFormCal').modal('show');
  $('#fgEndDate').hide();

  $('#modalFormCal').on('shown.bs.modal', function(){
    $('#txtCalendar').focus();
  });


});

$('#btnSubmitFormCal').on('click', function(){
  var newCalEvent = {};
  newCalEvent.text = $('#txtCalendar').val().trim();
  newCalEvent.eventDate = moment($('#eventDate').val()).format();
  newCalEvent.eventDate = $('#eventDate').val();

  if($('#qMultipleDays').prop('checked')) {
    newCalEvent.multipleDays = true;
    newCalEvent.eventEndDate = moment($('#eventEndDate').val()).format();
    // newCalEvent.evenEndDate = $('#eventEndDate').val();
  } else {
    newCalEvent.multipleDays = false;
  }

  if(newCalEvent.text.length == 0) {
    $('#txtCalendar').focus()
                     .siblings('small').css('color', 'red');
  } else if(newCalEvent.eventDate.length == 0){
    $('#eventDate').focus()
                   .parent().siblings('small').css('color', 'red');

  } else {
    console.log(newCalEvent);
    post('/api/calendar', "json_string=" + JSON.stringify(newCalEvent))
      .then(function(result){
        console.log(result);
        resetForm($('#formCal'));
        $('#modalFormCal').modal('hide');
        return get(baseURL + "calendar");
      })
      .then(function(cals){
        processCalendar(cals);
      }).catch(function(err){
        console.log(err);
      });
  } 
});

// Event Listener for Calendar Multiple Days
$('#mdls').on('click', '#qMultipleDays', function(){
  $('#fgEndDate').toggle();
  // $('#formCal').append(fgEndDate);
});

//Delete Calendar Item

$('#calendar').on('click', '.del-cal-item', function(){
  var id = $(this).data('event-id');
  var self = $(this);
  put(baseURL + "calendar/" + id)
    .then(function(result){
      console.log(result);
      self.parent().remove();
    })
    .catch(function(err){
      console.log(err)
    });
});


//Delete Announcement
$('#ulAnn').on('click', '.ann-del', function(){
  var id = $(this).data('ann-id');
  put(baseURL + "ann/" + id)
    .then(function(result){
      console.log(result);
      $('#row-ann-' + id).remove();

    }).catch(function(err){
      console.log(err);
    });
});

//On enter key click submit (for modals)
$(function(){
  $('.modal-content').keypress(function(e){
    if(e.which == 13) {
      var b = $(this).find('button[type=submit]');
      b.click();
      return false;
    }
  });
});

function updateStatus (empID, newStatus) {
  $.ajax({
    url: baseURL + "update/" + empID + "/" + newStatus,
    type: "PUT"
  }).done(function(result) {
    console.log(result);
  });
}


function processCalendar(data){
    $('#calendar').empty();
    var tempObj = {};
    var pos = 0;

    data.forEach(function(el){
      // var date = el.ItemDate.substring(el.ItemDate.indexOf('-')+1, el.ItemDate.indexOf('T')).replace("-", "/");
      var date = moment(el.ItemDate).add(1, 'days').format("dddd MM/DD"); //Moment js calculates time one day behind
      // console.log(date);

      if(date in tempObj) {
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
      printCalendar(el, tempObj[el].items)
    });
}

function printCalendar(date, data) {
  var cal = $('#calendar');

    var newCol = $('<div>');
    newCol.addClass('calDay');

    var newUL = $('<ul>');
    newUL.addClass('list-group')
    newUL.append('<li class="list-group-item eventDay">' + date + '</li>');

    data.forEach(function(el) {
      var newLI = $('<li>');
      newLI.addClass('list-group-item')
      newLI.text(el.ItemText);

      var ex = $('<span>');
      ex.attr('data-event-id', el.ItemID);
      ex.attr('aria-hidden', 'true');
      ex.addClass('glyphicon glyphicon-remove removeEvent del-cal-item');
      newLI.append(ex);

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
        newBtn.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
        newBtn.data('ann-id', el.id);
        newBtn.addClass('btn btn-default btn-xs ann-del');
        newRow.append(newBtn);

        contAnn.append(newRow);
      });

    } 

    // else {
    //   contAnn.append("<li class='list-group-item'>No announcements</li>");
    // }
}

function addAnnouncement() {
  var newAnn = $('#txtAnn').val().trim();
  post(baseURL + "ann", "msg=" + newAnn)
  .then(function(res){
    console.log(res);
    return get(baseURL + "ann");
  })
  .then(function(anns){
    printAnn(anns);
  })
  .catch(function(err) {
    console.log(err);
  });

  resetForm($('#formAnn'));
  $('#modalFormAnn').modal("hide");
}

function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea ').val('');
    $form.find('input[type=date]').val("mm/dd/yyyy");
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked')
         .removeAttr('selected')
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

    if (data) {
      req.send(data);
    } else {
      req.send();
    }

  });
}


function newStatus (data) {
  $('#inoutboard').empty();
  data.users.forEach(function(el){
      var newRow = $('<tr>');
        newRow.data('empID', el.EmpID);

        var name = $('<th>');
        name.text(el.FirstName);

        var status = $('<td>');

        var stsIn = createSpan("In", el.InOffice);
        var stsOut = createSpan("Out", el.OutOffice);
        var stsRemote = createSpan("Remote", el.Home);

        status.append(stsIn)
            .append(stsOut)
            .append(stsRemote);

        var extension = $('<td>');
        extension.text(el.Extension);

        newRow.append(name)
              .append(status)
              .append(extension);

        $('#inoutboard').append(newRow);
    });
}

function createSpan (stsLabel, status) {
  var htmlElmnt = $('<span>');
  htmlElmnt.text(stsLabel);
  htmlElmnt.addClass(stsLabel.toLowerCase() + "-label");

  if (status) {
    htmlElmnt.addClass(stsLabel.toLowerCase() + "-label-checked");
  }
  return htmlElmnt;
}

function printProjects (data) {
  $('#callRouting').empty();
  data.forEach(function(el){
    var newRow = $('<tr>');

    var projName = $('<td>');
    projName.text(el["projectName"]);

    var projOwner = $('<td>');
    projOwner.text(el["projectOwner"]);

    var secondContact = $('<td>');
    secondContact.text(' ');

    newRow.append(projName)
          .append(projOwner)
          .append(secondContact);

    $('#callRouting').append(newRow);

  });

  $('#datatable-call-routing').DataTable();
}

//Datepicker options
$(document).on('ready', function(){
  $('.datepicker').datepicker({
    autoclose: true
  });

  $('.datepicker').datepicker().on('changeDate', function (ev) {
    $(this).datepicker('hide');
  });;
})


/********************/
/***** Workload *****/
$('.workload').on('click', function(){
  var self = $(this);
  var status = self.parent().data('status');
  toggleWorkload(self, status);
});

function toggleWorkload (elmnt, status) {
  switch(status) {
    case 'light':
      elmnt.text('Moderate');
      elmnt.parent().data('status', 'moderate');
      elmnt.attr('class', 'btn workload mod');
      var put_url = baseURL + "workloads/" + elmnt.parent().data('entity') + "/" + "2";
      put(put_url).then(function(result){console.log(result)});
      break;
    case 'moderate':
      elmnt.text('Heavy');
      elmnt.parent().data('status', 'heavy');
      elmnt.attr('class', 'btn workload heavy');
      var put_url = baseURL + "workloads/" + elmnt.parent().data('entity') + "/" + "3";
      put(put_url).then(function(result){console.log(result)});
      break;
    default:
      elmnt.text('Light');
      elmnt.parent().data('status', 'light');
      elmnt.attr('class', 'btn workload light');
      var put_url = baseURL + "workloads/" + elmnt.parent().data('entity') + "/" + "1";
      put(put_url).then(function(result){console.log(result)});
      break;
  }
}

function printWorkloads(data) {
  data.forEach(function(el){
    var btn = $("#btn-"+ el.dept);
    switch (el.status){
      case 0:
        btn.text('...');
        break;
      case 1:
        btn.text('Light');
        btn.parent().data('status', 'light');
        btn.attr('class', 'btn workload light');
        break;
      case 2:
        btn.text('Moderate');
        btn.parent().data('status', 'moderate');
        btn.attr('class', 'btn workload mod');
        break;
      case 3:
        btn.text('Heavy');
        btn.parent().data('status', 'heavy');
        btn.attr('class', 'btn workload heavy');
        break;
    }
  });
}

/***** End Workload *****/