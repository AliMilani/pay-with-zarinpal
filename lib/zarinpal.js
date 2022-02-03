const axios = require("axios");

let _apiUrl = new WeakMap();
let _payUrl = new WeakMap();

class ZarinPal {
    #_merchantID;
    #_sandbox;

    constructor(merchantID, sandbox = false) {
        if (!merchantID) throw new Error("MerchantID is required.");
        if (merchantID.length !== 36)
            throw new Error("MerchantID must be 36 characters.");
        if (typeof merchantID !== "string")
            throw new Error("MerchantID must be a string.");
        if (typeof sandbox !== "boolean")
            throw new Error("Sandbox must be a boolean.");
        this.#_merchantID = merchantID;
        this.#_sandbox = sandbox;
        if (sandbox) {
            _apiUrl.set(this, "https://sandbox.zarinpal.com/pg/rest/WebGate/");
            _payUrl.set(this, "https://sandbox.zarinpal.com/pg/StartPay/");
        } else {
            _apiUrl.set(this, "https://www.zarinpal.com/pg/rest/WebGate/");
            _payUrl.set(this, "https://www.zarinpal.com/pg/StartPay/");
        }
    }

    get sandbox() {
        return this.#_sandbox;
    }

    get merchantID() {
        return this.#_merchantID;
    }

    paymentRequest(input) {
        let { amount, callbackUrl, description, email, mobile } = input;
        if (typeof amount !== "number") throw new Error("Amount must be a number.");
        if (typeof callbackUrl !== "string") throw new Error("CallbackUrl must be a string.");
        if (typeof description !== "string") throw new Error("Description must be a string.");

        const url = _apiUrl.get(this) + "PaymentRequest.json";
        const params = {
            MerchantID: this.#_merchantID,
            Amount: amount,
            CallbackURL: callbackUrl,
            Description: description,
        };
        //optional params
        if (email) params.Authority = authority;
        if (mobile) params.Authority = mobile;

        return new Promise((resolve, reject) => {
            axios
                .post(url, params)
                .then((response) => {
                    response.data.url = _payUrl.get(this) + response.data.Authority;
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    paymentVerification(input) {
        let { authority, amount } = input;
        if (typeof authority !== "string")
            throw new Error("Authority must be a string.");
        if (typeof amount !== "number") throw new Error("Amount must be a number.");

        const url = _apiUrl.get(this) + "PaymentVerification.json";
        const params = {
            MerchantID: this.#_merchantID,
            Amount: amount,
            Authority: authority,
        };
        return new Promise((resolve, reject) => {
            axios
                .post(url, params)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = ZarinPal;
