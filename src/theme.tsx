import { createTheme } from '@mui/material/styles';

// Override MUI Palette and PaletteOptions interfaces with our custom color keys
// Key types are defined as the same type as whatever Palette['primary'] or PaletteOptions['primary'] is
declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary'],
    pink: Palette['primary'],
    teal: Palette['primary'],
    blue: Palette['primary'],
    cardBg: Palette['primary'],
    lightGrey: Palette['primary'],
    bg: Palette['primary'],
  }

  interface TypeText {
    // Extends TypeText with this new property
    // Bc TypeText will be defined twice, and TS will merge the defs
    secondaryLetterSpacing?: string;
  }

  interface PaletteOptions {
    purple: PaletteOptions['primary'],
    pink: PaletteOptions['primary'],
    teal: PaletteOptions['primary'],
    blue: PaletteOptions['primary'],
    cardBg: PaletteOptions['primary'],
    lightGrey: PaletteOptions['primary'],
    bg: PaletteOptions['primary'],
  }
}

const theme = createTheme({
  palette: {
    purple: {
      main: '#5D6CE9',
    },
    pink: {
      main: '#C332DF',
      light: '#E3A5F0'
    },
    teal: {
      main: '#2FF3E0',
    },
    blue: {
      main: '#35B5D4',
    },
    cardBg: {
      main: '#272934',
      dark: '#161923',
    },
    lightGrey: {
      main:'#6c6f7e'
    },
    bg: {
      main: '#121621',
    },
    text: {
      primary: '#E0E1E2',
      secondary: '#3A3D4B',
      secondaryLetterSpacing: '.75px',
    }
  },
});

export default theme;