<template>
  <div class="tw-w-full tw-h-full" v-if="editor">

    <div class="tw-w-full tw-flex tw-border-b tw-p-2">

      <div class="tw-flex tw-flex-wrap tw-gap-1 tw-w-full">


        <div class="tw-flex-[1_1_10%] tw-text-center">
          <AGButton @clicked="editor.chain().focus().toggleBold().run()"
            :class="editor.isActive('bold') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <BoldIcon size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleItalic().run()"
            :class="editor.isActive('italic') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <ItalicIcon size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleStrike().run()"
            :class="editor.isActive('strike') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <StrikethroughIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().toggleCode().run()"
            :class="editor.isActive('code') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <CodeIcon size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote')
          ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <BlockquoteIcon size=14 />
          </AGButton>
          <AGButton @click="setLink"
            :class="editor.isActive('link') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <LinkIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')"
            class="tw-bg-white">
            <UnlinkIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().setTextAlign('left').run()"
            :class="editor.isActive({ textAlign: 'left' }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <AlignLeftIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().setTextAlign('center').run()"
            :class="editor.isActive({ textAlign: 'center' }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <AlignCenterIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().setTextAlign('right').run()"
            :class="editor.isActive({ textAlign: 'right' }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <AlignRightIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="editor.isActive({ textAlign: 'justify' }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <AlignJustifiedIcon size=14 />
          </AGButton>

        </div>
        <div class="tw-flex-[1_1_10%] tw-text-center">
          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="editor.isActive('heading', { level: 1 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number1Icon class="tw-ml-[-5px]" size=14 />
          </AGButton>

          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="editor.isActive('heading', { level: 2 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number2Icon class="tw-ml-[-5px]" size=14 />

          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="editor.isActive('heading', { level: 3 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number3Icon class="tw-ml-[-5px]" size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="editor.isActive('heading', { level: 4 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number4Icon class="tw-ml-[-5px]" size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="editor.isActive('heading', { level: 5 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number5Icon class="tw-ml-[-5px]" size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="editor.isActive('heading', { level: 6 }) ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'"
            class="tw-inline-flex">
            <HeadingIcon size=14 />
            <Number6Icon class="tw-ml-[-5px] " size=14 />
          </AGButton>

        </div>
        <div class="tw-flex-[1_1_10%] tw-text-center">
          <AGButton @clicked="editor.chain().focus().toggleBulletList().run()"
            :class="editor.isActive('bulletList') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <ListIcon size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().toggleOrderedList().run()"
            :class="editor.isActive('orderedList') ? 'tw-bg-primary tw-text-white tw-border-primary' : 'tw-bg-white tw-text-default'">
            <ListNumbersIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().splitListItem('listItem').run()"
            :disabled="!editor.can().splitListItem('listItem')" class="tw-bg-white">
            <ArrowsSplitIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().sinkListItem('listItem').run()"
            :disabled="!editor.can().sinkListItem('listItem')" class="tw-bg-white">
            <IndentIncreaseIcon size=14 />
          </AGButton>
          <AGButton @click="editor.chain().focus().liftListItem('listItem').run()"
            :disabled="!editor.can().liftListItem('listItem')" class="tw-bg-white">
            <IndentDecreaseIcon size=14 />
          </AGButton>
          <AGButton @clicked="editor.chain().focus().setHorizontalRule().run()" class="tw-bg-white tw-text-default">
            <SeparatorIcon size=14 />
          </AGButton>

        </div>
        <div class="tw-flex-[1_1_10%] tw-text-center">
          <AGColorSelector :additionalColors="additionalColors" :selectedColor="editor.getAttributes('textStyle').color"
            @selectColor="(val) => editor.chain().focus().setColor(val).run()" naked=true
            class="tw-text-xs tw-mt-[5px] " />
        </div>
        <div class="tw-flex-[1_1_10%] tw-text-right">
          <AGButton @clicked="$emit('save', editor.getHTML())" class="tw-bg-primary tw-text-white tw-py-0 tw-text-sm">
            Save
          </AGButton>
          <AGButton @clicked="openDeleteNoteModal = true" class="tw-bg-red-700 tw-text-white tw-py-0 tw-text-sm">
            Delete
          </AGButton>
          <ArrowsMoveIcon size=14 class="grid-drag tw-cursor-move tw-inline-flex tw-ml-2" />
        </div>
      </div>
    </div>
    <editor-content :editor="editor" class="editor-content tw-overflow-auto tw-p-2 tw-h-full" />
    <AGEditorLink v-model:open="showLinkModal" v-model:linkUrl="linkUrl" @updateLink="updateLink" />
    <DeleteNoteModal :query="query" :id="id" v-model:open='openDeleteNoteModal'
      @noteDeleted="$emit('removeWidget', widgetID)" />
  </div>
</template>


<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import DropCursor from '@tiptap/extension-dropcursor'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'

import AGButton from 'components/base/button.vue'
import AGEditorLink from 'components/widgets/editorLink.vue'
import AGColorSelector from 'components/base/colorSelector.vue'
import DeleteNoteModal from './deleteNoteModal.vue'
// import BubbleMenu from '@tiptap/extension-floating-menu'

import {
  BoldIcon, ItalicIcon, HeadingIcon,
  StrikethroughIcon, ListIcon, ListNumbersIcon,
  ArrowsSplitIcon, IndentDecreaseIcon, IndentIncreaseIcon, CodeIcon,
  BlockquoteIcon, SeparatorIcon,
  LinkIcon, UnlinkIcon, Number1Icon, Number2Icon, Number3Icon, Number4Icon, Number5Icon, Number6Icon,
  AlignLeftIcon, AlignRightIcon, AlignCenterIcon, AlignJustifiedIcon,
  ArrowsMoveIcon
} from 'vue-tabler-icons'




export default {
  name: 'AGEditor',
  props: ['modelValue', 'id'],
  components: {
    EditorContent, AGButton,
    AGEditorLink,
    BoldIcon, ItalicIcon, HeadingIcon,
    StrikethroughIcon, ListIcon, ListNumbersIcon,
    ArrowsSplitIcon, IndentDecreaseIcon, IndentIncreaseIcon, CodeIcon,
    LinkIcon, UnlinkIcon,
    BlockquoteIcon, SeparatorIcon,
    AGColorSelector,
    Number1Icon, Number2Icon, Number3Icon, Number4Icon, Number5Icon, Number6Icon,
    AlignLeftIcon, AlignRightIcon, AlignCenterIcon, AlignJustifiedIcon,
    DeleteNoteModal, ArrowsMoveIcon
  },

  data() {
    return {
      editor: null,
      showLinkModal: false,
      additionalColors: ['#f5f7fb', '#6e7687'],
      openDeleteNoteModal: false,
    }
  },

  mounted() {

    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        StarterKit,
        Color,
        TextStyle,
        Typography,
        TextAlign.configure({ types: ['heading', 'paragraph'], }),
        Link.configure({
          openOnClick: false,
        }),
        Image.configure({ 'inline': true, allowBase64: true }), DropCursor
      ],
    })

  },


  beforeUnmount() {
    this.editor.destroy()
  },

  methods: {
    setLink() {
      this.linkUrl = this.editor.getAttributes('link').href
      this.showLinkModal = true
    },
    updateLink() {
      const url = this.linkUrl
      if (url === '') {
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()
        this.linkUrl = ''
        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
      this.linkUrl = ''
    }
  },
}
</script>
