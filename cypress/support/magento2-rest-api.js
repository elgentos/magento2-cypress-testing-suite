export class Magento2RestApi {
    static createCustomerAccount(customer) {
        cy.request({
            method: 'POST',
            url: '/rest/all/V1/customers',
            body: customer,
            failOnStatusCode: false,
            timeout: 100000
        }).then((response) => {
            // Conditional testing is bad mmkay, I just haven't found a way to expect oneOf in different properties yet
            if (response.body.hasOwnProperty('message')) {
                cy.log(response.body.message)
                // expect(response.body.message).to.equal('Property "StreetAddress" does not have accessor method "getStreetAddress" in class "Magento\\Customer\\Api\\Data\\CustomerInterface".');
                expect(response.body.message).to.equal('Ein Kunde mit der gleichen E-Mail-Adresse existiert bereits in einer zugeordneten Website.');
            } else if (response.body.hasOwnProperty('email')) {
                cy.log(response.body.message)
                expect(response.body.email).to.equal(customer.customer.email);
            }
        });
    }

    static logCustomerIn(customer) {
        cy.request({
            method: 'POST',
            url: '/rest/all/V1/integration/customer/token',
            body: customer,
            timeout: 50000
        }).then((response) => {
            // TODO: do something with the token...
            cy.log(response.body)
            console.log(response.body)
        })
        // @TODO log customer in through API, set cookie and then continue tests as in account.spec.js
    }

    static updateProductQty(sku, qty) {
        cy.request({
            method: 'PUT',
            url: `/rest/V1/products/${sku}/stockItems/1`,
            body: {
                stockItem: {
                    qty: qty
                }
            },
            headers: {
                authorization: "Bearer " + Cypress.env('MAGENTO2_ADMIN_TOKEN')
            },
            timeout: 100000
        }).then((response) => {
            console.log(response.body);
        });
    }
}
