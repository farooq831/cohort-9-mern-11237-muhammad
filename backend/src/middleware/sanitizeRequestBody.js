// strips any key containing '$' or '.' from the request body,
// recursively, before it ever reaches a database query.
// Written by hand instead of using express-mongo-sanitize because
// that package tries to reassign req.query, which Express 5 made
// read-only — mutating req.body in place avoids that entirely.

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const clean = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }

  return value;
};

const sanitizeRequestBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitized = sanitizeValue(req.body);
    Object.keys(req.body).forEach((key) => delete req.body[key]);
    Object.assign(req.body, sanitized);
  }
  next();
};

module.exports = sanitizeRequestBody;