import React, { useState, useContext } from "react";
// import Container from "react-bootstrap/container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';
import { UserCircle } from "phosphor-react";
import { Envelope  } from "phosphor-react";
import { LockLaminated  } from "phosphor-react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";

export function Login() {
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false,
  });

  const valorInput = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const loginSubmit = async (e) => {
    e.preventDefault();
    // console.log(user.email);
    // console.log(user.password);
    const headers = {
      "Content-Type": "application/json",
    };

    setStatus({
      loading: true,
    });

    await api.post("/user/login", user, { headers })
      .then((response) => {
        return history.push("/recoverypassword");
      })
      .catch((error) => {
        setStatus({
          type: "error",
          mensagem: "erro: tente mais tarde!",
        });
        if (error.response) {
          // console.log(error.response)
          setStatus({
            type: "error",
            mensagem: error.response.data.mensagem,
            loading: false,
          });
        }
      });
  };

  return (
    <div className="box">
      <div class="context">
      </div>
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Form onSubmit={loginSubmit} className="borderForm">
        {status.type == "error" ? (
          <Alert variant="danger">{status.mensagem}</Alert>
        ) : (
          ""
        )}
        {status.type == "success" ? (
          <Alert variant="success">{status.mensagem}</Alert>
        ) : (
          ""
        )}
        {status.loading ? (
          <Alert variant="warning">Validando...</Alert>
        ) : (
          ""
        )}
        <div className="user">
          <UserCircle size={80} color="#030202" />{" "}
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <label className="FormLabel">
            Nome de Usuário ou Endereço de Email:
          </label>
          <div className="aling-email">
            <Form.Control
              className="style-input"
              type="email"
              name="email"
              onChange={valorInput}
              placeholder="Digite seu e-mail ou usuário"
            />
            <Envelope className="icon-email-password" size={35} color="#000" />
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <label className="FormLabel">Senha:</label>
          <div className="aling-email">
            <Form.Control
              className="style-input"
              type="password"
              name="password"
              onChange={valorInput}
              placeholder="Digite sua senha"
            />
          <LockLaminated className="icon-email-password" size={35} color="#000" />
          </div>
          <div className="aling-singnUp-pass">
            <p>
              <a className="link-singUp-pass">Não tem cadastro? Cadastre-se</a>
            </p>
            <p>
              <Link to="/recoverypassword" className="link-singUp-pass">
                Esqueci minha senha
              </Link>
            </p>
          </div>
        </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Login
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Login
          </Button>
        )}
      </Form>
    </div>
  );
}