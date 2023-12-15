/// <reference types="cypress" />


describe('Funcionalidade Produtos', () => {
    
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


    it.only('Cadastrar prduto', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/produtos',
            body:{
                "nome":"Teclado Mecanico1",
                "preco":300,
                "descricao":"Produto Novo",
                "quantidade":2
            },
            headers: {authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNzAyNjQyMjg2LCJleHAiOjE3MDI2NDI4ODZ9.2ulkM9cgOw2r3LZ8XPVxs-9f2B07Y9kIWFUs6wLsFQg'}
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso ')
        })
    });


});