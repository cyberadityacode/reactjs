import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudQueue as CloudIcon,
  Firebase as FirebaseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiService, Project } from '../services/api';
import toast from 'react-hot-toast';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseProjects, setFirebaseProjects] = useState<Project[]>([]);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const [fbProjects, gcpProjects] = await Promise.all([
        apiService.listFirebaseProjects(),
        apiService.listCloudProjects(),
      ]);

      setFirebaseProjects(fbProjects);
      setCloudProjects(gcpProjects);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      setError(error.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Your Projects</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/create')}
          >
            Create New Project
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Firebase Projects */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Firebase Projects ({firebaseProjects.length})
        </Typography>

        {firebaseProjects.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            No Firebase projects found. Create your first project to get started!
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {firebaseProjects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.projectId}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FirebaseIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" noWrap>
                        {project.displayName || project.projectId}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Project ID: {project.projectId}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={project.state || 'Active'}
                        color="success"
                        size="small"
                      />
                      <Chip
                        label="Firebase"
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Google Cloud Projects */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Google Cloud Projects ({cloudProjects.length})
        </Typography>

        {cloudProjects.length === 0 ? (
          <Alert severity="info">
            No Google Cloud projects found. You may need additional permissions.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {cloudProjects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.projectId}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CloudIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="h6" noWrap>
                        {project.name || project.projectId}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Project ID: {project.projectId}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={project.lifecycleState || 'Active'}
                        color={project.lifecycleState === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip
                        label="Google Cloud"
                        color="default"
                        size="small"
                      />
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        // Add Firebase to this project
                        toast.success('Feature coming soon!');
                      }}
                    >
                      Add Firebase
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {firebaseProjects.length === 0 && cloudProjects.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              mt: 8,
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <FirebaseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No projects found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first Firebase project to get started with automated configuration
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects/create')}
            >
              Create Your First Project
            </Button>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default ProjectsPage;