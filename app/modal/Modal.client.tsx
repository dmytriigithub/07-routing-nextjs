"use client";

import { Formik, Form, ErrorMessage, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./page.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NotesHTTPResponse } from "@/types/note";

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(50, "Title too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function ModalClient() {
  const fieldId = useId();
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutationCreate = useMutation({
    mutationFn: (note: NoteFormValues) => createNote(note),
    onSuccess: (newNote) => {
      queryClient.setQueryData(["notes", "", 1], (old: NotesHTTPResponse) => {
        if (!old) return old;
        return { ...old, notes: [newNote, ...old.notes] };
      });
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
    onError: () => toast.error("Failed to create note."),
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutationCreate.mutate(values);
    actions.resetForm();
  };

  return (
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={css.form}>
            <fieldset className={css.fieldset}>
              <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-title`}>Title</label>
                <Field
                  id={`${fieldId}-title`}
                  type="text"
                  name="title"
                  className={css.input}
                />
                <span className={css.error}>
                  <ErrorMessage name="title" />
                </span>
              </div>
              <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-content`}>Content</label>
                <Field
                  as="textarea"
                  id={`${fieldId}-content`}
                  rows={8}
                  name="content"
                  className={css.textarea}
                />
                <span className={css.error}>
                  <ErrorMessage name="content" />
                </span>
              </div>

              <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-tag`}>Tag</label>
                <Field
                  as="select"
                  id={`${fieldId}-tag`}
                  name="tag"
                  className={css.select}
                >
                  <option value="" disabled>
                    -- Choose Tag--
                  </option>
                  <option value="Todo">Todo</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Shopping">Shopping</option>
                </Field>
                <span className={css.error}>
                  <ErrorMessage name="tag" />
                </span>
              </div>
            </fieldset>

            <div className={css.actions}>
              <button
                type="button"
                onClick={() => router.push("/notes")}
                className={css.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={mutationCreate.isPending}
              >
                Create note
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
