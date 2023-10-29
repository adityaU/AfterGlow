<style scoped></style>
<template>
  <div
    class="tw-w-full tw-h-full tw-flex data-container"
    :style="containerStyle(formattedValue)"
  >
    <div
      class=""
      :style="{ ...labelStyle, ...paddingStyle }"
      v-if="formattingSettings && formattingSettings.showLabel"
    >
      {{ displayName }}
    </div>
    <div
      :style="{ ...style(formattedValue), ...paddingStyle }"
      class="tw-flex"
      v-if="textType"
    >
      <div class="tw-flex tw-items-center" :style="iconGapStyle">
        <div
          v-html="prefix"
          :style="prefixStyle(formattedValue)"
          v-if="prefix"
        ></div>
        {{ formattedValue }}
        <div
          v-html="suffix"
          :style="suffixStyle(formattedValue)"
          v-if="suffix"
        ></div>
      </div>
    </div>

    <div
      :style="{ ...style(formattedValue), ...paddingStyle }"
      class="tw-flex"
      v-if="urlType"
    >
      <div class="tw-flex tw-items-center" :style="iconGapStyle">
        <div
          v-html="prefix"
          :style="prefixStyle(formattedValue)"
          v-if="prefix"
        ></div>
        <a
          :href="formattedValue"
          :target="urlTarget"
          :class="urlUnderline ? 'tw-underline' : ''"
          >{{ formattedValue }}</a
        >
        <div
          v-html="suffix"
          :style="suffixStyle(formattedValue)"
          v-if="suffix"
        ></div>
      </div>
    </div>

    <div
      class="tw-flex"
      v-if="tagType"
      :style="{ ...tagStyle, ...paddingStyle }"
    >
      <div
        class="tw-flex tw-my-auto tw-shadow-sm tw-border-2 tw-border-secondary/20 tw-items-center"
        :style="{ ...style(formattedValue), ...iconGapStyle }"
      >
        <div v-html="prefix" :style="prefixStyle(formattedValue)"></div>
        {{ formattedValue }}
        <div v-html="suffix" :style="suffixStyle(formattedValue)"></div>
      </div>
    </div>

    <div
      class="tw-flex btn"
      v-if="buttonType"
      :style="{ ...buttonStyle, ...paddingStyle }"
    >
      <div
        class="tw-flex tw-gap-1 tw-my-auto tw-shadow-sm tw-border-2 tw-border-secondary/20 tw-items-center"
        :style="{ ...style(formattedValue), ...iconGapStyle }"
      >
        <div v-html="prefix" :style="prefixStyle(formattedValue)"></div>
        {{ formattedValue }}
        <div v-html="suffix" :style="suffixStyle(formattedValue)"></div>
      </div>
    </div>

    <div
      class="tw-flex tw-gap-1"
      v-if="imageType"
      :style="{ ...flexStyle, ...paddingStyle }"
    >
      <img
        class="tw-shadow-sm"
        loading="lazy"
        :src="imageUrl"
        :style="imageStyle"
        @error="noImage"
        ref="image"
      />
      <div
        class="tw-shadow-sm tw-flex-wrap tw-leading-4 tw-hidden tw-items-center tw-justify-center tw-whitespace-normal tw-font-semibold tw-text-xs"
        :src="imageUrl"
        :style="imageStyle"
        ref="altImage"
      >
        <div>No</div>
        <div>Image</div>
      </div>
    </div>

    <div
      class="tw-flex tw-gap-1"
      v-if="progressType"
      :style="{ ...flexStyle, ...paddingStyle }"
    >
      <div
        :style="progressStyle"
        v-if="value <= formattingSettings.progressMaximum"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          {{ formattedValue }}
        </q-tooltip>
      </div>

      <template v-else>
        <div class="tw-flex tw-items-center">
          {{ formattedValue }}
        </div>
      </template>
    </div>

    <div
      class="tw-h-full tw-flex"
      v-if="ratingType"
      :style="{ ...flexStyle, ...paddingStyle }"
    >
      <template v-if="value <= formattingSettings.maximum">
        <div class="tw-flex tw-gap-1">
          <template v-for="i in Math.floor(value)" :key="i">
            <svg
              :style="ratingStyle"
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-star filled"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-v-234fe786=""
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                :style="{ fill: formattingSettings.ratingColor }"
                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
              ></path>
            </svg>
          </template>
          <template v-if="value != Math.floor(value)">
            <svg
              :style="ratingStyle"
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-star filled"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-v-234fe786=""
            >
              <defs>
                <linearGradient
                  :id="linearGradientID"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" :style="lgStyle" />
                  <stop :offset="lgOffset" :style="lgStyle" />
                  <stop
                    :offset="lgOffset"
                    style="stop-color: rgb(255, 255, 255); stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: rgb(255, 255, 255); stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                :style="{ fill: 'url(#' + linearGradientID + ')' }"
                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
              ></path>
            </svg>
          </template>

          <template v-for="i in restRatingCount" :key="i">
            <StarIcon size="16" :style="ratingStyle" />
          </template>
        </div>
      </template>
      <template v-else>
        <div class="tw-h-full tw-items-center" :style="paddingStyle">
          {{ formattedValue }}
        </div>
      </template>
    </div>

    <div
      class="tw-flex tw-items-center tw-px-4 tw-py-2"
      v-if="!formattingSettings"
    >
      {{ defaultFormattedValue }}
    </div>
  </div>
