import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  List as ListIcon,
  Database as DatabaseIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasFirebaseAccess } = useAuth();

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new Firebase project with automated setup',
      icon: <AddIcon />,
      color: 'primary',
      action: () => navigate('/projects/create'),
    },
    {
      title: 'View Projects',
      description: 'Manage your existing Firebase projects',
      icon: <ListIcon />,
      color: 'secondary',
      action: () => navigate('/projects'),
    },
  ];

  const features = [
    {
      title: 'Real-time Database',
      description: 'Automatically create and configure RTDB with security rules',
      icon: <DatabaseIcon />,
      color: '#ff9800',
    },
    {
      title: 'Firestore',
      description: 'Set up Firestore with custom rules and collections',
      icon: <StorageIcon />,
      color: '#4caf50',
    },
    {
      title: 'Security Rules',
      description: 'Apply predefined or custom security rule templates',
      icon: <SecurityIcon />,
      color: '#f44336',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Automate your Firebase project creation and configuration
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={hasFirebaseAccess ? 'Firebase Access: Active' : 'Firebase Access: Limited'}
              color={hasFirebaseAccess ? 'success' : 'warning'}
              size="small"
            />
            <Chip
              label={`Account: ${user?.email}`}
              variant="outlined"
              size="small"
            />
          </Box>

          {!hasFirebaseAccess && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'warning.light',
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="body2" color="warning.dark">
                <strong>Note:</strong> Your account has limited Firebase access. Some features may be restricted.
                Please ensure you have the necessary permissions in Google Cloud Console.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={action.action}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        bgcolor: `${action.color}.main`,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6">{action.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Button variant="outlined" color={action.color as any}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Overview */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Platform Features
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        bgcolor: feature.color,
                        color: 'white',
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6">{feature.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Getting Started */}
        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Follow these steps to create your first automated Firebase project:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2">
                Click "Create New Project" to start the automated setup
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Choose your project configuration and database options
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Let the platform handle Firebase setup, RTDB creation, and security rules
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Access your fully configured Firebase project
              </Typography>
            </li>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default DashboardPage;