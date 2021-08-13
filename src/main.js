import { createApp } from 'vue';
import TheNav from './components/TheNav.vue'
import TheBody from './components/TheBody.vue'
import TheDialog from './components/ui/TheDialog.vue'
import ActionButton from './components/ui/ActionButton.vue'

import App from './App.vue';

const app = createApp(App);

app.component('the-nav', TheNav);
app.component('the-body', TheBody);
app.component('the-dialog', TheDialog);
app.component('action-button', ActionButton);
app.mount('#app');
