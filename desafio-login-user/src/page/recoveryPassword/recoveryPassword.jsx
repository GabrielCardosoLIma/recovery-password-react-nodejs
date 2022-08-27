import React, { useState,useEffect } from "react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import { UserCircle } from "phosphor-react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./recoveryPasword.css";

export const RecoveryPassword = () => {
    
  const history = useHistory();

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false
  });

  const [user, setUser] = useState({
    email: '',
  })

  const valorInput = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
    
  const formSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    const headers = {
      "headers": {
        "Content-Type": "application/json"
      },
    };
    await api.post("/user/recoverypassword", user, headers)
          .then( (response) => {
                  setStatus({loading: false});
                  return history.push('/updatepassword')
              }).catch( (err) => {
                  if(err.response){
                      setStatus({
                          type: 'error',
                          mensagem: err.response.data.mensagem,
                          loading: false
                      })
                  } else {
                      setStatus({
                          type: 'error',
                          mensagem: 'Erro: tente mais tarde...',
                          loading: false
                      })
                  }
              })
}

  return (
    <div className="box">
      <Form onSubmit={formSubmit} className="borderForm">
        <h1>Recuperação de senha</h1>
        {status.type == "error" ? (
          <h3 className="p-alert-error">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.type == "success" ? (
          <h3 className="p-alert-success">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.loading ? (
          <h3 className="p-alert-validando">Validando...</h3>
        ) : (
          ""
        )}
        <div className="user">
          <UserCircle size={80} color="#030202" />{" "}
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="FormLabel">E-mail:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={valorInput}
            placeholder="Digite o seu e-mail"
          />
        </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Aguarde...
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Enviar
          </Button>
        )}
      </Form>
    </div>
  );
};