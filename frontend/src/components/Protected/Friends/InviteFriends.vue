<template>
  <div class="invite-friends">
    <h3>Pet Connect is better with friends.</h3>
    <button @click="inviteFriends">Invite friends</button>
  </div>
</template>

<script>
export default {
  name: "InviteFriends",
  methods: {
    inviteFriends() {
      // Add invite functionality here
      console.log("Invite friends clicked!");
    }
  }
};
</script>

<style scoped>
.invite-friends {
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
}
.invite-friends button {
  padding: 10px 20px;
  border: none;
  background-color: #f39c12;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}
</style>
