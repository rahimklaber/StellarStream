<style>
    .copyhover:hover {
        cursor: pointer;
    }
</style>
<script lang="ts">
    import {
        Button,
        Card,
        DataTable,
        DataTableBody,
        DataTableCell,
        DataTableHead,
        DataTableRow,
        Icon
    } from "svelte-materialify";

    import StreamProps from "./StreamProps";
    import {findCreatedStreams, findPaymentStreams,reclaimStream} from "./stellar";
    import {Asset} from "stellar-base";
    import {shortenAddress} from "./utils";
    import {mdiContentCopy} from "@mdi/js";
    import {updateClipboard} from "./utils";
    import {Notyf} from "notyf";
    const notyf = new Notyf()
    let props: Array<StreamProps> = []

    async function populateStreams() {
        console.log("trying")
        const streamTransactions = await findCreatedStreams()

        props = await Promise.all(streamTransactions.map(async (tx) => {
            const operations = (await tx.operations()).records
            console.log(operations)
            const amount = operations[1].amount
            const asset = Asset.native() // only support xlm for now
            const amountClaimed = 0 // todo query horizon, what if account is not created?
            const [_, endTime, interval] = tx.memo.split("_")
            return new StreamProps(tx.source_account, operations[operations.length-1].to,endTime, amount, interval, amountClaimed, amount - amountClaimed, asset, tx.hash)
        }))
    }

    /**
     * reclaim a stream and notify the user the result
     * @param hash hash of the stream tx
     */
    async function reclaimStreamAndNotify(hash : string){
        const [success, reclaimHash] = await reclaimStream(hash)
        console.log(success)
        if(success){
            notyf.success(`Stream reclaimed successfully. <a href=\"https://stellar.expert/explorer/testnet/tx/${reclaimHash}\" target=\"_blank\">Tx Hash</a>`)
            props = props.filter(prop => prop.txHash != hash)
        }else {
            notyf.error("Reclaiming stream failed.")
        }
    }

    populateStreams() // Todo: figure out how to do this when you connect the wallet aswell
</script>

<div style="margin-top: 2.5%">

    <h2>
        Manage created streams
    </h2>

    <Card style="padding:10px; margin-top: 5%;background-color: #272C2E;">
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableCell numeric>Amount available</DataTableCell>
                    <DataTableCell numeric>Full amount</DataTableCell>
                    <DataTableCell>Asset</DataTableCell>
                    <DataTableCell>End time</DataTableCell>
                    <DataTableCell>Interval</DataTableCell>
                    <DataTableCell>recipient</DataTableCell>
                    <DataTableCell>tx hash</DataTableCell>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                {#each props as prop}
                    <DataTableRow>
                        <DataTableCell>
                            {prop.amountAvailableToClaim}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.amountAvailableToClaim}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.asset.code}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.endTime}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.interval}
                        </DataTableCell>
                        <DataTableCell>
                            {shortenAddress(prop.recipient)}
                            <span class="copyhover" on:click={e => updateClipboard(prop.recipient)}>
                                <Icon path={mdiContentCopy}/>
                            </span>
                        </DataTableCell>
                        <DataTableCell>
                            {shortenAddress(prop.txHash)}
                            <span class="copyhover" on:click={e => updateClipboard(prop.txHash)}>
                                <Icon path={mdiContentCopy}/>
                            </span>
                        </DataTableCell>
                        <DataTableCell>
                            <Button on:click={() => reclaimStreamAndNotify(prop.txHash)}>reclaim</Button>
                        </DataTableCell>
                    </DataTableRow>
                {/each}
            </DataTableBody>
        </DataTable>
    </Card>

</div>
