<template>
    <div>{{remaining}} faltantes</div>
</template>
<script>
export default {
    name:"todo-item-remaining",
    props:{
        remaining:{
            type:Number,
            required:true,
        }
    }
}
</script>