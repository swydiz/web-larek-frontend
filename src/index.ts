import './scss/styles.scss';
import { MainPresenter } from './presenters/MainPresenter';

try {
  const presenter = new MainPresenter();
} catch (error) {
  console.error("index.ts: Error creating MainPresenter:", error);
}

