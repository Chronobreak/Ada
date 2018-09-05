
const primaryRouter = require('express').Router();
const axios = require('axios')
const path = require('path');
const imageUpload = require('../imageUpload/uploadToBucket.js');
const userDB = require('../../databases/Users.js')
const recWorker = require('../recommendations/worker/recommendationWorker.js')
const recommendationService = require('../recommendations/service/imageTraits');
const helpers = require('../../databases/helpers.js');
const {getSavedEditorial, getInventoryForEditorial} = require('../../databases/models_edit.js');
const async = require('async');
const { IMAGE_RECOGNITION_URL } = require('../../config.js')
const scraper = require('../services/scraper.js')


// primaryRouter.get('/scrape', scraper.scrape.bind(this,'bloomingdales'))

primaryRouter.post('/index', function(req, res) {
    let url = 'http://greenwoodhypno.co.uk/wp-content/uploads/2014/09/test-image.png'
    let testID = 999;
    recWorker.indexAnalyzeInventoryItem(testID, url, (err) => {   
      imageUpload.uploadImage(username, imageFile, (err, imageUrl) => {
          if (err) {
              res.send(err)
          } else {
              res.send('success');
              res.status(200).send(imageUrl);
          }
      });
    })
  })
  
  // //Adds inventoryId to users favorites
  
primaryRouter.post('/favorites/:user/:inventoryId', (req,res) => {
    let username = req.params.user;
    let inventoryId = req.params.inventoryId;
    userDB.addFavoriteToUser(username, inventoryId);
})
  
  // //returns user's favorites

  
  // //Adds inventoryId to users favorites
primaryRouter.post('/favorites/:user/:inventoryId', (req,res) => {
    let username = req.params.user;
    let inventoryId = req.params.inventoryId;
    userDB.addFavoriteToUser(username, inventoryId);
    res.status(200).send('hope this saved. clean me up later');
})
  
  
  // //returns user's favorites
primaryRouter.get('/favorites/:user', (req,res) => { 
    let username = req.params.user;

    userDB.getUser(username, (err, userProfile) => {
        if (err) {
            res.status(400).send(err);
        } else {
            if (userProfile === null) {
                res.status(400).send('User not found');
            }
            helpers.inventoryItemsWithIds(userProfile.favorites, (err, favorites) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send(favorites);
                }
            })
        }
    })
})
  
  // //Adds inventoryId to users favorites
primaryRouter.post('/instahistory/:user', (req,res) => {
    let username = req.params.user;
    let inventoryIDs = req.body.photos;
    console.log('username', username);
    console.log('inventoryIds', inventoryIDs);
    inventoryIDs.forEach(photoUrl => {
        userDB.addHistoryToUser(username, photoUrl);
    });
    res.status(200).send('hope these saved. clean me up later')
})

//return user's image upload history
primaryRouter.get('/history/:user', (req,res) => { 
    console.log('GETTING HISTORY')
    let username = req.params.user;

    userDB.getUser(username, (err, userProfile) => {
        if (userProfile === null) {
            res.status(400).send('User not found');
        }
        res.status(200).send(userProfile.history);
    });
});


primaryRouter.post('/recommendinsta', (req, res) => {
//   let aggregateLabels = []; // using this later, when aggregating labels
  let instagramPhotos = req.body.params;
  for (var i = 0; i < 1; i++) {
      recommendationService.getRecommendationsForImageUrl(instagramPhotos[i], (err, recommendations) => {
          if (err) {
              console.log("Error getting recommendations using image URL", err)
              res.status(500).send();
          } else {
              res.send(recommendations);
          }
      })
  }
});
  
  
  // //using this endpoint starts the recommendation worker: checks inventory for new items to add to recommendation DB.
  // //TODO: Run worker occasionally instead of running this test endpoint
primaryRouter.post('/update', function(req, res) {
    recWorker.updateIndexDB((err) => {
        if (err) {
            console.log("Console logging error in /update: ", err);
        }
    });
});

primaryRouter.post('/send', (req,res) => {
  let body
  if(req.files && req.files.image) body = {image: req.files.image}
  if(req.body.imageUrl) body = {imageUrl: req.body.imageUrl}
  axios.post(IMAGE_RECOGNITION_URL,body)
  .then(({data})=>{
    let label = Object.keys(data).reduce(function(a, b){ return data[a] > data[b] ? a : b }).split(" ").join("-")
    console.log("Console logging labels destructured from /send: ", {label})
    recommendationService.getRecommendationsFromLabels(label, (err, recommendations, occurenceObject) => {
      if (err) return res.send(err)
      recommendationService.inventoryFromRecommendations(recommendations, occurenceObject, (err, inventories) => {
        if (err) return res.send(err)
          if(req.body.imageUrl){
            userDB.addHistoryToUser(req.body.username, req.body.imageUrl) //urlupload
          } else {
            imageUpload.uploadImage(req.body.username, req.files.image, (err,link)=>console.log(err,link)) //fileupload
          }
          res.send(inventories);
      })
    })
  })
})

primaryRouter.get('/latestProds', (req, res) => {
  helpers.retrievelast30items((err, data) => {
    if (err) res.sendStatus(404)
    else res.send(data)
  })
})


primaryRouter.get('/trends', (req, res) => {
  let res1 = []
  getSavedEditorial()
  .then((totalEditorial) => {
    res1.push(totalEditorial)
    let promiseArr = []
    totalEditorial.forEach((editorial) => {
      editorial.images.forEach((image) => {        
      let singlePromise = new Promise((resolve, reject) => {
        getInventoryForEditorial(image.image)
        .then(data => resolve(data))
        .catch(err => reject(err))
      })   
      promiseArr.push(singlePromise)       
      })
    })
    return Promise.all(promiseArr)
  })
  .then((finalImageData) => {
    res1.push(finalImageData)
    res.send(res1)
  })
})

primaryRouter.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '../../../client/dist' +'/index.html'));

})

module.exports = primaryRouter;