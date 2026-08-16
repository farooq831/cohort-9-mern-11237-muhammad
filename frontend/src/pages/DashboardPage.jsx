import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="dashboard-brand">Notebook</span>
        <div className="dashboard-header-right">
          <span className="dashboard-user">{user?.name}</span>
          <button className="dashboard-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="dashboard-body">
        <div className="dashboard-empty">
          <h2>No notes yet</h2>
          <p>Write your first one to see it here.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;