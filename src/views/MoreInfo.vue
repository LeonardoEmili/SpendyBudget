<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>
    </b-navbar>

    <div id="wrapper">
      <p id="title">
        More about
        <strong>you</strong>
      </p>

      <vue-croppie id="my-croppie" ref="croppieRef"></vue-croppie>

      <div v-show="finished">
        <div id="photo-wrapper">
          <div id="photo-avatar">
            <div class="middle">
              <xcircle-fill v-show="picture" id="clear-img"></xcircle-fill>
            </div>

            <b-button v-on:click="remove" v-show="picture" variant="light" id="user-img">
              <img
                ref="userImg"
                v-show="picture"
                width="180px"
                height="180px"
                :src="picture"
                class="rounded-circle cover-img"
              />
            </b-button>

            <!-- Force input to consider the same photo as different (for UX purposes) -->
            <input
              type="file"
              ref="file"
              accept="image/*"
              v-on:change="uploadImage"
              id="custom-input"
              :key="imgKey"
            />
            <b-button
              v-show="!picture"
              v-on:click="$refs.file.click()"
              variant="light"
              id="placeholder-img"
            >
              <b-col>
                <span>Click here to upload a photo</span>
                <div>
                  <upload-icon id="my-upload"></upload-icon>
                </div>
              </b-col>
            </b-button>
          </div>

          <b-button
            size="sm"
            type="submit"
            v-on:click="sendInfo"
            :variant="btnVariant"
            block
            id="proceed-btn"
          >{{btnName}}</b-button>
        </div>
      </div>

      <b-form v-on:submit.prevent="onSubmit" style="margin-top:40px;" v-show="!finished">
        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-form-group label="First name:" label-size="sm">
            <b-form-input
              size="sm"
              v-model="name"
              v-on:focus="keyboardOpen"
              v-on:blur="keyboardClosed"
              type="text"
              :state="error || errors[0] ? false : (valid ? true : null)"
              placeholder="Your name"
              required
            ></b-form-input>
            <b-form-invalid-feedback>{{ error || $t(errors[0]) }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-form-group label="Last name:" style="margin-top:12px" label-size="sm">
            <b-form-input
              size="sm"
              type="text"
              v-model="surname"
              v-on:focus="keyboardOpen"
              v-on:blur="keyboardClosed"
              :state="errors[0] ? false : (valid ? true : null)"
              placeholder="Your surname"
              required
            ></b-form-input>

            <b-form-invalid-feedback>{{ $t(errors[0]) }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <b-button
          :disabled="showProgress"
          size="sm"
          type="submit"
          :variant="variant"
          block
          id="next-btn"
        >Next</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import router from "../router";
import * as functions from "../plugins/firebase";
import { isMobileView, resizeImage } from "../utils";
import { app } from "../main";

export default {
  name: "MoreInfo",
  data() {
    return {
      imgKey: 0,
      finished: false,
      picture: null,
      name: "",
      surname: "",
      firebaseError: ""
    };
  },
  computed: {
    showProgress() {
      return app.showProgress;
    },
    btnVariant: function() {
      return this.picture ? "success" : "";
    },
    btnName: function() {
      return this.picture ? "Go to dashboard" : "Skip";
    },
    variant: function() {
      return this.name.length > 0 && this.surname.length > 0 ? "success" : "";
    },
    error: function() {
      // TODO: translate(firebaseError) into many languages
      return this.firebaseError;
    }
  },
  methods: {
    async sendInfo() {
      if (this.showProgress) {
        // Prevent sending a new request while the previous is still being processed
        return;
      }

      app.showProgress = true;
      const data = {
        name: this.name,
        surname: this.surname,
        profPic: this.picture
      };
      await functions.updateUserData(data, () => {
        app.showProgress = false;
        router.replace("/dashboard").catch(() => {});
      });
    },
    remove() {
      this.picture = null;
      this.imgKey += 1;
    },
    keyboardOpen() {
      if (isMobileView()) {
        this.$parent.$refs.footer.classList.add("when-keyboard");
      }
    },
    keyboardClosed() {
      if (isMobileView()) {
        this.$parent.$refs.footer.classList.remove("when-keyboard");
      }
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const croppie = this.$refs.croppieRef;
      resizeImage(file, croppie, result => {
        this.picture = result;
      });
    },
    onSubmit() {
      this.finished = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
}
.dropzone-custom-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.dropzone-custom-title {
  margin-top: 0;
  color: #00b782;
}

.subtitle {
  color: #314b5f;
}
#user-img {
  height: 180px;
  width: 180px;
  position: absolute;
  left: 110px;
  text-align: center;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  border-color: grey;
}

#user-img:hover {
  opacity: 0.3;
  transition: 0.5s ease;
}

#user-img:not(:hover) {
  opacity: 1;
  transition: 0.5s ease;
}

#my-croppie {
  opacity: 0;
  width: 0px;
  height: 0px;
}

#wrapper {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15vh;
}

#title {
  font-size: 32px;
  text-align: center;
}

#spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}

#photo-wrapper {
  text-align: center;
  margin-top: 40px;
}

#clear-img {
  margin: 65px;
  width: 50px;
  height: 50px;
  color: grey;
}

.middle {
  height: 180px;
  width: 180px;
  position: absolute;
  left: 110px;
  text-align: center;
}

#photo-avatar {
  width: auto;
  height: 180px;
  position: relative;
}

.cover-img {
  object-fit: cover;
}

#placeholder-img {
  height: 180px;
  width: 180px;
  position: absolute;
  left: 110px;
  text-align: center;
  opacity: 1;
  border-radius: 50%;
  padding: 20px;
  border-color: grey;
  border-style: dashed;
  border-width: thin;
}

#my-upload {
  width: 40px;
  height: 40px;
  margin-top: 14px;
  color: grey;
}

#next-btn {
  margin-top: 40px;
  margin-bottom: 30px;
}

#proceed-btn {
  margin-top: 50px;
}

#custom-input {
  display: none;
}
</style>