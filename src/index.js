import './styles.scss';
import Keyboard from './components/keyboard.js';
import {
    keys,
} from '../keyboard_config.json';

const keyboard = new Keyboard(keys);

keyboard.init();
