import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Address from "@/components/fragment/Address";

describe("Address Component", () => {
  it("render page", () => {
    const page = render(<Address />);
    expect(page).toMatchSnapshot();
  });
});
