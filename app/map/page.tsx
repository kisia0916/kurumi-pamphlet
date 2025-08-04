"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

// APIから取得する建物データの型
type Building = {
  id: number;
  name: string;
  status: 'hard' | 'middle' | 'empty';
  picture: string;
  _count: {
    projects: number;
    floors: number;
  };
};

function page() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/map/H');
  }, [router]);
  return (
    <></>
  )
}

export default page