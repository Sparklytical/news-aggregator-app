import { getData } from './request';
import '../styles/index.scss';

const apiKey = process.env.APIKEY;
const headlinesURL = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
const everythingURL = `https://newsapi.org/v2/everything?apiKey=${apiKey}`;

// elements
const loader = document.querySelector('#loading');
const newsContainer = document.querySelector('#news-articles');
const more = document.querySelector('#show-more');
const searchBox = document.querySelector('#search');
const notFound = document.querySelector('.not-found');
const error = document.querySelector('.error');
const clearSearch = document.querySelector('#clear-search');
const switcher = document.getElementById('mode-switch');

// data
let articles = [];
let totalResults = 0;
let state = 'h';
const headlinesFilter = {
  page: 1,
  pageSize: 20,
  q: ''
};
let theme;

init();

async function getArticles(
  isSearch,
  page = headlinesFilter.page,
  pageSize = headlinesFilter.pageSize,
  q = headlinesFilter.q
) {
  try {
    const url = isSearch
      ? `${everythingURL}&q=${q}&page=${page}&pageSize=${pageSize}`
      : `${headlinesURL}&page=${page}&pageSize=${pageSize}`;
    state = isSearch ? 'e' : 'h';
    const data = await getData(url);

    if (data.status !== 'ok') {
      handleError(error);
      return;
    }

    if (data.articles.length === 0) {
      notFound.style.display = 'block';
      newsContainer.style.display = 'none';
      articles = [];
      return;
    }

    // show data
    totalResults = data.totalResults;
    articles = [...articles, ...data.articles];

    const list = renderNews(articles);

    newsContainer.innerHTML = list;
    newsContainer.style.display = 'grid';
    notFound.style.display = 'none';
  } catch (error) {
    handleError(error);
  } finally {
    loader.style.display = 'none';
    if (totalResults !== articles.length && articles.length > 0) {
      more.style.display = 'block';
    } else {
      more.style.display = 'none';
    }
  }
}

function init() {
  themeInit();
  loader.style.display = 'flex';
  error.style.display = 'none';
  clearSearch.style.display = 'none';
  articles = [];
  getArticles(false);
}

//reset app
function clear() {
  searchBox.value = null;
  clearSearch.style.display = 'none';
  init();
}

function handleError(msg = null) {
  error.style.display = 'block';
}

//articles list
function renderNews(news) {
  let html = '';
  news.forEach(n => {
    const author = n.author ? n.author : n.source.name;
    const image = n.urlToImage
      ? n.urlToImage
      : 'https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png';
    html += `<li class="article">
      <a href="${n.url}" class="article-link">
        <div class="article__head">
          <img
            src="${image}"
            alt="${n.title}"
            class="article-img"
          />
          <h2 class="article-title">
            ${n.title}
          </h2>
        </div>
        <p class="article-description">
          ${n.description ? n.description : ''}
        </p>
        <div class="article__footer">
          <span class="article-author">
            - ${author}
          </span>
        </div>
      </a>
    </li>`;
  });
  return html;
}

searchBox.addEventListener('keyup', e => {
  clearSearch.style.display = 'block';

  if (e.keyCode === 13) {
    loader.style.display = 'flex';
    newsContainer.style.display = 'none';
    headlinesFilter.q = e.target.value.trim();
    articles = [];
    getArticles(true);
  }
});

window.addEventListener('load', function() {
  loader.className += ' hidden';
});

clearSearch.addEventListener('click', clear);

more.addEventListener('click', infiniteScroll);

//for scrolling infinitely
function infiniteScroll() {
  loader.style.display = 'flex';
  headlinesFilter.page++;
  const isSearch = state === 'e' ? true : false;
  getArticles(isSearch);
}

switcher.addEventListener('change', e => {
  const checked = e.target.checked;
  const theme = checked ? 'dark' : 'light';
  changeTheme(theme);
});

//change theme
function changeTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}

//loading theme
function themeInit() {
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme');
  } else {
    theme = 'light';
    localStorage.setItem('theme', 'light');
  }
  changeTheme(theme);
  switcher.checked = theme === 'dark' ? true : false;
}
