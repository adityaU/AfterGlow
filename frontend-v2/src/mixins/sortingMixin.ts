const SortingMixin = {
   methods: {
                getDisplayValues(sorting) {
                    if (sorting.raw){
                        return [[sorting.value, 2]].filter((item) => item[0] != null)
                    }

                        return [[sorting.column, 0], [sorting.direction, 1]].filter((item) => item[0] != null)

                },
     
   }

}

export {SortingMixin}
