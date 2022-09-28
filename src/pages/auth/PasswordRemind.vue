<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">パスワード再発行</div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="sent">
          パスワード再発行用URLを送信しました。
        </q-card-section>

        <q-card-section v-else>
          <q-form
            class="q-gutter-md"
            ref="form"
            @submit="submit"
          >

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <div>
              <q-btn
                class="full-width"
                label="送信"
                :loading="loading"
                type="submit"
                color="secondary"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <div class="q-py-md">
        <q-btn flat color="primary" label="ログイン画面はこちら" to="/auth/login" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PasswordRemindPage',
  data () {
    return {
      credentials: {
        email: ''
      },
      loading: false,
      sent: false
    }
  },

  methods: {
    submit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true

        this.$api.post('forgot-password', this.credentials)
          .then(response => {
            this.sent = true
            this.$q.notify({ type: 'positive', message: response.data.message })
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
