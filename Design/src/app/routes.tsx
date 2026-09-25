import { createBrowserRouter } from "react-router";
import { Shell } from "./components";
import { ExplorePage, JobsPage, NotFound, ProfilePage, ProjectsPage, TalentPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Shell,
    children: [
      { index: true, Component: ExplorePage },
      { path: "talent", Component: TalentPage },
      { path: "jobs", Component: JobsPage },
      { path: "projects", Component: ProjectsPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", Component: NotFound },
    ],
  },
]);
