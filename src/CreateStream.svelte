<!--
Component for creating streams.
-->
<script lang="ts">
    import {Button, Card, Select, TextField} from "svelte-materialify"
    import {assets} from "./Assets";

    let recipient: String
    let amount: String
    let endDate: String
    let interval: String
    let asset: any
    let asset_name: string
    let intervalUnit: string

    function createStream(e: Event) {

    }

    function selectOnChange(obj: any) {
        asset = obj
        asset_name = obj.name
    }

    let intervalUnits = ["H","m","s"]

</script>

<div style="margin-top: 2.5%">

   <h2>
       Create a new Stream
   </h2>

<Card style="padding:15px;margin-top: 5%;background-color: #272C2E;">
    <TextField bind:value={recipient} placeholder="recipient" outlined>Recipient</TextField>
    <div style="display: flex; padding-top: 10px;">
        <TextField bind:value={amount} placeholder="amount" outlined style="padding-right: 5px;">
            Amount
        </TextField>
        <Select bind:value={asset_name} items={assets} on:change={selectOnChange}
                outlined>Asset</Select>
    </div>
    <TextField bind:value={endDate} placeholder="End Date" outlined style="padding-top:10px;">End Date
    </TextField>
    <div style="display: flex; padding-top: 10px;">
        <TextField bind:value={interval} placeholder="interval" outlined style="padding-right: 5px;">
            Interval
        </TextField>
        <Select bind:value={intervalUnit} items={intervalUnits}
                outlined>Interval Unit</Select>
    </div>
    <Button on:click={createStream}>Create stream</Button>
</Card>

</div>