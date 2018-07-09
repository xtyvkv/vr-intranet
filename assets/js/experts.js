$(document).ready(function(){
    init();
    setInterval(()=> init(), 120 * 1000);

    $('#t').on('click', 'button', function(e){
        var el = $(this);
        var action = el.data('action');
        var id = el.parent().data('record-id');
        console.log(action, id);
    });
    $('body').on('click', '#submit', function(e){
        e.preventDefault();
        $('#expert-form-modal').modal('hide');
        resetForm($('form'));
        console.log('Submit');
    })
});


function init() {
    console.log('updating page');
    let t = $('#t');
    t.empty();
    fetch('/api/experts')
    .then(res => res.json())
    .then(data => {
        
        data.forEach(e => {
            t.append(processRecord(e));
        })
    })
    .catch(err => console.log(err));
}

function processRecord (row) {
    let r = $('<tr>');

    let sm = $('<td>');
    sm.text(row['SubjectMatter']);
    r.append(sm);

    let exp = $('<td>');
    exp.text(row['Expert']);
    r.append(exp);

    let act = $('<td>');
    act.data('record-id', row['id']);

    let edit = `<button type="button" class="btn btn-default btn-lg" aria-label="delete" data-toggle="tooltip" data-placement="top" title="Edit" data-action="edit">
                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </button>`;
    act.append(edit);

    let d = `<button type="button" class="btn btn-default btn-lg" aria-label="delete" data-toggle="tooltip" data-placement="top" title="Delete" data-action="delete">
                <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
            </button>`;
    act.append(d);


    r.append(act);

    return r;
}