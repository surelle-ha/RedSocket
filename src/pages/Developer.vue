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
import { onMounted, ref } from "vue";
import { useSystemStore } from '@/stores/systemStore';

const systemStore = useSystemStore();

const handleChange = () => {
	systemStore.HighlightElementById = !systemStore.HighlightElementById
}
</script>

<template>
	<div class="grid gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Developer</CardTitle>
				<CardDescription>
					The directory within your project, in which your plugins are located.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form class="flex flex-col gap-4">
					<div class="flex items-center space-x-2">
						<Checkbox id="include" @update:checked="handleChange" :checked="systemStore.HighlightElementById"/>
						{{ HighlightElementById }}
						<label
							for="include"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Enable Highlight Element By Point
						</label>
					</div>
				</form>
			</CardContent>
		</Card>
		<Card v-if="systemStore.isElectron">
			<CardHeader>
				<CardTitle>Developer Electron</CardTitle>
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
	</div>
</template>

<style lang="scss" scoped></style>
