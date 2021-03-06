'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var artists = traceur.require(__dirname + '/../routes/artists.js');
  var albums = traceur.require(__dirname + '/../routes/albums.js');
  var songs = traceur.require(__dirname + '/../routes/songs.js');


  app.get('/', dbg, home.index);

  app.get('/artists', dbg, artists.index);
  app.get('/artists/:id', dbg, artists.show);
  app.post('/artists', dbg, artists.create);
  app.post('/artists/:id/delete', artists.destroy);

  app.get('/albums', dbg, albums.index);
  app.get('/albums/:id', dbg, albums.show);
  app.post('/albums', dbg, albums.create);
  app.post('/albums/:id/delete', dbg, albums.destroy);

  app.get('/songs', dbg, songs.index);
  app.post('/songs', dbg, songs.create);
  app.post('/songs/:id/delete', dbg, songs.destroy);
  app.get('/songs/:id', dbg, songs.show);

  console.log('Routes Loaded');
  fn();
}
