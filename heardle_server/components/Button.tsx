import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class={`${props.class} py-1 px-2 h-full border-2 border-white text-white bg-sky-500 hover:bg-sky-600 transition-colors cursor-pointer`}
    />
  );
}
