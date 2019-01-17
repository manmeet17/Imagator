var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 255
    },
    image: JSON,
    cloud_image: JSON,
    tags: [String],
    color: JSON,
    caption: [JSON]
});

var image = mongoose.model('image',ImageSchema);

module.exports = image;