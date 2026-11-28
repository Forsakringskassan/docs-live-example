describe("devindex", () => {
    it("local page should load", () => {
        cy.visit("/");
        cy.get("body").contains("Min vue-komponent");
    });

    it("updates the code toggle when the panel opens and closes", () => {
        cy.visit("/");
        const button = ".live-example__code-toggle button";
        const code = ".live-example__code pre";

        cy.get(button).should("have.attr", "aria-expanded", "false");
        cy.get(code).should("not.be.visible");
        cy.get(button).click();
        cy.get(code).should("be.visible");
        cy.get(button).should("contain.text", "Dölj kod");
        cy.get(button).should("have.attr", "aria-expanded", "true");

        cy.get(button).click();
        cy.get(code).should("not.be.visible");
        cy.get(button).should("contain.text", "Visa kod");
        cy.get(button).should("have.attr", "aria-expanded", "false");
    });
});
