# elgentos/magento2-cypress-testing-suite
A community-driven Cypress testing suite for Magento 2

This testing suite was announced in [Peter Jaap](https://twitter.com/PeterJaap) his talk about [Cypress testing in Magento 2 at Reacticon 4](https://youtu.be/2zDliMebOqs?t=4435). Watch the talk for more information about Cypress testing.

**Note:** we haven't open-sourced the actual tests yet. We are busy making our internal codebase consistent to set a good example for contributions to come. If you are interested in using this test suite or contributing, you can:

- Fill out this [Google form](https://forms.gle/VkoCofGUm1Mhw3W76) to stay uptodate.

- Click the Star and/or the Watch button in the top right to stay uptodate.

![image](https://user-images.githubusercontent.com/431360/144490227-0913fe5e-2ded-46ec-a5a2-3880c4b9b30a.png)
<p align="center"><em>A successful Cypress run which tests the store at https://hyva-demo.elgentos.io</em></p>

## Table of Contents

* [Prerequisites](#prerequisites)
* [Limitations](#limitations)
* [Progress](#progress)
* [Setup](#setup)
* [Running](#running)
* [Contributing](#contributing)

## Prerequisites
- Magento 2.3.x / 2.4.x
- [Hyvä](https://hyva.io)
- `npm`
- An admin bearer token (see [Setup](#setup))

## Assumptions & limitations

### Assumptions
- Magento 2 runs in Single Store Mode
- Default language is English
- Viewport is 1200x800 (no specific tests for mobile viewports)
- [Multi Source Inventory is not used](https://github.com/magento/inventory)

### Not plug & play
This test suite is _not_ plug & play for your store. A number of tests rely on Magento's default sample data. These tests will fail when you don't have the sample data. It is up to you to change the fixtures/selectors/tests to make them pass for your store.

### Hyvä-only right now
Since we ([elgentos](https://elgentos.nl)) have decided to focus solely on building Magento 2 stores with the [Hyvä](https://hyva.io) frontend, all tests are written for Hyvä frontends. That means the tests use Hyvä-specific selectors.

However, we have moved all selectors to fixtures, making it easy to provide selector fixtures for Luma. We will happily accept any PR's supplying this. In theory it should also be possible to swap these selectors for [Venia](https://venia.magento.com/) selectors.

### Open source-only right now
We don't do Commerce builds over at elgentos so we haven't spent time creating tests for Commerce-only functionality.

### No 100% test coverage
We do not particularly strive for 100% test coverage. We have identified the most common and most revenue-dependent scenarios. For example, we do test viewing products, filtering categories, adding products to the cart, etcetera but we do (currently) not test the [Email a Friend](https://docs.magento.com/user-guide/marketing/email-a-friend.html) or [Compare Products](https://docs.magento.com/user-guide/marketing/product-compare.html) feature since these are rarely used in an average Magento store. We are perfectly willing to merge a PR with these tests of course.

### No extensibility / inheritance of tests
You need to copy the whole suite into your project. We are open to suggestions on how to solve this, see [Discussions](https://github.com/elgentos/magento2-cypress-testing-suite/discussions).

## Progress
We are at 62%; 48 out of 78 tests are done.

Wording & naming are subject to change.

| Spec file                | Group                           | Test                                                                                             |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `account.spec.js`        | Account test creation           | :heavy_check_mark: it can create an account to log in with |
|                          | Account activities              | :heavy_check_mark: it creates an account to log in with and use for further testing |
|                          |                                 | :heavy_check_mark: it can log out |
|                          |                                 | :heavy_check_mark: it can show the account information page and display the name of the customer |
|                          |                                 | :heavy_check_mark: it can change the password |
|                          |                                 | :heavy_check_mark: it can change the name of the customer on the account information page |
|                          |                                 | :heavy_check_mark: it can navigate to all customer account pages and displays the correct titles |
|                          |                                 | :heavy_check_mark: it can navigate to order history and displays that there are no placed orders |
|                          |                                 | :heavy_check_mark: it can add a new address |
|                          |                                 | :heavy_check_mark: it can change an existing address |
|                          |                                 | :heavy_check_mark: it can remove an address |
|                          |                                 | :heavy_check_mark: it subscribe through the newsletter subscription page |
|                          |                                 | :heavy_check_mark: it can add an address automatically when an order is placed |
|                          |                                 | :heavy_check_mark: it can add a product to the wishlist of the logged in customer on a productpage and store it |
|                          |                                 | :heavy_check_mark: it can edit the wishlist on the wishlist page |
|                          |                                 | :black_square_button: it can reset the password when it is forgotten |
|                          | Do not login before these tests | :heavy_check_mark: it can login from cart without making changes to the cart |
|                          |                                 | :heavy_check_mark: it can login from checkout |
| `product-searches.spec.js` | Perform searches              | :heavy_check_mark: it can perform search with multiple hits |
|                          |                                 | :heavy_check_mark: it can find a single product |
|                          |                                 | :heavy_check_mark: it can show a page for no search results when the searchterm cannot give any results |
|                          |                                 | :heavy_check_mark: it can show suggestions when entering search terms |
| `category.spec.js`       | Category page tests             | :heavy_check_mark: it can navigate to the category page and filter products on the color red |
|                          |                                 | :heavy_check_mark: it can sort the products on price from lowest to highest |
|                          |                                 | :heavy_check_mark: it can change the number of products to be displayed |
|                          |                                 | :heavy_check_mark: it checks if the breadcrumb is displayed correctly |
|                          |                                 | :heavy_check_mark: it checks if the pagination is working |
|                          |                                 | :heavy_check_mark: it can switch from list to grid view |
| `homepage.spec.js`       | Home page tests                 | :heavy_check_mark: it can navigate to the homepage |
|                          |                                 | :heavy_check_mark: it can perform search from homepage |
|                          |                                 | :heavy_check_mark: it can open a category |
|                          |                                 | :black_square_button: it can show the header correctly and all links work |
|                          |                                 | :black_square_button: it can show the footer correctly and all links work |
|                          |                                 | :black_square_button: it can show the main section of the homepage correctly and all links work |
|                          |                                 | :heavy_check_mark: it can subscribe to the newsletter |
|                          |                                 | :black_square_button: it can add products shown on the homepage to the cart when a add to cart button is present |
|                          |                                 | :black_square_button: it shows the cookie banner when cookies are not accepted yet (vanilla hyva shows no cookie banner) |
| `checkout.spec.js`       | Checkout tests (guest)          | :black_square_button: it shows the correct products and quantities previously added to the cart |
|                          |                                 | :heavy_check_mark: it shows correct prices like subtotal, VAT, shipping costs and total |
|                          |                                 | :heavy_check_mark: it can see coupon discount in checkout |
|                          |                                 | :black_square_button: it can properly choose and use all listed payment methods |
|                          |                                 | :black_square_button: it can properly choose and use all listed shipping methods |
|                          |                                 | :black_square_button: it a conformation mail is send to the customer after placing the order |
|                          |                                 | :black_square_button: it an invoice is created and sent to the customer after placing the order |
|                          |                                 | :black_square_button: it after placing the order it is properly processed in the backend' |
|                          | Checkout tests (logged in)      | :black_square_button: it can automatically fill in the name and address of the customer |
|                          |                                 | :heavy_check_mark: it can find and order in the customer order history after having placed an order |
| `cart.spec.js`           | Cart tests                      | :heavy_check_mark: it can add a product to the cart |
|                          |                                 | :heavy_check_mark: it can change the quantity in the cart |
|                          |                                 | :heavy_check_mark: it can remove a product from the cart |
|                          |                                 | :heavy_check_mark: it can add a coupon to the cart |
|                          |                                 | :heavy_check_mark: it can delete an added coupon from the cart |
|                          |                                 | :heavy_check_mark: it cannot add a non existing coupon |
|                          |                                 | :heavy_check_mark: it displays the correct productprices and totals |
|                          |                                 | :black_square_button: it merges an already existing cart when a customer logs in |
| `minicart.spec.js`       | Minicart tests                  | :black_square_button: it can open the cart slider by clicking on the cart icon in the header |
|                          |                                 | :heavy_check_mark: it checks if the items and prices in the slider are displayed correctly |
|                          |                                 | :heavy_check_mark: it can delete an item in the cart slider |
|                          |                                 | :black_square_button: it can change the quantity of an item in the cart slider |
|                          |                                 | :heavy_check_mark: it can navigate to the cart with a link in the slider |
|                          |                                 | :heavy_check_mark: it can navigate to the checkout with a link in the slider |
| `product-page.spec.js`   | Product page tests              | :heavy_check_mark: it can display the titel and image of the product |
|                          |                                 | :heavy_check_mark: it shows the product price |
|                          |                                 | :heavy_check_mark: it can configure the product when it is an configurable product |
|                          |                                 | :heavy_check_mark: it can add the product to the cart |
|                          |                                 | :heavy_check_mark: it can't add the product to the cart if it is a configurable product and no options are selected |
|                          |                                 | :heavy_check_mark: it can add the product to the wislist |
|                          |                                 | :heavy_check_mark: it shows the correct breadcrumb |
|                          |                                 | :heavy_check_mark: it can show reviews made by logged in customers |
|                          |                                 | :heavy_check_mark: it can add a review when logged in |
|                          |                                 | :heavy_check_mark: it can indicate if a product is in stock |
|                          |                                 | :heavy_check_mark: it can't add a product to the cart when the product is out of stock (commented out, needs admin token in the cypress.env.json) |
| `cms-page.spec.js`       | CMS page tests                  | :black_square_button: it shows the default 404 page on an non-existent route |
|                          |                                 | :black_square_button: it can open the default CMS page correctly |
| `contact-form.spec.js`   | Contact form tests              | :black_square_button: it shows the contact form correctly |
|                          |                                 | :black_square_button: it cannot submit a form when no valid email address is entered |
|                          |                                 | :black_square_button: it can submit the form when all validation passes |
| `back-end.spec.js`       | Back-end tests                  | :black_square_button: it can login on the administration panel of the magento environment |
|                          |                                 | :black_square_button: it can show customer data |
|                          |                                 | :black_square_button: it processes orders and invoices correctly |
|                          |                                 | :black_square_button: it can edit an order |

## Installation
First, install Cypress in the root of your Magento 2 project;

```
npm init
npm install cypress --save-dev
npm install cypress-file-upload --save-dev
```

The easiest way to install the tests is to clone this repository and move the `cypress` folder into your project. As of right now, we do not provide a fallback mechanism for customizations to the tests, see [Limitations](https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/README.md#no-extensibility--inheritance-of-tests).

```
git clone git@github.com:elgentos/magento2-cypress-testing-suite.git 
mv magento2-cypress-testing-suite/cypress .
mv magento2-cypress-testing-suite/cypress.json.dist cypress.json
rm -rf magento2-cypress-testing-suite
```

Then edit the `cypress.json` file in the root of your project to update your baseUrl and possibly some other defaults we've set:

```json
{
  "baseUrl": "https://your-store.com",
  "viewportHeight": 800,
  "viewportWidth": 1200,
  "watchForFileChanges": false
}
```

Also add these lines to your `.gitignore` to avoid cluttering your Git repo;

```
node_modules
cypress/screenshots
cypress/videos
cypress.env.json
```

## Setup
Some tests are dependent on making changes in the database. This is done through the Magento 2 REST API. You will need to create an admin token for these tests. This is easily done using [magerun2](https://github.com/netz98/n98-magerun2).

Get a list of all the admin users: `magerun2 admin:user:list`

If you don't have any admin users, create one; `magerun2 admin:user:create --admin-user=john --admin-firstname=John --admin-lastname=Doe --admin-password=JohnDoe123 --admin-email="john@example.com"`

Then create a token: `magerun2 admin:token:create username_goes_here`

You then can add the token to `cypress.env.json` as an environment variable:

```json
{
  "MAGENTO2_ADMIN_TOKEN": "token_goes_here"
}

```

Or you can set it in your CI/CD variables by prefixing the environment variable name with `CYPRESS_`: `CYPRESS_MAGENTO2_ADMIN_TOKEN: <token_goes_here>`.

## Running

```
npm ci
npx cypress run
# npx cypress open # if you want to use the GUI
```

### Running against local environment

Set up your local URL in `cypress/plugins/index.js`. Then add run Cypress with `NODE_ENV; npx cypress run`.

## Contributing

We are very open to contributions! We would love to have Luma- or Venia-specific selector fixture files, new tests, code improvements, a fallback mechanism, etcetera etcetera. We will be updating this readme soon with extensive contribution guidelines, but here is a short summary:
- Avoid creating global `cy` functions ([Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)), instead put functions in utils/helpers and import them
- Avoid creating [aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Aliases) that are only used once
- Use `cy.get()` as much as possible, only use `cy.contains()` in specific cases - try to avoid it
- Do not write assertions in page objects, move those to the spec files. Red flag; `should()` in a page object
