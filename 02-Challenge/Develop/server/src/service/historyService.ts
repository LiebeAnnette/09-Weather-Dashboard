import { promises as fs } from "fs";

// TODO: Define a City class with name and id properties

class City {
  id: number;
  name: string;

  constructor(name:string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private filePath: string;

  constructor() {
    this.filePath = "searchHistory.json";
  }
  
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Error reading file:", error);
      return []; 
    }
  }
  
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }
  
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return await this.read();
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(city: City): Promise<void> {
    const cities = await this.getCities();
    cities.push(city);
    await this.write(cities);
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  
  public async removeCity(id: number): Promise<void> {
    let cities = await this.getCities();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
