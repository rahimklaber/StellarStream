import type {Asset} from "stellar-base";

export default class StreamProps {
    creator: string
    recipient: string
    endTime: number // endtime in epoch seconds
    amount: number
    interval: number // interval at which amount to claim increases
    amountClaimed: number
    amountAvailableToClaim: number
    asset: Asset
    txHash: string

    constructor(creator: string,recipient: string, endTime: number, amount : number, interval: number, amountClaimed: number,amountAvailableToClaim: number,asset: Asset,txHash : string){
        this.creator = creator
        this.recipient = recipient
        this.endTime = endTime
        this.amount = amount
        this.interval = interval
        this.amountClaimed = amountClaimed
        this.amountAvailableToClaim = amountAvailableToClaim
        this.asset = asset
        this.txHash = txHash
    }
}