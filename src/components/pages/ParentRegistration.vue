<ng-container>
      <UserRegister />
</ng-container>

<script>
import UserRegister from './UserRegisterTemplate.vue';

export default {
  name: 'ParentRegistration',
  components: {
    UserRegister,
  },
};
</script>