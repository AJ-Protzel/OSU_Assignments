/*
  Adrien Protzel
  protzela@oregonstate.edu
*/
function acceptClick(){
  var title = document.getElementById('post-title-input').value.trim();
  var date = document.getElementById('post-date-input').value.trim();
  var name = document.getElementById('post-name-input').value.trim();
  var snipit = document.getElementById('post-snipit-input').value.trim();
  var content = document.getElementById('post-content-input').value.trim();
  var link = document.getElementById('post-link-input').value.trim();

  if (!title || !date || !name || !snipit || !content || !link) {
    alert("You must fill in all of the fields!");
  } else {
    var postRequest = new XMLHttpRequest();
    var requestURL = '/' + link + '/addStory';
    postRequest.open('POST', requestURL);
    var requestBody = JSON.stringify({
        title: title,
        date: date,
        name: name,
        snipit: snipit,
        content: content,
        link: link
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    clearInputs();
    addStoryModal();
  }
}

function clearInputs() {
  var postTextInputElements = [
    document.getElementById('post-title-input'),
    document.getElementById('post-date-input'),
    document.getElementById('post-name-input'),
    document.getElementById('post-snipit-input'),
    document.getElementById('post-content-input'),
    document.getElementById('post-link-input')
  ];

  postTextInputElements.forEach(function (inputElem) {
    inputElem.value = '';
  });
}

function backdrop(){
  var modalBackdrop = document.getElementById('modal-backdrop');
  modalBackdrop.classList.toggle('hidden');
}

function navModal(){
  console.log("Nav");
  backdrop();

  var navButton = document.getElementById('nav-button');
  navButton.classList.toggle('fa-bars');
  navButton.classList.toggle('fa-times');

  var showModal = document.getElementById('nav-modal');
  showModal.classList.toggle('hidden');
}

function addStoryModal(){
  console.log("Story");
  backdrop();

  var showModal = document.getElementById('add-story-modal');
  showModal.classList.toggle('hidden');
}

window.addEventListener('DOMContentLoaded', function (){
  var navButton = document.getElementById('nav-button');
    navButton.classList.toggle('fa-times');
  navButton.addEventListener('click', navModal);

  var addStoryButton = document.getElementById('add-story-button');
  addStoryButton.addEventListener('click', addStoryModal);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', addStoryModal);
  }

  var storyAcceptButton = document.getElementById('modal-accept');
  if (storyAcceptButton) {
    storyAcceptButton.addEventListener('click', acceptClick);
  }

  //var addContactButton = document.getElementById('add-contact-button');
  //addContactButton.addEventListener('click', addContactModal);
});
