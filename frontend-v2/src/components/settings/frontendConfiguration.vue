<template>
  <div class="tw-w-full">
    <div
      class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-border"
    >
      <div class="label tw-mt-2 tw-px-4 tw-pt-4">
        Maximum Number of Rows on frontend
      </div>
      <AGInput
        v-model:value="frontendLimitSettings.value"
        v-if="frontendLimitSettings"
        placeholder="How many rows can members see on frontend ?"
        type="number"
        debounce="300"
        class="tw-px-4"
      />
      <div class="note tw-px-4 tw-pb-4">
        Limit more than 2000 is ignored. This limit overrides Global Limit for
        frontend.
      </div>
      <div
        class="tw-font-semibold tw-text-lg tw-border-t tw-mt-2 tw-px-4 tw-pt-4"
      >
        Theme
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns"
      >
        <div class="label">Primary Color</div>
        <AGColorSelector
          allow-more="false"
          :additional-colors="additionalBackgroundColors"
          :selected-color="rgbToHex(themePrimaryColor.value)"
          naked="true"
          @update:value="(color) => (themePrimaryColor.value = hexToRGB(color))"
          v-if="themePrimaryColor"
        />
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns"
      >
        <div class="label">Secondary Color</div>
        <AGColorSelector
          allow-more="false"
          :additional-colors="additionalBackgroundColors"
          :selected-color="rgbToHex(themeSecondaryColor.value)"
          naked="true"
          @update:value="
            (color) => (themeSecondaryColor.value = hexToRGB(color))
          "
          v-if="themeSecondaryColor"
        />
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns"
      >
        <div class="label">Tertiary Color</div>
        <AGColorSelector
          allow-more="false"
          :additional-colors="additionalBackgroundColors"
          :selected-color="rgbToHex(themeTertiaryColor.value)"
          naked="true"
          @update:value="
            (color) => (themeTertiaryColor.value = hexToRGB(color))
          "
          v-if="themeTertiaryColor"
        />
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-2 item-3070-columns"
      >
        <div class="label">Contrast Color</div>
        <AGColorSelector
          allow-more="false"
          :additional-colors="additionalBackgroundColors"
          :selected-color="rgbToHex(themeWhiteColor.value)"
          naked="true"
          @update:value="(color) => (themeWhiteColor.value = hexToRGB(color))"
          v-if="themeWhiteColor"
        />
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-mt-2 tw-px-4 tw-pb-4 item-3070-columns"
      >
        <div class="label">Default Text Color</div>
        <AGColorSelector
          allow-more="false"
          :additional-colors="additionalBackgroundColors"
          :selected-color="rgbToHex(themeDefaultColor.value)"
          naked="true"
          @update:value="(color) => (themeDefaultColor.value = hexToRGB(color))"
          v-if="themeDefaultColor"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGColorSelector from 'components/base/colorSelector.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';
export default {
  name: 'AGSettingsFrontendConfiguration',
  components: { AGInput, AGColorSelector },

  watch: {
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
            'pass';
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
            'pass';
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
            'pass';
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
            'pass';
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
