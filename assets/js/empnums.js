$(document).ready( function () {
    init();
} );

function init(){
    fetch(`http://vrcentral:8180/api/empnums`)
    .then(res => res.json())
    .then(data => {
        data.forEach(el =>{
            processRecord(el);
        });
    $('#contact-info-table').DataTable();

    });
}

function processRecord(data){
    let tbody = $('#contact-info-tbody');
    
    let row = $('<tr>');

    let s = `<td>${testNull(data['FirstName'])} ${testNull(data['LastName'])}</td>
            <td>${testNull(data['CellPhone'])}</td>
            <td>${testNull(data['HomePhone'])}</td>
            <td>${testNull(data['WorkNumber'])}</td>
            <td>${testNull(data['CallInstructions'])}</td>
    `;

    row.append(s);
    tbody.append(row);
}

function testNull(s){
    return s ? s: "";
}
