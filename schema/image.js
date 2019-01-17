var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 255
    },
    image: JSON,
    cloud_image: JSON,
    tags: [String],
    color: Object,
    caption: Object
});

var image = mongoose.model('image',ImageSchema);

module.exports = image;