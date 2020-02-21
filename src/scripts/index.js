require("../styles/index.css");

// API Key
const apikey = "a601c1b2a5df46d883bdd85f8439d1aa";

function getNews() {
  // alert('hello');

  const url =
    "https://newsapi.org/v2/top-headlines?country=in&apiKey=" + apikey;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log(data.articles);
      const length = data.articles.length;
      var output = "";

      // console.log(length);

      for (var i = 0; i < length; i++) {
        var obj = data.articles;
        // console.log(obj[i].title);

        var titles = obj[i].title;
        var authors = obj[i].author;
        var descriptions = obj[i].description;
        var urls = obj[i].url;
        var image = obj[i].urlToImage;

        // output += 'Title: ' + titles + '<br>'
        //     + 'Author: ' + authors + '<br>'
        //     + 'Description: ' + descriptions + '<br>'
        //     + 'Reference: ' + urls + '<br>'
        //     + 'Image: ' + image + '<hr>';

        //patch002 none != none -> style="transform: matrix()" , :hover manipulates parameters

        output +=
          '<li class="article">' +
          '<div class="card p-1" style="width: 15rem;display:none"><img src="' +
          image +
          '" class="article-img" alt="..."></div> ' + //patch005
          '<div class="card p-1" style="width: 15rem;"><img src="' +
          image +
          '" class="card-img-top article-img" alt="..."> ' +
          '<div class="card-body">' +
          '<h2 class="article-title">' +
          titles.substring(0, 70) +
          "</h2>" +
          '<p class="article-description">' +
          descriptions.substring(0, 100) +
          "</p>" +
          '<span class="article-author">' +
          authors +
          "</span><br>" +
          '<a href="' +
          urls +
          '" class="article-link">know more</a>' +
          "</div></div></li> ";

        document.getElementById("news-articles").innerHTML = output;
      }
    });
}

getNews();

// document.getElementById('search').addEventListener('onkeypress',searchNews())

function searchNews() {
  var query = document.getElementById("search").value;

  // alert('search' + '    ' + query);

  //

  // const url = 'http://newsapi.org/v2/everything?q='+'apple'+'&apiKey=6f1cacbf2bae46faa35d5a9db3005c04';

  const url =
    "http://newsapi.org/v2/everything?q=" + query + "&apiKey=" + apikey;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log(data.articles);
      const length = data.articles.length;
      const results = data.totalResults;
      var output = "";

      // console.log(length);

      // alert('totalresults: ' + data.totalResults);

      if (results != 0) {
        for (var i = 0; i < length; i++) {
          var obj = data.articles;
          // console.log(obj[i].title);

          var titles = obj[i].title;
          var authors = obj[i].author;
          var descriptions = obj[i].description;
          var urls = obj[i].url;
          var image = obj[i].urlToImage;

          output +=
            '<li class="article">' +
            '<div class="card p-1" style="width: 15rem;display:none"><img src="' +
            image +
            '" class="article-img" alt="..."></div> ' + //patch005
            '<div class="card p-2" style="width: 17rem;"><img src="' +
            image +
            '" class="card-img-top article-img" alt="..."> ' +
            '<div class="card-body">' +
            '<h2 class="article-title">' +
            titles.substring(0, 70) +
            "</h2>" +
            '<p class="article-description">' +
            descriptions.substring(0, 100) +
            "</p>" +
            '<span class="article-author">' +
            authors +
            "</span><br>" +
            '<a href="' +
            urls +
            '" class="article-link">know more</a>';
          ("</div></div></li> ");

          document.getElementById("news-articles").innerHTML = output;
        }
      } else {
        document.getElementById("news-articles").innerHTML = "";

        document.getElementById("notfound").innerHTML =
          "No article was found based on the search.";
      }
    });
}

document.getElementById("search").addEventListener(
  "keypress",
  function(e) {
    if (e.keyCode === 13) {
      var query = document.getElementById("search").value;

      query == "" ? getNews() : searchNews();

      // searchNews();
    }
  },
  false
);
