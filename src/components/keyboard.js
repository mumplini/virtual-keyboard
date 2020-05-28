class Keyboard {
    constructor(
        keys
    ) {
        this.keys = keys;
        this.length = this.keysLength();
        this.keyboardElement = null;
        this.textarea = null;
        this.keyboardKeys = null;
        this.language = 'en';
        this.caps = false;
        this.buffer = '';
        this.pressed = new Set();

        this.keydownHandler = event => this.keydownProcess(event);
        this.keyupHandler = event => this.keyupProcess(event);
        this.clickHandler = event => this.clickProcess(event);
    }

    addListeners() {
        document.addEventListener('keydown', this.keydownHandler);
	 	document.addEventListener('keyup', this.keyupHandler);
	 	document.addEventListener('click', this.clickHandler);
    }

    deleteListeners() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('click', this.clickHandler);
    }

    init(lang = window.sessionStorage.getItem('lang') || 'en') {
        const form = document.createElement('form');
        const textarea = document.createElement('textarea');
        const div = document.createElement('div');
        const p = document.createElement('p');

        p.innerText = 'Please press Shift + Alt to change keyboard language';
        textarea.classList.add('output__textarea');
        div.classList.add('keyboard');

        for (const key in this.keys) {
            if (Array.isArray(this.keys[key])) {
                const button = document.createElement('input');
                button.type = 'button';

                button.classList.add('key', this.keys[key][1], this.keys[key][2]);

                switch (this.keys[key][0]) {
                case 'Ctrl':
                    button.dataset.key = 'ControlLeft';
                    break;
                case 'Win':
                    button.dataset.key = 'MetaLeft';
                    break;
                case 'Del':
                    button.dataset.key = 'Delete';
                    break;
                case '↑':
                    button.dataset.key = 'ArrowUp';
                    break;
                case '←':
                    button.dataset.key = 'ArrowLeft';
                    break;
                case '↓':
                    button.dataset.key = 'ArrowDown';
                    break;
                case '→':
                    button.dataset.key = 'ArrowRight';
                    break;
                default:
                    button.dataset.key = this.keys[key][0];
                    break;
                }

                button.value = this.keys[key][0];
                div.appendChild(button);
            } else {
                const button = document.createElement('input');
                button.type = 'button';
                button.classList.add('key', 'key__letter');

                button.value = this.keys[key][lang];
                div.appendChild(button);
            }
        }

        form.appendChild(textarea);
        form.appendChild(div);
        document.body.insertAdjacentElement('afterBegin', form);
        form.insertAdjacentElement('beforeEnd', p);
        this.initElements();
    }


    initElements() {
        this.keyboardElement = document.getElementsByClassName('keyboard')[0];
        this.textarea = document.getElementsByClassName('output__textarea')[0];
        this.keyboardKeys = document.querySelectorAll('input[type=button]');

        if (this.buffer) {
            this.textarea.value = this.buffer;
        }

        if (this.caps) {
            this.keyboardKeys[28].classList.add('capsLock');
        }

        this.addListeners();
    }

    keydownProcess(event) {
        this.pressed.add(event.key);

        if (event.key === 'Control') {
            for (let i = 1; i < 13; i++) {
                this.keyboardKeys[i].value = this.keys[i].ctrl;
            }
        }

        if (event.key === 'Shift') {
            for (let i = 0; i < this.keyboardKeys.length; i++) {
                if (!this.keyboardKeys[i].classList.contains('key__func')) {
                    this.keyboardKeys[i].value = this.keys[i][this.language].toUpperCase();
                }
            }

            for (let i = 1; i < 13; i++) {
                this.keyboardKeys[i].value = this.keys[i].ctrl;
            }
        }

        event.key === 'CapsLock' ? this.capsLock() : false;

        if (event.key === 'Enter') {
            this.textarea.value += '\n';
        }

        if (event.key === 'ArrowUp') {
            this.textarea.value += '↑';
        }

        if (event.key === 'ArrowDown') {
            this.textarea.value += '↓';
        }

        if (event.key === 'ArrowLeft') {
            this.textarea.value += '←';
        }

        if (event.key === 'ArrowRight') {
            this.textarea.value += '→';
        }

        if (event.key === 'Delete') {
            this.processDel();
        }

        if (this.funcKeyPressCheck(event.key)) {
            this.textarea.value += event.key;
        }

        for (let i = 0; i < this.keyboardKeys.length; i++) {
            if (event.key === this.keyboardKeys[i].value
				|| event.code === this.keyboardKeys[i].value
				|| event.code === this.keyboardKeys[i].dataset.key) {
                if (!this.keyboardKeys[i].classList.contains('active')) {
                    this.keyboardKeys[i].classList.add('active');
                    break;
                }
            }
        }
    }

    keyupProcess(event) {
        this.textarea.autofocus = false;

        if (event.key === 'Control') {
            for (let i = 0; i < 13; i++) {
                this.keyboardKeys[i].value = this.keys[i].ru;
            }
        }

        if (event.key === 'Shift') {
            for (let i = 0; i < this.keyboardKeys.length; i++) {
                if (!this.keyboardKeys[i].classList.contains('key__func')) {
                    this.keyboardKeys[i].value = this.keys[i][this.language].toLowerCase();
                }
            }

            for (let i = 1; i < 13; i++) {
                this.keyboardKeys[i].value = this.keys[i].ru;
            }
        }

        for (let i = 0; i < this.keyboardKeys.length; i++) {
            if (this.keyboardKeys[i].classList.contains('active')) {
                this.keyboardKeys[i].classList.remove('active');
            }
        }

        if (this.pressed.has('Alt') && this.pressed.has('Shift') && this.pressed.size == 2) {
            const form = document.querySelector('form');

            while (document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            }

            this.language == 'ru' ? this.language = 'en' : this.language = 'ru';
            this.buffer = this.textarea.value; 

            this.deleteListeners();

            window.sessionStorage.setItem('lang', this.language);

            this.init(this.language);
        }

        this.pressed.clear();
    }

    clickProcess(event) {
        if (event.target.value == 'Backspace') {
            this.textarea.value = this.textarea.value.slice(0, this.textarea.value.toString().length - 1);
        }

        if (event.target.value === 'Enter') {
            this.textarea.value += '\n';
        }

        if (event.target.value === 'Del') {
            this.processDel();
        }

        if (event.target.type !== 'textarea' && event.target.type === 'button'
			&& this.funcKeyClickCheck(event.target.value)) {
            this.textarea.value += event.target.value;
        }

        event.target.value === 'CapsLock' ? this.capsLock() : false;
    }

    processDel(){
        let cursorPosition = this.textarea.selectionStart;
        let left =  this.textarea.value.slice(0, cursorPosition);
        let right =  this.textarea.value.slice(cursorPosition);
        this.textarea.value =  `${left}${right.slice(1)}`;
        this.textarea.setSelectionRange(cursorPosition, cursorPosition);
    }

    capsLock() {
        if (!this.caps) {
            this.keyboardKeys[28].classList.add('capsLock');

            for (let i = 0; i < this.keyboardKeys.length; i++) {
                if (!this.keyboardKeys[i].classList.contains('key__func')) {
                    this.keyboardKeys[i].value = this.keys[i][this.language].toUpperCase();
                }
            }
        } else {
            this.keyboardKeys[28].classList.remove('capsLock');

            for (let i = 0; i < this.keyboardKeys.length; i++) {
                if (!this.keyboardKeys[i].classList.contains('key__func')) {
                    this.keyboardKeys[i].value = this.keys[i][this.language].toLowerCase();
                }
            }
        }

        this.caps = !this.caps;
    }

    keysLength() {
        let counter = 0;
        for (const key in this.keys) {
            counter++;
        }
        return counter;
    }

    funcKeyPressCheck(key) {
        return key !== 'Backspace' && key !== 'Alt' && key !== 'Delete' && key !== 'Control'
				&& key !== 'Shift' && key !== 'CapsLock' && key !== 'Enter' && key !== 'Tab'
				&& key !== 'Meta' && key !== 'AltGraph' && key !== 'ContextMenu'&& key !== 'ArrowUp'
				&& key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowRight' ;
    }

    funcKeyClickCheck(key) {
        return key && key !== 'Backspace' && key !== 'Alt' && key !== 'Del'
				&& key !== 'Control' && key !== 'Shift' && key !== 'CapsLock'
				&& key !== 'Enter' && key !== 'Tab' && key !== 'Ctrl' && key !== 'Meta'
				&& key !== 'Space' && key !== 'Win' && key !== 'AltGraph' && key !== 'ContextMenu';
    }
}

module.exports = Keyboard;
