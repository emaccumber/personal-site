import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function FourOhFour() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/")
  }, []);

  return (
    <></>
  )
}
