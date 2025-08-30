import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Google as GoogleIcon, Firebase as FirebaseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                mx: 'auto',
                mb: 3,
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
              }}
            >
              <FirebaseIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" component="h1" gutterBottom>
              Firebase Automation
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Programmatically create and configure Firebase projects
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              onClick={login}
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? 'Connecting...' : 'Sign in with Google'}
            </Button>

            <Typography variant="caption" color="text.secondary">
              By signing in, you agree to use this platform responsibly
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;