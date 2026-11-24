'use client';

import { useEffect, useState } from 'react';
import { getAge } from '@/lib/age';

export function Age({ dateOfBirth }: { dateOfBirth: string }) {
  const [age, setAge] = useState(() => getAge(dateOfBirth));

  useEffect(() => {
    setAge(getAge(dateOfBirth));
  }, [dateOfBirth]);

  return <span suppressHydrationWarning>{age}</span>;
}
