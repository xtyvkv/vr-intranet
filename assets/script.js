$('#projectContainer').fadeOut(1);
$('#newProjectForm').fadeOut(1);

var projects = {
	Kinecta : {
		lead: "Harold",
		storage: "Hall cubbies",
		data: 75,
		comments: 50,
		theming: 15,
		notes: "Should be done by August 15th",
		avg: ""
	},

	Geffen : {
		lead: "Andrea",
		storage: "Hall cubbies",
		data: 75,
		comments: 75,
		theming: 75,
		notes: "Should be done by October 15th",
		avg: ""
	},

	Xceed : {
		lead: "Harold",
		storage: "Hall cubbies",
		data: 25,
		comments: 25,
		theming: 25,
		notes: "Should be done by December 15th",
		avg: ""
	},

	GSI : {
		lead: "Norma",
		storage: "12th floor",
		data: 90,
		comments: 90,
		theming: 90,
		notes: "Should be done by January 15th",
		avg: ""
	},

	"MN Resident" : {
		lead: "Muriel",
		storage: "server room",
		data: 10,
		comments: 10,
		theming: 10,
		notes: "Should be done by August 15th",
		avg: ""
	}
}

var counter = 0;

function printList (pOb){
	$('#tbody').empty();
	for (key in pOb) {
		counter++;

		// var m = (pOb[key].data + pOb[key].comments + pOb[key].theming)/3;
		// pOb[key].avg = m;

		var r = $('<tr>');

		var d = $('<td>');
		d.html(counter);
		r.append(d);

		var d2 = $('<td>');
		d2.html(key);
		r.append(d2);

		var d3 = $('<td>');
		d3.html(pOb[key].lead);
		r.append(d3);

		// var d4 = $('<td>');
		// d4.html(parseFloat(m).toFixed(0));
		// r.append(d4);

		var d5 = $('<td>');
		var b = $('<button>');
		b.addClass('showStats btn btn-primary');
		b.html('show');
		b.attr('value', key);
		d5.append(b);
		r.append(d5);

		$('#tbody').append(r);

	}

	btnEventListener();
}

function btnEventListener (){
	$('.showStats').on('click', function(){
		$('#newProjectForm').fadeOut(400);
		var p = $(this).val();
		// console.log($(this).val());
		$('#projectName').html(p)
		$('#de').css('width', projects[p].data + "%");
		$('#de').attr('aria-value', projects[p].data);
		$('#de span:first-child').text(projects[p].data + "%");
		$('#de span:nth-child(2)').text(projects[p].data + "%" + " Complete (success)");

		$('#projectName').html(p)
		$('#ce').css('width', projects[p].comments + "%");
		$('#ce').attr('aria-value', projects[p].comments);
		$('#ce span:first-child').text(projects[p].comments + "%");
		$('#ce span:nth-child(2)').text(projects[p].comments + "%" + " Complete (warning)");

		$('#projectName').html(p)
		$('#te').css('width', projects[p].comments + "%");
		$('#te').attr('aria-value', projects[p].comments);
		$('#te span:first-child').text(projects[p].comments + "%");
		$('#te span:nth-child(2)').text(projects[p].comments + "%" + " Complete (danger)");

		$('#storage').html("Data stored in: " + projects[p].storage);
		$('#notes').html("Notes: " + projects[p].notes);

		$('#projectContainer').fadeIn(700)
	});
}

function printButton(){
	var b = $('<button>');
	b.attr('id', 'newProjectButton')
	b.addClass('btn btn-success')
	b.html('Add new project');
	$('#projectsTable').append(b);

	$('#newProjectButton').on('click', function(){
		$('#projectContainer').fadeOut(400)
		$('#newProjectForm').fadeIn(700);
	});

}


$('#submit').on('click', function(){
	var projectName = $('#inputProjectName').val();
	console.log(projectName);
	var projectDetails = {
		lead: "",
		storage: "",
		data: "",
		comments: "",
		theming: "",
		notes: ""
	}

	projectDetails.lead = $('#inputProjectLead').val();
	projectDetails.data = $('#progData').val();
	projectDetails.comments = $('#progComments').val();
	projectDetails.theming = $('#progTheming').val();
	projectDetails.notes = $('#inputProjectNotes').val();
	console.log(projectDetails);
	projects[projectName] = projectDetails;
	console.log(projects);

	printList(projects);
	resetForm($('#newPF'));


	return false;
});

printList(projects);
printButton();


function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}