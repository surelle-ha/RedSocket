<template>
	<span class="logged-in" v-if="isRedisConnected">●</span>
	<span class="logged-out" v-else>●</span>
</template>

<script setup>
import { useCheckRedis } from '@/services/RedisService';
import { onMounted, ref } from 'vue';

const isRedisConnected = ref(false);

onMounted(async () => {
    const response = await useCheckRedis();
    console.log(response)
    if (response.connection) {
        isRedisConnected.value = true;
    } else {
        isRedisConnected.value = false;
    }
})
</script>

<style>
.logged-in {
	color: green;
}

.logged-out {
	color: red;
}
</style>
