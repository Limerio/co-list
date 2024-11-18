"use client";

import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ListsItemPage = () => {
  const { listId } = useParams<{ listId: string }>();

  const { data } = useQuery({
    queryKey: ["lists", listId],
    queryFn: async () => {
      try {
        const { data } = await http.get(
          `/users/${localStorage.getItem("userId")}/lists/${listId}`
        );

        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  return JSON.stringify(data);
};

export default ListsItemPage;
