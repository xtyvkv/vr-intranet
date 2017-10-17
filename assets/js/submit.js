const baseURL = 'http://localhost:8180/api/'
$('input[type=text]').on('focusout', function(e){
  if ($(this).val() === '') {
    $(this).addClass('highlightRed');
  } else {
    $(this).removeClass('highlightRed');
  }
})

$('form').on('submit', function(e){
  e.preventDefault();

  var data = new FormData(document.getElementById('ticketForm'))

  var xhr = new XMLHttpRequest();
  xhr.open('POST', baseURL + 'upload', true);

  xhr.onload = function(event) {
    if (xhr.status == 200) {
      console.log("All good!")
    } else {
      console.log("Fail!!")
    }
  }
  xhr.send(data);
})

// $('form').on('submit', function(e){
//   e.preventDefault();
//   var data = {};
//   data.name = $('#inputName').val();
//   data.subject = $('#inputSubject').val();
//   data.priority = $('#priority').val();
//   data.message = $('textarea').val();

//   var blanks = Object.values(data).includes("");

//   if (!blanks) {
//     data = JSON.stringify(data);
//     post(baseURL + 'newticket', data)
//     .then(function(res){
//       console.log(res);
//     });
//   } else {
//     console.log('Please fill out all the required fields');
//   }


// })

// $('input[type=file]').on('change', function(e){
//   var fupload = document.getElementById('myFile');
//   var myFile = fupload.files[0];

//   var oData = new FormData();
//   oData.append('upload', myFile, myFile.name);

//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', baseURL + 'upload', true);
//   // xhr.setRequestHeader("Content-Type", "multipart/form-data");
//   xhr.onload = function(event){
//     if (xhr.status == 200) {
//       fupload.disabled = true;
//       console.log('files successfully uploaded')
//     } else {
//       console.log('Error uploading files')
//     }
//   }
//   xhr.send(oData);
// })

