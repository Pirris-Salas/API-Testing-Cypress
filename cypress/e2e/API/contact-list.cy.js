const endpoints = require('../../fixtures/endpoints.json')
const apiData = require('../../fixtures/contactData.json')

describe('CONTACT API TEST', () => {
        it('Get contact List', () => {
            // cy.request(endpoints.contacts)
            //     .then(response => {
            //         console.log(response)
            //     })

            cy.request({
                method: 'GET',
                url: endpoints.contacts,
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.statusText).to.equal("OK")
                expect(response.duration).to.be.lessThan(3000)
                expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')
            })
        })

        it.only('POST new contact', function () {
            cy.request({
                method: 'POST',
                url: endpoints.contacts,
                body: apiData.postData
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.statusText).to.equal("OK")
                expect(response.duration).to.be.lessThan(3000)
                expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')

                cy.wrap(response.body._id).as('contactID')
            })
        })

        it.only('GET contact {ID}', function () {
                cy.request({
                    method: 'GET',
                    url: endpoints.contacts + this.contactID,
                }).then(response => {
                    console.log(response.body)
                    expect(response.status).to.equal(200)
                    expect(response.statusText).to.equal("OK")
                    expect(response.duration).to.be.lessThan(3000)
                    expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')

                    expect(response.body.firstName).to.equal(apiData.postData.firstName)
                    expect(response.body.location.country).to.equal(apiData.postData.location.country)
                    expect(response.body.location).to.deep.equal(apiData.postData.location)
                })
        })

        it('PUT contact {ID}', function () {
            cy.request({
                method: 'PUT',
                url: endpoints.contacts + this.contactID,
                body: apiData.putData
            }).then(response => {
                console.log(response)
                expect(response.status).to.equal(204)
                expect(response).not.to.have.property('body')
                expect(response.duration).to.be.lessThan(3000)                
            })
        })

        it('DELETE contact {ID}', function () {
            cy.request({
                method: 'DELETE',
                url: endpoints.contacts + this.contactID,
            }).then(response => {
                console.log(response)
                expect(response.status).to.equal(204)
                expect(response.body).to.equal('')
                expect(response.duration).to.be.lessThan(3000)
            })
        })

        it.only('Negative - Get contact List NOT FOUND', () => {
            cy.request({
                method: 'GET',
                url: endpoints.contacts+"12",
                failOnStatusCode: false
            }).then(response => {
                console.log(response)
                expect(response.status).to.equal(404)
                expect(response.statusText).to.equal("Not Found")
                expect(response.duration).to.be.lessThan(3000)
            })
        })

        it('Negative - Missing First Name', () => {
            const newObject = apiData.postData
            newObject.firstName = ""

            cy.request({
                method: 'POST',
                url: endpoints.contacts,
                body: newObject,
                failOnStatusCode: false
            }).then(response => {
                console.log(response)
                expect(response.status).to.equal(400)
                expect(response.duration).to.be.lessThan(3000)
            })
        })

        it('Negative - Name Too Long', () => {
            const newObject = apiData.postData
            newObject.employer.company = "Google Google Google Google haasgluysd"

            cy.request({
                method: 'POST',
                url: endpoints.contacts,
                body: newObject,
                failOnStatusCode: false
            }).then(response => {
                console.log(response)
                expect(response.body.err).to.contain('is longer than the maximum allowed length (30).')
                expect(response.status).to.equal(400)
                expect(response.duration).to.be.lessThan(3000)
            })
        })

        it('Negative - Invalid Email', () => {
            const newObject2 = apiData.postData
            newObject2.lastName = "Arias;"

            cy.request({
                method: 'POST',
                url: endpoints.contacts,
                body: newObject2,
                failOnStatusCode: false
            }).then(response => {
                console.log(response)
                expect(response.status).to.equal(400)
                expect(response.duration).to.be.lessThan(3000)
                expect(response.body.err).to.contain('Validator failed for path `lastName` with value `Arias;')
            })
        })
})