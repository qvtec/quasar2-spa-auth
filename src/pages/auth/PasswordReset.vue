<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">パスワード再発行</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
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

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.password"
              label="Password（6文字以上）"
              type="password"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上にしてください'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.password_confirmation"
              label="Password（確認）"
              type="password"
              lazy-rules
              :rules="[val => val == this.credentials.password || 'パスワードが一致しません']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
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
  name: 'PasswordResetPage',
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false
    }
  },

  mounted () {
    this.credentials.email = this.$route.query.email
  },

  methods: {
    submit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true
        const token = this.$route.query.token

        this.$api.post('reset-password', { ...this.credentials, token })
          .then(response => {
            this.$router.replace({ name: 'login' })
            this.$q.notify({ type: 'positive', message: response.data.message })
          })
          .finally(() => {
            this.password = ''
            this.password_confirm = ''
            this.loading = false
          })
      })
    }
  }
}
</script>
