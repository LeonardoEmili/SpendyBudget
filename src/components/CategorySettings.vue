<template>
  <div>
    <h6 class="my-headers">Create a new category</h6>

    <b-form v-on:submit.prevent="createCategory">
      <div style="margin-top: 30px; margin-bottom: 40px;">
        <div style="display: inline-block">
          <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Icon:</p>
          <b-dropdown class="lang-dropdown" variant="light">
            <template v-slot:button-content>
              <svgicon
                :icon="selectedIcon"
                width="26"
                height="26"
                color="#fff"
                :style="'background-color:' + selectedColor"
                id="ajeja"
              />
            </template>
            <b-dropdown-item v-for="icon in icons" :key="icon" style="margin-left: -25px;">
              <svgicon
                :icon="icon"
                width="30"
                height="30"
                color="#fff"
                :style="'background-color:' + selectedColor"
                id="ajeja"
                v-on:click="pickerIcon=icon"
              />
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div style="display: inline-block">
          <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Color:</p>
          <b-dropdown class="lang-dropdown" variant="light">
            <template v-slot:button-content>
              <svgicon icon="circle" width="26" height="26" :color="selectedColor" id="ajeja" />
            </template>
            <b-dropdown-item
              v-for="color in colors"
              :key="color"
              style="margin-left: -25px;"
              v-on:click="pickerColor=color"
            >
              <svgicon icon="circle" width="30" height="30" :color="color" id="ajeja" />
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div style="margin-left: 10px; display: inline-block;">
          <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">Color:</p>
          <b-form-input
            style="margin-top: 3px;"
            size="sm"
            type="text"
            v-model="newCategory"
            placeholder="New category name"
          ></b-form-input>
        </div>
        <div style="margin-left: 10px; margin-right: 20px; display: inline-block;">
          <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">Type:</p>
          <b-form-select size="sm" style="margin-top: 3px;" v-model="categoryType">
            <b-form-select-option value="expense" selected>Expense</b-form-select-option>
            <b-form-select-option value="income">Income</b-form-select-option>
          </b-form-select>
        </div>
        <b-button
          size="sm"
          :variant="btnVariant"
          :disabled="newCategory === ''"
          type="submit"
        >Create new</b-button>
      </div>
    </b-form>

    <h6 class="my-headers">Income categories</h6>
    <b-overlay :show="show" rounded="sm">
      <draggable
        :list="incomeCategories"
        class="list-group"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          style="height: 40px; margin: 2px 0; width: 100%; position: relative;"
          class="draggable-row"
          v-for="(element,index) in incomeCategories"
          :key="element.id"
        >
          <svgicon
            :icon="element.icon"
            width="32"
            height="32"
            color="#fff"
            :style="'background-color:' + element.color"
            id="ajeje"
          />

          <span style="font-size: 15px; line-height: 40px; vertical-align: middle;">
            <span>{{ element.name }}</span>
            <span style="position: absolute; left: 300px;">{{ element.transactions }} transactions</span>
          </span>
          <span style="position: absolute; right: 0;  line-height: 40px; vertical-align: middle; ">
            <b-button
              style="padding: 0px; background-color: transparent; border-color: transparent;"
              v-on:click="openSettings(index)"
            >
              <settings-icon style="color: #43a047;"></settings-icon>
            </b-button>
            <b-button
              v-on:click="deleteCategory(index)"
              style="padding: 0px;background-color: transparent; border-color: transparent; margin-left: 6px; height: 40px"
            >
              <trash-icon style="color: #ff3d00;"></trash-icon>
            </b-button>
          </span>
        </div>
      </draggable>
      <template v-slot:overlay>
        <div style="width: 600px; margin-left: 40px;">
          <div style="display: inline-block">
            <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Icon:</p>
            <b-dropdown class="lang-dropdown" variant="light">
              <template v-slot:button-content>
                <svgicon
                  :icon="settings.iconPicker"
                  width="30"
                  height="30"
                  color="#fff"
                  :style="'background-color:' + settings.colorPicker"
                  id="ajeja"
                />
              </template>
              <b-dropdown-item v-for="icon in icons" :key="icon" style="margin-left: -25px;">
                <svgicon
                  :icon="icon"
                  width="30"
                  height="30"
                  color="#fff"
                  :style="'background-color:' + settings.colorPicker"
                  id="ajeja"
                  v-on:click="settings.iconPicker=icon"
                />
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <div style="display: inline-block">
            <p style="font-size:13px; margin-bottom: 0px; margin-left: 12px; color: #546e7a">Color:</p>
            <b-dropdown class="lang-dropdown" variant="light">
              <template v-slot:button-content>
                <svgicon
                  icon="circle"
                  width="26"
                  height="26"
                  :color="settings.colorPicker"
                  id="ajeja"
                />
              </template>
              <b-dropdown-item
                v-for="color in colors"
                :key="color"
                style="margin-left: -25px;"
                v-on:click="settings.colorPicker=color"
              >
                <svgicon icon="circle" width="30" height="30" :color="color" id="ajeja" />
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <div style="margin-left: 10px; display: inline-block;">
            <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">Color:</p>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                style="margin-top: 3px;"
                size="sm"
                type="text"
                v-model="settings.name"
                placeholder="Category name"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div style="margin-left: 10px; margin-right: 20px; display: inline-block;">
            <p style="font-size:13px; margin-bottom: 0px; color: #546e7a">Type:</p>
            <b-form-select size="sm" style="margin-top: 3px;" v-model="settings.categoryType">
              <b-form-select-option value="expense" selected>Expense</b-form-select-option>
              <b-form-select-option value="income">Income</b-form-select-option>
            </b-form-select>
          </div>
          <b-button size="sm" variant="success" v-on:click="editCategory">Edit category</b-button>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import "../compiled-icons/";
