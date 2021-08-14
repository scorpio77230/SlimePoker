<template>
  <button><slot></slot></button>
</template>


<style scoped>
button {
  background-color: #aaa;
  border: outset 3px #e6e6e6;
  border-radius: 1em;
  box-shadow: 5px 5px 9px 2px rgba(79,74,75,0.3);
}
button:active,
button:hover {
  background-color: #9c9c9c;
  border: inset 3px #e6e6e6;
  border-radius: 1em;
  box-shadow: 1px 1px 5px 1px rgba(79,74,75,0.3);
}
button:disabled {
  background-color: #666666;
  border: inset 3px #e6e6e6;
  cursor: not-allowed;
}
</style>