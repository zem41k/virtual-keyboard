export function setLocalStorage(lang) {
    localStorage.setItem('lang', lang);
}

export function getLocalStorage() {
    if (localStorage.getItem('lang')) {
        return localStorage.getItem('lang');
    } else {
        return 'ru';
    }
}
