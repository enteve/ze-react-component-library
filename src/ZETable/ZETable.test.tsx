// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import ZETable from "./ZETable";
import { ZETableProps } from "./ZETable.types";

describe("Test Component", () => {
  let props: ZETableProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<ZETable {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("ZETable");

    expect(component).toHaveTextContent("harvey was here");
  });
});
