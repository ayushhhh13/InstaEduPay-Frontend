"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { paymentService } from "@/lib/services/payment-service"

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("processing") // processing, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [error, setError] = useState("")
  const [trans_id, setTrans_id] = useState("")

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Safely get the last payment request from localStorage
        let lastPaymentRequest = {}
        if (typeof window !== "undefined") {
          try {
            const storedData = localStorage.getItem("lastPaymentRequest")
            if (storedData) {
              lastPaymentRequest = JSON.parse(storedData)
            }
          } catch (e) {
            console.error("Error parsing lastPaymentRequest:", e)
          }
        }

        // Get collect_request_id from localStorage instead of URL params
        const collect_request_id = lastPaymentRequest.collect_request_id
        setTrans_id(collect_request_id)
        const school_id = "65b0e6293e9f76a9694d84b4"

        if (!collect_request_id) {
          setStatus("failed")
          setError("Missing payment information. Could not find collect_request_id.")
          return
        }

        // Call the processStatus API with collect_request_id as path parameter and school_id as query parameter
        const paymentStatus = await paymentService.getPaymentStatus(collect_request_id, school_id)

        setPaymentDetails({
          ...paymentStatus.data,
          amount: lastPaymentRequest.amount,
          student_info: lastPaymentRequest.student_info,
        })

        setStatus(paymentStatus.data.status === "SUCCESS" ? "success" : "failed")
      } catch (err) {
        console.error("Error processing payment callback:", err)
        setStatus("failed")
        setError("Failed to verify payment status. Please contact support.")
      }
    }

    processPaymentCallback()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Payment {status === "processing" ? "Processing" : status === "success" ? "Successful" : "Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "processing"
              ? "We are confirming your payment status..."
              : status === "success"
                ? "Your payment has been successfully processed"
                : "There was an issue with your payment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "processing" ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p>Please wait while we verify your payment...</p>
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-medium mb-2">Payment Successful!</p>
              {paymentDetails && (
                <div className="w-full mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-medium">{trans_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ₹{paymentDetails.transaction_amount || paymentDetails.amount || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Mode:</span>
                    <span className="font-medium">{paymentDetails.details?.payment_mode || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {paymentDetails.payment_time
                        ? new Date(paymentDetails.payment_time).toLocaleString()
                        : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-lg font-medium mb-2">Payment Failed</p>
              <p className="text-center text-muted-foreground">
                {error || "Your payment could not be processed. Please try again."}
              </p>
              {paymentDetails?.error_message && <p className="mt-2 text-red-500">{paymentDetails.error_message}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/dashboard/transactions")}>View Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
