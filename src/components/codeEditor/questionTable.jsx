"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-foreground/60 hover:text-foreground p-0 justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-semibold text-foreground transition-colors">
        {row.getValue("name")}
      </div>
    ),
  },
  // {
  //   accessorKey: "allowedLanguages",
  //   header: ({ column }) => {
  //     return (
  //       <div className="w-full flex items-center justify-center">
  //         <Button
  //           variant="link"
  //           className="text-foreground/60 hover:text-foreground p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Languages
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const languages = row.getValue("allowedLanguages") || [];
  //     return (
  //       <div className="w-full flex items-center justify-center">
  //         <div className="flex flex-wrap gap-1 justify-center">
  //           {languages.slice(0, 3).map((lang, index) => (
  //             <Badge
  //               key={index}
  //               variant="outline"
  //               className="text-xs px-1.5 py-0.5 bg-muted/50 border-muted-foreground/20"
  //             >
  //               {lang.toUpperCase()}
  //             </Badge>
  //           ))}
  //           {languages.length > 3 && (
  //             <Badge
  //               variant="outline"
  //               className="text-xs px-1.5 py-0.5 bg-muted/50 border-muted-foreground/20"
  //             >
  //               +{languages.length - 3}
  //             </Badge>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     const languages = row.getValue(id) || [];
  //     if (!value || value.length === 0) return true;
  //     return value.some((lang) => languages.includes(lang));
  //   },
  // },
  {
    accessorKey: "difficulty",
    sortingFn: (rowA, rowB) => {
      const difficultyMap = {
        basic: 0,
        easy: 1,
        medium: 2,
        hard: 3,
        expert: 4,
      };
      const difficultyA = difficultyMap[rowA.getValue("difficulty")] || 0;
      const difficultyB = difficultyMap[rowB.getValue("difficulty")] || 0;
      return difficultyA - difficultyB;
    },
    header: ({ column }) => {
      return (
        <div className="w-full flex items-center justify-end">
          <Button
            variant="link"
            className="text-foreground/60 hover:text-foreground p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Difficulty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const diff = row.getValue("difficulty");
      const difficultyConfig = {
        easy: "bg-green-500/20 text-green-600 border-green-500/30 hover:bg-green-500/30",
        medium:
          "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/30",
        hard: "bg-red-500/20 text-red-600 border-red-500/30 hover:bg-red-500/30",
        basic:
          "bg-blue-500/20 text-blue-600 border-blue-500/30 hover:bg-blue-500/30",
        expert:
          "bg-purple-500/20 text-purple-600 border-purple-500/30 hover:bg-purple-500/30",
      };

      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant="outline"
            className={`capitalize font-medium ${
              difficultyConfig[diff] || difficultyConfig.medium
            }`}
          >
            {diff}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "point",
    header: ({ column }) => {
      return (
        <div className="w-full flex items-center justify-end">
          <Button
            variant="link"
            className="text-foreground/60 hover:text-foreground p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Points
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-semibold text-foreground">
        <Badge variant="secondary" className="font-semibold">
          {row.getValue("point")} pts
        </Badge>
      </div>
    ),
  },
  // {
  //   accessorKey: "timeLimit",
  //   header: ({ column }) => {
  //     return (
  //       <div className="w-full flex items-center justify-center">
  //         <Button
  //           variant="link"
  //           className="text-foreground/60 hover:text-foreground p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Time Limit
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="text-center text-sm text-muted-foreground">
  //       {row.getValue("timeLimit")}s
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "memoryLimit",
  //   header: ({ column }) => {
  //     return (
  //       <div className="w-full flex items-center justify-center">
  //         <Button
  //           variant="link"
  //           className="text-foreground/60 hover:text-foreground p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Memory
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="text-center text-sm text-muted-foreground">
  //       {row.getValue("memoryLimit")}MB
  //     </div>
  //   ),
  // },
];

function QuestionsTable({ questions: data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Memoized data processing for better performance
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      // Ensure all required fields exist with defaults
      name: item.name || "Untitled",
      difficulty: item.difficulty || "medium",
      point: item.point || 0,
      allowedLanguages: item.allowedLanguages || [],
      // timeLimit: item.timeLimit || 1,
      // memoryLimit: item.memoryLimit || 256,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, "-") || "",
    }));
  }, [data]);

  // Custom filter function for global search
  const globalFilterFn = (row, columnId, value) => {
    const search = value.toLowerCase();
    return (
      row.original.name?.toLowerCase().includes(search) ||
      row.original.difficulty?.toLowerCase().includes(search) ||
      row.original.allowedLanguages?.some((lang) =>
        lang.toLowerCase().includes(search)
      ) ||
      row.original.point?.toString().includes(search)
    );
  };

  const table = useReactTable({
    data: processedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    // Performance optimizations
    enableRowSelection: false,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
  });

  // Filter options
  const difficultyOptions = useMemo(() => {
    const difficulties = [
      ...new Set(processedData.map((item) => item.difficulty)),
    ];
    return difficulties.filter(Boolean).sort();
  }, [processedData]);

  // const languageOptions = useMemo(() => {
  //   const languages = [
  //     ...new Set(processedData.flatMap((item) => item.allowedLanguages || [])),
  //   ];
  //   return languages.filter(Boolean).sort();
  // }, [processedData]);

  // Clear filters function
  const clearFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setSorting([]);
    table.resetPageIndex();
  };

  return (
    <div className="w-full space-y-4">
      {/* Enhanced Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 items-center">
          {/* Difficulty Filter */}
          <Select
            value={table.getColumn("difficulty")?.getFilterValue() ?? ""}
            onValueChange={(value) =>
              table
                .getColumn("difficulty")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficultyOptions.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Language Filter */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Languages
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languageOptions.map((language) => (
                <DropdownMenuCheckboxItem
                  key={language}
                  className="capitalize"
                  checked={
                    table
                      .getColumn("allowedLanguages")
                      ?.getFilterValue()
                      ?.includes(language) ?? false
                  }
                  onCheckedChange={(value) => {
                    const currentFilter =
                      table.getColumn("allowedLanguages")?.getFilterValue() ||
                      [];
                    const newFilter = value
                      ? [...currentFilter, language]
                      : currentFilter.filter((lang) => lang !== language);
                    table
                      .getColumn("allowedLanguages")
                      ?.setFilterValue(
                        newFilter.length ? newFilter : undefined
                      );
                  }}
                >
                  {language.toUpperCase()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>

          {/* Page Size Selector */}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {table.getFilteredRowModel().rows.length} of{" "}
          {processedData.length} problems
        </div>
        <div className="flex items-center gap-2">
          {(globalFilter || columnFilters.length > 0) && (
            <Badge variant="secondary" className="text-xs">
              {table.getFilteredRowModel().rows.length} filtered
            </Badge>
          )}
        </div>
      </div>
      {/* Enhanced Table with Scrollable Body */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-0">
                        <Link
                          href={`/practice/${row.original.slug}`}
                          className="block w-full h-full cursor-pointer py-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Link>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {globalFilter || columnFilters.length > 0
                      ? "No problems match your search criteria."
                      : "No problems available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length}{" "}
          total)
        </div>

        <div className="flex items-center gap-2">
          {/* Go to first page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:flex"
          >
            First
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, table.getPageCount()) },
              (_, i) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const totalPages = table.getPageCount();

                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (pageIndex <= 2) {
                  pageNum = i;
                } else if (pageIndex >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = pageIndex - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum + 1}
                  </Button>
                );
              }
            )}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          {/* Go to last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden sm:flex"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionsTable;
