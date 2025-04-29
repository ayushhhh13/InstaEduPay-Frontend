"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { transactionService } from "@/lib/services/transaction-service"

// Real school data
const SCHOOLS = [
  {
    id: "65b0e6293e9f76a9694d84b4",
    name: "Delhi Public School",
  },
  {
    id: "65b0e6293e9f76a9694d84b5",
    name: "St. Mary's School",
  },
  {
    id: "65b0e6293e9f76a9694d84b6",
    name: "Kendriya Vidyalaya",
  },
  {
    id: "65b0e6293e9f76a9694d84b7",
    name: "Ryan International School",
  },
  {
    id: "65b0e6293e9f76a9694d84b8",
    name: "DAV Public School",
  },
]

export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSchools, setFilteredSchools] = useState([])

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredSchools(schools.filter((school) => school.name.toLowerCase().includes(searchTerm.toLowerCase())))
    } else {
      setFilteredSchools(schools)
    }
  }, [searchTerm, schools])

  const fetchSchools = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch this data from your API
      // For now, we'll use the SCHOOLS constant and fetch transaction data for each school
      const schoolsWithStats = await Promise.all(
        SCHOOLS.map(async (school) => {
          try {
            // Fetch transaction stats for each school
            const response = await transactionService.getSchoolTransactions(school.id, 1, 1)

            return {
              ...school,
              totalTransactions: response.total || 0,
              totalAmount: response.data?.reduce((sum, t) => sum + (t.transaction_amount || 0), 0) || 0,
              successRate: (response.data?.filter((t) => t.status === "success").length / response.total) * 100 || 0,
            }
          } catch (error) {
            console.error(`Error fetching stats for school ${school.id}:`, error)
            return {
              ...school,
              totalTransactions: 0,
              totalAmount: 0,
              successRate: 0,
            }
          }
        }),
      )

      setSchools(schoolsWithStats)
      setFilteredSchools(schoolsWithStats)
    } catch (error) {
      console.error("Error fetching schools:", error)
      // Fallback to basic school data without stats
      setSchools(
        SCHOOLS.map((school) => ({
          ...school,
          totalTransactions: 0,
          totalAmount: 0,
          successRate: 0,
        })),
      )
      setFilteredSchools(
        SCHOOLS.map((school) => ({
          ...school,
          totalTransactions: 0,
          totalAmount: 0,
          successRate: 0,
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const handleViewTransactions = (schoolId) => {
    window.location.href = `/dashboard/transactions?schoolId=${schoolId}`
  }

  return (
    <div className="space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Schools</CardTitle>
              <CardDescription>View all schools and their transaction statistics</CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search schools..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead className="text-right">Total Transactions</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Success Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-24 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-9 w-28 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No schools found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell className="text-right">{school.totalTransactions}</TableCell>
                      <TableCell className="text-right">₹{school.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{school.successRate.toFixed(0)}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewTransactions(school.id)}>
                          View Transactions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
