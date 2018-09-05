const { Inventory, ItemKeywords, Timestamp, Editorial } = require("./schema.js");
const async = require('async');

exports.indexItem = (id, itemLabels) => {

  async.each(itemLabels, (label) => {
    ItemKeywords.findOne({keyword: label}, (err, keywordItem) => {
      if (err) {
        console.log(err);
      } else {
        if (keywordItem === null) {
          let itemToSave = new ItemKeywords({
            keyword: label,
            inventoryIds: [id]
          })
          itemToSave.save((err) => {
            if (err) {
              console.log(err);
            }
          })
        } else {
          ItemKeywords.findOneAndUpdate({keyword: label}, {$push: {inventoryIds: id}}, (err) => {
            if (err) {
              console.log('ERR UPDATING KEYWORD', err)
            }
          })
        }
      }
    })
  }, (err) => {
    console.log(err);
  })
}

exports.inventoryItemsWithIds = (inventoryIds, callback) => {
  Inventory.find({_id: {$in: inventoryIds}}, (err, inventoryItems) => {
    if (err) {
      callabck(err);
    } else {
      callback(null, inventoryItems);
    }
  })
}

// exports.saveItem = (id, name, brandName, url, imageUrl, price) => {
//   new Inventory({
//     id: id,
//     name: name,
//     brandName: brandName,
//     url: url,
//     imageUrl: imageUrl,
//     price: price
//   })
//     .save()
//     .then(response => console.log("Successfully saved data"))
//     .catch(err => console.log("Error in database save function", err));
// };

exports.saveItem = ({name, brandName, url, imageUrl, price, labels, gender}, callback) => {
  new Inventory({name, brandName, url, imageUrl, price, labels, gender})
    .save()
    .then(response => callback(null,"Successfully saved data"))
    .catch(err => callback(err));
};

exports.getKeywordEntries = (itemKeywords, callback) => {
  ItemKeywords.find({keyword: {$in: itemKeywords}}, (err, results) => {
    if (err) {
      callback(err);
    } else {
      console.log({results})
      callback(null, results);
    }
  })
}

exports.updateRecentTimestamp = (timestamp) => {
  Timestamp.findOne({}, (err, oldTimestamp) => {
    if (err) {
      console.log(err);
    } else {
      if (oldTimestamp === null) {
        let timestampToSave = new Timestamp({
          timestamp: timestamp
        });
        timestampToSave.save((err) => {
          if (err) {
            console.log(err);
          }
        })
      } else {
        Timestamp.findOneAndUpdate({}, {timestamp: timestamp}, (err) => {
          if (err) {
            console.log(err);
          }
        })
      }
    }
  })
}

exports.getRecentTimestamp = (callback) => {
  Timestamp.findOne({}, (err, latestTimestamp) => {
    if (err) {
      console.log('error getting recent timestamp', err);
      callback(err);
    } else {
      console.log('latest timestamp', latestTimestamp)
      callback(null, latestTimestamp);
    }
  })
}


exports.retrieveNewItems = (timestamp, callback) => {
  Inventory.find({timestamp: {$gte: timestamp}}, (err, newItems) => {
    if (err) {
      callback(err);
    } else {
      callback(null, newItems);
    }
  })
}

exports.retrievelast30items = (callback) => {
  Inventory.find({}).sort('-timestamp').limit(10).exec((err, items) => {
    if (err) {
      callback(err);
    } else {
      callback(null, items);
    }
  })
}



