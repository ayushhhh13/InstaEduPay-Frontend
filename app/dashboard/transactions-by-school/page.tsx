"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionService } from "@/lib/services/transaction-service";

// Real school data mapping
const SCHOOLS: { [key: string]: string } = {
  "65b0e6293e9f76a9694d84b4": "Delhi Public School",
  "65b0e6293e9f76a9694d84b5": "St. Mary's School",
  "65b0e6293e9f76a9694d84b6": "Kendriya Vidyalaya",
  "65b0e6293e9f76a9694d84b7": "Ryan International School",
  "65b0e6293e9f76a9694d84b8": "DAV Public School",
};

interface ITransaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time: string;
}

export default function TransactionsBySchoolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "payment_time";
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || "";
  const schoolId = searchParams.get("schoolId") || "";

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageLimit, setPageLimit] = useState(limit);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(schoolId || "");

  useEffect(() => {
    if (selectedSchool) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setTotalTransactions(0);
      setLoading(false);
    }
  }, [page, limit, sort, order, status, selectedSchool]);

  const fetchTransactions = async () => {
    if (!selectedSchool) return;

    setLoading(true);
    try {
      console.log(
        `Fetching transactions for school: ${selectedSchool}, page: ${page}, limit: ${limit}`
      );
      const response = await transactionService.getSchoolTransactions(
        selectedSchool,
        page,
        sort,
        order,
        status,
        "", // fromDate - removed
        "", // toDate - removed
        "",
        limit
      );
      console.log("Response:", response);
      setTransactions(response.data || []);
      setTotalTransactions(response.total || 0);

      // Calculate total pages based on total records and limit
      const calculatedTotalPages = Math.ceil((response.total || 0) / limit);
      setTotalPages(calculatedTotalPages || 1);

      setCurrentPage(response.page || 1);
      setPageLimit(limit);
    } catch (error) {
      console.error("Error fetching school transactions:", error);
      setTransactions([]);
      setTotalTransactions(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const updateQueryParams = (
    params: ArrayLike<unknown> | { [s: string]: unknown }
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    const url = `/dashboard/transactions-by-school?${newParams.toString()}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  const handlePageChange = (newPage: number) => {
    console.log("Changing page to:", newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const handleLimitChange = (newLimit: { toString: () => any }) => {
    console.log("Changing limit to:", newLimit);
    updateQueryParams({ page: "1", limit: newLimit.toString() });
  };

  const handleSortChange = (column: string) => {
    if (sort === column) {
      updateQueryParams({ order: order === "asc" ? "desc" : "asc" });
    } else {
      updateQueryParams({ sort: column, order: "asc" });
    }
  };

  const handleSchoolChange = (value: SetStateAction<string>) => {
    console.log("School changed to:", value);
    setSelectedSchool(value);
    updateQueryParams({ page: "1", schoolId: value });
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
    return SCHOOLS[schoolId] || schoolId;
  };

  return (
    <div className="space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transactions by School</CardTitle>
              <CardDescription>
                View transactions for a specific school
              </CardDescription>
              {selectedSchool && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Selected School:</span>{" "}
                  {getSchoolName(selectedSchool)} (ID: {selectedSchool})
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedSchool} onValueChange={handleSchoolChange}>
                <SelectTrigger className="w-[200px]">
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          {!selectedSchool ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a school to view transactions
            </div>
          ) : (
            <>
              <div className="rounded-md border w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("collect_id")}
                        >
                          collect_id
                          {sort === "collect_id" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("school_id")}
                        >
                          school_id
                          {sort === "school_id" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("gateway")}
                        >
                          gateway
                          {sort === "gateway" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div
                          className="flex items-center justify-end cursor-pointer"
                          onClick={() => handleSortChange("order_amount")}
                        >
                          order_amount
                          {sort === "order_amount" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div
                          className="flex items-center justify-end cursor-pointer"
                          onClick={() => handleSortChange("transaction_amount")}
                        >
                          transaction_amount
                          {sort === "transaction_amount" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => handleSortChange("status")}
                        >
                          status
                          {sort === "status" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("custom_order_id")}
                        >
                          custom_order_id
                          {sort === "custom_order_id" &&
                            (order === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: pageLimit }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-5 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-20" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-5 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-5 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <Skeleton className="h-5 w-16 mx-auto" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-32" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No transactions found for this school
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction, index) => (
                        <TableRow
                          key={transaction.collect_id || index}
                          className="transition-all duration-200 hover:bg-muted/50 hover:scale-y-105"
                        >
                          <TableCell className="font-medium">
                            {transaction.collect_id || "-"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                {getSchoolName(transaction.school_id)}
                              </div>
                              <div>{transaction.school_id || "-"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.gateway || "-"}</TableCell>
                          <TableCell className="text-right">
                            ₹{transaction.order_amount?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹
                            {transaction.transaction_amount?.toLocaleString() ||
                              "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={`${getStatusBadgeColor(
                                transaction.status
                              )}`}
                            >
                              {transaction.status || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.custom_order_id || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {transactions.length > 0
                        ? (currentPage - 1) * pageLimit + 1
                        : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * pageLimit, totalTransactions)}
                    </span>{" "}
                    of <span className="font-medium">{totalTransactions}</span>{" "}
                    results
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={pageLimit.toString()}
                    onValueChange={handleLimitChange}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={pageLimit} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {currentPage} / {Math.max(1, totalPages)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage >= totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
