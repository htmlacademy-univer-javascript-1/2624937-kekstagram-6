const strLength = (str, charAmount) => str.length <= charAmount;

const palindrommCheck = (str) => str.replace(/\s/g, '').toLowerCase() === str.replace(/\s/g, '').toLowerCase().split('').reverse().join('');
