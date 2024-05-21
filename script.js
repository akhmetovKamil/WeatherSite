'use strict';

const API_KEY = 'd8f6edb967aa4d93a1b173348242005';
const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=7&lang=ru&q=`;
const curWeatherEl = document.getElementsByClassName('cur-weather')[0];
const curWeatherTemp = curWeatherEl.getElementsByClassName('temp')[0];
const curDopWeather = curWeatherEl.getElementsByClassName('dop-weather')[0];
const curWeatherState = document.getElementsByClassName('weather-state')[0];
const curAside = document.getElementsByTagName('aside')[0];
const curNav = document.getElementsByTagName('nav')[0];
const curCityName = document.getElementById('city-name');
const lightButton = document.getElementById('light');
const darkButton = document.getElementById('dark');
const theme = localStorage.getItem('theme');

if (!theme) localStorage.setItem('theme', 'light');

if (theme == 'light') {
  lightButton.disabled = true;
  document.body.style.setProperty('--gray-200', '#f4f4f4');
  document.body.style.setProperty('--gray-250', '#d1d1d1');
  document.body.style.setProperty('--gray-400', '#c7c7c7');
  document.body.style.setProperty('--gray-450', '#aaaaaa');
  document.body.style.setProperty('--gray-500', '#5e5e5e');
  document.body.style.setProperty('--gray-700', '#3e3e3e');
} else {
  darkButton.disabled = true;
  document.body.style.setProperty('--gray-200', '#3e3e3e');
  document.body.style.setProperty('--gray-250', '#5e5e5e');
  document.body.style.setProperty('--gray-400', '#aaaaaa');
  document.body.style.setProperty('--gray-450', '#c7c7c7');
  document.body.style.setProperty('--gray-500', '#d1d1d1');
  document.body.style.setProperty('--gray-700', '#f4f4f4');
}

const changeTheme = () => {
  if (theme == 'light') localStorage.setItem('theme', 'dark');
  else localStorage.setItem('theme', 'light');
  window.location.reload();
};

const urlParams = new URLSearchParams(window.location.search.substring(1));

const search = () => {
  const city = document.getElementById('city-input').value;
  window.location.replace(
    `${location.protocol}//${location.host}${location.pathname}?location=${city}`
  );
};
document.getElementsByClassName('search-button')[0].onclick = search;

async function getWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении погоды:', error);
  }
}

// Date
document.getElementById('date').innerHTML = new Date().toLocaleString('ru-RU', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

const makeDayContainers = (parent, data) => {
  data.forEach(el => {
    const d = document.createElement('div');
    const date = new Date(0);
    date.setUTCSeconds(el.date_epoch);
    d.classList.add('weather-sm-card');
    if (new Date().getDay() == date.getDay()) d.classList.add('active-sm-card');
    d.innerHTML = `<h4>${date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })}</h4><div class='state'><p>${Math.round(
      el.day.avgtemp_c
    )}°</p><img src='https:${el.day.condition.icon}' alt='state'/></div>`;
    parent.appendChild(d);
  });
};
const makeHourContainers = (parent, data) => {
  data.forEach(el => {
    const d = document.createElement('div');
    const date = new Date(0);
    date.setUTCSeconds(el.time_epoch);
    d.classList.add('weather-sm-card');
    if (new Date().getHours() == date.getHours())
      d.classList.add('active-sm-card');
    d.innerHTML = `<h4>${el.time.slice(
      11
    )}</h4><div class='state'><p>${Math.round(el.temp_c)}°</p><img src='https:${
      el.condition.icon
    }' alt='state'/></div>`;
    parent.appendChild(d);
  });
};

let city = urlParams.get('location');
if (!city) city = 'Москва';
getWeather(city)
  .then(data => {
    console.log(data);
    makeDayContainers(curAside, data.forecast.forecastday);
    makeHourContainers(curNav, data.forecast.forecastday[0].hour);
    curCityName.innerHTML = data.location.name;
    curWeatherTemp.innerHTML = `${Math.round(data.current.temp_c)}°`;
    curDopWeather.innerHTML = `<h3>${Math.round(
      data.current.wind_kph / 3.6
    )}  м/с</h3><h3>${data.current.humidity} %</h3>`;
    curWeatherState.innerHTML = `<h2>${data.current.condition.text}</h2><img src=https:${data.current.condition.icon} alt='cur-state-img' style='width: 8vw'/>`;
    document
      .getElementsByClassName('active-sm-card')[0]
      .scrollIntoViewIfNeeded();
  })
  .catch(error => console.error(error));

document.getElementById('year').innerHTML += '2024';
