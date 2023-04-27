const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const highScoreSchema = new Schema({
    name: {type: String, required: true},
    gamesWon: {type: Number, required: true}
})

module.exports = mongoose.model("HighScore", highScoreSchema);