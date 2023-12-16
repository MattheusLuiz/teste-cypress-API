/// <reference types="cypress" />


describe('Funcionalidade Produtos', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/produtos',
        }).then((response) => {
            expect(response.body.produtos[0].nome).to.equal('Teclado Mecanico1')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });


    it('Cadastrar prduto', () => {
        let produto = `Teclado Mecanico ${Math.floor(Math.random() * 10000)}`
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/produtos',
            headers: { authorization: token },
            body: {
                "nome": produto,
                "preco": 300,
                "descricao": "Produto Novo",
                "quantidade": 2
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, 'Telcado Mecanico', 250, 'Descricao do produto novo', 180)
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Deve editar um produto ja cadastrado', () => {
        cy.request('http://localhost:3000/produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `http://localhost:3000/produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": "Teclado Mecanico1",
                    "preco": 500,
                    "descricao": "Produto Editado1",
                    "quantidade": 100
                }
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    });


    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Mouse Gamer ${Math.floor(Math.random() * 10000000)}`
        cy.cadastrarProduto(token, produto, 250, "Descricao do produto novo", 180)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'PUT',
                    url: `http://localhost:3000/produtos/${id}`,
                    headers: { authorization: token },
                    body: {
                        "nome": produto,
                        "preco": 300,
                        "descricao": "Produto Editado 1",
                        "quantidade": 2
                    }
                })
            });
    });
    it.only('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Mouse Gamer ${Math.floor(Math.random() * 10000000)}`
        cy.cadastrarProduto(token, produto, 250, "Descricao do produto novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `http://localhost:3000/produtos/${id}`,
                headers: { authorization: token },
            }).then(response => {
                expect(response.body.message).to.equal("Registro excluído com sucesso")
            })
        })
    });
});