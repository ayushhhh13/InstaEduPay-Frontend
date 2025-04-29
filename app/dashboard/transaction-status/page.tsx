"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionService } from "@/lib/services/transaction-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ITransaction {
  collect_id: string;
  order_id: string;
  transaction_amount: number;
  payment_mode: string;
  bank_reference: string;
  payment_time: string;
  status: string;
  error_message: string;
}
// School mapping
const SCHOOLS: { [key: string]: string } = {
  "65b0e6293e9f76a9694d84b4": "Delhi Public School",
  "65b0e6293e9f76a9694d84b5": "St. Mary's School",
  "65b0e6293e9f76a9694d84b6": "Kendriya Vidyalaya",
  "65b0e6293e9f76a9694d84b7": "Ryan International School",
  "65b0e6293e9f76a9694d84b8": "DAV Public School",
};

export default function TransactionStatusPage() {
  const [customOrderId, setCustomOrderId] = useState("");
  const [transaction, setTransaction] = useState<ITransaction>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!customOrderId.trim()) return;

    setLoading(true);
    setError("");
    setTransaction({} as ITransaction);

    try {
      const response = await transactionService.getTransactionStatus(
        customOrderId
      );

      // Ensure all required fields are present
      const processedTransaction = {
        ...response,
        collect_id: response.collect_id || customOrderId,
        bank_reference: response.bank_reference || "N/A",
        payment_mode: response.payment_mode || "N/A",
        transaction_amount:
          response.transaction_amount || response.order_amount || 0,
        status: response.status || "Unknown",
      };

      setTransaction(processedTransaction);
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      setError(
        "Transaction not found or an error occurred. Please check the ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Get school name from school ID
  const getSchoolName = (schoolId: string) => {
    return SCHOOLS[schoolId] || schoolId || "N/A";
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Check Transaction Status</CardTitle>
          <CardDescription>
            Enter a custom order id to check its current status
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customOrderId">Custom Order Id</Label>
              <div className="flex gap-2">
                <Input
                  id="customOrderId"
                  placeholder="Enter custom order id"
                  value={customOrderId}
                  onChange={(e) => setCustomOrderId(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-solid rounded-full border-t-transparent animate-spin mr-2"></div>
                      <span>Searching</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      <span>Search</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}

            {!loading && transaction && (
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Transaction Details</h3>
                  <Badge
                    className={`${getStatusBadgeColor(transaction.status)}`}
                  >
                    {transaction.status || "Unknown"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Custom Order Id
                    </p>
                    <p className="font-medium">
                      {transaction.collect_id || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">{transaction.order_id || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      ₹{transaction.transaction_amount?.toLocaleString() || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Mode
                    </p>
                    <p className="font-medium">
                      {transaction.payment_mode || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bank Reference
                    </p>
                    <p className="font-medium">
                      {transaction.bank_reference || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Time
                    </p>
                    <p className="font-medium">
                      {transaction.payment_time
                        ? new Date(transaction.payment_time).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {transaction.error_message &&
                  transaction.error_message !== "NA" && (
                    <div>
                      <h4 className="text-md font-semibold mb-2 text-red-500">
                        Error Information
                      </h4>
                      <p>{transaction.error_message}</p>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCustomOrderId("");
                setTransaction({} as ITransaction);
                setError("");
              }}
            >
              Clear
            </Button>
            <Button type="submit" disabled={loading || !customOrderId.trim()}>
              Check Status
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
