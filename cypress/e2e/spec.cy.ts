describe("devindex", () => {
    it("local page should load", () => {
        cy.visit("/");
        cy.get("body").contains("Min vue-komponent");
    });
});
