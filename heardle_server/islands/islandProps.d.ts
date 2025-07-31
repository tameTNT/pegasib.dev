import { Signal } from '@preact/signals';

interface GuessInfoProps {
  allowed: number;
  count: Signal<number>;
  history: Signal<(boolean | null)[]>;
}
