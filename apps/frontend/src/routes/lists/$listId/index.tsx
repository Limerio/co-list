import { createFileRoute } from '@tanstack/react-router'

const ListsItemView = () => <></>

export const Route = createFileRoute('/lists/$listId/')({
  component: ListsItemView,
})
