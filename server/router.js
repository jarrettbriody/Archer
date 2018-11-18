const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword',
            mid.requiresSecure,
            mid.requiresLogin,
            controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/tasks', mid.requiresLogin, controllers.Task.createTaskListPage);
  // app.get('/createTask', mid.requiresLogin, controllers.Task.createTaskPage);
  app.post('/getOneTask', mid.requiresLogin, controllers.Task.getOneTask);
  app.post('/createTask', mid.requiresLogin, controllers.Task.createTask);
  app.post('/deleteTask', mid.requiresLogin, controllers.Task.deleteTask);
  app.post('/updateTask', mid.requiresLogin, controllers.Task.updateTask);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
