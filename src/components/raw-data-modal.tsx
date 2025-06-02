import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import type { Theme } from '@mui/material';
import ThemedButton from './themed-button';
import { WeatherContext } from '../App';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RawDataModal = () => {
  const weatherData = React.useContext(WeatherContext)!;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonSx = (theme: Theme) => ({
    backgroundColor: theme.palette.bg.main,
    color: theme.palette.common.white,
    border: `2px solid ${theme.palette.cardBg.main}`,
    padding: '6px 16px',
    position: 'relative',
    bottom: '9px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.cardBg.main,
    },
  });

  return (
    <React.Fragment>
      <ThemedButton onClick={handleClickOpen} label='Raw Data'/>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="raw-data-dialog"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: theme => theme.palette.bg.main,
            },
          },
        }}
      >
        <DialogTitle>Raw Weather Data</DialogTitle>
        <DialogContent>
          <pre className='raw-data'>{JSON.stringify(weatherData, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={(theme) => ({
              ...buttonSx(theme),
              width: '100%',
            })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default RawDataModal;