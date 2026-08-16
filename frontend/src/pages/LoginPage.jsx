import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import '../components/AuthForm.css';

const emailPattern = /^\S+@\S+\.\S+$/;

const validate = ({ email, password }) => {
  const errors = {};

  if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Enter your password.';
  }

  return errors;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Try again.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Pick up right where you left off."
    >
      {formError && <div className="form-alert">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <p className="form-error">{fieldErrors.email}</p>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="form-error">{fieldErrors.password}</p>
          )}
        </div>

        <button type="submit" className="form-submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="form-footer">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;