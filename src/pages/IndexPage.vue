<template>
  <q-page class="bg-white page-container q-page flex column flex-center">
    <h5>当前页面请求地址</h5>
    <div class="q-pa-md">
      <q-list dense bordered padding class="rounded-borders">
        <q-item v-for="(item, index) in requestList" :key="index">
          <q-item-section side>
            <q-badge color="teal" :label="item.method" />
          </q-item-section>

          <q-item-section>
            <!-- <q-item-label>Single line item</q-item-label> -->
            <q-item-label style="width: 430px" class="ellipsis">
              {{ item.requestURL }}
              <q-tooltip>
                {{ item.requestURL }}
              </q-tooltip>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">请求方式</th>
            <th class="text-right">请求地址</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in requestList" :key="index">
            <td class="text-left">{{ item.method }}</td>
            <td class="flex items-center ellipsis text-right">{{ item.requestURL }}</td>
          </tr>
        </tbody>
      </q-markup-table> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import type { IRequestItem } from 'src-bex/dom'

const requestList = ref<IRequestItem[]>()

const $q = useQuasar()
$q.bex.on('getRequestList', ({ data }) => {
  console.log('接收数据', data)
  requestList.value = data
})
</script>

<style lang="scss" scoped>
.page-container {
}
</style>
