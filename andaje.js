let hello = "saymislam365@gmail.com";

let userName = "";
// let i = 0;
// while (true) {
// if (hello[i] != "@") {
//     username += hello[i];
//     i++;
// } else {
//     break;
// }
// }
// console.log(username);

let username = () => {
    let i = 0;
    while (true) {
        if (hello[i] != "@") {
            userName += hello[i];
            i++;
        } else {
            return userName;
        }
    }
}
console.log(username());