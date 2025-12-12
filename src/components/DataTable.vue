<script setup>
import { ref, watch } from 'vue';
import { useDate } from 'vuetify';

const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Customer ID', key: 'customerId', align: 'start'},
  { title: 'Interaction Type', key: 'interactionType', align: 'end' },
  { title: 'Timestamp', key: 'timestamp', align: 'end' },
  { title: 'Message', key: 'message', align: 'end' },
])
const search = ref('')
const serverItems = ref([])
const customerId = ref('')
const interactionType = ref('Any')
const adapter = useDate()
const startDate = ref(null)
const showStartDateMenu = ref(false)
const startTime = ref(null)
const showStartTimeMenu = ref(false)
const endDate = ref(null)
const showEndDateMenu = ref(false)
const endTime = ref(null)
const showEndTimeMenu = ref(false)
const loading = ref(true)
const totalItems = ref(0)
function loadItems ({ page, itemsPerPage, sortBy}) {
  startTime.value && console.log(startTime.value.split(":"))
  let startDateTime = null
  if (startDate.value) {
    startDateTime = new Date(startDate.value)
    startDateTime.setUTCHours(startTime.value ? startTime.value.split(":")[0] : 0)
    startDateTime.setUTCMinutes(startTime.value ? startTime.value.split(":")[1] : 0)
    console.log(adapter.toJsDate(startDateTime).toISOString())
    console.log(startDateTime)
  }

  let endDateTime = null
  if (endDate.value) {
    endDateTime = new Date(endDate.value)
    endDateTime.setUTCHours(endTime.value ? endTime.value.split(":")[0] : 0)
    endDateTime.setUTCMinutes(endTime.value ? endTime.value.split(":")[1] : 0)
  }

  loading.value = true
  fetch("http://localhost:8080/customer-interaction/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerId: customerId.value === '' ? null : customerId.value,
      interactionType: interactionType.value === 'Any' ? null : interactionType.value.toString().toUpperCase(),
      timestampStart: startDateTime,
      timestampEnd: endDateTime,
      pageNumber: page - 1,
      pageSize: itemsPerPage
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Request failed: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      totalItems.value = data.totalElements

      const content = data.content

      serverItems.value = data.content
      loading.value = false
    })
    .catch(err => {
      console.error(err);
      loading.value = false
    });
}
watch(customerId, () => {
  search.value = String(Date.now())
})

watch(interactionType, () => {
  search.value = String(Date.now())
})

watch(startDate, () => {
  startDate.value = adapter.format(startDate.value, 'YYYY-MM-DD')
  search.value = String(Date.now())
})

watch(startTime, () => {
  search.value = String(Date.now())
})

watch(endDate, () => {
  endDate.value = adapter.format(endDate.value, 'YYYY-MM-DD')
  search.value = String(Date.now())
})

watch(endTime, () => {
  search.value = String(Date.now())
})
</script>

<template>
  <v-card title="Customer Interactions">
    <div class="d-flex">
      <v-text-field v-model="customerId" class="ma-2 w-sm-0" density="compact" placeholder="Search Customer ID..." hide-details></v-text-field>
      <v-select v-model="interactionType" class="ma-2 w-sm-0" density="compact" label="Interaction Type" :items="['Any', 'Chat', 'Email', 'Ticket']" hide-details></v-select>
      <v-text-field
        :model-value="startDate"
        class="ma-2 w-sm-0"
        label="Start Date"
        readonly
        hide-details
      >
        <v-menu
          v-model="showStartDateMenu"
          :close-on-content-click="false"
          activator="parent"
          min-width="0"
        >
          <v-date-picker v-model="startDate"></v-date-picker>
        </v-menu>
      </v-text-field>
      <v-text-field
        :model-value="startTime"
        class="ma-2 w-sm-0"
        label="Start Time"
        readonly
        hide-details
      >
        <v-menu
          v-model="showStartTimeMenu"
          :close-on-content-click="false"
          activator="parent"
          min-width="0"
        >
          <v-time-picker v-model="startTime"></v-time-picker>
        </v-menu>
      </v-text-field>
      <v-text-field
        :model-value="endDate"
        class="ma-2 w-sm-0"
        label="End Date"
        readonly
        hide-details
      >
        <v-menu
          v-model="showEndDateMenu"
          :close-on-content-click="false"
          activator="parent"
          min-width="0"
        >
          <v-date-picker v-model="endDate"></v-date-picker>
        </v-menu>
      </v-text-field>
      <v-text-field
        :model-value="endTime"
        class="ma-2 w-sm-0"
        label="End Time"
        readonly
        hide-details
      >
        <v-menu
          v-model="showEndTimeMenu"
          :close-on-content-click="false"
          activator="parent"
          min-width="0"
        >
          <v-time-picker v-model="endTime"></v-time-picker>
        </v-menu>
      </v-text-field>
    </div>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
    >
      <template v-slot:tfoot>
        <tr>
          <td>
          </td>
          <td>
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>
.v-card {
  margin: 24px;
}

</style>
