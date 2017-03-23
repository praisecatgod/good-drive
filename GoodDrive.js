// ==UserScript==
// @name         GoodDrive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows rating and link to Goodreads page for books on OverDrive.
// @author       Yves St. Germain
// @match        http://*/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include      https://*.overdrive.com/media/*
// ==/UserScript==

(function()
{
  'use strict';


  function displayError()
  {
    var details_html = document.getElementsByClassName("TitleDetailsHeading")[0];
    var errorContainer = document.createElement("div");
    $(errorContainer).css(
    {
      "background-color": "#D6DBDF",
      "color": "#900C3F"
    });
    var errorDisplay = document.createElement("h5");
    errorContainer.appendChild(errorDisplay);
    var errorText = document.createTextNode("Unable to load information for this title!");
    errorDisplay.appendChild(errorText);

    $(errorContainer).insertAfter(details_html);
  }


  function displayGoodReads(isbn)
  {
    var details_html = document.getElementsByClassName("TitleDetailsHeading")[0];

    $.ajax(
    {
      method: "GET",
      url: "https://www.goodreads.com/book/isbn/" + isbn + "?format=json&user_id=19044654",
      dataType: "jsonp",
      success: function(data)
      {
        var goodreadsContainer = document.createElement("div");
        $(goodreadsContainer).html(data.reviews_widget);
        $(goodreadsContainer).insertAfter(details_html);
      },
      error: displayError()
    });

  }

  function generateHTML(isbn)
  {
    if (isbn.length === 13)
    {
      return displayGoodReads(isbn);
    }
    else
    {
      return displayError();
    }
  }

  var isbn = $("li[aria-label~='ISBN:']")[0];
  var details_html = document.getElementsByClassName("TitleDetailsHeading")[0];
  if (details_html !== undefined && isbn !== undefined)
  {
    generateHTML(isbn.innerText.replace(/\D/g, ''));

  }


})();
