/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const mongoose = require("mongoose");
const Book = require("../models/book");
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      Book.aggregate(
        [
          {
            $project: {
              title: 1,
              commentcount: {
                $cond: {
                  if: { $isArray: "$comments" },
                  then: { $size: "$comments" },
                  else: "NA"
                }
              }
            }
          }
        ],
        (err, books) => {
          if (err) return res.status(400).json(err);
          res.status(200).json(books);
        }
      );
    })

    .post(function(req, res) {
      let title = req.body.title;
      if (!title) return res.send("missing title");
      let newBook = new Book({ title: title });
      newBook.save((err, book) => {
        if (err) return res.status(400).send(`Error saving ${title}`);
        res.status(200).json(book);
      });
    })

    .delete(function(req, res) {
      Book.deleteMany((err, data) => {
        if (err) res.status(400).json(err)
        res.status(200).send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      let bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if (err) return res.status(400).json(err)
        if (!book) {
          res.status(200).send('no book exists')  
        } else {
          res.status(200).json(book)
        }
      })
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      Book.findById(bookid, (err, book) => {
        if (err) return res.status(400).json(err)
        book.comments.push(comment)
        book.save((err, savedBook) => {
          if (err) return res.status(400).json(err)
          res.status(200).json(savedBook)
        })
      })
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid, (err, data) => {
        if (err) return res.status(400).json(err)
        res.status(200).send('delete successful')
      })
    });
};
