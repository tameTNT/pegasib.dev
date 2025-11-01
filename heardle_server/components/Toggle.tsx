import { JSX } from "preact";

export default function ToggleSelect(props: JSX.HTMLAttributes<HTMLButtonElement> & {
  currentIndex: number;
  setIndex: (index: number) => void;
  options: string[];
}) {
  if (!props.options || props.options.length < 2) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-lg w-full">
        Error: ToggleSelect requires at least two options.
      </div>
    );
  }

  const numOptions = props.options.length;
  const sliderWidthPercent = 100 / numOptions;

  // 2. Click Handler: Advance to the next option, looping back to the first.
  const handleClick = () => {
    props.setIndex((props.currentIndex + 1) % numOptions);
  };

  return (
    // Main container acts as the clickable surface.
    <div
      className="inline-flex relative my-4 rounded-full bg-gray-200 shadow-inner cursor-pointer select-none transition-all duration-300 ease-in-out overflow-hidden max-w-full"
      onClick={handleClick}
    >
      {/* The Moving Slider Element (Highlight)
        It uses the CSS variables set on the parent for positioning and size.
      */}
      <div
        className="absolute h-full top-0 left-0 bg-sky-500 rounded-full shadow-md transition-all duration-300 ease-in-out"
        style={{
          width: `${sliderWidthPercent}%`,
          transform: `translateX(${props.currentIndex * 2 * sliderWidthPercent}%)`,
        }}
      />

      {/* Option Labels */}
      {props.options.map((option, index) => (
        <div
          key={option}
          // flex-1 ensures even distribution of space among options
          className={`flex-1 px-4 py-2 text-center z-10 transition-colors duration-300 ease-in-out text-m whitespace-nowrap
            ${index === props.currentIndex ? 'text-white' : 'text-black'}
          `}
          // The label itself is not clickable to advance, only the parent container.
        >
          {option}
        </div>
      ))}
    </div>
  );
}
