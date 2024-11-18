"use client";

import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

const ListsPage = () => {
  const { data } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      try {
        const { data } = await http.get(
          `/users/${localStorage.getItem("userId")}/lists`
        );

        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  return JSON.stringify(data);
};

export default ListsPage;
