/* jshint unused:false */
'use strict';
var multiparty = require('multiparty');
var fs = require('fs');
var albums = global.nss.db.collection('albums');
var Mongo = require('mongodb');
var rimraf = require('rimraf');


exports.index = (req, res)=>{
  albums.find().toArray((err, records)=>{
    res.render('albums/index', {albums: records, title:'albums Index'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var album = {};
    var albumDirectoryName = fields.albumName[0].replace(/[-'" ]/g, '');
    if(!fs.existsSync(`${__dirname}/../static/img/${albumDirectoryName}`)){
      album.name = fields.albumName[0];
      album.photos = [];
      album.directory = albumDirectoryName;

      fs.mkdirSync(`${__dirname}/../static/img/${albumDirectoryName}`);

      files.photos.forEach(photo=>{
        fs.renameSync(photo.path, `${__dirname}/../static/img/${albumDirectoryName}/${photo.originalFilename}`);
        album.photos.push(photo.originalFilename);
      });
      albums.save(album, ()=> res.redirect('/albums'));
    }
    else{
      res.redirect('/albums');
    }
  });
};

exports.destroy = (req, res)=>{
  var albumID = Mongo.ObjectID(req.params.id);
  albums.findOne({_id: albumID}, (err, record)=>{
    var directory = record.directory;
    rimraf(`${__dirname}/../static/img/${directory}`, ()=>{
      albums.findAndRemove({_id: albumID}, ()=>{
        res.redirect('/albums');
      });
    });
  });
};

exports.show = (req, res)=>{
  var albumID = Mongo.ObjectID(req.params.id);
  albums.findOne({_id: albumID}, (err, record)=>{
    res.render('albums/show', {album: record});
  });
};
