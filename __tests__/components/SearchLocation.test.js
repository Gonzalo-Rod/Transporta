import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SearchLocation from "../../components/Inputs/searchLocation";

jest.mock("@expo/vector-icons/Ionicons", () => ({ name }) => name);

global.fetch = jest.fn();

const suggestionsResponse = {
  status: "OK",
  results: [
    {
      place_id: "place-1",
      name: "Avenida Principal",
      formatted_address: "Avenida Principal 123",
    },
    {
      place_id: "place-2",
      name: "Parque Central",
      formatted_address: "Parque Central, Lima",
    },
  ],
};

describe("SearchLocation component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches suggestions when user types more than two characters", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve(suggestionsResponse),
    });

    const onSelect = jest.fn();

    const { getByTestId, getByText } = render(
      <SearchLocation placeholder="Buscar" onLocationSelect={onSelect} />
    );

    fireEvent.changeText(getByTestId("search-input"), "Aven");

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(getByText("Avenida Principal")).toBeTruthy();
    expect(getByText("Parque Central")).toBeTruthy();
  });

  it("clears suggestions when there are fewer than three characters", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve(suggestionsResponse),
    });

    const { getByTestId, queryByText } = render(
      <SearchLocation placeholder="Buscar" onLocationSelect={jest.fn()} />
    );

    fireEvent.changeText(getByTestId("search-input"), "Ave");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.changeText(getByTestId("search-input"), "Av");

    await waitFor(() => {
      expect(queryByText("Avenida Principal")).toBeNull();
    });
  });

  it("notifies parent when a suggestion is selected", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve(suggestionsResponse),
    });

    const onSelect = jest.fn();

    const { getByTestId } = render(
      <SearchLocation placeholder="Buscar" onLocationSelect={onSelect} />
    );

    fireEvent.changeText(getByTestId("search-input"), "Parq");

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    fireEvent.press(getByTestId("suggestion-place-2"));

    expect(onSelect).toHaveBeenCalledWith("Parque Central");
  });
});
