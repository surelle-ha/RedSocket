<script setup>
import { ReloadIcon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { h, ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRegister } from "@/services/AuthenticationService";
import { useRouter } from "vue-router";

const { toast } = useToast();
const router = useRouter();
const isLoading = ref(false);

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
	isLoading.value = true;

	if (
		first_name.value === "" ||
		last_name.value === "" ||
		email.value === "" ||
		password.value === ""
	) {
		toast({
			title: "All fields are required.",
			description: "Please fill in all the fields to proceed.",
			variant: "destructive",
		});
		return 0;
	}

	const userData = {
		first_name: first_name.value,
		middle_name: "",
		last_name: last_name.value,
		email: email.value,
		password: password.value,
	};

	try {
		const response = await useRegister(userData);
		isLoading.value = false;

		if (response.data) {
			toast({
				title: "Success!",
				description: "Registration Successful",
			});
			router.push({ name: "Login" });
		} else {
			toast({
				title: "Uh oh! Something went wrong",
				description: response,
				variant: "destructive",
			});
			password.value = "";
		}
	} catch (e) {
		isLoading.value = false;
		toast({
			title: "Uh oh! Something went wrong",
			description:
				"It seems like there's an issue with the server. Please contact the developer.",
			variant: "destructive",
		});
	}
};
</script>

<template>
	<Card class="mx-auto max-w-sm">
		<CardHeader>
			<CardTitle class="text-xl"> Sign Up </CardTitle>
			<CardDescription>
				Enter your information to create an account
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="first-name">First name</Label>
						<Input
							id="first-name"
							placeholder="John"
							v-model="first_name"
							v-on:keyup.enter="handleRegister"
							required
						/>
					</div>
					<div class="grid gap-2">
						<Label for="last-name">Last name</Label>
						<Input
							id="last-name"
							placeholder="Doe"
							v-model="last_name"
							v-on:keyup.enter="handleRegister"
							required
						/>
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						v-on:keyup.enter="handleRegister"
						v-model="email"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						v-model="password"
						v-on:keyup.enter="handleRegister"
					/>
				</div>
				<Button
					type="submit"
					class="w-full"
					@click="handleRegister"
					v-if="!isLoading"
				>
					Create an account
				</Button>
				<Button disabled v-else>
					<ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
					Please wait
				</Button>
				<Button variant="outline" class="w-full line-through">
					Sign up with Google
				</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<router-link :to="{ name: 'Login' }" class="underline">
					Sign in
				</router-link>
			</div>
		</CardContent>
	</Card>
</template>
