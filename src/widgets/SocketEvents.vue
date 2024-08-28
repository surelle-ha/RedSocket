<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import {
  ArrowUpRight,
} from "lucide-vue-next";
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

// Define the URL of your socket server
const socket = io('ws://localhost:4000', {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity,
});

// Sample data to populate the table initially
const events = ref([
  {
    id: '1',
    event: 'Liam Johnson',
    type: 'Sale',
    status: 'Approved',
    date: '2023-06-23',
    timestamp: '$250.00',
  },
]);

// Function to add a new event to the events list
const addEvent = (data, eventName) => {
  events.value.push({
    id: crypto.randomUUID(),
    event: eventName || 'Unknown Event',
    type: data.type || 'Unknown Type',
    status: data.status || 'Pending',
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toLocaleTimeString(),
  });
};

// Subscribe to the channel automatically when the component is mounted
const subscribeToChannel = (channel) => {
  socket.emit('subscribe', channel);
  console.log(`Subscribed to channel: ${channel}`);
};

onMounted(() => {
  // Automatically subscribe to the specified channel
  subscribeToChannel('*');

  // Listen to all socket events using a wildcard
  socket.onAny((eventName, data) => {
    console.log(`Received event: ${eventName}`, data);
    addEvent(data, eventName);
  });

  // Handle reconnection logic
  socket.on('reconnect', () => {
    console.log('Reconnected to server');
    // Re-subscribe to channels or perform other actions if needed
  });
});

onUnmounted(() => {
  socket.offAny(); // Stop listening to all events
  socket.disconnect();
});
</script>

<template>
  <Card class="xl:col-span-2">
    <CardHeader class="flex flex-row items-center">
      <div class="grid gap-2">
        <CardTitle>Socket Events</CardTitle>
        <CardDescription>Recent triggered events from your application.</CardDescription>
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
            <TableHead class="hidden xl:table-column"> Type </TableHead>
            <TableHead class="hidden xl:table-column"> Status </TableHead>
            <TableHead class="hidden xl:table-column"> Date </TableHead>
            <TableHead class="text-right"> Timestamp </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="event in events" :key="event.id">
            <TableCell>
              <div class="font-medium">{{ event.event }}</div>
            </TableCell>
            <TableCell class="hidden xl:table-column">{{ event.type }}</TableCell>
            <TableCell class="hidden xl:table-column">
              <Badge class="text-xs" variant="outline">{{ event.status }}</Badge>
            </TableCell>
            <TableCell class="hidden xl:table-column">{{ event.date }}</TableCell>
            <TableCell class="text-right">{{ event.timestamp }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<style scoped>
/* Add custom styles here if needed */
</style>
