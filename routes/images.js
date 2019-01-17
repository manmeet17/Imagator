var express = require('express');
var router = express.Router();
var multer = require('multer');
const request = require('request');
var Image = require('../schema/image');
var upload = multer({
    dest: 'uploads/'
});
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "dhcctdbh7",
    api_key: "425229134754467",
    api_secret: "wYMeVkLZB2zBMNJKMd1yOLLLW8s"
});

function getCount() {
    return Image.countDocuments({}).exec();
}

function getAll() {
    return Image.find().exec();
}



router.get('/', async (req, res) => {
    let totalImages = await getCount();
    let images = await getAll();
    res.render('photos', {
        count: totalImages,
        images
    });
});

router.post('/', upload.single('photo'), async (req, res) => {


    cloudinary.v2.uploader.upload(req.file.path, async (error, result) => {
        if (error) {
            res.send({
                msg: "Error",
                error
            });
        } else {
            let tags = await azureTags(result);
            // res.send({
            //     tags
            // })
            var image = new Image({
                title: req.file.filename,
                image: req.file,
                cloud_image: result,
                tags: tags.body.description.tags,
                color: tags.body.color
            });
            cloudinary.uploader.add_tag(tags.body.description.tags[0], result.public_id, async function () {
                try {
                    let savedImage = await image.save();
                    res.status(200).send({
                        msg: "Success saving image",
                        image: savedImage
                    });
                } catch {
                    res.status(500).send({
                        msg: "Error"
                    });
                }
            });
        }
    });
});

function azureTags(file) {
    return new Promise((resolve, reject) => {
        const subscriptionKey = 'd765a568addd4ecc843cc1199f19b6d2';
        const uriBase = 'https://southeastasia.api.cognitive.microsoft.com//vision/v2.0/analyze';
        const imageUrl = file.url;
        const params = {
            'visualFeatures': 'Categories,Description,Color',
            'details': '',
            'language': 'en'
        };
        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + imageUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };

        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                reject();
            };

            console.log("Tags --->", JSON.parse(body));
            resolve({
                body: JSON.parse(body)
            });
        });
    });
}


router.get('/scan', (req, res) => {
    const subscriptionKey = 'd765a568addd4ecc843cc1199f19b6d2';
    const uriBase = 'https://southeastasia.api.cognitive.microsoft.com//vision/v2.0/analyze';
    const imageUrl = 'http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';
    const params = {
        'visualFeatures': 'Categories,Description,Color',
        'details': '',
        'language': 'en'
    };
    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            return;
        };
        res.send({
            body: JSON.parse(body)
        })
    });
});


module.exports = router;