<template>
  <div class="tw-font-semibold tw-w-full tw-flex" :style="titleStyle"><div>{{form.title}}</div></div>
</template>

<script>

import { titleStyle} from 'src/helpers/formConfig'
export default {
  name: "AGFormHeader",
  props: ['form'],
  computed:{
    titleStyle(){
      return titleStyle(this?.form?.titleStyles)
    }
  }

}
</script>
