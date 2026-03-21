<script lang="ts">
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()

if (localStorage.getItem('token')) {
    auth.fetchUser()
}
else{
    auth.logout()
}
</script>
<template>

</template>