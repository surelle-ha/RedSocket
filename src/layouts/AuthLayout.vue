<script setup>
import ThemeToggler from "@/widgets/ThemeToggler.vue";
</script>

<template>
	<div class="auth-container bg-muted/40">
    <div class="hidden">
      <ThemeToggler />
    </div>
		<router-view/>
	</div>
</template>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px; 
}

@media (max-width: 600px) {
  .auth-container {
    padding: 10px;
  }
}
</style>