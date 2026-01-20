const connection = require('../config/db');
const bcrypt = require('bcrypt');

class PlayerController {
  openRegister = (req, res) => {
    res.render('registerPlayer.ejs', { message: '' });
  };

  register = (req, res) => {
    const { name, last_name, email, password, description } = req.body;
    const img = req.file ? req.file.filename : 'user_por_defecto.png';
    if (!name || !last_name || !email || !password) {
      res.render('registerPlayer.ejs', {
        message: 'Tienes que rellenar todos los campos',
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          throw err;
        } else {
          let sql = `INSERT INTO player (name, last_name, email, password, description, img) VALUES ("${name}","${last_name}","${email}","${hash}","${description}","${img}")`;
          connection.query(sql, (err, result) => {
            if (err) {
              if (err.errno == 1062) {
                res.render('registerPlayer', {
                  message: 'El email ya existe. Introduce otro',
                });
              } else {
                throw err;
              }
            } else {
              res.redirect('/');
            }
          });
        }
      });
    }
  };
  openPlayer = (req, res) => {
    let sql = `SELECT * FROM player`;
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render('index.ejs', { openPlayer: result });
      }
    });
  };


  onePlayer = (req, res) => {
    const {id} = req.params;
    let sql = `SELECT player.*, game.name_game, game.plataform, game.review, game.id_game, game.starrating, game.year_release, game.game_img FROM player LEFT JOIN game ON player.id_player = game.id_player AND game.game_is_del = 0 WHERE player.player_is_del = 0 AND player.id_player = ?`;
    let values = [id];
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
       const {id_player, name, last_name, email, description, img} = result[0]

       let player = {
        id_player: id_player,
        name: name,
        last_name: last_name,
        email: email,
        description: description,
        img: img
       }
       let games = []

       result.forEach((elem)=>{
        if(elem.id_game != null){
          let newGame = {
            id_game: elem.id_game,
            name_game: elem.name_game,
            plataform: elem.plataform,
            year_release: elem.year_release,
            starrating: elem.starrating,
            review: elem.review,
            game_img: elem.game_img
          }
          games.push(newGame);
        }
       })
       res.render('onePlayer.ejs', { player: player, games: games, id_player: player.id_player });
      }
    });
  };

  login = (req, res) => {
    res.render('login.ejs', { message: '' });
  };


  insertLogin = (req, res) => {
    const { email, password } = req.body;

    let sql = `SELECT * FROM player where email = ?`;
    let values = [email];
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length == 1) {
          let hashedPass = result[0].password;

          //método que compara un string normal con otro encriptado o hasheado
          bcrypt.compare(password, hashedPass, (errComp, resultCompare) => {
            if (errComp) {
              throw errComp;
            } else {
              if (resultCompare == true) {
                //las contraseñas son iguales
                res.redirect(`/player/usuario/${result[0].id_player}`);
              } else {
                //las contraseñas no coinciden
                res.render('login', { message: 'Contraseña no válida' });
              }
            }
          });
        } else {
          res.render('login', { message: 'Email no existe' });
        }
      }
    });
  };
}

module.exports = new PlayerController();
