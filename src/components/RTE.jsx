import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RTE({ value, onChange, label }) {
  const editorRef = useRef(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY || "";

  return (
    <div>
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <Editor
        apiKey={apiKey}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={(newValue) => {
          if (typeof onChange === "function") {
            onChange(newValue);
          }
        }}
      />
    </div>
  );
}
