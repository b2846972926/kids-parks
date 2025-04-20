<script setup>
import { RouterView } from 'vue-router'
import NavBar from './views/NavBar.vue'
</script>

<template>
  <NavBar></NavBar>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
