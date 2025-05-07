import { Card, type CardProps } from '@mui/material';

interface WeatherCardProps extends CardProps {
  height?: string;
  width?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ children, ...props }) => {
  return (
    <Card
      {...props}
      sx={(theme) => ({
        position: 'relative',
        color: theme.palette.text.primary,
        margin: '20px',
        width: props.width || 'fit-content',
        height: props.height,
        padding: '45px',
        background: `linear-gradient(to bottom right, ${theme.palette.cardBg.main}, ${theme.palette.cardBg.dark})`,
      })}
    >
      {children}
    </Card>
  );
};

export default WeatherCard;