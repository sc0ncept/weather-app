const app = document.querySelector('#app');
const apiKey = '859561cd1e0143b19182fe27c1b67328';
// let locationIP;

/**
 * Sanitize and encode all HTML in a user-submitted string
 * https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
const sanitizeHTML = function (str) {
  return str.replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
};

const renderWeather = function (weather) {
  app.innerHTML = `
    <h2>${sanitizeHTML(weather.city_name)}</h2>
    <p>Temp: ${sanitizeHTML(weather.app_temp.toString())} C | Pressure: ${sanitizeHTML(weather.pres.toString())} hPa | Sunrise: ${sanitizeHTML(weather.sunrise.toString())} - Sunset: ${sanitizeHTML(weather.sunset.toString())}</p>
    `
}

fetch('https://ipapi.co/json/')
  .then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (data) {

    return fetch(`https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&key=${apiKey}`);

  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (weatherData) {
    renderWeather(weatherData.data[0]);
  })
  .catch(function (error) {
    app.textContent = 'Unable to get weather data at this time.';
    console.warn(error)
  });