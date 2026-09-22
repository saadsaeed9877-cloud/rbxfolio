import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectsList } from "../ProjectsList";

global.fetch = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderComponent(props = {}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ProjectsList {...props} />
    </QueryClientProvider>
  );
}

const mockProjects = [
  {
    id: "1",
    title: "My First Game",
    slug: "my-first-game",
    shortDescription: "A fun puzzle game",
    thumbnailUrl: "https://example.com/thumb1.jpg",
    completionStatus: "COMPLETED" as const,
    visibility: "PUBLIC" as const,
    tags: ["game", "puzzle"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Game in Progress",
    slug: "game-in-progress",
    shortDescription: "Working on this one",
    thumbnailUrl: null,
    completionStatus: "IN_PROGRESS" as const,
    visibility: "PRIVATE" as const,
    tags: ["game", "rpg", "multiplayer"],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
];

describe("ProjectsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    });
  });

  describe("rendering", () => {
    it("should display loading state initially", () => {
      renderComponent();
      expect(screen.getByText("Loading projects...")).toBeInTheDocument();
    });

    it("should render projects list", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("2 Projects")).toBeInTheDocument();
      });
    });

    it("should show grid and list view toggle", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("Grid")).toBeInTheDocument();
        expect(screen.getByText("List")).toBeInTheDocument();
      });
    });

    it("should display project cards in grid view", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
        expect(screen.getByText("Game in Progress")).toBeInTheDocument();
      });
    });
  });

  describe("project display", () => {
    it("should show project title and description", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
        expect(screen.getByText("A fun puzzle game")).toBeInTheDocument();
      });
    });

    it("should show visibility badges", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getAllByText("Public").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Private").length).toBeGreaterThan(0);
      });
    });

    it("should show completion status", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("Completed")).toBeInTheDocument();
        expect(screen.getByText("In Progress")).toBeInTheDocument();
      });
    });

    it("should display tags", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getAllByText("game").length).toBeGreaterThan(0);
        expect(screen.getByText("puzzle")).toBeInTheDocument();
      });
    });
  });

  describe("view mode switching", () => {
    it("should switch between list and grid view", async () => {
      const user = userEvent.setup();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
      });

      const listButton = screen.getByText("List");
      await user.click(listButton);

      // List view button should be highlighted
      expect(listButton).toHaveClass("bg-blue-600");
    });
  });

  describe("empty state", () => {
    it("should show empty state when no projects", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
      queryClient.clear();

      renderComponent();
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "No projects yet" })).toBeInTheDocument();
      });
    });
  });

  describe("error handling", () => {
    it("should show error message on fetch failure", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      queryClient.clear();

      renderComponent();
      await waitFor(() => {
        expect(screen.getByText("Failed to load projects")).toBeInTheDocument();
      });
    });
  });

  describe("callbacks", () => {
    it("should call onEdit when edit button clicked", async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      renderComponent({ onEdit });

      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({
          id: "1",
          title: "My First Game",
        }));
      });
    });

    it("should call onDelete when delete button clicked", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      renderComponent({ onDelete });

      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith("1");
      });
    });

    it("should call onViewProject when view button clicked", async () => {
      const user = userEvent.setup();
      const onViewProject = vi.fn();

      renderComponent({ onViewProject });

      await waitFor(() => {
        expect(screen.getByText("My First Game")).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole("button", { name: /view/i });
      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(onViewProject).toHaveBeenCalledWith(expect.objectContaining({
          id: "1",
          title: "My First Game",
        }));
      });
    });
  });
});
