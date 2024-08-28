<script setup>
import { CircleUser, Menu, Package2, Search } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
</script>

<template>
	<div class="grid gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Support</CardTitle>
				<CardDescription>
					Used to identify your store in the marketplace.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<Input placeholder="Store Name" />
				</form>
			</CardContent>
			<CardFooter class="border-t px-6 py-4">
				<Button>Save</Button>
			</CardFooter>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle>Plugins Directory</CardTitle>
				<CardDescription>
					The directory within your project, in which your plugins are located.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form class="flex flex-col gap-4">
					<Input placeholder="Project Name" default-value="/content/plugins" />
					<div class="flex items-center space-x-2">
						<Checkbox id="include" default-checked />
						<label
							for="include"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Allow administrators to change the directory.
						</label>
					</div>
				</form>
			</CardContent>
			<CardFooter class="border-t px-6 py-4">
				<Button>Save</Button>
			</CardFooter>
		</Card>
	</div>
</template>

<style lang="scss" scoped></style>
