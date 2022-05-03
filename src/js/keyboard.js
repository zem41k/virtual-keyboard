import create from "./create.js";
import Key from "./key.js";
import language from "./language.js";


const main = create('main', 'main');

const title = create('h1', 'main__title', 'RSS Virtual Keyboard', main);
const subTitle = create('h2', 'main__text', 'Windows keyboard', main);


export default class KeyBoard {
    constructor(rows) {
        this.rows = rows;
        this.keyPressed = {};
        this.inCaps = false;
    }

    init(lang) {
        this.keyBase = language[lang];
        this.textArea = create('textarea', 'textarea', null, main,
            ['placeholder', 'Text...'],
            ['rows', 5],
            ['cols', 50]
        )
        this.container = create('div', 'keyboard', null, main, ['lang', lang]);
        document.body.prepend(main);
        return this;
    }

    createKeys() {
        this.keyButtons = [];
        this.rows.forEach((row, i) => {
            const rowElement = create('div', 'keyboard__row', null, this.container);
            row.forEach((code) => {
                const keyObj = this.keyBase.find((key) => key.code === code);
                if (keyObj) {
                    const keyButton = new Key(keyObj);
                    this.keyButtons.push(keyButton);
                    rowElement.appendChild(keyButton.div);
                }
            })
        })

    }


}