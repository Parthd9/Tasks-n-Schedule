exports.getRandomString =  (len) => {
    str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#';
    let result ='';
    const charactersLength = str.length;
    for ( let i = 0; i < len; i++ ) {
        result += str.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}