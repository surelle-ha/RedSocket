<script setup>
import { ReloadIcon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { h, ref, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useLogin } from "@/services/AuthenticationService";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const { toast } = useToast();
const router = useRouter();

const isLoading = ref(false);
const rememberMe = ref(false);
const email = ref("");
const password = ref("");
const pageError = ref("");

onMounted(() => {
	const savedEmail = localStorage.getItem("userEmail");
	if (savedEmail) {
		email.value = savedEmail;
		rememberMe.value = true;
	}
});

const handleChange = () => {
	rememberMe.value = !rememberMe.value;
}

const handleLogin = async (e) => {
	isLoading.value = true;
	pageError.value = "";

	if (email.value == "" || password.value == "") {
		pageError.value = "Please type your email or password to proceed.";
		isLoading.value = false;
		return 1;
	}

	const userData = {
		email: email.value,
		password: password.value,
	};

	try {
		const response = await useLogin(userData);

		if (response.data) {
			authStore.setUser(
				response.data.userData.user,
				response.data.userData.token
			);

			toast({
				title: "Authentication Successful!",
				description: response.data.message,
			});

			if (rememberMe.value) {
				localStorage.setItem("userEmail", email.value);
			}

			router.push({ name: "Dashboard" });

			isLoading.value = false;
			password.value = "";
		} else {
			isLoading.value = false;
			toast({
				title: "Uh oh! Something went wrong",
				description: response,
				variant: "destructive",
			});
		}
	} catch (e) {
		isLoading.value = false;
		toast({
			title: "Uh oh! Something went wrong",
			description: "It seems like there's an issue with the server. Please contact the developer.",
			variant: "destructive",
		});
	}
};
</script>

<template>
	<Card class="mx-auto max-w-sm">
		<CardHeader>
			<CardTitle class="text-2xl"> Login </CardTitle>
			<CardDescription>
				Enter your email below to login to your account
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						v-model="email"
						v-on:keyup.enter="handleLogin"
						required
					/>
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="#" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" v-model="password" v-on:keyup.enter="handleLogin" required />
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="terms" @update:checked="handleChange" :checked="rememberMe"/>
					<label
						for="terms"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Remember Me
					</label>
				</div>
				<Button
					type="submit"
					class="w-full"
					@click="handleLogin"
					v-if="!isLoading"
				>
					Login
				</Button>
				<Button disabled v-else>
					<ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
					Please wait
				</Button>
				<Button variant="outline" class="w-full line-through">
					Login with Google
				</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<router-link :to="{ name: 'Register' }" class="underline">
					Sign up
				</router-link>
			</div>
		</CardContent>
	</Card>
</template>
