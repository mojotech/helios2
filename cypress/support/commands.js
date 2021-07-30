// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Assert content has loaded
Cypress.Commands.add('waitForInitialContent', () => {
  cy.contains('Today');
});

// Page not responsive with smaller viewport, set new one
Cypress.Commands.add('fixViewport', () => {
  cy.viewport(1600, 1280);
});

Cypress.Commands.add('checkWeather', () => {
  cy.contains('Weather').click();
  cy.contains('Today');
  cy.contains('Tomorrow');
});

Cypress.Commands.add('checkTwitter', () => {
  cy.contains('@MojoTech').click();
  cy.contains('Previous Tweets');
});

Cypress.Commands.add('checkNumbers', () => {
  cy.contains('MojoTech by the Numbers').click();
  cy.contains('Commits');
  cy.contains('Pull Requests');
  cy.contains('Slack Messages');
});

Cypress.Commands.add('checkEvents', () => {
  cy.contains('Events at MojoTech').click();
  cy.contains('Anniversaries this week');
  cy.contains('Birthdays this week');
  cy.contains('Out of office today');
  cy.contains('New hires this quarter');
});
