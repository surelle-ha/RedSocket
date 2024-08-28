import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useValidateToken } from "@/services/AuthenticationService";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		// User on Platform Information
		id: useStorage("auth-id", null),
		email: useStorage("auth-email", null),
		role_id: useStorage("auth-role", null),
		email_verified: useStorage("auth-email-verified", null),
		status: useStorage("auth-status", null),

		// Account Information
		first_name: useStorage("auth-first_name", null),
		middle_name: useStorage("auth-middle_name", null),
		last_name: useStorage("auth-last_name", null),

		// Location
		address_1: useStorage("address-1", null),
		address_2: useStorage("address-2", null),
		state: useStorage("state", null),
		country: useStorage("country", null),
		zipcode: useStorage("zipcode", null),
		createdAt: useStorage("auth-created_at", null),
		updatedAt: useStorage("auth-updated_at", null),

		// Authentication
		token: useStorage("bearer-token", null),
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
	},
	actions: {
		setUser(userData, token) {
			Object.keys(userData).forEach((key) => {
				if (this.hasOwnProperty(key)) {
					this[key] = userData[key];
				}
			});
			if (token !== undefined) {
				this.token = token;
			}
		},
		clearUser() {
			Object.keys(this.$state).forEach((key) => {
				this[key] = null;
			});
		},
		logout() {
			this.clearUser();
		}
	},
});
