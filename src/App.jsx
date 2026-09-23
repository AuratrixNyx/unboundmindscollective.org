import { Routes, Route } from "react-router";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/Home.jsx";
import Community from "./pages/Community.jsx";
import Resources from "./pages/Resources.jsx";
import Sessions from "./pages/Sessions.jsx";
import Profile from "./pages/Profile.jsx";
import Auth from "./pages/Auth.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FacilitatorConsole from "./pages/FacilitatorConsole.jsx";
import AIGuide from "./pages/AIGuide.jsx";
import SuggestionBox from "./pages/SuggestionBox.jsx";
import FacilitatorSpotlight from "./pages/FacilitatorSpotlight.jsx";
import CrisisResources from "./pages/CrisisResources.jsx";
import About from "./pages/About.jsx";
import MemberDirectory from "./pages/MemberDirectory.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/ai-guide" element={<AIGuide />} />
        <Route path="/suggestion-box" element={<SuggestionBox />} />
        <Route path="/facilitators" element={<FacilitatorSpotlight />} />
        <Route path="/crisis" element={<CrisisResources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/facilitator-console" element={<FacilitatorConsole />} />
        <Route path="/about" element={<About />} />
        <Route path="/directory" element={<MemberDirectory />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
