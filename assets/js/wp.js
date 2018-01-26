var baseURL = "http://sandbox:8180/api/";
fetch(baseURL + "inout")
    .then(res => res.json())
    .then(data => newStatus(data))
    .catch(err => console.log(err));

function newStatus(data) {
    // $('#inoutboard').empty();
    var iob = document.getElementById('inoutboard');
    iob.innerHTML = "";

    data.users.forEach(el => {
        var newRow = document.createElement('tr');
        newRow.classList.add('iob-row');
        newRow.setAttribute('data-empID', el.EmpID);

        var name = document.createElement('th');
        name.innerText = el.FirstName;

        var status = document.createElement('td');
        status.innerText = 'In';

        var e = document.createElement('td');
        e.innerText = el.Extension;

        newRow.appendChild(name);
        newRow.appendChild(status);
        newRow.appendChild(e);
        iob.appendChild(newRow);
    })
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
