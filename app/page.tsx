"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard or login page based on authentication status
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  )
}
