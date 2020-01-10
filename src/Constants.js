module.exports = Object.freeze({
  DEFAULT_VALUES : [...Array(9).keys()].map(x => x + 1),
  DEFAULT_CANDIDATES: [...Array(9).keys()].reduce((acc, curr) => {
    return acc | (1 << (curr + 1))
  }, 0)
});
