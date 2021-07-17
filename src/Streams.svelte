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
    const testProps = [new StreamProps("testCreator",100,2000,"usdc",20,0,22)]

    let props: Array<StreamProps> = testProps
</script>

<Card style="padding:10px;">
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
