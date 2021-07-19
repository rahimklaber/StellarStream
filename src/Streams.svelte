<script lang="ts">
    import {
        Button,
        Card,
        DataTable,
        DataTableBody,
        DataTableCell,
        DataTableHead,
        DataTableRow
    } from "svelte-materialify";

    import StreamProps from "./StreamProps";
    import {findPaymentStreams} from "./stellar";
    import {Asset} from "stellar-base";

    let props: Array<StreamProps> = []

    async function populateStreams() {
        console.log("trying")
        const streamTransactions = await findPaymentStreams()

        props = await Promise.all(streamTransactions.map(async (tx) => {
            const operations = (await tx.operations()).records
            console.log(operations)
            const amount = operations[1].amount
            const asset = Asset.native() // only support xlm for now
            const amountClaimed = 0 // todo query horizon, what if account is not created?
            const {_, endTime, interval} = tx.memo.split("_")
            return new StreamProps(tx.source_account, endTime, amount, interval, amountClaimed, amount - amountClaimed, asset, tx.hash)
        }))
    }

    populateStreams()


    // const testProps = [new StreamProps("testCreator",100,2000,"usdc",20,0,22)]
    //
    // let props: Array<StreamProps> = testProps
</script>

<div style="margin-top: 2.5%">

    <h2>
        Claim streamed assets
    </h2>

    <Card style="padding:10px; margin-top: 5%;background-color: #272C2E;">
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableCell numeric>Amount available</DataTableCell>
                    <DataTableCell numeric>Full amount</DataTableCell>
                    <DataTableCell>Asset</DataTableCell>
                    <DataTableCell>End time</DataTableCell>
                    <DataTableCell>Creator</DataTableCell>
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
                            {prop.asset}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.endTime}
                        </DataTableCell>
                        <DataTableCell>
                            {prop.creator}
                        </DataTableCell>
                        <DataTableCell>
                            <Button>Claim</Button>
                        </DataTableCell>
                    </DataTableRow>
                {/each}
            </DataTableBody>
        </DataTable>
    </Card>

</div>
