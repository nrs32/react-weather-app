const getHumidityLabel = (humidity: number): string  => {
  const percent = Math.round(humidity);
  return `${percent > 100 || percent < 0 ? 'N/A' : `${percent}%`}`;
}

export default getHumidityLabel;