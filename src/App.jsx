import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AreYouSavedScreen } from './screens/AreYouSavedScreen';
import { AssuranceFaithVsSuperstitionScreen } from './screens/AssuranceFaithVsSuperstitionScreen';
import { BridgeScreen, HumanResponseScreen } from './screens/BridgeScreen';
import { CreationScreen } from './screens/CreationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { JourneyOverviewScreen } from './screens/JourneyOverviewScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ProblemScreen } from './screens/ProblemScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { QuietTimeNewToYouScreen } from './screens/QuietTimeNewToYouScreen';
import { QuietTimeScreen } from './screens/QuietTimeScreen';
import { SalvationAssuranceScreen } from './screens/SalvationAssuranceScreen';
import { SevenMinutesWithGodScreen } from './screens/SevenMinutesWithGodScreen';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeScreen />} />
        <Route path="journey" element={<JourneyOverviewScreen />} />
        <Route
          path="journey/salvation-assurance"
          element={<SalvationAssuranceScreen />}
        />
        <Route
          path="journey/salvation-assurance/are-you-saved"
          element={<AreYouSavedScreen />}
        />
        <Route
          path="journey/salvation-assurance/faith-vs-superstition"
          element={<AssuranceFaithVsSuperstitionScreen />}
        />
        <Route path="journey/quiet-time" element={<QuietTimeScreen />} />
        <Route
          path="journey/quiet-time/seven-minutes-with-god"
          element={<SevenMinutesWithGodScreen />}
        />
        <Route
          path="journey/quiet-time/new-to-you"
          element={<QuietTimeNewToYouScreen />}
        />
        <Route path="journey/creation" element={<CreationScreen />} />
        <Route path="journey/problem" element={<ProblemScreen />} />
        <Route path="journey/bridge" element={<BridgeScreen />} />
        <Route path="journey/response" element={<HumanResponseScreen />} />
        <Route path="library" element={<LibraryScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
