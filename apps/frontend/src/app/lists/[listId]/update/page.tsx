"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { http } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const listsItemUpdateValidator = z.object({
  name: z.string().min(3),
});

type ListsItemUpdateValidatorInput = z.input<typeof listsItemUpdateValidator>;
type ListsItemUpdateValidatorOutput = z.output<typeof listsItemUpdateValidator>;

const ListsItemUpdatePage = () => {
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
  const form = useForm<
    ListsItemUpdateValidatorInput,
    unknown,
    ListsItemUpdateValidatorOutput
  >({
    resolver: zodResolver(listsItemUpdateValidator),
    defaultValues: data,
  });
  const router = useRouter();
  const { mutateAsync } = useMutation<
    void,
    Error,
    ListsItemUpdateValidatorOutput
  >({
    mutationFn: async (values) => {
      try {
        const { status } = await http.put(
          `/users/${localStorage.getItem("userId")}/lists/${listId}/update`,
          values
        );

        if (status === 200) {
          router.push(`/lists/${listId}`);
          return;
        }
      } catch (error) {
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<ListsItemUpdateValidatorOutput> = async (
    values
  ) => {
    await mutateAsync(values);
  };

  return (
    <main>
      <h1 className="text-3xl text-center">Sign in</h1>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center items-center gap-5 flex-col mt-12"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update</Button>
        </form>
      </FormProvider>
    </main>
  );
};

export default ListsItemUpdatePage;
