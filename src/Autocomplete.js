import React, { Component } from "react";
import './Autocomplete.css';
import {productJSON} from './products.js';

class AutoCompleteSearch extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    var value = document.getElementById("searchBox").value;
    var products = productJSON.products;
    var results= new Set();

    for(var i=0; i<products.length && results.size<10; i++){
      if(products[i].name.substr(0, value.length).toUpperCase() === value.toUpperCase()){
        var result = "<li class='rlist'>Name: "+products[i].name+"\nType: "+products[i].type+"\nURL: "+products[i].url+"\n</li>";
        results.add(result);
      }
    }

    if(results.size === 0){ 
      document.getElementById("results-list").innerHTML = "Sorry no results found.";
    } else {
      document.getElementById("results-list").innerHTML = "<h3>Following results were found:</h3>";
      results.forEach(function(value){
        document.getElementById("results-list").innerHTML += value;
      });
    }
  }

  autoComplete(input, data) {
    var focusElement; //To keep track of focused suggestion
    var typedValue;
    input.addEventListener("input", function(e) {
        document.getElementById("results-list").innerHTML = "";
        var val = this.value;
        typedValue = val;
        
        //Close existing suggestions list
        closeAllSuggestions();

        if (!val) { return false;}
        focusElement = -1;

        //Element to contain all suggestions
        var suggestionDropdown = document.createElement("DIV");
        suggestionDropdown.setAttribute("id", this.id + "results-list");
        suggestionDropdown.setAttribute("class", "results-items");

        //Add created element to the search box
        this.parentNode.appendChild(suggestionDropdown);
        
        //For instructions to be performed in suggested dropdown
        suggestionDropdown.innerHTML += "<p class='search-command'>Hit Enter to Select</p>";
        
        for (var i = 0; i < data.length && (suggestionDropdown.childElementCount < 7); i++) { //keeping returned suggestions to max of 7 to keep it manageble- as design standard
          if (data[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
            var suggestion = document.createElement("DIV");
            suggestion.setAttribute("class","suggestion-item");
            suggestion.innerHTML = data[i].substr(0, val.length) ;
            //Highlighting the remaining part of suggestion: UX design standard
            suggestion.innerHTML += "<strong>" + data[i].substr(val.length) + "</strong>";
            suggestion.innerHTML += "<input type='hidden' value='" + data[i] + "'>";
            
            //User selects the suggestion
            suggestion.addEventListener("click", function(e) {
                input.value = this.getElementsByTagName("input")[0].value;
                closeAllSuggestions();
            });

            suggestionDropdown.appendChild(suggestion);
          }
        }

        //Add results if search string is found in between product name e.g: search 'funds'
        if(suggestionDropdown.childElementCount < 7){

          for (i = 0; i < data.length && (suggestionDropdown.childElementCount < 7); i++) { //keeping returned suggestions to max of 7 to keep it manageble- as design standard
            if (data[i].substr(0, val.length).toUpperCase() !== val.toUpperCase() &&
              data[i].toUpperCase().includes(val.toUpperCase())) {
              
              var suggestion = document.createElement("DIV");
              suggestion.setAttribute("class","suggestion-item");

              var regEx = new RegExp(val, "ig");
              var str = data[i].replace(regEx, "<strong>"+val+"</strong>");
              suggestion.innerHTML = str ;
              suggestion.innerHTML += "<input type='hidden' value='" + data[i] + "'>";
              
              //User selects the suggestion
              suggestion.addEventListener("click", function(e) {
                  input.value = this.getElementsByTagName("input")[0].value;
                  closeAllSuggestions();
              });

              suggestionDropdown.appendChild(suggestion);
            }
          }
        }
    });

    //Navigation key event listener
    input.addEventListener("keydown", function(e) {
        var tempDiv = document.getElementById(this.id + "results-list");
        if (tempDiv){
            tempDiv = tempDiv.getElementsByTagName("div");
        }

        //If Down key is pressed
        if (e.keyCode === 40) {
          focusElement++;
          makeActive(tempDiv,this);
        } else if (e.keyCode === 38) { //Up key is pressed
          focusElement--;
          makeActive(tempDiv,this);
        } else if (e.keyCode === 13) { //Enter is pressed
          e.preventDefault();
          if (focusElement > -1) {
            if (tempDiv) tempDiv[focusElement].click();
          }
          //this.form.submit();
        }
    });

    function makeActive(element, inputObject) {
        if (!element) return false;

        remove(element);
        if (focusElement >= element.length){ focusElement = -1; inputObject.value = typedValue; return; }
        if (focusElement < 0){ focusElement = (element.length); inputObject.value = typedValue; return; }
        
        element[focusElement].classList.add("result-active");
        inputObject.value = element[focusElement].innerText;
    }

    function remove(element) {
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("result-active");
      }
    }

    function closeAllSuggestions(element) {
        var temp = document.getElementsByClassName("results-items");
        for (var i = 0; i < temp.length; i++) {
            if (element !== temp[i] && element !== input) {
                temp[i].parentNode.removeChild(temp[i]);
            }
        }
    }

    //Clicked anywhere in the document - remove all suggestions
    document.addEventListener("click", function (e) {
        closeAllSuggestions(e.target);
    });
  }

  render() {
    return (
    <div>
		<form id="searchForm"autoComplete="off" onSubmit={this.handleSubmit}>
		  <div className="autocompletediv">
			<input id="searchBox" type="text" name="searchBox" placeholder="Search various products"></input>
		  </div>
		  <input type="submit"></input>
		</form>
    <div id="results-list"></div>
    </div>
    );
  }

  componentDidMount(){
    //Fetching data from products JSON - Temporary - JSON/Data should be returned by Server
    var products = productJSON.products.map(({ name }) => name);
    var productList = [...new Set(products)];  
    this.autoComplete(document.getElementById("searchBox"), productList);
  }
}

export default AutoCompleteSearch;