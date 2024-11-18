import { http } from "@/lib/http";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEventHandler, useRef } from "react";
import { z } from "zod";

const signInFormValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignInPage = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { mutateAsync } = useMutation<
    void,
    Error,
    z.output<typeof signInFormValidator>
  >({
    mutationFn: async (values) => {
      try {
        const { status } = await http.post("/auth/sign-in", values);

        if (status === 201) {
          navigate({
            to: "/lists",
          });
          return;
        }
      } catch (error) {
        throw error;
      }
    },
  });

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    await mutateAsync(
      await signInFormValidator.parseAsync({
        email: emailRef.current,
        password: passwordRef.current,
      })
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <input name="email" ref={emailRef} />
      <input name="password" type="password" ref={passwordRef} />

      <button type="submit">Submit</button>
    </form>
  );
};

export const Route = createFileRoute("/auth/sign-in/")({
  component: SignInPage,
});
