<template>
  <div class="home">
    <SearchForm></SearchForm>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SearchForm from '@/components/SearchForm.vue';

@Options({
  components: {
    SearchForm,
  },
})
export default class HomeView extends Vue {}
</script>
