<template>
    <div class="home-container"> <!-- Use a wrapper for flex layout -->
        <!-- <Navbar /> -->
        <main>
            <!-- <h1>EVENTS</h1> -->
            <RSVPbar />
            <Details />

        </main>

    </div>
</template>

<script setup>
// Any Home page-specific logic 
import Details from '@/components/Protected/Details.vue';
import RSVPbar from '@/components/Protected/RSVPbar.vue';

</script>

<style scoped>
.home-container {
    display: flex;
    /* Set flexbox layout for the container */
}

/* can change */
main {
    flex-grow: 1;
    /* Allow main to take the remaining width */
    padding: 20px;
    /* Add padding for spacing */
    /* Optional styling */
    background-color: white;
    /* Example background color */
    overflow-y: auto;
    /* Allow scrolling if content overflows */
    margin-bottom: 20px;
}
/* 
h1 {
    text-align: center; */
    /* Center text in the main area */
/* } */
</style>