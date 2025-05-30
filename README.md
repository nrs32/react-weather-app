# Weather App Notes

### Scaffolding:
`npm create vite@latest react-weather-app -- --template react-ts`

`npm install`

`npm run dev`

`npm install sass-embedded` for scss.

### Weather API
- [Open-meteo](https://open-meteo.com/)
- Current weather and forcast free
- 10,000 requests per day
- [npm pkg](https://www.npmjs.com/package/openmeteo)
- `npm install openmeteo`

### Weather Icons
- [Meteocons by Basmilius](https://basmilius.github.io/weather-icons/index-line.html)
- [Animated SVGs](https://github.com/basmilius/weather-icons/tree/dev/production/line/svg)

I used [download directory](https://download-directory.github.io) which lets you paste the url of a github directory and download it

### GSAP for animation 
- [GSAP](https://gsap.com/)
- [Docs](https://gsap.com/docs/v3/)
- [Scroll Trigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Timeline](https://gsap.com/docs/v3/GSAP/Timeline/)

### React Query
`npm install @tanstack/react-query`

`npm i -D @tanstack/eslint-plugin-query`

[Query Docs](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

### MUI
- `npm install @mui/material @emotion/react @emotion/styled` for MUI and Emotion
- `npm install @fontsource/roboto` to use Roboto as the default font, if wanted.
- [Customization](https://mui.com/material-ui/customization/how-to-customize/)
- [Theming](https://mui.com/material-ui/customization/theme-components/)

The `sx` prop is good for general styling stuff.

And `styled()` can be used for resuable styles for components (like styled-components).

Emotion's css can be used for non-MUI components with the className prop.

Examples:
Using sx prop on MUI button:
```tsx
import { Button } from '@mui/material';

function SxStyledButton() {
  return (
    <Button
      sx={(theme) => ({
        backgroundColor: theme.palette.purple.main,
        color: theme.palette.common.white,
        padding: '10px 20px',
        '&:hover': {
          backgroundColor: theme.palette.pink.main,
        },
      })}
    >
      SX Button
    </Button>
  );
}

export default SxStyledButton;
```

Using `styled()` on MUI button:
```tsx
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.blue.main,
  color: '#fff',
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: theme.palette.teal.main,
  },
}));

function MUIStyledButton() {
  return <CustomButton>MUI Styled Button</CustomButton>;
}

export default MUIStyledButton;
```

### Emotion
`npm install @emotion/css`

- [Emotion](https://emotion.sh/docs/introduction)

Make emotion extend MUI's theme (emotion.d.ts)
```tsx
import '@emotion/react';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}
```

Emotion styled div with css
```tsx
/** @jsxImportSource @emotion/react */
import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';

function EmotionButton() {
  const theme = useTheme();

  const buttonStyles = css`
    background-color: ${theme.palette.pink.main};
    color: ${theme.palette.common.white};
    padding: 10px 20px;

    &:hover {
      background-color: ${theme.palette.purple.main};
    }
  `;

  return <div className={buttonStyles}>Emotion Div</div>;
}

export default EmotionButton;
```

Emotion styled div with `styled()`
```tsx
/** @jsxImportSource @emotion/react */
import { styled } from '@mui/material/styles';

const EmotionStyledButton = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.teal.main,
  color: theme.palette.common.white,
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: theme.palette.blue.main,
  },
}));

export default EmotionStyledButton;
```

# MUI Icons
`npm install @mui/icons-material` for MUI SVG icons

- [Useage/Docs](https://mui.com/material-ui/icons/#material-svg-icons)
- [Library](https://fonts.google.com/icons?icon.set=Material+Icons)

Import Example
```tsx
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';

// Use in code as
<AccessAlarmIcon />
```
Just append themename for icon style other than default, e.g. Twotone theme is exported as `@mui/icons-material/DeleteTwoTone`;

___
___
___
___
___
___
# Generated README info:
## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
