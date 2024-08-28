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
import { Checkbox } from "@/components/ui/checkbox";

import ThemeToggler from "@/widgets/ThemeToggler.vue";

import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useLogout } from "@/services/AuthenticationService";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
    const pathArray = route.fullPath.split("/").filter(p => p);
    const result = [];
    let path = "";
	
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    pathArray.forEach((seg, index) => {
        path += "/" + seg;
        const title = route.matched[index]?.meta.title || capitalize(seg);
        result.push({
            name: title,
            path
        });
    });
    return result;
});

const handleLogout = async () => {
	console.log('test')
	await useLogout(authStore.token);
	authStore.logout();
	router.push({name:'Login'});
}
</script>

<template>
	<header
		class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
	>
		<Sheet>
			<SheetTrigger as-child>
				<Button size="icon" variant="outline" class="sm:hidden">
					<PanelLeft class="h-5 w-5" />
					<span class="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" class="sm:max-w-xs">
				<nav class="grid gap-6 text-lg font-medium">
					<a
						href="#"
						class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
						<span class="sr-only">Acme Inc</span>
					</a>
					<a
						href="#"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<Home class="h-5 w-5" />
						Dashboard
					</a>
					<a href="#" class="flex items-center gap-4 px-2.5 text-foreground">
						<ShoppingCart class="h-5 w-5" />
						Orders
					</a>
					<a
						href="#"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<Package class="h-5 w-5" />
						Products
					</a>
					<a
						href="#"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<Users2 class="h-5 w-5" />
						Customers
					</a>
					<a
						href="#"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<LineChart class="h-5 w-5" />
						Settings
					</a>
				</nav>
			</SheetContent>
		</Sheet>
		<Breadcrumb class="hidden md:flex">
			<BreadcrumbList>
				<BreadcrumbItem v-for="(crumb, index) in breadcrumbs" :key="index">
					<BreadcrumbLink :to="crumb.path" v-if="index !== breadcrumbs.length - 1">
						{{ crumb.name }}
					</BreadcrumbLink>
					<template v-else>
						{{ crumb.name }}
					</template>
					<BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
		<div class="relative ml-auto flex-1 md:grow-0">
			<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search..."
				class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
			/>
		</div>
		<ThemeToggler />
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button variant="secondary" size="icon" class="rounded-full">
					<CircleUser class="h-5 w-5" />
					<span class="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="() => {router.push({name:'Account'})}">Settings</DropdownMenuItem>
				<DropdownMenuItem @click="() => {router.push({name:'Support'})}">Support</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="handleLogout">Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</header>
</template>

<style lang="scss" scoped></style>
