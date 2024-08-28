<template>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Channel } from "@/services/Scaledrone";

const { toast } = useToast();

const room = Channel.subscribe("admin-channel");

// Channel.on("open", (error) => {
// 	if (error) {
// 		return console.error(error);
// 	}
// 	Channel.publish({
// 		room: "admin-channel",
// 		message: { title: "Bob", description: 42 },
// 	});
// });

room.on("message", (message) =>
	toast({
		title: message.data.title,
		description: message.data.description,
		variant: message.data.isError ? 'destructive' : '',
	})
);
</script>

<style lang="scss" scoped></style>
