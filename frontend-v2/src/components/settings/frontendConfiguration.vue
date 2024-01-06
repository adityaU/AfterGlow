<template>
  <div class="tw-w-full">
    <div class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-border">
      <div class="label tw-mt-2 tw-px-4 tw-pt-4">
        Maximum Number of Rows on frontend
      </div>
      <AGInput v-model:value="frontendLimitSettings.value" v-if="frontendLimitSettings"
        placeholder="How many rows can members see on frontend ?" type="number" debounce="300" class="tw-px-4" />
      <div class="note tw-px-4 tw-pb-4">
        Limit more than 2000 is ignored. This limit overrides Global Limit for
        frontend.
      </div>
      <div class="tw-font-semibold tw-text-lg tw-border-t tw-mt-2 tw-px-4 tw-pt-4">
        Theme
      </div>

      <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns">
        <div class="label">Theme Name</div>
        <Multiselect class="tw-w-[500px]" :classes="multiselectCss" v-model="themeName"
          placeholder="Search a visualization" :filter-results="false" :min-chars="1" :resolve-on-load="false" :delay="0"
          :searchable="false" :options="themeNames" />
      </div>
      <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 item-3070-columns"
        :class="themeName == 'Custom' ? 'tw-pb-2' : 'tw-pb-4'">
        <div class="label">Primary Color</div>
        <div>
          <AGColorSelector allow-more="false" :additional-colors="additionalBackgroundColors" class="tw-w-[24px]"
            :selected-color="rgbToHex(themePrimaryColor.value)" naked="true"
            @update:value="(color) => (themePrimaryColor.value = hexToRGB(color))" v-if="themePrimaryColor" />
        </div>
      </div>
      <template v-if="themeName == 'Custom'">
        <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns">
          <div class="label">Secondary Color</div>
          <div>
            <AGColorSelector allow-more="false" :additional-colors="additionalBackgroundColors" class="tw-w-[24px]"
              :selected-color="rgbToHex(themeSecondaryColor.value)" naked="true" @update:value="(color) => (themeSecondaryColor.value = hexToRGB(color))
                " v-if="themeSecondaryColor" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns">
          <div class="label">Tertiary Color</div>
          <div>
            <AGColorSelector allow-more="false" :additional-colors="additionalBackgroundColors" class="tw-w-[24px]"
              :selected-color="rgbToHex(themeTertiaryColor.value)" naked="true" @update:value="(color) => (themeTertiaryColor.value = hexToRGB(color))
                " v-if="themeTertiaryColor" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns">
          <div class="label">Contrast Color</div>
          <div>
            <AGColorSelector allow-more="false" :additional-colors="additionalBackgroundColors" class="tw-w-[24px]"
              :selected-color="rgbToHex(themeWhiteColor.value)" naked="true"
              @update:value="(color) => (themeWhiteColor.value = hexToRGB(color))" v-if="themeWhiteColor" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-4 item-3070-columns">
          <div class="label">Default Text Color</div>
          <div>
            <AGColorSelector allow-more="false" :additional-colors="additionalBackgroundColors"
              :selected-color="rgbToHex(themeDefaultColor.value)" naked="true"
              @update:value="(color) => (themeDefaultColor.value = hexToRGB(color))" v-if="themeDefaultColor" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGColorSelector from 'components/base/colorSelector.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';

import Multiselect from '@vueform/multiselect';
import multiselectClasses from 'src/helpers/multiselectCss.ts';

