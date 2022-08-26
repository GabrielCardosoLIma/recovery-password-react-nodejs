const usersRoutes = require('express').Router();
const { validarToken } = require('../middlewares/Auth')
const Users = require('../controllers/users.controller');

usersRoutes.get('/validatoken', validarToken, Users.validaToken)

usersRoutes.get('/all',  validarToken, Users.findAll)

usersRoutes.get('/show/:id',  validarToken, Users.findOne)

usersRoutes.post('/login', Users.findOne2)

usersRoutes.post('/create',  validarToken, Users.create)

usersRoutes.post('/recoverypassword',  Users.recovery)

usersRoutes.post('/updatepassword',  Users.updatepassword)

module.exports = usersRoutes;