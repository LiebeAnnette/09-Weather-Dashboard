import dotenv from 'dotenv';
import dayjs, {type Dayjs} from 'dayjs';
dotenv.config();

// X TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  name: string;
}
// TODO: Define a class for the Weather object
  class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    cityName: string;
    date: Dayjs | string;
  
    constructor(temperature: number, description: string, humidity: number, windSpeed: number, cityName: string, date: Dayjs | string) {
      this.temperature = temperature;
      this.description = description;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
      this.cityName = cityName;
      this.date = date;
    }
  }

// TODO: Complete the WeatherService class
class WeatherService {
  // X TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private APIKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.APIKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response: Coordinates[] = await fetch(query).then(
        (res) => res.json()
      );
      return await response[0];

    } catch(error){
      console.log(error);
      throw error;
    }
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
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
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
  process.env.API_BASE_URL || "",
  process.env.API_KEY || "",
  "New York" // Default city
);