"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { paymentService } from "@/lib/services/payment-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard } from "lucide-react"

// School mapping
const SCHOOLS = {
  "65b0e6293e9f76a9694d84b4": "Delhi Public School",
  "65b0e6293e9f76a9694d84b5": "St. Mary's School",
  "65b0e6293e9f76a9694d84b6": "Kendriya Vidyalaya",
  "65b0e6293e9f76a9694d84b7": "Ryan International School",
  "65b0e6293e9f76a9694d84b8": "DAV Public School",
}

export default function CreatePaymentPage() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [formData, setFormData] = useState({
    amount: "",
    callback_url: "",
    school_id: "65b0e6293e9f76a9694d84b4", // Default school ID
    student_info: {
      name: "",
      id: "",
      email: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Set the origin safely after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({
        ...prev,
        callback_url: `${window.location.origin}/dashboard/payment-callback`,
      }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSchoolChange = (schoolId) => {
    setFormData({
      ...formData,
      school_id: schoolId,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await paymentService.createPayment(formData)

      // Store the payment details in localStorage for reference
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "lastPaymentRequest",
          JSON.stringify({
            collect_request_id: response.collect_request_id,
            amount: formData.amount,
            student_info: formData.student_info,
            timestamp: new Date().toISOString(),
          }),
        )
      }

      // Redirect to the payment gateway URL
      if (response.collect_request_url) {
        window.location.href = response.collect_request_url
      } else {
        setError("Payment URL not received from server")
      }
    } catch (err) {
      console.error("Payment creation error:", err)
      setError(err.response?.data?.message || "Failed to create payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Payment</CardTitle>
          <CardDescription>Enter payment details to generate a payment link</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="school_id">School</Label>
              <Select value={formData.school_id} onValueChange={handleSchoolChange}>
                <SelectTrigger id="school_id">
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SCHOOLS).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">School ID: {formData.school_id}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callback_url">Callback URL</Label>
              <Input
                id="callback_url"
                name="callback_url"
                type="url"
                value={formData.callback_url}
                onChange={handleChange}
                required
                disabled
              />
              <p className="text-xs text-muted-foreground">
                This is the URL where the payment gateway will redirect after payment completion
              </p>
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Student Information</h3>

              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  id="student_name"
                  name="student_info.name"
                  placeholder="Enter student name"
                  value={formData.student_info.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  name="student_info.id"
                  placeholder="Enter student ID"
                  value={formData.student_info.id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_email">Student Email</Label>
                <Input
                  id="student_email"
                  name="student_info.email"
                  type="email"
                  placeholder="Enter student email"
                  value={formData.student_info.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-solid rounded-full border-t-transparent animate-spin mr-2"></div>
                  <span>Processing</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Create Payment</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
