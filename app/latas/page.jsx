import { Suspense } from 'react';
import LatasBrowser from '../../components/LatasBrowser';

export default function LatasPage() {
  return (
    <Suspense fallback={null}>
      <LatasBrowser />
    </Suspense>
  );
}
