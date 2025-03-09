import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <Grid>
      <Box sx={{ml: 1, mr: 1, mb: 4}}>

        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Terms and Conditions
        </Typography>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using the FoodBank platform, you agree to be bound by these Terms and Conditions.
            These terms govern your use of our services and platform features.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. User Responsibilities
          </Typography>
          <Typography paragraph>
            Users must provide accurate information when registering and making donations.
            All food donations must comply with food safety standards and regulations.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Food Safety and Quality
          </Typography>
          <Typography paragraph>
            Donors must ensure that all food items are safe for consumption and properly stored.
            Items must be within their expiration dates and handled according to food safety guidelines.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Privacy and Data Protection
          </Typography>
          <Typography paragraph>
            We collect and process personal information in accordance with our Privacy Policy.
            User data is protected and will not be shared with unauthorized third parties.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Platform Usage
          </Typography>
          <Typography paragraph>
            Users agree not to misuse the platform or interfere with its operation.
            We reserve the right to suspend or terminate accounts that violate these terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Liability
          </Typography>
          <Typography paragraph>
            The platform is provided as is without warranties of any kind.
            Users assume responsibility for their interactions and transactions on the platform.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right to modify these terms at any time.
            Users will be notified of significant changes to these terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms and Conditions, please contact us.
          </Typography>
        </Paper>

        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mt: 4, mb: 2 }}
        >
          Go Back
        </Button>
        
      </Box>
    </Grid>
);
};

export default TermsAndConditions;