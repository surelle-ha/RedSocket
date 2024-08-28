<script setup lang="ts">
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from "@tanstack/vue-table";
import {
	FlexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-vue-next";

import { h, ref, watch } from "vue";
import DropdownAction from "./DataTable.vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
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
import { valueUpdater } from "@/utils";

const props = defineProps({
	users: { type: Array as () => Payment[], required: false, default: () => [] },
});

export interface Payment {
	id: number;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	status: string;
	role_id: number;
	state: string;
	country: string;
}

const data = ref<Payment[]>(props.users);

// Watch for changes in the props.users and update the data accordingly
watch(
	() => props.users,
	(newUsers) => {
		data.value = newUsers;
	},
	{ deep: true, immediate: true }
);

const columns: ColumnDef<Payment>[] = [
	{
		id: "select",
		header: ({ table }) =>
			h(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				"onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
				ariaLabel: "Select all",
			}),
		cell: ({ row }) =>
			h(Checkbox, {
				checked: row.getIsSelected(),
				"onUpdate:checked": (value) => row.toggleSelected(!!value),
				ariaLabel: "Select row",
			}),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["ID", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("id")),
	},
	{
		accessorKey: "first_name",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["First Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("first_name")),
	},
	{
		accessorKey: "middle_name",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Middle Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("middle_name")),
	},
	{
		accessorKey: "last_name",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Last Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("last_name")),
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("email")),
	},
	{
		accessorKey: "state",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["State", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("state")),
	},
	{
		accessorKey: "country",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Country", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("country")),
	},
	{
		accessorKey: "role_id",
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Role", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			);
		},
		cell: ({ row }) => h("div", row.getValue("role_id")),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) =>
			h("div", { class: "capitalize" }, row.getValue("status")),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return h("div", { class: "relative" }, () =>
				h(DropdownAction, {
					payment,
				})
			);
		},
	},
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
	data: data.value,
	columns,
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
	onColumnFiltersChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, columnFilters),
	onColumnVisibilityChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, columnVisibility),
	onRowSelectionChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, rowSelection),
	state: {
		get sorting() {
			return sorting.value;
		},
		get columnFilters() {
			return columnFilters.value;
		},
		get columnVisibility() {
			return columnVisibility.value;
		},
		get rowSelection() {
			return rowSelection.value;
		},
	},
});
</script>

<template>
	<div class="w-full overflow-x-auto">
		<div class="flex gap-2 items-center py-4">
			<Input
				class="max-w-sm"
				placeholder="Filter emails..."
				:model-value="table.getColumn('email')?.getFilterValue() as string"
				@update:model-value="table.getColumn('email')?.setFilterValue($event)"
			/>
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<Button variant="outline" class="ml-auto">
						Columns <ChevronDown class="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuCheckboxItem
						v-for="column in table
							.getAllColumns()
							.filter((column) => column.getCanHide())"
						:key="column.id"
						class="capitalize"
						:checked="column.getIsVisible()"
						@update:checked="
							(value) => {
								column.toggleVisibility(!!value);
							}
						"
					>
						{{ column.id }}
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<div class="rounded-md border">
			<Table class="min-w-full">
				<TableHeader>
					<TableRow
						v-for="headerGroup in table.getHeaderGroups()"
						:key="headerGroup.id"
					>
						<TableHead v-for="header in headerGroup.headers" :key="header.id">
							<FlexRender
								v-if="!header.isPlaceholder"
								:render="header.column.columnDef.header"
								:props="header.getContext()"
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<template v-if="table.getRowModel().rows?.length">
						<TableRow
							v-for="row in table.getRowModel().rows"
							:key="row.id"
							:data-state="row.getIsSelected() && 'selected'"
							:style="row.original.isOnline ? 'color:green;' : ''"
						>
							<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
								<FlexRender
									:render="cell.column.columnDef.cell"
									:props="cell.getContext()"
								/>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger as-child>
										<Button aria-haspopup="true" size="icon" variant="ghost">
											<MoreHorizontal class="h-4 w-4" />
											<span class="sr-only">Toggle menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem>Edit</DropdownMenuItem>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					</template>

					<TableRow v-else>
						<TableCell :col-span="columns.length" class="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<div class="flex items-center justify-end space-x-2 py-4">
			<div class="flex-1 text-sm text-muted-foreground">
				{{ table.getFilteredSelectedRowModel().rows.length }} of
				{{ table.getFilteredRowModel().rows.length }} row(s) selected.
			</div>
			<div class="space-x-2">
				<Button
					variant="outline"
					size="sm"
					:disabled="!table.getCanPreviousPage()"
					@click="table.previousPage()"
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					:disabled="!table.getCanNextPage()"
					@click="table.nextPage()"
				>
					Next
				</Button>
			</div>
		</div>
	</div>
</template>
