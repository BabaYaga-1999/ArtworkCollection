import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TodoDetail from "../components/TodoDetail";

jest.mock("../hooks/useTodos", () => ({
  getTodoById: () => Promise.resolve({
    id: "1",
    title: "Test Todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    favorites: [],
    comments: [{id: '1', author: {name: 'James'}, text: 'Hello', createdAt: new Date().toISOString()}]
  }),
}));

test("renders todo detail", async () => {
  render(
    <MemoryRouter initialEntries={["/todos/1"]}>
      <TodoDetail />
    </MemoryRouter>
  );

  const todoTitle = await screen.findByText("Test Todo");
  const createdAt = await screen.findByText(/Created at:/i);
  const updatedAt = await screen.findByText(/Last updated at:/i);
  const completed = await screen.findByText("Completed: No");
  const favorites = await screen.findByText("Number of ❤️ Favorite: 0");
  const commentBy = await screen.findByText("Comment by James");

  expect(todoTitle).toBeInTheDocument();
  expect(createdAt).toBeInTheDocument();
  expect(updatedAt).toBeInTheDocument();
  expect(completed).toBeInTheDocument();
  expect(favorites).toBeInTheDocument();
  expect(commentBy).toBeInTheDocument();
});
