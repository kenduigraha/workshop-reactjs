const fs = require('fs');
const express = require('express');
const path = require('path');
// const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const router = express.Router();

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

app.get('/api/comments', function(req, res){
  console.log('get all comments');
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err){
      console.log(err);
    }else{
      res.status(200).json(JSON.parse(data))
    }
  })
})

app.post('/api/comments', function(req, res){
  console.log('new comment');
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err){
      console.log(err);
    }else{
      var comments = JSON.parse(data)
      var newComment = {
        id: req.body.id,
        author: req.body.author,
        text: req.body.text
      }

      comments.push(newComment)

      fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err){
        if(err){
          console.log(err);
        }
        res.status(200).json(comments)
      })
    }
  })
})

app.delete('/api/comments/:id', function(req, res) {
  console.log('delete');
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var comments = JSON.parse(data)

      var new_comments = comments.filter( comment => comment.id != req.params.id)

      // console.log(new_comments);

      fs.writeFile(COMMENTS_FILE, JSON.stringify(new_comments, null, 4), function(err){
        if(err){
          console.log(err);
        }
        res.status(200).json(new_comments)
      })
    }
  })
})

app.put('/api/comments/:id', function(req, res) {
  console.log('update');
  fs.readFile(COMMENTS_FILE, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var comments = JSON.parse(data)

      var update_comments = comments.map( comment => {
        if (comment.id === req.params.id) {
          // return Object.assign({}, comment, {
          //   author: req.body.author,
          //   text: req.body.text
          // })
          comment.author = req.body.author
          comment.text = req.body.text
          return comment
        } else {
          return comment
        }
      })

      fs.writeFile(COMMENTS_FILE, JSON.stringify(update_comments, null, 4), function(err){
        if(err){
          console.log(err);
        }
        res.status(200).json(update_comments)
      })
    }
  })
})
app.listen(app.get('port'), function(){
  console.log(`server is running`);
})
