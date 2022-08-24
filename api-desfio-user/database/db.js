const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
});


sequelize.authenticate().then( function() {
    console.log('Conexâo com banco de dados realizado com sucesso!');
}).catch( function(err){
    console.log(`Erro de Conexâo: ${err}` );
})

module.exports = sequelize;