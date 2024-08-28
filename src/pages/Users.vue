<script setup>
import {
	CircleUser,
	File,
	Home,
	LineChart,
	ListFilter,
	MoreHorizontal,
	Package,
	Package2,
	PanelLeft,
	PlusCircle,
	Search,
	Settings,
	ShoppingCart,
	Users2,
} from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { UserTable } from "@/widgets/UserTable";
import { getUser } from "@/services/UserService.js";
import { useAuthStore } from "@/stores/authStore";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const allUsers = ref([]);
const isLoading = ref(false);

const getAllUsers = async () => {
	isLoading.value = true;
	const response = await getUser(authStore.token);
	allUsers.value = response.data;
	isLoading.value = false;
};

onMounted(() => {
	getAllUsers();
});
</script>

<template>
	<main
		class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
		v-if="!isLoading"
	>
		<Tabs default-value="all">
			<div class="flex items-center">
				<TabsList>
					<TabsTrigger value="all"> All </TabsTrigger>
					<TabsTrigger value="active"> Active </TabsTrigger>
					<TabsTrigger value="draft"> Draft </TabsTrigger>
					<TabsTrigger value="archived" class="hidden sm:flex">
						Archived
					</TabsTrigger>
				</TabsList>
				<div class="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button variant="outline" size="sm" class="h-7 gap-1">
								<ListFilter class="h-3.5 w-3.5" />
								<span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
									Filter
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filter by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem checked> Active </DropdownMenuItem>
							<DropdownMenuItem>Draft</DropdownMenuItem>
							<DropdownMenuItem> Archived </DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm" variant="outline" class="h-7 gap-1">
						<File class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Export
						</span>
					</Button>
					<Button size="sm" class="h-7 gap-1">
						<PlusCircle class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Add Product
						</span>
					</Button>
				</div>
			</div>
			<TabsContent value="all">
				<Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
						<CardDescription>
							Manage your users and view their personal information.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UserTable :users="allUsers" />
					</CardContent>
					<CardFooter>
						<div class="text-xs text-muted-foreground">User List</div>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	</main>
</template>

<style lang="scss" scoped></style>
