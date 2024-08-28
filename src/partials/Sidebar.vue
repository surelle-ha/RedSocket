<script setup>
import {
	CircleUser,
	Copy,
	CreditCard,
	File,
	Home,
	LineChart,
	ListFilter,
	MoreVertical,
	Package,
	Package2,
	PanelLeft,
	Search,
	Settings,
	ShoppingCart,
	Truck,
	Users2,
	Cog,
	WifiOff,
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
	Pagination,
	PaginationList,
	PaginationNext,
	PaginationPrev,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
	TooltipProvider,
} from "@/components/ui/tooltip";

import { useRoute } from "vue-router";
import { useNetwork } from "@vueuse/core";

const { isOnline, offlineAt } = useNetwork();
const route = useRoute();

const isActive = (routeName) => {
	return route.name === routeName;
};
</script>

<template>
	<aside
		class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"
	>
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="#"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
			>
				<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
				<span class="sr-only">Acme Inc</span>
			</a>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger as-child>
						<router-link
							:to="{ name: 'Home' }"
							:class="[
								'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
								{ 'bg-accent': isActive('Home') },
							]"
						>
							<Home class="h-5 w-5" />
							<span class="sr-only">Home</span>
						</router-link>
					</TooltipTrigger>
					<TooltipContent side="right"> Home </TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger as-child>
						<router-link
							:to="{ name: 'Dashboard' }"
							:class="[
								'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
								{ 'bg-accent': isActive('Dashboard') },
							]"
						>
							<LineChart class="h-5 w-5" />
							<span class="sr-only">Dashboard</span>
						</router-link>
					</TooltipTrigger>
					<TooltipContent side="right"> Dashboard </TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger as-child>
						<router-link
							:to="{ name: 'Users' }"
							:class="[
								'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
								{ 'bg-accent': isActive('Users') },
							]"
						>
							<Users2 class="h-5 w-5" />
							<span class="sr-only">Users</span>
						</router-link>
					</TooltipTrigger>
					<TooltipContent side="right"> Users </TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
		<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
			<TooltipProvider>
				<Tooltip v-if="!isOnline">
					<TooltipTrigger as-child>
						<a
							class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 bg-rose-700"
						>
							<WifiOff class="h-5 w-5" />
							<span class="sr-only">No Internet Connection</span>
						</a>
					</TooltipTrigger>
					<TooltipContent side="right"> No Internet Connection </TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger as-child>
						<router-link
							:to="{ name: 'General' }"
							:class="[
								'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
								{ 'bg-accent': isActive('General') },
							]"
						>
							<Cog class="h-5 w-5" />
							<span class="sr-only">Settings</span>
						</router-link>
					</TooltipTrigger>
					<TooltipContent side="right"> Settings </TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
	</aside>
</template>

<style lang="scss" scoped></style>
