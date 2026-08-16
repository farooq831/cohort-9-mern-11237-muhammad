import './AuthLayout.css';

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="auth-screen">
      <aside className="auth-brand" aria-hidden="true">
        <div className="auth-brand-lines" />
        <div className="auth-brand-content">
          <span className="auth-brand-mark">Notebook</span>
          <h1 className="auth-brand-headline">
            Write it down
            <br />
            before it slips away.
          </h1>
          <p className="auth-brand-sub">
            A quiet place for the notes you don't want to lose — ideas, lists,
            things to remember for later.
          </p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h2 className="auth-title">{title}</h2>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;