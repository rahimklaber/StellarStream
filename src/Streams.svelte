<script lang="ts">
    import {
        DataTable,
        DataTableHead,
        DataTableRow,
        DataTableCell,
        DataTableBody,
        Button,
        Card
    } from "svelte-materialify";

    import  StreamProps from "./StreamProps";
    import {findPaymentStreams} from "./stellar";
    import  {Asset} from "stellar-base";

    const streamTransactions = await findPaymentStreams()

    const props = streamTransactions.map(tx =>{
        const memo = tx.memo
        const amount = 0
        const asset = Asset.native() // only support xlm for now
        const amountClaimed = 0 // todo query horizon, what if account is not created?
        const {_, endTime, interval} = memo.split("_")
        new StreamProps(tx.source_account,endTime,amount,interval,amountClaimed,amount-amountClaimed,asset,tx.hash)
    })

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
