const emailRegex = /^\S+@\S+\.\S+$/;

const validateSignupInput = (body) => {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!emailRegex.test(email)) {
    errors.push('A valid email is required');
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

const validateLoginInput = (body) => {
  const errors = [];
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!emailRegex.test(email)) {
    errors.push('A valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

const validateNoteInput = (body) => {
  const errors = [];
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = body.content;

  if (title.length < 1) {
    errors.push('Title is required');
  }

  if (title.length > 255) {
    errors.push('Title must be under 255 characters');
  }

  if (content !== undefined && typeof content !== 'string') {
    errors.push('Content must be a string');
  }

  return errors;
};

module.exports = { validateSignupInput, validateLoginInput, validateNoteInput };
