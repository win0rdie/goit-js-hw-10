import './css/styles.css';
import { fetchCountries } from '../src/js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const liEl = document.querySelector('.country-info');
const bodyEl = document.body;

bodyEl.style.background = '';

//рендер списка країн
function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
            <img  src="${country.flags.svg}"/>
            <span style="
            align-items: center;
            vertical-align: middle">
                ${country.name}</span>
            </li>`;
    })
    .join('');
  ulEl.innerHTML = markup;
}

// рендер однієї країни
function renderCountryInfo([{ languages, name, capital, population, flags }]) {
  const lang = languages.map(({ name }) => name).join(', ');
  const markup = `<li>
            <img src="${flags.svg}"/>
            <span 
              style="font-size:32px"><b>${name}</b>
            </span>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Languages</b>: ${lang}</p>
            </li>`;
  liEl.innerHTML = markup;
}

// умова на введення і показ країн
function handleInputSpelling(e) {
  ulEl.innerHTML = '';
  liEl.innerHTML = '';
  if (e.target.value === '') {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length <= 10 && countries.length >= 2) {
        renderCountryList(countries);
        return;
      }
      return renderCountryInfo(countries);
    })
    .catch(e => Notify.failure(`Oops, there is no country with that name`));
}

//виклик події input разом з затримкою після вводу
inputEl.addEventListener(
  'input',
  debounce(handleInputSpelling, DEBOUNCE_DELAY)
);
