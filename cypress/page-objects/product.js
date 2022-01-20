export class Product {

    static routes = {
        simpleProduct: '/didi-sport-watch.html',
        category: '/women/tops-women.html',
        wishlist: '/wishlist',
        checkout: '/checkout',
        cart: '/checkout/cart',
    }

    static navigate() {
        cy.visit('/')
    }
}
