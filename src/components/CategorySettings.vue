<template>
  <div>
    <!-- Create a new category stats here -->
    <h6 class="my-headers">Create a new category</h6>

    <b-form v-on:submit.prevent="createCategory" id="create-category-form">
      <div class="picker-cols">
        <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Icon:</p>
        <b-dropdown class="short-dropdown" variant="light">
          <template v-slot:button-content>
            <svgicon
              :icon="newCategoryIcon"
              width="26"
              height="26"
              color="#fff"
              :style="'background-color:' + newCategoryColor"
              class="header-icon"
            />
          </template>
          <b-dropdown-item v-for="icon in defaultCategoryIcons" :key="icon" class="my-dropdown">
            <svgicon
              :icon="icon"
              width="30"
              height="30"
              color="#fff"
              :style="'background-color:' + newCategoryColor"
              class="header-icon"
              v-on:click="newCategory.icon=icon"
            />
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="picker-cols">
        <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Color:</p>
        <b-dropdown class="short-dropdown" variant="light">
          <template v-slot:button-content>
            <svgicon
              icon="circle"
              width="26"
              height="26"
              :color="newCategoryColor"
              class="header-icon"
            />
          </template>
          <b-dropdown-item
            v-for="color in categoryColors"
            :key="color"
            class="my-dropdown"
            v-on:click="newCategory.color=color"
          >
            <svgicon icon="circle" width="30" height="30" :color="color" class="header-icon" />
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div id="input-category-name">
        <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">New category name:</p>
        <b-form-input
          id="my-form-name"
          size="sm"
          type="text"
          v-model="newCategory.name"
          placeholder="New category name"
        ></b-form-input>
      </div>
      <div id="input-category-type">
        <p style="font-size:13px; margin-bottom: 3px; color: #546e7a;">Type:</p>
        <b-form-select size="sm" style v-model="newCategory.type">
          <b-form-select-option value="expense" selected>Expense</b-form-select-option>
          <b-form-select-option value="income">Income</b-form-select-option>
        </b-form-select>
      </div>
      <b-button
        size="sm"
        :variant="btnVariant"
        :disabled="newCategory.name === ''"
        type="submit"
      >Create new</b-button>
    </b-form>
    <!-- Create a new category stats here -->

    <h6 class="my-headers">Income categories</h6>
    <draggable class="list-group">
      <!-- Category item starts here -->
      <div class="draggable-row" v-for="(element,index) in incomeCategories" :key="element.id">
        <svgicon
          :icon="element.icon"
          width="32"
          height="32"
          color="#fff"
          class="category-icon"
          :style="'background-color:' + element.color"
        />

        <span class="category-details">
          <span>{{ element.name }}</span>
          <span class="category-transactions">{{ element.transactions }} transactions</span>
        </span>
        <span class="category-btns">
          <b-button
            class="category-icons"
            v-on:click="openEditCategory(index)"
            v-b-modal.modal-center
          >
            <settings-icon class="settings-icon"></settings-icon>
          </b-button>
          <b-button class="category-icons" v-on:click="removeCategory(index)">
            <trash-icon class="trash-icon"></trash-icon>
          </b-button>
        </span>
      </div>
      <!-- Category item ends here -->
    </draggable>

    <!-- Modal view starts here -->
    <b-modal
      centered
      id="modal-center"
      title="Edit Category"
      size="lg"
      button-size="sm"
      ok-title="Done"
      v-on:ok="confirmEditCategory"
    >
      <div id="modal-edit-category">
        <div class="picker-cols">
          <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Icon:</p>
          <b-dropdown class="short-dropdown" variant="light">
            <template v-slot:button-content>
              <svgicon
                :icon="currentCategory.icon"
                width="26"
                height="26"
                color="#fff"
                :style="'background-color:' + currentCategory.color"
                class="header-icon"
              />
            </template>
            <b-dropdown-item v-for="icon in defaultCategoryIcons" :key="icon">
              <svgicon
                :icon="icon"
                width="30"
                height="30"
                color="#fff"
                :style="'background-color:' + currentCategory.color"
                class="header-icon"
                v-on:click="currentCategory.icon=icon"
              />
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="picker-cols">
          <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Color:</p>
          <b-dropdown class="short-dropdown" variant="light">
            <template v-slot:button-content>
              <svgicon
                icon="circle"
                width="26"
                height="26"
                :color="currentCategory.color"
                class="header-icon"
              />
            </template>
            <b-dropdown-item
              v-for="color in categoryColors"
              :key="color"
              v-on:click="currentCategory.color=color"
            >
              <svgicon icon="circle" width="30" height="30" :color="color" class="header-icon" />
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <div id="input-category-name">
          <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">Category name:</p>
          <b-form-input
            id="my-form-name"
            size="sm"
            type="text"
            v-model="currentCategory.name"
            placeholder="Category name"
          ></b-form-input>
        </div>

      </div>
    </b-modal>
    <!-- Modal view ends here -->
  </div>
