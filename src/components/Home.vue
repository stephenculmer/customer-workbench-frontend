<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mx-auto" elevation="8">
          <v-card-title class="text-h4 text-center pa-6">
            Customer Workbench
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                prepend-icon="mdi-table"
                title="Customer Interactions"
                subtitle="View and search customer interaction data"
                @click="navigateTo('/datatable')"
                class="nav-item"
              >
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                prepend-icon="mdi-upload"
                title="File Upload"
                subtitle="Upload files to the system"
                @click="navigateTo('/upload')"
                class="nav-item"
              >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.nav-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
