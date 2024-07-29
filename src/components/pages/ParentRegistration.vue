<template>
    <div>
      <UserRegister />
    </div>
  </template>
  
  <script>
  import UserRegister from './UserRegisterTemplate.vue';
  
  export default {
    name: 'ParentRegistration',
    components: {
      UserRegister,
    },
  };
  </script>
  