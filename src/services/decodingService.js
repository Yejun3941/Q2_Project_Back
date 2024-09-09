function decode2queryData(base64String) {
  const decodedData = Buffer.from(base64String, 'base64').toString('utf-8');
  return queryData = JSON.parse(decodedData);
}

function encode2queryData(data) {
  const stringData = JSON.stringify(data);
  const encodedData = btoa(stringData);
  return encodedData
}


const fermatThm = {
    prime_number : 1073741831,
    primitive : 13,
    fermatIncodeNumber : 58106951,
    fermatDecodeNumber : 142555531,
    add_number : 41122308
}

function fermatIncode(data) {
  return (data * fermatThm.fermatDecodeNumber + add_number) % fermatThm.prime_number 
}

function fermatDecode(data) {
  return (((data-add_number)%fermatThm.prime_number) * fermatThm.fermatIncodeNumber) % fermatThm.prime_number
}

module.exports = {
  decode2queryData,fermatIncode,fermatDecode
};