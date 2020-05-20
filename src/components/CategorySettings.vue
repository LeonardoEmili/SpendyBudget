<template>
  <div>
    <!-- Create a new category stats here -->
    <h6 class="my-headers">{{$t('create_a_new_category')}}</h6>

    <b-form v-on:submit.prevent="createCategory" id="create-category-form">
      <div class="picker-cols">
        <p
          style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a"
        >{{$t('icon')}}:</p>
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
        <p
          style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a"
        >{{$t('color')}}:</p>
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

      <div id="input-category-name" style="position:relative">
        <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">{{$t('category_name')}}:</p>

        <b-form-input
          class="my-form-name"
          size="sm"
          type="text"
          v-on:update="uniqueCategory"
          v-model="newCategory.name"
          autocomplete="off"
          :placeholder="$t('new_category_name')"
        ></b-form-input>
        <span
          v-show="duplicateCategoryName"
          style="font-size: 12px; position: absolute; color: #b71c1c;"
        >Please select another name</span>
      </div>
      <div id="input-category-type" style="margin-top: -100px;">
        <p style="font-size:13px; margin-bottom: 3px; color: #546e7a; height: 20px;">{{$t('type')}}:</p>
        <b-form-select size="sm" v-model="newCategory.type" v-on:input="uniqueCategory">
          <b-form-select-option value="expense" selected>{{$t('expense')}}</b-form-select-option>
          <b-form-select-option value="income">{{$t('revenue')}}</b-form-select-option>
        </b-form-select>
      </div>
      <b-button
        id="create-btn"
        size="sm"
        :variant="btnVariant"
        :disabled="newCategory.name === '' || duplicateCategoryName"
        type="submit"
      >{{$t('create')}}</b-button>
    </b-form>
    <!-- Create a new category stats here -->

    <h6 class="my-headers">{{$t('revenue_categories')}}</h6>
    <draggable class="list-group" :list="incomeCategories" v-on:change="onChange">
      <!-- Category item starts here -->
      <div class="draggable-row" v-for="(element,index) in incomeCategories" :key="index">
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
          <!-- Transactions here
          <span class="category-transactions">{{ element.transactions }} transactions</span>
          -->
        </span>

        <span class="category-btns">
          <b-button
            id="settings-btn"
            class="category-icons"
            v-on:click="openEditCategory(index, 'income')"
            v-b-modal.modal-center
          >
            <settings-icon class="settings-icon"></settings-icon>
          </b-button>
          <b-button
            class="category-icons"
            v-on:click="removeCategory(index, 'income')"
            id="trash-btn"
          >
            <trash-icon class="trash-icon"></trash-icon>
          </b-button>
        </span>
      </div>
      <!-- Category item ends here -->
    </draggable>

    <!-- End of income categories and begin of expense -->

    <h6 class="my-headers" id="expense-header">{{$t('expense_categories')}}</h6>
    <draggable class="list-group" :list="expenseCategories" v-on:change="onChange">
      <!-- Category item starts here -->
      <div class="draggable-row" v-for="(element,index) in expenseCategories" :key="index">
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
          <!-- Transactions here
          <span class="category-transactions">{{ element.transactions }} transactions</span>
          -->
        </span>
        <span class="category-btns">
          <b-button
            id="settings-btn"
            class="category-icons"
            v-on:click="openEditCategory(index, 'expense')"
            v-b-modal.modal-center
          >
            <settings-icon class="settings-icon"></settings-icon>
          </b-button>
          <b-button
            class="category-icons"
            v-on:click="removeCategory(index, 'expense')"
            id="trash-btn"
          >
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
      :title="$t('edit_category')"
      size="lg"
      button-size="sm"
      :cancel-title="$t('cancel')"
      :ok-title="$t('done')"
      v-on:ok="confirmEditCategory"
    >
      <div id="modal-edit-category">
        <div class="picker-cols">
          <p
            style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a"
          >{{$t('icon')}}:</p>
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
          <p
            style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a"
          >{{$t('color')}}:</p>
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
          <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">{{$t('category_name')}}:</p>
          <b-form-input
            class="my-form-name"
            size="sm"
            type="text"
            v-model="currentCategory.name"
            :placeholder="$t('category_name')"
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
import { updateUserData } from "../plugins/firebase";

