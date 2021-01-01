<template>
  <div>
    <uploadBackEnd></uploadBackEnd>

    <hr>

    <uploadOss></uploadOss>
    <hr>
    <test></test>
  </div>
</template>
<script>
import uploadBackEnd from './uploadBackEnd.vue'
import uploadOss from './uploadOss.vue'
import test from './test.vue'

export default {
  name: 'uploadDemo',
  data: function() {
    return {}
  },

  components: {
    uploadBackEnd,
    uploadOss,
    test
  }
}
</script>

