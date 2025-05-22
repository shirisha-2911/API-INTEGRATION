document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cityInput = document.getElementById('city');
  const weatherResult = document.getElementById('weatherResult');
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.innerHTML = '<div class="loading-spinner"></div><p>Loading weather data...</p>';
  
  // Insert loading element after the button
  document.querySelector('button').insertAdjacentElement('afterend', loadingElement);

  // Weather API Configuration
  const apiKey = 'df668e46e911ebf5165008f9aceea6a2'; // Replace with your actual OpenWeatherMap API key
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Get Weather Function
  async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
      showError('Please enter a city name');
      return;
    }

    try {
      // Show loading state
      loadingElement.style.display = 'block';
      weatherResult.innerHTML = '';
      
      const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        throw new Error(data.message || 'City not found');
      }
    } catch (error) {
      showError(error.message);
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  // Display Weather Data
  function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    const iconCode = weather[0].icon;
    
    weatherResult.innerHTML = `
      <h2>${name}, ${sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon">
      <div class="weather-info">
        <p><strong>Temperature:</strong> ${main.temp} °C</p>
        <p><strong>Feels like:</strong> ${main.feels_like} °C</p>
        <p><strong>Conditions:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind:</strong> ${wind.speed} m/s</p>
        <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
      </div>
    `;
  }

  // Show Error Message
  function showError(message) {
    weatherResult.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }

  // Event Listeners
  document.querySelector('button').addEventListener('click', getWeather);
  
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  });
});