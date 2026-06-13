import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { AreYouSavedScreen } from '../screens/AreYouSavedScreen';
import { AssuranceFaithVsSuperstitionScreen } from '../screens/AssuranceFaithVsSuperstitionScreen';
import {
  BibleAuthorityGodsWordScreen,
  BibleAuthorityScreen,
  BibleAuthorityTextReliableScreen,
} from '../screens/BibleAuthorityScreen';
import {
  BibleIntakeGraspingGodsWordScreen,
  BibleIntakeScreen,
  BibleIntakeWordHandScreen,
} from '../screens/BibleIntakeScreen';
import {
  EffectivePrayerAcceptablePrayerScreen,
  EffectivePrayerFriendshipWithGodScreen,
  EffectivePrayerScreen,
} from '../screens/EffectivePrayerScreen';
import {
  FellowshipChurchFamilyScreen,
  FellowshipDoNotWalkAloneScreen,
  FellowshipScreen,
} from '../screens/FellowshipScreen';
import BottomNav from '../components/layout/BottomNav';
import ShellFrame from '../components/layout/ShellFrame';
import { BridgeScreen, HumanResponseScreen } from '../screens/BridgeScreen';
import { CreationScreen } from '../screens/CreationScreen';
import {
  ForgivenessAssuranceScreen,
  ForgivenessConfessionAndForgivenessScreen,
  ForgivenessHowCanSinBeForgivenScreen,
} from '../screens/ForgivenessAssuranceScreen';
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
import {
  VictoryAssuranceScreen,
  VictoryGrowingThroughTemptationScreen,
  VictoryOvercomingTemptationScreen,
} from '../screens/VictoryAssuranceScreen';
import { WitnessingScreen } from '../screens/WitnessingScreen';
import { PersonalTestimonyScreen } from '../screens/PersonalTestimonyScreen';
import { LifeGoalScreen } from '../screens/LifeGoalScreen';
import { SpiritualGrowthScreen } from '../screens/SpiritualGrowthScreen';
import { ROUTE_REGISTRY } from './routes';
import { ContentProvider } from '../context/ContentContext';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const routeViewportRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    routeViewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <ShellFrame>
      <main
        ref={routeViewportRef}
        className="ifu-route-viewport scrollbar-none min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden"
      >
        <Outlet />
      </main>
      <BottomNav />
    </ShellFrame>
  );
};

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
        path: ROUTE_REGISTRY.RESPONSE,
        element: <HumanResponseScreen />,
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
      {
        path: ROUTE_REGISTRY.FORGIVENESS_ASSURANCE,
        element: <ForgivenessAssuranceScreen />,
      },
      {
        path: ROUTE_REGISTRY.FORGIVENESS_ASSURANCE_CONFESSION_AND_FORGIVENESS,
        element: <ForgivenessConfessionAndForgivenessScreen />,
      },
      {
        path: ROUTE_REGISTRY.FORGIVENESS_ASSURANCE_HOW_CAN_SIN_BE_FORGIVEN,
        element: <ForgivenessHowCanSinBeForgivenScreen />,
      },
      {
        path: ROUTE_REGISTRY.VICTORY_ASSURANCE,
        element: <VictoryAssuranceScreen />,
      },
      {
        path: ROUTE_REGISTRY.VICTORY_ASSURANCE_GROWING_THROUGH_TEMPTATION,
        element: <VictoryGrowingThroughTemptationScreen />,
      },
      {
        path: ROUTE_REGISTRY.VICTORY_ASSURANCE_OVERCOMING_TEMPTATION,
        element: <VictoryOvercomingTemptationScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_AUTHORITY,
        element: <BibleAuthorityScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_AUTHORITY_IS_GODS_WORD,
        element: <BibleAuthorityGodsWordScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_AUTHORITY_TEXT_RELIABLE,
        element: <BibleAuthorityTextReliableScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_INTAKE,
        element: <BibleIntakeScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_INTAKE_WORD_HAND,
        element: <BibleIntakeWordHandScreen />,
      },
      {
        path: ROUTE_REGISTRY.BIBLE_INTAKE_GRASPING_GODS_WORD,
        element: <BibleIntakeGraspingGodsWordScreen />,
      },
      {
        path: ROUTE_REGISTRY.EFFECTIVE_PRAYER,
        element: <EffectivePrayerScreen />,
      },
      {
        path: ROUTE_REGISTRY.EFFECTIVE_PRAYER_ACCEPTABLE_PRAYER,
        element: <EffectivePrayerAcceptablePrayerScreen />,
      },
      {
        path: ROUTE_REGISTRY.EFFECTIVE_PRAYER_FRIENDSHIP_WITH_GOD,
        element: <EffectivePrayerFriendshipWithGodScreen />,
      },
      {
        path: ROUTE_REGISTRY.FELLOWSHIP,
        element: <FellowshipScreen />,
      },
      {
        path: ROUTE_REGISTRY.FELLOWSHIP_DO_NOT_WALK_ALONE,
        element: <FellowshipDoNotWalkAloneScreen />,
      },
      {
        path: ROUTE_REGISTRY.FELLOWSHIP_CHURCH_FAMILY,
        element: <FellowshipChurchFamilyScreen />,
      },
      {
        path: ROUTE_REGISTRY.WITNESSING,
        element: <WitnessingScreen />,
      },
      {
        path: ROUTE_REGISTRY.WITNESSING_PERSONAL_TESTIMONY,
        element: <PersonalTestimonyScreen />,
      },
      {
        path: ROUTE_REGISTRY.LIFE_GOAL,
        element: <LifeGoalScreen />,
      },
      {
        path: ROUTE_REGISTRY.SPIRITUAL_GROWTH,
        element: <SpiritualGrowthScreen />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminDashboardScreen />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTE_REGISTRY.JOURNEY} replace />,
  },
]);

export const AppRouter: React.FC = () => (
  <ContentProvider>
    <RouterProvider router={router} />
  </ContentProvider>
);
export default AppRouter;
