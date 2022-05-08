import create from './create.js';
import Key from './key.js';
import language from './language.js';
import * as storage from './localStorage.js';

const main = create('main', 'main');

create('h1', 'main__title', 'RSS Virtual Keyboard', main);
create('h2', 'main__text', 'Клавиатура создана в операционной системе Windows', main);
create('h2', 'main__text', 'Для переключения языка комбинация: левыe ctrl + alt', main);

export default class KeyBoard {
  constructor(rows) {
    this.rows = rows; // порядок кнопок в рядах
    this.keyPressed = {};
    this.isCaps = false;
  }

  init(lang) {
    this.keyBase = language[lang]; // массив объектов с кнопками на нужном языке
    this.textArea = create(
      'textarea',
      'textarea',
      null,
      main,
      ['placeholder', 'Print something...'],
      ['rows', 10],
      ['cols', 100],
    );
    this.container = create('div', 'keyboard', null, main, ['lang', lang]);
    document.body.prepend(main);
    return this;
  }

  createKeys() {
    this.keyButtons = []; // массив с созданными объектами кнопок класса Key
    this.rows.forEach((row) => {
      const rowElement = create('div', 'keyboard__row', null, this.container);
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code); // {small , shift, code}
        if (keyObj) {
          const keyButton = new Key(keyObj); // Обьект кнопки с класса Key
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });
    this.textArea.focus();
    document.addEventListener('keydown', this.pressButton);
    document.addEventListener('keyup', this.releaseButton);
    document.addEventListener('mousedown', this.pressMouseButton);
    document.addEventListener('mouseup', this.releaseMouseButton);
  }

  isCapsShift(keyObj) {
    if (!this.isCaps) {
      this.symbol = keyObj.small;
      this.switchKeyboardLetter('small');
      if (this.shiftKey) {
        this.symbol = keyObj.shift;
        this.switchKeyboardLetter('shift');
      }
    } else {
      this.symbol = keyObj.shift;
      this.switchKeyboardLetter('shift');
      if (this.shiftKey) {
        this.symbol = keyObj.small;
        this.switchKeyboardLetter('small');
      }
    }
  }

  pressButton = (e) => {
    this.textArea.focus();
    e.preventDefault(); // отмена действия по умолчанию
    if (e.stopPropagation()) e.stopPropagation(); // отмена всплытия
    const keyCode = e.code; // код нажатой кнопки
    const keyObj = this.keyButtons.find((key) => key.code === keyCode); // объект нажатой кнопки
    keyObj.div.classList.add('keyboard__key--active');

    if (keyCode.match(/Control/)) this.ctrlKey = true;
    if (keyCode.match(/Alt/)) this.altKey = true;
    if (keyCode.match(/Alt/) && this.ctrlKey) this.switchLanguage();
    if (keyCode.match(/Control/) && this.altKey) this.switchLanguage();

    if (keyCode === 'CapsLock') {
      if (this.isCaps === false) {
        this.isCaps = true;
        keyObj.div.classList.add('keyboard__key--active-caps');
      } else {
        this.isCaps = false;
        keyObj.div.classList.remove('keyboard__key--active-caps');
      }
    }
    if (keyCode.match(/Shift/)) this.shiftKey = true;

    this.isCapsShift(keyObj);

    this.print(keyObj, this.symbol);
  };

  releaseButton = (e) => {
    const keyCode = e.code;
    const keyObj = this.keyButtons.find((key) => key.code === keyCode);
    keyObj.div.classList.remove('keyboard__key--active');
    if (keyCode.match(/Control/)) this.ctrlKey = false;
    if (keyCode.match(/Alt/)) this.altKey = false;
    if (keyCode.match(/Shift/)) this.shiftKey = false;
    if (!this.shiftKey && !this.isCaps) {
      this.switchKeyboardLetter('small');
    }
    if (!this.shiftKey && this.isCaps) {
      this.switchKeyboardLetter('shift');
    }
  };

  pressMouseButton = (e) => {
    this.textArea.focus();
    let keyCode;
    try {
      keyCode = e.target.dataset.code;
      if (!e.target.dataset.code) keyCode = e.target.closest('.keyboard__key').dataset.code;
    } catch (error) {
      return;
    }
    const keyObj = this.keyButtons.find((key) => key.code === keyCode);
    this.keyPressed = { keyObj, keyCode };
    this.textArea.focus();
    keyObj.div.classList.add('keyboard__key--active');
    if (keyCode.match(/Shift/)) this.shiftKey = true;
    if (keyCode === 'CapsLock') {
      if (this.isCaps === false) {
        this.isCaps = true;
        keyObj.div.classList.add('keyboard__key--active-caps');
      } else {
        this.isCaps = false;
        keyObj.div.classList.remove('keyboard__key--active-caps');
      }
    }
    this.isCapsShift(keyObj);
    this.print(keyObj, this.symbol);
  };

  releaseMouseButton = () => {
    this.textArea.focus();
    if (!this.keyPressed.keyObj) return;
    this.keyPressed.keyObj.div.classList.remove('keyboard__key--active');
    if (this.keyPressed.keyCode.match(/Shift/)) this.shiftKey = false;
    this.isCapsShift(this.keyPressed.keyObj);
  };

  print(keyObj, symbol) {
    let cursorPosition = this.textArea.selectionStart;
    const left = this.textArea.value.slice(0, cursorPosition);
    const right = this.textArea.value.slice(cursorPosition);
    if (!keyObj.isFnKey) {
      this.textArea.value = `${left}${symbol}${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'Tab') {
      this.textArea.value = `${left}\t${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'Backspace') {
      this.textArea.value = `${left.slice(0, cursorPosition - 1)}${right}`;
      cursorPosition -= 1;
    } else if (keyObj.code === 'Delete') {
      this.textArea.value = `${left}${right.slice(1)}`;
    } else if (keyObj.code === 'Enter') {
      this.textArea.value = `${left}\n${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'ArrowUp') {
      this.textArea.value = `${left}⯅${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'ArrowRight') {
      this.textArea.value = `${left}⯈${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'ArrowDown') {
      this.textArea.value = `${left}⯆${right}`;
      cursorPosition += 1;
    } else if (keyObj.code === 'ArrowLeft') {
      this.textArea.value = `${left}⯇${right}`;
      cursorPosition += 1;
    }
    this.textArea.setSelectionRange(cursorPosition, cursorPosition);
  }

  switchLanguage = () => {
    const langsArray = Object.keys(language);
    let langIndex = langsArray.indexOf(this.container.dataset.lang);
    if (langIndex + 1 < langsArray.length) {
      this.keyBase = language[langsArray[langIndex += 1]];
    } else {
      this.keyBase = language[langsArray[langIndex -= 1]];
    }
    this.container.dataset.lang = langsArray[langIndex];
    storage.setLocalStorage(langsArray[langIndex]);

    this.keyButtons.forEach((button) => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      button.small = keyObj.small;
      button.shift = keyObj.shift;
      button.span.innerHTML = keyObj.small;
    });
  };

  switchKeyboardLetter(type) {
    this.keyButtons.forEach((button) => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (keyObj.shift) button.span.innerHTML = keyObj[type];
    });
  }
}
