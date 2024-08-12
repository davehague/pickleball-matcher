<template>
  <div class="app-container">
    <header>
      <h1>App Title</h1>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}
</style>