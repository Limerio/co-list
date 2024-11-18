"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { http } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const signInFormValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInValidatorInput = z.input<typeof signInFormValidator>;
type SignInValidatorOutput = z.output<typeof signInFormValidator>;

const SignInPage = () => {
  const form = useForm<SignInValidatorInput, unknown, SignInValidatorOutput>({
    resolver: zodResolver(signInFormValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { mutateAsync } = useMutation<void, Error, SignInValidatorOutput>({
    mutationFn: async (values) => {
      try {
        const { data, status } = await http.post("/auth/sign-in", values);

        if (status === 201) {
          localStorage.setItem("userId", data.id);
          router.push("/lists");
          return;
        }
      } catch (error) {
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<SignInValidatorOutput> = async (values) => {
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="someone@somewhere.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Min 8 chars.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </main>
  );
};

export default SignInPage;
