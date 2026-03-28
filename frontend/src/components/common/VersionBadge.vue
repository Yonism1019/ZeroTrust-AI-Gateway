<template>
  <div class="relative">
    <!-- Admin: Simple demo version badge without dropdown -->
    <template v-if="isAdmin">
      <span class="rounded-lg bg-electric-cyan/20 px-2 py-1 text-xs font-medium text-electric-cyan">
        v{{ demoVersion }}
      </span>
    </template>

    <!-- Non-admin: Simple static version text -->
    <span v-else class="text-xs text-white/40">
      v{{ demoVersion }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)

// Demo version for ZeroTrust AI Gateway
const demoVersion = 'demo'
</script>

<style scoped>
</style>
