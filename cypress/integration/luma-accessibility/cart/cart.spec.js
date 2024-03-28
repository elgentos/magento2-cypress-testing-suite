import { Cart } from '../../../page-objects/luma/cart';
import cartLuma from '../../../fixtures/luma/selectors/cart';
import {checkAccessibility} from "../../../support/utils"

describe('Cart accessibility tests', () => {
    it('Check cart', () => {
        Cart.addProductToCart(cartLuma.url.product1Url);
        cy.visit(cartLuma.url.cartUrl);
        cy.wait(3000);

        cy.injectAxe()
        checkAccessibility()
    });
});
