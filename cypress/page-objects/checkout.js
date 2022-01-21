import selectors from "../fixtures/selectors/luma/checkout"
import checkout from "../fixtures/checkout"
import product from "../fixtures/product.json";

export class Checkout {

    /** Selectors **/
    static elements = {
        openApplyDiscount: "#block-discount > .title",
        couponField: "#coupon_code",
        applyDiscountButton: "#discount-coupon-form button",
    }

    static enterShippingAddress(shippingAddress) {
        cy.get(selectors.customerEmailField).type(shippingAddress.email)
        cy.get(selectors.firstNameField).type(shippingAddress.firstname)
        cy.get(selectors.lastNameField).type(shippingAddress.lastname)
        cy.get(selectors.companyField).type(shippingAddress.companyname)
        cy.get(selectors.addressField).eq(0).type(shippingAddress.street)
        cy.get(selectors.cityField).type(shippingAddress.city)
        cy.get(selectors.postCodeField).type(shippingAddress.postcode)
        cy.get(selectors.countryField).select('Deutschland')
        cy.get(selectors.telephoneField).type(shippingAddress.tel)
    }

    static addProductToCart(productUrl) {
        cy.visit(productUrl)
        cy.get(selectors.addToCartButton).click()
    }

    static addCoupon(couponCode) {
        cy.visit(checkout.cartUrl)
        cy.wait(4000)
        cy.get(this.elements.openApplyDiscount).click({force: true})
        cy.get(this.elements.couponField).type(couponCode)
        cy.get(this.elements.applyDiscountButton).click()
    }
}
