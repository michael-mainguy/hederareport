const {Client} = require('pg');
require('dotenv').config();
const pg = new Client({ssl: {rejectUnauthorized: false}});
const axios = require('axios').default;
const util = () => {
    let curr_link = '/api/v1/transactions?account.id=0.0.584013&order=asc&timestamp=gt:1644346669.810258000';
    let i = 0;

    this.updateTransactionDB = async (start) => {
        pg.connect();
        if (start !== undefined) {
            curr_link = start;
        }
        getData().then(function () {
            console.log("done");
        });
    }

    async function getData() {
        axios.get('https://mainnet-public.mirrornode.hedera.com' + curr_link)
            .then(async function (response) {
                try {
                    let result1 = await pg.query("insert into transaction_urls (url) values ($1)", ['https://mainnet-public.mirrornode.hedera.com' + curr_link]);
                    console.log(result1);
                } catch (e) {
                    console.log("Already Updated");
                }

                try {
                    result = await pg.query("select max(id) from transaction_urls where url = $1", ['https://mainnet-public.mirrornode.hedera.com' + curr_link]);
                } catch (e) {
                    console.log("can't get max");
                }
                await response.data.transactions.forEach(function (transaction) {
                    i++;
                    try {
                        let insertdata = pg.query("insert into transactions (data, transaction_url_id, hash) values ($1, $2, $3)",
                            [transaction, result.rows[0].max, transaction.transaction_hash]);

                    } catch (e) {
                        console.log("failed to process");
                    }
                    console.log(i + "," + transaction.charged_tx_fee + "," + transaction.name + "," + transaction.consensus_timestamp);
                });
                if (response.data.links && response.data.links.next) {

                    if (i < 10000) {
                        curr_link = response.data.links.next;
                        setTimeout(getData, 1000);
                    }
                }
            });
    }

    return this;
}
exports.util = util;

