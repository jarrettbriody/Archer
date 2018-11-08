const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getCharacters', mid.requiresLogin, controllers.Character.getCharacters);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/characterCreator', mid.requiresLogin, controllers.Character.createCharacterPage);
  app.post('/createCharacter', mid.requiresLogin, controllers.Character.createCharacter);
  app.post('/deleteCharacter', mid.requiresLogin, controllers.Character.deleteCharacter);
  app.post('/loadGame', mid.requiresLogin, controllers.Character.setCurrentCharacter);
  app.get('/archer', mid.requiresLogin, controllers.Archer.gamePage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
