<script setup lang="ts">
import { h, ref } from "vue";
import { CheckIcon, CircleIcon, DotIcon } from "@radix-icons/vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-icons/vue";
import {
	Stepper,
	StepperDescription,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
	useCheckDatabase,
	useUpdateDatabase,
	useCheckRedis,
	useUpdateRedis,
	useStartMigration,
	useCreateAdministrator,
} from "@/services/InstallerService";
import router from "@/router";

const formSchema = [
	z.object({
		DATABASE_HOST: z.string().nonempty("Database host is required"),
		DATABASE_PORT: z.string().nonempty("Database port is required"),
		DATABASE_NAME: z.string().nonempty("Database name is required"),
		DATABASE_USER: z.string().nonempty("Database user is required"),
		DATABASE_PASS: z.string().nonempty("Database password is required"),
		DATABASE_TYPE: z.enum(["mysql"]).default("mysql"),
	}),
	z.object({
		REDIS_HOST: z.string().nonempty("Redis host is required"),
		REDIS_PORT: z.string().nonempty("Redis port is required"),
	}),
	z.object({
		color: z.string().nonempty("Please select a color"),
	}),
	z.object({
		first_name: z.string().nonempty("First name is required"),
		last_name: z.string().nonempty("Last name is required"),
		email: z
			.string()
			.email("Invalid email format")
			.nonempty("Email is required"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.nonempty("Password is required"),
	}),
];

const stepIndex = ref(1);
const steps = [
	{
		step: 1,
		title: "Database Setup",
		description: "Configure your database credentials",
	},
	{
		step: 2,
		title: "Redis Setup",
		description: "Configure your Redis credentials",
	},
	{
		step: 3,
		title: "Data Migration",
		description: "Setup database schema for RedSocket",
	},
	{
		step: 4,
		title: "Account Setup",
		description: "Create your admin/primary account",
	},
];

async function onSubmit(values: any) {
	const response = await useCreateAdministrator(values);
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
	}
}
const isLoadingDB = ref(false);
const isLoadingRD = ref(false);
const isLoadingMG = ref(false);

const isOpen = ref(true);
const isDatabaseConfigured = ref(false);
const isRedisConfigured = ref(false);
const isMigrated = ref(false);

const testDatabaseConnection = async (values: any) => {
	isLoadingDB.value = true;
	const data = {
		DATABASE_HOST: values.DATABASE_HOST,
		DATABASE_PORT: values.DATABASE_PORT,
		DATABASE_NAME: values.DATABASE_NAME,
		DATABASE_USER: values.DATABASE_USER,
		DATABASE_PASS: values.DATABASE_PASS,
		DATABASE_TYPE: values.DATABASE_TYPE,
	};
	try {
		await useUpdateDatabase(data);
		setTimeout(async () => {
			const result = await useCheckDatabase();
			isDatabaseConfigured.value = result.connection;
			if (isDatabaseConfigured.value) {
				toast({
					title: "Database connected.",
					description: result.message,
				});
			} else {
				toast({
					title: "Unable to connect to database.",
					description: result.message,
				});
			}
			isLoadingDB.value = false;
		}, 5000);
	} catch (error) {
		toast({
			title: "Database failed",
			description: "Error checking database connection",
		});
		isDatabaseConfigured.value = false;
		isLoadingDB.value = false;
	}
};

const testRedisConnection = async (values: any) => {
	isLoadingRD.value = true;
	const data = {
		REDIS_HOST: values.REDIS_HOST,
		REDIS_PORT: values.REDIS_PORT,
	};
	try {
		await useUpdateRedis(data);
		setTimeout(async () => {
			const result = await useCheckRedis();
			isRedisConfigured.value = result.connection;
			if (isRedisConfigured.value) {
				toast({
					title: "Redis connected.",
					description: result.message,
				});
			} else {
				toast({
					title: "Unable to connect to redis.",
					description: result.message,
				});
			}
			isLoadingRD.value = false;
		}, 5000);
	} catch (error) {
		toast({
			title: "Redis failed",
			description: "Error checking redis connection",
		});
		isRedisConfigured.value = false;
		isLoadingRD.value = false;
	}
};

const startMigration = async () => {
	isLoadingMG.value = true;
	try {
		await useStartMigration();
		toast({
			title: "Migration success",
			description: "Database configured and data migrated.",
		});
		isMigrated.value = true;
		isLoadingMG.value = false;
	} catch (error) {
		toast({
			title: "Migration failed",
			description: "Error migrating data to the database.",
		});
		isLoadingMG.value = false;
	}
};
</script>

