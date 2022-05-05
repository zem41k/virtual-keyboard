import KeyBoard from "./js/keyboard.js";
import rows from "./js/rows.js";
import { getLocalStorage } from "./js/localStorage.js";

const lang = getLocalStorage();

new KeyBoard(rows).init(lang).createKeys();