<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>
    </b-navbar>

    <div style="width: 400px; margin-left: auto; margin-right: auto; margin-top: 15vh;">
      <p style="font-size:32px; text-align:center;">
        More about
        <strong>you</strong>
      </p>

      <b-spinner
        variant="primary"
        label="Spinning"
        v-show="isLoading"
        style="position: absolute; top:50%; left:50%;"
      ></b-spinner>

      <div v-show="finished">
        <div id="photo-wrapper" style="text-align: center; margin-top: 40px;">
          <div style="width: auto; height: 180px; position: relative;">
            <div
              class="middle"
              style="height: 180px; width: 180px; position: absolute; left: 110px; text-align: center;"
            >
              <xcircle-fill
                v-show="picture"
                style="margin: 65px; width: 50px; height: 50px; color: grey;"
              ></xcircle-fill>
            </div>

            <b-button
              v-on:click="remove"
              v-show="picture"
              :style="borderStyle"
              variant="light"
              id="user-img"
              style="height: 180px; width: 180px; position: absolute; left: 110px; text-align: center; border-radius: 50%; padding: 0; margin: 0; border-color:grey;"
            >
              <img
                ref="userImg"
                v-show="picture"
                width="180px"
                height="180px"
                :src="picture"
                class="rounded-circle"
                style="object-fit:cover;"
              />
            </b-button>

            <input type="file" ref="file" v-on:change="uploadImage" id="custom-input" :key="imgKey" />

            <b-button
              v-show="!picture"
              :style="borderStyle"
              v-on:click="$refs.file.click()"
              variant="light"
              style="height: 180px; width: 180px; position: absolute; left: 110px; text-align: center; opacity: 1; border-radius: 50%; padding:20px; border-color:grey;"
            >
              <b-col>
                <span style="color:black;">Click here to upload a photo</span>
                <div>
                  <upload-icon style="width:40px; height: 40px; margin-top:14px; color:grey;"></upload-icon>
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
            style="margin-top:50px;"
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
              :state="errors[0] || error ? false : (valid ? true : null)"
              placeholder="Your name"
              required
            ></b-form-input>
            <b-form-invalid-feedback>{{ error || errors[0] }}</b-form-invalid-feedback>
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

            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <b-button
          size="sm"
          type="submit"
          :variant="variant"
          block
          style="margin-top:40px; margin-bottom: 30px"
        >Next</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
//import router from "../router";
import * as functions from "../plugins/firebase";
import { isMobileView } from "../utils";

export default {
  name: "MoreInfo",
  data() {
    return {
      borderStyle: {
        color: "blue",
        borderStyle: "dashed",
        borderWidth: "thin"
      },
      imgKey: 0,
      finished: false,
      picture: null,
      name: "",
      surname: "",
      firebaseError: "",
      isLoading: false
    };
  },
  computed: {
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
    sendInfo() {
      //console.log(this.picture);
      console.log("Sending user data ... ");
      const data = {
        name: this.name,
        surname: this.surname,
        profPic: this.$picture
      };
      functions.updateUserData(data, res => console.log(res));
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
      if (!file.type.match(/image.*/)) {
        alert("Nice try!");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        var canvas = document.createElement("canvas");

        var ctx = canvas.getContext("2d");
        
        ctx.drawImage(e.target.result, 10, 10);

        //this.picture = e.target.result;
        //functions.uploadProfilePhoto(this.picture);
      };
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
#user-img:hover {
  opacity: 0.3;
  transition: 0.5s ease;
}

#user-img:not(:hover) {
  opacity: 1;
  transition: 0.5s ease;
}
</style>