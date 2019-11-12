"use strict";

// Application Dependencies
const express = require("express");
const superagent = require("superagent");

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

//added to look into objects
const util = require("util");

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set the view engine for server-side templating
app.set("view engine", "ejs");

// API Routes
// Renders the search form
app.get("/", (request, response) => {
  response.render("pages/index", { message: "nice It Works!" });
});
app.get("/home");
// Creates a new search to the Google Books API
app.post("/searches", createSearch);

// HELPER FUNCTIONS - constructor/translator
function Book(info) {
  const placeholderImage = "https://placeholder.com/300x300";
  this.title = info.title ? info.title : "No title available at the moment";
}

// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render("pages/index");
}

// NO API Required
function createSearch(request, response) {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";

  console.log(request.body);
  console.log(request.body.search);

  if (request.body.search[1] === "title") {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === "author") {
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent
    .get(url)
    .then(apiResponse =>
      apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo))
    )
    .then(results =>
      response.render("pages/searches/show", { searchResults: results })
    )
    .catch(err => handleError(err, response));
}
// error catcher
app.get("*", (request, response) =>
  response.status(404).send("Oh no it doesnt work")
);

//error handler
const handleError = (error, response) => {
  response.render("pages/error", { error: error });
};
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
