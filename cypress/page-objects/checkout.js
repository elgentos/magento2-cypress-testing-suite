// Luma
import selectorsLuma from "../fixtures/selectors/luma/checkout"
import checkoutLuma from "../fixtures/luma/checkout"

// Hyva
import selectorsHyva from "../fixtures/selectors/hyva/checkout"
import checkoutHyva from "../fixtures/hyva/checkout"

export class Checkout {

    /** Selectors **/
    static elements = {
        // Luma elements
        openApplyDiscountLuma: "#block-discount > .title",
        couponFieldLuma: "#coupon_code",
        applyDiscountButtonLuma: "#discount-coupon-form .action.apply.primary",

        // Hyva elements
        openApplyDiscountHyva: "div > div > div.text-left > span > span",
        couponFieldHyva: "#coupon_code",
        applyDiscountButtonHyva: "#discount-coupon-form button",
    }

    static enterShippingAddress(shippingAddress) {
        if (Cypress.env('isLuma')) {
            cy.get(selectorsLuma.customerEmailField).type(shippingAddress.email)
            cy.get(selectorsLuma.firstNameField).type(shippingAddress.firstname)
            cy.get(selectorsLuma.lastNameField).type(shippingAddress.lastname)
            cy.get(selectorsLuma.companyField).type(shippingAddress.companyname)
            cy.get(selectorsLuma.addressField).eq(0).type(shippingAddress.street)
            cy.get(selectorsLuma.cityField).type(shippingAddress.city)
            cy.get(selectorsLuma.postCodeField).type(shippingAddress.postcode)
            cy.get(selectorsLuma.countryField).select('United Kingdom')
            cy.get(selectorsLuma.telephoneField).type(shippingAddress.tel)
        }

        if (Cypress.env('isHyva')) {
            cy.get(selectorsHyva.companyLabel).type(shippingAddress.companyname)
            cy.get(selectorsHyva.firstNameLabel).type(shippingAddress.firstname)
            cy.get(selectorsHyva.lastNameLabel).type(shippingAddress.lastname)
            cy.get(selectorsHyva.addressLabel).eq(0).type(shippingAddress.street)
            // in a regular if/else
            cy.get(selectorsHyva.cityLabel).type(shippingAddress.city)
            cy.get(selectorsHyva.postCodeLabel).type(shippingAddress.postcode)
            cy.get(selectorsHyva.countryLabel).click().parent().siblings().first().select(shippingAddress.country)
            if (shippingAddress.country === 'United States') {
                cy.get(selectorsHyva.regionLabel).select(shippingAddress.region)
            }
            cy.get(selectorsHyva.telephoneLabel).type(shippingAddress.tel)
        }
    }

    static addProductToCart(productUrl) {
        if (Cypress.env('isLuma')) {
            cy.visit(productUrl)
            cy.get(selectorsLuma.addToCartButton).click()
        }

        if (Cypress.env('isHyva')) {
            cy.visit(productUrl)
            cy.get(selectorsHyva.addToCartButton).click()
        }
    }

    static addCoupon(couponCode) {
        if (Cypress.env('isLuma')) {
            cy.visit(checkoutLuma.cartUrl)
            cy.wait(5000)
            cy.get(this.elements.openApplyDiscountLuma).click({force: true})
            cy.get(this.elements.couponFieldLuma).type(couponCode)
            cy.get(this.elements.applyDiscountButtonLuma).click()
            cy.visit(checkoutLuma.cartUrl)
        }

        if (Cypress.env('isHyva')) {
            cy.visit(checkoutHyva.cartUrl)
            cy.get(this.elements.openApplyDiscountHyva).click()
            cy.get(this.elements.couponFieldHyva).type(couponCode)
            cy.get(this.elements.applyDiscountButtonHyva).click()
        }
    }
}
