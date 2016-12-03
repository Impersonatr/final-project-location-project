/*
 * This function displays the modal for adding a photo to a user page.
 */
function displayAddPlaceModal() {

  var backdropElem = document.getElementById('modal-backdrop');
  var addPlaceModalElem = document.getElementById('add-place-modal');

  // Show the modal and its backdrop.
  backdropElem.classList.remove('hidden');
  addPlaceModalElem.classList.remove('hidden');

}


/*
 * This function closes the modal for adding a photo to a user page, clearing
 * the values in its input elements.
 */
function closeAddPlaceModal() {

  var backdropElem = document.getElementById('modal-backdrop');
  var addPlaceModalElem = document.getElementById('add-place-modal');

  // Hide the modal and its backdrop.
  backdropElem.classList.add('hidden');
  addPlaceModalElem.classList.add('hidden');

  clearPlaceInputValues();

}


/*
 * This function clears the values of all input elements in the photo modal.
 */
function clearPlaceInputValues() {

  var inputElems = document.getElementsByClassName('place-input-element');
  for (var i = 0; i < inputElems.length; i++) {
    var input = inputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}


/*
 * Small function to get a person's identifier from the current URL.
 */
function getPersonIDFromLocation() {
  var pathComponents = window.location.pathname.split('/');
  if (pathComponents[0] !== '' && pathComponents[1] !== 'people') {
    return null;
  }
  return pathComponents[2];
}


/*
 * This function uses Handlebars on the client side to generate HTML for a
 * person photo and adds that person photo HTML into the DOM.
 */
function insertNewPlace() {
	var title = document.getElementById('place-title-input').value || '';
	var latitude = document.getElementById('place-lat-input').value || '';
	var longitude = document.getElementById('place-long-input').value || '';
	var description = document.getElementById('place-desc-input').value || '';

	if (title.trim()) {
		storeNewLocation(title, latitude, longitude, description, function (err) {
			if (err) {alert("Unable to save this new location. Got this error:\n\n" + err);} 
		});
    
	closeAddPlaceModal();
	} 
	else {alert('You must specify a title!');}
}


// Wait until the DOM content is loaded to hook up UI interactions, etc.
window.addEventListener('DOMContentLoaded', function (event) {

  var addPlaceButton = document.getElementById('add-place-button');
  if (addPlaceButton) {
    addPlaceButton.addEventListener('click', displayAddPlaceModal);
  }

  var modalCloseButton = document.querySelector('#add-place-modal .modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeAddPlaceModal);
  }

  var modalCancalButton = document.querySelector('#add-place-modal .modal-cancel-button');
  if (modalCancalButton) {
    modalCancalButton.addEventListener('click', closeAddPlaceModal);
  }

  var modalAcceptButton = document.querySelector('#add-place-modal .modal-accept-button');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', insertNewPlace);
  }

});
