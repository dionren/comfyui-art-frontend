<template>
  <el-config-provider namespace="ep" :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { zhCn } from 'element-plus/es/locale/index'
</script>

