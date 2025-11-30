import { JSX } from "preact";
import { Signal } from "@preact/signals";

export default function ToggleSelect(
  props: JSX.HTMLAttributes<HTMLButtonElement> & {
    currentIndex: Signal<number>;
    options: string[];
    extraOnClickFunction: (artistName: string) => void;
  },
) {
  const numOptions = props.options.length;
  const sliderWidthPercent = 100 / numOptions;

  function switchArtist() {
    if (props.disabled) return;
    console.debug("Switching artist...");
    props.currentIndex.value = (props.currentIndex.value + 1) % numOptions;
    props.extraOnClickFunction(props.options[props.currentIndex.value]);
  }

  return (
    // Main container acts as the clickable surface.
    <div
      className="inline-flex gap-x-4 px-2 m-4 relative rounded-full bg-gray-200 shadow-inner cursor-pointer select-none transition-all duration-300 ease-in-out overflow-hidden max-w-full"
      onClick={switchArtist}
      title={(props.disabled &&
        "Complete your current game to switch artist.") || ""}
    >
      {
        /* The Moving Slider Element (Highlight)
        It uses the CSS variables set on the parent for positioning and size.
      */
      }
      <div
        className={`absolute h-full top-0 left-0 ${
          !props.disabled && "bg-sky-500"
        } ${
          props.disabled && "bg-gray-400"
        } rounded-full shadow-md transition-all duration-300 ease-in-out`}
        style={{
          width: `${sliderWidthPercent}%`,
          transform: `translateX(${
            props.currentIndex.value * 2 * sliderWidthPercent
          }%)`,
        }}
      />

      {/* Option Labels */}
      {props.options.map((option, index) => (
        <div
          key={option}
          // flex-1 ensures even distribution of space among options
          className={"flex-1 px-4 py-2 text-center z-10 transition-colors duration-300 ease-in-out text-m whitespace-nowrap font-semibold " +
            (index === props.currentIndex.value ? "text-white" : "text-black")}
          // The label itself is not clickable to advance, only the parent container.
        >
          {option}
        </div>
      ))}
    </div>
  );
}
