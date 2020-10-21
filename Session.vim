let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/workspace/AfterGlow
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 ~/.tmux.conf
badd +17 ~/.zshrc
badd +398 ~/.EverVim/init.vim
badd +1 ~/.vimrc
badd +39 ~/.nvim/init.vim
badd +1 lib/afterglow/widgets/question_widget.ex
badd +11 ~/.EverVim/coc-settings.json
badd +1 \[Plugins]
badd +31 config/config.exs
badd +1 lib/afterglow/endpoint.ex
badd +1 NERD_tree_2
badd +35 web/controllers/tags_controller.ex
badd +6 term://.//14444:/usr/bin/zsh
badd +22 frontend/bower.json
badd +15 frontend/app/app.js
badd +27 term://.//5809:/usr/bin/zsh
badd +16 lib/afterglow/settings/global_settings.ex
badd +13 priv/repo/seeds.exs
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
badd +80 frontend/config/environment.js
badd +17 lib/afterglow/mailers/csv_mailer.ex
badd +6 lib/afterglow/mailers/snapshot_mailer.ex
badd +44 lib/afterglow/mailers/mailers.ex
badd +114 mix.exs
badd +2 lib/afterglow/helpers/csv_helpers.ex
badd +1 frontend/app/services/ajax.js
badd +12 term://.//8234:/usr/bin/zsh
badd +1 output:///info
badd +1 web/controllers/user_controller.ex
badd +1313 term://.//6363:/usr/bin/zsh
badd +836 frontend/app/mixins/utils-functions.js
badd +30 frontend/app/pods/components/base-chart-settings/component.js
badd +26 frontend/app/pods/components/base-chart-settings/template.hbs
badd +24 .docker/nginx.conf
badd +33 config/dev.exs
badd +65 config/prod.exs
badd +17 config/prod.secret.exs
badd +9 frontend/app/pods/login/template.hbs
badd +86 frontend/app/pods/components/base-header/template.hbs
badd +2 term://.//3829:/bin/zsh
badd +1 \[Plugins]\ (2)
badd +1 \[Plugins]\ (3)
badd +161 lib/afterglow/exploration/exploration.ex
badd +35 web/modules/sql/db_connection.ex
badd +178 web/modules/sql/adapters/mysql.ex
badd +12 web/modules/sql/query_runner.ex
badd +44 lib/afterglow/exploration/dashboards.ex
badd +1 web/models/variable_dashboard.ex
badd +120 web/models/variable.ex
badd +17 web/controllers/variable_controller.ex
badd +1 frontend/app/styles/dashboard/_example.scss
badd +95 web/models/dashboard.ex
badd +26 web/models/question.ex
badd +134 web/controllers/dashboard_controller.ex
badd +51 web/modules/sql/adapters/postgres.ex
badd +19 frontend/app/pods/explore/new/template.hbs
badd +50 frontend/app/pods/explore/new/controller.js
badd +27 frontend/app/pods/explore/new/route.js
badd +12 frontend/app/pods/settings/users/edit/route.js
badd +74 web/router.ex
badd +49 lib/afterglow_web/controllers/explore_controller.ex
badd +20 web/controllers/question_controller.ex
badd +15 frontend/app/pods/data-references/databases/show/tables/show/explore/controller.js
badd +1 frontend/app/pods/data-references/databases/show/tables/show/explore/route.js
badd +58 lib/afterglow_web/controllers/api_action_controller.ex
badd +17 lib/afterglow_web/controllers/alert_event_controller.ex
badd +66 lib/afterglow_web/controllers/note_controller.ex
badd +38 lib/afterglow_web/controllers/snapshot_controller.ex
badd +16 web/views/dashboard_view.ex
badd +5521 frontend/dist/assets/frontend.js
badd +7 .gitignore
badd +11 frontend/app/pods/dashboards/show/controller.js
badd +14 frontend/app/pods/dashboards/show/route.js
badd +16 frontend/app/mixins/dynamic-query-params-routes-mixin.js
badd +18 frontend/app/mixins/dynamic-query-params-controller-mixin.js
badd +1 frontend/bower_components/ace-builds/src-min/snippets/mysql.js
badd +1 frontend/app/pods/components/variable-value-selector/template.hbs
badd +11 frontend/app/pods/components/variables-layer/template.hbs
badd +28 frontend/app/pods/components/create-variable/template.hbs
badd +21 frontend/app/pods/components/create-variable/component.js
badd +49 frontend/app/pods/components/filter-maker/template.hbs
badd +28 frontend/app/pods/components/filter-value-selector/template.hbs
badd +1 NERD_tree_1
argglobal
silent! argdel *
edit ~/.EverVim/init.vim
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
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
let s:l = 450 - ((3 * winheight(0) + 20) / 40)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
450
normal! 05|
lcd ~/workspace/AfterGlow
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=1 winminheight=0 winminwidth=0 shortmess=aoO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
