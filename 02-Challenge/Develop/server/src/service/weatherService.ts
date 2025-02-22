import dotenv from 'dotenv';
dotenv.config();

// X TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
  class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
  
    constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
      this.temperature = temperature;
      this.description = description;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
    }
  }
  
// TODO: Complete the WeatherService class
class WeatherService {
  // X TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  APIKey: string;
  cityName: string;

  constructor(baseURL:string, APIkey: string, cityName: string) {
    this.baseURL = baseURL;
    this.APIKey = APIkey;
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(this.buildGeocodeQuery());
  return await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    return {
      latitude: locationData[0].lat,
      longitude: locationData[0].lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
      return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`;
    }
  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`;  
}
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
  return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
  return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.main.humidity,
      response.wind.speed
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map(data => {
      const isSameAsCurrent = data.main.temp === currentWeather.temperature;
      return new Weather(
        data.main.temp,
        data.weather[0].description + (isSameAsCurrent ? " (Current)" : ""),
        data.main.humidity,
        data.wind.speed
      );
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string):Promise<{ current: Weather; forecast: Weather[] }> {
    this.cityName = city;
  const coordinates = await this.fetchAndDestructureLocationData();
  const weatherResponse = await this.fetchWeatherData(coordinates);

  const currentWeather = this.parseCurrentWeather(weatherResponse);
  const forecastArray = this.buildForecastArray(currentWeather, weatherResponse.forecast || []);

  return { current: currentWeather, forecast: forecastArray };

  }
}

export default new WeatherService(
  process.env.BASE_URL || "",
  process.env.API_KEY || "",
  "New York" // Default city
);