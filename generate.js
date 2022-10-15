const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// CONFIGURATION - Set the nft collection size, rarity names and percentages
let collectionSize = 20;
let percentage1 = 20;
let percentage2 = 5;

const rarityName1 = 'diamond';
const rarityName2 = 'gold';
const rarityName3 = 'silver';
// END CONFIGURATION

let loopPercentage1 = Math.round((collectionSize * percentage1) / 100);
let loopPercentage2 =
  loopPercentage1 + Math.round((collectionSize * percentage2) / 100);

function generate() {
  let collectionArray = [];
  for (let i = 1; i <= collectionSize; i++) {
    let collection = {
      name: '',
      rarity: '',
      image: '',
    };
    collection.name = 'Iphone' + i;
    if (i <= loopPercentage1) {
      collection.rarity = rarityName1;
      collection.image = `ipfs://${rarityName1}.mp4`;
    } else if (i <= loopPercentage2) {
      collection.rarity = rarityName2;
      collection.image = `ipfs://${rarityName2}.mp4`;
    } else {
      collection.rarity = rarityName3;
      collection.image = `ipfs://${rarityName3}.mp4`;
    }
    collectionArray.push(collection);
  }
  const newArr = shuffle(collectionArray);
  writeJson(newArr);
}

function shuffle(arr) {
  let currentIndex = arr.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

function writeJson(newArr) {
  for (let i = 1; i <= newArr.length; i++) {
    let data = JSON.stringify(newArr[i - 1], null, 2);
    fs.writeFileSync(`./collection/${i}.json`, data);
  }
  getOrder();
}

const getOrder = async () => {
  let order = [];
  fs.readdir('Collection', (err, files) => {
    files.forEach((file) => {});
    // order an array of numbers from lower to higher
    order = files
      .map((file) => {
        return parseInt(file.split('.')[0]);
      })
      .sort((a, b) => a - b);

    rename(order);
  });
};

function rename(order) {
  for (let i = 1; i <= collectionSize; i++) {
    let data = fs.readFileSync(`Collection/${i}.json`, 'utf8');
    let obj = JSON.parse(data);
    obj.name = `Iphone ${order[i - 1]}`;
    let newData = JSON.stringify(obj, null, 2);
    fs.writeFileSync(`Collection/${i}.json`, newData);
  }
  console.log('Done');
}

//NON SERVE GENERARE LE IMMAGINI PER QUESTO PROGETTO

// function images() {
//   for (let i = 1; i <= collectionSize; i++) {
//     const width = 500;
//     const height = 500;

//     const canvas = createCanvas(width, height);
//     const ctx = canvas.getContext('2d');
//     let data = fs.readFileSync(`Collection/${i}.json`, 'utf8');
//     let obj = JSON.parse(data);
//     let rarity = obj.rarity;
//     if (rarity === 'super rare') {
//       loadImage('./rarities/super-rare.png').then((image) => {
//         ctx.drawImage(image, 0, 0, 500, 500);
//         const buffer = canvas.toBuffer('image/png');
//         fs.writeFileSync(`images/${i}.png`, buffer);
//       });
//     }
//     if (rarity === 'rare') {
//       loadImage('./rarities/rare.png').then((image) => {
//         ctx.drawImage(image, 0, 0, 500, 500);
//         const buffer = canvas.toBuffer('image/png');
//         fs.writeFileSync(`images/${i}.png`, buffer);
//       });
//     }
//     if (rarity === 'common') {
//       loadImage('./rarities/common.png').then((image) => {
//         ctx.drawImage(image, 0, 0, 500, 500);
//         const buffer = canvas.toBuffer('image/png');
//         fs.writeFileSync(`images/${i}.png`, buffer);
//       });
//     }
//   }
// }

generate();
