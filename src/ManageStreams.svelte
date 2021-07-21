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
    import {findCreatedStreams, findPaymentStreams} from "./stellar";
    import {Asset} from "stellar-base";
    import {shortenAddress} from "./utils";
    import {mdiContentCopy} from "@mdi/js";

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

    populateStreams() // Todo: figure out how to do this when you connect the wallet aswell

    function updateClipboard(newClip) {
        navigator.clipboard.writeText(newClip).then(function() {
            /* clipboard successfully set */
        }, function() {
            /* clipboard write failed */
        });
    }
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
                            <Button>reclaim</Button>
                        </DataTableCell>
                    </DataTableRow>
                {/each}
            </DataTableBody>
        </DataTable>
    </Card>

</div>
