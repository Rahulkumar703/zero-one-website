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
  // ArrowRight,
  ArrowUpDown,
  // ChevronDown,
  ChevronLeft,
  ChevronRight,
  // MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

export const columns = [
  // {
  //   accessorKey: "week",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="px-2"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Week
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className="capitalize">{row.getValue("week")}</div>,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-foreground/60"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize font-semibold">{row.getValue("name")}</div>
    ),
  },
  // {
  //   accessorKey: "topics",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Topics
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const topics = row.getValue("topics");
  //     return (
  //       <div className="capitalize">
  //         {topics.map((topic, index) => {
  //           return (
  //             <Badge variant="secondary" key={index}>
  //               {topic}
  //             </Badge>
  //           );
  //         })}
  //       </div>
  //     );
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
      const difficultyA = difficultyMap[rowA.getValue("difficulty")] || 0; // Default to 0 if not found
      const difficultyB = difficultyMap[rowB.getValue("difficulty")] || 0; // Default to 0 if not found
      return difficultyA - difficultyB; // Ascending order
    },
    header: ({ column }) => {
      return (
        <div className="w-full flex items-center justify-center">
          <Button
            variant="link"
            className="text-foreground/60"
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

      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant="default"
            className={`capitalize mx-auto ${
              diff === "easy"
                ? "bg-green-300 hover:bg-green-300/90"
                : diff === "medium"
                ? "bg-blue-300 hover:bg-blue-300/90"
                : "bg-red-300 hover:bg-red-300/90"
            } text-black ml-auto`}
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
        <div className="w-full flex items-center justify-center">
          <Button
            variant="link"
            className="text-foreground/60 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Point
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground/60 group-hover:text-foreground" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.getValue("point")}</div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const problem = row.original;

  //     const deleteProblem = async () => {
  //       try {
  //         const res = await fetch(`/api/problem/${problem.title}`, {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         });
  //         const data = await res.json();
  //         toast[data.type](data.message);
  //       } catch (error) {
  //         toast.error(error.message);
  //       }
  //     };

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(problem._id)}
  //           >
  //             Copy Problem ID
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>Edit</DropdownMenuItem>
  //           <DropdownMenuItem onClick={deleteProblem}>Delete</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Add Solutions</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

function QuestionsTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      // columnVisibility,
      rowSelection,
    },
  });
  const router = useRouter();
  const redirectToQuestion = (slug) => {
    router.push(`playground/${slug}`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 relative my-2">
        <Input
          placeholder="Find Questions by Name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-full pr-10"
        />
        <Button
          size="icon"
          className="absolute right-0 top-0 bg-transparent pointer-events-none"
        >
          <Search className="h-4 w-4 opacity-50" />
        </Button>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto bg-transparent"
            >
              Columns <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border">
        <Table
          containerClass="h-fit max-h-[calc(100vh-15rem)] overflow-y-auto relative"
          className=""
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => redirectToQuestion(row.original.slug)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mt-0.5 fill-none" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="mt-0.5 fill-none" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionsTable;
