import React, { useState,useEffect } from "react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import { UserCircle } from "phosphor-react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./categoriesForms.css";

const initialValue = {
  name: "",
  description: ""
};

export const CategoriesForm = (props) => {
    
    const history = useHistory();

  const [id] = useState(props.match.params.id);

  const [values, setValues] = useState(initialValue);
  const [acao, setAcao] = useState("Novo");
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false
  });

  const valorInput = (e) =>
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
    useEffect( () => {
      const getUser = async () => {
        const valueToken = localStorage.getItem("token");
        const headers = {
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + valueToken
          },
        };
        await api.get("/categories/show/"+id, headers)
          .then((response) => {
            console.log(response);
            if(response.data.Categorie){
              setValues(response.data.Categorie);
              setAcao('Editar');
            } else {
            setStatus({
              type: "warning",
              mensagem: "Usuário não encontrado!!!",
            })
          }
          }).catch((err) => {
            if (err.response) {
              setStatus({
                type: "error",
                mensagem: err.response.data.mensagem,
              });
            } else {
              setStatus({
                type: "error",
                mensagem: "Erro: Tente mais tarde!",
              });
            }
          });
      }
      if(id) getUser();
    }, [id])

  const formSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    const valueToken = localStorage.getItem("token");
    const headers = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + valueToken
      },
    };
    if(!id){
      await api.post("/categories/create", values, headers)
          .then( (response) => {
                  setStatus({loading: false});
                  return history.push('/listacategorias')
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
    } else {
      await api.put("/categories/update", values, headers)
          .then( (response) => {
                  console.log(response);
                  setStatus({loading: false});
                  return history.push('/categorias')
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
}

  return (
    <div className="box">
      <Form onSubmit={formSubmit} className="borderForm">
        <h1>Cadastre sua categoria</h1>
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
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label className="FormLabel">Nome:</Form.Label>
          <Form.Control
            type="name"
            name="name"
            value={values.name}
            onChange={valorInput}
            placeholder="Digite o nome"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Descrição:</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={values.description}
            onChange={valorInput}
            placeholder="Digite a descrição"
          />
        </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Aguarde...
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Cadastrar
          </Button>
        )}
      </Form>
    </div>
  );
};