</template>

<script>
import "../compiled-icons/";
import draggable from "vuedraggable";
import * as utils from "../utils";

export default {
  name: "CategorySettings",
  created() {
    this.incomeCategories = utils.userIncomeCategories.slice();
  },
  data() {
    return {
      incomeCategories: [],
      currentCategory: {},
      currentCategoryIndex: -1,
      newCategory: {
        icon: "",
        color: "",
        name: "",
        type: "income"
      }
    };
  },
  components: {
    draggable
  },

  computed: {
    defaultCategoryIcons() {
      return utils.defaultCategoryIcons;
    },
    newCategoryIcon() {
      return this.newCategory.icon || this.incomeCategories[0].icon; // || GENERIC_ICON;
    },
    newCategoryColor() {
      return this.newCategory.color || this.incomeCategories[0].color;
    },
    categoryColors() {
      return utils.categoryColors;
    },
    btnVariant: function() {
      return this.newCategory.name ? "success" : "";
    }
  },
  methods: {
    createCategory() {
      const nextID = this.getNextID();

      this.incomeCategories.push({
        id: nextID,
        name: this.newCategory.name,
        icon: this.newCategoryIcon,
        color: this.newCategoryColor,
        transactions: 17
      });
      this.newCategory.name = "";
      console.log(this.newCategory);
    },
    openEditCategory(index) {
      this.currentCategoryIndex = index;
      this.currentCategory = { ...this.incomeCategories[index] };
    },
    confirmEditCategory() {
      let cat = this.incomeCategories[this.currentCategoryIndex];
      cat.name = this.currentCategory.name;
      cat.color = this.currentCategory.color;
      cat.icon = this.currentCategory.icon;
    },
    removeCategory(index) {
      this.incomeCategories.splice(index, 1);
    },
    getNextID() {
      const maxCallback = (max, cur) => Math.max(max, cur);
      let initValue = -1;
      let maxID = this.incomeCategories
        .map(x => x.id)
        .reduce(maxCallback, initValue);
      return maxID + 1;
    }
  }
};
</script>

<style>
.draggable-row {
  height: 40px;
  margin: 2px 0;
  width: 100%;
  position: relative;
}

.draggable-row:hover {
  background-color: #e0e0e0;
  cursor: grab;
}

.category-icon {
  border-radius: 100%;
  padding: 6px;
  margin-right: 10px;
}

.category-details {
  font-size: 15px;
  line-height: 40px;
  vertical-align: middle;
}

.category-transactions {
  position: absolute;
  left: 300px;
}

.category-btns {
  position: absolute;
  right: 0;
  line-height: 40px;
  vertical-align: middle;
}

.category-icons {
  padding: 0px;
  background-color: transparent;
  border-color: transparent;
  margin-left: 4px;
}

#create-category-form {
  margin-top: 30px;
  margin-bottom: 40px;
}

.picker-cols {
  display: inline-block;
}

.short-dropdown .dropdown-menu {
  min-width: 0rem;
  max-height: 200px;
  overflow-y: auto;
}

.icon-label {
  font-size: 13px;
  margin: 0 0 0 12px;
  color: #546e7a;
}

.header-icon {
  border-radius: 100%;
  padding: 4px;
  margin-right: 0px;
}

.my-dropdown {
  margin-left: -25px;
}

#input-category-name {
  margin-left: 10px;
  display: inline-block;
}

#my-form-name {
  margin-top: 3px;
}

#input-category-type {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
}

#modal-edit-category {
  margin: auto;
  max-width: 360px;
}
</style>