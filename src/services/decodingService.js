function decode2queryData(base64String) {
  const decodedData = Buffer.from(base64String, 'base64').toString('utf-8');
  return queryData = JSON.parse(decodedData);
}

function encode2queryData(data) {
  const stringData = JSON.stringify(data);
  const encodedData = btoa(stringData);
  return encodedData
}

// js 가 2^32 까지 표현 가능한데, 값 overflow 때문인지 값이 보존이 안됨.
// const fermatThm = {
//     prime_number : 1073741831,
//     primitive : 107374213,
//     fermatIncodeNumber : 107374213,
//     fermatDecodeNumber : 491982043,
//     add_number : 41122308,
// }

// function fermatIncode(data) {
//   return ((data * fermatThm.fermatDecodeNumber)%fermatThm.prime_number + fermatThm.add_number) % fermatThm.prime_number 
// }

// function fermatDecode(data) {
//   return (((data-fermatThm.add_number+fermatThm.prime_number)%fermatThm.prime_number) * fermatThm.fermatIncodeNumber) % fermatThm.prime_number
// }

module.exports = {
  decode2queryData
};

// module.exports = {
//   decode2queryData,fermatIncode,fermatDecode
// };

// for (let i = 0; i < 100; i++) {
//   console.log(i, fermatDecode(fermatIncode(i)))
// }