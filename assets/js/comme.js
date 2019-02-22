$(document).ready(function () {
    $('#add').on('click', function (e) {
        $('#modal-add-event-form').modal('show');
    });

    $('form').on('focusout', 'input', function(event){
        if ( !$(this).val().length ) {
            $(this).parent().addClass('has-error');
        } else {
            $(this).parent().removeClass('has-error');
        }
    });

    $('#submit').on('click', function (e) {
        let fields = ['name', 'event-name', 'date'];
        collectData()
        .then( data => post( '/api/ce', JSON.stringify(data)) )
        .then( res => console.log(res))
        .catch( err => console.log(err));
        //validate
        //submit
        //confirm submission
        $('#modal-add-event-form').modal('hide');
        resetForm($('#event-form'));
    });

    $('#ce-panel').on('click', '.info', function(e){
        getEventDetails($(this).attr('data'), $(this).attr('data-notes'));
    });

    $('#ce-panel').on('click', '.photos', function(e){
        console.log('upload photos', $(this).attr('data'));
    });

    init();
});

function init() {
    let form = $('form');
    fetch('/api/ce')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            printEvents(data);
            return fetch('/api/hashtags');
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(e => {
                let id = e['hashtag_id'];
                let name = e['hashtag_name'].trim();
                let checkboxTemplate = `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="${name}" value="${id}">
                    <label class="form-check-label" for="${name}">${name}</label>
                </div>
                `;

                form.append(checkboxTemplate);
            })
        })
        .catch(err => console.log(err))
}

function printEvents(data) {
    let events_table = $('#events-table');
    data.forEach(e => {
        let row = $('<tr>');
        row.attr('id', e['eventId']);
        row.attr('data', JSON.stringify(e));

        //name
        let name = $('<td>');
        let n = e['name'];
        name.text(n);

        //event name
        let eventname = $('<td>');
        let en = e['event_name'];
        eventname.text(en);

        //date
        let date = $('<td>');
        let d = moment(e['date']).format('MMMM Do, YYYY');
        date.text(d);

        //location
        let location = $('<td>');
        let l = e['location'];
        location.text(l);

        //Actions
        let actions = $('<td>');
        let photos = $('<button>');
        photos.addClass('btn btn-default btn-sm photos');
        photos.attr('data',e['eventId']);
        photos.html(`<i class="fas fa-camera" aria-hidden="true"></i>`);
        // actions.append(photos);

        let info = $('<button>');
        info.addClass('btn btn-default btn-sm info');
        info.attr('data',e['eventId']);
        info.attr('data-notes', e['notes']);
        info.css('margin-left', '1em')
        info.html(`<i class="fas fa-info-circle"></i>`);
        actions.append(info);
        

        row.append(name)
            .append(eventname)
            .append(date)
            .append(location)
            .append(actions);

        events_table.append(row);
    });
}

function getEventDetails(eventId, notes) {
    get('/api/eventhashtags/' + eventId)
        .then( ht => {
            let h = ht.join(', ')
            fillInDetails(eventId, h);
        })
        .catch( err => console.log(err));
}

function fillInDetails(eventId, ht) {
    let data = JSON.parse($(`#${eventId}`).attr('data'));
    
    $('#mi-title').text(data['event_name']);
    $('#mi-date').text( moment(data['date']).format('MMMM Do, YYYY') );
    $('#mi-location').text(data['location']);
    $('#mi-details').text(data['notes']);
    $('#mi-hashtags').text(ht);
    $('#modal-more-info').modal('show');
}

function collectData() {
    return new Promise(function(resolve,reject) {
        try {
                console.log('collect data')
                let data = {};
                data.hashtags = [];
                let fields = $('#event-form').find('input');

                fields.each(function(i, e){
                    let field = $(e);
                    let key = field.attr('id');
                    let val;

                    //Handle Checkboxes
                    if (field.attr('type') === 'checkbox') {
                        if ( field.is(':checked') ) { data.hashtags.push( field.val() )}
                    } else {
                        val = field.val();
                        data[key] = val;
                    }
                    
                })
                resolve(data);
        } catch (error) {
            reject("Unable to collect the data from the form");
        }
    }
);
}

