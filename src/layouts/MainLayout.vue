<script setup>
import Sidebar from "@/partials/Sidebar.vue";
import Topbar from "@/partials/Topbar.vue";
import RealtimeToast from "@/widgets/RealtimeToast.vue"
</script>

<template>
	<div class="flex min-h-screen w-full flex-col bg-muted/40">
		<Sidebar />
		<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
			<Topbar />
			<RealtimeToast/>
			<router-view
				v-motion="{
					initial: {
						y: 100,
						opacity: 0,
					},
					enter: {
						y: 0,
						opacity: 1,
					},
				}"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
