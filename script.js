'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
console.log(new Date().toISOString());
const account1 = {
  owner: 'Muhammadaziz Xoldarov',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-07-06T05:54:48.006Z',
    '2024-07-07T05:54:48.006Z',
    '2024-07-08T01:51:36.790Z',
  ],
  currency: 'UZS',
  locale: 'uz-UZ', // de-DE
};

const account2 = {
  owner: 'Muhammadjon Komilov',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'TRY',
  locale: 'tr-TR',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// let timer;
// Functions
const startTimeOut = function () {
  let time = 30;
  const trigger = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = `${time % 60}`.padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  trigger();
  timer = setInterval(trigger, 1000); // here we are using the timer which is in global scope down above loginfunc
  return timer;
};
// restarting the logout time
const checktime = function () {
  if (timer) clearInterval(timer); /// here we are checking if timer exists or not if yes clearInterval func removes the timer and right after that here below ↓ we are restarting timer with timer = starttimeOut as java script read codes from top to down
  timer = startTimeOut();
};
document.querySelector('body').addEventListener('click', checktime);
const fomratMovementsDate = function (date, locale) {
  const daysPassedCalc = (data1, data2) =>
    Math.round(Math.abs((data2 - data1) / (1000 * 60 * 60 * 24)));
  const daysPassed = daysPassedCalc(new Date(), date);
  console.log(daysPassed);
  const hour = `${date.getHours()}`.padStart(2, '0');
  const min = `${date.getMinutes()}`.padStart(2, '0');
  if (daysPassed == 0) return `Today ${hour}:${min}`;
  if (daysPassed == 1) return `Yesterday ${hour}:${min}`;
  if (daysPassed <= 7) return `${daysPassed} days ago ${hour}:${min}`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}, ${hour}:${min}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayTheDate = fomratMovementsDate(date, acc.locale);
    const fortmattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayTheDate}</div>
        <div class="movements__value">${fortmattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // startTimeOut();
  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const loss = navigator.mediaDevices;
console.log(loss);
///////////////////////////////////////
// Event handlers
let currentAccount, timer;
// Fake logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// experemneting with API
const locale = navigator.language;
const nov = new Date();
const options = {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric', // 2-digit // 20
  weekday: 'long',
};
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(nov);

//
//
//
//
//
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // current date

    const now = new Date();
    const options = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric', // 2-digit // 20
      // weekday: 'long',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer); /// here we are checking if timer exists or not if yes clearInterval func removes the timer and right after that here below ↓ we are restarting timer with timer = starttimeOut as java script read codes from top to down
    timer = startTimeOut();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    setTimeout(function () {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  setTimeout(function () {
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      // Update UI
      updateUI(currentAccount);
    }
  }, 3000);
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
console.log(23 == 23.0);
console.log(0.1 + 0.2 == 0.3); // false because of javascript as we can do financial calculation with javaScript like any other languages like php

// converting strings into numbers ==========================+>
console.log(Number('23'));
console.log(+'23'); // this is same as above but with cleaner way
// 1)
//pasing
console.log(Number.parseInt('33px'));
console.log(Number.parseInt('2.3rem'));
console.log(Number.parseFloat('2.3rem')); // use with css to read number out of string
//
//2)
//check if value is NaN which returns boolean true/false
console.log(Number.isNaN(23)); // false
console.log(Number.isNaN('23')); // false
console.log(Number.isNaN('23px')); // false
console.log(isNaN('hello')); // true
console.log(Number.isNaN('hello')); // false
console.log(Number.isNaN(+'23px')); // true
//
//3)
// check if value is number . returns boolean true/false
console.log(Number.isFinite(23)); // true
console.log(Number.isFinite('23')); // false
console.log(Number.isFinite('34px')); // false
console.log(Number.isFinite(+'m23')); // false

console.log(25 ** (1 / 2)); // square root of 25 is 5
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 3)); // cube root of 25 is 2.924
console.log(Math.max(23, 12, 13, 4, 12, '31', 12, 3)); //output 31. can do parsing
console.log(Math.max(23, 12, 13, 4, 12, '31px', 12, 3)); //output NaN
console.log(Math.min(23, 12, 13, 4, 12, '31', 12, 3)); //output 3. can do parsing
console.log(Math.min(23, 12, 13, 4, 12, '31px', 12, 3)); //output NaN

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 4) + 1);
//
//
const randomNum = function (value) {
  return Number.isFinite(value) ? Math.trunc(Math.random() * value) + 1 : NaN;
};
console.log(randomNum('45'));
//
//
const randomNumb = function (max, min) {
  return Number.isFinite(max, min)
    ? Math.trunc(Math.random() * (max - min) + 1) + min
    : NaN;
};
console.log(randomNumb(23, 36));

