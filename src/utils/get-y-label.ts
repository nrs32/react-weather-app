const getTemperatureLabel = (degreesF: number): string => {
  return `${Math.round(degreesF)}°F`
}

export default getTemperatureLabel;