
<style lang="scss" global>

</style>

<script lang="ts">
let isSideNavOpen = false
import {store} from "./store"
import { onMount } from "svelte";
import Home from "./Home.svelte"
import {router} from "./navigo"


let page = Home

store.subscribe( value => {
		page = value
	}
)
onMount(async()=>router.updatePageLinks())


import {
    AppBar,
    Button,
    Icon,
    NavigationDrawer,
  MaterialApp } from 'svelte-materialify';

  import CreateStream from "./CreateStream.svelte"
  import Streams from "./Streams.svelte"
  let active = false;
  function toggleNavigation() {
    active = !active;
  }
  const theme = "light"
</script>

<MaterialApp {theme}>
<div style="position:relative;height:250px">
  <AppBar>
    <div slot="icon">
      <Button depressed on:click={toggleNavigation}>
        <Icon  />
      </Button>
    </div>
    <span slot="title"> Click The Menu </span>
  </AppBar>
  <NavigationDrawer style="float:left;" {active}>Content</NavigationDrawer>
  	<div style="float: left;">
		<CreateStream />
		<Streams/>
	  </div>
	
</div>
</MaterialApp>