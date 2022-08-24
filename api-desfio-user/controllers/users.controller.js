const User = require('../models/Users')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const sendMail = require('../Providers/mailProvider');
const crypto = require('crypto');

exports.findAll = async (req, res) =>{
    await User.findAll({
        attributes: ['id', 'name', 'email', 'password'],
        order:[['name', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`
        })
    })

}

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
}

exports.create = async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    let gender = dados.gender;

    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += '<div style="background-color:#000; margin-bottom:150px;">';
        htmlbody += '<div style="margin-top:150px;">';
        htmlbody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
        htmlbody += 'Olá {name},';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
        htmlbody += 'Sua conta foi criada com sucesso!';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Seu login é o seu email: {email}';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Sexo: {gender}';
        htmlbody += '</p>';
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{name}', name);
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{gender}', gender);
        /* ************* */
        sendMail(to, cc, 'Sua conta foi criada com sucesso!', htmlbody);

        return res.json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
}

exports.update = async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
}

exports.findOne2 = async (req, res) => {
    await sleep(3000);
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  const user = await User.findOne({
    attributes: ["id", "name", "email", "password"],
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Email ou senha incorreta!!!",
    });
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Email ou senha incorreta!!!",
    });
  }

  var token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: 900, //10min
  });

  return res.json({
    erro: false,
    mensagem: "Login realizado com sucesso!!!",
    token,
  });
};

exports.validaToken = async (req, res) => {
    await User.findByPk(req.userId, {
        attributes: ["id", "name", "email"],
    })
    .then((user) => {
        return res.status(200).json({
            erro: false,
            user,
        });
    })
    .catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar o login!!!",
        });
    });
};

exports.recovery = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                erro: true,
                mensagem: 'Error: Usuário não encontrado!'
            })
        }
        const token = crypto.randomBytes(6).toString('hex')
        await User.update({ verificationcode: token }, { where: { email: email } })
        .then(() => {
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += 'Olá Usuário(a), sua solicitação de troca de senha foi gerada com sucesso !';
        htmlbody += '</br>';
        htmlbody += '</br>';
        htmlbody += 'Seus dados cadastrados:';
        htmlbody += '<br>';
        htmlbody += 'E-mail: <strong>{email}</strong>';
        htmlbody += '</br>';
        htmlbody += 'Para continuar com o processo de troca de Senha é necessário usar o código abaixo:'
        htmlbody += '</br>';
        htmlbody += '<strong>{token}</strong>'
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{token}', token);
        /* ************* */
        sendMail(to, cc, 'Código de recuperação de senha!', htmlbody);
            return res.json({
                erro: false,
                mensagem: "Seu código de verificação foi enviado ao seu e-mail!",
            });
        })
          .catch((err) => {
            return res.status(400).json({
              erro: true,
              mensagem: `Erro: ${err}... O código de verificação não foi enviado!`,
            });
          });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            erro:true,
            mensagem: "Erro: Não foi possivel enviar o código de verificação, tente de novo!"
        })
    }
}

exports.updatepassword = async (req, res, next) => {
    const { email, verificationcode, password} = req.body;
    const { token } = verificationcode;
    try {
        const user = await User.findOne({ verificationcode: token }, { where: { email: email }})
        if (email !== user.email) {
            return res.status(404).json({
                erro: true,
                mensagem: 'Error: Usuário não encontrado!'
            })
        }
        if(verificationcode === user.verificationcode) {
            res.status(200).json({
                erro: false,
                mensagem: `Sucesso!`
            })
        }else {
            res.status(400).json({
                erro:true,
                mensagem: `Erro: Token Inválido!`
            })
        }
        const newPassword = await bcrypt.hash(password, 8)
        newPassword = await User.update({ password: newPassword }, { where: { email: email } })
        .then(() => {
            return res.status(200).json({
                erro: false,
                mensagem: `Sucesso!`
            })
        }).catch((err) => {
            return res.status(400).json({
                erro: false,
                mensagem: `Erro: ${err}!`
            })
        })
    } catch (error) {
        next(error);
    }
    }