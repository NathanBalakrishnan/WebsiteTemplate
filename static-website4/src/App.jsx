// App.js
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SiteViewer from "./pages/SiteViewer";
import Preview from "./pages/preview/PreviewParent";
import CustomizedParent from "./pages/customized/CustomizedParent";
function Team() {
  return <h1>Team Management</h1>;
}

function Analytics() {
  return <h1>Performance Analytics</h1>;
}

function Settings() {
  return <h1>Account Settings</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/team" element={<Team />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/siteViewer" element={<SiteViewer />} />
      {/* Remove :templateId - just use /preview */}
      <Route path="/preview" element={<Preview />} />
      <Route path="/customize" element={<CustomizedParent />} />
    </Routes>
  );
}