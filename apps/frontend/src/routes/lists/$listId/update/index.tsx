import { createFileRoute } from "@tanstack/react-router";

const ListsItemUpdate = () => <></>;

export const Route = createFileRoute("/lists/$listId/update/")({
  component: ListsItemUpdate,
});
