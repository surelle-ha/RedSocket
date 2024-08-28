import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSystemStore = defineStore("system", {
	state: () => ({ 
		user_agent: useStorage("user-agent", null),
		HighlightElementById: useStorage("highlight-element-by-id", false),
	}),
	getters: {
		isElectron(state) {
			const userAgent = navigator.userAgent.toLowerCase();
			return userAgent.indexOf(' electron/') > -1;
		}
	},
	actions: {
		setHighlightElementById(val) {
			if (val !== undefined) {
				this.HighlightElementById = val;
			}
		},
	},
});
