import { sampleData } from "../../src/lib/sampleData";
import { getAllHeaders } from "../../src/lib/cypress";
import { DynamicDataType } from "../../src/types/table";
import { handleFilterData, handleSortData } from "../../src/lib/utils";
describe("Dynamic table Should render properly", () => {
  let dynamicData = sampleData as DynamicDataType;
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
  let dynamicData = sampleData as DynamicDataType;
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
    cy.get("[data-testid='field-menu-options']").children().contains("id");
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

describe("Filter Menu", () => {
  let dynamicData = sampleData as DynamicDataType;
  let headers = getAllHeaders(dynamicData);

  beforeEach(() => {
    cy.visit("/");
  });

  it("shuld have filter trigger button and add filter button", () => {
    cy.get("[data-testid='filter-menu-trigger']").should("be.visible");
    cy.get("[data-testid='filter-menu-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").should("exist");
  });

  it("shuld add new filter on clicking add new filter button", () => {
    cy.get("[data-testid='filter-menu-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
  });

  it("shuld work single field filter properly", () => {
    cy.get("[data-testid='filter-menu-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='filter-menu-options']")
      .children()
      .should("have.length", 1);
    cy.get(`[data-testid='select-filter-field-option-${0}']`).select(
      headers[1].field
    );
    cy.get(`[data-testid='select-filter-operator-option-${0}']`).select(
      "equal"
    );
    cy.get(`[data-testid='select-filter-value-input-${0}']`).type(
      `${dynamicData[0][headers[1].field]}`
    );
    cy.get("[data-testid='filter-menu-trigger']").click(); // to close filter option

    let filteredDataToCompaire = handleFilterData({
      data: dynamicData,
      filterSettings: [
        {
          field: headers[1].field,
          operator: "equal",
          value: dynamicData[0][headers[1].field],
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(filteredDataToCompaire?.length);
    });
  });

  it("shuld work multiple filter options togather properly and persist setting after reload also", () => {
    cy.get("[data-testid='filter-menu-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='filter-menu-options']")
      .children()
      .should("have.length", 1);
    cy.get(`[data-testid='select-filter-field-option-${0}']`).select(
      headers[1].field
    );
    cy.get(`[data-testid='select-filter-operator-option-${0}']`).select("like");
    cy.get(`[data-testid='select-filter-value-input-${0}']`).type(`a`);

    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='filter-menu-options']")
      .children()
      .should("have.length", 2);
    cy.get(`[data-testid='select-filter-field-option-${1}']`).select(
      headers[2].field
    );
    cy.get(`[data-testid='select-filter-operator-option-${1}']`).select("like");
    cy.get(`[data-testid='select-filter-value-input-${1}']`).type(`a`);
    cy.get("[data-testid='filter-menu-trigger']").click(); // to close filter option

    let filteredDataToCompaire = handleFilterData({
      data: dynamicData,
      filterSettings: [
        {
          field: headers[1].field,
          operator: "like",
          value: "a",
        },
        {
          field: headers[2].field,
          operator: "like",
          value: "a",
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(filteredDataToCompaire?.length);
    });

    cy.reload();
    let filteredDataToCompaire1 = handleFilterData({
      data: dynamicData,
      filterSettings: [
        {
          field: headers[1].field,
          operator: "like",
          value: "a",
        },
        {
          field: headers[2].field,
          operator: "like",
          value: "a",
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(filteredDataToCompaire1?.length);
    });
  });

  it("shuld add multiple filter options and delete", () => {
    cy.get("[data-testid='filter-menu-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();
    cy.get("[data-testid='add-new-filter-trigger']").click();

    cy.get("[data-testid='filter-menu-options']")
      .children()
      .should("have.length", 4);
    cy.get(`[data-testid='delete-filter-option-${0}']`).click();
    cy.get(`[data-testid='delete-filter-option-${1}']`).click();
    cy.get("[data-testid='filter-menu-options']")
      .children()
      .should("have.length", 2);
    cy.get("[data-testid='sort-menu-trigger']").click();
  });
});
describe("Sort Menu", () => {
  let dynamicData = sampleData as DynamicDataType;
  let headers = getAllHeaders(dynamicData);

  beforeEach(() => {
    cy.visit("/");
  });

  it("shuld have sort trigger button and add sort button", () => {
    cy.get("[data-testid='sort-menu-trigger']").should("be.visible");
    cy.get("[data-testid='sort-menu-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").should("exist");
  });

  it("shuld add new sort on clicking add new sort button", () => {
    cy.get("[data-testid='sort-menu-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
  });

  it("shuld work single field sort properly", () => {
    cy.get("[data-testid='sort-menu-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='sort-menu-options']")
      .children()
      .should("have.length", 1);
    cy.get(`[data-testid='select-sort-field-option-${0}']`).select(
      headers[0].field
    );
    cy.get(`[data-testid='select-sort-orderby-option-${0}']`).select("desc");

    cy.get("[data-testid='sort-menu-trigger']").click(); // to close sort option

    let sortedDataToCompaire = handleSortData({
      data: dynamicData,
      sortSettings: [
        {
          field: headers[0].field,
          orderBy: "desc",
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(sortedDataToCompaire?.length);
      if (sortedDataToCompaire.length === 1) {
        expect($rows.eq(0)).to.contain(sortedDataToCompaire[0]?.fullName);
      } else if (sortedDataToCompaire.length > 1) {
        expect($rows.eq(1)).to.contain(sortedDataToCompaire[1]?.fullName);
      }
    });
  });

  it("shuld work multiple sort options togather properly and persist setting after reload also", () => {
    cy.get("[data-testid='sort-menu-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='sort-menu-options']")
      .children()
      .should("have.length", 1);
    cy.get(`[data-testid='select-sort-field-option-${0}']`).select(
      headers[0].field
    );
    cy.get(`[data-testid='select-sort-orderby-option-${0}']`).select("asc");

    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='sort-menu-options']")
      .children()
      .should("have.length", 2);
    cy.get(`[data-testid='select-sort-field-option-${1}']`).select(
      headers[1].field
    );
    cy.get(`[data-testid='select-sort-orderby-option-${1}']`).select("desc");

    cy.get("[data-testid='sort-menu-trigger']").click(); // to close sort option

    let sortedDataToCompaire = handleSortData({
      data: dynamicData,
      sortSettings: [
        {
          field: headers[0].field,
          orderBy: "asc",
        },
        {
          field: headers[1].field,
          orderBy: "desc",
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(sortedDataToCompaire?.length);
      if (sortedDataToCompaire.length === 1) {
        expect($rows.eq(0)).to.contain(sortedDataToCompaire[0]?.fullName);
      } else if (sortedDataToCompaire.length > 1) {
        expect($rows.eq(1)).to.contain(sortedDataToCompaire[1]?.fullName);
      }
    });

    cy.reload();
    let sortedDataToCompaire1 = handleSortData({
      data: dynamicData,
      sortSettings: [
        {
          field: headers[0].field,
          orderBy: "asc",
        },
        {
          field: headers[1].field,
          orderBy: "desc",
        },
      ],
    });

    cy.get("[data-testid='table-body'] tr").should(($rows) => {
      expect($rows).to.have.length(sortedDataToCompaire1?.length);
      if (sortedDataToCompaire1.length === 1) {
        expect($rows.eq(0)).to.contain(sortedDataToCompaire1[0]?.fullName);
      } else if (sortedDataToCompaire1.length > 1) {
        expect($rows.eq(1)).to.contain(sortedDataToCompaire1[1]?.fullName);
      }
    });
  });
  it("shuld add multiple sort options and delete", () => {
    cy.get("[data-testid='sort-menu-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();
    cy.get("[data-testid='add-new-sort-trigger']").click();

    cy.get("[data-testid='sort-menu-options']")
      .children()
      .should("have.length", 4);
    cy.get(`[data-testid='delete-sort-option-${0}']`).click();
    cy.get(`[data-testid='delete-sort-option-${1}']`).click();
    cy.get("[data-testid='sort-menu-options']")
      .children()
      .should("have.length", 2);
    cy.get("[data-testid='sort-menu-trigger']").click();
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
