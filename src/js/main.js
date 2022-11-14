'use strict';

// QUERYSELECTOR

const charactersList = document.querySelector('.js-characters-list');
const searchBtn = document.querySelector('.js-search-btn');
const input = document.querySelector('.js-input');
const sectionFavourites = document.querySelector('.js-section-favourites');
const favouritesList = document.querySelector('.js-favourites-list');

// VARIABLES GLOBALES -> VARIABLES CON DATOS DE LA APP

let allCharacters = [];
let favouriteCharacters = [];

// FUNCIONES

/* 2.1 INICIO: Función que recoge los personajes del servidor y los pinta siguiendo el método de innerHTML

function renderOneCharacter(oneCharacter){
  return `<li class="characters">
  <article class="characters__card">
    <img class="characters__card--img" src="${oneCharacter.img}" alt="${oneCharacter.name}">
    <h2 class="characters__card--name"> ${oneCharacter.name} </h2>
    <p class="characters__card--text"> ${oneCharacter.status} </p>
  </article>
  </li>`;
}

function renderAllCharacters(){
  let listHtml = '';
  for (let i = 0; i < allCharacters.length; i++){
    listHtml += renderOneCharacter(allCharacters[i]);
  }
  charactersList.innerHTML = listHtml;
} */

/* 2.2 INICIO: Función que recoge los personajes del servidor y los pinta manipulando de forma avanzada el DOM */

function renderOneCharacter(oneCharacter){
  const liElement = document.createElement('li');
  liElement.classList.add('characters');
  liElement.classList.add('js-characters-card');
  liElement.setAttribute('id', `${oneCharacter.char_id}`);
  const articleElement = document.createElement('article');
  articleElement.classList.add('characters__card');
  const imgElement = document.createElement('img');
  imgElement.classList.add('characters__card--img');
  imgElement.setAttribute('src', `${oneCharacter.img}`);
  imgElement.setAttribute('alt', `${oneCharacter.name}`);
  const titleElement = document.createElement('h2');
  titleElement.classList.add('characters__card--name');
  const titleElementContent = document.createTextNode(`${oneCharacter.name}`);
  titleElement.appendChild(titleElementContent);
  const textElement = document.createElement('p');
  textElement.classList.add('characters__card--text');
  const textElementContent = document.createTextNode(`${oneCharacter.status}`);
  textElement.appendChild(textElementContent);
  liElement.appendChild(articleElement);
  articleElement.appendChild(imgElement);
  articleElement.appendChild(titleElement);
  articleElement.appendChild(textElement);
  return liElement;
}

function renderAllCharacters(){
  charactersList.innerHTML = '';
  for (let i = 0; i < allCharacters.length; i++){
    charactersList.appendChild(renderOneCharacter(allCharacters[i]));
  }
  addListeners();
}

/* 3.1 BÚSQUEDA: Función que se activa con el evento click del botón, recoge el valor del input, se lo pasa a la función de filtrar y esta se lo pasa a la de renderizar el personaje filtrado */

function filterCharacters(value){
  return allCharacters.filter((eachCharacter) => eachCharacter.name.toLowerCase().includes(value));
}

function renderFilterCharacters(filteredCharacter){
  charactersList.innerHTML = '';
  for (let i = 0; i < filteredCharacter.length; i++){
    charactersList.appendChild(renderOneCharacter(filteredCharacter[i]));
  }
}

function handleClick(event) {
  event.preventDefault();
  const valueInput = input.value.toLowerCase();
  renderFilterCharacters(filterCharacters(valueInput));
}

/* 3.2 BÚSQUEDA: Función que realiza una petición al servidor con el valor del input y lo pinta en la página manipulando de forma avanzada el DOM

function handleClick(event){
  event.preventDefault();
  const valueInput = input.value.toLowerCase();
  let serverUrlFilter = `https://www.breakingbadapi.com/api/characters?name=${valueInput}`;
  fetch(serverUrlFilter, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
    .then((response) => response.json())
    .then((data) => {
      let filteredCharacters = data;
      renderFilteredCharacters(filteredCharacters);
    });
}

function renderFilteredCharacters(filteredCharacters){
  charactersList.innerHTML = '';
  for (let i = 0; i < filteredCharacters.length; i++){
    charactersList.appendChild(renderOneFilteredCharacter(filteredCharacters[i]));
  }
}

function renderOneFilteredCharacter(filteredCharacter){
  const liElement = document.createElement('li');
  liElement.classList.add('characters');
  const articleElement = document.createElement('article');
  articleElement.classList.add('characters__card');
  const imgElement = document.createElement('img');
  imgElement.classList.add('characters__card--img');
  imgElement.setAttribute('src', `${filteredCharacter.img}`);
  imgElement.setAttribute('alt', `${filteredCharacter.name}`);
  const titleElement = document.createElement('h2');
  titleElement.classList.add('characters__card--name');
  const titleElementContent = document.createTextNode(`${filteredCharacter.name}`);
  titleElement.appendChild(titleElementContent);
  const textElement = document.createElement('p');
  textElement.classList.add('characters__card--text');
  const textElementContent = document.createTextNode(`${filteredCharacter.status}`);
  textElement.appendChild(textElementContent);
  liElement.appendChild(articleElement);
  articleElement.appendChild(imgElement);
  articleElement.appendChild(titleElement);
  articleElement.appendChild(textElement);
  return liElement;
} */

/* 4. FAVORITOS: */

function addListeners(){
  const allCards = document.querySelectorAll('.js-characters-card');
  for (const eachCard of allCards){
    eachCard.addEventListener('click', handleClickCard);
  }
}

function renderFavourites(){
  sectionFavourites.style = 'display: none; display: block;';
  favouritesList.innerHTML = '';
  for (let i = 0; i < favouriteCharacters.length; i++){
    favouritesList.appendChild(renderOneCharacter(favouriteCharacters[i]));
  }
  addListeners();
}

function handleClickCard(event){
  event.currentTarget.classList.toggle('selected');
  const selectedCharacter = allCharacters.find((eachCharacterObj) => eachCharacterObj.char_id === parseInt(event.currentTarget.id));
  const favouriteCharacterIndex = favouriteCharacters.findIndex((eachCharacterObj) => eachCharacterObj.char_id === parseInt(event.currentTarget.id));
  if (favouriteCharacterIndex === -1){
    favouriteCharacters.push(selectedCharacter);
  } else {
    favouriteCharacters.splice(favouriteCharacterIndex, 1);
  }
  localStorage.setItem('favourites', JSON.stringify(favouriteCharacters));
  renderFavourites();
}

const savedFavourites = JSON.parse(localStorage.getItem('favourites'));
if (savedFavourites !== null){
  favouriteCharacters = savedFavourites;
  renderFavourites();
}

// EVENTOS

searchBtn.addEventListener('click', handleClick);

// PETICIONES AL SERVIDOR

const serverUrl = 'https://www.breakingbadapi.com/api/characters';

fetch(serverUrl, {
  method: 'GET',
  headers: {'Content-Type': 'application/json'},
})
  .then((response) => response.json())
  .then((data) => {
    allCharacters = data;
    renderAllCharacters();
  })
  .catch(error => console.log(error));