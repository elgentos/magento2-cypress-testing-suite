import {Cart} from '../../../page-objects/luma/cart';
import cartLuma from '../../../fixtures/luma/selectors/cart';
import productLuma from '../../../fixtures/luma/product.json';
import {Magento2RestApi} from '../../../support/magento2-rest-api'
import {shouldHaveErrorMessage, shouldHaveSuccessMessage} from '../../../support/utils'

describe('Isolated test for adding a product to the cart', () => {
    it('Can add a product to the cart', () => {
        Cart.addProductToCart(productLuma.simpleProductUrl);
        shouldHaveSuccessMessage(`You added ${productLuma.simpleProductName} to your shopping cart.`)
    });
});

describe('Cart tests', () => {
    beforeEach(() => {
        cy.intercept('**/rest/*/V1/guest-carts/*/totals-information')
            .as('totalsInformation')

        Cart.addProductToCart(productLuma.simpleProductUrl);
        cy.visit(cartLuma.cartUrl);
        cy.wait('@totalsInformation')
    });

    it('Can change the quantity in the cart', () => {
        cy.get(cartLuma.qtyInputField)
            .type('{backspace}2{enter}')
            .should('have.value', '2');
    });

    it('Can remove a product from the cart', () => {
        cy.get(cartLuma.deleteProductButton).click();
        cy.get(cartLuma.emptyCartTextField)
            .should('include.text', 'You have no items in your shopping cart.')
            .should('be.visible');
    });

    it('Can add a coupon to the cart', () => {
        Magento2RestApi.createRandomCouponCode()
            .then(coupon => {
                Cart.addCouponCode(coupon)
                cy.get(cartLuma.cartSummaryTable)
                    .should('include.text', 'Discount')
                    .should('be.visible')
            })
    });

    it('Cannot add a non existing coupon', () => {
        Cart.addCouponCode('wrong coupon code')
        shouldHaveErrorMessage('The coupon code "wrong coupon code" is not valid.')
    });
});
