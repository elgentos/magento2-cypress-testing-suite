import selectors from '../../fixtures/luma/selectors/checkout'
import checkout from '../../fixtures/checkout'

export class Checkout {

    static elements = {
        openApplyDiscountLuma: "#block-discount > .title",
        couponFieldLuma: "#coupon_code",
        applyDiscountButtonLuma: "#discount-coupon-form .action.apply.primary",
    }

    static enterShippingAddress(shippingAddress) {
        cy.get(selectors.customerEmailField).type(shippingAddress.email)
        cy.get(`${selectors.shippingContainer} ${selectors.firstNameField}`).type(shippingAddress.firstname)
        cy.get(`${selectors.shippingContainer} ${selectors.lastNameField}`).type(shippingAddress.lastname)
        cy.get(`${selectors.shippingContainer} ${selectors.companyField}`).type(shippingAddress.companyname)
        cy.get(`${selectors.shippingContainer} ${selectors.addressField}`).eq(0).type(shippingAddress.street)
        cy.get(`${selectors.shippingContainer} ${selectors.cityField}`).type(shippingAddress.city)
        cy.get(`${selectors.shippingContainer} ${selectors.postCodeField}`).type(shippingAddress.postcode)
        cy.get(`${selectors.shippingContainer} ${selectors.countryField}`).select('NL')
        cy.get(`${selectors.shippingContainer} ${selectors.telephoneField}`).type(shippingAddress.tel)
    }

    static enterBillingAddress(shippingAddress) {
        cy.get(`${selectors.billingContainer} ${selectors.customerEmailField}`).type(shippingAddress.email)
        cy.get(`${selectors.billingContainer} ${selectors.firstNameField}`).type(shippingAddress.firstname)
        cy.get(`${selectors.billingContainer} ${selectors.lastNameField}`).type(shippingAddress.lastname)
        cy.get(`${selectors.billingContainer} ${selectors.companyField}`).type(shippingAddress.companyname)
        cy.get(`${selectors.billingContainer} ${selectors.addressField}`).eq(0).type(shippingAddress.street)
        cy.get(`${selectors.billingContainer} ${selectors.cityField}`).type(shippingAddress.city)
        cy.get(`${selectors.billingContainer} ${selectors.postCodeField}`).type(shippingAddress.postcode)
        cy.get(`${selectors.billingContainer} ${selectors.countryField}`).select('NL')
        cy.get(`${selectors.billingContainer} ${selectors.telephoneField}`).type(shippingAddress.tel)
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
