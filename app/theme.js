'use client';

import {createTheme} from '@mui/material/styles';

// define custom theme
const theme = createTheme({
    palette: {
      primary: {
        main: "#003B8C",
      },
      secondary: {
        main: "#F8DB39",
      }
    },
    typography: {
      fontFamily: 'Poppins, Arial, sans-serif',
    }
});

export default theme;