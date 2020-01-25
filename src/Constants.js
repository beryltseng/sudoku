module.exports = Object.freeze({
  
  DEFAULT_VALUES : [1, 2, 3, 4, 5, 6, 7, 8, 9],
  
  // each bit represents the a candidate value so 1022 indicates 1-9 are all possible
  DEFAULT_CANDIDATES: 1022,
  
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
