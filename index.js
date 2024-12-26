// Selected Elements
var header = document.querySelector('header');
var input = document.querySelector('.search');
var buttonSe = document.querySelector('.buttonSe');

// Path Name Pages;
var pathname = location.pathname;
var index = pathname.indexOf('/') + 1;
var newPathname = pathname.slice(1);

// Anime Data
var data = [];
var sliderAnime = ['monster.jpg', 'Cowboy Bebop.jpg', 'luffy_one_piece_.jpg', 'kinpo.jpg', 'The_End_of_Evangelion.jpg'];

fetchAnime().then((re) => {
  data = [...re];
  data.sort((a, b) => b.score - a.score);
  // Home Page
  if (newPathname == 'index.html') {
    onclickSearch();
    var detail = document.querySelector('.button');
    var subtext = document.querySelector('.sub-text');
    var title = document.querySelector('.title');
    var duration = document.querySelector('.duration');
    var synopsis = document.querySelector('.synopsis');
    var elementImg = document.querySelector('.elementImg');
    var buttonSlider = Array.from(document.querySelectorAll('.buttonSlider div'));
    var countSlider = 0;
    changeImg();
    var stopImg = setInterval(sliderImg, 3 * 1000);
    buttonSlider.forEach((button) => {
      button.addEventListener(`click`, function () {
        if (this.classList.contains('next')) {
          clearInterval(stopImg);
          countSlider = (countSlider + 1) % sliderAnime.length;
          changeImg();
          stopImg = setInterval(sliderImg, 3 * 1000);
        } else {
          clearInterval(stopImg);
          countSlider = (countSlider - 1 + sliderAnime.length) % sliderAnime.length;
          changeImg();
          stopImg = setInterval(sliderImg, 3 * 1000);
        }
      });
    });

    detail.onclick = () => {
      localStorage.clear();
      localStorage.setItem(
        `nameAnime1`,
        JSON.stringify({
          name: `${title.innerHTML}`,
          index: `${countSlider}`,
        })
      );
      location.assign('anime_information.html');
    };

    function changeImg() {
      elementImg.setAttribute('src', `img/${sliderAnime[countSlider]}`);
      updateAnimeElements();
    }
    function sliderImg() {
      countSlider = (countSlider + 1) % sliderAnime.length;
      changeImg();
    }
    function updateAnimeElements() {
      subtext.innerHTML = `# ${data[countSlider].score} Spotilight`;
      title.innerHTML = data[countSlider].title;
      duration.innerHTML = data[countSlider].duration;
      synopsis.innerHTML = data[countSlider].synopsis;
    }
  }

  // Formation Page
  if (newPathname == 'anime_information.html') {
    onclickSearch();
    onclickAnime();
    if (localStorage.length > 1) {
      for (var i = 1; i <= localStorage.length; i++) {
        if (`nameAnime${i}` == 'nameAnime1') {
          formation_One_Anime(i);
        } else {
          var Similar = document.querySelector('.Similar');
          var indexAnime = JSON.parse(localStorage.getItem(`nameAnime${i}`)).index;
          var anime = document.createElement('div');
          anime.classList.add('anime');
          var img = document.createElement('img');
          img.setAttribute('src', data[indexAnime].images.jpg.image_url);
          var h4 = document.createElement('h4');
          h4.classList.add('nameAnime');
          h4.setAttribute('data-index', indexAnime);
          h4.innerText = data[indexAnime].title;
          anime.appendChild(img);
          anime.appendChild(h4);
          Similar.appendChild(anime);
        }
      }
    } else if (localStorage.length == 1) {
      formation_One_Anime('1', 'display:none');
    } else if (localStorage.length == 0) {
      displayAnimeNotFound();
    }
  }

  // Anime Liste Page
  if (newPathname == 'anime_liste.html') {
    var animeList = document.querySelector('.animeList');
    var index = 0;
    onclickSearch();
    onclickAnime();
    data.forEach((element) => {
      var anime = document.createElement('div');
      anime.classList.add('anime');
      var img = document.createElement('img');
      img.setAttribute('src', element.images.jpg.large_image_url);
      var h4 = document.createElement('h4');
      h4.classList.add('nameAnime');
      h4.setAttribute('data-index', index);
      index++;
      h4.innerText = `${element.title}`;

      anime.appendChild(img);
      anime.appendChild(h4);
      animeList.appendChild(anime);
    });
  }
});

