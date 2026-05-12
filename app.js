const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const textData = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp. VERTICAL_ALIGN_MIDDLE,
    }

    image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);

    console.log('Success!');
  }
  catch (error) {
    console.log('Something went wrong... Try again!')
  }
  finally {
    startApp();
  }
};

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = (await Jimp.read(watermarkFile)).resize(500, Jimp.AUTO);
    const positionX = image.getWidth() / 2 - watermark.getWidth() / 2;
    const positionY = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, positionX, positionY, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.3,
    });

    await image.quality(100).writeAsync(outputFile);

    console.log('Success!');
  }
  catch (error) {
    console.log('Something went wrong... Try again!')
  }
  finally {
    startApp();
  }
};

const prepareOutputFilename = (filename) => {
  const dotIndex = filename.lastIndexOf(".");
  const filenameWithoutExtension = dotIndex > 0 ? filename.slice(0, dotIndex) : filename;
  const extension = dotIndex > 0 ? filename.slice(dotIndex) : "";

  const withWatermarkText = '-with-watermark';
  return filenameWithoutExtension + withWatermarkText + extension;
};

const startApp = async () => {
  //ask if user is rdy
  const answer = await inquirer.prompt([{
    name: 'start',
    message: 'Welcome to watermark manager. Copy your img files do `./img` folder. Are you rdy?',
    type: 'confirm'
  }]);

  //quit if !answer
  if(!answer.start) process.exit();

  //ask about input file and watermark type
  const options = await inquirer.prompt([{
    name: 'inputImage',
    type: 'input',
    message: 'What file do you want to mark?',
    default: 'test.jpg',
  }, {
    name: 'watermarkType',
    type: 'list',
    choices: ['Text watermark', 'Image watermark'],
  }]);

  if(options.watermarkType === 'Text watermark') {
    const text = await inquirer.prompt([{
      name: 'value',
      type: 'input',
      message: 'Type your watermark text: ',
    }]);

    options.watermarkText = text.value;

    if(fs.existsSync('./img/' + options.inputImage)){
      addTextWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), options.watermarkText);
    } else {
      console.log('Something went wrong... try again');
    }

  }

  if(options.watermarkType === 'Image watermark') {
    const image = await inquirer.prompt([{
      name: 'filename',
      type: 'input',
      message: 'Type your watermark name: ',
      default: 'logo.png',
    }]);

    options.watermarkImage = image.filename;

    if(fs.existsSync('./img/' + options.inputImage) && fs.existsSync('./img/' + options.watermarkImage)) {
      addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), './img/' + options.watermarkImage);
    } else {
      console.log('Something went wrong... try again');
    }
  }
}

startApp();