
export default class StreamProps {
    creator: string
    endTime: number // endtime in epoch seconds
    amount: number
    interval: number // interval at which amount to claim increases
    amountClaimed: number
    amountAvailableToClaim: number
    asset: string

    constructor(creator: string, endTime: number, amount : number, asset: string, interval: number, amountClaimed: number,amountAvailableToClaim: number){
        this.creator = creator
        this.endTime = endTime
        this.amount = amount
        this.interval = interval
        this.amountClaimed = amountClaimed
        this.amountAvailableToClaim = amountAvailableToClaim
        this.asset = asset
    }
}