// app/WelcomePage.js
import { Box, Button, Typography } from '@mui/material';

const WelcomePage = ({ onStart }) => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#D1FFBD"
      color = "#F88379"
  
    >
      <Typography variant="h2" gutterBottom>Welcome to the Inventory App</Typography>
      <Button variant="contained"  onClick={onStart}
        sx={{ backgroundColor: '#F88379', '&:hover': { backgroundColor: '#D1FFBD' } }}
      >Start</Button>
    </Box>
  );
};

export default WelcomePage;
