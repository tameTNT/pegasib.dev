import { Signal } from '@preact/signals';

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<(boolean | null)[]>;
}
