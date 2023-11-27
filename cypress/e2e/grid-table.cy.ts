import { sampleData } from "../../src/lib/sampleData";
import { getAllHeaders } from "../../src/lib/cypress";
describe("Dynamic table Should render properly", () => {
  let dynamicData = sampleData;
  beforeEach(() => {
    cy.visit("/");
  });

  it("shuld render table", () => {
    /**
     * Debouncing is used on rendering data so we need to use wait/delay
     */
    cy.get("[data-testid='table']").wait(1000).should("be.visible");
  });

  it("should have lengh of row equal to smaple data", () => {
    cy.wait(1000);
    cy.get("[data-testid='table-body'] tr").should(
      "have.length",
      dynamicData.length
    );
  });
});

describe("Fields Menu", () => {
  let dynamicData = sampleData;
  let headers = getAllHeaders(dynamicData);

  beforeEach(() => {
    cy.visit("/");
    cy.wait(1000);
  });

  it("shuld have fields trigger button", () => {
    cy.get("[data-testid='field-menu-trigger']").should("be.visible");
  });

  it("shuld work trigger button properly and fields should be present", () => {
    cy.get("[data-testid='field-menu-trigger']").click();
    cy.get("[data-testid='field-menu-options'] div").contains("id");
  });

  it("should hide and show first column and also should persist field settings on reload page", () => {
    cy.get('[data-testid="field-menu-trigger"]').click();
    cy.get(
      `[data-testid="field-menu-options"] div label[for="${headers[0].field}"]`
    ).click();
    cy.get("[data-testid='field-menu-trigger']").click();
    cy.wait(100);

    cy.get("[data-testid='table-header-row'] th").should(($headerCell) => {
      expect($headerCell).to.have.length(headers.length - 1);
      expect($headerCell).to.not.contain(`${headers[0].field}`);
      expect($headerCell).to.contain(`${headers[1].field}`);
    });

    cy.reload();

    // // Open a new tab and navigate to the same page
    // cy.window().then((win) => {
    //   win.open("/"); // Replace with the URL of your application
    // });

    // // Switch to the newly opened tab
    // cy.window().then((win) => {
    //   cy.visit("/", { onBeforeLoad: (newWin) => Object.assign(newWin, win) });
    // });

    cy.wait(2000);

    cy.get('[data-testid="field-menu-trigger"]').click();
    cy.wait(100);
    cy.get(
      `[data-testid="field-menu-options"] input[name="${headers[0].field}"]`
    ).should("not.be.checked");
    cy.get(
      `[data-testid="field-menu-options"] div label[for="${headers[0].field}"]`
    ).click();
    cy.get("[data-testid='field-menu-trigger']").click();
    cy.wait(100);
    cy.get("[data-testid='table-header-row'] th").should(($headerCell) => {
      expect($headerCell).to.have.length(headers.length);
      headers.forEach((header) => {
        expect($headerCell).to.contain(`${header.field}`);
      });
    });
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
