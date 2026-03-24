import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import TrafficChart from '../components/TrafficChart';
import Statistics from '../components/Statistics';
import { useTrafficData } from '../hooks/useTrafficData';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Index: React.FC = () => {
  const { trafficData, loading, error } = useTrafficData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout>
        <TrafficChart data={trafficData} />
        <Statistics data={trafficData} />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default Index;
