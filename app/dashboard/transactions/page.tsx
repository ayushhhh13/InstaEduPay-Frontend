"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
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
  Filter,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionService } from "@/lib/services/transaction-service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";

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
  order_id: string;
  transaction_amount: number;
  payment_mode: string;
  bank_reference: string;
  payment_time: string;
  status: string;
  error_message: string;
  school_id: string;
  order_amount: number;
  custom_order_id: string;
  gateway: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "payment_time";
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || "";
  const schoolId = searchParams.get("schoolId") || "";
  const searchQuery = searchParams.get("search") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageLimit, setPageLimit] = useState(limit);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(
    status ? status.split(",") : []
  );
  const [selectedSchools, setSelectedSchools] = useState(
    schoolId ? schoolId.split(",") : []
  );

  const [dateRange, setDateRange] = useState({
    from: fromDate ? new Date(fromDate) : null,
    to: toDate ? new Date(toDate) : null,
  });
  const [allTransactions, setAllTransactions] = useState([]);
  const [cachedParams, setCachedParams] = useState({
    page,
    limit,
    sort,
    order,
    status,
    schoolId,
    fromDate,
    toDate,
    searchQuery,
  });

  // Check if filter parameters have changed
  const haveFiltersChanged = () => {
    return (
      cachedParams.status !== status ||
      cachedParams.schoolId !== schoolId ||
      cachedParams.fromDate !== fromDate ||
      cachedParams.toDate !== toDate ||
      cachedParams.searchQuery !== searchQuery
    );
  };

  // Check if pagination or sorting parameters have changed
  const havePaginationOrSortingChanged = () => {
    return (
      cachedParams.page !== page ||
      cachedParams.limit !== limit ||
      cachedParams.sort !== sort ||
      cachedParams.order !== order
    );
  };

  useEffect(() => {
    // Only fetch from API when necessary (first load or search term changes)
    if (
      allTransactions.length === 0 ||
      searchQuery !== cachedParams.searchQuery
    ) {
      fetchTransactions();
    } else {
      // Otherwise filter the existing data locally
      applyLocalFilters();
    }

    // Update cached params
    setCachedParams({
      page,
      limit,
      sort,
      order,
      status,
      schoolId,
      fromDate,
      toDate,
      searchQuery,
    });
  }, [
    page,
    limit,
    sort,
    order,
    status,
    schoolId,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Only pass search parameter to backend, handle other filters locally
      const response = await transactionService.getAllTransactions(
        1, // Always fetch page 1
        sort,
        order,
        "", // Don't filter by status on backend
        "", // Don't filter by date on backend
        "", // Don't filter by date on backend
        searchQuery, // Only search needs to go to backend
        1000 // Fetch more records to handle local filtering
      );

      console.log("Fetched transactions:", response);

      // Store all transactions for local filtering
      setAllTransactions(response.data || []);
      setTotalTransactions(response.data.length);
      setTotalPages(Math.ceil(response.data.length / limit));

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = response.data.slice(startIndex, endIndex);

      setTransactions(paginatedData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setAllTransactions([]);
      setTotalTransactions(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = () => {
    setLoading(true);

    try {
      // Start with all transactions
      let filteredData: ITransaction[] = [...allTransactions];

      // Apply status filter
      if (status) {
        const statusArray = status.split(",");
        filteredData = filteredData.filter((t) =>
          statusArray.includes(t.status)
        );
      }

      // Apply school filter
      if (schoolId) {
        const schoolArray = schoolId.split(",");
        filteredData = filteredData.filter((t) =>
          schoolArray.includes(t.school_id)
        );
      }

      // Apply date range filter
      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        filteredData = filteredData.filter(
          (t) => new Date(t.payment_time) >= fromDateObj
        );
      }

      if (toDate) {
        const toDateObj = new Date(toDate);
        // Add one day to include the end date fully
        toDateObj.setDate(toDateObj.getDate() + 1);
        filteredData = filteredData.filter(
          (t) => new Date(t.payment_time) <= toDateObj
        );
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (t) =>
            (t.collect_id && t.collect_id.toLowerCase().includes(query)) ||
            (t.custom_order_id &&
              t.custom_order_id.toLowerCase().includes(query)) ||
            (t.gateway && t.gateway.toLowerCase().includes(query))
        );
      }

      // Apply sorting
      if (sort) {
        filteredData.sort((a, b) => {
          let valueA = a[sort as keyof ITransaction];
          let valueB = b[sort as keyof ITransaction];

          // Handle numeric values
          if (typeof valueA === "number" && typeof valueB === "number") {
            return order === "asc" ? valueA - valueB : valueB - valueA;
          }

          // Handle date values
          if (sort === "payment_time") {
            valueA = new Date(valueA).getTime();
            valueB = new Date(valueB).getTime();
            return order === "asc" ? valueA - valueB : valueB - valueA;
          }

          // Handle string values
          valueA = String(valueA || "").toLowerCase();
          valueB = String(valueB || "").toLowerCase();
          return order === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        });
      }

      // Calculate total for pagination
      setTotalTransactions(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / limit));

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setTransactions(paginatedData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQueryParams = (
    params: { [s: string]: unknown } | ArrayLike<unknown>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    const url = `/dashboard/transactions?${newParams.toString()}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  const handlePageChange = (newPage: number) => {
    console.log("Changing page to:", newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const handleLimitChange = (newLimit: { toString: () => any }) => {
    console.log("Changing limit to:", newLimit);
    setPageLimit(Number(newLimit));
    updateQueryParams({ page: "1", limit: newLimit.toString() });
  };

  const handleSortChange = (column: string) => {
    if (sort === column) {
      updateQueryParams({ order: order === "asc" ? "desc" : "asc" });
    } else {
      updateQueryParams({ sort: column, order: "asc" });
    }
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedSchools([]);
    setDateRange({ from: null, to: null });

    router.push("/dashboard/transactions");
  };

  const handleApplyFilters = () => {
    updateQueryParams({
      page: "1",
      status: selectedStatuses.length > 0 ? selectedStatuses.join(",") : "",
      schoolId: selectedSchools.length > 0 ? selectedSchools.join(",") : "",
      fromDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      toDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    });
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
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Manage and view all payment transactions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Transactions</h4>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Status</h5>
                        <div className="flex flex-wrap gap-2">
                          {["success", "pending", "failed"].map(
                            (statusOption) => (
                              <div
                                key={statusOption}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`status-${statusOption}`}
                                  checked={selectedStatuses.includes(
                                    statusOption
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedStatuses([
                                        ...selectedStatuses,
                                        statusOption,
                                      ]);
                                    } else {
                                      setSelectedStatuses(
                                        selectedStatuses.filter(
                                          (s) => s !== statusOption
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`status-${statusOption}`}
                                  className="capitalize"
                                >
                                  {statusOption}
                                </Label>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">School</h5>
                        <div className="max-h-40 overflow-y-auto">
                          {Object.entries(SCHOOLS).map(([id, name]) => (
                            <div
                              key={id}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <Checkbox
                                id={`school-${id}`}
                                checked={selectedSchools.includes(id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSchools([
                                      ...selectedSchools,
                                      id,
                                    ]);
                                  } else {
                                    setSelectedSchools(
                                      selectedSchools.filter((s) => s !== id)
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`school-${id}`}
                                className="text-sm"
                              >
                                {name}
                                <span className="text-xs text-muted-foreground block">
                                  ID: {id}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Date Range</h5>
                        <DatePicker
                          dateRange={dateRange}
                          setDateRange={setDateRange}
                          className={undefined}
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear
                        </Button>
                        <Button onClick={handleApplyFilters}>
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="rounded-md border w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortChange("collect_id")}
                    >
                      Collect Id
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
                      School Id
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
                      Gateway
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
                      Order Amount
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
                      Transaction Amount
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
                      Status
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
                      Custom Order Id
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
                      No transactions found
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
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
        </CardContent>
      </Card>
    </div>
  );
}