let themesConf = {
  Light: {
    'secondary': 'rgb(245 247 251)',
    'tertiary': 'rgb(229 231 235)',
    'white': 'rgb(255 255 255)',
    'default': 'rgb(32 33 36)',
  },
  Dark: {
    'secondary': 'rgb(9 9 11)',
    'tertiary': 'rgb(63 63 70)',
    'white': 'rgb(24 24 27)',
    'default': 'rgb(228 228 231)',
  },

  Twilight: {
    'secondary': 'rgb(30 32 48)',
    'tertiary': 'rgb(66 71 92)',
    'white': 'rgb(34 36 54)',
    'default': 'rgb(200 211 245)',
  },
  Embark: {
    'secondary': 'rgb(16 14 35)',
    'tertiary': 'rgb(55 53 74)',
    'white': 'rgb(30 28 47)',
    'default': 'rgb(190 213 217)',
  },
  Catppuccin: {
    'secondary': 'rgb(24 24 37)',
    'tertiary': 'rgb(41 41 53)',
    'white': 'rgb(30 30 46)',
    'default': 'rgb(205 214 244)',
  },
  'One Dark': {
    'secondary': 'rgb(40 44 52)',
    'tertiary': 'rgb(82 84 88)',
    'white': 'rgb(57 63 74)',
    'default': 'rgb(171 178 191)',
  },
}
export default {
  name: 'AGSettingsFrontendConfiguration',
  components: { AGInput, AGColorSelector, Multiselect },

  watch: {
    themeName: {
      deep: true,
      handler() {
        if (this.themeName == 'Custom') {
          return
        }
        this.themeSecondaryColor.value = themesConf[this.themeName].secondary;
        this.themeTertiaryColor.value = themesConf[this.themeName].tertiary;
        this.themeWhiteColor.value = themesConf[this.themeName].white;
        this.themeDefaultColor.value = themesConf[this.themeName].default;
      },

    },
    frontendLimitSettings: {
      deep: true,
      handler() {
        if (this.frontendLimitSettings?.id) {
          saveSettings(this.frontendLimitSettings, () => {
            'pass';
          });
        }
      },
    },
    themePrimaryColor: {
      deep: true,
      handler() {
        if (this.themePrimaryColor?.id) {
          this.changeColor('--color-primary', this.themePrimaryColor.value);
          saveSettings(this.themePrimaryColor, () => {
            'pass';
          });
        }
      },
    },

    themeSecondaryColor: {
      deep: true,
      handler() {
        if (this.themeSecondaryColor?.id) {
          this.changeColor('--color-secondary', this.themeSecondaryColor.value);
          saveSettings(this.themeSecondaryColor, () => {
            this.setThemeName();
          });
        }
      },
    },
    themeTertiaryColor: {
      deep: true,
      handler() {
        if (this.themeTertiaryColor?.id) {
          this.changeColor('--color-tertiary', this.themeTertiaryColor.value);
          saveSettings(this.themeTertiaryColor, () => {
            this.setThemeName();
          });
        }
      },
    },
    themeWhiteColor: {
      deep: true,
      handler() {
        if (this.themeWhiteColor?.id) {
          this.changeColor('--color-white', this.themeWhiteColor.value);
          saveSettings(this.themeWhiteColor, () => {
            this.setThemeName();
          });
        }
      },
    },
    themeDefaultColor: {
      deep: true,
      handler() {
        if (this.themeDefaultColor?.id) {
          this.changeColor('--color-default', this.themeDefaultColor.value);
          saveSettings(this.themeDefaultColor, () => {
            this.setThemeName();
          });
        }
      },
    },
  },



  data() {
    return {
      frontendLimitSettings: null,
      themePrimaryColor: null,
      themeSecondaryColor: null,
      themeTertiaryColor: null,
      themeWhiteColor: null,
      themeDefaultColor: null,
      themeNames: ['Custom'].concat(Object.keys(themesConf)),
      themeName: 'light',
      multiselectCss: multiselectClasses,
      additionalBackgroundColors: [
        '#ffffff',
        'var(--color-default)',
        'var(--color-secondary)',
        'var(--color-tertiary)',
        'var(--color-primary)',
      ],
    };
  },

  mounted() {
    fetchSettings(this.setSettings);
  },
  methods: {
    setThemeName() {
      for (const [key, value] of Object.entries(themesConf)) {
        if ((value.white == this.themeWhiteColor.value) && value.default == this.themeDefaultColor.value && value.secondary == this.themeSecondaryColor.value && value.tertiary == this.themeTertiaryColor.value) {
          this.themeName = key;
          return
        }

      }
      this.themeName = 'Custom';
    },
    changeColor(colorName, value) {
      const root_theme = document.querySelector(':root');
      const color = /rgb\((.+)\)/i.exec(value);
      root_theme.style.setProperty(colorName, color[1]);
    },

    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    },

    rgbToHex(color) {
      var results = /rgb\((\d+) (\d+) (\d+)\)/i.exec(color);

      let rgb = results
        ? {
          r: parseInt(results[1], 10),
          g: parseInt(results[2], 10),
          b: parseInt(results[3], 10),
        }
        : null;

      return (
        '#' +
        this.componentToHex(rgb.r) +
        this.componentToHex(rgb.g) +
        this.componentToHex(rgb.b)
      );
    },
    hexToRGB(color) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      let rgb = result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
        : null;
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
    },
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'MAX_FRONTEND_LIMIT') {
          this.frontendLimitSettings = s;
        }
        if (s.name === 'THEME_PRIMARY_COLOR') {
          this.themePrimaryColor = s;
        }
        if (s.name === 'THEME_SECONDARY_COLOR') {
          this.themeSecondaryColor = s;
        }
        if (s.name === 'THEME_TERTIARY_COLOR') {
          this.themeTertiaryColor = s;
        }
        if (s.name === 'THEME_WHITE_COLOR') {
          this.themeWhiteColor = s;
        }
        if (s.name === 'THEME_DEFAULT_COLOR') {
          this.themeDefaultColor = s;
        }
      });
    },
  },
};
</script>
