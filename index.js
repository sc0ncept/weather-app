const getTheWeather = function (options) {

  const defaults = {
    apiKey: null,
    selector: '#app',
    convertTemp: false,
    showIcon: false,
    noWeather: 'Unable to get weather data at this time.',
    description: `It is currently {{temp}} degrees and {{description}} in {{city}}.`,
  }

  const settings = Object.assign(defaults, options);

  const app = document.querySelector(settings.selector);

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

  const celsToFahrenheit = function (temp) {
    if (settings.convertTemp) {
      return parseFloat((temp * 9 / 5) + 32);
    }
    return temp;
  }

  const renderNoWeather = function () {
    app.textContent = settings.noWeather;
  }

  const getIcon = function (weather) {

    if (!settings.showIcon) {
      return '';
    }
    let html = `<p><img src="https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png" alt="${weather.weather.description}"></img></p>`;
    return html;
  }

  const getDescription = function (weather) {

    return settings.description
      .replace('{{temp}}', sanitizeHTML(celsToFahrenheit(weather.temp).toString()))
      .replace('{{description}}', sanitizeHTML(weather.weather.description).toLowerCase())
      .replace('{{city}}', sanitizeHTML(weather.city_name.toString()))
  }

  const renderWeather = function (weather) {

    app.innerHTML = `
      <h2>Current weather in ${sanitizeHTML(weather.city_name)}</h2>
      ${getIcon(weather)}
      <p>${getDescription(weather)}</p>
      <p>Sunrise: ${sanitizeHTML(weather.sunrise.toString())} | Sunset: ${sanitizeHTML(weather.sunset.toString())}</p>
      `
  }

  if (!settings.apiKey) {
    console.warn('Please provide an API key.');
    renderNoWeather();
    return;
  }


  fetch('https://ipapi.co/json/')
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function (data) {

      return fetch(`https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&key=${settings.apiKey}`);

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
      renderNoWeather();
      console.warn(error)
    });
}

getTheWeather({
  apiKey: '859561cd1e0143b19182fe27c1b67328',
  showIcon: true,
});
