<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">2段階認証</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div>
        <q-btn
          v-if="this.$store.getters['auth/twoFactor']"
          label="無効にする"
          :loading="loading"
          color="secondary"
          @click="disable"
        />
        <q-btn
          v-else
          label="有効にする"
          :loading="loading"
          color="accent"
          @click="enable"
        />
      </div>
    </q-card-section>

    <q-dialog v-model="twoFactorDialog" persistent>
      <q-card style="min-width: 200px">
        <q-card-section>
          <div class="text-h6">認証コード</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>QRコードをアプリからスキャンしてください</p>
          <span v-html="qrCode"></span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Recovery Codes</div>
          <div v-for="(code, i) in recoveryCodes" :key="i">
            {{ code }}
          </div>
        </q-card-section>

        <q-card-actions vertical>
            <q-btn color="secondary" label="閉じる" v-close-popup />
        </q-card-actions>

        <q-inner-loading :showing="codeLoading">
          <q-spinner size="md" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">パスワード確認</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            class="q-gutter-md"
            ref="form"
            @submit="confirm"
          >
            <q-input
              dense
              hide-bottom-space
              autofocus
              v-model="form.password"
              label="Password"
              type="password"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上にしてください'
              ]"
              :error="!!errors.password && errors.password.length>0"
              @keyup.enter="confirmDialog = false"
            >
              <template v-slot:error>
                <div v-for="(error, key) in errors.password" :key="key">
                  {{ error }}
                </div>
              </template>
            </q-input>

            <div align="right" class="q-gutter-md">
              <q-btn flat label="キャンセル" v-close-popup />
              <q-btn label="確認" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
export default {
  name: 'ProfileTwoFactorComponent',
  data () {
    return {
      loading: false,
      form: {
        password: ''
      },
      confirmDialog: false,
      twoFactorDialog: false,
      qrCode: null,
      recoveryCodes: [],
      codeLoading: false,
      errors: {}
    }
  },

  methods: {
    enable () {
      this.loading = true
      this.$api.post('user/two-factor-authentication')
        .then(() => {
          this.$api.get('user/two-factor-qr-code')
            .then(response => {
              this.qrCode = response.data.svg
              this.codeLoading = false
            })

          this.$api.get('user/two-factor-recovery-codes')
            .then(response => {
              this.recoveryCodes = response.data
            })

          this.codeLoading = true
          this.confirmDialog = false
          this.twoFactorDialog = true
          this.$store.commit('auth/SET_TWO_FACTOR', true)
        })
        .catch(error => {
          if (error.response.status === 423) {
            this.confirmDialog = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    disable () {
      this.loading = true
      this.$api.delete('user/two-factor-authentication')
        .then(() => {
          this.$store.commit('auth/SET_TWO_FACTOR', false)
          this.confirmDialog = false
        })
        .catch(error => {
          if (error.response.status === 423) {
            this.confirmDialog = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    confirm () {
      this.$api.post('user/confirm-password', this.form)
        .then(() => {
          if (this.$store.getters['auth/twoFactor']) {
            this.disable()
          } else {
            this.enable()
          }
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors
          }
        })
    }
  }
}
</script>
