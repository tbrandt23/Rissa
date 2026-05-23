import { TextareaHTMLAttributes, InputHTMLAttributes } from "react";

const base =
  "w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 text-foreground font-sans text-[15px] font-light placeholder:text-muted focus:outline-none focus:border-foreground transition-colors duration-300";

export function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function FormTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className={`${base} resize-none ${props.className ?? ""}`}
    />
  );
}
