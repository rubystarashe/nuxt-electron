<template>
<div>
Hello world!
<button @click="$router.push('/about')">about</button>
<button @click="$electron.ipcRenderer.send('ping', 'Hello World!')">ping</button>
</div>
</template>

<script>
export default {
  mounted () {
    this.$electron.ipcRenderer.on('pong', (error, message) => alert(message))
  }
}
</script>

<style lang="scss">
body {
  background: rgb(200, 200, 200);
}
</style>
