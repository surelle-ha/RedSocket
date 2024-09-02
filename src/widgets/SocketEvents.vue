<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { timestamp, useLocalStorage } from "@vueuse/core";
import { ArrowUpRight } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCreateEvent, useSocketEngine } from "@/services/EventService";

const socket = useSocketEngine("*");

const subscribeToChannel = (channel) => {
	socket.emit("subscribe", channel);
};

onMounted(() => {
	subscribeToChannel("*");

	socket.onAny(async (eventName, data) => {
		await useCreateEvent({
			channel: data.channel,
			data: data.data,
			timestamp: new Date(),
		});
		addEvent(data, eventName);
	});

	socket.on("reconnect", () => {
		console.log("Reconnected to server");
	});
});

onUnmounted(() => {
	socket.offAny();
	socket.disconnect();
});

const events = useLocalStorage("events", []);

const currentPage = ref(1);
const itemsPerPage = ref(10);

const paginatedEvents = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	return events.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(events.value.length / itemsPerPage.value);
});

const addEvent = (data, eventName) => {
	events.value.push({
		id: crypto.randomUUID(),
		event: data.channel || "Unknown Event",
		data: data.data || "Unknown Type",
		timestamp: new Date().toLocaleTimeString(),
	});
};

const goToPage = (page) => {
	if (page > 0 && page <= totalPages.value) {
		currentPage.value = page;
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};
</script>

<template>
	<Card class="xl:col-span-2">
		<CardHeader class="flex flex-row items-center">
			<div class="grid gap-2">
				<CardTitle>Socket Events ({{ events.length }})</CardTitle>
				<CardDescription
					>Recent triggered events from your application.</CardDescription
				>
			</div>
			<Button as-child size="sm" class="ml-auto gap-1">
				<a href="#">
					View All
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</Button>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Event</TableHead>
						<TableHead> Data </TableHead>
						<TableHead class="text-right"> Timestamp </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="event in paginatedEvents" :key="event.id">
						<TableCell>
							<div class="font-medium">{{ event.event }}</div>
						</TableCell>
						<TableCell>{{ event.data }}</TableCell>
						<TableCell class="text-right">{{ event.timestamp }}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<!-- Pagination Controls -->
			<div class="flex justify-between mt-4">
				<Button @click="previousPage" :disabled="currentPage === 1"
					>Previous</Button
				>
				<span>Page {{ currentPage }} of {{ totalPages }}</span>
				<Button @click="nextPage" :disabled="currentPage === totalPages"
					>Next</Button
				>
			</div>
		</CardContent>
	</Card>
</template>

<style scoped></style>
