"use client";

import { Button, Callout, Container, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";

interface VerifyReturn {
  tracking: string;
}

const VerifyReturnPage = () => {
  const { register, handleSubmit } = useForm<VerifyReturn>();

  return (
    <Container>
      <form
        className="max-w-xl space-y-3 p-5"
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        <TextField.Root
          placeholder="Tracking Number"
          {...register("tracking")}
        />
        <Button>Submit</Button>
      </form>
      <div className="max-w-xl space-y-3 p-5">
        <Callout.Root color="blue">
          <Callout.Text>Tracking Mark Returned.</Callout.Text>
        </Callout.Root>
      </div>
    </Container>
  );
};

export default VerifyReturnPage;
