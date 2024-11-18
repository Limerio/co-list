import { createFileRoute } from "@tanstack/react-router";

const ListsPage = () => {};

export const Route = createFileRoute("/lists/")({
  component: ListsPage,
});
