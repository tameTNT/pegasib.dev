import { JSX } from "preact";

export function SearchBar(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class="text-2xl p-2 rounded"
    />
  );
}
