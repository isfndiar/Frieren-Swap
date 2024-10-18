import Address from "@/components/fragment/Address";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("Address Component", () => {
  it("should render the Address component correctly", () => {
    const { container } = render(<Address />);
    expect(container).toMatchSnapshot();
  });
});
