"use client";

import Spinner from "@/app/components/Spinner";
import { Button, Callout, Container } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FileUploadForm {
  file: FileList;
  courier: "postex" | "trax";
}

const ShipmentFileUploadPage = () => {
  const { register, handleSubmit, setFocus, reset, control } =
    useForm<FileUploadForm>({
      defaultValues: { courier: "postex" },
    });

  const [successMsg, setSuccessMsg] = useState("");
  const [skippedRows, setSkippedRows] = useState<
    { tracking: string; status: string; message: string }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const file = data.file?.[0];
    if (!file) {
      setErrorMsg("Please select a file.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");
      setSkippedRows([]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("courier", data.courier);

      const response = await axios.post("/api/upload-shipments", formData);
      const resData = response.data;

      setSuccessMsg(resData.message || "File processed successfully.");
      setSkippedRows(resData.skipped || []);
      reset();
      setFocus("courier");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";

      setErrorMsg(message);
      reset();
      setFocus("courier");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Container className="p-5">
      <div className="max-w-xl mb-5">
        {errorMsg && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{errorMsg}</Callout.Text>
          </Callout.Root>
        )}
      </div>

      <form className="max-w-xl space-y-3 mb-5" onSubmit={onSubmit}>
        {/* Courier selector */}
        <div className="flex gap-4 mb-3">
          <Controller
            name="courier"
            control={control}
            render={({ field }) => (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="postex"
                    checked={field.value === "postex"}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  Postex
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="trax"
                    checked={field.value === "trax"}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  Trax
                </label>
              </>
            )}
          />
        </div>

        {/* File input */}
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          {...register("file")}
          className="border p-2 rounded w-full"
          autoFocus
        />

        <Button disabled={isSubmitting}>
          Upload File {isSubmitting && <Spinner />}
        </Button>
      </form>

      {/* Success message */}
      {successMsg && (
        <div className="max-w-xl mb-3">
          <Callout.Root color="blue">
            <Callout.Text>{successMsg}</Callout.Text>
          </Callout.Root>
        </div>
      )}

      {/* Skipped rows */}
      {skippedRows.length > 0 && (
        <div className="max-w-xl border p-3 rounded">
          <p className="font-semibold mb-2">
            {skippedRows.length} Skipped Rows
          </p>
          <ul className="list-disc list-inside text-sm">
            {skippedRows.map((row, idx) => (
              <li key={idx}>
                Tracking: {row.tracking}, Status: {row.status}, Message:{" "}
                {row.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default ShipmentFileUploadPage;
