const capLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const smLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';

function genRandom(start = 0, end = 10) {
  const random = Math.round(Math.random() * end + start);
  return random;
}

export default function (length = 10) {
  let password = '';
  const lettersArr = smLetters.concat(numbers);
  for (let i = 0; i < length; i++) {
    const randomNum = genRandom(0, lettersArr.length - 1);
    password += lettersArr[randomNum];
  }
  return password;
}