</template>

<script>
import { getRandomColor, autoTextColor } from 'src/helpers/colorGenerator';
import { datetimeFormat } from 'src/mixins/filterMixins';
import { formatDatetime } from 'src/helpers/datetimeFormatting';
import { formattedValue } from 'src/helpers/formatting';
import { StarIcon } from 'vue-tabler-icons';

const labelPaddingCollapseStyle = {
  'left-top': {
    'padding-right': '0px',
  },
  'left-center': {
    'padding-right': '0px',
  },

  'left-bottom': {
    'padding-right': '0px',
  },

  'right-top': {
    'padding-left': '0px',
  },

  'right-center': {
    'padding-left': '0px',
  },

  'right-bottom': {
    'padding-left': '0px',
  },

  'top-left': {
    'padding-bottom': '0px',
  },

  'top-center': {
    'padding-bottom': '0px',
  },

  'top-right': {
    'padding-bottom': '0px',
  },

  'bottom-left': {
    'padding-top': '0px',
  },

  'bottom-center': {
    'padding-top': '0px',
  },

  'bottom-right': {
    'padding-top': '0px',
  },
};

const labelPositionStyles = {
  'left-top': {
    'align-self': 'flex-start',
  },
  'left-center': {
    'align-self': 'center',
  },

  'left-bottom': {
    'align-self': 'flex-end',
  },

  'right-top': {
    'align-self': 'flex-start',
  },

  'right-center': {
    'align-self': 'center',
  },

  'right-bottom': {
    'align-self': 'flex-end',
  },

  'top-left': {
    'align-self': 'flex-start',
  },

  'top-center': {
    'align-self': 'center',
  },

  'top-right': {
    'align-self': 'flex-end',
  },

  'bottom-left': {
    'align-self': 'flex-start',
  },

  'bottom-center': {
    'align-self': 'center',
  },

  'bottom-right': {
    'align-self': 'flex-end',
  },
};

const alignClass = {
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center',
};

