import { randomID } from 'src/helpers/random';
const newVariablePane = function (existing) {
  const refreshIconHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>   <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path> </svg>';
  const resetIconHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-back-up" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path> </svg>';
  const clearIconHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clear-all" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M8 6h12"></path>   <path d="M6 12h12"></path>   <path d="M4 18h12"></path> </svg>';
  return {
    displayShow: true,
    type: 'variablePane',
    show: true,
    formattingSettings: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderRadius: 1,
      borderThickness: 0,
      gapAround: 0.125,
      headerBackgroundColor: 'rgb(var(--color-white))',
      headerTextColor: 'rgb(var(--color-default))',
      shadow: 'none',
      showHeader: true,
    },
    additionalParams: {
      name: `Variables Row ${existing.length + 1}`,
      variableIDs: [],
      buttonName: 'Refresh',
      showRefreshButton: true,
      clearButtonName: 'Clear',
      resetButtonName: 'Reset',
      showClearButton: true,
      showResetButton: true,
      refreshButtonFormatting: {
        backgroundColor: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        borderThickness: 1,
        fontSize: 1,
        fontWeight: 'semibold',
        textColor: 'rgb(var(--color-white))',
        paddingX: 1,
        paddingY: 0.5,
        icon: refreshIconHTML,
        iconOnly: false,
      },
      clearButtonFormatting: {
        backgroundColor: 'rgb(var(--color-white))',
        borderColor: 'rgb(var(--color-tertiary))',
        borderThickness: 1,
        fontSize: 1,
        fontWeight: 'semibold',
        textColor: 'rgb(var(--color-default))',
        paddingX: 1,
        paddingY: 0.5,
        icon: clearIconHTML,
        iconOnly: false,
      },
      resetButtonFormatting: {
        backgroundColor: 'rgb(var(--color-tertiary))',
        borderColor: 'rgb(var(--color-tertiary))',
        borderThickness: 1,
        fontSize: 1,
        fontWeight: 'semibold',
        textColor: 'rgb(var(--color-default))',
        paddingX: 1,
        paddingY: 0.5,
        icon: resetIconHTML,
        iconOnly: false,
      },
    },
    widID: randomID(),
  };
};

export { newVariablePane };
