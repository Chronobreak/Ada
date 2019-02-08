# [Ada](http://18.222.219.218:4000/)
**An AI fashion recommendation web app that leverages object detection, web crawling, and a proprietary recommendations algorithm.**

## Features
* Single page React web application for seamless navigation through views.
* Instagram and Facebook sign up and log in.
* Ability for user to provide source image via upload, URL, or social media account. (NOTE: social media OAuth 2.0 is in development setting, not production)
* Analyzes using AWS Rekognition service to scan and tag source image. Google Vision, Clarifai, and proprietary TensorFlow object detection models were considered, experimented with, and ultimately rejected.
* Interfaces with inventory database and provides clothing recommendations.
* Favorite and save for later, or navigate directly to the product page.

## Walkthrough

  ### A dynamic, animated, yet lightweight splash page to welcome users. Log in with Facebook or Instagram.

  ![Splash page](https://imgur.com/cjqT8TZ.jpg)

  ### Ada takes a snapshot. Upload a source image or provide an image URL.
  
  ![Upload](https://imgur.com/UrqCTs6.jpg)

  ### Your uploaded image is analyzed and compared against our inventory database. Our thoughtful algorithm will provide recommendations that you can favorite to save for later, and a link to the product page.

  ![Results](https://imgur.com/bOGifVT.jpg)

## Technology
* [React](https://reactjs.org/), [Semantic UI](http://react.semantic-ui.com/)
* [Node](https://nodejs.org/), [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* [Webpack](https://webpack.js.org/), [Babel](https://babeljs.io/)
* [Cheerio](https://github.com/cheeriojs/cheerio), [Puppeteer](https://developers.google.com/web/tools/puppeteer/)
* [TensorFlow (Object Detection)](https://github.com/tensorflow/models/tree/master/research/object_detection)
* [AWS (S3, Rekognition)](https://aws.amazon.com/)

## Team
* __Product Owner__: [David Kim](https://github.com/Chronobreak)
* __Scrum Master__: [Ana Vasquez](https://github.com/anvasquez08)
* __Development Team__: [Jack Lim](https://github.com/thecodingjack), [Jon Izak](https://github.com/jonizak)
