
import { Box, Typography, useTheme, type SxProps } from '@mui/material';

type TwilightTimeDisplayProps = {
	icon: string;
	iconAlt: string;
	label: string;
};

const TwilightTimeDisplay: React.FC<TwilightTimeDisplayProps> = ({ icon, iconAlt, label }) => {
	const theme = useTheme();

	const twilightTimeLabelStyles: SxProps = {
		color: theme.palette.text.primary,
		fontSize: '18px',
		fontWeight: 700,
		letterSpacing: theme.palette.text.secondaryLetterSpacing
	};

	return (
		<Box display='flex' flexDirection='column' alignItems='center'>
			<img src={icon} alt={iconAlt} width={140} height={140} />
			<Typography sx={{ ...twilightTimeLabelStyles, marginTop: '-17px' }}>{label}</Typography>
		</Box>
	);
};

export default TwilightTimeDisplay;
