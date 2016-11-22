const fs = require('fs');
const express = require('express');
const path = require('path');
// const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

// const COMMENTS_FILE = require('../data/comments.json')
const COMMENTS_FILE = path.join(__dirname, 'data/comments.json')
// console.log(__dirname);
// console.log(COMMENTS_FILE);

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(cors())

// manual cors
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.get('/api/comments', function(req, res){
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err){
      console.log(err);
    }else{
      res.status(200).json(JSON.parse(data))
    }
  })
})

app.post('/api/comments', function(req, res){
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err){
      console.log(err);
    }else{
      var comments = JSON.parse(data)
      var newComment = {
        id: Date.now(),
        author: req.body.author,
        text: req.body.text
      }

      comments.push(newComment)
      fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err){
        if(err){
          console.log(err);
        }
        res.status(200).json(comment)
      })
    }
  })
})

app.listen(app.get('port'), function(){
  console.log(`server is running`);
})
