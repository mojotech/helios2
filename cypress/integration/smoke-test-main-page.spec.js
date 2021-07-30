['Boulder', 'Providence'].forEach(location => {
  describe('main page, smoke test', () => {
    beforeEach(() => {
      cy.fixViewport();
      cy.visit(`http://localhost:5000/${location}`);
      cy.waitForInitialContent();
    });

    it(`has '${location}' displayed on the page`, () => {
      cy.contains(location);
    });

    it('has weather widget data', () => {
      cy.checkWeather();
    });

    it('has twitter widget data', () => {
      cy.checkTwitter();
    });

    it('has numbers widget data', () => {
      cy.checkNumbers();
    });

    it('has events widget data', () => {
      cy.checkEvents();
    });
  });
});