export default {
  name: 'AGTableCellFormatterWidget',
  props: [
    'formattingSettings',
    'value',
    'dataType',
    'displayName',
    'parentStyle',
  ],
  components: { StarIcon },
  mounted() {
    this.$emit('update:parentStyle', this.parentStyleLocal);
  },
  watch: {
    parentStyleLocal() {
      this.$emit('update:parentStyle', this.parentStyleLocal);
    },
  },
  computed: {
    urlTarget() {
      return !this.formattingSettings?.openInNewTab ? '_self' : '_blank';
    },

    urlUnderline() {
      return this.formattingSettings?.underline;
    },
    progressStyle() {
      const percent =
        (this.value / this.formattingSettings.progressMaximum) * 100;
      const color = this.formattingSettings.progressColor;
      return {
        'border-radius': '50px',
        'border-color': color,
        border: `1px solid ${color}`,
        height: '10px',
        width: '150px',
        background: `linear-gradient(to right, ${color}, ${color} ${percent}%, white ${percent}%, white)`,
      };
    },
    lgStyle() {
      return {
        'stop-color': this.formattingSettings.ratingColor,
        'stop-opacity': 1,
      };
    },
    lgOffset() {
      return (this.value - Math.floor(this.value)) * 100 + '%';
    },
    restRatingCount() {
      const rest = this.formattingSettings.maximum - Math.floor(this.value);
      return this.value == Math.floor(this.value) ? rest : rest - 1;
    },
    linearGradientID() {
      return 'grad' + (this.value - Math.floor(this.value)) * 100;
    },
    textType() {
      if (this.formattingSettings && this.formattingSettings.type === 'Text') {
        return true;
      }
      return false;
    },

    urlType() {
      if (this.formattingSettings && this.formattingSettings.type === 'Url') {
        return true;
      }
      return false;
    },
    tagType() {
      if (this.formattingSettings && this.formattingSettings.type === 'Tag') {
        return true;
      }
      return false;
    },
    buttonType() {
      if (
        this.formattingSettings &&
        this.formattingSettings.type === 'Button'
      ) {
        return true;
      }
      return false;
    },
    progressType() {
      if (
        this.formattingSettings &&
        this.formattingSettings.type === 'Progress Bar'
      ) {
        return true;
      }
      return false;
    },
    imageType() {
      if (this.formattingSettings && this.formattingSettings.type === 'Image') {
        return true;
      }
      return false;
    },
    ratingType() {
      if (
        this.formattingSettings &&
        this.formattingSettings.type === 'Rating'
      ) {
        return true;
      }
      return false;
    },
    formattedValue() {
      return formattedValue(this.value, this.formattingSettings, this.dataType);
      // if (this.formattingSettings ){
      //   const ff = formatFunc[this.dataType]
      //   const displayValue = ff ? ff(this.value, this.formattingSettings.format) : this.value && this.value.toString()
      //   return this.formattingSettings.displayText.replace(/{{\W*columnValue\W*}}/, displayValue)
      // }
      // return this.value
    },
    suffix() {
      if (this.formattingSettings && this.formattingSettings.suffix) {
        return this.iconHtmlWithCorrectSize(
          this.formattingSettings.suffix.icon
        );
      }
      return null;
    },
    prefix() {
      if (this.formattingSettings && this.formattingSettings.prefix) {
        return this.iconHtmlWithCorrectSize(
          this.formattingSettings.prefix.icon
        );
      }
      return null;
    },
    labelPaddingStyle() {
      if (!this.formattingSettings) {
        return {};
      }
      const fs = this.formattingSettings;
      return { ...labelPaddingCollapseStyle[fs.labelPosition] };
    },
    paddingStyle() {
      if (!this.formattingSettings) {
        return {};
      }
      let style = {};
      const fs = this.formattingSettings;
      style['padding-left'] = fs.hasOwnProperty('paddingX')
        ? fs.paddingX + 'rem'
        : '1rem';
      style['padding-right'] = fs.hasOwnProperty('paddingX')
        ? fs.paddingX + 'rem'
        : '1rem';
      style['padding-top'] = fs.hasOwnProperty('paddingY')
        ? fs.paddingY + 'rem'
        : '0.5rem';
      style['padding-bottom'] = fs.hasOwnProperty('paddingY')
        ? fs.paddingY + 'rem'
        : '0.5rem';
      return style;
    },
    iconGapStyle() {
      let style = {};
      if (!this.formattingSettings) {
        return {};
      }
      return { gap: this.formattingSettings.iconGap + 'rem' || '0.5rem' };
    },
    tagStyle() {
      let style = {};
      if (!this.formattingSettings) {
        return {};
      }
      return style;
    },

    defaultFormattedValue() {
      if (this.dataType === 'datetime') {
        return formatDatetime(this.value, datetimeFormat);
      }
      if (this.value === null) {
        return 'NULL';
      }
      return this.value;
    },
    flexStyle() {
      if (!this.formattingSettings) {
        return {};
      }
      let style = {};
      return style;
    },

    ratingStyle() {
      if (!this.formattingSettings) {
        return {};
      }
      return { color: this.formattingSettings.ratingColor };
    },

    imageUrl() {
      if (!this.formattingSettings) {
        return {};
      }
      return this.formattingSettings.url.replace(
        /{{\W*columnValue\W*}}/,
        this.value
      );
    },

    imageStyle() {
      const baseStyle = {
        width: '50px',
        height: '50px',
        border: `3px solid ${this.formattingSettings.borderColor}`,
        'object-fit': 'cover',
      };
      if (this.formattingSettings.imageShape === 'round') {
        baseStyle['border-radius'] = '50px';
      }
      if (this.formattingSettings.imageShape === 'square') {
        baseStyle['border-radius'] = '3px';
      }

      if (this.formattingSettings.imageShape === 'custom') {
        baseStyle['border-radius'] = this.formattingSettings.hasOwnProperty(
          'imageBorderRadius'
        )
          ? this.formattingSettings.imageBorderRadius + 'rem'
          : '0.125rem';
        baseStyle['height'] = this.formattingSettings.hasOwnProperty(
          'imageHeight'
        )
          ? this.formattingSettings.imageHeight + 'rem'
          : '3rem';
        baseStyle['width'] = this.formattingSettings.hasOwnProperty(
          'imageWidth'
        )
          ? this.formattingSettings.imageWidth + 'rem'
          : '3rem';
      }
      return baseStyle;
    },
    labelStyle() {
      if (!this.formattingSettings) {
        return;
      }
      let style = {};
      const fs = this.formattingSettings;
      style['font-size'] = fs.hasOwnProperty('labelFontSize')
        ? fs.labelFontSize + 'rem'
        : '1 rem';
      style['font-weight'] = fs.hasOwnProperty('labelFontWeight')
        ? fs.labelFontWeight == 'semibold'
          ? 600
          : fs.labelFontWeight
        : 600;
      style['color'] = fs.hasOwnProperty('labelColor')
        ? fs.labelColor
        : 'inherit';
      if (fs.hasOwnProperty('labelPosition')) {
        style = { ...style, ...labelPositionStyles[fs.labelPosition] };
      }
      return style;
    },
    parentStyleLocal() {
      if (!this.formattingSettings) {
        return {};
      }
      let style = {};
      const fs = this.formattingSettings;
      if (
        fs.parentBackgroundColor == 'transparent' ||
        fs.parentBackgroundColor == null
      ) {
        return {};
      }
      style['--parent-background-color'] = fs.parentBackgroundColor;
      return style;
    },
  },
  methods: {
    suffixStyle(value) {
      if (this.formattingSettings && this.formattingSettings.suffix) {
        let style = {
          color: this.formattingSettings.suffix.color,
          'font-size': 'inherit',
        };
        if (this.formattingSettings.suffix.color === 'random') {
          style['color'] = getRandomColor(value);
        }
        if (this.formattingSettings.suffix.color === 'auto') {
          const style = this.style(value);
          const containerStyle = this.containerStyle(value);
          if (
            !style['background-color'] ||
            style['background-color'] === 'transparent'
          ) {
            style['color'] = autoTextColor(containerStyle['background-color']);
            return style;
          }
          style['color'] = autoTextColor(style['background-color']);
          return style;
        }
        return style;
      }
      return null;
    },
    prefixStyle(value) {
      if (this.formattingSettings && this.formattingSettings.prefix) {
        let style = {
          color: this.formattingSettings.prefix.color,
          'font-size': 'inherit',
        };
        if (this.formattingSettings.prefix.color === 'random') {
          style['color'] = getRandomColor(value);
        }
        if (this.formattingSettings.prefix.color === 'auto') {
          const style = this.style(value);
          const containerStyle = this.containerStyle(value);
          if (
            !style['background-color'] ||
            style['background-color'] === 'transparent'
          ) {
            style['color'] = autoTextColor(containerStyle['background-color']);
            return style;
          }
          style['color'] = autoTextColor(style['background-color']);
          return style;
        }
        return style;
      }
      return null;
    },

    containerStyle(value) {
      if (!this.formattingSettings) {
        return;
      }
      let style = {};
      const fs = this.formattingSettings;
      style['background-color'] = fs.containerBackgroundColor || 'transparent';
      if (fs.containerBackgroundColor === 'random') {
        style['background-color'] = getRandomColor(value);
      }
      let borderColor = fs.containerBorderColor || 'transparent';
      if (fs.containerBorderColor === 'random') {
        borderColor = getRandomColor(value);
      }
      style['border-radius'] = fs.containerBorderRadius
        ? fs.containerBorderRadius + 'rem'
        : '0px';
      if (
        fs.containerBorderPosition &&
        fs.containerBorderPosition.indexOf('left') >= 0
      ) {
        style['border-left'] = `${
          fs.containerBorderThickness || 0
        }px solid ${borderColor}`;
      }
      if (
        fs.containerBorderPosition &&
        fs.containerBorderPosition.indexOf('right') >= 0
      ) {
        style['border-right'] = `${
          fs.containerBorderThickness || 0
        }px solid ${borderColor}`;
      }
      if (
        fs.containerBorderPosition &&
        fs.containerBorderPosition.indexOf('top') >= 0
      ) {
        style['border-top'] = `${
          fs.containerBorderThickness || 0
        }px solid ${borderColor}`;
      }
      if (
        fs.containerBorderPosition &&
        fs.containerBorderPosition.indexOf('bottom') >= 0
      ) {
        style['border-bottom'] = `${
          fs.containerBorderThickness || 0
        }px solid ${borderColor}`;
      }

      style['justify-content'] = this.formattingSettings.horizontalAlignment
        ? this.formattingSettings.horizontalAlignment
        : 'left';
      style['align-items'] = this.formattingSettings.verticalAlignment
        ? alignClass[this.formattingSettings.verticalAlignment]
        : 'center';

      style['font-size'] = fs.hasOwnProperty('fontSize')
        ? fs.fontSize + 'rem'
        : '1rem';
      style['font-weight'] = fs.hasOwnProperty('fontWeight')
        ? fs.fontWeight === 'semibold'
          ? '600'
          : fs.fontWeight
        : 'normal';

      if (fs.showLabel) {
        if (
          fs.labelPosition &&
          ['top-left', 'top-center', 'top-right'].indexOf(fs.labelPosition) >= 0
        ) {
          style['flex-direction'] = 'column';
        }
        if (
          fs.labelPosition &&
          ['bottom-left', 'bottom-center', 'bottom-right'].indexOf(
            fs.labelPosition
          ) >= 0
        ) {
          style['flex-direction'] = 'column-reverse';
        }
        if (
          fs.labelPosition &&
          ['right-top', 'right-center', 'right-bottom'].indexOf(
            fs.labelPosition
          ) >= 0
        ) {
          style['flex-direction'] = 'row-reverse';
        }
      }

      return style;
    },
    style(value) {
      if (!this.formattingSettings) {
        return {};
      }
      let style = {
        color: this.formattingSettings.textColor,
        'background-color': this.formattingSettings.backgroundColor,
      };
      if (this.formattingSettings.backgroundColor === 'random') {
        style['background-color'] = getRandomColor(value);
      }
      if (this.formattingSettings.textColor === 'random') {
        style['color'] = getRandomColor(value, true);
      }

      if (this.formattingSettings.textColor === 'auto') {
        if (style['background-color'] != 'transparent') {
          style['color'] = autoTextColor(style['background-color']);
        } else {
          let containerBackgroundColor =
            this.formattingSettings.containerBackgroundColor || 'transparent';
          if (this.formattingSettings.containerBackgroundColor === 'random') {
            containerBackgroundColor = getRandomColor(value);
          }
          style['color'] = autoTextColor(containerBackgroundColor);
        }
      }

      if (this.tagType) {
        style['border-radius'] = '50px';
        style['padding'] = '0px 10px';
        style['width'] = 'fit-content';
      }
      if (this.buttonType) {
        style['border-radius'] = '0.125rem';
        style['padding'] = '5px 15px';
        style['width'] = 'fit-content';
      }
      return style;
    },

    noImage() {
      this.$refs['image'] && (this.$refs['image'].style.display = 'none');
      this.$refs['altImage'] && (this.$refs['altImage'].style.display = 'flex');
    },
    iconHtmlWithCorrectSize(html) {
      if (!html) {
        return null;
      }
      const baseFontSize =
        this.formattingSettings &&
        this.formattingSettings.hasOwnProperty('fontSize')
          ? this.formattingSettings.fontSize + 'rem'
          : '1rem';
      html = html.replace(/width="\w*\d+\w*"/, `width="${baseFontSize}"`);
      html = html.replace(/height="\w*\d+\w*"/, `height="${baseFontSize}"`);
      return html;
    },
  },
};
</script>
