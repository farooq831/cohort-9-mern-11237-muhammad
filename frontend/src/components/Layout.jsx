import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-brand">Notebook</span>
        <div className="app-header-right">
          <span className="app-user">{user?.name}</span>
          <button className="app-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="app-body">{children}</main>
    </div>
  );
};

export default Layout;