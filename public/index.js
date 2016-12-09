/*
 *  all functions related to adding/removing a place
 */
function displayAddPlaceModal() {
	var backdropElem = document.getElementById('modal-backdrop');
	var addPlaceModalElem = document.getElementById('add-place-modal');

	//Un-hide the modal
	backdropElem.classList.remove('hidden');
	addPlaceModalElem.classList.remove('hidden');
}


//Hide the modal and clear values
function closeAddPlaceModal() {
	var backdropElem = document.getElementById('modal-backdrop');
	var addPlaceModalElem = document.getElementById('add-place-modal');


	backdropElem.classList.add('hidden');
	addPlaceModalElem.classList.add('hidden');

	clearPlaceInputValues();
}


//Clear all values in the modal's fields
function clearPlaceInputValues() {
	var inputElems = document.getElementsByClassName('place-input-element');
	for (var i = 0; i < inputElems.length; i++) {
		var input = inputElems[i].querySelector('input, textarea');
		input.value = '';
	}
}

//Find the fields, and if conditions are met send off the entries to be added to db. Will also reload the page after completion! 
function insertNewPlace() {
	var title = document.getElementById('place-title-input').value || '';
	var latitude = document.getElementById('place-lat-input').value || '';
	var longitude = document.getElementById('place-long-input').value || '';
	var description = document.getElementById('place-desc-input').value || '';

	if (title.trim()) {
		storeNewLocation(title, latitude, longitude, description, function (err) {
			if (err) {alert("Unable to save this new location for the following reason:\n\n" + err);}
		});
    
	closeAddPlaceModal();
	reloader();
	}
	else {alert('You must specify a title!');}
}

//delete a place
function deletePlace (event) {
	var i, lat, longi;
	var clickedElemParent = event.target.parentNode;
	var clickedPlaceContainer = clickedElemParent.parentNode;
	var allChildren = clickedPlaceContainer.childNodes;
	
	//get lat and long
	for(i=0; i < allChildren.length; i++) {
		if(typeof allChildren[i].innerText != 'undefined' && allChildren[i].innerText.includes("Latitude")) {
			lat = allChildren[i].innerText;
		}
		else if(typeof allChildren[i].innerText != 'undefined' && allChildren[i].innerText.includes("Longitude")) {
			longi = allChildren[i].innerText;
		}
	}
	
	//trim
	lat = lat.replace(/[^\d.-]/g, '');
	longi = longi.replace(/[^\d.-]/g, '');
	
	var postURL = '/remove-place';
	
	var postRequest = new XMLHttpRequest();
	postRequest.open('POST', postURL);
	postRequest.setRequestHeader('Content-Type', 'application/json');
	
	postRequest.addEventListener('load', function (event) {
		var error;
		if (event.target.status !== 200) {
			error = event.target.response;
		}
	});
	
	postRequest.send(JSON.stringify({
		"latitude": lat,
		"longitude": longi
	}));
  
	reloader();
}





/*
 *  all functions related to editing Home
 */
function displayEditModal(event) {
	var backdropElem = document.getElementById('modal-backdrop');
	var homeModalElem = document.getElementById('change-home-modal');
	
	var i, lat, longi;
	var clickedElemParent = event.target.parentNode;
	var clickedPlaceContainer = clickedElemParent.parentNode;
	var allChildren = clickedPlaceContainer.childNodes;
	
	//get lat and long
	for(i=0; i < allChildren.length; i++) {
		if(typeof allChildren[i].innerText != 'undefined' && allChildren[i].innerText.includes("Latitude")) {
			lat = allChildren[i].innerText;
		}
		else if(typeof allChildren[i].innerText != 'undefined' && allChildren[i].innerText.includes("Longitude")) {
			longi = allChildren[i].innerText;
		}
	}
	
	//trim
	lat = lat.replace(/[^\d.-]/g, '');
	longi = longi.replace(/[^\d.-]/g, '');
	
	console.log(lat, longi);
	
	var latitude = document.getElementById('home-lat-input').value = lat;
	var longitude = document.getElementById('home-long-input').value = longi;

	

	//Un-hide the modal
	backdropElem.classList.remove('hidden');
	homeModalElem.classList.remove('hidden');
}

function closeEditModal() {
	var backdropElem = document.getElementById('modal-backdrop');
	var homeModalElem = document.getElementById('change-home-modal');


	backdropElem.classList.add('hidden');
	homeModalElem.classList.add('hidden');

	clearPlaceInputValues();
}

function editHome() {
	var latitude = document.getElementById('home-lat-input').value || '';
	var longitude = document.getElementById('home-long-input').value || '';
	
	latitude = latitude.replace(/[^\d.-]/g, '');
	longitude = longitude.replace(/[^\d.-]/g, '');
	
	if (latitude.trim() && longitude.trim()) {
		storeNewHome(latitude, longitude, function (err) {
			if (err) {alert("Unable to change home for the following reason:\n\n" + err);}
		});
    
	closeEditModal();
	reloader();
	}
	else {alert('You must specify both latitude and longitude!');}
}


/*
 *  Miscellaneous Functions
 */	



//forces a page refresh to show sorted insertion of new location
function reloader() {
	setTimeout("location.reload(true);", 500);
}

//Listener set-up
window.addEventListener('DOMContentLoaded', function (event) {
	/* var editHomeButtons = document.getElementsByClassName("edit-home-button");
	var i;
	if(editHomeButtons) {
		for(i = 0; i < editHomeButtons.length; i++) {
			editHomeButtons[i].addEventListener('click', editHome);
		}
	} */
	
	var delPlace = document.getElementsByClassName("delete-place-button");
	if(delPlace) {
		for(i = 0; i < delPlace.length; i++) {
			delPlace[i].addEventListener('click', deletePlace);
		}
	}
	
	
	//add place modal
	var addPlaceButton = document.getElementById('add-place-button');
	if (addPlaceButton) {
		addPlaceButton.addEventListener('click', displayAddPlaceModal);
	}

	var modalCloseButton = document.querySelector('#add-place-modal .modal-close-button');
	if (modalCloseButton) {
		modalCloseButton.addEventListener('click', closeAddPlaceModal);
	}

	var modalCancelButton = document.querySelector('#add-place-modal .modal-cancel-button');
	if (modalCancelButton) {
		modalCancelButton.addEventListener('click', closeAddPlaceModal);
	}

	var modalAcceptButton = document.querySelector('#add-place-modal .modal-accept-button');
	if (modalAcceptButton) {
		modalAcceptButton.addEventListener('click', insertNewPlace);
	}
	
	
	
	//Edit Home Modal
	var editHomeButton = document.getElementById('edit-home-button');
	if (editHomeButton) {
		editHomeButton.addEventListener('click', displayEditModal);
	}

	var homeCloseButton = document.querySelector('#change-home-modal .home-close-button');
	if (homeCloseButton) {
		homeCloseButton.addEventListener('click', closeEditModal);
	}

	var homeCancelButton = document.querySelector('#change-home-modal .home-cancel-button');
	if (homeCancelButton) {
		homeCancelButton.addEventListener('click', closeEditModal);
	}

	var homeAcceptButton = document.querySelector('#change-home-modal .home-accept-button');
	if (homeAcceptButton) {
		homeAcceptButton.addEventListener('click', editHome);
	}
});
