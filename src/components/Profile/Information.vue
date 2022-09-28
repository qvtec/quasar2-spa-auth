<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">プロフィール</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="path!=null">
        <q-avatar size="100px">
          <q-img :src="path" />
        </q-avatar>
        <div align="center" class="q-pt-sm" style="width:100px">
          <q-btn label="削除" @click="deletePhoto" />
        </div>
      </div>
      <div v-else>
        <q-avatar v-if="uploadImage!=null" size="100px">
          <q-img :src="uploadImage" />
        </q-avatar>
        <q-avatar v-else icon="face" color="secondary" text-color="white" size="100px" font-size="80px" />
        <q-file
          :model-value="form.photo"
          @update:model-value="updateFiles"
          label="写真"
          clearable
          dense
          style="max-width: 300px"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
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
          v-model="form.name"
          label="Name"
          type="name"
          lazy-rules
          :rules="[val => !!val || '入力してください']"
        >
          <template v-slot:prepend>
            <q-icon name="account_circle" />
          </template>
        </q-input>

        <q-input
          outlined
          hide-bottom-space
          v-model="form.email"
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
            label="更新"
            :loading="loading"
            type="submit"
            color="secondary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import loadImage from 'blueimp-load-image'

export default {
  name: 'ProfileInformationComponent',
  data () {
    return {
      loading: false,
      form: {
        photo: null,
        name: '',
        email: ''
      },
      uploadImage: null,
      path: null,
      errors: {}
    }
  },

  mounted () {
    const user = this.$store.getters['auth/user']
    this.form.name = user.name
    this.form.email = user.email
    this.path = user.photo
  },

  methods: {
    submit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true

        this.$api.put('user/profile-information', this.form)
          .then(() => {
            this.$store.dispatch('auth/user')
            this.$q.notify({ type: 'positive', message: '更新完了しました' })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    async deletePhoto () {
      await this.$api.delete('user/profile-photo')
      await this.$store.dispatch('auth/user')
      this.path = null
    },

    updateFiles (file) {
      this.uploadImage = null
      if (!file) return

      loadImage.parseMetaData(file, (data) => {
        const options = {
          maxHeight: 1920,
          maxWidth: 1920,
          canvas: true
        }

        if (data.exif) {
          options.orientation = data.exif.get('Orientation')
        }

        this.displayImage(file, options)
      })
    },

    displayImage (file, options) {
      loadImage(file,
        async (canvas) => {
          const data = canvas.toDataURL(file.type)
          const blob = this.base64ToBlob(data, file.type)
          const url = window.URL.createObjectURL(blob)
          this.uploadImage = url
          this.savePhoto(blob)
        },
        options
      )
    },

    savePhoto (blob) {
      const fd = new FormData()
      fd.append('photo', blob)
      fd.append('name', this.form.name)
      fd.append('email', this.form.email)

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      config.headers['X-HTTP-Method-Override'] = 'PUT'

      this.$api.post('user/profile-information', fd, config)
        .then(() => {
          this.$store.dispatch('auth/user')
          this.$q.notify({ type: 'positive', message: '更新完了しました' })
        })
        .finally(() => {
          this.loading = false
        })
    },

    base64ToBlob (base64, fileType) {
      const bin = atob(base64.replace(/^.*,/, ''))
      const buffer = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      return new Blob([buffer.buffer], {
        type: fileType != null ? fileType : 'image/png'
      })
    }
  }
}
</script>
