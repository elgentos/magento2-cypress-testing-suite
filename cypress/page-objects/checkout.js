import selectors from "../fixtures/selectors/hyva/checkout.json";
import checkout from "../fixtures/checkout.json";

export class Checkout {
    static enterShippingAddress(shippingAddress) {
        cy.get(selectors.companyLabel).type(shippingAddress.companyname);
        cy.get(selectors.firstNameLabel).type(shippingAddress.firstname);
        cy.get(selectors.lastNameLabel).type(shippingAddress.lastname);
        cy.get(selectors.addressLabel).eq(0).type(shippingAddress.street);
        // in a regular if/else
        cy.get(selectors.cityLabel).type(shippingAddress.city);
        cy.get(selectors.postCodeLabel).type(shippingAddress.postcode);
        cy.get(selectors.countryLabel)
            .click()
            .parent()
            .siblings()
            .first()
            .select(shippingAddress.country);
        if (shippingAddress.country === "United States") {
            cy.get(selectors.regionLabel).select(shippingAddress.region);
        }
        cy.get(selectors.telephoneLabel).type(shippingAddress.tel);
    }

    static addSimpleProductToCart(productUrl) {
        cy.visit(productUrl);
        cy.get(selectors.addToCartButton).click();
    }

    static addCoupon(couponCode) {
        cy.visit(checkout.cartUrl);
        cy.get(selectors.openApplyDiscount).click();
        cy.get(selectors.couponField).type(couponCode);
        cy.get(selectors.applyDiscountButton).click();
    }
}
