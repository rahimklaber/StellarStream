/**
 * Contract for Claiming a stellar stream.
 * @param body request body containing the stream tx hash
 */
import {
    Account,
    Asset,
    BASE_FEE,
    Keypair,
    Networks,
    Operation,
    TransactionBuilder
} from "stellar-sdk"
import {BigNumber} from "bignumber.js"

const kp = Keypair.fromSecret("SD3LG5GL2YV4PKBS24GB5MNRYDWBWRVGWBXCMMPHSMP7TKUD4R3UOALN")
module.exports = (body) => {
    const {hash} = body
    // const { TransactionBuilder, Networks, BASE_FEE, Operation, Asset, Account } = StellarBase
    return fetch(HORIZON_URL + `/transactions/${hash}`)
        .then(res => res.json())
        .then(tx => {
            // end and interval of stream in epoch seconds
            let [_, endTime, interval] = tx.memo.split("_")
            endTime = parseInt(endTime)
            const startTime = Math.round(Date.parse(tx.created_at) / 1000)
            return fetch(HORIZON_URL + `/transactions/${hash}/operations`)
                .then(opres => opres.json())
                .then(operations => {
                    const streamAddress = operations._embedded.records[0].account
                    const destAddress = operations._embedded.records[4].to // todo
                    const currTime = Math.round(Date.now() / 1000) // seconds since epoch Todo: do we neet more precision?
                    console.log(startTime)
                    console.log(currTime)
                    console.log(endTime)
                    const fraction = Math.floor(((currTime - startTime) / interval)) * (interval / (endTime - startTime)) // Todo: check if this makes sense

                    const totalAmount = operations._embedded.records[1].amount // todo other assets other than xlm

                    return fetch(HORIZON_URL + `/accounts/${streamAddress}`)
                        .then(accountres => accountres.json())
                        .then(account => {
                            console.log(account)
                            // if the account holds other assets beside xlm then the stream is for the other asset
                            const remainingAmount = account.balances.length > 1 ? account.balances[1].balance : account.balances[0].balance - 1
                            const assetCode = account.balances.length > 1 ? account.balances[1].asset_code : undefined
                            const assetIssuer = account.balances.length > 1 ? account.balances[1].asset_issuer : undefined
                            const asset = account.balances.length > 1 ? new Asset(assetCode, assetIssuer) : Asset.native()
                            console.log("fractin " + fraction)
                            const toClaim = totalAmount * fraction - (totalAmount - remainingAmount)
                            return fetch(HORIZON_URL + `/accounts/${destAddress}`)
                                .then(destAccountres => destAccountres.json())
                                .then(destAccount => {
                                    const destAccountObj = new Account(destAddress, destAccount.sequence)
                                    return new TransactionBuilder(destAccountObj, {
                                        fee: BASE_FEE,
                                        networkPassphrase: Networks.TESTNET
                                    })
                                        .addOperation(
                                            Operation.payment(
                                                {
                                                    source: streamAddress,
                                                    destination: destAddress,
                                                    amount: fraction > 1 || fraction < 0.00001 ? (new BigNumber(remainingAmount())).toPrecision(7, 1) : (new BigNumber(toClaim)).toPrecision(7, 1),
                                                    asset: asset
                                                }
                                            )
                                        )
                                        .setTimeout(0)
                                        .build()
                                })

                        })
                })
        })
}