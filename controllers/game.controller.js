const connection = require('../config/db');

class GamesControllers {
  openFormGamePlayer = (req, res) => {
    const { id_player } = req.params;
    res.render('formGamePlayer.ejs', { message: '', id_player: id_player });
  };

  addGamePlayer = (req, res) => {
    const { id_player } = req.params;
    const { name_game, plataform, year_release, starrating, review } = req.body;

    if (!name_game || !plataform || !year_release || !starrating || !review) {
      res.render('formGamePlayer.ejs', {
        message: 'Rellena todos los campos',
        id_player: id_player,
      });
    } else if (!req.file) {
      res.render('formGamePlayer.ejs', {
        message: 'Obligatorio subir foto',
        id_player: id_player,
      });
    } else {
      let sql = `INSERT INTO game(name_game, plataform, year_release, starrating, review, id_player, game_img) VALUES (?,?,?,?,?,?,?)`;
      let values = [
        name_game,
        plataform,
        year_release,
        starrating,
        review,
        id_player,
        req.file.filename,
      ];
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.redirect(`/player/usuario/${id_player}`);
        }
      });
    }
  };

  addGameInicio = (req, res) => {
    let sql = `SELECT id_player, name, last_name FROM player`;
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render('addGameInicio', { player: result, message:"" });
      }
    });
  };

  insertGameInicio = (req, res) => {
    const { id_player, name_game, plataform, year_release, starrating, review } = req.body;

    if (!id_player || !name_game || !plataform || !year_release || !starrating || !review ||!req.body) {
      let sql = `SELECT id_player, name, last_name FROM player`;
      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render('addGameInicio', { player: result, message: "Completar todos los campos" });
        }
      });
    } else if (!req.file){
      let sql = `SELECT id_player, name, last_name FROM player`;
      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render('addGameInicio', { player: result, message: "Completar todos los campos" });
        }
      })
    }else{
       let sql = `INSERT INTO game (id_player, name_game, plataform, year_release, starrating, review, game_img) VALUES (?,?,?,?,?,?,?)`
      let values = [id_player, name_game, plataform, year_release, starrating, review, req.file.filename]
      connection.query(sql, values, (err, result)=>{
        if(err){
          throw err
        }else{
          res.redirect(`/player/usuario/${id_player}`)
        }
      })}
    }

    openEditGame = (req, res)=>{
      const {id_game} = req.params;
      let sql = 'SELECT * FROM game WHERE id_game = ?'
      let values = [id_game]
      connection.query(sql, values, (err, result)=>{
        if(err){
          throw err
        }else{          
          res.render('editGame.ejs', {gameEditar: result[0], message: ""})
        }
      })
    }
    editGame = (req, res)=>{
      const {name_game, starrating, plataform, year_release, review} = req.body;
      const {id_game, id_player} = req.params;
      if (!name_game|| !starrating|| !plataform|| !year_release|| !review){
        res.send('faltan datos')
      }else{
        let sql = 'UPDATE game SET name_game =?, starrating=?, plataform=?, year_release=?, review=? WHERE id_game=?'
        let values = [name_game, starrating, plataform, year_release, review, id_game]
        connection.query(sql, values, (err, result)=>{
        if(err){
          throw err
        }else{
          res.redirect(`/player/usuario/${id_player}`)
        }
      })
      }
    }

    deleteGame = (req, res)=>{
      const {id_game, id_player} = req.params;
        let sql = 'DELETE FROM game WHERE id_game = ?'
        connection.query(sql, [id_game], (err, result)=>{
            if(err){
                throw err;
            }else{
                res.redirect(`/player/usuario/${id_player}`)
            }
        })
    }

    infoGame = (req,res)=>{
      const {id_game} = req.params;
      let sql = 'SELECT * FROM game WHERE id_game = ?'
      let values = [id_game]
      connection.query(sql, values, (err, result)=>{
        if(err){
          throw err
        }else{          
          res.render('infoGame.ejs', {games: result})
        }
      })
    }
  }


module.exports = new GamesControllers();
