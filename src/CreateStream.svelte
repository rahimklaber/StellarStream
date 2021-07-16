<script lang="ts">
    import {TextField,Select,Card,Button} from "svelte-materialify"
</script>
<Card style="padding:50px;">
    <TextField solo placeholder="recipient">Recipient</TextField>
    <div style="display: flex; padding-top: 10px;">
        <TextField solo placeholder="amount" style="padding-right: 5px;">Amount</TextField>
        <Select>Asset</Select>
    </div>
    <TextField solo placeholder="duration" style="padding-top:10px;">Duration</TextField>
    <TextField solo placeholder="interval" style="padding-top:10px;">Interval</TextField>
    <Button>Create stream</Button>
</Card>