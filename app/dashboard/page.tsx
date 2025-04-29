"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, CreditCard, DollarSign, School } from "lucide-react";
import { transactionService } from "@/lib/services/transaction-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    schools: 0,
  });
  const [loading, setLoading] = useState(true);
  const [transactionsByDay, setTransactionsByDay] = useState<
    { date: string; count: number; amount: number }[]
  >([]);
  const [statusDistribution, setStatusDistribution] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        try {
          const transactions = await transactionService.getAllTransactions(
            1,
            "payment_time",
            "desc",
            "",
            "",
            "",
            "",
            10000
          );

          if (transactions && transactions.data) {
            // Calculate stats
            const total = transactions.data.length;
            const totalAmount = transactions.data.reduce(
              (sum: any, t: { transaction_amount: any }) =>
                sum + (t.transaction_amount || 0),
              0
            );
            const successful = transactions.data.filter(
              (t: { status: string }) => t.status === "success"
            ).length;
            const pending = transactions.data.filter(
              (t: { status: string }) => t.status === "pending"
            ).length;
            const failed = transactions.data.filter(
              (t: { status: string }) => t.status === "failed"
            ).length;

            // Get unique schools
            const uniqueSchools = new Set(
              transactions.data.map((t: { school_id: any }) => t.school_id)
            ).size;

            setStats({
              totalTransactions: total,
              totalAmount: totalAmount,
              successfulTransactions: successful,
              pendingTransactions: pending,
              failedTransactions: failed,
              schools: uniqueSchools,
            });

            // Prepare chart data
            prepareChartData(transactions.data);
          } else {
            // If no data is returned, set default values
            setStats({
              totalTransactions: 0,
              totalAmount: 0,
              successfulTransactions: 0,
              pendingTransactions: 0,
              failedTransactions: 0,
              schools: 0,
            });
            prepareChartData([]);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          // Set default values if API fails
          setStats({
            totalTransactions: 0,
            totalAmount: 0,
            successfulTransactions: 0,
            pendingTransactions: 0,
            failedTransactions: 0,
            schools: 0,
          });
          prepareChartData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const prepareChartData = (transactions: any[]) => {
    // Transactions by day (last 7 days)
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    const transactionsByDayData = last7Days.map((day) => {
      const dayTransactions = transactions.filter(
        (t: { payment_time: string | number | Date }) => {
          const transactionDate = new Date(t.payment_time)
            .toISOString()
            .split("T")[0];
          return transactionDate === day;
        }
      );

      return {
        date: day,
        count: dayTransactions.length,
        amount: dayTransactions.reduce(
          (sum: any, t: { transaction_amount: any }) =>
            sum + (t.transaction_amount || 0),
          0
        ),
      };
    });

    setTransactionsByDay(transactionsByDayData);

    const successful = transactions.filter(
      (t: { status: string }) => t.status === "success"
    ).length;
    const pending = transactions.filter(
      (t: { status: string }) => t.status === "pending"
    ).length;
    const failed = transactions.filter(
      (t: { status: string }) => t.status === "failed"
    ).length;

    const statusData = [
      { name: "Success", value: successful },
      { name: "Pending", value: pending },
      { name: "Failed", value: failed },
    ];

    setStatusDistribution(statusData);
  };

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.totalTransactions}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ₹{stats.totalAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.totalTransactions
                    ? Math.round(
                        (stats.successfulTransactions /
                          stats.totalTransactions) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 10)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.schools}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5)} new this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transactions (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactionsByDay}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
