<script setup>
import { CircleUser, Menu, Package2, Search } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (routeName) => {
  return route.name === routeName;
};
</script>

<template>
	<main
		class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
	>
		<div class="mx-auto grid w-full max-w-6xl gap-2">
			<h1 class="text-3xl font-semibold">Settings</h1>
		</div>
		<div
			class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
		>
			<nav class="grid gap-4 text-sm text-muted-foreground">
				<router-link :to="{ name: 'Account' }" :class="{'font-semibold text-primary': isActive('Account'), 'bg-acincset': isActive('Account')}"> Account </router-link>
				<router-link :to="{ name: 'General' }" :class="{'font-semibold text-primary': isActive('General'), 'bg-acincset': isActive('General')}"> General </router-link>
				<router-link :to="{ name: 'Security' }" :class="{'font-semibold text-primary': isActive('Security'), 'bg-acincset': isActive('Security')}"> Security </router-link>
				<router-link :to="{ name: 'Support' }" :class="{'font-semibold text-primary': isActive('Support'), 'bg-acincset': isActive('Support')}"> Support </router-link>
				<router-link :to="{ name: 'Developer' }" :class="{'font-semibold text-primary': isActive('Developer'), 'bg-acincset': isActive('Developer')}"> Developer </router-link>
				
			</nav>
			<router-view />
		</div>
	</main>
</template>

<style lang="scss" scoped></style>
