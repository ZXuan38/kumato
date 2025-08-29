<template>
    <v-alert   text outlined dense :type="myValue.type" @click="myValue.click()" :color="myValue.color">{{ myValue.info }}</v-alert>
</template>

<script>



export default {
    name: "JRalert",
    props: {
        myValue: Object
    },
    data: () => ({
    }),
    methods: {
    },
    components: {
    },
    watch: {
    },
    mounted: function () { },
};
</script>
>

