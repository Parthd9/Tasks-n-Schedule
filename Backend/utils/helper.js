exports.getRandomString =  (len) => {
    str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#';
    let result ='';
    const charactersLength = str.length;
    for ( let i = 0; i < len; i++ ) {
        result += str.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
exports.formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
exports.getSeparatedArray  = (members) => {
    let developers = [];
    members.map(dev => {

    developers.push(dev['name']);
  })
  let devs = '';
for(let i=0; i<developers.length; i++ ) {
    devs = devs + developers[i];
    if(i < developers.length-1) {
        devs = devs + ', ';
    }
}
return devs;
}

exports.getSeparatedMailIds  = (members) => {
    let developers = [];
    members.map(dev => {

    developers.push(dev['email']);
  })
  let devs = '';
for(let i=0; i<developers.length; i++ ) {
    devs = devs + developers[i];
    if(i < developers.length-1) {
        devs = devs + ', ';
    }
}
console.log('list:',devs);
return devs;
}