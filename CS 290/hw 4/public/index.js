/*
 * This file doesn't contain any JS because this assignment is released before
 * the due date of the previous assignment, so I don't want to give you the
 * solution to that assignment yet ;)  You'll know this file was served
 * correctly if you see the alert below in your browser.  Alternatively, you
 * can add your own solution code from the previous assignment here in order
 * to see all of the client-side JS interactions you implemented.
 */

alert('Client-side JS was successfully loaded.');

/*---------------------------------------------------------------Update Button*/
// Array of post objects
var posts = document.getElementsByClassName('post');
console.log(posts);

// Update button clicked listener
document.getElementById('filter-update-button').addEventListener("click", filter);

// Main update button filter
function filter(){
  var text = document.getElementById('filter-text').value;
    text = text.toLowerCase();
  var min = document.getElementById('filter-min-price').value;
    min = parseInt(min);
  var max = document.getElementById('filter-max-price').value;
    max = parseInt(max);
  var city = document.getElementById('filter-city').value;
    city = city.toLowerCase();
  var condition = document.getElementById('filter-condition');

// loops through initial items
  for(var i = 0; i < posts.length; i++){
// checks title and substrings
    if(text){
      var postTitle = posts[i].querySelector('.post-title').innerText
        postTitle = postTitle.toLowerCase();
      if(!postTitle.includes(text)){
        posts[i].remove();
        i--;
      }
    }

// checks minimum price
    if(min){
      if(parseInt(posts[i].dataset.price) < min){
        posts[i].remove();
        i--;
      }
    }
// checks maximum price
    if(max){
      if(parseInt(posts[i].dataset.price) > max){
        posts[i].remove();
        i--;
      }
    }
// checks city
    if(city){
      var postCity = posts[i].querySelector('.post-city').innerText
        postCity = postCity.toLowerCase();
      if(!postCity.includes(city)){
        posts[i].remove();
        i--;
      }
    }
// checks if condition box is checked
    if(condition.querySelector('#filter-condition-new').checked || condition.querySelector('#filter-condition-excellent').checked || condition.querySelector('#filter-condition-good').checked || condition.querySelector('#filter-condition-fair').checked || condition.querySelector('#filter-condition-poor').checked){
// checks for new condition
      if(!condition.querySelector('#filter-condition-new').checked && posts[i].dataset.condition == "new"){
        posts[i].remove();
        i--;
      }
// checks for excellent condition
      else if(!condition.querySelector('#filter-condition-excellent').checked && posts[i].dataset.condition == "excellent"){
        posts[i].remove();
        i--;
      }
// checks for good condition
      else if(!condition.querySelector('#filter-condition-good').checked && posts[i].dataset.condition == "good"){
        posts[i].remove();
        i--;
      }
// checks for fair condition
      else if(!condition.querySelector('#filter-condition-fair').checked && posts[i].dataset.condition == "fair"){
        posts[i].remove();
        i--;
      }
// checks for poor condition
      else if(!condition.querySelector('#filter-condition-poor').checked && posts[i].dataset.condition == "poor"){
        posts[i].remove();
        i--;
      }
    } // end of if condition
  } // end of for loop
} // end of filter function

/*--------------------------------------------------------------Sell Something*/
// Sell Something button clicked listener
document.getElementById('sell-something-button').addEventListener("click", sellSomethingClose);
// X button clicked listener
document.getElementById('modal-close').addEventListener("click", sellSomethingClose);
// Cancel button clicked listener
document.getElementById('modal-cancel').addEventListener("click", sellSomethingClose);

// Main hide sell something
function sellSomethingClose(){
// toggles UI
  var backdrop = document.getElementById('modal-backdrop');
  var button = document.getElementById('sell-something-modal');
  backdrop.classList.toggle('hidden');
  button.classList.toggle('hidden');

  document.getElementById('post-text-input').value = '';
  document.getElementById('post-photo-input').value = '';
  document.getElementById('post-price-input').value = '';
  document.getElementById('post-city-input').value = '';
  document.getElementById('post-condition-new').checked = true;
} // end of sellSomethingClose function

// Create Post button clicked listener
document.getElementById('modal-accept').addEventListener("click", insertNewPost);

// List of posts
var newPost = document.getElementById('posts');

// Main insert new post
function insertNewPost(){
// itemDescription, photoURL, price, city, condition
  var itemDescription = document.getElementById('post-text-input').value;
  var photoURL = document.getElementById('post-photo-input').value;
  var price = document.getElementById('post-price-input').value;
  var city = document.getElementById('post-city-input').value;
// determin items condition
  if(document.getElementById('post-condition-new').checked){
    var condition = 'new';
  }
  else if(document.getElementById('post-condition-excellent').checked){
    var condition = 'excellent';
  }
  else if(document.getElementById('post-condition-good').checked){
    var condition = 'good';
  }
  else if(document.getElementById('post-condition-fair').checked){
    var condition = 'fair';
  }
  else if(document.getElementById('post-condition-poor').checked){
    var condition = 'poor';
  }

// input validation
  if(itemDescription && photoURL && price && city){
    var postData = document.createElement('div');
      postData.classList.add('post');
      postData.setAttribute('data-price', price);
      postData.setAttribute('data-city', city);
      postData.setAttribute('data-condition', condition);

    var postContents = document.createElement('div');
      postContents.classList.add('post-contents');
    postData.appendChild(postContents);

    var postImageContainer = document.createElement('div');
      postImageContainer.classList.add('post-image-container');
    postContents.appendChild(postImageContainer);

    var postImage = document.createElement('img');
      postImage.src = photoURL;
      postImage.alt = itemDescription;
    postImageContainer.appendChild(postImage);

    var postInfoContainer = document.createElement('div');
      postInfoContainer.classList.add('post-info-container');
    postContents.appendChild(postInfoContainer);

    var a = document.createElement('a');
    var aText = document.createTextNode(itemDescription);
    a.appendChild(aText);
      a.href = "#";
      a.classList.add('post-title');
    postInfoContainer.appendChild(a)

    var spanPrice = document.createElement('span');
      spanPrice.classList.add('post-price');
      var spanPriceText = document.createTextNode('$' + price);
      spanPrice.appendChild(spanPriceText);
    postInfoContainer.appendChild(spanPrice)

    var spanCity = document.createElement('span');
      spanCity.classList.add('post-city');
      var spanCityText = document.createTextNode('(' + city + ')');
      spanCity.appendChild(spanCityText);
    postInfoContainer.appendChild(spanCity)

    newPost.appendChild(postData); // add new post to site
    posts = document.getElementsByClassName('post'); // updates posts array
    console.log(posts);
    sellSomethingClose(); // close UI
  } // end of validation if
  else{
    alert('Please complete all feilds.');
  } // end of validation else
} // end of Main insert new post function
