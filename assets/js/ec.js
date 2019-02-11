var t = $('#contact-list');
fetch('/api/emergencycontacts')
    .then(res => res.json())
    .then(data => {
        data.forEach( e => {
            let row = $('<tr>');
            
            //name
            let name = $('<td>');
            let n = e['Name'];
            name.text(n);

            //contact
            let contact = $('<td>');
            let c = e['Contact'];
            contact.text(c);

            //relation
            let rel = $('<td>');
            let r = e['Relationship'];
            rel.text(r);

            //home
            let home = $('<td>');
            let h = e['HomePhone'];
            home.text(h);

            //cell
            let cell = $('<td>');
            let cl = e['CellPhone'];
            cell.text(cl);

            //work
            let work = $('<td>');
            let w = e['WorkPhone']
            work.text(w);

            row.append(name)
                .append(contact)
                .append(rel)
                .append(home)
                .append(cell)
                .append(work)
            
            t.append(row);
        });
    })
    .catch( err => console.log(err))