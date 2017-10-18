const baseURL = '/node/api/'
$('input[type=text]').on('focusout', function(e){
  if ($(this).val() === '') {
    $(this).addClass('highlightRed');
  } else {
    $(this).removeClass('highlightRed');
  }
})

$('form').on('submit', function(e){
  e.preventDefault();
  validateData()
  .then( () => {
    $('#bad-results').text('');

    var data = new FormData(document.getElementById('ticketForm'))

    var xhr = new XMLHttpRequest();
    xhr.open('POST', baseURL + 'newticket', true);

    xhr.onload = function(event) {
      if (xhr.status == 200) {
        $('#good-results').text('Your ticket has been submitted!')
        resetForm($('#ticketForm'));
      } else {
        console.log("Fail!!")
      }
      // console.log(xhr.response);
    }
    xhr.send(data);
  })
  .catch( () => {
    $('#bad-results').text('Please fill out all required fields')
  })

  
})

function validateData(){
  return new Promise(function(resolve, reject){
    var data = {};
    data.name = $('#inputName').val();
    data.subject = $('#inputSubject').val();
    data.priority = $('#priority').val();
    data.message = $('textarea').val();

    var blanks = Object.values(data).includes("");

    (blanks == true) ? reject(): resolve();
  })
  
}