<template>
	<Dialog :open="isOpen" :closeOnClickOutside="false">
		<DialogContent class="sm:max-w-[825px]">
			<DialogHeader>
				<DialogTitle>Installation</DialogTitle>
				<DialogDescription>
					Your RedSocket needs to be configured. Follow the instructions to set
					up your socket engine.
				</DialogDescription>
			</DialogHeader>
			<Form
				v-slot="{ meta, values, validate }"
				as=""
				keep-values
				:validation-schema="toTypedSchema(formSchema[stepIndex - 1])"
			>
				<Stepper
					v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
					v-model="stepIndex"
					class="block w-full"
				>
					<form
						@submit="
							(e) => {
								e.preventDefault();
								validate();

								if (stepIndex === steps.length && meta.valid) {
									onSubmit(values);
								}
							}
						"
					>
						<div class="flex w-full flex-start gap-2">
							<StepperItem
								v-for="step in steps"
								:key="step.step"
								v-slot="{ state }"
								class="relative flex w-full flex-col items-center justify-center"
								:step="step.step"
							>
								<StepperSeparator
									v-if="step.step !== steps[steps.length - 1].step"
									class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
								/>

								<StepperTrigger as-child>
									<Button
										:variant="
											state === 'completed' || state === 'active'
												? 'default'
												: 'outline'
										"
										size="icon"
										class="z-10 rounded-full shrink-0"
										:class="[
											state === 'active' &&
												'ring-2 ring-ring ring-offset-2 ring-offset-background',
										]"
										:disabled="state !== 'completed' && !meta.valid"
									>
										<CheckIcon v-if="state === 'completed'" class="size-5" />
										<CircleIcon v-if="state === 'active'" />
										<DotIcon v-if="state === 'inactive'" />
									</Button>
								</StepperTrigger>

								<div class="mt-5 flex flex-col items-center text-center">
									<StepperTitle
										:class="[state === 'active' && 'text-primary']"
										class="text-sm font-semibold transition lg:text-base"
									>
										{{ step.title }}
									</StepperTitle>
									<StepperDescription
										:class="[state === 'active' && 'text-primary']"
										class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
									>
										{{ step.description }}
									</StepperDescription>
								</div>
							</StepperItem>
						</div>

						<div class="flex flex-col gap-4 mt-4">
							<template v-if="stepIndex === 1">
								<FormField v-slot="{ componentField }" name="DATABASE_HOST">
									<FormItem>
										<FormLabel>Database Host</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="DATABASE_PORT">
									<FormItem>
										<FormLabel>Database Port</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="DATABASE_NAME">
									<FormItem>
										<FormLabel>Database Name</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="DATABASE_USER">
									<FormItem>
										<FormLabel>Database User</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="DATABASE_PASS">
									<FormItem>
										<FormLabel>Database Password</FormLabel>
										<FormControl>
											<Input type="password" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="DATABASE_TYPE">
									<FormItem>
										<FormLabel>Database Type</FormLabel>
										<FormControl>
											<Input
												type="text"
												v-bind="componentField"
												:value="'mysql'"
												readonly
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</template>

							<template v-if="stepIndex === 2">
								<FormField v-slot="{ componentField }" name="REDIS_HOST">
									<FormItem>
										<FormLabel>Redis Host</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="REDIS_PORT">
									<FormItem>
										<FormLabel>Redis Port</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</template>

							<template v-if="stepIndex === 3">
								<FormField v-slot="{ componentField }" name="color">
									<FormItem>
										<FormLabel>Select Color</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</template>

							<template v-if="stepIndex === 4">
								<FormField v-slot="{ componentField }" name="first_name">
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="last_name">
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input type="text" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="email">
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField v-slot="{ componentField }" name="password">
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</template>
						</div>

						<DialogFooter class="mt-6 flex items-center justify-between">
							<div class="flex gap-2">
								<Button
									type="button"
									variant="outline"
									@click="prevStep"
									:disabled="isPrevDisabled"
								>
									Previous
								</Button>
								<div v-if="isLoadingDB">
									<Button disabled>
										<ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
										Test Connection
									</Button>
								</div>
								<div v-else>
									<Button
										type="submit"
										v-if="stepIndex == 1"
										@click="testDatabaseConnection(values)"
										:disabled="!meta.valid"
									>
										Test Connection
									</Button>
								</div>
								<Button
									type="submit"
									v-if="stepIndex == 1"
									@click="nextStep"
									:disabled="!isDatabaseConfigured"
								>
									Next
								</Button>

								<div v-if="isLoadingRD">
									<Button disabled>
										<ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
										Test Connection
									</Button>
								</div>
								<div v-else>
									<Button
										type="submit"
										v-if="stepIndex == 2"
										@click="testRedisConnection(values)"
										:disabled="!meta.valid"
									>
										Test Connection
									</Button>
								</div>
								<Button
									type="submit"
									v-if="stepIndex == 2"
									@click="nextStep"
									:disabled="!isRedisConfigured"
								>
									Next
								</Button>

								<div v-if="isLoadingMG">
									<Button disabled>
										<ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
										Migrate Data
									</Button>
								</div>
								<div v-else>
									<Button
										type="submit"
										v-if="stepIndex == 3"
										@click="startMigration"
										:disabled="!meta.valid"
									>
										Migrate Data
									</Button>
								</div>
								<Button
									type="submit"
									v-if="stepIndex == 3"
									@click="nextStep"
									:disabled="!isMigrated"
								>
									Next
								</Button>

								<Button
									type="submit"
									v-if="stepIndex > 3 && stepIndex !== steps.length"
									@click="nextStep"
									:disabled="isNextDisabled || !meta.valid"
								>
									Next
								</Button>
							</div>
							<Button
								type="submit"
								class="self-end"
								v-if="stepIndex === steps.length"
								:disabled="!meta.valid"
							>
								Submit
							</Button>
						</DialogFooter>
					</form>
				</Stepper>
			</Form>
		</DialogContent>
	</Dialog>
</template>
