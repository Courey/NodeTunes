/* jshint unused:false */
'use strict';
var multiparty = require('multiparty');
var fs = require('fs');
var songs = global.nss.db.collection('songs');
var artists = global.nss.db.collection('artists');
var albums = global.nss.db.collection('albums');
var Mongo = require('mongodb');
var rimraf = require('rimraf');
var _ = require('lodash');


exports.index = (req, res)=>{

  songs.find().toArray((err, songs)=>{
    artists.find().toArray((err, artistsRecords)=>{
      albums.find().toArray((err, albumsRecords)=>{
        var songsRecords = songs.map(song=>{
          var artist = _(artistsRecords).find(artist => artist._id.toString() === song.artistID);
          console.log('HEY YOU!!va!!!!!!');
          song.artist = artist;

          var album = _(albumsRecords).find(album=> album._id.toString() === song.albumID);
          song.album = album;
          //console.log(album);
        //   var songAlbum = _(records).find(album=> album.albumID.toString() === album.albumID);
        //   album.albumID = songAlbum;
          return song;
       }); //album map

        //
        //
        // records = records.map(artist=>{
        //   var songArtist = _(records).find(artist=> artist.artistID.toString()=== artist.artistID);
        //   artist.artistID = songArtist;
        //   return artist;
        //});//artist map
        res.render('songs/index', {songs: songsRecords, artists: artistsRecords, albums: albumsRecords});
      });//album find
    });//artist find
  });// songs find
};//exports

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var song = {};
    var songDirectoryName = fields.songName[0].replace(/[-'" ]/g, '');
    if(!fs.existsSync(`${__dirname}/../static/audios/${songDirectoryName}`)){
      song.name = fields.songName[0];
      song.genre = fields.genre[0];
      song.audio = [];
      song.directory = songDirectoryName;
      song.artistID = fields.artistID[0];
      song.albumID = fields.albumID[0];


      fs.mkdirSync(`${__dirname}/../static/audios/${songDirectoryName}`);

      files.audio.forEach(audio=>{
        fs.renameSync(audio.path, `${__dirname}/../static/audios/${songDirectoryName}/${audio.originalFilename}`);
        song.audio.push(audio.originalFilename);
      });
      songs.save(song, ()=> res.redirect('/songs'));
    }
    else{
      res.redirect('/songs');
    }
  });
};

// exports.destroy = (req, res)=>{
//   var songID = Mongo.ObjectID(req.params.id);
//   songs.findOne({_id: songID}, (err, record)=>{
//     var directory = record.directory;
//     rimraf(`${__dirname}/../static/img/${directory}`, ()=>{
//       songs.findAndRemove({_id: songID}, ()=>{
//         res.redirect('/songs');
//       });
//     });
//   });
// };
//
// exports.show = (req, res)=>{
//   var songID = Mongo.ObjectID(req.params.id);
//   songs.findOne({_id: songID}, (err, record)=>{
//     res.render('songs/show', {song: record});
//   });
// };
