var express = require('express');
var router = express.Router();
const highScore = require('../models/highScore');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Create new leaderboard entry */
router.post('/', (req, res) => {

  const newHighScore = new highScore({
    name: req.body.name,
    gamesWon: req.body.gamesWon
  })
  newHighScore.save()

  // Successfully saved new high score
  .then(() => {

    // Get all scores
    highScore.find({})
    .sort({gamesWon: -1})
    .limit(10)

    // Successfully got top high scores
    .then(topHighScores => {
      return res.status(200).json({topHighScores, success: true});
    })
    // Unsuccessfully got top high scores
    .catch(err => {
      return res.status(500).json({err, success: false});
    })
  })
  // Unsuccessfully saved new high score
  .catch(err => {
    return res.status(500).json({err, success: false});
  })

})

module.exports = router;
