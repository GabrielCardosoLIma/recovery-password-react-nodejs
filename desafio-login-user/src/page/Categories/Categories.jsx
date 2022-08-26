import React, { useContext } from "react";
import { Context } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Atom } from "phosphor-react";
import { BsGithub } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./style.css";

export const Categories = () => {
  const token = localStorage.getItem("token");
  const { authenticated, handleLogout } = useContext(Context);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container className="aling-navbar">
          <Navbar.Brand href="/">Consulta Categorias</Navbar.Brand>
          <Nav>
            <Nav.Link className="aling-text" href="/categorias">Categorias</Nav.Link>
            <Nav.Link href="/listacategorias">Lista de Categorias</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="aling-body">
        <Atom className="aling-atom" size={80} color="rgb(0, 162, 255)" />
          <h3 className="title">
            Realize sua consulta através da <Link className="link-categories" to="/listacategorias">Lista de Categorias</Link>
          </h3>
          <h6 className="title">
            Consulta de categorias através de uma api, desenvolvida pelo professor Fernando Jacinto Silva e o alunos de TI.I/21 do Senac Campinas.
          </h6>
          <p className="title">
            <span className="title-react">React</span> / <span className="title-node">NodeJs</span>
          </p>
          <br />
          <br />
          <br />
          <div className="aling-icon">
            <BiUserCircle className="icon" color="#fff" size={52}/>
            <h3 className="title-name">Aluno: Gabriel Cardoso Lima</h3>
          </div>
          <div className="aling-icon">
            <BsGithub className="icon" color="#fff" size={40}/>
              <h4 className="title-name">GitHub:
              <a className="link-categories-github" href="https://github.com/GabrielCardosoLIma"> GabrielCardosoLIma</a>
          </h4>
          </div>
        </div>
      </div>
  );
};