export default {
  name: "CategorySettings",
  created() {
    let vm = this;
    utils.fetchUserRevenueCategories(
      categories => (vm.incomeCategories = categories)
    );
    utils.fetchUserExpenseCategories(
      categories => (vm.expenseCategories = categories)
    );
  },
  data() {
    return {
      incomeCategories: [],
      expenseCategories: [],
      currentCategory: {},
      currentCategoryIndex: -1,
      currentCategoryType: "",
      duplicateCategoryName: false,
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
      return this.newCategory.icon || this.defaultCategoryIcons[0]; // || GENERIC_ICON;
    },
    newCategoryColor() {
      return this.newCategory.color || this.categoryColors[0];
    },
    categoryColors() {
      return utils.categoryColors;
    },
    btnVariant() {
      return this.newCategory.name && !this.duplicateCategoryName
        ? "success"
        : "";
    }
  },
  methods: {
    onChange() {
      updateUserData({
        revenueCategories: this.incomeCategories,
        expenseCategories: this.expenseCategories
      });
    },
    createCategory() {
      let createdCategory = {
        name: this.newCategory.name,
        icon: this.newCategoryIcon,
        color: this.newCategoryColor
      };

      if (this.newCategory.type === "income") {
        this.incomeCategories.push(createdCategory);
        updateUserData({ revenueCategories: this.incomeCategories });
      } else {
        this.expenseCategories.push(createdCategory);
        updateUserData({ expenseCategories: this.expenseCategories });
      }

      updateUserData({
        revenueCategories: this.incomeCategories,
        expenseCategories: this.expenseCategories
      });

      // Reset the name field
      this.newCategory.name = "";
    },
    openEditCategory(index, categoryType) {
      this.currentCategoryIndex = index;
      this.currentCategoryType = categoryType;
      if (categoryType === "income") {
        this.currentCategory = { ...this.incomeCategories[index] };
      } else {
        this.currentCategory = { ...this.expenseCategories[index] };
      }
    },
    confirmEditCategory() {
      let cat;
      if (this.currentCategoryType === "income") {
        cat = this.incomeCategories[this.currentCategoryIndex];
      } else {
        cat = this.expenseCategories[this.currentCategoryIndex];
      }
      cat.name = this.currentCategory.name;
      cat.color = this.currentCategory.color;
      cat.icon = this.currentCategory.icon;
      updateUserData({
        revenueCategories: this.incomeCategories,
        expenseCategories: this.expenseCategories
      });
    },
    removeCategory(index, categoryType) {
      if (categoryType === "income") {
        this.incomeCategories.splice(index, 1);
        updateUserData({ revenueCategories: this.incomeCategories });
      } else {
        this.expenseCategories.splice(index, 1);
        updateUserData({ expenseCategories: this.expenseCategories });
      }
    },
    uniqueCategory() {
      let categories =
        this.newCategory.type === "income"
          ? this.incomeCategories
          : this.expenseCategories;

      this.duplicateCategoryName = utils.uniqueCategory(
        this.newCategory.name,
        categories
      );
    }
  }
};
</script>

<style scoped>
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

.short-dropdown >>> .dropdown-menu {
  min-width: 0rem;
  max-height: 200px;
  overflow-y: auto;
}

#expense-header {
  margin-top: 30px;
}

.trash-icon {
  color: #ff3d00;
}
.trash-icon:hover {
  color: #9a2500;
}
.settings-icon {
  color: #43a047;
}
.settings-icon:hover {
  color: #255827;
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

.my-form-name {
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

#settings-btn {
  padding: 0px;
  background-color: transparent;
  border-color: transparent;
}

#trash-btn {
  padding: 0px;
  background-color: transparent;
  border-color: transparent;
  margin-left: 6px;
  height: 40px;
}

#create-btn {
  padding-left: 14px;
  padding-right: 14px;
  margin-bottom: 2px;
}

.b-dropdown >>> .btn-light {
  background-color: transparent !important;
  border-color: transparent;
}

select {
  height: 32px;
  margin-bottom: 2px;
  padding-left: 12px;
}
</style>