import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const WeatherCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  const temp = data.main.temp.toFixed(0);
  const description = data.weather[0].description;
  const windSpeed = data.wind.speed.toFixed(1);
  const windDirection = data.wind.deg;
  const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

  return (
    <Card className='!m-4 shadow'>
      <CardContent>
        <Typography variant="h5" component="h2">
          {day} at {time}
        </Typography>
        <Typography variant="h4">
          {temp}°C
        </Typography>
        <img src={iconUrl} alt="weather icon" />
        <Typography variant="body1">
          {description}
        </Typography>
        <Typography variant="body1">
          Wind: {windSpeed} m/s, {windDirection}°
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WeatherCard;