// rounding integers
// Math.trunc() removes any decimal number from number like 23.45 -> 23
// all converts string num to num
console.log(Math.trunc(23.1)); // 23 cuts
console.log(Math.floor('25.4')); // 25 cuts
console.log(Math.ceil(23.1)); // 24 =====================23.1 -> 24 adds
console.log(Math.ceil('34.4')); // 35 adds
console.log(Math.floor('27.5')); // 27 cuts
console.log(Math.floor('-23.9')); // -24 cuts(adds)
//
// rounding decimals
// tofixed method helps us to cut decimal values as we like to and it returns numbers as strings
console.log((2.5).toFixed()); // string '3' adds //
console.log((2.534).toFixed(2)); // string '2.53' takes only 2 decimals //
console.log((2.59).toFixed(1)); // string '2.6' takes 1 decimal 45.34 -> 45.3// or 45.49 -> 45.5 adds

/// remainder operator and even numbers
console.log(5 % 2); // 1 rimainder because 5 = 2 * 2 + '1' <- this 1 is reminder
console.log(8 % 2); // 0  remainders it is an even number even numbers are (0,2,4,6,8,10 and so on) not even nums are (1,3,5,7,9,11 and so on) 2 ga bo'linsa qoldiqsiz 0 chqadigan sonlar juft sonlar deyiladi yani even numbers -> (0,2,4,6,8,10 and so on)
//taloq sonlar 1,3 lar ozidan qoldiq chqazadi va bu inglizchasiga remainder deyiladi

const isEven = n => n % 2 === 0; // bu boolean qaytaradi false/true
console.log(isEven(7)); // false

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 == 0) {
      row.style.backgroundColor = '#BFC9CA';
    }
    if (i % 3 == 0) {
      row.style.backgroundColor = '#85C1E9';
    }
  });
});
/// big ints
console.log(23112121212121223432423423432432432423423); // output 2.311212121212121e+39 because the biggest number in javaScript is
console.log(2 ** 53 - 1); // biggest num in javaScript 9007199254740991
// however when we work with API's we will have to deal with so many numbers like above so in ES20 'bigint' method cameout

console.log(23112121212121223432423423432432432423423n); //23112121212121223432423423432432432423423n this is the converted to string using n which is big_int. we can use it when we deal with API

// create a date

const now = new Date();
console.log(now); // output Sun Jul 07 2024 00:02:51 GMT+0900 (Korean Standard Time) Correct !!
console.log(new Date('january 1,2024'));
// javaScript is really smart  parsing out the string
// but not recommended to do in this way if it is reliable which is creared by javaScript itself it is pretty safe

console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2024, 11, 25, 6, 45, 10));
console.log(new Date(0));

const goFuture = new Date(2025, 1, 24, 9, 45, 33);
console.log(goFuture);
console.log(goFuture.getFullYear()); //2025
console.log(goFuture.getMonth()); //1 which feb as 0 = jan
console.log(goFuture.getDate());
console.log(goFuture.getHours());
console.log(goFuture.getMinutes());
console.log(goFuture.getSeconds());
console.log(goFuture.toDateString()); //Mon Feb 24 2025
console.log(goFuture.toISOString()); //2025-02-24T00:45:33.000Z
console.log(goFuture.getTime()); // time passed since 2024,00:00 is 1740357933000 now
console.log(new Date(232323232323)); //Sun Feb 23 2025 09:45:33 GMT+0900 (Korean Standard Time) // we can use it to assign some functions to start when it is this date
// console.log(goFuture.setDate(23)); // mutates // changes Sun Feb 'before 24/ after 23 '2025 09:45:33 GMT+0900 (Korean Standard Time)
// console.log(goFuture);

// console.log(Date.now());
const future = new Date(2025, 1, 24, 9, 45, 33);
console.log(+future);
const daysPassedCalc = (data1, data2) =>
  Math.round((data2 - data1) / (1000 * 60 * 60 * 24));

console.log(
  daysPassedCalc(new Date(2025, 1, 4, 6, 10), new Date(2025, 1, 1, 2, 5))
);
console.log(Math.round(23.8));
console.log((2.59).toFixed(1));
const num = 10012311.34;
const optionss = {
  style: 'currency',
  // unit: 'minute',
  currency: 'USD',
};

console.log('US    ', new Intl.NumberFormat('en-US', optionss).format(num));

setInterval(() => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const seconds = `${time.getSeconds()}`.padStart(2, '0');
  console.log(`${hour}:${minute}:${seconds}`);
}, 3600000);
//output // 16:45:54
