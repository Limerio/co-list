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

const signUpFormValidator = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpValidatorInput = z.input<typeof signUpFormValidator>;
type SignUpValidatorOutput = z.output<typeof signUpFormValidator>;

const SignInPage = () => {
  const form = useForm<SignUpValidatorInput, unknown, SignUpValidatorOutput>({
    resolver: zodResolver(signUpFormValidator),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { mutateAsync } = useMutation<void, Error, SignUpValidatorOutput>({
    mutationFn: async (values) => {
      try {
        const { status } = await http.post("/auth/sign-up", values);

        if (status === 201) {
          router.push("/lists");
          return;
        }
      } catch (error) {
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<SignUpValidatorOutput> = async (values) => {
    await mutateAsync(values);
  };

  return (
    <main>
      <h1 className="text-3xl text-center">Sign up</h1>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center items-center gap-5 flex-col mt-12"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
