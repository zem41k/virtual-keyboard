import create from './create.js';

export default class Key {
  constructor({ small, shift, code }) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = Boolean(small.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|Meta/));
    this.div = create('div', `keyboard__key ${code}`, null, null, ['code', this.code]);
    this.span = create('span', 'keyboard__text', `${small}`, this.div);
  }
}
