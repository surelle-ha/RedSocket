<script setup>
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getEventChannels, getEventCount, useCreateEvent, useSocketEngine } from "@/services/EventService";
import { onMounted, onUnmounted, ref } from "vue";
import { io } from "socket.io-client";

const socket = useSocketEngine("*");

const subscribeToChannel = (channel) => {
	socket.emit("subscribe", channel);
};

onMounted(() => {
	subscribeToChannel("*");

	socket.onAny(async (eventName, data) => {
		const channels = await getEventChannels();
		const eventCount = await getEventCount();
		channelsCreated.value = channels.data.data.length;
		eventTriggered.value = eventCount.data.data.count;
	});

	socket.on('updateClientCount', (clientCount) => {
		connectedClients.value = clientCount;
	});

	socket.on("reconnect", () => {
		console.log("Reconnected to server");
	});
});

onUnmounted(() => {
	socket.offAny();
	socket.disconnect();
});

const channelsCreated = ref(0);
const eventTriggered = ref(0);
const queueEvent = ref(0);
const connectedClients = ref(0);
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
				<div class="text-2xl font-bold">{{ channelsCreated }}</div>
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
				<div class="text-2xl font-bold">{{ eventTriggered }}</div>
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
				<div class="text-2xl font-bold">{{ queueEvent }}</div>
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
				<div class="text-2xl font-bold">{{ connectedClients }}</div>
				<p class="text-xs text-muted-foreground">+201 since last hour</p>
			</CardContent>
		</Card>
	</div>
</template>

<style></style>
