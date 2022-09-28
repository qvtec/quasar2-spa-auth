<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">2段階認証</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form
            class="q-gutter-md"
            ref="form"
            @submit="login"
          >

            <q-input
              outlined
              hide-bottom-space
              v-model="form.code"
              label="Code"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
            </q-input>

            <q-checkbox v-model="use_recovery_code" label="リカバリーコードを使う" />

            <div>
              <q-btn
                class="full-width"
                label="ログイン"
                :loading="loading"
                type="submit"
                color="accent"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'TwoFactorChallengePage',
  data () {
    return {
      form: {
        code: ''
      },
      use_recovery_code: false,
      loading: false
    }
  },

  methods: {
    login () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true

        const data = {}

        if (this.use_recovery_code) {
          data.recovery_code = this.form.code
        } else {
          data.code = this.form.code
        }

        this.$api.post('two-factor-challenge', data)
          .then(() => {
            this.$router.replace({ name: 'home' })
            this.$q.notify({ type: 'positive', message: 'ログインに成功しました' })
          })
          .catch(() => {
            this.$q.notify({ type: 'negative', message: 'ログインに失敗しました' })
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
