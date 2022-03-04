We are very open to contributions! We would love to have mobile viewport support for Hyvä, tests for Commerce functionality, additional tests, code improvements, a fallback mechanism, etcetera etcetera. See the Issues tab for issues to pick up. 

We will be updating this readme soon with extensive contribution guidelines, but here is a short summary:
- Avoid creating global `cy` functions ([Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)), instead put functions in utils/helpers and import them
- Avoid creating [aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Aliases) that are only used once
- Use `cy.get()` as much as possible, only use `cy.contains()` in specific cases - try to avoid it
- Do not write assertions in page objects, move those to the spec files. Red flag; `should()` in a page object
- Every test (an `it()` function) has to be able to run stand-alone; it should not depend on any other test. You can test this by add `.only` (see [Cypress docs](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests)).
