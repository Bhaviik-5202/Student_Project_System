// Utility to wrap async route handlers and catch errors

function handleAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = handleAsync;
