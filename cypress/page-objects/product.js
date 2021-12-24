export class Product {

    static routes = {
        simpleProduct: '/didi-sport-watch.html',
        category: '/women/tops-women.html',
        wishlist: '/wishlist',
        checkout: '/checkout',
        configurableProduct: "/breathe-easy-tank.html",
    }

    static navigate() {
        cy.visit('/')
    }
}
