<template>
    <div class="login-form">
        <h2 class="login-heading">Login</h2>
        <form action="#" @submit.prevent="login">
            <div class="form-control">
                <label for="email">Username/Email</label>
                <input type="email" name="username" id="username" v-model="username" class="login-input">
            </div>
            <div class="form-control mb-more">
                <label for="password">Contraseña</label>
                <input type="password" name="password" id="id" v-model="password" class="login-input">
            </div>
            <div class="form-control">
                <button type="submit" class="btn-submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return {
            username:'',
            password:''
        }
    },
    methods: {
        login(){
           this.$store.dispatch('retrieveToken',{
               username:this.username,
               password:this.password
           }).then(res=>{
               this.$router.push({name:'todo'})
           })
        }
    },

}
</script>