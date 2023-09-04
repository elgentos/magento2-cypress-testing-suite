import product from "../../../fixtures/hyva/product.json";
import selectors from "../../../fixtures/hyva/selectors/category.json";

describe("Category page tests", () => {
    beforeEach(() => {
        cy.visit(product.categoryUrl);
    });

    it("Can visit the category page and filters on color red", () => {
        cy.get(selectors.shopByColorFilter).contains('Color').click();
        cy.get(selectors.selectColorRed).click();
        cy.get(selectors.activeFilterLabel).should("contain.text", "Color")
        cy.get(selectors.activeFilterValue).should("contain.text", "Red")
    });

    it("Can sort products on price from lowest to highest", () => {
        cy.get(selectors.sortBySelect).first().select(product.selectByPrice);
        cy.get(selectors.productPriceDataAtt)
            .eq(0)
            .invoke("data", "price-amount")
            .then((firstPrice) => {
                cy.get(selectors.productPriceDataAtt)
                    .eq(1)
                    .invoke("data", "price-amount")
                    .then((secondPrice) => {
                        expect(firstPrice).to.be.lessThan(secondPrice);
                    });
            });
    });

    it("Can change the number of products to be displayed", () => {
        cy.get(selectors.highestNumberOfProductsShowOption)
            .invoke("val")
            .then((numberOfProducts) => {
                cy.get(selectors.numberOfProductsSelect).first().select(
                    numberOfProducts
                );
                cy.get(selectors.numberOfShownItems)
                    .first()
                    .should("have.text", numberOfProducts);
                cy.get(selectors.categoryProductContainer)
                    .children()
                    .should("to.have.length.of.at.most", +numberOfProducts);
            });
    });

    it("Can see the correct breadcrumbs", () => {
        cy.get(selectors.breadcrumbsItem)
            .first()
            .should("contain.text", "Home");
        cy.get(selectors.breadcrumbsItem)
            .eq(1)
            .should("contain.text", `${product.category}`);
        cy.get(selectors.breadcrumbsItem)
            .eq(2)
            .should("contain.text", `${product.subCategory}`);
    });

    it("Can switch between grid and list view", () => {
        cy.get(selectors.categoryProductGridWrapper).should("be.visible");
        cy.get(selectors.listModeButton).first().click();
        cy.get(selectors.categoryProductListWrapper).should("be.visible");
    });

    it("Can move to the next page using the pages navigation", () => {
        cy.get(".column > section").then(($mainColumn) => {
            if ($mainColumn[0].querySelector(selectors.pageNavigation)) {
                cy.get(selectors.pageNavigation)
                    .first()
                    .should("to.have.length.of.at.most", 6);
                cy.get(selectors.pageLink).first().contains("2").click();
                // Check that we are on the second page, either of these assertions would be fine?
                cy.url().then((url) => {
                    expect(url.includes("p=2")).to.be.true;
                });
                cy.get(selectors.secondPageItem)
                    .first()
                    .should("include.text", "2")
                    .should("not.have.attr", "href");
            } else {
                cy.get(selectors.pageNavigation).should("not.exist");
            }
        });
    });
});
