import { createRouter, createWebHistory, useRouter } from "vue-router";
import NProgress from 'nprogress'
import { useAuthStore } from "@/stores/authStore";
import { isTokenExpired } from "@/services/JwtUtility";
import { useLogout, useValidateToken } from "@/services/AuthenticationService";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import SettingsLayout from "@/layouts/SettingsLayout.vue";

import InstallerView from "@/pages/Installer.vue";
import LoginView from "@/pages/Login.vue";
import RegisterView from "@/pages/Register.vue";
import HomeView from "@/pages/Home.vue";
import DashboardView from "@/pages/Dashboard.vue";
import UsersView from "@/pages/Users.vue";
import AccountView from "@/pages/Account.vue";
import GeneralView from "@/pages/General.vue";
import SecurityView from "@/pages/Security.vue";
import SupportView from "@/pages/Support.vue";
import DeveloperView from "@/pages/Developer.vue";
import { useValidateState } from "@/services/InstallerService";

// Route guard to require a story to be initialized
const requireAuth = async (to, from, next) => {
	const router = useRouter();
	const result = await useValidateState();
	if (!result.connection) {
		router.push({ name: "Installer" });
	}
	const authStore = useAuthStore();
	if (!authStore.isAuthenticated || !(await useValidateToken(authStore.token)) || isTokenExpired(authStore.token)) {
		if (to.name !== "Login") {
			console.log("Not authenticated, redirecting to Login");
			await useLogout(authStore.token);
			authStore.logout();
			next({ name: "Login" });
		} else {
			console.log("Already at Login, doing nothing");
			next();
		}
	} else {
		console.log("Authenticated");
		if (authStore.locked) {
			if (to.name !== "Lockscreen") {
				console.log("Account is locked, redirecting to Lockscreen");
				next({ name: "Lockscreen" });
			} else {
				console.log("Already at Lockscreen, doing nothing");
				next();
			}
		} else {
			console.log("Access granted");
			next(); // proceed to the route
		}
	}
};

// Route guard to prevent access to Home when a story is initialized
const requireNoAuth = async (to, from, next) => {
	const router = useRouter();
	const result = await useValidateState();
	if (!result.connection) {
		router.push({ name: "Installer" });
	}
	const authStore = useAuthStore();
	if (authStore.isAuthenticated) {
		router.push({ name: "Home" });
	} else {
		next();
	}
};

const routes = [
	{
		path: "/starter",
		name: "StarterLayout",
		component: AuthLayout,
		redirect: "/starter/installer",
		children: [
			{
				path: "installer",
				name: "Installer",
				component: InstallerView
			},
		],
	},
	{
		path: "/auth",
		name: "AuthLayout",
		component: AuthLayout,
		redirect: "/auth/login",
		children: [
			{
				path: "login",
				name: "Login",
				component: LoginView,
				beforeEnter: requireNoAuth,
			},
			{
				path: "register",
				name: "Register",
				component: RegisterView,
				beforeEnter: requireNoAuth,
			},
		],
	},
	{
		path: "/",
		name: "MainLayout",
		component: MainLayout,
		redirect: "/dashboard",
		beforeEnter: requireAuth,
		children: [
			{
				path: "home",
				name: "Home",
				component: HomeView,
				beforeEnter: requireAuth,
			},
			{
				path: "dashboard",
				name: "Dashboard",
				component: DashboardView,
				beforeEnter: requireAuth,
			},
			{
				path: "users",
				name: "Users",
				component: UsersView,
				beforeEnter: requireAuth,
			},
			{
				path: "settings",
				name: "SettingsLayout",
				component: SettingsLayout,
				redirect: "/settings/general",
				beforeEnter: requireAuth,
				children: [
					{
						path: "account",
						name: "Account",
						component: AccountView,
						beforeEnter: requireAuth,
					},
					{
						path: "general",
						name: "General",
						component: GeneralView,
						beforeEnter: requireAuth,
					},
					{
						path: "security",
						name: "Security",
						component: SecurityView,
						beforeEnter: requireAuth,
					},
					{
						path: "support",
						name: "Support",
						component: SupportView,
						beforeEnter: requireAuth,
					},
					{
						path: "developer",
						name: "Developer",
						component: DeveloperView,
						beforeEnter: requireAuth,
					},
				],
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

NProgress.configure({ showSpinner: false, easing: 'ease', speed: 500 });

router.beforeEach((To, From, next) => {
	NProgress.start();
	next();
});
router.afterEach(() => {
	NProgress.done();
});

export default router;