// All Functions
async function fetchAnime() {
  const url = `https://api.jikan.moe/v4/anime`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
}
function filterInput(input) {
  const patternInput = /(?=.*[a-zA-Z])|(?=.*\d)/gi;
  if (patternInput.test(input.value)) {
    return true;
  } else {
    return false;
  }
}
function nameSearch(input, data) {
  if (filterInput(input) && input.value.trim().length > 1) {
    localStorage.clear();
    var newValue = input.value.split(' ');
    var countAnime = 1;
    let shouldStop = false;
    for (var n = 0; n < newValue.length; n++) {
      var pattern = new RegExp(newValue[n], 'ig');
      if (shouldStop) break;
      for (var d = 0; d < data.length; d++) {
        if (input.value.toLowerCase() == data[d].title.toLowerCase()) {
          localStorage.setItem(
            `nameAnime${countAnime}`,
            JSON.stringify({
              name: `${data[d].title}`,
              index: `${d}`,
            })
          );
          countAnime++;
          console.log(data[d].title);
          shouldStop = true;
          location.assign('anime_information.html');
        } else if (pattern.test(data[d].title) && newValue[n].length > 1) {
          localStorage.setItem(
            `nameAnime${countAnime}`,
            JSON.stringify({
              name: `${data[d].title}`,
              index: `${d}`,
            })
          );
          countAnime++;
          console.log(data[d].title);
          location.assign('anime_information.html');
        }
      }
    }
    if (localStorage.length == 0) {
      location.assign('anime_information.html');
      displayAnimeNotFound();
    }
  } else {
    console.log('hello 2');
    localStorage.clear();
    location.assign('anime_information.html');
    displayAnimeNotFound();
  }
}

function onclickSearch() {
  buttonSe.onclick = () => {
    nameSearch(input, data);
  };
  document.addEventListener('keydown', function (event) {
    if (event.code == 'Enter') {
      nameSearch(input, data);
    }
  });
}

function formation_One_Anime(i = 1, none) {
  var indexAnime = JSON.parse(localStorage.getItem(`nameAnime${i}`)).index;
  var formationAnime = document.createElement('div');
  formationAnime.classList.add('formationAnime');
  var container = document.createElement('div');
  container.classList.add('container');
  var box = document.createElement('div');
  box.classList.add('box');
  var all = document.createElement('div');
  all.classList.add('all');
  var write = document.createElement('div');
  write.classList.add('write');
  var title = document.createElement('h3');
  title.innerText = data[indexAnime].title;
  var status = document.createElement('span');
  status.innerText = data[indexAnime].status;
  var episodes = document.createElement('span');
  episodes.innerText = `Number of rings : ${data[indexAnime].episodes}`;
  var seriesRating = document.createElement('span');
  seriesRating.innerText = `Series rating : ${data[indexAnime].rating}`;
  var boxImg = document.createElement('div');
  boxImg.classList.add('boxImg');
  var img = document.createElement('img');
  img.setAttribute('src', data[indexAnime].images.jpg.image_url);
  var synopsis = document.createElement('p');
  synopsis.innerText = data[indexAnime].synopsis;
  var boxSearch = document.createElement('div');
  boxSearch.classList.add('boxSearch');
  var h3 = document.createElement('h3');
  h3.innerText = 'Similar anime';
  var Similar = document.createElement('div');
  Similar.classList.add('Similar');
  write.appendChild(title);
  write.appendChild(status);
  write.appendChild(episodes);
  write.appendChild(seriesRating);
  boxImg.appendChild(img);
  all.appendChild(boxImg);
  all.appendChild(write);
  box.appendChild(all);
  box.appendChild(synopsis);
  container.appendChild(box);
  boxSearch.appendChild(h3);
  boxSearch.appendChild(Similar);
  container.appendChild(boxSearch);
  formationAnime.appendChild(container);
  header.after(formationAnime);
  if (none == 'display:none') {
    boxSearch.style.cssText = 'display:none;';
  }
}
function onclickAnime() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('nameAnime')) {
      localStorage.clear();
      localStorage.setItem(
        `nameAnime1`,
        JSON.stringify({
          name: `${event.target.innerText}`,
          index: event.target.getAttribute('data-index'),
        })
      );
      location.assign('anime_information.html');
    }
  });
}

function displayAnimeNotFound() {
  var section = document.createElement('section');
  section.classList.add('error');
  var container = document.createElement('div');
  container.classList.add('container', 'notFound', 'poppins-thin');
  var h1 = document.createElement('h1');
  var p = document.createElement('p');
  p.innerText = `Sorry, the anime you are looking for is not in our list.`;
  var a = document.createElement('a');
  a.setAttribute('href', 'index.html');
  a.innerText = `Return to the home page`;
  h1.innerHTML = `The anime does not exist`;

  container.appendChild(h1);
  container.appendChild(p);
  container.appendChild(a);
  section.appendChild(container);
  header.after(section);
}
