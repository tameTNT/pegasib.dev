import {GuessInfoProps} from "./islandProps.d.ts";

export default function ProgressBlock(props: GuessInfoProps) {
  return (
    <div>
      {props.history.value.map((item, index) =>
        <div key={index}>{
          (item === true && `Guess ${index+1} correct!`) ||
          (item === false && `Guess ${index+1} incorrect!`) ||
          (item === null && `No guess at ${index+1}.`)
        }</div>
      )}
    </div>
  )
}