import { render } from '@builder.io/qwik';
import { App } from './app.tsx';
import './index.css';

render(document.getElementById('app') as HTMLElement, <App />);
