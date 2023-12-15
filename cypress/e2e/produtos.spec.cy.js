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
            expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical')
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
            body: {
                "nome": produto,
                "preco": 300,
                "descricao": "Produto Novo",
                "quantidade": 2
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it.only('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
       cy.cadastrarProduto(token, 'Telcado Mecanico', 250, 'Descricao do produto novo', 180)
        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });


});