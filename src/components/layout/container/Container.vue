<template>
  <div class="container">
    <div id="sticker">
      <div id="stickerCon">
        <slot></slot>
      </div>
    </div>
    <div id="footer" style="padding-top: 20px; padding-bottom: 20px;">@copyright by Route-Tech</div>
  </div>
</template>

<script>
export default {
  name: 'container',
  data () {
    return {};
  }
};

</script>
