<!--
Component for creating streams.
-->
<script lang="ts">
import type { Asset } from "stellar-base";

    import {Button, Card, Select, TextField} from "svelte-materialify"
    import {assets} from "./Assets";
import {createPaymentStream, findPaymentStreams, getAssets} from "./stellar";

    let recipient: String
    let amount: String
    let endDate: String
    let interval: String
    let asset: Asset
    let asset_name: string
    let intervalUnit: string

    async function createStream(e: Event) {
        const [succes,hash,res]  =  await createPaymentStream(amount,asset,recipient,parseInt(endDate),parseInt(interval))
        if(succes){
            console.log("created stream")
        }else{
            console.log("something went wrong")
            console.log(res)
        }
    }

    function selectOnChange(obj: CustomEvent) {
        if(obj.detail == undefined || typeof(obj.detail)== "string"){
            console.log('its is undefined')
            return
        }
        asset = obj.detail
        asset_name = asset.code
        console.log(obj)
        console.log("asset name" + asset_name)
    }

    let intervalUnits = ["H","m","s"]

    function mapAsset(asset : Asset){
        const name = asset.code
        return {
            "name" : name,
            "value" : asset
        }
    }

    let selectItems :Array<{name,value}>
    async function populateAssets (){
        selectItems = (await getAssets()).map(mapAsset)
        console.log(selectItems)

    }
    populateAssets()

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
        <Select bind:value={asset_name} bind:items={selectItems} on:change={selectOnChange}
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