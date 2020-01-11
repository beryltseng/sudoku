module.exports = Object.freeze({
  DEFAULT_VALUES : [...Array(9).keys()].map(x => x + 1),
  DEFAULT_CANDIDATES: [...Array(9).keys()].reduce((acc, curr) => {
    // each bit represents the a candidate value so 1022 indicates 1-9 are all possible
    return acc | (1 << (curr + 1))
  }, 0),
  STATUS : {
    INITIAL: 1,
    STARTED: 1 << 1,
    RESOLVED: 1 << 2,
    FAILED: 1 << 3
  }
});
