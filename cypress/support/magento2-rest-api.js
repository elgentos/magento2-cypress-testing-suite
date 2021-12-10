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
                expect(response.body.message).to.equal('A customer with the same email address already exists in an associated website.');
            } else if (response.body.hasOwnProperty('email')) {
                expect(response.body.email).to.equal(customer.customer.email);
            }
        });
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
