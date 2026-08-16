import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import '../components/AuthForm.css';

const emailPattern = /^\S+@\S+\.\S+$/;

const validate = ({ name, email, password }) => {
  const errors = {};

  if (name.trim().length < 2) {
    errors.name = 'Enter at least 2 characters.';
  }

  if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (password.length < 6) {
    errors.password = 'Use at least 6 characters.';
  }

  return errors;
};

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await signup(form);
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
      eyebrow="Get started"
      title="Create your account"
      subtitle="Takes less than a minute."
    >
      {formError && <div className="form-alert">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={`form-input ${fieldErrors.name ? 'has-error' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <p className="form-error">{fieldErrors.name}</p>}
        </div>

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
            autoComplete="new-password"
            className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="form-error">{fieldErrors.password}</p>
          )}
        </div>

        <button type="submit" className="form-submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;