<script setup>
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
</script>

<template>
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"> Channels Created </CardTitle>
				<DollarSign class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">542</div>
				<p class="text-xs text-muted-foreground">+20.1% from yesterday</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"> Events Triggered </CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">2,350</div>
				<p class="text-xs text-muted-foreground">+180.1% from yesterday</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"> Queue Event </CardTitle>
				<CreditCard class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">+19% from last month</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"> Connected Clients </CardTitle>
				<Activity class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">573</div>
				<p class="text-xs text-muted-foreground">+201 since last hour</p>
			</CardContent>
		</Card>
	</div>
</template>

<style></style>
