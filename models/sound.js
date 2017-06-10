// Require relevant modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a sound schema
var soundSchema = new Schema({
    value: {
        type: Number,
        min: 0,
        max: 1024,
        required: true
    }
}, {
    timestamps: true
});

// Export soundSchema as a model
var Sound = mongoose.model('Sound', soundSchema);
module.exports = Sound;