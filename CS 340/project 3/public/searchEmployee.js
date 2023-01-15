function searchByFname(){
    var first_name_search_string  = document.getElementById('first_name_search_string').value
    if(first_name_search_string !== ''){
        window.location = '/employee/search/' + encodeURI(first_name_search_string);
    }
    else{
        window.location = '/employee';
    }
    
}