<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-btn icon @click="goBack" class="mr-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span>File Upload</span>
          </v-card-title>
          <v-card-text>
            <v-file-input
              v-model="files"
              :rules="rules"
              accept="*/*"
              label="Select file(s)"
              placeholder="Choose file(s) to upload"
              prepend-icon="mdi-paperclip"
              multiple
              show-size
              counter
              :loading="uploading"
              :disabled="uploading"
            >
              <template v-slot:selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip
                    size="small"
                    label
                    color="primary"
                    class="me-2"
                  >
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>

            <v-alert
              v-if="uploadSuccess"
              type="success"
              class="mt-4"
              closable
              @click:close="uploadSuccess = false"
            >
              File(s) uploaded successfully!
            </v-alert>

            <v-alert
              v-if="uploadError"
              type="error"
              class="mt-4"
              closable
              @click:close="uploadError = null"
            >
              {{ uploadError }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!files || files.length === 0 || uploading"
              :loading="uploading"
              @click="uploadFiles"
            >
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const files = ref<File[]>([])
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref<string | null>(null)

const rules = [
  (value: File[]) => {
    if (!value || value.length === 0) return true
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversized = value.some(file => file.size > maxSize)
    return !oversized || 'File size should be less than 10 MB!'
  },
]

const goBack = () => {
  router.back()
}

const uploadFiles = async () => {
  if (!files.value || files.value.length === 0) return

  uploading.value = true
  uploadSuccess.value = false
  uploadError.value = null

  try {
    const formData = new FormData()
    files.value.forEach((file) => {
      formData.append('file', file)
    })

    const response = await fetch('http://localhost:8080/customer-interaction/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    uploadSuccess.value = true
    files.value = []
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.v-card {
  margin: 24px;
}
</style>
