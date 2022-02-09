import selectors from "../../fixtures/luma/selectors/checkout"
import checkout from "../../fixtures/checkout"

export class Checkout {

    static elements = {
        openApplyDiscountLuma: "#block-discount > .title",
        couponFieldLuma: "#coupon_code",
        applyDiscountButtonLuma: "#discount-coupon-form .action.apply.primary",
    }

    static enterShippingAddress(shippingAddress) {
        cy.get(selectors.customerEmailField).type(shippingAddress.email)
        cy.get(selectors.firstNameField).type(shippingAddress.firstname)
        cy.get(selectors.lastNameField).type(shippingAddress.lastname)
        cy.get(selectors.companyField).type(shippingAddress.companyname)
        cy.get(selectors.addressField).eq(0).type(shippingAddress.street)
        cy.get(selectors.cityField).type(shippingAddress.city)
        cy.get(selectors.postCodeField).type(shippingAddress.postcode)
        cy.get(selectors.countryField).select('United Kingdom')
        cy.get(selectors.telephoneField).type(shippingAddress.tel)
    }

    static addProductToCart(productUrl) {
        cy.visit(productUrl)
        cy.get(selectors.addToCartButton).click()
    }

    static addCoupon(couponCode) {
        cy.visit(checkout.cartUrl)
        cy.wait(5000)
        cy.get(this.elements.openApplyDiscountLuma).click({force: true})
        cy.get(this.elements.couponFieldLuma).type(couponCode)
        cy.get(this.elements.applyDiscountButtonLuma).click()
        cy.visit(checkout.cartUrl)
    }
}
