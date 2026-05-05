const Jimp = require('jimp');

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  const image = await Jimp.read(inputFile);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const textData = {
    text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp. VERTICAL_ALIGN_MIDDLE,
  }

  image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
  await image.quality(100).writeAsync(outputFile);
};

addTextWatermarkToImage('./test.jpg', './test-with-watermark.jpg', 'Hello Kris');

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
  const image = await Jimp.read(inputFile);
  const watermark = (await Jimp.read(watermarkFile)).resize(500, Jimp.AUTO);
  const positionX = image.getWidth() / 2 - watermark.getWidth() / 2;
  const positionY = image.getHeight() / 2 - watermark.getHeight() / 2;

  image.composite(watermark, positionX, positionY, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.3,
  });

  await image.quality(100).writeAsync(outputFile);
};

addImageWatermarkToImage('./test.jpg', './test-with-watermark2.jpg', './logo.png');