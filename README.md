# elgentos/magento2-cypress-testing-suite

A community-driven Cypress testing suite for Magento 2

This testing suite was announced in [Peter Jaap](https://twitter.com/PeterJaap) his talk about [Cypress testing in Magento 2 at Reacticon 4](https://youtu.be/2zDliMebOqs?t=4435). Watch the talk for more information about Cypress testing.

![image](https://user-images.githubusercontent.com/431360/144490227-0913fe5e-2ded-46ec-a5a2-3880c4b9b30a.png)

<p align="center"><em>A successful Cypress run which tests the store at https://hyva-demo.elgentos.io</em></p>

[![image](https://user-images.githubusercontent.com/431360/193907706-a6d8cddf-e085-46ad-80de-df69ae51a9ea.png)](#videos)

<p align="center"><em><a href="https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/cypress/integration/hyva/homepage.spec.js">homepage.spec.js</a> tests running on https://hyva-demo.elgentos.io</em></p>

You can see all runs of this testing suite in the [public Cypress Dashboard for this project](https://dashboard.cypress.io/projects/8vuidn). See for example [this succesfull run](https://dashboard.cypress.io/projects/8vuidn/runs/e0a3cf9c-9653-4b03-97cc-04178dd6adb8/test-results/044b4dba-9ee4-43ec-8db0-6fcf12c95df5).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Limitations](#limitations)
- [Progress](#progress)
- [Setup](#setup)
- [Running](#running)
- [Videos](#videos)
- [Contributing](#contributing)

## Prerequisites

- Magento 2.3.x / 2.4.x
- [Hyvä](https://hyva.io) (1.1.17) or Luma-based theme
- `npm`
- An admin bearer token (see [Setup](#setup))

## Assumptions & limitations

### Assumptions

- Magento 2 runs in Single Store Mode
- Default language is English
- Viewport is 1920x1280, with support for mobile viewports
- Sample Data is installed

- [Multi Source Inventory is not used](https://github.com/magento/inventory)

### Not plug & play

This test suite is _not_ plug & play for your store. A number of tests rely on Magento's default sample data. These tests will fail when you don't have the sample data. It is up to you to change the fixtures/selectors/tests to make them pass for your store.

### Open source-only right now

We don't do Commerce builds over at elgentos, so we haven't spent time creating tests for Commerce-only functionality.

### No 100% test coverage

We do not particularly strive for 100% test coverage. We have identified the most common and most revenue-dependent scenarios. For example, we do test viewing products, filtering categories, adding products to the cart etc, but we (currently) do not test the [Email a Friend](https://docs.magento.com/user-guide/marketing/email-a-friend.html) or [Compare Products](https://docs.magento.com/user-guide/marketing/product-compare.html) feature since these are rarely used in an average Magento store. We are perfectly willing to merge a PR with these tests of course.

### No extensibility / inheritance of tests

You need to copy the whole suite into your project. We are open to suggestions on how to solve this, see [Discussions](https://github.com/elgentos/magento2-cypress-testing-suite/discussions).

### The Hyvä checkout tests assume the React Checkout is used

The Hyvä checkout tests assume the [Hyvä React Checkout](https://github.com/hyva-themes/magento2-react-checkout). To skip checkout related Hyvä tests, set the environment variable `CYPRESS_MAGENTO2_SKIP_CHECKOUT`.  
PR's are definitely welcome to improve the checkout related tests.

## Progress

We are at 80%; 69 out of the proposed 86 tests are done.

Wording & naming are subject to change.

| Spec file                  | Group                           | Test                                                                                                                                              |
|----------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `account.spec.js`          | Account test creation           | :heavy_check_mark: it can create an account to log in with                                                                                        |
|                            | Account activities              | :heavy_check_mark: it creates an account to log in with and use for further testing                                                               |
|                            |                                 | :heavy_check_mark: it can log out                                                                                                                 |
|                            |                                 | :heavy_check_mark: it can show the account information page and display the name of the customer                                                  |
|                            |                                 | :heavy_check_mark: it can change the password                                                                                                     |
|                            |                                 | :heavy_check_mark: it can change the name of the customer on the account information page                                                         |
|                            |                                 | :heavy_check_mark: it can navigate to all customer account pages and displays the correct titles                                                  |
|                            |                                 | :heavy_check_mark: it can navigate to order history and displays that there are no placed orders                                                  |
|                            |                                 | :heavy_check_mark: it can add a new address                                                                                                       |
|                            |                                 | :heavy_check_mark: it can change an existing address                                                                                              |
|                            |                                 | :heavy_check_mark: it can remove an address                                                                                                       |
|                            |                                 | :heavy_check_mark: it subscribe through the newsletter subscription page                                                                          |
|                            |                                 | :heavy_check_mark: it can add an address automatically when an order is placed                                                                    |
|                            |                                 | :heavy_check_mark: it can add a product to the wishlist of the logged in customer on a productpage and store it                                   |
|                            |                                 | :heavy_check_mark: it can edit the wishlist on the wishlist page                                                                                  |
|                            |                                 | :black_square_button: it can reset the password when it is forgotten                                                                              |
|                            | Do not login before these tests | :heavy_check_mark: it can login from cart without making changes to the cart                                                                      |
|                            |                                 | :heavy_check_mark: it can login from checkout                                                                                                     |
| `product-searches.spec.js` | Perform searches                | :heavy_check_mark: it can perform search with multiple hits                                                                                       |
|                            |                                 | :heavy_check_mark: it can find a single product                                                                                                   |
|                            |                                 | :heavy_check_mark: it can show a page for no search results when the searchterm cannot give any results                                           |
|                            |                                 | :heavy_check_mark: it can show suggestions when entering search terms                                                                             |
| `category.spec.js`         | Category page tests             | :heavy_check_mark: it can navigate to the category page and filter products on the color red                                                      |
|                            |                                 | :heavy_check_mark: it can sort the products on price from lowest to highest                                                                       |
|                            |                                 | :heavy_check_mark: it can change the number of products to be displayed                                                                           |
|                            |                                 | :heavy_check_mark: it checks if the breadcrumb is displayed correctly                                                                             |
|                            |                                 | :heavy_check_mark: it checks if the pagination is working                                                                                         |
|                            |                                 | :heavy_check_mark: it can switch from list to grid view                                                                                           |
| `homepage.spec.js`         | Home page tests                 | :heavy_check_mark: it can navigate to the homepage                                                                                                |
|                            |                                 | :heavy_check_mark: it can perform search from homepage                                                                                            |
|                            |                                 | :heavy_check_mark: it can open a category                                                                                                         |
|                            |                                 | :heavy_check_mark: it can show the header correctly and all links work                                                                            |
|                            |                                 | :heavy_check_mark: it can show the footer correctly and all links work                                                                            |
|                            |                                 | :black_square_button: it can show the main section of the homepage correctly and all links work                                                   |
|                            |                                 | :heavy_check_mark: it can subscribe to the newsletter                                                                                             |
|                            |                                 | :heavy_check_mark: it can add products shown on the homepage to the cart when an add to cart button is present                                    |
|                            |                                 | :black_square_button: it shows the cookie banner when cookies are not accepted yet (Vanilla Hyvä shows no cookie banner)                          |
| `checkout.spec.js`         | Checkout tests (guest)          | :black_square_button: it shows the correct products and quantities previously added to the cart                                                   |
|                            |                                 | :heavy_check_mark: it shows correct prices like subtotal, VAT, shipping costs and total                                                           |
|                            |                                 | :heavy_check_mark: it can see coupon discount in checkout                                                                                         |
|                            |                                 | :black_square_button: it can properly choose and use all listed payment methods                                                                   |
|                            |                                 | :black_square_button: it can properly choose and use all listed shipping methods                                                                  |
|                            |                                 | :black_square_button: it a conformation mail is send to the customer after placing the order                                                      |
|                            |                                 | :black_square_button: it an invoice is created and sent to the customer after placing the order                                                   |
|                            |                                 | :heavy_check_mark: it after placing the order it is properly processed in the backend'                                                            |
|                            | Checkout tests (logged in)      | :black_square_button: it can automatically fill in the name and address of the customer                                                           |
|                            |                                 | :heavy_check_mark: it can find and order in the customer order history after having placed an order                                               |
| `cart.spec.js`             | Cart tests                      | :heavy_check_mark: it can add a product to the cart                                                                                               |
|                            |                                 | :heavy_check_mark: it can change the quantity in the cart                                                                                         |
|                            |                                 | :heavy_check_mark: it can remove a product from the cart                                                                                          |
|                            |                                 | :heavy_check_mark: it can add a coupon to the cart                                                                                                |
|                            |                                 | :heavy_check_mark: it can delete an added coupon from the cart                                                                                    |
|                            |                                 | :heavy_check_mark: it cannot add a non existing coupon                                                                                            |
|                            |                                 | :heavy_check_mark: it displays the correct product prices and totals                                                                              |
|                            |                                 | :black_square_button: it merges an already existing cart when a customer logs in                                                                  |
| `minicart.spec.js`         | Minicart tests                  | :heavy_check_mark: it can open the cart slider by clicking on the cart icon in the header                                                         |
|                            |                                 | :heavy_check_mark: it checks if the items and prices in the slider are displayed correctly                                                        |
|                            |                                 | :heavy_check_mark: it can delete an item in the cart slider                                                                                       |
|                            |                                 | :heavy_check_mark: it can change the quantity of an item in the cart slider                                                                       |
|                            |                                 | :heavy_check_mark: it can navigate to the cart with a link in the slider                                                                          |
|                            |                                 | :heavy_check_mark: it can navigate to the checkout with a link in the slider                                                                      |
| `product-page.spec.js`     | Product page tests              | :heavy_check_mark: it can display the title and image of the product                                                                              |
|                            |                                 | :heavy_check_mark: it shows the product price                                                                                                     |
|                            |                                 | :heavy_check_mark: it can configure the product when it is an configurable product                                                                |
|                            |                                 | :heavy_check_mark: it can add the product to the cart                                                                                             |
|                            |                                 | :heavy_check_mark: it can't add the product to the cart if it is a configurable product and no options are selected                               |
|                            |                                 | :heavy_check_mark: it can add the product to the wishlist                                                                                         |
|                            |                                 | :heavy_check_mark: it shows the correct breadcrumb                                                                                                |
|                            |                                 | :heavy_check_mark: it can show reviews made by logged in customers                                                                                |
|                            |                                 | :heavy_check_mark: it can add a review when logged in                                                                                             |
|                            |                                 | :heavy_check_mark: it can indicate if a product is in stock                                                                                       |
|                            |                                 | :heavy_check_mark: it can't add a product to the cart when the product is out of stock (commented out, needs admin token in the cypress.env.json) |
|                            | Bundle products test            | :heavy_check_mark: it can render the product name                                                                                                 |
|                            |                                 | :heavy_check_mark: it can set the price to zero when every associated product qty is zero                                                         |
|                            |                                 | :heavy_check_mark: it can calculate the price based on selected options                                                                           |
|                            |                                 | :heavy_check_mark: it can display selection quantities                                                                                            |
|                            |                                 | :heavy_check_mark: it can add a bundled product to the cart                                                                                       |
| `cms-page.spec.js`         | CMS page tests                  | :black_square_button: it shows the default 404 page on an non-existent route                                                                      |
|                            |                                 | :black_square_button: it can open the default CMS page correctly                                                                                  |
| `contact-form.spec.js`     | Contact form tests              | :heavy_check_mark: it shows the contact form correctly                                                                                            |
|                            |                                 | :black_square_button: it cannot submit a form when no valid email address is entered                                                              |
|                            |                                 | :heavy_check_mark: it can submit the form when all validation passes                                                                              |
| `back-end.spec.js`         | Back-end tests                  | :black_square_button: it can login on the administration panel of the magento environment                                                         |
|                            |                                 | :black_square_button: it can show customer data                                                                                                   |
|                            |                                 | :black_square_button: it processes orders and invoices correctly                                                                                  |
|                            |                                 | :black_square_button: it can edit an order                                                                                                        |

## Installation

First, install Cypress and the dependencies in the root of your Magento 2 project:

```bash
npm ci
```

The easiest way to install the tests is to clone this repository and move the `cypress` folder into your project. As of right now, we do not provide a fallback mechanism for customizations to the tests, see [Limitations](https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/README.md#no-extensibility--inheritance-of-tests).

```bash
git clone git@github.com:elgentos/magento2-cypress-testing-suite.git
mv magento2-cypress-testing-suite/cypress .
mv magento2-cypress-testing-suite/cypress.config.js .
rm -rf magento2-cypress-testing-suite
npm install cypress@^12.2.0 cypress-localstorage-commands@^2.2.2 cypress-tags@^1.1.2 typescript@^4.8.3
```

If you only need the Hyvä tests:

```
rm -rf cypress/{fixtures,page-objects,integration}/luma
rm -rf cypress/{integration}/luma-accessibility
```

If you only need the Luma tests;

```
rm -rf cypress/{fixtures,page-objects,integration}/hyva
```

Then edit the `cypress.config.js` file in the root of your project to update your `baseUrl`, the `projectId` and possibly some other defaults we've set:

```js
const baseUrl =
  process.env.NODE_ENV === "develop"
    ? "http://cypress.magento2.localhost"
    : "https://example.com/";
```
```js
    projectId: "8vuidn"
```

Also add these lines to your `.gitignore` to avoid cluttering your Git repo;

```
node_modules
cypress/screenshots
cypress/videos
cypress.env.json
```

### Accessibility test installation

The accessibility test specs use cypress-axe and as such need extra items installed via npm.

```bash
npm install --save-dev cypress-axe
npm install --save-dev axe-core
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

Overwrite the base url

```json
{
  "MAGENTO2_BASE_URL": "https://demoshops.splendid-internet.de/magento/demoshop-magento2-daily"
}
```

Alternatively you can set it in your CI/CD variables by prefixing the environment variable name with `CYPRESS_`: `CYPRESS_MAGENTO2_ADMIN_TOKEN: <token_goes_here>`.

### Tags

We use [tags](https://github.com/annaet/cypress-tags) to discern between hot tests and cold tests. If you followed the installation instructions above the `cypress-tags` module is already installed.  
Note: it is used in the `cypress.config.js` file in the `setupNodeEvents` callback.

## Running

```bash
npx cypress run
# npx cypress open # if you want to use the GUI
```

Individual specs can be run using the following [command](https://docs.cypress.io/guides/guides/command-line#Commands):

```bash
npx cypress run --spec ./cypress/integration/path/to/some.spec.js
```

Hot and cold tests based on tags can be run using the following command:

```bash
CYPRESS_INCLUDE_TAGS=hot npx cypress run
```

### Running against local environment

Set up your local base URL in `cypress.config.js`, or export `CYPRESS_MAGENTO2_BASE_URL`.  
Then run Cypress with `NODE_ENV=develop; npx cypress run`.

### Environment variables

Even though the test suite is intended to become part of a project, it is possible to change some behavior using environment variables.  
This is useful for running the suite in different environments, for example, development, CI, or against production.

- `NODE_ENV` if set to `develop` the development base URL configured in `cypress.config.js` will be used, and the default timeout is set to 10 seconds
- `CYPRESS_MAGENTO2_BASE_URL` If set, this value will be used as the Magento 2 base_url. Otherwise, the base URL from `cypress.config.js` will be used.
- `CYPRESS_MAGENTO2_SPEC_PATTERN` If set, only tests matching this glob pattern will be executed. Otherwise, the tests configured in `cypress.config.js` will be used.
- `CYPRESS_MAGENTO2_EXPORT_PATTERN` If set, tests matching this glob pattern will be excluded.
- `CYPRESS_MAGENTO2_DEFAULT_TIMEOUT` If set, used as the default timeout. Otherwise, the timeout defaults to 10 seconds if NODE_ENV is set to `develop`, or 4 seconds otherwise.
- `CYPRESS_MAGENTO2_ADMIN_TOKEN` Used to authenticate against the Magento 2 API for setting up test fixtures.
- `CYPRESS_MAGENTO2_SKIP_CHECKOUT` Set to a truthy value to skip any Hyvä tests that assume a Checkout is installed.
- `CYPRESS_MAGENTO2_SPEC_SUITE` Set the test suite to run, if not set defaults to `luma` or `hyva` depending on response headers.

Any of these can also be configured in a `cypress.env.json` file without the `CYPRESS_` prefix.

### Running tests from modules

Spec files in extensions will be found by the default spec pattern at

- `app/code/**/Test/Cypress/hyva/**/*.spec.js` or `app/code/**/Test/Cypress/luma/**/*.spec.js`
- `vendor/**/Test/Cypress/hyva/**/*.spec.js` or `vendor/**/Test/Cypress/luma/**/*.spec.js`

Tests for different frontends can be supplied by using a different folder in `Test/Cypress` and setting the `MAGENTO2_SPEC_SUITE` config to that name.
For example: `app/code/Example/Module/Test/Cypress/vue/user/account.spec.js` would be found by

```sh
CYPRESS_MAGENTO2_SPEC_SUITE=vue npx cypress run
```

If you do not want all tests to be run, regardless of the folder names, set `MAGENTO2_SPEC_SUITE` to an empty string.

### Running accessibility tests

Accessibility spec files will not be found by the default spec pattern.
This was desired as they should be seen as optional.

To run the accessibility tests locally you can update your cypress.env.json to include the following

```json
{
    "MAGENTO2_SPEC_PATTERN": "cypress/integration/luma-accessibility/**/*.spec.js"
}
```

## Videos

https://user-images.githubusercontent.com/431360/193906592-2859ce76-c889-4377-afa0-a5d01ee06919.mp4

<p align="center"><em><a href="https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/cypress/integration/hyva/homepage.spec.js">homepage.spec.js</a> tests running on https://hyva-demo.elgentos.io</em></p>

https://user-images.githubusercontent.com/431360/193906756-a4f384c8-c6e2-422b-bf16-38134d34af25.mp4

<p align="center"><em><a href="https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/cypress/integration/hyva/catalog/product.spec.js">product.spec.js</a> tests running on https://hyva-demo.elgentos.io</em></p>

https://user-images.githubusercontent.com/431360/193906780-8e2e62ce-23db-406c-82f1-080d17409934.mp4

<p align="center"><em><a href="https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/cypress/integration/hyva/catalog/category.spec.js">category.spec.js</a> tests running on https://hyva-demo.elgentos.io</em></p>

https://user-images.githubusercontent.com/431360/193906808-f0a04467-72d4-4ef4-a1f4-e05de8f16252.mp4

<p align="center"><em><a href="https://github.com/elgentos/magento2-cypress-testing-suite/blob/main/cypress/integration/hyva/search/product-searches.spec.js">product-searches.spec.js</a> tests running on https://hyva-demo.elgentos.io</em></p>

## Contributing

We are very open to contributions! We would love to have mobile viewport support for Hyvä, tests for Commerce functionality, additional tests, code improvements, a fallback mechanism, etcetera etcetera. See the Issues tab for issues to pick up.

We will be updating this readme soon with extensive contribution guidelines, but here is a short summary:

- Avoid creating global `cy` functions ([Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)), instead put functions in utils/helpers and import them
- Avoid creating [aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Aliases) that are only used once
- Use `cy.get()` as much as possible, only use `cy.contains()` in specific cases - try to avoid it
- Do not add assertions to page objects, move those to the spec files. Red flag; `should()` in a page object
- Every test (an `it()` function) has to be able to run stand-alone; it should not depend on any other test. You can test this by add `.only` (see [Cypress docs](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests)).
