import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import AppTabs from '../components/layout/AppTabs';
import BottomNav from '../components/layout/BottomNav';
import ShellFrame from '../components/layout/ShellFrame';
import { BridgeScreen } from '../screens/BridgeScreen';
import { CreationScreen } from '../screens/CreationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ProblemScreen } from '../screens/ProblemScreen';
import { QuietTimeScreen } from '../screens/QuietTimeScreen';
import { SalvationAssuranceScreen } from '../screens/SalvationAssuranceScreen';
import { ROUTE_REGISTRY } from './routes';

const AppLayout: React.FC = () => (
  <ShellFrame>
    <AppTabs />
    <div className="w-full flex-1 overflow-y-auto">
      <Outlet />
    </div>
    <BottomNav />
  </ShellFrame>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_REGISTRY.HOME,
        element: <HomeScreen />,
      },
      {
        path: ROUTE_REGISTRY.JOURNEY,
        element: <JourneyScreen />,
      },
      {
        path: ROUTE_REGISTRY.LIBRARY,
        element: <LibraryScreen />,
      },
      {
        path: ROUTE_REGISTRY.CREATION,
        element: <CreationScreen />,
      },
      {
        path: ROUTE_REGISTRY.PROBLEM,
        element: <ProblemScreen />,
      },
      {
        path: ROUTE_REGISTRY.BRIDGE,
        element: <BridgeScreen />,
      },
      {
        path: ROUTE_REGISTRY.SALVATION_ASSURANCE,
        element: <SalvationAssuranceScreen />,
      },
      {
        path: ROUTE_REGISTRY.QUIET_TIME,
        element: <QuietTimeScreen />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTE_REGISTRY.JOURNEY} replace />,
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
