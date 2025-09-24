import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Homepage() {
  return (
    <Box sx={{p: 4}}>
      <h1>Welcome to Project Rigs</h1>
      <p>This is the homepage.</p>
      <Button variant="contained" color="primary">Example Button</Button>
    </Box>
  )
}