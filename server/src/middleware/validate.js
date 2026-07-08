const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    const errors = error.errors?.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({ error: 'Validation failed', details: errors });
  }
};

module.exports = { validate };
