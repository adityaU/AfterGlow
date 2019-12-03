let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/workspace/AfterGlow
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +39 ~/.nvim/init.vim
badd +127 ~/.zshrc
badd +1 lib/afterglow/widgets/question_widget.ex
badd +6 ~/.EverVim/coc-settings.json
badd +1 \[Plugins]
badd +16 config/config.exs
badd +11 lib/afterglow/endpoint.ex
badd +1 NERD_tree_2
badd +35 web/controllers/tags_controller.ex
badd +6 term://.//14444:/usr/bin/zsh
badd +22 frontend/bower.json
badd +15 frontend/app/app.js
badd +27 term://.//5809:/usr/bin/zsh
badd +16 lib/afterglow/settings/global_settings.ex
badd +9 priv/repo/seeds.exs
badd +35 lib/afterglow/settings/global_settings_query_functions.ex
badd +11 lib/afterglow/settings/applicable_settings.ex
badd +28 lib/afterglow/cache/cache.ex
badd +81 frontend/app/pods/settings/reports/template.hbs
badd +71 frontend/app/pods/settings/reports/controller.js
badd +26 term://.//31525:/usr/bin/zsh
badd +4 frontend/app/pods/settings/controller.js
badd +8 frontend/app/pods/settings/route.js
badd +53 frontend/app/pods/settings/template.hbs
badd +2 frontend/app/pods/settings/version/index/controller.js
badd +3 frontend/app/pods/settings/version/index/template.hbs
badd +3 frontend/app/pods/settings/version/index/route.js
badd +75 frontend/app/router.js
badd +6 frontend/app/pods/settings/version/controller.js
badd +1 frontend/app/pods/application/controller.js
badd +7 frontend/app/pods/application/adapter.js
badd +3 frontend/app/pods/settings/version/route.js
badd +3 frontend/app/pods/settings/version/template.hbs
badd +5 frontend/config/environment.js
badd +17 lib/afterglow/mailers/csv_mailer.ex
badd +6 lib/afterglow/mailers/snapshot_mailer.ex
badd +44 lib/afterglow/mailers/mailers.ex
badd +29 mix.exs
badd +2 lib/afterglow/helpers/csv_helpers.ex
badd +1 frontend/app/services/ajax.js
badd +1514 term://.//5244:/usr/bin/zsh
badd +1 output:///info
badd +8 web/controllers/user_controller.ex
badd +1313 term://.//6363:/usr/bin/zsh
badd +974 frontend/app/mixins/utils-functions.js
badd +30 frontend/app/pods/components/base-chart-settings/component.js
badd +26 frontend/app/pods/components/base-chart-settings/template.hbs
argglobal
silent! argdel *
edit frontend/app/mixins/utils-functions.js
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 32 + 25) / 50)
exe 'vert 1resize ' . ((&columns * 31 + 75) / 150)
exe '2resize ' . ((&lines * 15 + 25) / 50)
exe 'vert 2resize ' . ((&columns * 118 + 75) / 150)
exe '3resize ' . ((&lines * 16 + 25) / 50)
exe 'vert 3resize ' . ((&columns * 118 + 75) / 150)
exe '4resize ' . ((&lines * 15 + 25) / 50)
argglobal
enew
file NERD_tree_1
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal nofen
wincmd w
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 974 - ((11 * winheight(0) + 7) / 15)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
974
normal! 018|
wincmd w
argglobal
if bufexists('term://.//5244:/usr/bin/zsh') | buffer term://.//5244:/usr/bin/zsh | else | edit term://.//5244:/usr/bin/zsh | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1514 - ((11 * winheight(0) + 8) / 16)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1514
normal! 0
wincmd w
argglobal
enew
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
wincmd w
4wincmd w
exe '1resize ' . ((&lines * 32 + 25) / 50)
exe 'vert 1resize ' . ((&columns * 31 + 75) / 150)
exe '2resize ' . ((&lines * 15 + 25) / 50)
exe 'vert 2resize ' . ((&columns * 118 + 75) / 150)
exe '3resize ' . ((&lines * 16 + 25) / 50)
exe 'vert 3resize ' . ((&columns * 118 + 75) / 150)
exe '4resize ' . ((&lines * 15 + 25) / 50)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOcF
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
