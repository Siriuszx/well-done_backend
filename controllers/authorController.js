const asyncHandler = require('express-async-handler');
const { body, query, validationResult } = require('express-validator');

const User = require('../models/user');

exports.authors_get = [
  query('limit', 'Limit query must have valid format')
    .default(20)
    .trim()
    .isInt()
    .customSanitizer((value) => {
      if (value < 0 || value > 20) {
        return 0;
      } else {
        return value;
      }
    })
    .escape(),
  query('page', 'Page query must have valid format')
    .default(1)
    .trim()
    .isInt()
    .customSanitizer(async (value) => {
      const docCount = await User.find().countDocuments().exec();

      if (value < 0 || value > Math.ceil(docCount / process.env.MAX_DOCS_PER_FETCH)) {
        return 0;
      } else {
        return --value;
      }
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { limit, page } = req.query;

      const lastUsers = await User.find({}, 'username bio')
        .skip(page * process.env.DOCS_PER_FETCH)
        .limit(limit)
        .exec();

      res.json(lastUsers);
    }
  }),
];