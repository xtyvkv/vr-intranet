var t = $('#kdtable');
    fetch('/api/kdall')
    .then( res=> res.json())
    .then( data => {
        data.forEach( e => {
            let row = $('<tr>');
            let name = $('<td>');
            name.text(e['Name'] || 'Everyone');

            let date = $('<td>')
            let fd = moment(e['CleanDate']).format('MMMM Do YYYY');
            date.text(fd);

            row.append(name)
                .append(date);

            t.append(row);

        })
    })