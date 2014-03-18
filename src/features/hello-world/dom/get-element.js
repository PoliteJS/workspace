
function getElement(target) {
    if (typeof target === 'string') {
        return document.getElementById(target) || document.querySelector(target);
    } else {
        return target;
    }
}

module.exports = getElement;
