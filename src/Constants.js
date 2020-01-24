module.exports = Object.freeze({
  
  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  DEFAULT_VALUES : [...Array(9).keys()].map(x => x + 1),
  
  // each bit represents the a candidate value so 1022 indicates 1-9 are all possible
  DEFAULT_CANDIDATES: [...Array(9).keys()].reduce((acc, curr) => {
    return acc | (1 << (curr + 1))
  }, 0),
  
  // sum from 1...9
  SUM: 45,
  
  // possible statuses of a game
  STATUS : {
    INITIAL: 1,
    STARTED: 1 << 1,
    RESOLVED: 1 << 2,
    FAILED: 1 << 3,
    TIMEOUT: 1 << 4
  },
  
  // 10 minutes
  TIME_LIMIT: 600000
});
