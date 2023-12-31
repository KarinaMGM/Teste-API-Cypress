/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('Kari@gmail.com.br', 'teste').then(tkn => { token = tkn })
     });

     it.only('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response =>{
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          }))
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `usuario` + `${Math.floor(Math.random() * 100000)}`
          let email = `${usuario}@qa.com.br`

          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               },
          }).then((response => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          }))
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": 'Fulano da Silva',
                    "email": 'beltanoqa.com.br',
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then((response => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
          }))

     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `usuario` + `${Math.floor(Math.random() * 100000)}`
          let email = `${usuario}@qa.com.br`

          cy.cadastrarUsuario(usuario, email, 'teste').then(response => {
               let id = response.body._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body: {
                         "nome": usuario,
                         "email": email,
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then((response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                    expect(response.status).to.equal(200)
               }))
          });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `usuario` + `${Math.floor(Math.random() * 100000)}`
          let email = `${usuario}@qa.com.br`

          cy.cadastrarUsuario(usuario, email, 'teste').then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body: {
                         "nome": usuario,
                         "email": email,
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then((response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
               }))
          });
     });


});
