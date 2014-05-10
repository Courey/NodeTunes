/* jshint unused:false */
'use strict';
var multiparty = require('multiparty');
var fs = require('fs');
var artists = global.nss.db.collection('artists');
var Mongo = require('mongodb');
var rimraf = require('rimraf');


exports.index = (req, res)=>{
  artists.find().toArray((err, records)=>{
    res.render('artists/index', {artists: records, title:'Artists Index'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var artist = {};
    var artistDirectoryName = fields.artistName[0].replace(/[-'" ]/g, '');
    if(!fs.existsSync(`${__dirname}/../static/img/${artistDirectoryName}`)){
      artist.name = fields.artistName[0];
      artist.photos = [];
      artist.directory = artistDirectoryName;

      fs.mkdirSync(`${__dirname}/../static/img/${artistDirectoryName}`);

      files.photos.forEach(photo=>{
        fs.renameSync(photo.path, `${__dirname}/../static/img/${artistDirectoryName}/${photo.originalFilename}`);
        artist.photos.push(photo.originalFilename);
      });
      artists.save(artist, ()=> res.redirect('/artists'));
    }
    else{
      res.redirect('/artists');
    }
  });
};

exports.destroy = (req, res)=>{
  var artistID = Mongo.ObjectID(req.params.id);
  artists.findOne({_id: artistID}, (err, record)=>{
    var directory = record.directory;
    rimraf(`${__dirname}/../static/img/${directory}`, ()=>{
      artists.findAndRemove({_id: artistID}, ()=>{
        res.redirect('/artists');
      });
    });
  });
};

exports.show = (req, res)=>{
  var artistID = Mongo.ObjectID(req.params.id);
  artists.findOne({_id: artistID}, (err, record)=>{
    res.render('artists/show', {artist: record});
  });
};
