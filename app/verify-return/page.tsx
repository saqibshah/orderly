"use client";

import { Button, Callout, Container, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";

interface VerifyReturn {
  tracking: string;
}

const VerifyReturnPage = () => {
  const { register, handleSubmit, setFocus, reset } = useForm<VerifyReturn>();

  const [isReturned, setReturned] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      setError("");
      setReturned("");
      await axios.post("/api/verify_return", data);
      setSubmitting(false);
      setReturned(`${data.tracking} marked as returned`);
      setFocus("tracking");
      reset();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
      setFocus("tracking");
      reset();
      console.log(error);
    }
  });

  return (
    <Container className="p-5">
      <div className="max-w-xl">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
      </div>
      <form className="max-w-xl space-y-3 mb-5" onSubmit={onSubmit}>
        <TextField.Root
          placeholder="Tracking Number"
          {...register("tracking")}
        />
        <Button disabled={isSubmitting}>
          Submit {isSubmitting && <Spinner />}
        </Button>
      </form>
      <div className="max-w-xl">
        {isReturned && (
          <Callout.Root color="blue">
            <Callout.Text>{isReturned}</Callout.Text>
          </Callout.Root>
        )}
      </div>
    </Container>
  );
};

export default VerifyReturnPage;
