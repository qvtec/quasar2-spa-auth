<template>
  <q-layout view="lHh lpR lFf">
    <q-header reveal>
      <q-toolbar>
        <q-btn v-if="isAuth" dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-btn flat size="lg" no-caps :to="{ name: isAuth?'home':'top' }">
            <div>HOME APP</div>
          </q-btn>
        </q-toolbar-title>

        <q-separator v-if="!isAuth" dark vertical />
        <q-btn v-if="!isAuth" stretch flat type="a" :to="{ name: 'login' }" label="ログイン" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="isAuth" show-if-above v-model="left" side="left" content-class="bg-grey-3" bordered>
      <q-list>
        <q-item v-if="user" :to="{ name: 'profile' }">
          <q-item-section avatar>
            <q-avatar v-if="user.photo">
              <q-img :src="user.photo" />
            </q-avatar>
            <q-avatar v-else color="secondary" text-color="white" icon="accessibility_new" />
          </q-item-section>
          <q-item-section>
            {{ user.name }}
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable @click="logout()" >
          <q-item-section avatar>
            <q-avatar color="secondary" text-color="white" icon="exit_to_app" />
          </q-item-section>
          <q-item-section>
            ログアウト
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRouter } from 'vue-router'
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const $store = useStore()
    const $router = useRouter()

    const left = ref(false)

    const user = computed(() => {
      return $store.getters['auth/user']
    })

    const isAuth = computed(() => {
      return $store.getters['auth/isAuth']
    })

    async function logout () {
      await $router.push({ name: 'login' })
      await $store.dispatch('auth/logout')
    }

    return {
      left,
      user,
      isAuth,
      logout
    }
  }
})
</script>
