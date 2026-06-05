import "../assets/css/DashboardLayout.css";
import Welcome from "./HomePage";


export default function DashboardLayout() {
  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <h2>My Website Header</h2>
      </header>

      {/* Main Section */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li>Home</li>
            <li>About</li>
          </ul>
        </aside>

        {/* Content */}
        <main className="content">
         <Welcome />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 My College Website. All Rights Reserved.</p>
      </footer>
    </div>
  );
}