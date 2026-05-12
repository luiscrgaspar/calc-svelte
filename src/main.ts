import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element "#root" was not found.');
}

mount(App, {
  target: rootElement,
});
