import create from "./create.js";
import Key from "./key.js";
import language from "./language.js";
import * as storage from "./localStorage.js";


const main = create('main', 'main');

const title = create('h1', 'main__title', 'RSS Virtual Keyboard', main);
const subTitle = create('h2', 'main__text', 'Windows keyboard', main);


export default class KeyBoard {
    constructor(rows) {
        this.rows = rows;  // порядок кнопок в рядах
        this.keyPressed = {};
        this.inCaps = false;
    }

    init(lang) {
        this.keyBase = language[lang]; // массив объектов с кнопками на нужном языке
        this.textArea = create('textarea', 'textarea', null, main,
            ['placeholder', 'Text...'],
            ['rows', 10],
            ['cols', 100]
        )
        this.container = create('div', 'keyboard', null, main, ['lang', lang]);
        document.body.prepend(main);
        return this;
    }

    createKeys() {
        this.keyButtons = []; // массив с созданными объектами кнопок класса Key
        this.rows.forEach((row, i) => {
            const rowElement = create('div', 'keyboard__row', null, this.container);
            row.forEach((code) => {
                const keyObj = this.keyBase.find((key) => key.code === code); // {small , shift, code}
                if (keyObj) {
                    const keyButton = new Key(keyObj); // Обьект кнопки с класса Key
                    this.keyButtons.push(keyButton);
                    rowElement.appendChild(keyButton.div);
                }
            })
        })
        document.addEventListener('keydown', this.pressButton);
        document.addEventListener('keyup', this.releaseButton);
        // document.addEventListener('mousedown', this.pressButton);
        // document.addEventListener('mouseup', this.pressButton);
    }

    pressButton = (e) => {
        this.textArea.focus();
        e.preventDefault(); // отмена действия по умолчанию
        if (e.stopPropagation()) e.stopPropagation(); // отмена всплытия
        const keyCode = e.code; // код нажатой кнопки
        const keyObj = this.keyButtons.find((key) => key.code === keyCode); // объект нажатой кнопки
        keyObj.div.classList.add('keyboard__key--active');
        // if (!keyObj.isFnKey) this.textArea.value = this.textArea.value + keyObj.small;

        if (keyCode.match(/Control/)) this.ctrlKey = true;
        if (keyCode.match(/Alt/)) this.altKey = true;
        if (keyCode.match(/Alt/) && this.ctrlKey) this.switchLanguage();
        if (keyCode.match(/Control/) && this.altKey) this.switchLanguage();
    }

    releaseButton = (e) => {
        const keyCode = e.code;
        const keyObj = this.keyButtons.find((key) => key.code === keyCode);
        keyObj.div.classList.remove('keyboard__key--active');
        if (keyCode.match(/Control/)) this.ctrlKey = false;
        if (keyCode.match(/Alt/)) this.altKey = false;
    }

    switchLanguage = () => {
        const langsArray = Object.keys(language);
        let langIndex = langsArray.indexOf(this.container.dataset.lang);
        langIndex + 1 < langsArray.length ? this.keyBase = language[langsArray[langIndex += 1]] : this.keyBase = language[langsArray[langIndex -= 1]];
        this.container.dataset.lang = langsArray[langIndex];
        storage.setLocalStorage(langsArray[langIndex]);


        this.keyButtons.forEach((button) => {
            const keyObj = this.keyBase.find((key) => key.code === button.code);
            button.small = keyObj.small;
            button.shift = keyObj.shift;
            button.span.innerHTML = keyObj.small;
        })
    }
}