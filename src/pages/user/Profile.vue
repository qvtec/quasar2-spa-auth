<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="q-gutter-md col-xs-12 col-sm-7 col-lg-5">
      <Information />
      <UpdatePassword />
      <TwoFactor />
      <DeleteAccount />
    </div>
  </q-page>
</template>

<script lang="ts">
import Information from 'components/Profile/Information.vue'
import UpdatePassword from 'components/Profile/UpdatePassword.vue'
import TwoFactor from 'components/Profile/TwoFactor.vue'
import DeleteAccount from 'components/Profile/DeleteAccount.vue'

export default {
  name: 'UserProfilePage',
  components: { Information, UpdatePassword, TwoFactor, DeleteAccount }
}
</script>
