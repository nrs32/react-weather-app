
import GradientLinearProgress from '../gradient-linear-progress';
import type { TimeToTwilight } from '../../types/weather-types';
import { Box, Typography, useTheme, type SxProps } from '@mui/material';

type TwilightCountdownProps = {
	id: string;
	timeToTwilight: TimeToTwilight;
	gradientstops: [string, string]; // [startColor, endColor]
};

const TwilightCountdown: React.FC<TwilightCountdownProps> = ({ id, timeToTwilight, gradientstops }) => {
	const theme = useTheme();

	const countdownLabelStyles: SxProps = {
		color: theme.palette.text.primary,
		paddingBottom: '9px',
		marginTop: '-13px',
		textTransform: 'capitalize',
		textAlign: 'right',
		fontSize: '14px',
		fontWeight: 700,
		letterSpacing: theme.palette.text.secondaryLetterSpacing,
	};

	return (
		<Box display='flex' flexDirection='row' sx={{ padding: '10px 0' }} gap={1}>
			<Box display='flex' flexDirection='column' flex={1} >
				<Typography sx={countdownLabelStyles}>{timeToTwilight.label}</Typography>
				<GradientLinearProgress
					id={id}
					value={timeToTwilight.percent}
					gradientstops={gradientstops}
				/>
			</Box>
		</Box>
	);
};

export default TwilightCountdown;
