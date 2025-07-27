import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class="py-1 px-2 h-full border-2 rounded text-white bg-emerald-600 hover:bg-teal-500 transition-colors"
    />
  );
}
