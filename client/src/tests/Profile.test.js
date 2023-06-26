import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";

let mockUseAuth0 = {
  isLoading: false,
  user: {
    sub: "subId",
    name: "cristian",
    email: "cris@gmail.com",
    email_verified: true,
  },
  isAuthenticated: true,
  loginWithRedirect: jest.fn(),
};

let mockUseUser = [{
  email: 'jameswangyucheng@foxmail.com',
  name: 'James',
  currentPlan: 'PRO',
  comments: [],
  favorites: [],
  todos: [],
}];

let mockUseAuthToken = { accessToken: 'fake_token' };

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: () => mockUseAuth0,
}));

jest.mock('../hooks/useUser', () => ({
  useUser: () => mockUseUser,
}));

jest.mock('../AuthTokenContext', () => ({
  useAuthToken: () => mockUseAuthToken,
}));

test("renders Profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

  expect(screen.getByText("Name: James")).toBeInTheDocument();
  expect(screen.getByText("📧 Email: cris@gmail.com")).toBeInTheDocument();
  expect(screen.getByText("🔑 Auth0Id: subId")).toBeInTheDocument();
  expect(screen.getByText("✅ Email verified: true")).toBeInTheDocument();
  expect(screen.getByText("Current Plan: PRO")).toBeInTheDocument();
});
