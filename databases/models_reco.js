const { Inventory, ItemKeywords } = require("./schema.js");
const async = require('async');

const makeLabels = (arr) => {
  async.each(arr, (label, cb) => {
   ItemKeywords.findOne({keyword: label}, (err, data) => {
    if(data === null) {
      new ItemKeywords({keyword: label })
      .save()
      .then((done) => console.log("Successfully saved data"))
      .catch(err => console.log("Error in indexItem function"));
    }
   })
   cb()
  }, (err) => {
    console.log('iterating done');
  })
}

const insertLabels = (labelsObj) => {
  for (var key in labelsObj) {
    let label = key
    let ids = labelsObj[key]

    async.each(ids, (id, cb) => {
      ItemKeywords.findOneAndUpdate({keyword: label}, {$push: {inventoryIds: id}}, (err) => {
        if (err)  console.log('ERR UPDATING KEYWORD', err)
        else console.log('saved')
      })
      cb()
    }, (err) => {
      console.log('iterating done');
    })
  }
}

const indexInventory = async() => {
  var filteredTags= new Set()
  var filteredByTag = {}
  var filteredByTagArr = []

  await Inventory.find({}).select('labels')
  .then(data => {
    async.each(data, (item, cb) => {
      let userId = item._id
      let labels = item.labels
      let label = labels[1]
      filteredTags.add(label)
      !filteredByTag[label] ? filteredByTag[label] = [userId] : filteredByTag[label].push(userId)  
      cb()
    }, (err) => {
      console.log('iterating done');
    })
  })
  .catch(err => console.log(err))
  const arr = [...filteredTags]

  await makeLabels(arr)
  await insertLabels(filteredByTag)
}

const labelsToIndex = ()=>{
  Inventory.find({}).select('labels')
  .then(data => {
    data.forEach(item=>{
      let id = item._id
      let keyword = item.labels[1]
      ItemKeywords.findOneAndUpdate({keyword},
        { $addToSet : {inventoryIds : id}}).then((res)=>console.log(res))
    })
  })
}

// labelsToIndex()


module.exports = {indexInventory}

