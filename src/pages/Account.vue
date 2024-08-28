<script setup>
import { CircleUser, Menu, Package2, Search } from "lucide-vue-next";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select/index.js";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { updateUser } from "@/services/UserService";
import { getRole } from "@/services/RoleService";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/toast/use-toast";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const { toast } = useToast();
const isLoading = ref(false);
const allRoles = ref([]);

const user_id = ref("");
const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const email = ref("");
const role_id = ref("");
const address_1 = ref("");
const address_2 = ref("");
const state = ref("");
const country = ref("");
const zipcode = ref("");

const getRoles = async () => {
	const response = await getRole(authStore.token);
	allRoles.value = response.data;
};

onMounted(() => {
	getRoles();

	user_id.value = authStore.id;
	first_name.value = authStore.first_name;
	middle_name.value = authStore.middle_name;
	last_name.value = authStore.last_name;
	email.value = authStore.email;
	role_id.value = authStore.role_id;
	address_1.value = authStore.address_1;
	address_2.value = authStore.address_2;
	state.value = authStore.state;
	country.value = authStore.country;
	zipcode.value = authStore.zipcode;
});

const handleAccountUpdate = async () => {
	isLoading.value = true;

	const targetUser = user_id.value;
	const token = authStore.token;
	const userData = {
		first_name: first_name.value,
		middle_name: middle_name.value,
		last_name: last_name.value,
		email: email.value,
		address_1: address_1.value,
		address_2: address_2.value,
		state: state.value,
		country: country.value,
		zipcode: zipcode.value,
		role_id: role_id.value,
	};

	const response = await updateUser(targetUser, userData, token);
	console.log(response);
	isLoading.value = false;

	if (response.data) {
		authStore.setUser(userData, token);
		toast({
			title: "Success",
			description: "Account Updated!",
		});
	} else {
		toast({
			title: "Uh oh! Something went wrong",
			description: response,
			variant: "destructive",
		});
	}
};
</script>

<template>
	<div class="grid gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Account ( #{{ user_id }} )</CardTitle>
				<CardDescription>
					Details about your account are provided below.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div class="grid grid-cols-3 gap-6">
						<div class="grid gap-2">
							<Label for="first-name">First name</Label>
							<Input
								id="first-name"
								placeholder="First Name"
								v-model="first_name"
								required
							/>
						</div>
						<div class="grid gap-2">
							<Label for="middle-name">Last name</Label>
							<Input
								id="middle-name"
								placeholder="Middle Name"
								v-model="middle_name"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="last-name">Last name</Label>
							<Input
								id="last-name"
								placeholder="Last Name"
								v-model="last_name"
								required
							/>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mt-4">
						<div class="grid gap-2">
							<Label for="address_1">Address 1</Label>
							<Input
								id="address_1"
								type="text"
								placeholder="Unit # / Floor #"
								v-model="address_1"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="address_2">Address 2</Label>
							<Input
								id="address_2"
								type="text"
								placeholder="Village / Town"
								v-model="address_2"
							/>
						</div>
					</div>
					<div class="grid grid-cols-3 gap-6 mt-4">
						<div class="grid gap-2">
							<Label for="state">State</Label>
							<Input id="state" placeholder="State" v-model="state" required />
						</div>
						<div class="grid gap-2">
							<Label for="country">Country</Label>
							<Input id="country" placeholder="Country" v-model="country" />
						</div>
						<div class="grid gap-2">
							<Label for="zipcode">Zipcode</Label>
							<Input
								id="zipcode"
								placeholder="Zipcode"
								v-model="zipcode"
								required
							/>
						</div>
					</div>

					<div class="grid gap-2 mt-2 hidden">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							v-model="email"
							required
						/>
					</div>
				</form>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle>Role</CardTitle>
				<CardDescription>
					This section provides details about your role, and permissions within
					the platform.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form class="flex flex-col gap-4">
					<RadioGroup :default-value="1" :orientation="'vertical'">
						<div class="flex items-center space-x-2" v-for="role in allRoles">
							<RadioGroupItem id="r1" :value="role.id"/>
							<Label for="r1">{{ role.name }}</Label>
						</div>
					</RadioGroup>
				</form>
			</CardContent>
			<CardFooter class="border-t px-6 py-4">
				<Button @click="handleAccountUpdate">Save</Button>
			</CardFooter>
		</Card>
	</div>
</template>

<style lang="scss" scoped></style>
