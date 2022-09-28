<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5" v-if="!user">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">ログイン</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form
            class="q-gutter-md"
            @submit.prevent.stop="onSubmit"
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
              label="Password"
              type="password"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" />
              </template>
            </q-input>

            <q-checkbox v-model="remember" label="ログイン状態を保持" />

            <div>
              <q-btn
                class="full-width"
                label="ログイン"
                :loading="loading"
                type="submit"
                color="primary"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <div class="q-py-md">
        <q-btn flat label="パスワード再発行" to="/password/remind" icon="o_lock" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { Credentials } from 'components/models'
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const $router = useRouter()

    const loading = ref(false)
    const remember = ref(false)
    const credentials = ref<Credentials>({
      email: '',
      password: '',
      remember: false
    });

    const user = computed(() => {
      return $store.getters['auth/user']
    })

    function onSubmit() {
      loading.value = true

      if (remember.value) {
        credentials.value.remember = true
      }

      $store.dispatch('auth/login', credentials.value)
        .then(async () => {
          if (!$store.getters['auth/isAuth']) {
            if ($store.getters['auth/twoFactor']) {
              $router.push({ name: 'twofactor' })
              return
            }
          }

          await $router.push({ name: 'home' })
          $q.notify({ type: 'positive', message: 'ログインに成功しました' })
        })
        .catch(() => {
          $q.notify({ type: 'negative', message: 'ログインに失敗しました' })
          loading.value = false
        })
    }

    return {
      loading,
      user,
      remember,
      credentials,
      onSubmit
    }
  }
})
</script>
