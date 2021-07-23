import {
    Account,
    Asset,
    Claimant,
    Horizon,
    Keypair,
    Memo,
    Networks,
    Operation,
    Server,
    ServerApi,
    TransactionBuilder
} from "stellar-sdk"
import {account, publicKey, signWithAlbedo} from "./store"
import {Buffer} from "buffer"
//Todo: env variables?
export const network: Networks = Networks.TESTNET
export const server = new Server("https://horizon-testnet.stellar.org")
const tssAccountId = "GDBNLLPNHN3C3DLKHA2CPUHAXSV5EQB4J47IJNJ2DW76RUMZT2CAGDDH" // todo
window.xd = createTurretFeeTokenTxFromClaimableId
window.xd2 = createClaimableBalanceForTurret
export async function createTurretFeeTokenTxFromClaimableId(turretAddr: string,claimableId: string, amount: string,txfunctionHash : string):Promise<[boolean,string]>{
    try {
        console.log(claimableId)
        const tx = new TransactionBuilder(new Account(await publicKey(),"-1"),{fee: (await server.fetchBaseFee()).toString(), networkPassphrase:network})
            .addOperation(
                Operation.claimClaimableBalance({
                    balanceId: claimableId,
                    source: await publicKey()
                })
            )
            .addOperation(
                Operation.manageData(
                    {
                        name: "txFunctionHash",
                        value: txfunctionHash
                    }
                )
            )
            .setTimeout(30*60*60*24)
            .build()
        console.log(tx.sequence)
        console.log(tx.toXDR())
        //todo for somereason albedo sets the sequence as "auto" when we set it to -1
        const signedXdr = await signWithAlbedo(tx.toXDR());
        return [true,signedXdr]
    }catch (e) {
        console.log(e)
        return [false,""]
    }


}

export async function createTurretFeeTokenTx(turretAddr: string, amount: string,txfunctionHash : string){
    const [claimableBalanceSuccess, claimableBalanceId] = await createClaimableBalanceForTurret(turretAddr,amount,230)
    if(!claimableBalanceSuccess){
        return [false,""]
    }
   return createTurretFeeTokenTxFromClaimableId(turretAddr,claimableBalanceId,amount,txfunctionHash)

}



export async function createClaimableBalanceForTurret(turretAddr: string, amount: string, turretfeedays: number): Promise<[boolean, string]> {
    try {
        const toSign = new TransactionBuilder(await account(), {
            fee: (await server.fetchBaseFee()).toString(),
            networkPassphrase: network
        }).addOperation(
            Operation.createClaimableBalance(
                {
                    asset: Asset.native(),
                    amount: amount,
                    claimants: [new Claimant(turretAddr,Claimant.predicateUnconditional()),new Claimant(await publicKey(), Claimant.predicateNot(Claimant.predicateBeforeRelativeTime((turretfeedays * 24 * 60 * 60).toString())))]
                }
            )
        )
            .setTimeout(0)
            .build()
            .toXDR()

        const signedXdr = await signWithAlbedo(toSign)

        const submitResponse = await server.submitTransaction(TransactionBuilder.fromXDR(signedXdr, network))
        console.log(submitResponse)
        // @ts-ignore
        if (submitResponse.successful) {
            // assume that we only have only claimable balance for the turret
            //Todo get them by descending
            const claimableBalanceResponse = await server.claimableBalances().claimant(turretAddr).sponsor(await publicKey()).call()
            return [true, claimableBalanceResponse.records[0].id]
        } else {
            return [false, ""]
        }
    } catch (e) {
        console.log(e)
        return [false, ""]
    }


}

export async function createTurretFeeToken() {

}

/**
 * get the assets for which the user has trustlines to.
 */
export async function getAssets() {
    const assets = (await server.accounts().accountId(await publicKey()).call())
        .balances
        .filter(balance => "asset_code" in balance)
        .map(balance => new Asset(balance.asset_code, balance.asset_issuer))
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
export async function findCreatedStreams(): Promise<ServerApi.TransactionRecord[]> {
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
export async function createPaymentStream(amount: string, asset: Asset, destination: string, endTime: number, interval: number): Promise<[boolean, string, Horizon.SubmitTransactionResponse]> {
    const fee = await server.fetchBaseFee()
    const streamKeyPair = Keypair.random()
    const accountObject: Account = await account()
    let native = true
    let reserve = "2" // extra xlm for extra signers
    if (asset != Asset.native()) {
        native = false
        reserve = "2.5" // trustline
    }
    const txBuilder = new TransactionBuilder(accountObject, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(Operation.createAccount({
            destination: streamKeyPair.publicKey(),
            startingBalance: reserve
        }))//todo just use create account and not an extra payment
    if (!native) {
        txBuilder.addOperation(Operation.changeTrust({
            asset: asset,
            source: streamKeyPair.publicKey()
        }))
    }
    const tx = txBuilder
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
        return [true, submitResponse.hash, submitResponse]
    } else {
        return [false, "", submitResponse]
    }
}