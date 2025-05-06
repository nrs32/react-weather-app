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
