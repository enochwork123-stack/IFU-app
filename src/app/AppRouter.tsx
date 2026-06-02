import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { AreYouSavedScreen } from '../screens/AreYouSavedScreen';
import { AssuranceFaithVsSuperstitionScreen } from '../screens/AssuranceFaithVsSuperstitionScreen';
import BottomNav from '../components/layout/BottomNav';
import ShellFrame from '../components/layout/ShellFrame';
import { BridgeScreen } from '../screens/BridgeScreen';
import { CreationScreen } from '../screens/CreationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import {
  PrayerAssuranceScreen,
  PrayerHowDoWePrayScreen,
  PrayerPourOutYourHeartScreen,
} from '../screens/PrayerAssuranceScreen';
import { ProblemScreen } from '../screens/ProblemScreen';
import { QuietTimeScreen } from '../screens/QuietTimeScreen';
import { QuietTimeNewToYouScreen } from '../screens/QuietTimeNewToYouScreen';
import { SalvationAssuranceScreen } from '../screens/SalvationAssuranceScreen';
import { SevenMinutesWithGodScreen } from '../screens/SevenMinutesWithGodScreen';
import { ROUTE_REGISTRY } from './routes';

const AppLayout: React.FC = () => (
  <ShellFrame>
    <main className="scrollbar-none w-full flex-1 overflow-y-auto">
      <Outlet />
    </main>
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
        path: ROUTE_REGISTRY.SALVATION_ASSURANCE_ARE_YOU_SAVED,
        element: <AreYouSavedScreen />,
      },
      {
        path: ROUTE_REGISTRY.SALVATION_ASSURANCE_FAITH_VS_SUPERSTITION,
        element: <AssuranceFaithVsSuperstitionScreen />,
      },
      {
        path: ROUTE_REGISTRY.QUIET_TIME,
        element: <QuietTimeScreen />,
      },
      {
        path: ROUTE_REGISTRY.QUIET_TIME_SEVEN_MINUTES_WITH_GOD,
        element: <SevenMinutesWithGodScreen />,
      },
      {
        path: ROUTE_REGISTRY.QUIET_TIME_NEW_TO_YOU,
        element: <QuietTimeNewToYouScreen />,
      },
      {
        path: ROUTE_REGISTRY.PRAYER_ASSURANCE,
        element: <PrayerAssuranceScreen />,
      },
      {
        path: ROUTE_REGISTRY.PRAYER_ASSURANCE_POUR_OUT_YOUR_HEART,
        element: <PrayerPourOutYourHeartScreen />,
      },
      {
        path: ROUTE_REGISTRY.PRAYER_ASSURANCE_HOW_DO_WE_PRAY,
        element: <PrayerHowDoWePrayScreen />,
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
