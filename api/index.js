const tf = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const sharp = require('sharp');
const fs = require('fs');
const novax = require('novaxjs2');
const app = new novax();
const model = await nsfw.load();

async function checkImage(path) {
  const imageBuffer = await sharp(path)
    .resize(256, 256)
    .toBuffer();

  const image = tf.node.decodeImage(imageBuffer, 3);
  const predictions = await model.classify(image);
  image.dispose();

  return predictions;
}

app.post('/', async(req, res) => {
  try {
    const { imagePath } = req.body;
    res.json(await checkImage(imagePath))
  } catch(err) {
    res.json(err)
  }
})