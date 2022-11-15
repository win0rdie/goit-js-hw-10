import './css/styles.css';
import { fetchCountries } from '../src/js/fetchCountries';
import debounce from 'lodash.debounce';

// import { example } from './js/examp';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const liEl = document.querySelector('.country-info');

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
            <p><b>Name</b>: ${country.name}</p>
            <img width="100px" heigth="100px" src="${country.flags.svg}"/>
            </li>`;
    })
    .join('');
  ulEl.innerHTML = markup;
}

function renderCountryInfo(countries) {
  let lang = [];
  for (const country of countries) {
    country.languages.map(el => {
      lang.push(el.name);
    });
  }
  const markup = countries
    .map(country => {
      return `<li>
            <p><b>Name</b>: ${country.name}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <img  width="200px" heigth="200px" src="${country.flags.svg}"/>
            <p><b>Languages</b>: ${lang.join(', ')}</p>
            </li>`;
    })
    .join('');
  liEl.innerHTML = markup;
}

function handleInputSpelling(e) {
  ulEl.innerHTML = '';
  liEl.innerHTML = '';
  if (e.target.value === '') {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(countries => {
      if (countries.length > 10) {
        console.log(
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
    .catch(error => console.log(error));
}

//виклик події input разом з затримкою після вводу
inputEl.addEventListener(
  'input',
  debounce(handleInputSpelling, DEBOUNCE_DELAY)
);
