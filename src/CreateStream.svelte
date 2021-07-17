<!--
Component for creating streams.
-->
<script lang="ts">
    import {TextField,Select,Card,Button} from "svelte-materialify"
    import {assets} from "./Assets";
    let recipient : String
    let amount : String
    let endDate: String
    let interval: String
    let asset : any
    let asset_name: string
    function createStream(e : Event) {

    }
    function selectOnChange(obj: any){
        asset = obj
        asset_name = obj.name
    }
</script>
<Card style="padding:10px;">
    <TextField solo placeholder="recipient" bind:value={recipient}>Recipient</TextField>
    <div style="display: flex; padding-top: 10px;">
        <TextField solo placeholder="amount" bind:value={amount} style="padding-right: 5px;">Amount</TextField>
        <Select solo items={assets} bind:value ={asset_name} on:change={selectOnChange}>Asset</Select>
    </div>
    <TextField solo placeholder="End Date" bind:value={endDate} style="padding-top:10px;">End Date</TextField>
    <TextField solo placeholder="interval" bind:value={interval} style="padding-top:10px;">Interval</TextField>
    <Button on:click={createStream}>Create stream </Button>
</Card>