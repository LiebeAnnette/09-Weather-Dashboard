import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    console.log("a string", city)
    if (!city) {
        res.status(400).json({ error: 'City name is required' });
        return
    }
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  await HistoryService.addCity({ name: city, id: Date.now() });

  res.json(weatherData);
} catch (error) {
  console.error('Error fetching weather data:', error);
  res.status(500).json({ error: 'Failed to fetch weather data' });
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
} catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(+id);
    res.json({ message: 'City removed from history' });
} catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'Failed to delete city from history' });
}
});

export default router;
