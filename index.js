const ZarinPal = require('./lib/zarinpal');
let zarinpal = new ZarinPal("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", true);

(async () => {
    let result = await zarinpal.paymentRequest({
        amount: 10000,
        callbackUrl: "http://localhost:3000/callback",
        description: "test",
    });
    console.log(result);
    //execute the url
    require('child_process').exec(`start ${result.url}`);
    await sleep(10000);
    let result2 = await zarinpal.paymentVerification({
        authority: result.Authority,
        amount: 10000,
    });
    console.log(result2);
})();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

zarinpal.paymentRequest;
