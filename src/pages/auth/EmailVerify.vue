<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">メール認証</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          登録したメールアドレスに認証URLを送信しています。<br />
          届いたリンクからアカウント登録を完了させてください。
        </q-card-section>

        <q-separator />

        <q-card-section>
          リンクが届かない場合は認証メールを再送信してください。<br />
          <q-btn
            flat
            color="primary"
            label="認証メールを再送信する"
            :loading="loading"
            icon="mail_outline"
            @click="verifySend"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'EmailVerifyPage',
  data () {
    return {
      loading: false
    }
  },

  methods: {
    verifySend () {
      this.loading = true

      this.$api.post('email/verification-notification')
        .then(() => {
          this.$q.notify({ type: 'positive', message: '認証用URLを送信しました' })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
