<script setup>
import { useElementByPoint, useMouse } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { useSystemStore } from "./stores/systemStore";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useValidateState } from "./services/InstallerService";
import { useRouter } from "vue-router";

const systemStore = useSystemStore();
const { x, y } = useMouse({ type: "client" });
const { element } = useElementByPoint({ x, y });
const highlightedElement = ref(null);
const router = useRouter();

const highlightActive = computed(() => systemStore.HighlightElementById);

watch(
	[element, highlightActive],
	([newElement, isActive], [oldElement]) => {
		if (oldElement) {
			oldElement.classList.remove("highlight");
		}
		if (isActive && newElement) {
			newElement.classList.add("highlight");
		}
	},
	{ immediate: true }
);
</script>

<template>
	<Toaster />
	<router-view />
</template>

<style>
body::-webkit-scrollbar {
	width: 20px;
}
body::-webkit-scrollbar-corner {
	background: rgba(0, 0, 0, 0);
}
body::-webkit-scrollbar-thumb {
	background-color: #ccc;
	border-radius: 6px;
	border: 4px solid rgba(0, 0, 0, 0);
	background-clip: content-box;
	min-width: 32px;
	min-height: 32px;
}
body::-webkit-scrollbar-track {
	background-color: rgba(0, 0, 0, 0);
}

.highlight {
	outline: 2px solid rgb(109, 40, 217, 0.5);
	background: rgb(109, 40, 217, 0.3);
}
</style>
