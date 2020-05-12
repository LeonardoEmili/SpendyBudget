<template>
  <div>
    <p style="font-size:14px;">TODO: Add content here ...</p>

    <svgicon icon="necktie" width="40" height="40" color="#fff" style="background-color: #3949ab;" id="ajeje" /><span style="font-size:15px;">Business</span><br><br>
    <svgicon icon="coinup" width="40" height="40" color="#fff" style="background-color: #ff9800;" id="ajeje" /><span style="font-size:15px;">Extra income</span><br><br>
    <svgicon icon="bgift" width="40" height="40" color="#fff" style="background-color: #9575cd;" id="ajeje" /><span style="font-size:15px;">Gifts</span><br><br>
    <svgicon icon="salary2" width="40" height="40" color="#fff" style="background-color: #00acc1;" id="ajeje" /><span style="font-size:15px;">Salary</span><br><br>
    <svgicon icon="gaming" width="40" height="40" color="#fff" style="background-color: #ec407a;" id="ajeje" /><span style="font-size:15px;">Entertainment</span><br><br>
    <svgicon icon="smartwatch" width="40" height="40" color="#fff" style="background-color: #66bb6a;" id="ajeje" /><span style="font-size:15px;">Sport</span><br><br>
    <svgicon icon="tax" width="40" height="40" color="#fff" style="background-color: #fdd835;" id="ajeje" /><span style="font-size:15px;">Taxes</span><br><br>

  </div>
</template>

<script>
import "../compiled-icons/";

export default {
  name: "CategorySettings",
  created() {},
  data() {
    return {
      categories: []
    };
  },
  computed: {},
  methods: {}
};
</script>

<style>
#ajeje {
  border-radius: 100%;
  
  padding: 6px;
  margin-right: 10px;
}
</style>