import draggable from "vuedraggable";

let icons = [
  "necktie",
  "coinup",
  "bgift",
  "salary2",
  "gaming",
  "smartwatch",
  "tax"
];

let colors = [
  "#3949ab",
  "#ff9800",
  "#9575cd",
  "#00acc1",
  "#ec407a",
  "#66bb6a",
  "#fdd835"
];

let inputIncomeCategories = [
  {
    name: "Business",
    id: 0,
    icon: icons[0],
    color: colors[0],
    transactions: 5
  },
  {
    name: "Extra credit",
    id: 1,
    icon: icons[1],
    color: colors[1],
    transactions: 3
  },
  {
    name: "Gifts",
    id: 2,
    icon: icons[2],
    color: colors[2],
    transactions: 2
  },
  {
    name: "Salary",
    id: 3,
    icon: icons[3],
    color: colors[3],
    transactions: 1
  },
  {
    name: "Entertainment",
    id: 4,
    icon: icons[4],
    color: colors[4],
    transactions: 0
  },
  {
    name: "Sport",
    id: 5,
    icon: icons[5],
    color: colors[5],
    transactions: 3
  },
  {
    name: "Taxes",
    id: 6,
    icon: icons[6],
    color: colors[6],
    transactions: 4
  }
];

export default {
  name: "CategorySettings",
  created() {},
  data() {
    return {
      categoryType: "income",
      show: false,

      newCategory: "",
      pickerIcon: "",
      pickerColor: "",
      settings: {
        incomeCategory: -1,
        expenseCategory: -1,
        colorPicker: "",
        iconPicker: "",
        categoryType: "income",
        name: ""
      },

      categories: [],
      dragging: false,
      draggableKey: 0
    };
  },
  components: {
    draggable
  },

  computed: {
    incomeCategories() {
      return inputIncomeCategories;
    },
    icons() {
      return icons;
    },
    colors() {
      return colors;
    },
    btnVariant: function() {
      return this.newCategory ? "success" : "";
    },
    selectedIcon() {
      return this.pickerIcon || icons[0];
    },
    selectedColor() {
      return this.pickerColor || colors[0];
    },
    incomeSettingsCategory() {
      return this.incomeCategories[this.settings.incomeCategory] || {};
    }
  },
  methods: {
    log(e) {
      console.log(e);
    },
    deleteCategory(index) {
      console.log("Deleting element " + index);

      this.incomeCategories.splice(index, 1);
      //this.show = true;
      //this.show = false;
    },
    editCategory() {
      console.log(this.settings.incomeCategory);
      this.incomeSettingsCategory.color = this.settings.colorPicker;
      this.incomeSettingsCategory.icon = this.settings.iconPicker;
      this.incomeSettingsCategory.name = this.settings.name;
      this.show = false;
    },
    createCategory() {
      let maxCallback = (max, cur) => Math.max(max, cur);
      let initValue = -1;
      let nextID =
        this.incomeCategories.map(x => x.id).reduce(maxCallback, initValue) + 1;
      this.incomeCategories.push({
        id: nextID,
        name: this.newCategory,
        icon: this.selectedIcon,
        color: this.selectedColor,
        transactions: 17
      });
      this.newCategory = "";
    },
    openSettings(index) {
      this.settings.incomeCategory = index;
      this.settings.colorPicker = this.incomeSettingsCategory.color;
      this.settings.iconPicker = this.incomeSettingsCategory.icon;
      this.settings.name = this.incomeSettingsCategory.name;

      this.show = true;
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    }
  }
};
</script>

<style >
.draggable-row:hover {
  background-color: #e0e0e0;
  cursor: grab;
}

.lang-dropdown .dropdown-menu {
  min-width: 0rem;
  max-height: 200px;
  overflow-y: auto;
}

#ajeje {
  border-radius: 100%;
  padding: 6px;
  margin-right: 10px;
}

#ajeja {
  border-radius: 100%;
  padding: 4px;
  margin-right: 0px;
}
</style>