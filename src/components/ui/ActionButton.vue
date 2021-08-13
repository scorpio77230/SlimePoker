<template>
  <button><slot></slot></button>
</template>


<style scoped>
button {
  background-color: #aaa;
  border: outset 3px #e6e6e6;
  border-radius: 1em;
}
button:active,
button:hover {
  background-color: #9c9c9c;
  border: solid 3px #e6e6e6;
  border-radius: 1em;
}
button:disabled {
  background-color: #666666;
  border: inset 3px #e6e6e6;
  cursor: not-allowed;
}
</style>