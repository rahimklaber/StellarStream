import {
    Account,
    Asset,
    Keypair,
    Memo,
    Networks,
    Operation,
    Server,
    ServerApi,
    TransactionBuilder,
} from "stellar-sdk"
import {account, publicKey, signWithAlbedo} from "./store"
import TransactionRecord = ServerApi.TransactionRecord;
//Todo: env variables?
export const network: Networks = Networks.TESTNET
export const server = new Server("https://horizon-testnet.stellar.org")
const tssAccountId = "GDBNLLPNHN3C3DLKHA2CPUHAXSV5EQB4J47IJNJ2DW76RUMZT2CAGDDH" // todo

/**
 * get the assets for which the user has trustlines to.
 */
export async function getAssets(){
    const assets =  (await server.accounts().accountId(await publicKey()).call())
        .balances
        .filter(balance => "asset_code" in balance)
        .map(balance => new Asset(balance.asset_code,balance.asset_issuer))
    assets.push(Asset.native())
    return assets
}

/**
 * Find streams for which you are the recipient
 */
export async function findPaymentStreams(): Promise<ServerApi.TransactionRecord[]> {
    const accountId = await publicKey()
    const operationsToTest = await server
        .payments()
        .forAccount(accountId)
        .limit(200) // todo figure this out
        .call()

    const streams = await Promise.all(operationsToTest.records.filter(record => {
        return record.type == "payment" && record.amount == "0.0000001" && record.to == accountId
    }).map(async (record) => {
        return await record.transaction()
    }))

    return streams.filter(tx => tx.memo.startsWith("stellarstream"))
}

/**
 * Find stream you have created
 */
export async function findCreatedStreams() :  Promise<ServerApi.TransactionRecord[]>{
    const accountId = await publicKey()
    const operationsToTest = await server
        .payments()
        .forAccount(accountId)
        .limit(200) // todo figure this out
        .call()

    const streams = await Promise.all(operationsToTest.records.filter(record => {
        return record.type == "payment" && record.amount == "0.0000001" && record.from == accountId
    }).map(async (record) => {
        return await record.transaction()
    }))

    return streams.filter(tx => tx.memo.startsWith("stellarstream"))
}

/**
 * Create a payment stream.
 * the claimable amount increases linearly, every interval seconds.
 *
 * Todo describe structure of submitted tx
 *
 * @param amount amount to stream
 * @param asset asset to stream
 * @param destination recipient of the stream
 * @param endTime end time in epoch seconds
 * @param interval interval to increase claimable amount
 */
export async function createPaymentStream(amount: string, asset: Asset, destination: string, endTime: number, interval: number): Promise<[boolean, string]> {
    const fee = await server.fetchBaseFee()
    const streamKeyPair = Keypair.random()
    const accountObject: Account = await account()
    const tx = new TransactionBuilder(accountObject, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(Operation.createAccount({
            destination: streamKeyPair.publicKey(),
            startingBalance: "2" // extra xlm for extra signers
        }))//todo just use create account and not an extra payment
        .addOperation(Operation.payment({
            amount: amount,
            asset: asset,
            destination: streamKeyPair.publicKey()
        }))
        .addOperation(
            Operation.setOptions(
                {
                    signer: {
                        ed25519PublicKey: tssAccountId,
                        weight: 1
                    },
                    source: streamKeyPair.publicKey()

                }
            )
        )
        .addOperation(
            Operation.setOptions(
                {
                    signer: {
                        ed25519PublicKey: accountObject.accountId(),
                        weight: 1
                    },
                    source: streamKeyPair.publicKey()

                }
            )
        )
        .addOperation(Operation.payment({
            amount: "0.0000001",
            asset: Asset.native(),
            destination: destination
        }))
        .setTimeout(0)
        .addMemo(Memo.text(`stellarstream_${endTime}_${interval}`)) // "stellarstream_endEpoch_intervalSeconds"
        .build()

    const albedoSignedXdr = await signWithAlbedo(tx.toXDR())
    const albedoSignedTx = TransactionBuilder.fromXDR(albedoSignedXdr, network)
    albedoSignedTx.sign(streamKeyPair)

    console.log(albedoSignedTx.toXDR())

    const submitResponse = await server.submitTransaction(albedoSignedTx)
    // @ts-ignore
    if (submitResponse.successful) {
        return [true, submitResponse.hash]
    } else {
        return [false, ""]
    }
}