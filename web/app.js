const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const modelManager = require('./modelManager');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('index.html');
})

app.post('/generate/aboveground', async (req, res) => {
  return await prepareRequest(req, res, modelManager.generateAboveground);
});

app.post('/generate/underground', async (req, res) => {
  return await prepareRequest(req, res, modelManager.generateUnderground);
});

const prepareRequest = async (req, res, generateFunction) => {
  if (!req.body || !req.body.file) {
    return res.status(400).send();
  }
  const image = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(image, 'base64');
  const generatedImage = await generateFunction(buffer);
  const generatedImagePath = path.resolve('./public/img/generated_maps/generated.jpeg');
  console.log(generatedImagePath);
  fs.writeFileSync(generatedImagePath, generatedImage);
  return res.sendFile(generatedImagePath);
}

app.listen(port, () => {
  modelManager.loadModel().then(_ => console.log(`Model loaded`));
  console.log(`Example app listening on port ${port}`);
});