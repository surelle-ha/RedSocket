<script setup lang="ts">
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart-line";

import { getEventStatistics, useSocketEngine } from "@/services/EventService";
import { onMounted, onUnmounted, ref } from "vue";

const socket = useSocketEngine("*");

const subscribeToChannel = (channel) => {
	socket.emit("subscribe", channel);
};

onMounted(() => {
	subscribeToChannel("*");

	socket.onAny(async (eventName, data) => {
		const response = await getEventStatistics();
        statistics.value = response.data.data.statistics
        channels.value = response.data.data.channels
	});

	socket.on("reconnect", () => {
		console.log("Reconnected to server");
	});
});

onUnmounted(() => {
	socket.offAny();
	socket.disconnect();
});

const statistics = ref([]);
const channels = ref([]);
</script>

<template>
	<Card class="xl:col-span-2">
		<CardHeader class="flex flex-row items-center">
			<div class="grid gap-2">
				<CardTitle>Event Statistics</CardTitle>
				<CardDescription
					>Visual figure for event incoming/outgoing transaction.</CardDescription
				>
			</div>
		</CardHeader>
		<CardContent
			><LineChart
				:data="statistics"
				index="hour"
				:categories="channels"
				:y-formatter="
					(tick, i) => {
						return typeof tick === 'number'
							? `${new Intl.NumberFormat('us').format(tick).toString()}`
							: '';
					}
				"
		/></CardContent>
	</Card>
</template>
