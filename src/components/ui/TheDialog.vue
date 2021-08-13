<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop">
    </div>
    <transition name="dialog">
      <dialog open v-if="show">
        <header>
        <!-- <div class="x-button" @click="tryClose">&#8281;</div> -->
          <slot name="header">
            <h1>{{ title }}</h1>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu>
          <slot v-if="winner !== null" name="actions">
            <action-button @click="tryClose">{{ game }}</action-button>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
import ActionButton from "./ActionButton.vue";
export default {
  components: { ActionButton },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    game: {
      type: String,
      required: false,
    },
  },
  emits: ["close"],
  methods: {
    tryClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  height: 60vh;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

header {
  font-family: inherit;
  background-color: #a5a5a5;
  color: white;
  width: 100%;
  padding: 1rem;
}

header h1 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: center;
  margin: 0;
}
button {
  width: 12vw;
  height: 7vh;
  font-size: 1rem;
  font-family: inherit;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.1);
}

.dialog-enter-active {
  transition: all 0.5s;
}
.dialog-leave-active {
  transition: all 0.5s;
}

.dialog-leave-from,
.dialog-enter-to {
  opacity: 1;
  transform: scale(1);
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>