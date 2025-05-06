import { Card, type CardProps } from '@mui/material';

const WeatherCard: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <Card
      {...props}
      sx={(theme) => ({
        color: theme.palette.text.primary,
        margin: '20px',
        background: `linear-gradient(to bottom right, ${theme.palette.cardBg.main}, ${theme.palette.cardBg.dark})`,
      })}
    >
      {children}
    </Card>
  );
};

export default WeatherCard;