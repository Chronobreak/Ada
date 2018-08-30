
const primaryRouter = require('express').Router();
const axios = require('axios')
const path = require('path');
// const recommendationRouter = require('./routes/recommendationRoutes');
const imageUpload = require('../imageUpload/uploadToBucket.js');
const userDB = require('../../databases/Users.js')
const recWorker = require('../recommendations/worker/recommendationWorker.js')
const recommendationService = require('../recommendations/service/imageTraits');
const helpers = require('../../databases/helpers.js');
const {getSavedEditorial} = require('../../databases/models_edit.js');
const { NGROKURL } = require('../../config.js')
const labelsTable = require('../labels.js')


// server.express.get('/scrape', scraper.googleScrape)
// server.express.get('/tags', scraper.getByTags)

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
  
//   primaryRouter.get('/favorites/:user', (req,res) => { 
//       let username = req.params.user;
  
//       userDB.getUser(username, (err, userProfile) => {
//       imageUpload.uploadImage(null, imageFile, (err, imageUrl) => {
//           if (err) {
//               res.status(500).send(err);
//           } else {
//               res.status(200).send(imageUrl);
//           }
//       })
//   })
//   })
  
  primaryRouter.post('/upload', (req,res) => {
      
    let imageFile = req.files.file;
    console.log("Console logging imageFile from /upload: ", imageFile);
    
    imageUpload.uploadImage(null, imageFile, (err, imageUrl) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(imageUrl);
        }
    })
  })
  
  // User uploads image. Saves image, adds image to user's history
  primaryRouter.post('/upload/:user', (req,res) => {
      
      let username = req.params.user;
      let imageFile = req.files.file;
      imageUpload.uploadImage(username, imageFile, (err, imageUrl) => {
          if (err) {
              res.status(500).send(err);
          } else {
              console.log("Console logging imageUrl: ",imageUrl);
              res.status(200).send(imageUrl);
          }
      })
  })
  
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
  
  primaryRouter.post('/recommend', function(req, res) {
    console.log('recommend params');
    if (typeof req.body.params === 'string') {
        console.log("Receiving URL, proceeding to get recommendations from Image URL")
        let imageUrl = req.body.params
        recommendationService.getRecommendationsForImageUrl(imageUrl, (err, recommendations) => {
            if (err) {
                console.log("Error getting recommendations using image URL", err)
                res.status(500).send();
            } else {
                res.status(200).send(recommendations);
            }
        })
    } 
  });
  
  primaryRouter.post('/recommendinsta', (req, res) => {
    let aggregateLabels = []; // using this later, when aggregating labels
    let instagramPhotos = req.body.params;
    for (var i = 0; i < 1; i++) {
        recommendationService.getRecommendationsForImageUrl(instagramPhotos[i], (err, recommendations) => {
            if (err) {
                console.log("Error getting recommendations using image URL", err)
                res.status(500).send();
            } else {
                aggregateLabels.push(recommendations);
            //   console.log("Console logging recommendations length: ", recommendations.length)
            //   // res.status(200).send(recommendations);
            //   console.log("Console logging aggregateLabels length", aggregateLabels.length )
            //   res.status(200).send();
                console.log(aggregateLabels);
                res.send(recommendations);
            }
        })
    }
  });
  
  primaryRouter.post('/recommend/:user', function(req, res) {
      let username = req.params.user;
      if (typeof req.body.params === 'string') {
          let imageUrl = req.body.params
          recommendationService.getRecommendationsForImageUrl(imageUrl, (err, recommendations) => {
              if (err) {
                  console.log("Error getting recommendations using image URL", err)
                  res.status(500).send();
              } else {
                  if (username) {
                      userDB.addHistoryToUser(username, imageUrl);
                  }
                  res.status(200).send(recommendations);
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
    console.log('hitting TF server')
    axios.post(NGROKURL,{image: req.files.image})
    .then(({data})=>{
        // data.boxes.forEach((box,idx)=>{
        //     if(box[0]+box[1]+box[2]+box[3] > 0){
        //         var currentItem = data.label[idx]
        //         label.push(labelsTable[currentItem])
        //     }
        // })
        // console.log({label})
        // res.send(data)
        // let label = data.label.map(el=>labelsTable[el])
        let label = Object.keys(data).reduce(function(a, b){ return data[a] > data[b] ? a : b });
        // if (label === 't shirt') label = 'T-Shirt'
        console.log("Console logging labels destructured from /send: ", {label})
        recommendationService.getRecommendationsFromLabels(label, (err, recommendations, occurenceObject) => {
            console.log("Console logging recommendations destructured from /send: ", {recommendations})
            if (err) {
                console.log("Err in /send")
                res.send(err);
            } else {
                recommendationService.inventoryFromRecommendations(recommendations, occurenceObject, (err, inventories) => {
                    if (err) {
                        console.log("Err in /send")
                        res.send(err)
                    } else {
                        res.send(inventories);
                    }
                })
            }
        })
        // res.send(data)
    })
  })

  primaryRouter.get('/latestProds', (req, res) => {
    helpers.retrievelast30items((err, data) => {
      if (err) res.sendStatus(404)
      else res.send(data)
    })
  })
  
  
  primaryRouter.get('/trends', (req, res) => {
    // 1) get images from stories
    // 2) get analysis of photos 
    // 3) get recommendations 
    getSavedEditorial((err, response)=> {
      if (response !== null) {
        res.send(response)
      } else {
        res.send(err)
      }
    })
  })
  
  primaryRouter.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '../../../client/dist' +'/index.html'));
  
  })

  module.exports = primaryRouter;