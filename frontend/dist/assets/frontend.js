"use strict";



define('frontend/abilities/dashboard', ['exports', 'ember-can'], function (exports, _emberCan) {
    exports['default'] = _emberCan.Ability.extend({
        sessionService: Ember.inject.service(),
        canCreate: Ember.computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.create') >= 0;
        }),
        canEdit: Ember.computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.edit') >= 0;
        }),
        canShow: Ember.computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.show') >= 0;
        }),
        canDelete: Ember.computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.delete') >= 0;
        })

    });
});
define('frontend/abilities/question', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _emberCan.Ability.extend({
        sessionService: _ember['default'].inject.service(),
        canCreate: _ember['default'].computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.create') >= 0;
        }),
        canEdit: _ember['default'].computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.edit') >= 0;
        }),
        canShow: _ember['default'].computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.show') >= 0;
        }),
        canDelete: _ember['default'].computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.delete') >= 0;
        })

    });
});
define('frontend/abilities/settings', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _emberCan.Ability.extend({
        sessionService: _ember['default'].inject.service(),
        canShow: _ember['default'].computed('sessionService.permissions', function () {
            return this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Settings.all') >= 0;
        })

    });
});
define('frontend/app', ['exports', 'ember', 'frontend/resolver', 'ember-load-initializers', 'frontend/config/environment'], function (exports, _ember, _frontendResolver, _emberLoadInitializers, _frontendConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _frontendConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _frontendConfigEnvironment['default'].podModulePrefix,
    Resolver: _frontendResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _frontendConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('frontend/breakpoints', ['exports'], function (exports) {
  exports['default'] = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 991px)',
    desktop: '(min-width: 992px) and (max-width: 1200px)'
  };
});
define('frontend/components/as-scrollable', ['exports', 'ember-scrollable/components/ember-scrollable'], function (exports, _emberScrollableComponentsEmberScrollable) {
  exports['default'] = _emberScrollableComponentsEmberScrollable['default'].extend({
    classNames: 'as-scrollable'
  });
});
define('frontend/components/bs-accordion', ['exports', 'ember-bootstrap/components/bs-accordion'], function (exports, _emberBootstrapComponentsBsAccordion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsAccordion['default'];
    }
  });
});
define('frontend/components/bs-accordion/item', ['exports', 'ember-bootstrap/components/bs-accordion/item'], function (exports, _emberBootstrapComponentsBsAccordionItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsAccordionItem['default'];
    }
  });
});
define('frontend/components/bs-accordion/item/body', ['exports', 'ember-bootstrap/components/bs-accordion/item/body'], function (exports, _emberBootstrapComponentsBsAccordionItemBody) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsAccordionItemBody['default'];
    }
  });
});
define('frontend/components/bs-accordion/item/title', ['exports', 'ember-bootstrap/components/bs-accordion/item/title'], function (exports, _emberBootstrapComponentsBsAccordionItemTitle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsAccordionItemTitle['default'];
    }
  });
});
define('frontend/components/bs-alert', ['exports', 'ember-bootstrap/components/bs-alert'], function (exports, _emberBootstrapComponentsBsAlert) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsAlert['default'];
    }
  });
});
define('frontend/components/bs-button-group', ['exports', 'ember-bootstrap/components/bs-button-group'], function (exports, _emberBootstrapComponentsBsButtonGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsButtonGroup['default'];
    }
  });
});
define('frontend/components/bs-button-group/button', ['exports', 'ember-bootstrap/components/bs-button-group/button'], function (exports, _emberBootstrapComponentsBsButtonGroupButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsButtonGroupButton['default'];
    }
  });
});
define('frontend/components/bs-button', ['exports', 'ember-bootstrap/components/bs-button'], function (exports, _emberBootstrapComponentsBsButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsButton['default'];
    }
  });
});
define('frontend/components/bs-carousel', ['exports', 'ember-bootstrap/components/bs-carousel'], function (exports, _emberBootstrapComponentsBsCarousel) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsCarousel['default'];
    }
  });
});
define('frontend/components/bs-carousel/slide', ['exports', 'ember-bootstrap/components/bs-carousel/slide'], function (exports, _emberBootstrapComponentsBsCarouselSlide) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsCarouselSlide['default'];
    }
  });
});
define('frontend/components/bs-collapse', ['exports', 'ember-bootstrap/components/bs-collapse'], function (exports, _emberBootstrapComponentsBsCollapse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsCollapse['default'];
    }
  });
});
define('frontend/components/bs-datetimepicker', ['exports', 'ember-cli-bootstrap-datetimepicker/components/bs-datetimepicker', 'frontend/config/environment'], function (exports, _emberCliBootstrapDatetimepickerComponentsBsDatetimepicker, _frontendConfigEnvironment) {
  exports['default'] = _emberCliBootstrapDatetimepickerComponentsBsDatetimepicker['default'].extend({
    config: _frontendConfigEnvironment['default']['ember-cli-bootstrap-datetimepicker']
  });
});
define('frontend/components/bs-dropdown', ['exports', 'ember-bootstrap/components/bs-dropdown'], function (exports, _emberBootstrapComponentsBsDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdown['default'];
    }
  });
});
define('frontend/components/bs-dropdown/button', ['exports', 'ember-bootstrap/components/bs-dropdown/button'], function (exports, _emberBootstrapComponentsBsDropdownButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownButton['default'];
    }
  });
});
define('frontend/components/bs-dropdown/menu', ['exports', 'ember-bootstrap/components/bs-dropdown/menu'], function (exports, _emberBootstrapComponentsBsDropdownMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownMenu['default'];
    }
  });
});
define('frontend/components/bs-dropdown/menu/divider', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/divider'], function (exports, _emberBootstrapComponentsBsDropdownMenuDivider) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownMenuDivider['default'];
    }
  });
});
define('frontend/components/bs-dropdown/menu/item', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/item'], function (exports, _emberBootstrapComponentsBsDropdownMenuItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownMenuItem['default'];
    }
  });
});
define('frontend/components/bs-dropdown/menu/link-to', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/link-to'], function (exports, _emberBootstrapComponentsBsDropdownMenuLinkTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownMenuLinkTo['default'];
    }
  });
});
define('frontend/components/bs-dropdown/toggle', ['exports', 'ember-bootstrap/components/bs-dropdown/toggle'], function (exports, _emberBootstrapComponentsBsDropdownToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsDropdownToggle['default'];
    }
  });
});
define('frontend/components/bs-form', ['exports', 'ember-bootstrap/components/bs-form'], function (exports, _emberBootstrapComponentsBsForm) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsForm['default'];
    }
  });
});
define('frontend/components/bs-form/element', ['exports', 'ember-bootstrap/components/bs-form/element'], function (exports, _emberBootstrapComponentsBsFormElement) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElement['default'];
    }
  });
});
define('frontend/components/bs-form/element/control', ['exports', 'ember-bootstrap/components/bs-form/element/control'], function (exports, _emberBootstrapComponentsBsFormElementControl) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementControl['default'];
    }
  });
});
define('frontend/components/bs-form/element/control/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/control/checkbox'], function (exports, _emberBootstrapComponentsBsFormElementControlCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementControlCheckbox['default'];
    }
  });
});
define('frontend/components/bs-form/element/control/input', ['exports', 'ember-bootstrap/components/bs-form/element/control/input'], function (exports, _emberBootstrapComponentsBsFormElementControlInput) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementControlInput['default'];
    }
  });
});
define('frontend/components/bs-form/element/control/textarea', ['exports', 'ember-bootstrap/components/bs-form/element/control/textarea'], function (exports, _emberBootstrapComponentsBsFormElementControlTextarea) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementControlTextarea['default'];
    }
  });
});
define('frontend/components/bs-form/element/errors', ['exports', 'ember-bootstrap/components/bs-form/element/errors'], function (exports, _emberBootstrapComponentsBsFormElementErrors) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementErrors['default'];
    }
  });
});
define('frontend/components/bs-form/element/feedback-icon', ['exports', 'ember-bootstrap/components/bs-form/element/feedback-icon'], function (exports, _emberBootstrapComponentsBsFormElementFeedbackIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementFeedbackIcon['default'];
    }
  });
});
define('frontend/components/bs-form/element/help-text', ['exports', 'ember-bootstrap/components/bs-form/element/help-text'], function (exports, _emberBootstrapComponentsBsFormElementHelpText) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementHelpText['default'];
    }
  });
});
define('frontend/components/bs-form/element/label', ['exports', 'ember-bootstrap/components/bs-form/element/label'], function (exports, _emberBootstrapComponentsBsFormElementLabel) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLabel['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/horizontal', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal'], function (exports, _emberBootstrapComponentsBsFormElementLayoutHorizontal) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutHorizontal['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/horizontal/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal/checkbox'], function (exports, _emberBootstrapComponentsBsFormElementLayoutHorizontalCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutHorizontalCheckbox['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/inline', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline'], function (exports, _emberBootstrapComponentsBsFormElementLayoutInline) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutInline['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/inline/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline/checkbox'], function (exports, _emberBootstrapComponentsBsFormElementLayoutInlineCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutInlineCheckbox['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/vertical', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical'], function (exports, _emberBootstrapComponentsBsFormElementLayoutVertical) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutVertical['default'];
    }
  });
});
define('frontend/components/bs-form/element/layout/vertical/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical/checkbox'], function (exports, _emberBootstrapComponentsBsFormElementLayoutVerticalCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormElementLayoutVerticalCheckbox['default'];
    }
  });
});
define('frontend/components/bs-form/group', ['exports', 'ember-bootstrap/components/bs-form/group'], function (exports, _emberBootstrapComponentsBsFormGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsFormGroup['default'];
    }
  });
});
define('frontend/components/bs-modal-simple', ['exports', 'ember-bootstrap/components/bs-modal-simple'], function (exports, _emberBootstrapComponentsBsModalSimple) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalSimple['default'];
    }
  });
});
define('frontend/components/bs-modal', ['exports', 'ember-bootstrap/components/bs-modal'], function (exports, _emberBootstrapComponentsBsModal) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModal['default'];
    }
  });
});
define('frontend/components/bs-modal/body', ['exports', 'ember-bootstrap/components/bs-modal/body'], function (exports, _emberBootstrapComponentsBsModalBody) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalBody['default'];
    }
  });
});
define('frontend/components/bs-modal/dialog', ['exports', 'ember-bootstrap/components/bs-modal/dialog'], function (exports, _emberBootstrapComponentsBsModalDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalDialog['default'];
    }
  });
});
define('frontend/components/bs-modal/footer', ['exports', 'ember-bootstrap/components/bs-modal/footer'], function (exports, _emberBootstrapComponentsBsModalFooter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalFooter['default'];
    }
  });
});
define('frontend/components/bs-modal/header', ['exports', 'ember-bootstrap/components/bs-modal/header'], function (exports, _emberBootstrapComponentsBsModalHeader) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalHeader['default'];
    }
  });
});
define('frontend/components/bs-modal/header/close', ['exports', 'ember-bootstrap/components/bs-modal/header/close'], function (exports, _emberBootstrapComponentsBsModalHeaderClose) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalHeaderClose['default'];
    }
  });
});
define('frontend/components/bs-modal/header/title', ['exports', 'ember-bootstrap/components/bs-modal/header/title'], function (exports, _emberBootstrapComponentsBsModalHeaderTitle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsModalHeaderTitle['default'];
    }
  });
});
define('frontend/components/bs-nav', ['exports', 'ember-bootstrap/components/bs-nav'], function (exports, _emberBootstrapComponentsBsNav) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNav['default'];
    }
  });
});
define('frontend/components/bs-nav/item', ['exports', 'ember-bootstrap/components/bs-nav/item'], function (exports, _emberBootstrapComponentsBsNavItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavItem['default'];
    }
  });
});
define('frontend/components/bs-nav/link-to', ['exports', 'ember-bootstrap/components/bs-nav/link-to'], function (exports, _emberBootstrapComponentsBsNavLinkTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavLinkTo['default'];
    }
  });
});
define('frontend/components/bs-navbar', ['exports', 'ember-bootstrap/components/bs-navbar'], function (exports, _emberBootstrapComponentsBsNavbar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavbar['default'];
    }
  });
});
define('frontend/components/bs-navbar/content', ['exports', 'ember-bootstrap/components/bs-navbar/content'], function (exports, _emberBootstrapComponentsBsNavbarContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavbarContent['default'];
    }
  });
});
define('frontend/components/bs-navbar/link-to', ['exports', 'ember-bootstrap/components/bs-navbar/link-to'], function (exports, _emberBootstrapComponentsBsNavbarLinkTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavbarLinkTo['default'];
    }
  });
});
define('frontend/components/bs-navbar/nav', ['exports', 'ember-bootstrap/components/bs-navbar/nav'], function (exports, _emberBootstrapComponentsBsNavbarNav) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavbarNav['default'];
    }
  });
});
define('frontend/components/bs-navbar/toggle', ['exports', 'ember-bootstrap/components/bs-navbar/toggle'], function (exports, _emberBootstrapComponentsBsNavbarToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsNavbarToggle['default'];
    }
  });
});
define('frontend/components/bs-popover', ['exports', 'ember-bootstrap/components/bs-popover'], function (exports, _emberBootstrapComponentsBsPopover) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsPopover['default'];
    }
  });
});
define('frontend/components/bs-popover/element', ['exports', 'ember-bootstrap/components/bs-popover/element'], function (exports, _emberBootstrapComponentsBsPopoverElement) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsPopoverElement['default'];
    }
  });
});
define('frontend/components/bs-progress', ['exports', 'ember-bootstrap/components/bs-progress'], function (exports, _emberBootstrapComponentsBsProgress) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsProgress['default'];
    }
  });
});
define('frontend/components/bs-progress/bar', ['exports', 'ember-bootstrap/components/bs-progress/bar'], function (exports, _emberBootstrapComponentsBsProgressBar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsProgressBar['default'];
    }
  });
});
define('frontend/components/bs-tab', ['exports', 'ember-bootstrap/components/bs-tab'], function (exports, _emberBootstrapComponentsBsTab) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsTab['default'];
    }
  });
});
define('frontend/components/bs-tab/pane', ['exports', 'ember-bootstrap/components/bs-tab/pane'], function (exports, _emberBootstrapComponentsBsTabPane) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsTabPane['default'];
    }
  });
});
define('frontend/components/bs-tooltip', ['exports', 'ember-bootstrap/components/bs-tooltip'], function (exports, _emberBootstrapComponentsBsTooltip) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsTooltip['default'];
    }
  });
});
define('frontend/components/bs-tooltip/element', ['exports', 'ember-bootstrap/components/bs-tooltip/element'], function (exports, _emberBootstrapComponentsBsTooltipElement) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapComponentsBsTooltipElement['default'];
    }
  });
});
define('frontend/components/copy-button', ['exports', 'ember-cli-clipboard/components/copy-button'], function (exports, _emberCliClipboardComponentsCopyButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliClipboardComponentsCopyButton['default'];
    }
  });
});
define('frontend/components/echarts-chart', ['exports', 'ember-cli-echarts/components/echarts-chart'], function (exports, _emberCliEchartsComponentsEchartsChart) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliEchartsComponentsEchartsChart['default'];
    }
  });
});
define('frontend/components/ember-ace', ['exports', 'ember-ace/components/ember-ace'], function (exports, _emberAceComponentsEmberAce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAceComponentsEmberAce['default'];
    }
  });
});
define('frontend/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-targeting-parent'], function (exports, _emberPopperComponentsEmberPopperTargetingParent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPopperComponentsEmberPopperTargetingParent['default'];
    }
  });
});
define('frontend/components/ember-popper', ['exports', 'ember-popper/components/ember-popper'], function (exports, _emberPopperComponentsEmberPopper) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPopperComponentsEmberPopper['default'];
    }
  });
});
define('frontend/components/ember-scrollable', ['exports', 'ember-scrollable/components/ember-scrollable'], function (exports, _emberScrollableComponentsEmberScrollable) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberScrollableComponentsEmberScrollable['default'];
    }
  });
});
define('frontend/components/ember-scrollbar', ['exports', 'ember-scrollable/components/ember-scrollbar'], function (exports, _emberScrollableComponentsEmberScrollbar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberScrollableComponentsEmberScrollbar['default'];
    }
  });
});
define('frontend/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('frontend/components/full-calendar', ['exports', 'ember-fullcalendar/components/full-calendar'], function (exports, _emberFullcalendarComponentsFullCalendar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFullcalendarComponentsFullCalendar['default'];
    }
  });
});
define('frontend/components/grid-stack-item', ['exports', 'ember-gridstack/components/grid-stack-item'], function (exports, _emberGridstackComponentsGridStackItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberGridstackComponentsGridStackItem['default'];
    }
  });
});
define('frontend/components/grid-stack', ['exports', 'ember-gridstack/components/grid-stack'], function (exports, _emberGridstackComponentsGridStack) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberGridstackComponentsGridStack['default'];
    }
  });
});
define('frontend/components/light-table', ['exports', 'ember-light-table/components/light-table'], function (exports, _emberLightTableComponentsLightTable) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLightTable['default'];
    }
  });
});
define('frontend/components/light-table/cells/base', ['exports', 'ember-light-table/components/cells/base'], function (exports, _emberLightTableComponentsCellsBase) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsCellsBase['default'];
    }
  });
});
define('frontend/components/light-table/columns/base', ['exports', 'ember-light-table/components/columns/base'], function (exports, _emberLightTableComponentsColumnsBase) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsColumnsBase['default'];
    }
  });
});
define('frontend/components/lt-body', ['exports', 'ember-light-table/components/lt-body'], function (exports, _emberLightTableComponentsLtBody) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtBody['default'];
    }
  });
});
define('frontend/components/lt-column-resizer', ['exports', 'ember-light-table/components/lt-column-resizer'], function (exports, _emberLightTableComponentsLtColumnResizer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtColumnResizer['default'];
    }
  });
});
define('frontend/components/lt-foot', ['exports', 'ember-light-table/components/lt-foot'], function (exports, _emberLightTableComponentsLtFoot) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtFoot['default'];
    }
  });
});
define('frontend/components/lt-head', ['exports', 'ember-light-table/components/lt-head'], function (exports, _emberLightTableComponentsLtHead) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtHead['default'];
    }
  });
});
define('frontend/components/lt-infinity', ['exports', 'ember-light-table/components/lt-infinity'], function (exports, _emberLightTableComponentsLtInfinity) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtInfinity['default'];
    }
  });
});
define('frontend/components/lt-row', ['exports', 'ember-light-table/components/lt-row'], function (exports, _emberLightTableComponentsLtRow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtRow['default'];
    }
  });
});
define('frontend/components/lt-scrollable', ['exports', 'ember-light-table/components/lt-scrollable'], function (exports, _emberLightTableComponentsLtScrollable) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtScrollable['default'];
    }
  });
});
define('frontend/components/lt-spanned-row', ['exports', 'ember-light-table/components/lt-spanned-row'], function (exports, _emberLightTableComponentsLtSpannedRow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLightTableComponentsLtSpannedRow['default'];
    }
  });
});
define('frontend/components/multiselect-checkboxes', ['exports', 'ember-multiselect-checkboxes/components/multiselect-checkboxes'], function (exports, _emberMultiselectCheckboxesComponentsMultiselectCheckboxes) {
  exports['default'] = _emberMultiselectCheckboxesComponentsMultiselectCheckboxes['default'];
});
define('frontend/components/page-numbers', ['exports', 'ember-cli-pagination/components/page-numbers'], function (exports, _emberCliPaginationComponentsPageNumbers) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliPaginationComponentsPageNumbers['default'];
    }
  });
});
define('frontend/components/react-component', ['exports', 'npm:react', 'npm:react-dom', 'ember-cli-react/components/react-component'], function (exports, _npmReact, _npmReactDom, _emberCliReactComponentsReactComponent) {
  /* eslint-enable no-unused-vars */

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliReactComponentsReactComponent['default'];
    }
  });
});
// Must import browserified dependencies from `app/`
// https://github.com/ef4/ember-browserify#using-ember-browserify-in-addons
/* eslint-disable no-unused-vars */
define('frontend/components/resize-detector', ['exports', 'ember-element-resize-detector/components/resize-detector'], function (exports, _emberElementResizeDetectorComponentsResizeDetector) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberElementResizeDetectorComponentsResizeDetector['default'];
    }
  });
});
define('frontend/components/scroll-content-element', ['exports', 'ember-scrollable/components/scroll-content-element'], function (exports, _emberScrollableComponentsScrollContentElement) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberScrollableComponentsScrollContentElement['default'];
    }
  });
});
define('frontend/components/searchable-select-option', ['exports', 'ember-searchable-select/components/searchable-select-option'], function (exports, _emberSearchableSelectComponentsSearchableSelectOption) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectComponentsSearchableSelectOption['default'];
    }
  });
});
define('frontend/components/searchable-select', ['exports', 'ember-searchable-select/components/searchable-select'], function (exports, _emberSearchableSelectComponentsSearchableSelect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectComponentsSearchableSelect['default'];
    }
  });
});
define('frontend/components/simditor-editor', ['exports', 'ember-cli-simditor/components/simditor-editor'], function (exports, _emberCliSimditorComponentsSimditorEditor) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliSimditorComponentsSimditorEditor['default'];
    }
  });
});
define('frontend/components/ui-accordion', ['exports', 'semantic-ui-ember/components/ui-accordion'], function (exports, _semanticUiEmberComponentsUiAccordion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiAccordion['default'];
    }
  });
});
define('frontend/components/ui-calendar', ['exports', 'ember-semantic-ui-calendar/components/ui-calendar'], function (exports, _emberSemanticUiCalendarComponentsUiCalendar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberSemanticUiCalendarComponentsUiCalendar['default'];
    }
  });
});
define('frontend/components/ui-checkbox', ['exports', 'semantic-ui-ember/components/ui-checkbox'], function (exports, _semanticUiEmberComponentsUiCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiCheckbox['default'];
    }
  });
});
define('frontend/components/ui-dimmer', ['exports', 'semantic-ui-ember/components/ui-dimmer'], function (exports, _semanticUiEmberComponentsUiDimmer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiDimmer['default'];
    }
  });
});
define('frontend/components/ui-dropdown', ['exports', 'semantic-ui-ember/components/ui-dropdown'], function (exports, _semanticUiEmberComponentsUiDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiDropdown['default'];
    }
  });
});
define('frontend/components/ui-embed', ['exports', 'semantic-ui-ember/components/ui-embed'], function (exports, _semanticUiEmberComponentsUiEmbed) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiEmbed['default'];
    }
  });
});
define('frontend/components/ui-modal', ['exports', 'semantic-ui-ember/components/ui-modal'], function (exports, _semanticUiEmberComponentsUiModal) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiModal['default'];
    }
  });
});
define('frontend/components/ui-nag', ['exports', 'semantic-ui-ember/components/ui-nag'], function (exports, _semanticUiEmberComponentsUiNag) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiNag['default'];
    }
  });
});
define('frontend/components/ui-popup', ['exports', 'semantic-ui-ember/components/ui-popup'], function (exports, _semanticUiEmberComponentsUiPopup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiPopup['default'];
    }
  });
});
define('frontend/components/ui-progress', ['exports', 'semantic-ui-ember/components/ui-progress'], function (exports, _semanticUiEmberComponentsUiProgress) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiProgress['default'];
    }
  });
});
define('frontend/components/ui-radio', ['exports', 'semantic-ui-ember/components/ui-radio'], function (exports, _semanticUiEmberComponentsUiRadio) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiRadio['default'];
    }
  });
});
define('frontend/components/ui-rating', ['exports', 'semantic-ui-ember/components/ui-rating'], function (exports, _semanticUiEmberComponentsUiRating) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiRating['default'];
    }
  });
});
define('frontend/components/ui-search', ['exports', 'semantic-ui-ember/components/ui-search'], function (exports, _semanticUiEmberComponentsUiSearch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSearch['default'];
    }
  });
});
define('frontend/components/ui-shape', ['exports', 'semantic-ui-ember/components/ui-shape'], function (exports, _semanticUiEmberComponentsUiShape) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiShape['default'];
    }
  });
});
define('frontend/components/ui-sidebar', ['exports', 'semantic-ui-ember/components/ui-sidebar'], function (exports, _semanticUiEmberComponentsUiSidebar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSidebar['default'];
    }
  });
});
define('frontend/components/ui-sticky', ['exports', 'semantic-ui-ember/components/ui-sticky'], function (exports, _semanticUiEmberComponentsUiSticky) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSticky['default'];
    }
  });
});
define('frontend/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _emberWelcomePageComponentsWelcomePage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWelcomePageComponentsWelcomePage['default'];
    }
  });
});
define('frontend/ember-cli-echarts/tests/addon/components/echarts-chart.jshint.lint-test', ['exports'], function (exports) {
  QUnit.module('JSHint | addon/components/echarts-chart.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'addon/components/echarts-chart.js should pass jshint.\naddon/components/echarts-chart.js: line 43, col 66, Expected \'{\' and instead saw \'return\'.\naddon/components/echarts-chart.js: line 68, col 22, Expected \'{\' and instead saw \'chart\'.\naddon/components/echarts-chart.js: line 69, col 10, Expected \'{\' and instead saw \'chart\'.\naddon/components/echarts-chart.js: line 73, col 45, Expected \'{\' and instead saw \'onChartReady\'.\naddon/components/echarts-chart.js: line 27, col 5, \'$\' is not defined.\naddon/components/echarts-chart.js: line 46, col 17, \'$\' is not defined.\naddon/components/echarts-chart.js: line 94, col 5, \'$\' is not defined.\n\n7 errors');
  });
});
define('frontend/ember-cli-echarts/tests/app/components/echarts-chart.jshint.lint-test', ['exports'], function (exports) {
  QUnit.module('JSHint | app/components/echarts-chart.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app/components/echarts-chart.js should pass jshint.');
  });
});
define('frontend/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/app-version', ['exports', 'ember', 'frontend/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _frontendConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _frontendConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('frontend/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _emberComposableHelpersHelpersAppend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend['default'];
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend.append;
    }
  });
});
define('frontend/helpers/array', ['exports', 'ember-composable-helpers/helpers/array'], function (exports, _emberComposableHelpersHelpersArray) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray['default'];
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray.array;
    }
  });
});
define('frontend/helpers/bs-contains', ['exports', 'ember-bootstrap/helpers/bs-contains'], function (exports, _emberBootstrapHelpersBsContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapHelpersBsContains['default'];
    }
  });
  Object.defineProperty(exports, 'bsContains', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapHelpersBsContains.bsContains;
    }
  });
});
define('frontend/helpers/bs-eq', ['exports', 'ember-bootstrap/helpers/bs-eq'], function (exports, _emberBootstrapHelpersBsEq) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapHelpersBsEq['default'];
    }
  });
  Object.defineProperty(exports, 'eq', {
    enumerable: true,
    get: function get() {
      return _emberBootstrapHelpersBsEq.eq;
    }
  });
});
define('frontend/helpers/camelize', ['exports', 'ember-composable-helpers/helpers/camelize'], function (exports, _emberComposableHelpersHelpersCamelize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize['default'];
    }
  });
  Object.defineProperty(exports, 'camelize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize.camelize;
    }
  });
});
define('frontend/helpers/can', ['exports', 'ember-can/helpers/can'], function (exports, _emberCanHelpersCan) {
  exports['default'] = _emberCanHelpersCan['default'];
});
define('frontend/helpers/cancel-all', ['exports', 'ember-concurrency/helpers/cancel-all'], function (exports, _emberConcurrencyHelpersCancelAll) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersCancelAll['default'];
    }
  });
  Object.defineProperty(exports, 'cancelAll', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersCancelAll.cancelAll;
    }
  });
});
define('frontend/helpers/cannot', ['exports', 'ember-can/helpers/cannot'], function (exports, _emberCanHelpersCannot) {
  exports['default'] = _emberCanHelpersCannot['default'];
});
define('frontend/helpers/capitalize', ['exports', 'ember'], function (exports, _ember) {
    exports.capitalize = capitalize;

    function capitalize(params /*, hash*/) {
        if (params && params.length > 0 && params[0]) {
            params = params[0].replace(/_/g, ' ');
            return params.capitalize();
        }
    }

    exports['default'] = _ember['default'].Helper.helper(capitalize);
});
define('frontend/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _emberComposableHelpersHelpersChunk) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk['default'];
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk.chunk;
    }
  });
});
define('frontend/helpers/classify', ['exports', 'ember-composable-helpers/helpers/classify'], function (exports, _emberComposableHelpersHelpersClassify) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify['default'];
    }
  });
  Object.defineProperty(exports, 'classify', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify.classify;
    }
  });
});
define('frontend/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _emberComposableHelpersHelpersCompact) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact['default'];
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact.compact;
    }
  });
});
define('frontend/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _emberComposableHelpersHelpersCompute) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute['default'];
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute.compute;
    }
  });
});
define('frontend/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _emberComposableHelpersHelpersContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains['default'];
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains.contains;
    }
  });
});
define('frontend/helpers/dasherize', ['exports', 'ember-composable-helpers/helpers/dasherize'], function (exports, _emberComposableHelpersHelpersDasherize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize['default'];
    }
  });
  Object.defineProperty(exports, 'dasherize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize.dasherize;
    }
  });
});
define('frontend/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _emberComposableHelpersHelpersDec) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec['default'];
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec.dec;
    }
  });
});
define('frontend/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _emberComposableHelpersHelpersDrop) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop['default'];
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop.drop;
    }
  });
});
define('frontend/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/exists-in', ['exports', 'ember'], function (exports, _ember) {
    exports.existsIn = existsIn;

    function existsIn(params /*, hash*/) {
        if (params && (params[0] || params[0] === 0) && params[1]) {
            return params[1].foreign_key_columns && Object.keys(params[1].foreign_key_columns).indexOf(params[1].columns[params[0]]) > -1;
        }
    }

    exports['default'] = _ember['default'].Helper.helper(existsIn);
});
define('frontend/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _emberComposableHelpersHelpersFilterBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy['default'];
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy.filterBy;
    }
  });
});
define('frontend/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _emberComposableHelpersHelpersFilter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter['default'];
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter.filter;
    }
  });
});
define('frontend/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _emberComposableHelpersHelpersFindBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy['default'];
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy.findBy;
    }
  });
});
define('frontend/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _emberComposableHelpersHelpersFlatten) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten['default'];
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten.flatten;
    }
  });
});
define('frontend/helpers/format-object', ['exports', 'ember'], function (exports, _ember) {
    exports.formatObject = formatObject;

    var isValidUrl = function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    function formatObject(params /*, hash*/) {
        if (params && (params[0] || params[0] == 0 || params[0] == false)) {
            var formattedString = params;
            params = params[0];
            var objType = Object.prototype.toString.call(params).replace(/\[object|\]/g, '').trim();
            if (objType == 'Object') {
                formattedString = JSON.stringify(params);
            } else if (objType == 'Array') {
                formattedString = params.map(function (item) {
                    if (typeof item == 'object') {
                        return JSON.stringify(params);
                    } else {
                        return params;
                    }
                });
            }
            var date = Date.parse(params);
            var dateMatch = params.toString().match('-') != null;
            if (date.toString() != 'NaN' && dateMatch) {
                date = moment(date);
                date = moment.tz(date, moment.tz.guess());

                if (date.hours() || date.minutes() || date.seconds()) {
                    formattedString = date.format('lll');
                } else {
                    formattedString = date.format('ll');
                }
            }
            if (isValidUrl(params)) {
                formattedString = '<a target="_" href="' + params + '">' + params + '</a>';
            }

            return formattedString;
        }
    }

    exports['default'] = _ember['default'].Helper.helper(formatObject);
});
define('frontend/helpers/get-chart-icon', ['exports', 'ember', 'frontend/mixins/result-view-mixin'], function (exports, _ember, _frontendMixinsResultViewMixin) {
    exports.getChartIcon = getChartIcon;

    function getChartIcon(params /*, hash*/) {
        if (params && params[0]) {
            return _frontendMixinsResultViewMixin['default'].mixins[0].properties.resultViewIcons[params[0].toLowerCase()];
        }
        return _frontendMixinsResultViewMixin['default'].mixins[0].properties.resultViewIcons['Line'];
    }

    exports['default'] = _ember['default'].Helper.helper(getChartIcon);
});
define('frontend/helpers/get-column-id', ['exports', 'ember'], function (exports, _ember) {
    exports.getColumnId = getColumnId;

    function getColumnId(params /*, hash*/) {
        if (params && (params[0] || params[0] == 0) && params[1]) {
            var column_name = params[1].columns[params[0]];
            return params[1].foreign_key_columns[column_name];
        }
    }

    exports['default'] = _ember['default'].Helper.helper(getColumnId);
});
define('frontend/helpers/group-by', ['exports', 'ember'], function (exports, _ember) {

    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;

    exports['default'] = function (dependentKey, property) {};

    exports['default'] = _ember['default'].Helper.helper(groupBy);
});
define('frontend/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _emberComposableHelpersHelpersHasNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext['default'];
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext.hasNext;
    }
  });
});
define('frontend/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _emberComposableHelpersHelpersHasPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious.hasPrevious;
    }
  });
});
define('frontend/helpers/html-safe', ['exports', 'ember-composable-helpers/helpers/html-safe'], function (exports, _emberComposableHelpersHelpersHtmlSafe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe['default'];
    }
  });
  Object.defineProperty(exports, 'htmlSafe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe.htmlSafe;
    }
  });
});
define('frontend/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _emberComposableHelpersHelpersInc) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc['default'];
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc.inc;
    }
  });
});
define('frontend/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _emberComposableHelpersHelpersIntersect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect['default'];
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect.intersect;
    }
  });
});
define('frontend/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _emberComposableHelpersHelpersInvoke) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke['default'];
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke.invoke;
    }
  });
});
define('frontend/helpers/is-after', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/is-before', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/is-between', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/is-clipboard-supported', ['exports', 'ember-cli-clipboard/helpers/is-clipboard-supported'], function (exports, _emberCliClipboardHelpersIsClipboardSupported) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliClipboardHelpersIsClipboardSupported['default'];
    }
  });
  Object.defineProperty(exports, 'isClipboardSupported', {
    enumerable: true,
    get: function get() {
      return _emberCliClipboardHelpersIsClipboardSupported.isClipboardSupported;
    }
  });
});
define('frontend/helpers/is-same-or-after', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/is-same-or-before', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/is-same', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _emberComposableHelpersHelpersJoin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin['default'];
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin.join;
    }
  });
});
define('frontend/helpers/localize', ['exports', 'ember'], function (exports, _ember) {
    exports.localize = localize;

    function localize(params /*, hash*/) {
        if (params && params.length > 0 && params[0]) {
            return (+params[0]).toLocaleString();
        }
    }

    exports['default'] = _ember['default'].Helper.helper(localize);
});
define('frontend/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _emberComposableHelpersHelpersMapBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy['default'];
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy.mapBy;
    }
  });
});
define('frontend/helpers/map-value', ['exports', 'semantic-ui-ember/helpers/map-value'], function (exports, _semanticUiEmberHelpersMapValue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberHelpersMapValue['default'];
    }
  });
  Object.defineProperty(exports, 'mapValue', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberHelpersMapValue.mapValue;
    }
  });
});
define('frontend/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _emberComposableHelpersHelpersMap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap['default'];
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap.map;
    }
  });
});
define('frontend/helpers/moment-add', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentAdd) {
  exports['default'] = _emberMomentHelpersMomentAdd['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-calendar', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('frontend/helpers/moment-format', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-from-now', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-from', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentFrom) {
  exports['default'] = _emberMomentHelpersMomentFrom['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-subtract', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentSubtract) {
  exports['default'] = _emberMomentHelpersMomentSubtract['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-to-date', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentToDate) {
  exports['default'] = _emberMomentHelpersMomentToDate['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-to-now', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-to', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentHelpersMomentTo) {
  exports['default'] = _emberMomentHelpersMomentTo['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_frontendConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('frontend/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('frontend/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _emberMomentHelpersMoment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMoment['default'];
    }
  });
});
define('frontend/helpers/momentize', ['exports', 'ember'], function (exports, _ember) {
    exports.momentize = momentize;

    function momentize(params /*, hash*/) {
        if (params && params.length > 0 && params[0]) {
            return moment(params[0]).fromNow();
        }
    }

    exports['default'] = _ember['default'].Helper.helper(momentize);
});
define('frontend/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _emberComposableHelpersHelpersNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext['default'];
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext.next;
    }
  });
});
define('frontend/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('frontend/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _emberComposableHelpersHelpersObjectAt) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt['default'];
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt.objectAt;
    }
  });
});
define('frontend/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _emberComposableHelpersHelpersOptional) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional['default'];
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional.optional;
    }
  });
});
define('frontend/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('frontend/helpers/perform', ['exports', 'ember-concurrency/helpers/perform'], function (exports, _emberConcurrencyHelpersPerform) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersPerform['default'];
    }
  });
  Object.defineProperty(exports, 'perform', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersPerform.perform;
    }
  });
});
define('frontend/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _emberComposableHelpersHelpersPipeAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipeAction['default'];
    }
  });
});
define('frontend/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _emberComposableHelpersHelpersPipe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe['default'];
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe.pipe;
    }
  });
});
define('frontend/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('frontend/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _emberComposableHelpersHelpersPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious.previous;
    }
  });
});
define('frontend/helpers/question-dashboard-settings', ['exports', 'ember'], function (exports, _ember) {
    exports.questionDashboardSettings = questionDashboardSettings;

    function questionDashboardSettings(params /*, hash*/) {
        var dashboard = params[0];
        var question = params[1];
        var nonEditable = params[2];
        var gridSettings = _ember['default'].Object.create(dashboard.get('settings.gridSettings'));
        return gridSettings && gridSettings.get(question.id) || { x: 0, y: 0, width: 6, height: 6, noMove: nonEditable, noResize: nonEditable };
    }

    exports['default'] = _ember['default'].Helper.helper(questionDashboardSettings);
});
define('frontend/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _emberComposableHelpersHelpersQueue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue['default'];
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue.queue;
    }
  });
});
define('frontend/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _emberComposableHelpersHelpersRange) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange['default'];
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange.range;
    }
  });
});
define('frontend/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _emberComposableHelpersHelpersReduce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce['default'];
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce.reduce;
    }
  });
});
define('frontend/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _emberComposableHelpersHelpersRejectBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy['default'];
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy.rejectBy;
    }
  });
});
define('frontend/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _emberComposableHelpersHelpersRepeat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat['default'];
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat.repeat;
    }
  });
});
define('frontend/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _emberComposableHelpersHelpersReverse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse['default'];
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse.reverse;
    }
  });
});
define('frontend/helpers/searchable-select-get', ['exports', 'ember-searchable-select/helpers/searchable-select-get'], function (exports, _emberSearchableSelectHelpersSearchableSelectGet) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectHelpersSearchableSelectGet['default'];
    }
  });
  Object.defineProperty(exports, 'searchableSelectGet', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectHelpersSearchableSelectGet.searchableSelectGet;
    }
  });
});
define('frontend/helpers/searchable-select-highlight-match', ['exports', 'ember-searchable-select/helpers/searchable-select-highlight-match'], function (exports, _emberSearchableSelectHelpersSearchableSelectHighlightMatch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectHelpersSearchableSelectHighlightMatch['default'];
    }
  });
  Object.defineProperty(exports, 'searchableSelectHighlightMatch', {
    enumerable: true,
    get: function get() {
      return _emberSearchableSelectHelpersSearchableSelectHighlightMatch.searchableSelectHighlightMatch;
    }
  });
});
define('frontend/helpers/send', ['exports', 'ember-component-inbound-actions/helpers/send'], function (exports, _emberComponentInboundActionsHelpersSend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComponentInboundActionsHelpersSend['default'];
    }
  });
});
define('frontend/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _emberComposableHelpersHelpersShuffle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle['default'];
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle.shuffle;
    }
  });
});
define('frontend/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('frontend/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _emberComposableHelpersHelpersSlice) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice['default'];
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice.slice;
    }
  });
});
define('frontend/helpers/snapshot-time', ['exports', 'ember'], function (exports, _ember) {
    exports.questionDashboardSettings = questionDashboardSettings;

    var intervalsReverseMapping = {
        7200: '2 hours',
        14400: '4 hours',
        21600: '6 hours',
        28800: '8 hours',
        43200: '12 hours',
        86400: '1 day',
        172800: '2 days',
        604800: '1 week',
        1209600: '2 weeks'
    };

    function questionDashboardSettings(params /*, hash*/) {
        if (params && params[0]) {
            return intervalsReverseMapping[params[0]];
        }
    }

    exports['default'] = _ember['default'].Helper.helper(questionDashboardSettings);
});
define('frontend/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _emberComposableHelpersHelpersSortBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy['default'];
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy.sortBy;
    }
  });
});
define('frontend/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _emberComposableHelpersHelpersTake) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake['default'];
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake.take;
    }
  });
});
define('frontend/helpers/task', ['exports', 'ember-concurrency/helpers/task'], function (exports, _emberConcurrencyHelpersTask) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersTask['default'];
    }
  });
  Object.defineProperty(exports, 'task', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyHelpersTask.task;
    }
  });
});
define('frontend/helpers/titleize', ['exports', 'ember-composable-helpers/helpers/titleize'], function (exports, _emberComposableHelpersHelpersTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize['default'];
    }
  });
  Object.defineProperty(exports, 'titleize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize.titleize;
    }
  });
});
define('frontend/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _emberComposableHelpersHelpersToggleAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggleAction['default'];
    }
  });
});
define('frontend/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _emberComposableHelpersHelpersToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle['default'];
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle.toggle;
    }
  });
});
define('frontend/helpers/truncate', ['exports', 'ember-composable-helpers/helpers/truncate'], function (exports, _emberComposableHelpersHelpersTruncate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate['default'];
    }
  });
  Object.defineProperty(exports, 'truncate', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate.truncate;
    }
  });
});
define('frontend/helpers/underscore', ['exports', 'ember-composable-helpers/helpers/underscore'], function (exports, _emberComposableHelpersHelpersUnderscore) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore['default'];
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore.underscore;
    }
  });
});
define('frontend/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _emberComposableHelpersHelpersUnion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion['default'];
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion.union;
    }
  });
});
define('frontend/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('frontend/helpers/w', ['exports', 'ember-composable-helpers/helpers/w'], function (exports, _emberComposableHelpersHelpersW) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW['default'];
    }
  });
  Object.defineProperty(exports, 'w', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW.w;
    }
  });
});
define('frontend/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _emberComposableHelpersHelpersWithout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout['default'];
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout.without;
    }
  });
});
define('frontend/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('frontend/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'frontend/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _frontendConfigEnvironment) {
  var _config$APP = _frontendConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('frontend/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('frontend/initializers/data-adapter', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/ember-concurrency', ['exports', 'ember-concurrency/initializers/ember-concurrency'], function (exports, _emberConcurrencyInitializersEmberConcurrency) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyInitializersEmberConcurrency['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberConcurrencyInitializersEmberConcurrency.initialize;
    }
  });
});
define('frontend/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _emberDataSetupContainer, _emberData) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('frontend/initializers/export-application-global', ['exports', 'ember', 'frontend/config/environment'], function (exports, _ember, _frontendConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_frontendConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _frontendConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_frontendConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('frontend/initializers/inject-store', ['exports'], function (exports) {
    exports.initialize = initialize;

    function initialize(application) {
        application.inject('component', 'store', 'service:store');
        application.inject('component', 'ajax', 'service:ajax');
        application.inject('controller', 'ajax', 'service:ajax');
    }

    exports['default'] = {
        name: 'inject-store',
        initialize: initialize
    };
});
define('frontend/initializers/injectStore', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/load-bootstrap-config', ['exports', 'frontend/config/environment', 'ember-bootstrap/config'], function (exports, _frontendConfigEnvironment, _emberBootstrapConfig) {
  exports.initialize = initialize;

  function initialize() /* container, application */{
    _emberBootstrapConfig['default'].load(_frontendConfigEnvironment['default']['ember-bootstrap'] || {});
  }

  exports['default'] = {
    name: 'load-bootstrap-config',
    initialize: initialize
  };
});
define('frontend/initializers/responsive', ['exports', 'ember-responsive/initializers/responsive'], function (exports, _emberResponsiveInitializersResponsive) {

  /**
   * Ember responsive initializer
   *
   * Supports auto injecting media service app-wide.
   *
   * Generated by the ember-responsive addon. Customize initialize to change
   * injection.
   */

  exports['default'] = {
    name: 'responsive',
    initialize: _emberResponsiveInitializersResponsive.initialize
  };
});
define('frontend/initializers/setup-ember-can', ['exports', 'require'], function (exports, _require) {
  var Resolver;

  // This is a bit of a hack, but there is no way to detect
  // which module is needed via normal `import` statements
  if (requirejs.entries['ember-resolver'] || requirejs.entries['ember-resolver/index']) {
    // ember-resolver is provided when the consuming
    // application uses ember-resolver@^2.0.0 from NPM
    Resolver = (0, _require['default'])('ember-resolver')['default'];
  } else {
    // ember/resolver is provided when the consuming
    // application uses ember-resolver@^0.1.x from Bower
    Resolver = (0, _require['default'])('ember/resolver')['default'];
  }

  Resolver.reopen({
    pluralizedTypes: {
      ability: 'abilities'
    }
  });

  exports['default'] = {
    name: 'setup-ember-can',
    initialize: function initialize(application) {
      // make sure we create new ability instances each time, otherwise we stomp on each other's models
      if (application.optionsForType) {
        // it's a container / registry in 1.13.x
        application.optionsForType('ability', { singleton: false });
      } else {
        // Ember 2.0.x
        application.registerOptionsForType('ability', { singleton: false });
      }
    }
  };
});
/* globals requirejs */
define('frontend/initializers/store', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/toastr', ['exports', 'ember-toastr/initializers/toastr', 'frontend/config/environment'], function (exports, _emberToastrInitializersToastr, _frontendConfigEnvironment) {

  var toastrOptions = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '4000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };
  var config = _frontendConfigEnvironment['default']['ember-toastr'] || {
    injectAs: 'toast',
    toastrOptions: toastrOptions
  };

  exports['default'] = {
    name: 'ember-toastr',
    initialize: function initialize() {
      // support 1.x and 2.x
      var application = arguments[1] || arguments[0];

      if (!config.toastrOptions) {
        config.toastrOptions = toastrOptions;
      }

      if (!config.injectAs) {
        config.injectAs = 'toast';
      }

      (0, _emberToastrInitializersToastr.initialize)(application, config);
    }
  };
});
define('frontend/initializers/transforms', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define('frontend/initializers/viewport-config', ['exports', 'ember', 'frontend/config/environment', 'ember-in-viewport/utils/can-use-dom'], function (exports, _ember, _frontendConfigEnvironment, _emberInViewportUtilsCanUseDom) {
  exports.initialize = initialize;

  var defaultConfig = {
    viewportEnabled: true,
    viewportSpy: false,
    viewportScrollSensitivity: 1,
    viewportRefreshRate: 100,
    viewportListeners: [{ context: window, event: 'scroll.scrollable' }, { context: window, event: 'resize.resizable' }],
    viewportTolerance: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  };

  if (_emberInViewportUtilsCanUseDom['default']) {
    defaultConfig.viewportListeners.push({
      context: document,
      event: 'touchmove.scrollable'
    });
  }

  var assign = _ember['default'].assign || _ember['default'].merge;

  function initialize() {
    var application = arguments[1] || arguments[0];
    var _config$viewportConfig = _frontendConfigEnvironment['default'].viewportConfig;
    var viewportConfig = _config$viewportConfig === undefined ? {} : _config$viewportConfig;

    var mergedConfig = assign({}, defaultConfig, viewportConfig);

    application.register('config:in-viewport', mergedConfig, { instantiate: false });
  }

  exports['default'] = {
    name: 'viewport-config',
    initialize: initialize
  };
});
define("frontend/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _emberDataInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataInitializeStoreService["default"]
  };
});
define('frontend/mixins/ace-tools', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        suggestAutoCompletions: function suggestAutoCompletions(editor, session, position, prefix, context, callback) {
            if (context && context.get('id')) {
                this.get('ajax').apiCall({
                    url: this.get('ajax.apiPath') + '/sql_autocomplete' + "?database_id=" + context.get('id') + "&prefix=" + prefix,
                    type: 'GET'
                }, function (response, status) {
                    callback(null, response);
                }, function (error, status) {
                    callback(null, []);
                });
            } else {
                callback(null, []);
            }
        }
    });
});
define('frontend/mixins/authentication-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({

        sessionService: _ember['default'].inject.service(),
        beforeModel: function beforeModel(transition) {
            var _this = this;

            this._super.apply(this, arguments);
            this.get('sessionService.setAttemptedTransition')(transition);
            if (!this.get('sessionService.authenticated')) {
                return new _ember['default'].RSVP.Promise(function (resolve, reject) {
                    _this.get('sessionService').verifyToken(function (response, status) {
                        _this.set('sessionService.permissions', response.permissions);
                        resolve(response);
                    }, function (error, status) {
                        _this.transitionTo('login');
                        reject(error);
                    });
                });
            }
        }

    });
});
define('frontend/mixins/base', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _semanticUiEmberMixinsBase) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberMixinsBase['default'];
    }
  });
});
define('frontend/mixins/chart-settings', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({

        resultsWidgets: {
            'Calendar': 'calendar-chart',
            'Number': 'number-chart',
            'Table': 'results-table',
            'Pivot Table': 'pivot-table',
            'Line': 'line-chart',
            'Pie': 'pie-chart',
            'Bars': 'bar-chart',
            'Area': 'area-chart',
            'Bubble': 'bubble-chart',
            'Funnel': 'funnel-chart'
        },
        resultsWidgetComponent: _ember['default'].computed('resultsViewType', function () {
            return this.get('resultsWidgets')[this.get('resultsViewType')] || 'results-table';
        })
    });
});
define('frontend/mixins/colors-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        colors: _ember['default'].computed(function () {
            var _this = this;

            return ['#6574cd', '#f66d9b', '#2bcbba', '#fd9644', '#cd201f', '#a55eea', '#7bd235', '#f1c40f', '#467fcf', '#17a2b8', '#45aaf2', '#5eba00', '#2196F3', '#009688', '#f44336', '#9c27b0', '#009688', '#673AB7', '#3F51B5', '#4CAF50', '#E91E63', '#607D8B', '#FF5722', '#1C9363', '#FF715B', '#2B59C3', '#215B56', '#00bcd4', '#ff5722', '#ffc107', '#301966', '#D36582', '#820646', '#649BC1', '#4B3F72', '#db3340', '#df514c', '#5c2d50', '#5e3448', '#53bbf4', '#59c4c5', '#bff073', '#e45f56', '#c91b26', '#737495', '#5c2d50', '#20457c', '#0f5959', '#9f92aa', '#ffa200', '#24a8ac', '#ff4c65', '#e94c6f', '#354458', '#69d2e7', '#dc2742', '#3a0256', '#17a697', '#064789', '#ffc33c'].map(function (item) {
                return _this.opacity(item, 1);
            });
        }),
        opacity: function opacity(hex, _opacity) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            result = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                a: _opacity
            } : null;
            return 'rgba(' + result.r + ',' + result.g + ', ' + result.b + ', ' + result.a + ' )';
        },
        randomColor: function randomColor() {
            var arr = this.get('colors');
            return arr[Math.floor(Math.random() * arr.length)];
        }
    });
});
define('frontend/mixins/custom-events', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        plotlyResize: new Event('plotlyResize')
    });
});
define('frontend/mixins/dynamic-query-params-controller-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        queryParams: _ember['default'].computed('queryParamsVariables.@each.name', function () {
            return this.get('queryParamsVariables') && this.get('queryParamsVariables').map(function (variable) {
                return 'q_' + variable.get('name');
            }) || [];
        }),
        queryParamsObserver: _ember['default'].on('init', _ember['default'].observer('queryParamsVariables.@each.name', function () {
            var _this = this;

            this.get('queryParamsVariables') && this.get('queryParamsVariables').forEach(function (v) {
                var var_value = _this.get('q_' + v.get('name'));
                var variableChanged = false;
                if (var_value) {
                    v.set('value', var_value);
                    variableChanged = true;
                }
                if (variableChanged) {
                    _this.set('reloadBasedOnQueryParams', true);
                }
            });
        })),
        changeQueryParamsInUrl: function changeQueryParamsInUrl(variables, title) {
            var _this2 = this;

            variables && variables.forEach(function (variable) {
                _this2.set('q_' + (variable.get && variable.get('name') || variable.name), variable.get && variable.get('value') || variable.value);
            });
            var newQueryParams = {};
            this.get('queryParams') && this.get('queryParams').forEach(function (qParam) {
                newQueryParams[qParam] = _this2.get(qParam);
            });
            var searchParams = new window.URLSearchParams(newQueryParams).toString();
            if (searchParams.length > 0) {
                window.history.replaceState({}, title, window.location.pathname + '?' + searchParams);
            }
        }

    });
});
define('frontend/mixins/dynamic-query-params-routes-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        beforeModel: function beforeModel(transition) {
            this._super.apply(this, arguments);
            this.setupqueryParamsOnRoute(transition);
        },

        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.set('currentController', controller);
        },

        setupqueryParamsOnRoute: function setupqueryParamsOnRoute(transition) {
            this.set('variableQueryParams', transition.queryParams);
        },
        actions: {
            willTransition: function willTransition(transition) {
                this._super.apply(this, arguments);
                this.setupqueryParamsOnRoute(transition);
            },
            didTransition: function didTransition() {
                var _this = this;

                this._super.apply(this, arguments);
                var vqp = this.get('variableQueryParams');
                this.set('queryParams', Object.keys(vqp));
                Object.keys(vqp).forEach(function (item) {
                    _this.get('currentController').set(item, vqp[item]);
                });
            }
        }
    });
});
define('frontend/mixins/helper-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({

        capitalize: function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        titleize: function titleize(string) {
            var _this = this;

            var string_array = string.split(' ');
            string_array = string_array.map(function (str) {
                return _this.capitalize(str);
            });

            return string_array.join(' ');
        },
        unique: function unique(arr) {
            var uniqueObjects = [];

            return arr.filter(function (item) {
                if (!uniqueObjects.any(function (i) {
                    return i == item;
                })) {
                    uniqueObjects.push(item);
                    return true;
                }

                return false;
            });
        },
        uniqueByName: function uniqueByName(arr) {
            var uniqueObjects = [];

            return arr.filter(function (item) {
                if (!uniqueObjects.isAny('name', item.get('name'))) {
                    uniqueObjects.push(item);
                    return true;
                }

                return false;
            });
        },
        uniqueByProperty: function uniqueByProperty(arr, prop) {
            var uniqueObjects = [];

            return arr.filter(function (item) {
                if (!uniqueObjects.isAny(prop, item.get && item.get(prop) || item[prop])) {
                    uniqueObjects.push(item);
                    return true;
                }

                return false;
            });
        }
    });
});
define("frontend/mixins/loading-messages", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Mixin.create({
        loadingMessage: (function () {
            var arr = ["All good things take time. :)", "Be calm, and let it load. :)"];
            return arr[Math.floor(Math.random() * arr.length)];
        })()

    });
});
define('frontend/mixins/promise-resolver', ['exports', 'ember-promise-tools/mixins/promise-resolver'], function (exports, _emberPromiseToolsMixinsPromiseResolver) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsMixinsPromiseResolver['default'];
    }
  });
});
define('frontend/mixins/result-view-mixin', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({
        resultViewIcons: {
            'calendar': 'fe fe-calendar',
            'number': 'fe fe-hash',
            'table': 'fe fe-list',
            'line': 'fe fe-trending-up',
            'pie': 'fe fe-pie-chart',
            'funnel': 'fe fe-align-center',
            'bars': 'fe fe-bar-chart',
            'area': 'fe fe-activity',
            'bubble': 'fe fe-circle',
            'pivot table': 'fe fe-eye'
        },

        resultViewDashboardDefaultDimensions: {
            'Calendar': {
                width: 24,
                height: 44
            },
            'Number': {
                width: 12,
                height: 6
            },
            'Table': {
                width: 24,
                height: 24
            },
            'Line': {
                width: 24,
                height: 12
            },
            'Pie': {
                width: 24,
                height: 16
            },
            'Funnel': {
                width: 24,
                height: 16
            },
            'Bars': {
                width: 24,
                height: 12
            },
            'Area': {
                width: 24,
                height: 12
            },
            'Bubble': {
                width: 24,
                height: 12
            },
            'PivotTable': {
                width: 24,
                height: 12
            }
        },

        findIfDate: function findIfDate(el) {
            var date = Date.parse(el);
            var dateMatch = el && el.toString().match('-') != null;
            return date.toString() != 'NaN' && dateMatch;
        },
        findIfNumber: function findIfNumber(el) {
            return parseFloat(el).toString() != NaN.toString();
        },
        any: function any(arr, method) {
            var _this = this;

            return arr.map(function (item) {
                return method.call(_this, item);
            }).reduce(function (a, b) {
                return a || b;
            }, true);
        },
        all: function all(arr, method) {
            var _this2 = this;

            return arr.map(function (item) {
                return method.call(_this2, item);
            }).reduce(function (a, b) {
                return a && b;
            }, true);
        },
        categoryColumnsCount: function categoryColumnsCount(row) {
            var _this3 = this;

            return row.filter(function (item) {
                return !(_this3.findIfNumber(item) || _this3.findIfDate(item) || null);
            }).length;
        },
        autoDetect: function autoDetect(rows) {
            if (rows.length == 0) {
                return 'Table';
            }
            if (rows.length == 1 && rows[0].length < 10 && this.all(rows[rows.length - 1], this.findIfNumber)) {
                return 'Number';
            }
            if (rows[rows.length - 1].length == 2 && this.categoryColumnsCount(rows[rows.length - 1]) == 1 && this.any(rows[0], this.findIfNumber)) {
                return 'Pie';
            }
            if ((this.any(rows[rows.length - 1], this.findIfDate) || this.any(rows[rows.length - 1], this.findIfNumber)) && this.categoryColumnsCount(rows[rows.length - 1]) <= 2 && rows[rows.length - 1].length - this.categoryColumnsCount(rows[rows.length - 1]) >= 2) {
                return 'Line';
            }
            return 'Table';
        }
    });
});
define('frontend/mixins/utils-functions', ['exports', 'ember', 'frontend/mixins/colors-mixin', 'frontend/mixins/result-view-mixin', 'frontend/mixins/helper-mixin'], function (exports, _ember, _frontendMixinsColorsMixin, _frontendMixinsResultViewMixin, _frontendMixinsHelperMixin) {
    exports['default'] = _ember['default'].Mixin.create(_frontendMixinsColorsMixin['default'], _frontendMixinsResultViewMixin['default'], _frontendMixinsHelperMixin['default'], {
        display: function display(params) {
            var formattedString = params;
            var objType = Object.prototype.toString.call(params).replace(/\[object|\]/g, '').trim();
            if (objType == 'Object') {
                formattedString = JSON.stringify(params);
            } else if (params == true || params == false) {
                formattedString = params.toString();
            } else if (objType == 'Array') {
                formattedString = params.map(function (item) {
                    if (typeof item == 'object') {
                        return JSON.stringify(params);
                    } else {
                        return params;
                    }
                });
            }
            if (!isNaN(+params)) {
                formattedString = +params;
            }
            var date = Date.parse(params);
            var dateMatch = params && params.toString().match('-') != null;
            if (date.toString() != 'NaN' && dateMatch) {
                formattedString = moment(date).format('YYYY-MM-DD HH:mm:ss.SSS');
            }

            return formattedString;
        },
        margin: {
            // l: 80,
            r: 5,
            t: 40,
            b: 30,
            pad: 0

        },
        downloadAsPNG: function downloadAsPNG(gd) {
            Plotly.toImage(gd, {
                height: 1600,
                width: 1600
            }).then(function (url) {
                return Plotly.toImage(gd, {
                    format: 'png',
                    height: 1600,
                    width: 1600
                });
            });
        },
        gridParent: _ember['default'].computed(function () {
            return this.$('#' + this.get('randomId')).parents('.grid-stack-item');
        }),

        opts: _ember['default'].computed('jsonData', 'resizeTime', function () {
            _ember['default'].$(this);
            var isGrid = this.$().parents('.grid-stack-item-content').length;
            var parent = this.$().parents('.card-body');
            var height = 500;
            if (isGrid) {
                height = Math.round(parent.innerHeight() || 500) - 10;
            }
            return {
                left: '0%',
                right: '0%',
                width: Math.round(parent.innerWidth()) - 10,
                height: height
            };
        }),
        // dimensions(gridParent) {
        //     let dimensions = {};
        //     if (gridParent && gridParent[0]) {
        //         dimensions = {
        //             height: gridParent.innerHeight() - 90,
        //             width: gridParent.innerWidth() - 30
        //         };
        //     }
        //     return dimensions;
        // },
        // getNode(_this) {
        //     var d3 = Plotly.d3;
        //     let gridParent = _this.get('gridParent');
        //     if (!_this.get('chosenColor')) {
        //         _this.set('chosenColor', _this.randomColor());
        //     }
        //     let dimensions = _this.get('dimensions')(gridParent);
        //     dimensions.height && (dimensions.height += 'px');
        //     dimensions.width && (dimensions.width += 'px');
        //     var gd3 = d3.select('#' + _this.get('randomId'))
        //         .style(dimensions);

        //     return gd3.node();

        // },
        // groupBy(data, type) {
        //     var result = [];

        //     data.forEach(function (item) {
        //         var hasType = result.findBy('type', item.get(type));

        //         if (!hasType) {
        //             result.pushObject(Ember.Object.create({
        //                 type: item.get(type),
        //                 contents: []

        //             }));

        //         }

        //         result.findBy('type', item.get(type)).get('contents').pushObject(item);
        //     });
        //     return result;
        // },
        // hiddenJsonData: Ember.computed('jsonData', function () {
        //     return 'hidden';
        // }),

        convertToTimeDisplay: function convertToTimeDisplay(x) {
            var date = Date.parse(x);
            var dateMatch = x && x.toString().match('-') != null;
            if (date.toString() != 'NaN' && dateMatch) {
                return moment(x).format();
            }
            return x;
        },

        eChartMapping: {
            'Line': 'line',
            'Bars': 'bar',
            'Area': 'line',
            'Bubble': 'scatter',
            'Pie': 'pie',
            'Funnel': 'funnel'
        },
        chartDimensionsObserver: _ember['default'].on('init', _ember['default'].observer('jsonData', function () {
            var _this = this;

            var data = this.get('results');
            var x1 = this.get('x1');
            var x2Values = this.get('x2Values');
            var ogMultipleYs = this.get('multipleYs');
            if (data && x1 && ogMultipleYs && ogMultipleYs.length >= 0) {
                var multipleYs = ogMultipleYs.map(function (y) {
                    return y ? data.columns.indexOf(y.columnName) : -1;
                }).filter(function (i) {
                    return i >= 0;
                }).map(function (y) {
                    return data.columns[y];
                });
                var dimensions = [x1];
                var series = [];
                multipleYs.forEach(function (y) {
                    var selectedChartType = ogMultipleYs.filter(function (yObj) {
                        return yObj && yObj.columnName === y;
                    })[0].chartType || _this.get('defaultChartType') || '';
                    var itemStyle = itemStyle = {
                        normal: {
                            label: {
                                show: false,
                                position: 'top'
                            }
                        }
                    };
                    if (selectedChartType.toLowerCase() == 'area') {
                        itemStyle['normal']['areaStyle'] = {
                            type: 'default'
                        };
                    }
                    if (x2Values) {
                        x2Values.forEach(function (x2Value) {
                            var seriesName = null;
                            if (multipleYs.length === 1) {
                                seriesName = _this.display(x2Value);
                                dimensions.push(seriesName);
                            } else {
                                seriesName = _this.display(x2Value) + '-' + _this.display(y);
                                dimensions.push(seriesName);
                            }
                            series.push({
                                type: _this.eChartMapping[selectedChartType],
                                name: seriesName,
                                itemStyle: itemStyle,
                                stack: _this.get('isStacked'),
                                barGap: '5%'
                            });
                        });
                    } else {

                        series.push({
                            type: _this.eChartMapping[selectedChartType],
                            name: y,
                            itemStyle: itemStyle,
                            stack: _this.get('isStacked'),
                            barGap: '5%'
                        });
                        dimensions.push(y);
                    }
                });
                this.set('chartDimensions', dimensions);
                this.set('series', series);
            }
        })),
        x2Values: _ember['default'].computed('x2', 'results', function () {
            var data = this.get('results');
            var x2 = this.get('x2');
            x2 = data.columns.indexOf(x2);
            return x2 >= 0 && this.unique(data.rows.map(function (item) {
                return item[x2];
            }));
        }),
        compareOnType: function compareOnType(a, b) {
            var type = 'category';
            if (!isNaN(+a) || !isNaN(+b)) {
                type = 'number';
            }
            var date1 = Date.parse(a);
            var date2 = Date.parse(b);
            var dateMatch1 = a && a.toString().match('-') != null;
            var dateMatch2 = b && b.toString().match('-') != null;
            if (date1.toString() != 'NaN' || date2.toString() != 'NaN' && (dateMatch1 || dateMatch2)) {
                type = 'date';
            }

            if (type === 'category') {
                if (a < b) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (type === 'number') {
                return a - b;
            } else {
                return moment(a) - moment(b);
            }
        },
        seriesWithData: _ember['default'].computed('jsonData', 'series', function () {
            var _this2 = this;

            var jsonData = this.get('jsonData');
            var series = this.get('series');
            var seriesWithData = jsonData && series && series.map(function (item, index) {
                var data = [];
                if (_this2.get('defaultChartType') != 'Pie' && _this2.get('defaultChartType') != 'Funnel') {

                    data = jsonData.map(function (d) {
                        return [d[0], d[index + 1]];
                    }).filter(function (item) {
                        return item[1];
                    }).sort(function (a, b) {
                        return _this2.compareOnType(a[0], b[0]);
                    });
                } else {
                    data = jsonData.map(function (d) {
                        return {
                            name: d[0],
                            value: d[index + 1]
                        };
                    }).filter(function (item) {
                        return item['value'];
                    }).sort(function (a, b) {
                        return _this2.compareOnType(a['name'], b['name']);
                    });
                }
                item['data'] = data;
                if (item['type'] == 'scatter') {
                    (function () {
                        var max = Math.max.apply(null, data.map(function (d) {
                            return d[1];
                        }));
                        item['symbolSize'] = function (value) {
                            return Math.round(value[1] / max * 100 + 5);
                        };
                    })();
                } else if (_this2.get('defaultChartType') == 'Pie' || _this2.get('defaultChartType') === 'Funnel') {
                    item['radius'] = ['50%', '80%'];
                    item['center'] = ['60%', '50%'];
                    item['type'] = _this2.eChartMapping[_this2.get('defaultChartType')];
                    item['labelLine'] = {
                        normal: {
                            show: true
                        }
                    };
                    item['label'] = {
                        show: true,
                        formatter: function formatter(params) {
                            return _this2.formatter(params.name) + ': ' + params.percent + '%';
                        }
                    };
                    item['itemStyle'] = {
                        borderColor: '#fff',
                        borderWidth: 1,
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    };
                    if (_this2.get('defaultChartType') === 'Funnel') {
                        item['left'] = '20%';
                        item['width'] = '60%';
                    }
                }
                return item;
            });
            return seriesWithData;
        }),
        jsonData: _ember['default'].computed('x1', 'x2', 'multipleYs.@each.separateYaxis', 'multipleYs.@each.columnName', 'multipleYs.@each.chartType', 'multipleYs.@each.lineShape', 'isStacked', 'results', function () {
            var _this3 = this;

            var data = this.get('results');
            var multipleYs = this.get('multipleYs');
            var x1 = this.get('x1');
            var x2 = this.get('x2');
            if (data && x1 && multipleYs && multipleYs.length >= 0) {
                var x2;
                var x1;
                var multipleYs;
                var tableData;

                var _ret2 = (function () {
                    x2 = data.columns.indexOf(x2);
                    x1 = data.columns.indexOf(x1);
                    multipleYs = multipleYs.map(function (y) {
                        return y ? data.columns.indexOf(y.columnName) : -1;
                    }).filter(function (i) {
                        return i >= 0;
                    });

                    var x2Values = _this3.get('x2Values');

                    tableData = [];

                    data.rows.forEach(function (item) {
                        var row = [_this3.display(item[x1])];
                        multipleYs.forEach(function (y) {
                            if (x2Values) {
                                x2Values.forEach(function (x2Value) {
                                    if (item[x2] == x2Value) {
                                        row.push(_this3.display(item[y]));
                                    } else {
                                        row.push(null);
                                    }
                                });
                            } else {
                                row.push(_this3.display(item[y]));
                            }
                        });
                        tableData.push(row);
                    });
                    return {
                        v: tableData
                    };
                    // let xhash = {};
                    // data.rows.forEach((item) => {
                    //     xhash[this.get('display')(item[x1])] = {};
                    //     multipleYs.forEach((y) => {
                    //         xhash[this.get('display')(item[x1])][data.columns[y]] = this.get('display')(item[y]);
                    //     });
                    // });
                    // let jsonData = [];
                    // let x1Dimension = data.columns[x1];
                    // Object.keys(xhash).forEach((key) => {
                    //     xhash[key][x1Dimension] = key;
                    //     jsonData.push(xhash[key]);
                    // });
                    // return jsonData;
                    // data = multipleYs.map((y) => {
                    //     let d = data.rows.map((item) => {
                    //         return Ember.Object.create({
                    //             x1: item[x1],
                    //             displayX1: this.get('display')(item[x1]),
                    //             x2: item[x2],
                    //             displayX2: this.get('display')(item[x2]),
                    //             y: item[y],
                    //             displayY: this.get('display')(item[y]),
                    //         });
                    //     });
                    //     return this.get('groupBy')(d, 'x2');
                    // });
                    // return data;
                })();

                if (typeof _ret2 === 'object') return _ret2.v;
            }
        }),
        x1: _ember['default'].computed.alias('resultsViewSettings.x1'),
        resultsObserverThatSetsX1: _ember['default'].on('init', _ember['default'].observer('results', 'x1', function () {
            if (!this.get('resultsViewSettings.x1')) {
                var results = this.get('results');
                var rows = results && results.rows.length && results.rows[0];
                var found = null;

                // if (this.get('resultsViewType') == 'Pie' || this.get('resultsViewType') == 'Funnel') {
                //     if (rows) {

                //         for (var i = 0; i < rows.length; i++) {
                //             if (this.findIfNumber(rows[i])) {
                //                 (found = i);
                //                 break;
                //             }
                //         }
                //         if (found == 0 || found) {
                //             this.set('x1', results.columns[i]);
                //         }
                //     }
                // } else {
                if (rows) {
                    for (var i = 0; i < rows.length; i++) {
                        if (this.findIfDate(rows[i])) {
                            found = i;
                            break;
                        }
                    }
                    if (found == 0 || found) {
                        return this.set('x1', results.columns[i]);
                    }
                    for (var i = 0; i < rows.length; i++) {
                        if (this.findIfNumber(rows[i])) {
                            found = i;
                            break;
                        }
                    }
                    if (found == 0 || found) {
                        return this.set('x1', results.columns[i]);
                    }
                }
                // }
            }
        })),
        // resultsObserverThatChecksCords: Ember.on('init', Ember.observer('results', 'x2', "multipleYs", "x1", function(){
        //     let x1 = this.get('x1')
        //     let x2 = this.get('x2')
        //     let multipleYs = this.get('multipleYs')
        //     this.set("multipleYs", multipleYs && multipleYs.filter(function(item){
        //         return (item.columnName != x1) || (item.columnName != x2)
        //     }))
        // })),
        // resultsObserverThatSetsX2: Ember.on('init', Ember.observer('results', 'x2', function () {
        //     if (!this.get('resultsViewSettings.x1')) {
        //         let results = this.get('results');
        //         let rows = results && results.rows.length && results.rows[0];
        //         let row = rows && rows.length && rows[0];
        //         let found = null;
        //         if (!(this.get('resultsViewType') == 'Pie')) {
        //             if (row) {
        //                 for (var i = 0; i < row.length; i++) {
        //                     if (!(this.findIfDate(row[i]) || this.findIfNumber(row[i]))) {
        //                         let items = rows.map(function (item) {
        //                             return item && item[i];
        //                         });
        //                         let canBeSet = (this.unique(items)).length <= 10;
        //                         if (canBeSet) {
        //                             (found = i);
        //                             break;
        //                         }
        //                     }
        //                 }
        //                 if (found == 0 || found) {
        //                     this.set('x2', results.columns[i]);
        //                 }
        //             }
        //         }
        //     }
        // })),

        resultsObserverThatSetsMultipleYs: _ember['default'].on('init', _ember['default'].observer('results', 'multipleYs', function () {
            var _this4 = this;

            var results = this.get('results');
            var rows = results && results.rows.length && results.rows[0];
            var multipleYs = this.get('resultsViewSettings.multipleYs');
            var found = null;
            var lengthMultipleYs = multipleYs && multipleYs.filter(function (item) {
                return item.columnName;
            }).length;
            if (!multipleYs || lengthMultipleYs == 0) {
                if (rows) {
                    (function () {
                        // if (this.get('resultsViewType') == 'Pie' || this.get('resultsViewType') == 'Funnel') {
                        //     for (var i = 0; i < rows.length; i++) {
                        //         if (!(this.findIfDate(rows[i]) || this.findIfNumber(rows[i]))) {
                        //             (found = i);
                        //             break;
                        //         }
                        //     }
                        //     if (found == 0 || found) {
                        //         this.set('multipleYs', [{
                        //             columnName: results.columns[i]
                        //         }]);
                        //     }
                        // } else {
                        var count = 0;
                        var multipleYs = rows.filter(function (item, i) {
                            var canBeSet = count < 4 && !_this4.findIfDate(item) && _this4.findIfNumber(item);
                            canBeSet && (count += 1);
                            return canBeSet;
                        }).map(function (item) {
                            return {
                                columnName: results.columns[rows.indexOf(item)]
                            };
                        });
                        if (multipleYs.length == 0) {
                            _this4.set('multipleYs', [{}]);
                        } else {
                            _this4.set('multipleYs', multipleYs);
                        }
                        // }
                    })();
                }
            }
        })),
        x2: _ember['default'].computed.alias('resultsViewSettings.x2'),
        multipleYs: _ember['default'].computed.alias('resultsViewSettings.multipleYs'),
        ys: _ember['default'].on('init', _ember['default'].observer('resultsViewSettings.y', function () {
            var multipleYs = this.get('multipleYs');
            var y = this.get('resultsViewSettings.y') || this.get('y');
            if (y && !multipleYs) {
                this.set('multipleYs', [{
                    columnName: y
                }]);
            } else if (y && multipleYs) {
                if (!multipleYs.findBy('columnName', y)) multipleYs.pushObject({
                    columnName: y
                });
            } else if (!y && multipleYs) {} else {
                this.set('multipleYs', [{
                    columnName: y
                }]);
            }
        })),
        y: _ember['default'].computed.alias('resultsViewSettings.y'),
        yLabel: _ember['default'].computed.alias('resultsViewSettings.yLabel'),
        xLabel: _ember['default'].computed.alias('resultsViewSettings.xLabel'),
        title: _ember['default'].computed.alias('resultsViewSettings.title'),
        barOrientation: _ember['default'].computed('resultsViewSettings.barOrientation', function () {
            var orientation = this.get('resultsViewSettings.barOrientation');
            if (orientation) {
                return orientation.value;
            }
            return 'v';
        }),
        isStacked: _ember['default'].computed('resultsViewSettings.isStacked', function () {
            var mode = this.get('resultsViewSettings.isStacked');
            // if (mode) {
            //     return mode.value ? 'stacked' : false;
            // }
            return false;
        }),
        // randomId: Ember.computed(function () {

        //     return 'chart-' + Math.floor((Math.random() * 100000000000000) + 1);
        // }),

        // layout: Ember.computed('title', 'margin', 'xLabel', 'yLabel', 'jsonData', function () {
        //     let l = {
        //         legend: {
        //             orientation: 'h',
        //             y: 100
        //         },
        //         title: this.get('title'),
        //         margin: this.get('margin'),
        //         xaxis: {
        //             showgrid: false,
        //             zeroline: false,
        //             linecolor: '#e0e5ec',
        //             title: Ember.String.capitalize(this.get('xLabel') || this.get('x1')),
        //             autorange: true,
        //             ticks: 'outside',
        //             ticoklen: 6,
        //             tickcolor: '#e0e5ec',
        //             tickfont: {
        //                 size: '10'
        //             },
        //             rangemode: 'tozero',
        //             showLine: true
        //         },
        //         yaxis: {
        //             showgrid: false,
        //             zeroline: false,
        //             linecolor: '#e0e5ec',
        //             gridcolor: '#f1f1f1',
        //             title: Ember.String.capitalize(this.get('yLabel') || this.get('multipleYs')[0].columnName),
        //             autorange: true,
        //             ticks: 'outside',
        //             ticklen: 6,
        //             tickfont: {
        //                 size: '10'
        //             },
        //             tickcolor: '#e0e5ec',
        //             rangemode: 'tozero',
        //             showLine: true
        //         },
        //         hoverlabel: {
        //             bgcolor: 'black',
        //             font: {
        //                 color: 'white'
        //             }
        //         },
        //         font: {
        //             family: 'Lato',
        //             size: '1em',
        //             color: '#495057'
        //         }

        //     };

        //     this.get('multipleYs').forEach((item, i) => {
        //         if (item && item.separateYaxis && i != 0) {
        //             let yaxisName = 'yaxis' + (i + 1).toString();
        //             l[yaxisName] = {
        //                 title: item && item.columnName,
        //                 titlefont: {
        //                     color: this.get('colors')[i]
        //                 },
        //                 tickfont: {
        //                     color: this.get('colors')[i]
        //                 },
        //                 overlaying: 'y',
        //                 side: 'right'
        //             };
        //             l['margin'] = null;
        //         }
        //     });
        //     return l;

        // }),

        // legendName(item, i) {
        //     return item.get('type') || this.get('multipleYs')[i].columnName;
        // },

        getChartType: function getChartType(i) {
            var chartType = this.get('multipleYs')[i].chartType;
            var defaultChartType = this.get('defaultChartType');
            return _ember['default'].String.capitalize(chartType || defaultChartType);
        },

        // mode(item) {
        //     if (item.length >= 31) {
        //         return 'lines';
        //     } else {
        //         return 'lines+markers';
        //     }
        // },
        // getMarker(x, i, j, _this) {
        //     let size = 4;
        //     let width = 2;
        //     let xLength = x.length;
        //     if (xLength > 40) {
        //         width = 1.3;
        //     }
        //     if (xLength > 200) {
        //         size = 0.1;
        //         width = 0.1;
        //     }

        //     return {
        //         symbol: 'circle',
        //         opacity: 1,
        //         size: size,
        //         color: 'white',
        //         line: {
        //             color: _this.get('colors')[i + j],
        //             width: width
        //         }

        //     };

        // },

        // // lineWidth(x) {
        //     let xLength = x.length;
        //     let lineWidth = 2;
        //     if (x.length > 40 && xLength <= 100) {
        //         lineWidth = 2;
        //     } else if (xLength > 60) {
        //         1.3;
        //     }
        //     return lineWidth;
        // },

        // chartData(item, i, j, type, _this) {
        //     let x = item.get('contents').sortBy('x1').map((el) => {
        //         return el.get('displayX1');
        //     });
        //     let y = item.get('contents').sortBy('x1').map((el) => {
        //         return el.get('displayY');
        //     });
        //     let d = null;
        //     if (type == 'Line') {
        //         d = {
        //             x: x,
        //             y: y,
        //             type: 'scatter',
        //             mode: _this.mode(item),
        //             marker: _this.get('getMarker')(x, i, j, _this),

        //             line: {
        //                 shape: _this.get('multipleYs')[i].lineShape,
        //                 width: _this.get('lineWidth')(x),
        //                 color: _this.get('colors')[i + j]
        //             },
        //             name: _this.legendName(item, i)
        //         };
        //     } else if (type == 'Bars') {
        //         d = {
        //             x: x,
        //             y: y,
        //             type: 'bar',
        //             marker: {
        //                 color: _this.get('colors')[i + j]
        //             },
        //             name: _this.legendName(item, i)
        //         };
        //     } else if (type == 'Area') {
        //         d = {
        //             x: x,
        //             y: y,
        //             // type: 'scatter',
        //             fill: 'tonexty',
        //             line: {
        //                 width: 1,
        //                 color: _this.get('colors')[i + j]
        //             },
        //             name: _this.legendName(item, i)
        //         };

        //     } else if (type == 'Bubble') {
        //         let total = item.get('contents').sortBy('x1').map((el) => {
        //             return el.get('y');
        //         }).reduce((a, b) => {
        //             return a + b;
        //         }, 0);
        //         d = {
        //             x: x,
        //             y: y,
        //             type: 'scatter',
        //             mode: 'markers',
        //             marker: {
        //                 size: item.get('contents').sortBy('x1').map((el) => {
        //                     return (+el.get('y') / total) * 600;
        //                 }),
        //                 color: _this.get('colors')[i + j],
        //             },
        //             name: _this.legendName(item, i)
        //         };
        //     }

        //     _this.get('multipleYs').forEach((item, j) => {
        //         if (item && item.separateYaxis && j != 0 && i == j) {
        //             d['yaxis'] = 'y' + (i + 1).toString();
        //         }
        //     });
        //     return d;

        // },
        // chartLine(){},

        // legendName(item, i){
        //     return item.get('type') || this.get('multipleYs')[i].columnName
        // },
        // chartMarker(i, j){
        //     return {
        //         color: this.get('colors')[i + j]
        //     }
        // },
        // dataModified(data){
        //     return data
        // },
        // chartFill: null,
        // getData(){
        //     let gridParent = this.get('gridParent')
        //         let gd = this.get('getNode')(this)
        //         var data =  this.get('jsonData'), layout;
        //         data = data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
        //             return series.map((item, j)=>{
        //                 return  {
        //                     x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
        //                     y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
        //                     type: this.get("chartType"),
        //                     mode: this.get('chartMode'),
        //                     line: this.chartLine(i, j),
        //                     fill: this.get('chartFill'),
        //                     marker: this.chartMarker(i, j, item),
        //                     name: this.legendName(item, i)
        //                 }
        //             })
        //         }));
        //         layout = data && this.get('layout')
        //         layout["barmode"]= "group"
        //         data = this.dataModified(data)
        //         data && Plotly.newPlot(gd, data, layout, {showLink: false})
        //             .then(this.get('downloadAsPNG'));
        //         data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
        //             let dimensions = _this.get('dimensions')(gridParent)
        //             Plotly.relayout(_this.get("randomId"), dimensions)
        //         });
        // }
        source: _ember['default'].computed('jsonData', function () {
            var jsonData = this.get('jsonData');
            if (jsonData) {
                return jsonData.sort(function (a, b) {
                    return a[0] - b[0];
                });
            } else {
                return [];
            }
        }),
        optionsObserver: _ember['default'].on('init', _ember['default'].observer('seriesWithData', 'xName', 'yName', 'opts', function () {
            _ember['default'].run.debounce(this, function () {
                var _this5 = this;

                if (this.get('seriesWithData')) {
                    var legendOrient = 'horizontal';
                    var legendX = 'center';
                    var toolTipTrigger = 'axis';
                    var showXline = true;
                    var showYLine = true;
                    var toolTipFormatter = function toolTipFormatter(params) {
                        return '<b>' + _this5.titleize(_this5.get('xName')) + '</b>' + ' : ' + (params[0].name && params[0].name != '' ? _this5.formatter(params[0].name) : _this5.xFormatter(_this5)(params[0].axisValue)) + '<br/>' + params.map(function (p) {
                            return '<b>' + _this5.titleize(p.seriesName) + '</b>' + ' : ' + _this5.formatter(p.value[1], 0);
                        }).join('<br/>');
                    };
                    if (this.get('defaultChartType') == 'Pie' || this.get('defaultChartType') == 'Funnel') {
                        legendOrient = 'vertical';
                        legendX = 'left';
                        toolTipTrigger = 'item';
                        showXline = false;
                        showYLine = false;
                        toolTipFormatter = function (params) {
                            return '<b>' + _this5.titleize(_this5.get('xName')) + '</b>' + ' : ' + _this5.formatter(params.name) + '<br/>' + '<b>' + _this5.titleize(params.seriesName) + '</b>' + ' : ' + params.value + '(' + params.percent + '%)';
                        };
                    }
                    var options = {
                        backgroundColor: '#fff',
                        grid: {
                            left: 80,
                            right: 15
                        },
                        legend: {
                            type: 'scroll',
                            formatter: this.formatter,
                            pageIconColor: '#495057',
                            orient: legendOrient,
                            x: legendX,
                            left: '2%',
                            top: '2%',
                            right: 50
                        },
                        textStyle: {
                            fontFamily: 'Lato'
                        },
                        tooltip: {
                            show: true,
                            trigger: toolTipTrigger,
                            formatter: toolTipFormatter,
                            backgroundColor: this.opacity('#000000', 0.7),
                            borderColor: '#e0e5ec',
                            borderWidth: 1,
                            textStyle: {
                                color: this.opacity('#ffffff', 0.9),
                                fontSize: 12
                            },
                            enterable: true,
                            axisPointer: {
                                lineStyle: {
                                    color: '#e0e5ec'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataZoom: {
                                    show: true,
                                    title: {
                                        zoom: 'Zoom',
                                        back: 'Restore Zoom'
                                    },
                                    yAxisIndex: false
                                }
                            }
                        },
                        color: this.get('colors'),
                        // Declare X axis, which is a category axis, mapping
                        // to the first column by default.
                        xAxis: {
                            show: showXline,
                            type: this.get('xType'),
                            name: this.get('xName'),
                            nameLocation: 'center',
                            nameGap: 20,
                            nameTextStyle: {
                                padding: 8,
                                color: '#495057',
                                fontSize: 12
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#e0e5ec'
                                }
                            },
                            axisLabel: {
                                formatter: this.xFormatter(this),
                                color: '#495057',
                                fontSize: 10
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        // Declare Y axis, which is a value axis.
                        yAxis: {
                            show: showYLine,
                            type: this.get('yType'),
                            name: this.get('yName'),
                            nameGap: 50,
                            nameLocation: 'center',
                            nameTextStyle: {
                                padding: 8,
                                color: '#495057',
                                fontSize: 12
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#e0e5ec'
                                }
                            },
                            axisLabel: {
                                formatter: this.yFormatter(this),
                                color: '#495057',
                                fontSize: 10
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        // Declare several series, each of them mapped to a
                        // column of the dataset by default.
                        series: this.get('seriesWithData')
                    };
                    this.set('options', options);
                    this.set('randomId', false);
                    _ember['default'].run.next(this, function () {
                        if (!this.get || !this.get('isDestroyed')) {
                            this.set('randomId', 100000 * Math.random());
                        }
                    });
                }
            }, 300);
        })),
        formatter: function formatter(x, index) {

            var date = Date.parse(x);
            var dateMatch = x && x.toString().match('-') != null;
            if (date.toString() != 'NaN' && dateMatch) {
                date = moment(x);
                date = moment.tz(date, moment.tz.guess());
                if (date.hours() || date.minutes() || date.seconds()) {
                    return date.format('lll');
                } else {
                    return date.format('ll');
                }
            }
            if (!isNaN(+x)) {
                return (+x).toLocaleString();
            }
            return x;
        },

        timeFormatter: function timeFormatter(x, index) {
            var date = moment(x);
            date = moment.tz(date, moment.tz.guess());
            if (date.hours() || date.minutes() || date.seconds()) {
                return date.format('lll');
            } else {
                return date.format('ll');
            }
        },
        yFormatter: function yFormatter(context) {
            if (context.get('yType') === 'time') {
                return this.timeFormatter;
            } else {
                return this.formatter;
            }
        },
        xFormatter: function xFormatter(context) {
            if (context.get('xType') === 'time') {
                return this.timeFormatter;
            } else {
                return this.formatter;
            }
        },

        determineType: function determineType(data) {
            var type = null;
            data && data.every(function (x) {
                if (x || x == 0 || x == false) {
                    var date = Date.parse(x);
                    var dateMatch = x && x.toString().match('-') != null;
                    if (date.toString() != 'NaN' && dateMatch) {
                        type = 'time';
                        return false;
                    }
                    if (typeof x == 'number') {
                        type = 'value';
                        return false;
                    }
                    type = 'category';
                    return false;
                }
                return true;
            });
            return type;
        },
        yType: _ember['default'].computed('jsonData', function () {
            var data = this.get('jsonData') && this.get('jsonData').map(function (row) {
                return row[1];
            });
            return this.determineType(data);
        }),

        xType: _ember['default'].computed('jsonData', function () {
            var data = this.get('jsonData') && this.get('jsonData').map(function (row) {
                return row[0];
            });
            return this.determineType(data);
        }),
        xLabelObserver: _ember['default'].on('init', _ember['default'].observer('xLabel', function () {
            _ember['default'].run.debounce(this, function () {
                this.set('debouncedXLabel', this.get('xLabel'));
            }, 2000);
        })),

        xName: _ember['default'].computed('x1', 'debouncedXLabel', function () {
            return this.get('debouncedXLabel') || this.get('x1') && this.titleize(this.get('x1'));
        }),
        yLabelObserver: _ember['default'].on('init', _ember['default'].observer('yLabel', function () {
            _ember['default'].run.debounce(this, function () {
                this.set('debouncedYLabel', this.get('yLabel'));
            }, 2000);
        })),
        yName: _ember['default'].computed('multipleYs.@each', 'debouncedYLabel', function () {
            return this.get('debouncedYLabel') || this.get('multipleYs') && this.get('multipleYs').length == 1 && this.get('multipleYs')[0] && this.titleize(this.get('multipleYs')[0].columnName);
        })

    });
});
define('frontend/mixins/widget-components', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Mixin.create({

        widgetItemKeyValuePairs: _ember['default'].computed('widget.widget_items.@each', 'widget.widget_items.isFulfilled', function () {
            var widget_items = this.get('widget.widget_items');
            var obj = {};
            widget_items && widget_items.forEach(function (item) {
                obj[item.get('value')] = item;
            });

            return obj;
        }),

        applicableWidgetItem: _ember['default'].computed('widgetItemKeyValuePairs', 'el', function () {
            return this.get('widgetItemKeyValuePairs')[this.get('el')];
        }),

        widgetComponentNames: {
            progress_bar: 'progress-bar',
            direction: 'direction-widget',
            icon_and_text: 'icon-and-text',
            tag: 'tag-widget',
            row_color: 'row-color',
            row_border: 'row-border',
            prefix: 'prefix-widget',
            suffix: 'suffix-widget'
        }

    });
});
define('frontend/models/alert-event', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        alert_level: _emberData['default'].attr('string'),
        row_numbers: _emberData['default'].attr('array'),
        data: _emberData['default'].attr('object'),
        is_data_saved: _emberData['default'].attr('boolean'),
        alert_level_setting: _emberData['default'].belongsTo('alert_level_setting'),
        alert_setting: _emberData['default'].belongsTo('alert_setting'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')
    });
});
define('frontend/models/alert-level-setting', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        value: _emberData['default'].attr('string'),
        level: _emberData['default'].attr('string'),

        alert_setting: _emberData['default'].belongsTo('alert_setting'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')
    });
});
define('frontend/models/alert-notification-setting', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        method: _emberData['default'].attr('string'),
        recipients: _emberData['default'].attr('array'),
        alert_setting: _emberData['default'].belongsTo('alert_setting'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')
    });
});
define('frontend/models/alert-setting', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        aggregation: _emberData['default'].attr('string'),
        operation: _emberData['default'].attr('string'),
        number_of_rows: _emberData['default'].attr('number'),
        column: _emberData['default'].attr('string'),
        traversal: _emberData['default'].attr('string'),
        is_active: _emberData['default'].attr('boolean'),
        frequency_value_in_seconds: _emberData['default'].attr('number'),
        start_time: _emberData['default'].attr('date'),
        scheduled_disabled_config: _emberData['default'].attr('object'),
        silent_till: _emberData['default'].attr('date'),
        question: _emberData['default'].belongsTo('question'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        alert_level_settings: _emberData['default'].hasMany('alert_level_settings'),
        alert_notification_settings: _emberData['default'].hasMany('alert_notification_settings')
    });
});
define('frontend/models/alert', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        config: _emberData['default'].attr('object'),
        question: _emberData['default'].belongsTo('question'),
        created_at: _emberData['default'].attr('date'),
        updated_at: _emberData['default'].attr('date'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')

    });
});
define('frontend/models/api-action', ['exports', 'ember-data', 'ember-api-actions'], function (exports, _emberData, _emberApiActions) {
    exports['default'] = _emberData['default'].Model.extend({
        question: _emberData['default'].belongsTo('question'),
        url: _emberData['default'].attr('string'),
        headers: _emberData['default'].attr('key-value-array'),
        body: _emberData['default'].attr('string'),
        method: _emberData['default'].attr('string'),
        name: _emberData['default'].attr('string'),
        color: _emberData['default'].attr('string'),
        open_in_new_tab: _emberData['default'].attr('boolean'),
        response_settings: _emberData['default'].attr('object'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),

        sendCall: (0, _emberApiActions.memberAction)({
            path: 'send_request',
            type: 'post',
            urlType: 'findRecord'
        })

    });
});
define('frontend/models/column-value', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        value: _emberData['default'].attr('string'),
        column: _emberData['default'].belongsTo('column'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),

        displayName: Ember.computed('name', 'value', function () {
            return this.get("name") || this.get("value");
        })

    });
});
define('frontend/models/column', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        data_type: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        human_name: _emberData['default'].attr('string'),
        table: _emberData['default'].belongsTo('table'),
        column_values: _emberData['default'].hasMany('column_value'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        toJSON: function toJSON() {
            return this._super({ includeId: true });
        },

        isDateType: Ember.computed('data_type', function () {
            var dataType = this.get('data_type');
            if (dataType == 'date' || dataType == 'datetime' || dataType == 'timestamp without time zone') {
                return true;
            } else {
                return false;
            }
        })

    });
});
define('frontend/models/dashboard', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
    exports['default'] = _emberData['default'].Model.extend({
        router: _ember['default'].inject.service(),
        title: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        shareable_link: _emberData['default'].attr('string'),
        is_shareable_link_public: _emberData['default'].attr('boolean'),
        has_permission: _emberData['default'].attr('boolean'),
        settings: _emberData['default'].attr('object'),
        notes_settings: _emberData['default'].attr('object'),
        question_count: _emberData['default'].attr('string'),
        questions: _emberData['default'].hasMany('questions'),
        shared_to: _emberData['default'].attr(),
        variables: _emberData['default'].hasMany('variables'),
        notes: _emberData['default'].hasMany('notes'),
        tags: _emberData['default'].hasMany('tags'),

        isEditing: false,

        isEditingObserver: _ember['default'].observer('isEditing', function () {
            var _this = this;

            _ember['default'].run.next(function () {
                // begin loop
                var grid = _ember['default'].$('.grid-stack').data('gridstack');
                if (_this.get('isEditing')) {
                    grid && grid.enable();
                } else {
                    grid && grid.disable();
                }
                // $('.grid-stack-item').each((i, item) => {
                //     item.dispatchEvent(this.get('plotlyResize'));
                // });
            });
        }),

        shareable_url: _ember['default'].computed('shareable_link', function () {
            return window.location.origin + this.get('router').urlFor('dashboards.show', {
                dashboard_id: this.get('id'),
                queryParams: {
                    share_id: this.get('shareable_link')
                }
            });
        })
    });
});
define('frontend/models/database', ['exports', 'ember-data', 'ember-api-actions'], function (exports, _emberData, _emberApiActions) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        db_type: _emberData['default'].attr('string'),
        config: _emberData['default'].attr(),
        last_accessed_at: _emberData['default'].attr('date'),
        unique_identifier: _emberData['default'].attr('string'),
        tables: _emberData['default'].hasMany('table'),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        sync: (0, _emberApiActions.memberAction)({ path: 'sync' }),
        toJSON: function toJSON() {
            return this._super({ includeId: true });
        }

    });
});
define('frontend/models/generated-alert', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        alert: _emberData['default'].belongsTo('alert'),
        status: _emberData['default'].attr('string'),
        failing_conditions: _emberData['default'].attr('object'),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')

    });
});
define('frontend/models/note', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        router: Ember.inject.service(),
        dashboard: _emberData['default'].belongsTo('dashboard'),
        content: _emberData['default'].attr('string')
    });
});
define('frontend/models/permission-set', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        permissions: _emberData['default'].hasMany('permission'),
        users: _emberData['default'].hasMany('users'),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        displayPermissions: Ember.computed('permissions.content.isLoaded', 'permissions', function () {
            return this.get('permissions').map(function (item) {
                return item.get('name');
            }).join(", ");
        })

    });
});
define('frontend/models/permission', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        permission_set: _emberData['default'].belongsTo('permission_set'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')

    });
});
define('frontend/models/question', ['exports', 'ember-data', 'ember-api-actions', 'frontend/mixins/result-view-mixin'], function (exports, _emberData, _emberApiActions, _frontendMixinsResultViewMixin) {
    exports['default'] = _emberData['default'].Model.extend(_frontendMixinsResultViewMixin['default'], {
        router: Ember.inject.service(),
        title: _emberData['default'].attr('string'),
        results_view_settings: _emberData['default'].attr(),
        human_sql: _emberData['default'].attr('query-object'),
        query_type: _emberData['default'].attr('string'),
        sql: _emberData['default'].attr('string'),
        shareable_link: _emberData['default'].attr('string'),
        is_shareable_link_public: _emberData['default'].attr('boolean'),
        has_permission: _emberData['default'].attr('boolean'),
        columns: _emberData['default'].attr(),
        cached_results: _emberData['default'].attr(),
        dashboards: _emberData['default'].hasMany('dashboards'),
        tags: _emberData['default'].hasMany('tags'),
        snapshots: _emberData['default'].hasMany('snapshots'),
        shared_to: _emberData['default'].attr(),
        variables: _emberData['default'].hasMany('variables'),
        owner: _emberData['default'].belongsTo('user'),
        widgets: _emberData['default'].hasMany('widgets'),
        api_actions: _emberData['default'].hasMany('api_action'),
        variables_from_this_question: _emberData['default'].hasMany('variables', {
            inverse: 'question_filter'
        }),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),

        shareable_url: Ember.computed('shareable_link', function () {
            return window.location.origin + this.get('router').urlFor('questions.show', {
                question_id: this.get('id'),
                queryParams: {
                    share_id: this.get('shareable_link')
                }
            });
        }),

        toJSON: function toJSON() {
            return this._super({
                includeId: true
            });
        },

        cachedResults: Ember.on('didLoad', Ember.observer('updated_at', 'resultsCanBeLoaded', 'cached_results', function () {
            var _this = this;

            if (this.get('resultsCanBeLoaded') && !this.get('loading')) {
                this.set('loading', true);
                this.set('results', null);
                var variables = this.get('query_variables');
                variables = variables && variables.map(function (item) {
                    return {
                        name: item.get('name'),
                        value: item.get('value') || item.get('default'),
                        var_type: item.get('var_type'),
                        default_options: item.get('default_options')
                    };
                }).filter(function (item) {
                    return item.hasOwnProperty('name') && item['name'];
                });
                this.resultsCall({
                    variables: variables
                }).then(function (response) {
                    _this.set('results', response.data);
                    _this.set('cached_results', response.data);
                    _this.set('loading', false);
                    _this.set('resultsCanBeLoaded', false);
                    _this.set('errorMessage', null);
                    // }).then((error)=>{
                    //     this.set('resultError', error.error)
                    //     this.set("loading", false)
                })['catch'](function (error) {
                    _this.set('errorMessage', error.message);
                    _this.set('loading', false);
                    _this.set('results', null);
                    _this.set('cached_results', null);
                    _this.set('resultsCanBeLoaded', false);
                });
            } else if (!this.get('errorMessage') && !this.get('loading')) {
                this.set('results', this.get('cached_results'));
            }
        })),

        mergedVariables: Ember.computed('dashboardVariables.@each', 'query_variables', function () {
            var _this2 = this;

            this.get('dashboardVariables') && this.get('dashboardVariables').forEach(function (item) {
                var query_var = _this2.get('query_variables').findBy('name', item.get('name'));
                query_var && _this2.get('query_variables').removeObject(query_var);
                query_var && _this2.get('query_variables').pushObject(item);
            });
            return this.get('query_variables');
        }),
        dashboardVariables: [],

        updatedAgoColor: Ember.computed('updated_at', 'updatedAgoColorChangeTime', function () {
            var updated_at = this.get('updated_at');
            if (updated_at) {
                if (moment(updated_at).add(30, 'minutes') > moment()) {
                    return 'green';
                } else {
                    return 'red';
                }
            }
        }),
        refreshInterval: 60000,
        startTimer: Ember.on('didLoad', function () {
            !this.isDestroyed && this.set('timer', this.schedule(this.get('onPoll')));
        }),
        schedule: function schedule(f) {
            return Ember.run.later(this, function () {
                f.apply(this);
                !this.isDestroyed && this.set('timer', this.schedule(f));
            }, this.get('refreshInterval.value'));
        },

        onPoll: function onPoll() {
            !this.isDestroyed && this.set('updatedAgoColorChangeTime', new Date());
        },
        query_variables: Ember.computed.alias('variables'),
        showCardHeader: Ember.computed('results_view_settings', 'results_view_settings.resultsViewType', function () {
            return this.get('results_view_settings.resultsViewType') != 'Number';
        }),
        icon: Ember.computed('results_view_settings', 'results_view_settings.resultsViewType', function () {
            var resultsViewType = this.get('results_view_settings.resultsViewType');
            resultsViewType = resultsViewType && resultsViewType.toLowerCase();
            return this.get('resultViewIcons')[resultsViewType] || 'fe fe-list';
        }),

        resultsCall: (0, _emberApiActions.memberAction)({
            path: 'results',
            type: 'post',
            urlType: 'findRecord'
        }),
        resultsCanBeLoaded: false

    });
});
define('frontend/models/send-alert-config', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        alert: _emberData['default'].belongsTo('alert'),
        message_template: _emberData['default'].attr('string'),
        comm_type: _emberData['default'].attr('string'),
        to_addresses: _emberData['default'].attr(),
        subject_template: _emberData['default'].attr('string'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')
    });
});
define('frontend/models/snapshot-datum', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
    exports['default'] = _emberData['default'].Model.extend({
        row: _emberData['default'].attr('object'),
        snapshot: _emberData['default'].belongsTo('snapshot'),

        rowValues: _ember['default'].computed.alias('row.values')
    });
});
define('frontend/models/snapshot', ['exports', 'ember-data', 'ember', 'ember-api-actions'], function (exports, _emberData, _ember, _emberApiActions) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        columns: _emberData['default'].attr(),
        question: _emberData['default'].belongsTo('question'),
        snapshotData: _emberData['default'].hasMany('snapshot_datum'),
        scheduled: _emberData['default'].attr('boolean'),
        interval: _emberData['default'].attr('number'),
        starting_at: _emberData['default'].attr('date'),
        is_in_process: _emberData['default'].attr('boolean'),
        should_save_data_to_db: _emberData['default'].attr('boolean'),
        should_create_csv: _emberData['default'].attr('boolean'),
        should_send_mail_on_completion: _emberData['default'].attr('boolean'),
        searchable_columns: _emberData['default'].attr('array'),
        keep_latest: _emberData['default'].attr('number'),
        mail_to: _emberData['default'].attr('array'),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),

        stop: (0, _emberApiActions.memberAction)({
            path: 'stop',
            type: 'POST'
        }),

        stopAndNew: (0, _emberApiActions.memberAction)({
            path: 'stop_and_new',
            type: 'POST'
        }),

        subscribers: _ember['default'].computed('mail_to', function () {
            return this.get('mail_to').join(',');
        })
    });
});
define('frontend/models/table', ['exports', 'ember-data', 'ember-api-actions'], function (exports, _emberData, _emberApiActions) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    readable_table_name: _emberData['default'].attr('string'),
    description: _emberData['default'].attr('string'),
    database: _emberData['default'].belongsTo('database'),
    human_name: _emberData['default'].attr('string'),
    columns: _emberData['default'].hasMany('column', { async: true }),
    inserted_at: _emberData['default'].attr('utc'),
    updated_at: _emberData['default'].attr('utc'),

    toJSON: function toJSON() {
      return this._super({ includeId: true });
    }
  });
});
define('frontend/models/tag', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        color: _emberData['default'].attr('string'),
        questions: _emberData['default'].hasMany('question'),
        dashboards: _emberData['default'].hasMany('dashboard'),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc')

    });
});
define('frontend/models/team', ['exports', 'ember', 'ember-data', 'ember-api-actions'], function (exports, _ember, _emberData, _emberApiActions) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        users: _emberData['default'].hasMany('user'),
        accessible_databases: _emberData['default'].hasMany('database'),

        autoSave: function autoSave() {
            var _this = this;

            _ember['default'].run.debounce(this, function () {
                _this.save();
            }, 2000);
        },

        autoSaveObserver: _ember['default'].observer('name', 'description', function () {
            if (this.get('id')) {
                this.autoSave();
            }
        }),

        addUser: (0, _emberApiActions.memberAction)({
            path: 'add_user',
            type: 'post',
            urlType: 'findRecord'
        }),
        removeUser: (0, _emberApiActions.memberAction)({
            path: 'remove_user',
            type: 'post',
            urlType: 'findRecord'
        }),
        removeDatabase: (0, _emberApiActions.memberAction)({
            path: 'remove_database',
            type: 'post',
            urlType: 'findRecord'
        }),
        addDatabase: (0, _emberApiActions.memberAction)({
            path: 'add_database',
            type: 'post',
            urlType: 'findRecord'
        })

    });
});
define('frontend/models/user', ['exports', 'ember-data', 'ember', 'ember-api-actions'], function (exports, _emberData, _ember, _emberApiActions) {
    exports['default'] = _emberData['default'].Model.extend({
        full_name: _emberData['default'].attr('string'),
        first_name: _emberData['default'].attr('string'),
        last_name: _emberData['default'].attr('string'),
        email: _emberData['default'].attr('string'),
        profile_pic: _emberData['default'].attr('string'),
        questions: _emberData['default'].hasMany('questions'),
        is_deactivated: _emberData['default'].attr('boolean'),
        permission_sets: _emberData['default'].hasMany('permission_sets'),
        teams: _emberData['default'].hasMany('teams'),

        role: _ember['default'].computed('permission_sets', function () {
            return this.get('permission_sets') && this.get('permission_sets').objectAt(0);
        }),

        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),

        fullInfo: _ember['default'].computed('full_name', 'email', function () {
            return this.get('full_name') + ' - ' + this.get('email');
        }),

        displayableFullName: _ember['default'].computed('full_name', function () {
            return this.get('full_name') && this.get('full_name').trim();
        }),
        activate: (0, _emberApiActions.memberAction)({
            path: 'activate',
            type: 'post',
            urlType: 'findRecord'
        }),
        deactivate: (0, _emberApiActions.memberAction)({
            path: 'deactivate',
            type: 'post',
            urlType: 'findRecord'
        })
    });
});
define('frontend/models/variable', ['exports', 'ember', 'ember-data', 'frontend/mixins/result-view-mixin'], function (exports, _ember, _emberData, _frontendMixinsResultViewMixin) {
    exports['default'] = _emberData['default'].Model.extend(_frontendMixinsResultViewMixin['default'], {
        name: _emberData['default'].attr('string'),
        'default': _emberData['default'].attr('string'),
        var_type: _emberData['default'].attr('string'),
        column: _emberData['default'].belongsTo('column'),
        default_operator: _emberData['default'].attr('string'),
        question: _emberData['default'].belongsTo('question'),
        dashboard: _emberData['default'].belongsTo('dashboard'),
        inserted_at: _emberData['default'].attr('utc'),
        updated_at: _emberData['default'].attr('utc'),
        default_options: _emberData['default'].attr('array'),
        value_options: _emberData['default'].attr('array'),
        question_filter: _emberData['default'].belongsTo('question', {
            inverse: 'variables_from_this_question'
        }),
        value: _ember['default'].computed.alias('default'),
        setDate: _ember['default'].observer('default_date', function () {
            this.set('default', moment(this.get('default_date')).toISOString());
        }),
        setDateValue: _ember['default'].observer('date_value', function () {
            this.set('value', moment(this.get('date_value')).toISOString());
        }),

        questionFilterOptions: _ember['default'].computed('question_filter.cached_results', 'default_options', function () {
            var question_filter = this.get('question_filter');
            return question_filter && question_filter.get('cached_results') && question_filter.get('cached_results.rows').map(function (item) {
                return {
                    name: item[0],
                    value: item[1]
                };
            });
        }),

        nameObserver: _ember['default'].on('init', _ember['default'].observer('name', function () {

            this.get('name') && this.get('question.isLoaded') && this.set('question.variablesUpdated', new Date());
        })),

        questionFilterObserver: _ember['default'].on('init', _ember['default'].observer('question_filter', 'questionFilterOptions', function () {
            var question_filter = this.get('question_filter');
            if (question_filter && question_filter.get('id') && (!question_filter.get('cached_results') || !this.get('questionFilterOptions'))) {
                this.store.query('question', {
                    filter: {
                        id: question_filter.get('id')
                    }
                });
            }
        })),

        setQuestionVariables: _ember['default'].observer('dashboard', 'dashboard.questions.@each.variablesUpdated', 'value', 'default_options.[]', function () {
            var _this = this;

            var dashboard = this.get('dashboard');
            if (dashboard.get('content')) {
                dashboard.get('questions.isFulfilled') && dashboard.get('questions').forEach(function (item) {
                    //item.set('dashboardVariables', this.get('dashboard.variables'));
                    var variable = item.get('variables').findBy('name', _this.get('name'));
                    variable && variable.set('value', _this.get('value'));
                    variable && variable.set('default_options', _this.get('default_options'));
                });
            }
        })
    });
});
define('frontend/models/widget-item', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        config: _emberData['default'].attr(),
        value: _emberData['default'].attr('string'),
        text: _emberData['default'].attr('string'),
        widget: _emberData['default'].belongsTo('widget')
    });
});
define('frontend/models/widget', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        renderer: _emberData['default'].attr('string'),
        column_name: _emberData['default'].attr('string'),
        widget_items: _emberData['default'].hasMany('widget_item'),

        displayName: _ember['default'].computed('name', 'column_name', function () {
            if (this.get('name') && this.get('column_name')) {
                return this.get('name') + ' on ' + this.get('column_name');
            }
        }),

        shouldShowJson: _ember['default'].computed('widget_items.[]', function () {
            return !this.get('widget_items').objectAt(0);
        }),

        canSave: _ember['default'].computed('name', 'column_name', 'renderer', 'widget_items.@each', function () {
            return this.get('name') && this.get('column_name') && this.get('renderer') && this.get('widget_items').objectAt(0);
        })

    });
});
// saveAutomatically: Ember.observer('name', 'column_name', 'renderer', function () {
//     if (this.get('name') && this.get('column_name') && this.get('renderer')) {
//         Ember.debounce(this, function () {
//             this.invoke('save');
//         }, 300);
//     }
// })
define('frontend/pods/alerts/edit/controller', ['exports', 'ember', 'frontend/pods/alerts/new/controller'], function (exports, _ember, _frontendPodsAlertsNewController) {
  exports['default'] = _frontendPodsAlertsNewController['default'].extend({
    pageTitle: 'Edit Alert',
    alert_setting: _ember['default'].computed.alias('model'),

    timeUnitMultiplierReverse: {
      60: 'minutes',
      3600: 'hours',
      86400: 'days',
      604800: 'weeks'
    },
    criticalLevelObserver: _ember['default'].observer('alert_setting.alert_level_settings.content.isLoaded', function () {
      this.set('criticalLevel', this.get('alert_setting') && this.get('alert_setting.alert_level_settings').filter(function (item) {
        return item.get('level') == 'critical';
      }).objectAt(0));
    }),
    warningLevelObserver: _ember['default'].observer('alert_setting.alert_level_settings.content.isLoaded', function () {
      this.set('warningLevel', this.get('alert_setting') && this.get('alert_setting.alert_level_settings').filter(function (item) {
        return item.get('level') == 'warning';
      }).objectAt(0));
    }),
    alertNotificationObserver: _ember['default'].observer('alert_setting.alert_notification_settings.content.isLoaded', function () {
      this.set('alertNotification', this.get('alert_setting') && this.get('alert_setting.alert_notification_settings') && this.get('alert_setting.alert_notification_settings').objectAt(0));
    }),
    selectedAggregation: _ember['default'].computed('alert_setting', function () {
      return {
        title: this.get('alert_setting.aggregation')
      };
    }),
    selectedColumn: _ember['default'].computed('alert_setting', function () {
      return {
        title: this.get('alert_setting.column')
      };
    }),
    selectedTraversal: _ember['default'].computed('alert_setting', function () {
      return {
        title: this.get('alert_setting.traversal')
      };
    }),

    selectedOperation: _ember['default'].computed('alert_setting', function () {
      return {
        title: this.get('alert_setting.operation')
      };
    }),

    timeIntervalObserver: _ember['default'].observer('timeUnit', 'timeInterval', 'alert_setting.frequency_value_in_seconds', function () {
      if (this.get('timeInterval') || this.get('timeUnit')) {
        return;
      }
      var frequency = this.get('alert_setting.frequency_value_in_seconds');

      var timeUnitMultiplier = [604800, 86400, 3600, 60].filter(function (divident) {
        return frequency % divident == 0;
      })[0];

      this.set('timeUnit', { value: this.timeUnitMultiplierReverse[timeUnitMultiplier], title: this.timeUnitMultiplierReverse[timeUnitMultiplier] });
      this.set('timeInterval', frequency / timeUnitMultiplier);
    })

  });
});
define('frontend/pods/alerts/edit/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            return this.store.find('alert_setting', params.alert_id);
        },
        templateName: 'alerts/new'

    });
});
define("frontend/pods/alerts/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "A2Ti7E+S", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/alerts/edit/template.hbs" } });
});
define("frontend/pods/alerts/new/controller", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = _ember["default"].Controller.extend({
    pageTitle: "New Alert",
    step: 1,
    errors: {},
    alert_setting: _ember["default"].computed(function () {
      return this.store.createRecord("alert_setting", {
        name: null,
        question: null,
        aggregation: null,
        column: null,
        traversal: null,
        number_of_rows: 1,
        operation: null
      });
    }),
    criticalLevel: _ember["default"].computed(function () {
      return this.store.createRecord('alert_level_setting', {
        value: null,
        level: "critical",
        allert_setting: this.get('alert_setting')
      });
    }),
    warningLevel: _ember["default"].computed(function () {
      return this.store.createRecord('alert_level_setting', {
        value: null,
        level: "warning",
        allert_setting: this.get('alert_setting')
      });
    }),
    alertNotification: _ember["default"].computed(function () {
      return this.store.createRecord('alert_notification_setting', {
        recipients: [],
        method: "email",
        allert_setting: this.get('alert_setting')
      });
    }),

    timeUnitMultiplier: {
      'minutes': 60,
      'hours': 3600,
      'days': 86400,
      'weeks': 604800
    },

    frequencyObserver: _ember["default"].observer('timeInterval', 'timeUnit', function () {
      if (this.get('timeInterval') && this.get('timeUnit')) {
        this.set('alert_setting.frequency_value_in_seconds', this.get('timeInterval') * this.get('timeUnitMultiplier')[this.get('timeUnit.value')]);
      }
    }),
    aggregations: [{ value: "raw_value", title: "Raw Value" }, { value: "average", title: "Average" }, { value: "median", title: "Median" }, { value: "min", title: "Min" }, { value: "max", title: "Max" }, { value: "sum", title: "Sum" }, { value: "mean", title: "Mean" }, { value: "percentile_90th", title: "90th percentile" }, { value: "percentile_95th", title: "95th percentile" }, { value: "percentile_99th", title: "99th percentile" }],
    operations: [{ value: "greater_than", title: "Greater than" }, { value: "greater_than_equal_to", title: "Greater than or equal to" }, { value: "less_than", title: "Less than" }, { value: "less_than_equal_to", title: "Less than or equal to" }, { value: "equal", title: "equal to" }, { value: "not_equal_to", title: "Not equal to" }],
    traversals: [{ value: "any", title: "Any" }, { value: "all", title: "All" }, { value: "consecutive", title: "Consecutive" }],
    timeUnits: [{ title: "Minutes", value: "minutes" }, { title: "Hours", value: "hours" }, { title: "Days", value: "days" }, { title: "Week", value: "week" }],
    questions: _ember["default"].computed(function () {
      return this.store.query('question', { "with": 'columns' });
    }),
    columns: _ember["default"].computed('alert_setting.question', function () {
      return this.get('alert_setting.question.columns') && this.get('alert_setting.question.columns').filter(function (item) {
        return item;
      }).map(function (item) {
        return { title: item, value: item };
      });
    }),
    validateStep: function validateStep(currentStep) {
      if (currentStep == 1) {
        if (this.get('alert_setting.name')) {
          this.set("errors.name", false);
          return true;
        } else {
          this.set("errors.name", true);
          return false;
        }
      } else if (currentStep == 2) {
        if (this.get('alert_setting.question.id')) {
          this.set("errors.question", false);
          return true;
        } else {
          this.set("errors.question", true);
          return false;
        }
      } else if (currentStep == 3) {
        if (!this.get('alert_setting.aggregation')) {
          this.set("errors.aggregation", true);
        } else {
          this.set("errors.aggregation", false);
        }
        if (!this.get('alert_setting.column')) {
          this.set("errors.column", true);
        } else {
          this.set("errors.column", false);
        }

        if (!this.get('alert_setting.traversal')) {
          this.set("errors.traversal", true);
        } else {
          this.set("errors.traversal", false);
        }

        if (!this.get('alert_setting.number_of_rows')) {
          this.set("errors.number_of_rows", true);
        } else {
          this.set("errors.number_of_rows", false);
        }

        if (!this.get('alert_setting.operation')) {
          this.set("errors.operation", true);
        } else {
          this.set("errors.operation", false);
        }

        if (!this.get('warningLevel.value')) {
          this.set("errors.warningLevelValue", true);
        } else {
          this.set("errors.warningLevelValue", false);
        }

        if (!this.get('criticalLevel.value')) {
          this.set("errors.criticalLevelValue", true);
        } else {
          this.set("errors.criticalLevelValue", false);
        }

        if (this.get('errors.criticalLevelValue') || this.get('errors.warningLevelValue') || this.get('errors.aggregation') || this.get('errors.column') || this.get('errors.traversal') || this.get('errors.number_of_rows') || this.get('errors.operation')) {
          return false;
        } else {
          return true;
        }
      } else if (currentStep == 4) {
        if (!this.get('alertNotification.recipients')) {
          this.set('errors.notificationRecipients', true);
          return false;
        } else if (this.get('alertNotification.recipients').length == 0) {
          this.set('errors.notificationRecipients', true);
          return false;
        } else {
          this.set('errors.notificationRecipients', false);
          this.set('errors.notificationRecipients', false);
          return true;
        }
      } else if (currentStep == 5) {
        if (!this.get('alert_setting.frequency_value_in_seconds')) {
          this.set('errors.frequency_value_in_seconds', true);
        } else {
          this.set("errors.frequency_value_in_seconds", false);
        }
        if (!this.get('alert_setting.start_time')) {
          this.set('errors.start_time', true);
        } else {
          this.set("errors.start_time", false);
        }

        if (this.get('errors.start_time') || this.get('errors.frequency_value_in_seconds')) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    syncToServer: function syncToServer(currentStep) {
      var _this = this;

      if (currentStep == 5) {
        this.get('alert_setting').save().then(function (response) {

          _this.set('warningLevel.alert_setting', response);
          _this.get('warningLevel').save();
          _this.set('criticalLevel.alert_setting', response);
          _this.get('criticalLevel').save();
          _this.set('alertNotification.alert_setting', response);
          _this.get('alertNotification').save();
        });
      }
    },
    selectedRecipients: _ember["default"].computed('alertNotification.recipients', function () {
      return this.get('alertNotification.recipients') && this.get('alertNotification.recipients').map(function (item) {
        return _ember["default"].Object.create({
          title: item
        });
      }) || [];
    }),
    users: _ember["default"].computed(function () {
      return this.get('store').findAll('user');
    }),
    userEmails: _ember["default"].computed('users', 'users.content.isLoaded', function () {
      return this.get('users').map(function (item) {

        return _ember["default"].Object.create({
          title: item.get('email')
        });
      });
    }),
    sortedUsers: _ember["default"].computed('users.content.isLoaded', function () {
      return this.get('users').sortBy('label');
    }),
    actions: {
      nextStep: function nextStep(currentStep) {
        if (this.validateStep(currentStep)) {

          this.syncToServer(currentStep);
          this.incrementProperty('step');
        }
      },

      previousStep: function previousStep() {
        this.decrementProperty('step');
      },
      setStep: function setStep(step) {
        this.set("step", step);
      },
      setProperty: function setProperty(property, obj) {
        this.set(property, obj.value);
      },

      addToRecipients: function addToRecipients(item) {
        this.set('alertNotification.recipients', item.map(function (it) {
          return it.title;
        }));
      },
      addNewRecipient: function addNewRecipient(text) {
        var newUser = _ember["default"].Object.create({
          title: text
        });
        this.get('userEmails').addObject(newUser);
        this.get('selectedRecipients').addObject(newUser);
        this.get('alertNotification.recipients').addObject(text);
      }

    }
  });
});
define('frontend/pods/alerts/new/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
  exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {});
});
define("frontend/pods/alerts/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Ed0evi28", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row justify-content-between w-100\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col text-default\"],[7],[0,\" \"],[1,[18,\"pageTitle\"],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"pt-3 px-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-body p-0\"],[7],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],1],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"setStep\",1]],[7],[0,\" \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle  pr-4 \",[25,\"if\",[[20,[\"step1Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Set up Alert\\n                        Name\"],[8],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],2],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"setStep\",2]],[7],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle  pr-4 \",[25,\"if\",[[20,[\"step2Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Set up Data\\n                        Source\"],[8],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],3],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"setStep\",3]],[7],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle  pr-4 \",[25,\"if\",[[20,[\"step3Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Set up Alert\\n                        Condition\"],[8],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],4],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"setStep\",4]],[7],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle  pr-4 \",[25,\"if\",[[20,[\"step4Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Set up\\n                        Notification\"],[8],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],5],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"setStep\",5]],[7],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle pr-4 \",[25,\"if\",[[20,[\"step5Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Set up Alert\\n                        Schedule\"],[8],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"nav-item p-3 border-bottom text-default \",[25,\"if\",[[25,\"eq\",[[20,[\"step\"]],6],null],\"active\"],null]]]],[7],[6,\"i\"],[10,\"class\",[26,[\"fe fe-check-circle  pr-4 \",[25,\"if\",[[20,[\"step6Done\"]],\"text-green\",\"text-gray\"],null]]]],[7],[8],[0,\" Done\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-9 pl-4\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],1],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-body p-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"\\n                            Name\\n                        \"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"alert_setting\",\"name\"]],\"form-control\"]]],false],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"errors\",\"name\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please provide a name.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\"This will be sent in the notifications. So please choose a appropriate\\n                            name.\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary ml-auto\"],[3,\"action\",[[19,0,[]],\"nextStep\",1]],[7],[0,\"Next \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],2],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-body p-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"\\n                            Question\\n                        \"],[8],[0,\"\\n                        \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"questions\"]],\"title\",\"title\",[20,[\"alert_setting\",\"question\"]],true,\"Select a Question\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"alert_setting\",\"question\"]]],null]],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"question\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select a question\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\"Result of this Question will be used to evaluate the Condition for\\n                            this alert.\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"btn btn-link btn-secondary\"],[3,\"action\",[[19,0,[]],\"previousStep\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-arrow-left\"],[7],[8],[0,\"Go Back\"],[8],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary ml-auto\"],[3,\"action\",[[19,0,[]],\"nextStep\",2]],[7],[0,\"Next \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],3],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-body p-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-1 text-center pt-2 mb-2\"],[7],[0,\"\\n                                When\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-3 mb-2\"],[7],[0,\"\\n                                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"aggregations\"]],\"title\",\"title\",[20,[\"selectedAggregation\"]],true,\"Select an aggregation\",[25,\"action\",[[19,0,[]],\"setProperty\",\"alert_setting.aggregation\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"aggregation\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select an aggregation\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\\n                            \"],[6,\"div\"],[9,\"class\",\"col-1 text-center pt-2 mb-2\"],[7],[0,\"\\n                                of\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-3 mb-2\"],[7],[0,\"\\n                                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"columns\"]],\"title\",\"title\",[20,[\"selectedColumn\"]],true,\"Select a Column\",[25,\"action\",[[19,0,[]],\"setProperty\",\"alert_setting.column\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"column\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select a column\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-1 text-center pt-2 mb-2\"],[7],[0,\"\\n                                in\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-3 mb-2\"],[7],[0,\"\\n                                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"traversals\"]],\"title\",\"title\",[20,[\"selectedTraversal\"]],true,\"Select traversal\",[25,\"action\",[[19,0,[]],\"setProperty\",\"alert_setting.traversal\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"traversal\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select traversal\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"not-eq\",[[20,[\"alert_setting\",\"traversal\"]],\"all\"],null]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-2 mb-2\"],[7],[0,\"\\n                                \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\",\"class\"],[\"number\",\"Number of rows\",[20,[\"alert_setting\",\"number_of_rows\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"no_of_rows\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please provide number of rows\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-1 text-center pt-2 mb-2\"],[7],[0,\"\\n                                rows\\n\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-1 text-center pt-2 mb-2\"],[7],[0,\"\\n                                is\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-3 mb-2\"],[7],[0,\"\\n                                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"operations\"]],\"title\",\"title\",[20,[\"selectedOperation\"]],true,\"Select comparator\",[25,\"action\",[[19,0,[]],\"setProperty\",\"alert_setting.operation\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"operation\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select an comparator\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"placeholder\",\"class\"],[\"number\",[20,[\"warningLevel\",\"value\"]],\"threshold\",\"form-control\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"warningLevelValue\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please provide a value\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-10 pt-2 pl-2\"],[7],[0,\"\\n                            raise\\n                            \"],[6,\"div\"],[9,\"class\",\"tag bg-yellow-light text-default\"],[7],[0,\"Warning\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"placeholder\",\"class\"],[\"number\",[20,[\"criticalLevel\",\"value\"]],\"threshold\",\"form-control\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"criticalLevelValue\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please provide a value\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-10 pt-2 pl-2\"],[7],[0,\"\\n                            raise\\n                            \"],[6,\"div\"],[9,\"class\",\"tag bg-red text-white\"],[7],[0,\"Critical\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2 mb-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"btn btn-link btn-secondary\"],[3,\"action\",[[19,0,[]],\"previousStep\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-arrow-left\"],[7],[8],[0,\"Go Back\"],[8],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary ml-auto\"],[3,\"action\",[[19,0,[]],\"nextStep\",3]],[7],[0,\"Next \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],4],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-body p-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"small\"],[9,\"class\",\"text-default d-block mb-1\"],[7],[0,\"Notify following People/mailing list/teams:\"],[8],[0,\"\\n                        \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-add\",\"on-change\"],[[20,[\"userEmails\"]],true,[20,[\"selectedRecipients\"]],false,\"Select People You want to notify\",[25,\"action\",[[19,0,[]],\"addNewRecipient\"],null],[25,\"action\",[[19,0,[]],\"addToRecipients\"],null]]]],false],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"errors\",\"notificationRecipients\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select people to notify\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2 mb-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"btn btn-link btn-secondary\"],[3,\"action\",[[19,0,[]],\"previousStep\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-arrow-left\"],[7],[8],[0,\"Go Back\"],[8],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary ml-auto\"],[3,\"action\",[[19,0,[]],\"nextStep\",4]],[7],[0,\"Next \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],5],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-body p-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-2 text-center pt-2\"],[7],[0,\"\\n                                Run it every:\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                                \"],[1,[25,\"input\",[[25,\"-input-type\",[[20,[\"number\"]]],null]],[[\"placeholder\",\"type\",\"value\",\"class\"],[\"time\",[20,[\"number\"]],[20,[\"timeInterval\"]],\"form-control\"]]],false],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-2 pl-1\"],[7],[0,\"\\n                                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"timeUnits\"]],[20,[\"timeUnit\"]],false,\"Time Unit\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"timeUnit\"]]],null]],null]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"frequency_value_in_seconds\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 pl-2 pt-2\"],[7],[0,\"\\n\\n                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row mt-2\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-2 text-center pt-2\"],[7],[0,\"\\n                                Starting at:\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n                                \"],[1,[25,\"ui-calendar\",null,[[\"date\",\"onChange\",\"placeholder\"],[[20,[\"alert_setting\",\"start_time\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"alert_setting\",\"start_time\"]]],null]],null],[20,[\"alert_setting\",\"start_time\"]]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\",\"start_time\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 pl-2 pt-2\"],[7],[0,\"\\n\\n                                \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-block\"],[7],[0,\"Please select start time\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2 mb-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"btn btn-link btn-secondary\"],[3,\"action\",[[19,0,[]],\"previousStep\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-arrow-left\"],[7],[8],[0,\"Go Back\"],[8],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary ml-auto\"],[3,\"action\",[[19,0,[]],\"nextStep\",5]],[7],[0,\"Next \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"step\"]],6],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"row text-center p-8\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-check-circle h1 text-green\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-12 h3\"],[7],[0,\"\\n                        All Set\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-footer px-4 py-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex p-0\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"btn btn-link btn-secondary\"],[3,\"action\",[[19,0,[]],\"previousStep\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-arrow-left\"],[7],[8],[0,\"Go Back\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/alerts/new/template.hbs" } });
});
define('frontend/pods/alerts/show/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('frontend/pods/alerts/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("frontend/pods/alerts/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "azzycq86", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/alerts/show/template.hbs" } });
});
define('frontend/pods/api/google/callback/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        sessionService: _ember['default'].inject.service(),
        ajax: _ember['default'].inject.service(),
        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);
            var code = window.location.search.replace('?code=', '');
            this.set('loading', true);
            this.get('ajax').apiCall({
                url: this.get('ajax.apiPath') + '/callback/google/',
                type: 'POST',
                data: {
                    provider: 'google',
                    code: code
                }
            }, function (response, status) {
                _this.get('sessionService').setToken(response.token);
                _this.set('sessionService.authenticated', true);
                _this.set('sessionService.permissions', response.permissions);
                _this.get('sessionService').setUser(response.user);
                _this.set('loading', false);
                var attemptedTransition = _this.get('sessionService.getAttemptedTransition')();
                if (attemptedTransition) {
                    window.location.replace(window.location.origin + attemptedTransition);
                } else {
                    _this.transitionToRoute('index');
                }
            }, function (error, status) {
                _this.set('loading', false);
                _this.set('errors', error.error);
                _this.set('error', true);
            });
        }
    });
});
define('frontend/pods/api/google/callback/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("frontend/pods/api/google/callback/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+5pxZgHz", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"loader big text-primary\"],[7],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"error\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"ui segment results full loading-height\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n                \"],[6,\"div\"],[7],[0,\" Sorry! We could not log you in.\"],[8],[0,\"\\n                \"],[6,\"div\"],[7],[1,[18,\"errors\"],false],[8],[0,\"\\n\"],[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"                    \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[7],[0,\" Please try again \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/api/google/callback/template.hbs" } });
});
define('frontend/pods/application/adapter', ['exports', 'ember-data', 'frontend/config/environment'], function (exports, _emberData, _frontendConfigEnvironment) {
    var _Ember = Ember;
    var _Ember$String = _Ember.String;
    var pluralize = _Ember$String.pluralize;
    var underscore = _Ember$String.underscore;
    exports['default'] = _emberData['default'].JSONAPIAdapter.extend({
        namespace: '/api/v1',
        host: _frontendConfigEnvironment['default'].host,
        toast: Ember.inject.service(),
        sessionService: Ember.inject.service(),
        headers: Ember.computed('sessionService.token', function () {
            return {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": this.get('sessionService.token')
            };
        }).volatile(),
        pathForType: function pathForType(modelName) {
            return Ember.String.pluralize(Ember.String.underscore(modelName));
        },
        coalesceFindRequests: true,
        handleResponse: function handleResponse(status, headers, payload) {
            status == 403 && this.get('toast').error("You are not authorized to perform this action", 'Sorry Mate!', { closeButton: true, timeout: 1500, progressBar: false });

            return this._super(status, headers, payload);
        }

    });
});
define('frontend/pods/application/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        sessionService: _ember['default'].inject.service(),
        actions: {
            invalidateSession: function invalidateSession() {
                this.get('sessionService').invalidate();
                this.transitionToRoute('login');
            },
            goToDashboard: function goToDashboard(dashboard) {
                this.transitionToRoute('dashboards.show', dashboard.get('id'));
                this.set('showDashboardSearch', false);
            },

            goToQuestion: function goToQuestion(question) {
                this.transitionToRoute('questions.show', question.get('id'));
                this.set('showQuestionSearch', false);
            }
        }
    });
});
define('frontend/pods/application/route', ['exports', 'ember', 'ember-keyboard-shortcuts/mixins/route'], function (exports, _ember, _emberKeyboardShortcutsMixinsRoute) {
  exports['default'] = _ember['default'].Route.extend(_emberKeyboardShortcutsMixinsRoute['default'], {
    moment: _ember['default'].inject.service(),
    beforeModel: function beforeModel() {
      this._super.apply(this, arguments);
      this.get('moment').setTimeZone(moment.tz.guess());
    },

    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);
      this.set('controller', controller);
    },

    actions: {
      goToDashboard: function goToDashboard(dashboard) {
        this.transitionTo('dashboards.show', dashboard);
      },
      goToNewQuestion: function goToNewQuestion() {
        this.transitionTo('questions.new');
      },
      goToAllQuestions: function goToAllQuestions() {
        this.transitionTo('questions.all');
      },
      goToDataReference: function goToDataReference() {
        this.transitionTo('data_references.databases.all');
      },
      openSelectDashboard: function openSelectDashboard() {
        this.set('controller.showQuestionSearch', false);
        this.set('controller.showDashboardSearch', true);
      },
      openSelectQuestion: function openSelectQuestion() {
        this.set('controller.showDashboardSearch', false);
        this.set('controller.showQuestionSearch', true);
      },
      hideSearchDialogues: function hideSearchDialogues() {
        this.set('controller.showQuestionSearch', false);
        this.set('controller.showDashboardSearch', false);
      }

    },

    keyboardShortcuts: {
      'ctrl+n': "goToNewQuestion",
      'ctrl+shift+q': "goToAllQuestions",
      'ctrl+shift+r': "goToDataReference",
      "ctrl+d": "openSelectDashboard",
      "ctrl+q": "openSelectQuestion",
      "esc": {
        action: "hideSearchDialogues",
        preventDefault: false
      }
    }
  });
});
define('frontend/pods/application/serializer', ['exports', 'ember-data'], function (exports, _emberData) {

  var underscore = Ember.String.underscore;
  exports['default'] = _emberData['default'].JSONAPISerializer.extend({

    keyForAttribute: function keyForAttribute(attr) {
      return underscore(attr);
    },

    keyForRelationship: function keyForRelationship(rawKey) {
      return underscore(rawKey);
    }

  });
});
define("frontend/pods/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "LC7vnN+r", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-header\",null,[[\"goToDashboard\",\"invalidateSession\"],[\"goToDashboard\",\"invalidateSession\"]]],false],[0,\"\\n        \"],[1,[18,\"outlet\"],false],[0,\"\\n        \"],[1,[18,\"keyboard-shortcuts-help\"],false],[0,\"\\n\"],[4,\"if\",[[20,[\"showDashboardSearch\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"dashboard-selector\",null,[[\"goToDashboard\"],[\"goToDashboard\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"showQuestionSearch\"]]],null,{\"statements\":[[1,[25,\"question-selector\",null,[[\"goToQuestion\"],[\"goToQuestion\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/application/template.hbs" } });
});
define('frontend/pods/components/accordion-multiselect/component', ['exports', 'ember', 'frontend/mixins/helper-mixin'], function (exports, _ember, _frontendMixinsHelperMixin) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsHelperMixin['default'], {
        showableOptions: _ember['default'].computed('options', "selection", function () {
            return this.uniqueByProperty((_ember['default'].copy(this.get('selection')) || []).addObjects(this.get('options') || []), this.get('labelProperty'));
        }),

        actions: {
            remove: function remove(item) {
                this.get('selection').removeObject(item);
            }
        }
    });
});
define("frontend/pods/components/accordion-multiselect/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qDYSCuFE", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"multiple\",\"selected\",\"optionLabelKey\",\"prompt\",\"closeOnSelection\",\"on-change\"],[[20,[\"showableOptions\"]],[20,[\"labelProperty\"]],true,[20,[\"selection\"]],[20,[\"labelProperty\"]],[20,[\"label\"]],false,[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"selection\"]]],null]],null]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/accordion-multiselect/template.hbs" } });
});
define('frontend/pods/components/add-tag/component', ['exports', 'ember', 'frontend/mixins/colors-mixin'], function (exports, _ember, _frontendMixinsColorsMixin) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsColorsMixin['default'], {
        tags: _ember['default'].computed(function () {
            return this.get('store').findAll('tag');
        }),
        selectedTags: _ember['default'].computed('entity.tags', 'entity.tags.content.isLoaded', function () {
            var _this = this;

            return this.get('entity.tags').map(function (item) {
                return _this.get('store').peekRecord('tag', item.get('id'));
            }).filter(function (item) {
                return item != undefined;
            });
        }),
        actions: {
            clear: function clear() {
                this.set('open', false);
            },
            addNewTag: function addNewTag(text) {
                var _this2 = this;

                var tag = this.get('store').createRecord('tag', {
                    name: text,
                    color: this.randomColor()
                });
                tag.save().then(function (response) {
                    _this2.get('entity.tags').pushObject(tag);
                });
            },
            saveEntity: function saveEntity() {
                this.get('entity').save();
                this.set('open', false);
            },

            addToTag: function addToTag(tag) {
                this.sendAction("addToTag", tag);
            }
        }
    });
});
define("frontend/pods/components/add-tag/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "15heLzZT", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"       \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\"\\n        Edit Tags of  This \"],[1,[18,\"entityName\"],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"tip mb-2\"],[7],[0,\"Tip: You can create new tags by typing the name of tag in search of select box and then clicking add from dropdown\"],[8],[0,\" \\n        \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"multiple\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\",\"on-add\"],[[20,[\"tags\"]],\"name\",true,\"name\",[20,[\"selectedTags\"]],false,\"Select a tag from dropdown\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"entity\",\"tags\"]]],null]],null],[25,\"action\",[[19,0,[]],\"addNewTag\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"     \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clear\"],null],\"danger\"]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n     \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"saveEntity\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Save\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/add-tag/template.hbs" } });
});
define('frontend/pods/components/add-to-dashboard/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        dashboards: _ember['default'].computed(function () {
            return this.get('store').peekAll('dashboard');
        }),
        dashboard: {},

        actions: {
            createDashboard: function createDashboard() {
                _ember['default'].$('.ui.modal.create-dashboard').modal('show');
            },
            createAndAddToDashboard: function createAndAddToDashboard() {
                var _this = this;

                var object = {};
                object[this.get('question.id')] = { width: 6, height: 6 };
                var dashboard = this.store.createRecord('dashboard', {
                    title: this.get('dashboard.title'),
                    description: this.get('dashboard.description'),
                    settings: object
                });
                dashboard.save().then(function (response) {
                    _this.sendAction('addToDashboard', dashboard);
                });
            },
            addToDashboard: function addToDashboard(dashboard) {
                this.sendAction('addToDashboard', dashboard);
            },
            clear: function clear() {
                this.set('open', false);
            }
        }
    });
});
define("frontend/pods/components/add-to-dashboard/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ySL3edZW", "block": "{\"symbols\":[\"modal\",\"dashboard\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"       \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\"\\n        Add This Question to Dashboard\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"mb-2\"],[7],[0,\"\\n        Which dashboard do you want to add this question to?\\n        \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"tags\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"dashboards\"]]],null,{\"statements\":[[0,\"                \"],[6,\"span\"],[9,\"class\",\"tag\"],[3,\"action\",[[19,0,[]],\"addToDashboard\",[19,2,[]]]],[7],[0,\"\\n                    \"],[1,[19,2,[\"title\"]],false],[0,\"\\n                    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-grid\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"Or\"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Title\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"dashboard\",\"title\"]],\"form-control\",\"What are you calling it?\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"dashboard\",\"description\"]],\"form-control\",\"What does it show?\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12 text-center\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-primary mt-2\"],[3,\"action\",[[19,0,[]],\"createAndAddToDashboard\"]],[7],[0,\"\\n                        Create New Dashboard and Add Question\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui modal add-to-dashboard\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Add This Question to Dashboard\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"dashboard content\"],[7],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/add-to-dashboard/template.hbs" } });
});
define('frontend/pods/components/additional-filters/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        watchAdditionalFilters: _ember['default'].on('init', _ember['default'].observer('queryObject.additionalFilters', function () {
            if (!this.get('queryObject.additionalFilters')) {
                this.set('queryObject.additionalFilters', _ember['default'].Object.create());
            } else {
                this.set('queryObject.additionalFilters.filters', this.get('queryObject.additionalFilters.filters') && this.get('queryObject.additionalFilters.filters').map(function (item) {
                    return _ember['default'].Object.create(item);
                }));
                this.set('queryObject.additionalFilters.views', this.get('queryObject.additionalFilters.views') && this.get('queryObject.additionalFilters.views').map(function (item) {
                    return _ember['default'].Object.create(item);
                }));
                this.set('queryObject.additionalFilters.groupBys', this.get('queryObject.additionalFilters.groupBys') && this.get('queryObject.additionalFilters.groupBys').map(function (item) {
                    return _ember['default'].Object.create(item);
                }));
                this.set('queryObject.additionalFilters.orderBys', this.get('queryObject.additionalFilters.orderBys') && this.get('queryObject.additionalFilters.orderBys').map(function (item) {
                    return _ember['default'].Object.create(item);
                }));
            }
        })),

        columns: _ember['default'].computed('results', 'error', 'results.additional_filters_applied', function () {
            var _this2 = this;

            if (this.get('results.additional_filters_applied') && this.get('queryObject.additionalFilterColumns') || this.get('error')) {

                return this.get('queryObject.additionalFilterColumns') || [];
            }
            return this.get('results.columns') && this.get('results.columns').map(function (item, index) {
                return {
                    name: item,
                    human_name: item,
                    data_type: _this2.figureOutDataType(index)
                };
            }) || [];
        }),

        columnsObserver: _ember['default'].on('init', _ember['default'].observer('columns', 'results', function () {
            if (this.get('results.columns') && this.get('columns').length > 0) {
                this.set('queryObject.additionalFilterColumns', this.get('columns'));
            }
        })),

        figureOutDataType: function figureOutDataType(index) {
            var dataType = 'Not Relevent';
            this.get('results.rows').every(function (row) {
                if (moment(row[index], moment.ISO_8601, true).isValid()) {
                    dataType = 'datetime';
                    return false;
                }
                return true;
            });
            return dataType;
        },

        rawObject: _ember['default'].computed(function () {
            return _ember['default'].Object.extend({
                selected: null,
                label: _ember['default'].computed('selected', 'selected.value', function () {
                    if (this.get('selected.raw') == true) {
                        this.set('selected.human_name', null);
                        this.set('selected.name', null);
                    }
                    return this.get('selected.human_name') || this.get('selected.name') || this.get('selected.value');
                })
            });
        }),
        rawObjectWithSelected: function rawObjectWithSelected(_this) {
            var selected = _this.get('rawObject').create();
            selected.set('selected', _ember['default'].Object.create({
                raw: false,
                value: null
            }));
            selected.set('castType', _ember['default'].Object.create({}));
            return selected;
        },
        actions: {
            resetAdditionalFilters: function resetAdditionalFilters() {
                this.set('queryObject.additionalFilters', _ember['default'].Object.create());
                this.set('queryObject.additionalFilterColumns', null);
            },

            addFilter: function addFilter() {
                if (!this.get('queryObject.additionalFilters.filters')) {
                    this.set('queryObject.additionalFilters.filters', []);
                }
                this.get('queryObject.additionalFilters.filters').pushObject(_ember['default'].Object.create({
                    column: null,
                    operator: null,
                    value: null,
                    valueDateObj: {}
                }));
            },

            addView: function addView() {
                if (!this.get('queryObject.additionalFilters.views')) {
                    this.set('queryObject.additionalFilters.views', []);
                }
                this.get('queryObject.additionalFilters.views').pushObject(_ember['default'].Object.create({}));
            },

            addGroupBy: function addGroupBy() {
                if (!this.get('queryObject.additionalFilters.groupBys')) {
                    this.set('queryObject.additionalFilters.groupBys', []);
                }
                this.get('queryObject.additionalFilters.groupBys').pushObject(this.get('rawObjectWithSelected')(this));
            },
            addOrderBy: function addOrderBy() {
                if (!this.get('queryObject.additionalFilters.orderBys')) {
                    this.set('queryObject.additionalFilters.orderBys', []);
                }
                this.get('queryObject.additionalFilters.orderBys').pushObject(_ember['default'].Object.create({}));
            },
            switchToBuilder: function switchToBuilder(type, el, handleSelected) {
                var items = this.get('queryObject.additionalFilters').get(type);
                if (handleSelected) {
                    el.set('selected', _ember['default'].Object.create({}));
                    el.set('castType', null);
                } else {
                    el.set('raw', false);
                }
            },
            switchToRaw: function switchToRaw(type, el, handleSelected) {
                var items = this.get('queryObject.additionalFilters').get(type);
                if (handleSelected) {
                    el.set('selected', _ember['default'].Object.create({
                        raw: true
                    }));
                    el.set('castType', null);
                } else {
                    el.set('raw', true);
                }
            },
            remove: function remove(type, el) {
                var arr = _ember['default'].Object.create(this.get('queryObject.additionalFilters')).get(type);
                arr.removeObject(el);
            }
        }

    });
});
define("frontend/pods/components/additional-filters/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "TcWb/9kD", "block": "{\"symbols\":[\"acc\",\"aitem\",\"tab\",\"orderBy\",\"orderBy\",\"groupBy\",\"groupBy\",\"view\",\"selectView\",\"filter\",\"filter\"],\"statements\":[[4,\"bs-accordion\",null,[[\"class\"],[\"text-default mb-1\"]],{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,2,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-8\"],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\" Add Additional Filters \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-4 text-right\"],[7],[0,\"\\n                    \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"resetAdditionalFilters\"]],[7],[0,\"\\n                        \"],[4,\"bs-tooltip\",null,[[\"position\"],[\"top\"]],{\"statements\":[[0,\" Reset Filters \"]],\"parameters\":[]},null],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-refresh-cw\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"body\"]]],[[\"class\"],[\"pt-0\"]],{\"statements\":[[4,\"bs-tab\",null,null,{\"statements\":[[4,\"component\",[[19,3,[\"pane\"]]],[[\"title\"],[\"Filters\"]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"row \"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"filters\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 text-center\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"m-4 mt-0\"],[7],[1,[25,\"filter-maker\",null,[[\"filter\",\"columns\",\"queryObject\",\"switchToBuilder\",\"switchToRaw\"],[[19,11,[]],[20,[\"columns\"]],[20,[\"queryObject\"]],\"switchToBuilder\",\"switchToRaw\"]]],false],[0,\"\\n                                    \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[11]},null],[0,\"                        \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"addFilter\"]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" Add a Filter\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row tags pl-4\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"filters\"]]],null,{\"statements\":[[4,\"if\",[[19,10,[\"label\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,10,[\"label\"]],false],[0,\"\\n                                    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"filters\",[19,10,[]]]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[10]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"pane\"]]],[[\"title\"],[\"View\"]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"views\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 text-center \"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"m-4 mt-0\"],[7],[0,\" \"],[1,[25,\"view-maker\",null,[[\"selectView\",\"switchToRaw\",\"switchToBuilder\"],[[19,9,[]],\"switchToRaw\",\"switchToBuilder\"]]],false],[0,\"\\n                                    \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[9]},null],[0,\"                        \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"addView\"]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" Add a View\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row tags pl-4\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"views\"]]],null,{\"statements\":[[4,\"if\",[[19,8,[\"label\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,8,[\"label\"]],false],[0,\"\\n                                    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"views\",[19,8,[]]]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[8]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"pane\"]]],[[\"title\"],[\"Grouping\"]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"groupBys\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 text-center \"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"m-4 mt-0\"],[7],[0,\" \"],[1,[25,\"group-by-maker\",null,[[\"columns\",\"groupBy\",\"switchToRaw\",\"switchToBuilder\"],[[20,[\"columns\"]],[19,7,[]],\"switchToRaw\",\"switchToBuilder\"]]],false],[0,\"\\n                                    \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[7]},null],[0,\"                        \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"addGroupBy\"]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" Add a Grouping\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row tags pl-4\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"groupBys\"]]],null,{\"statements\":[[4,\"if\",[[19,6,[\"label\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,6,[\"label\"]],false],[0,\"\\n                                    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"groupBys\",[19,6,[]]]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[6]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"pane\"]]],[[\"title\"],[\"Sort Order\"]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"orderBys\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-4 text-center\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"m-4 mt-0\"],[7],[0,\" \"],[1,[25,\"order-by-maker\",null,[[\"columns\",\"orderBy\"],[[20,[\"columns\"]],[19,5,[]]]]],false],[0,\" \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"                        \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"addOrderBy\"]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" Add Sort Order\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row tags pl-4\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"additionalFilters\",\"orderBys\"]]],null,{\"statements\":[[4,\"if\",[[25,\"and\",[[19,4,[\"column\",\"human_name\"]],[19,4,[\"order\",\"name\"]]],null]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,4,[\"column\",\"human_name\"]],false],[0,\" : \"],[1,[19,4,[\"order\",\"name\"]],false],[0,\"\\n                                    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"orderBys\",[19,4,[]]]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[4]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[3]},null]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/additional-filters/template.hbs" } });
});
define("frontend/pods/components/alert-expression/component", ["exports", "ember"], function (exports, _ember) {
      exports["default"] = _ember["default"].Component.extend({
            operators: [{ name: "is greater than", value: ">" }, { name: "is less than", value: "<" }, { name: "is greater than or equals to", value: ">=" }, { name: "is less than or equals to", value: "<=" }, { name: "is", value: "=" }, { name: "is not ", value: "!=" }],
            operations: [{ name: "value", value: "value" }, { name: "average of values", value: "average" }, { name: "sum of values", value: "sum" }],
            withinTypes: [{ name: "any", value: "any" }, { name: "consecutive", value: "consecutive" }]
      });
});
define("frontend/pods/components/alert-expression/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "zpZySpO8", "block": "{\"symbols\":[\"execute\",\"mapper\",\"operator\",\"execute\",\"mapper\",\"withinType\",\"execute\",\"mapper\",\"column\",\"execute\",\"mapper\",\"operation\"],\"statements\":[[6,\"span\"],[9,\"class\",\"step-number\"],[7],[0,\"\\n  \"],[6,\"button\"],[9,\"class\",\"ui circular violet icon button alert\"],[7],[0,\"\\n    \"],[1,[18,\"number\"],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n  When\\n\"],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"search selection\",[20,[\"conf\",\"operation\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"conf\",\"operation\"]]],null]],null]]],{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"value\"],[8],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"operations\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,11,[]],[19,12,[]]],null]]]],[7],[0,\"\\n            \"],[1,[19,12,[\"name\"]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[12]},null],[0,\"      \"],[8],[0,\"\\n\"]],\"parameters\":[10,11]},null],[0,\"  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showValueText\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n      of values\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n    of\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onchange\"],[\"search selection\",[20,[\"conf\",\"column\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"conf\",\"column\"]]],null]],null]]],{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Column Name\"],[8],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"columns\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,8,[]],[19,9,[]]],null]]]],[7],[0,\"\\n            \"],[1,[25,\"capitalize\",[[19,9,[]]],null],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[9]},null],[0,\"      \"],[8],[0,\"\\n\"]],\"parameters\":[7,8]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n    in\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"search selection\",[20,[\"conf\",\"within_type\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"conf\",\"within_type\"]]],null]],null]]],{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"any\"],[8],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"withinTypes\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,5,[]],[19,6,[]]],null]]]],[7],[0,\"\\n            \"],[1,[19,6,[\"name\"]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"      \"],[8],[0,\"\\n\"]],\"parameters\":[4,5]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n    \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"conf\",\"within_count\"]],\"ui\",\"1\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n    rows\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onchange\"],[\"search selection\",[20,[\"conf\",\"operator\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"conf\",\"operator\"]]],null]],null]]],{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"is\"],[8],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"operators\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,2,[]],[20,[\"question\"]]],null]]]],[7],[0,\"\\n            \"],[1,[19,3,[\"name\"]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"      \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"field display-inline-block\"],[7],[0,\"\\n    \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"conf\",\"value\"]],\"ui\",\"value\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"alert-simple-text\"],[7],[0,\"\\n    , raise\\n  \"],[8],[0,\"\\n  \"],[6,\"span\"],[9,\"class\",\"empty-space\"],[7],[8],[0,\"\\n  \"],[6,\"span\"],[10,\"class\",[26,[\"ui alert-state \",[18,\"color\"]]]],[7],[1,[18,\"type\"],false],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/alert-expression/template.hbs" } });
});
define('frontend/pods/components/api-action-modal/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        open: false,

        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        colors: ['indigo', 'red', 'yellow', 'teal'],

        showOpenInNewTab: _ember['default'].computed('apiAction.method', 'apiAction.headers', 'apiAction.body', function () {
            var headers = this.get('apiAction.headers');
            var body = this.get('apiAction.body');
            var method = this.get('apiAction.method');

            if (method == 'GET' && headers.length == 0 && !body) {
                return true;
            }
            return false;
        }),

        actions: {
            clear: function clear() {
                this.set('open', false);
            },
            changeColor: function changeColor(value) {
                this.set('apiAction.color', _ember['default'].$(value.currentTarget).attr('name'));
            },
            changeMethod: function changeMethod(value) {
                this.set('apiAction.method', _ember['default'].$(value.currentTarget).attr('name'));
            },
            saveApiAction: function saveApiAction() {
                var _this = this;

                // this.get('apiAction.headersArray').forEach((item) => {
                //     this.set(`apiAction.headers.${item.key}`, item.value);
                // });
                this.get('apiAction').save().then(function (response) {
                    _this.set('open', false);
                });
            }
        }
    });
});
define("frontend/pods/components/api-action-modal/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9FlK8Z7M", "block": "{\"symbols\":[\"modal\",\"footer\",\"error\",\"error\",\"error\",\"method\",\"color\",\"error\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"size\",\"open\",\"onHide\"],[\"center\",\"lg\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\"\\n            \"],[4,\"if\",[[20,[\"apiAction\",\"id\"]]],null,{\"statements\":[[0,\"Edit\"]],\"parameters\":[]},{\"statements\":[[0,\"Create\"]],\"parameters\":[]}],[0,\" Api Action \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"mb-2\"],[7],[0,\" Pro tip: You can use column names as variables. Use \"],[6,\"b\"],[7],[0,\"{\"],[8],[6,\"b\"],[7],[0,\"{\"],[8],[0,\" col_name \"],[6,\"b\"],[7],[0,\"}\"],[8],[6,\"b\"],[7],[0,\"}\"],[8],[0,\"\\n            in url, headers and body fields. \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-9 pr-2\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"apiAction\",\"name\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"each\",[[20,[\"apiAction\",\"errors\",\"name\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-flex\"],[7],[1,[19,8,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[8]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-3 pl-2\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Color\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row gutters-xs\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"colors\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"col-auto\"],[7],[0,\"\\n                                \"],[6,\"label\"],[9,\"class\",\"colorinput\"],[7],[0,\"\\n                                    \"],[1,[25,\"input\",null,[[\"name\",\"type\",\"class\",\"checked\",\"change\"],[[19,7,[]],\"checkbox\",\"colorinput-input\",[25,\"eq\",[[19,7,[]],[20,[\"apiAction\",\"color\"]]],null],[25,\"action\",[[19,0,[]],\"changeColor\"],null]]]],false],[0,\"\\n                                    \"],[6,\"span\"],[10,\"class\",[26,[\"colorinput-color bg-\",[19,7,[]]]]],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[7]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Method\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"selectgroup w-100\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"methods\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"label\"],[9,\"class\",\"selectgroup-item\"],[7],[0,\"\\n                                \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"class\",\"checked\",\"change\"],[\"checkbox\",[19,6,[]],\"selectgroup-input\",[25,\"eq\",[[19,6,[]],[20,[\"apiAction\",\"method\"]]],null],[25,\"action\",[[19,0,[]],\"changeMethod\"],null]]]],false],[0,\"\\n                                \"],[6,\"span\"],[9,\"class\",\"selectgroup-button\"],[7],[1,[19,6,[]],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Url\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"apiAction\",\"url\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"each\",[[20,[\"apiAction\",\"errors\",\"url\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-flex\"],[7],[1,[19,5,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Headers\"],[8],[0,\"\\n                    \"],[1,[25,\"key-value-maker\",null,[[\"objArray\"],[[20,[\"apiAction\",\"headers\"]]]]],false],[0,\"\\n\"],[4,\"each\",[[20,[\"apiAction\",\"errors\",\"headers\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-flex\"],[7],[1,[19,4,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"unless\",[[25,\"eq\",[[20,[\"apiAction\",\"method\"]],[25,\"or\",[\"GET\",\"DELETE\"],null]],null]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Body\"],[8],[0,\"\\n                        \"],[1,[25,\"textarea\",null,[[\"value\",\"class\"],[[20,[\"apiAction\",\"body\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"each\",[[20,[\"apiAction\",\"errors\",\"body\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"invalid-feedback d-flex\"],[7],[1,[19,3,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"showOpenInNewTab\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"custom-switch\"],[7],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"checked\",\"class\"],[\"checkbox\",[20,[\"apiAction\",\"open_in_new_tab\"]],\"custom-switch-input\"]]],false],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"custom-switch-indicator\"],[7],[8],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"custom-switch-description\"],[7],[0,\"Open In New Tab\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\"],[[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"saveApiAction\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Save\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/api-action-modal/template.hbs" } });
});
define('frontend/pods/components/api-action-result/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        aceTheme: 'ace/theme/ambiance',
        aceMode: 'ace/mode/JSON',

        status: _ember['default'].computed('result.status_code', function () {
            var status = this.get('result.status_code');
            if (status >= 200 && status < 400) {
                return {
                    color: 'teal',
                    text: 'success'
                };
            } else if (status >= 400 && status < 500) {
                return {
                    color: 'red',
                    text: 'error in Action Setup'
                };
            } else if (status >= 500) {
                return {
                    color: 'red',
                    text: 'Server Error'
                };
            }
            return {
                color: 'gray',
                text: 'status: unknown'
            };
        }),

        responseBody: _ember['default'].computed('result.response_body', function () {
            try {
                return JSON.stringify(JSON.parse(this.get('result.response_body')), null, 2);
            } catch (err) {
                return this.get('result.response_body');
            }
        }),

        debugResponse: _ember['default'].computed('result.response_body', function () {
            try {
                return JSON.stringify(this.get('result'), null, 2);
            } catch (err) {
                return this.get('result');
            }
        }),

        actions: {
            clear: function clear() {
                this.set('open', false);
            }
        }
    });
});
define("frontend/pods/components/api-action-result/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Q4XeGrci", "block": "{\"symbols\":[\"modal\",\"acc\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"size\",\"open\",\"onHide\"],[\"center\",\"lg\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row w-100\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-9\"],[7],[0,\"\\n                \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\" Result\"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-3 text-right\"],[7],[0,\"\\n                \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"class\",[26,[\"tag bg-\",[20,[\"status\",\"color\"]],\" text-white\"]]],[7],[1,[20,[\"status\",\"text\"]],false],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"canDebug\"]]],null,{\"statements\":[[4,\"bs-accordion\",null,null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],[[\"value\",\"title\"],[1,\"Debug info\"]],{\"statements\":[[0,\"                    \"],[1,[25,\"ember-ace\",null,[[\"lines\",\"value\",\"mode\",\"theme\",\"readOnly\",\"useWrapMode\",\"showLineNumbers\"],[20,[20,[\"debugResponse\"]],\"json\",[20,[\"aceTheme\"]],true,true,false]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[]},null],[0,\"        \"],[1,[25,\"ember-ace\",null,[[\"lines\",\"value\",\"mode\",\"theme\",\"readOnly\",\"useWrapMode\",\"showLineNumbers\"],[20,[20,[\"responseBody\"]],\"json\",[20,[\"aceTheme\"]],true,true,false]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/api-action-result/template.hbs" } });
});
define('frontend/pods/components/app-logo/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/app-logo/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "/I8VR4lj", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[10,\"class\",[26,[[18,\"logoSize\"],\" logo\"]]],[7],[0,\"\\n    \"],[6,\"img\"],[9,\"src\",\"/assets/images/logo.png\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/app-logo/template.hbs" } });
});
define('frontend/pods/components/area-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        defaultChartType: "Area",
        layoutName: 'components/base-chart-settings'
    });
});
define("frontend/pods/components/area-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "w8KQDHdf", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"defaultChartType\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"defaultChartType\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/area-chart-settings/template.hbs" } });
});
define('frontend/pods/components/area-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {

    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {

        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),
        stackedArea: function stackedArea(traces) {
            for (var i = 1; i < traces.length; i++) {
                for (var j = 0; j < Math.min(traces[i]['y'].length, traces[i - 1]['y'].length); j++) {
                    traces[i]['y'][j] += traces[i - 1]['y'][j];
                }
            }
            return traces;
        },

        defaultChartType: 'Area',

        getData: function getData(_this) {}
    });
});
define("frontend/pods/components/area-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QcBy/m0g", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/area-chart/template.hbs" } });
});
define('frontend/pods/components/bar-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        defaultChartType: "Bars",
        layoutName: 'components/base-chart-settings'
    });
});
define("frontend/pods/components/bar-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZIl66vu2", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"defaultChartType\",\"barType\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"defaultChartType\"]],[20,[\"barType\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/bar-chart-settings/template.hbs" } });
});
define('frontend/pods/components/bar-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {

    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {

        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'type', 'xLabel', 'yLable', 'title', 'barOrientation', 'barMode', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),
        defaultChartType: 'Bars',
        getData: function getData(_this) {}
    });
});
define("frontend/pods/components/bar-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "hInB0bvK", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/bar-chart/template.hbs" } });
});
define('frontend/pods/components/base-chart-settings/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {
        chartTypes: _ember['default'].computed(function () {
            return ['Line', 'Bars', 'Area', 'Bubble'];
        }),
        barOrientations: [{
            title: 'Horizontal',
            value: 'h'
        }, {
            title: 'Vertical',
            value: 'v'
        }],
        resultsColumnsHash: _ember['default'].computed('results.columns', function () {
            return this.get('results.columns') && this.get('results.columns').map(function (item) {
                return _ember['default'].Object.create({
                    columnName: item
                });
            });
        }),
        x1Hash: _ember['default'].computed('resultsViewSettings.x1', function () {
            return this.get('resultsViewSettings.x1') && _ember['default'].Object.create({
                columnName: this.get('resultsViewSettings.x1')
            });
        }),
        x2Hash: _ember['default'].computed('resultsViewSettings.x2', function () {
            return this.get('resultsViewSettings.x2') && _ember['default'].Object.create({
                columnName: this.get('resultsViewSettings.x2')
            });
        }),
        lineShapeTypes: [{
            name: 'smooth',
            value: 'spline'
        }, {
            name: 'straight',
            value: 'linear'
        }],
        isStacked: {
            name: 'Group',
            value: false
        },
        stackModes: [{
            title: 'Stacked',
            value: true
        }, {
            title: 'Group',
            value: false
        }],
        x1Name: _ember['default'].computed('defaultChartType', function () {
            if (this.get('defaultChartType') === 'Pie' || this.get('defaultChartType') === 'Funnel') {
                return 'Labels';
            }
            return 'x1';
        }),
        x2Name: 'x2',
        yName: _ember['default'].computed('defaultChartType', function () {
            if (this.get('defaultChartType') === 'Pie' || this.get('defaultChartType') === 'Funnel') {
                return 'Values';
            }
            return 'y';
        }),
        cordinateChart: _ember['default'].computed('defaultChartType', function () {
            var defaultChartType = this.get('defaultChartType');
            if (defaultChartType === 'Pie' || defaultChartType === 'Funnel') {
                return false;
            }
            return true;
        }),
        cordinateChartObserver: _ember['default'].on('init', _ember['default'].observer('cordinateChart', function () {
            var cordinateChart = this.get('cordinateChart');
            var multipleYs = this.get('multipleYs');
            if (!cordinateChart) {
                this.set('resultsViewSettings.x2', null);
                this.set('resultsViewSettings.x1', null);
                this.set('resultsViewSettings.multipleYs', multipleYs && multipleYs.slice(0, 1));
            }
        })),
        actions: {
            clearx2: function clearx2() {
                this.set('x2', null);
            },
            addYColumn: function addYColumn() {
                var multipleYs = this.get('multipleYs');
                if (multipleYs) {
                    multipleYs.pushObject(null);
                } else {
                    this.set('multipleYs', [{}]);
                }
            },
            removeColumn: function removeColumn(data) {
                this.get('multipleYs').removeObject(data);
            },
            updateSelection: function updateSelection(el, selection) {
                if (selection) {
                    this.set(el, selection.get('columnName'));
                } else {
                    this.set(el, null);
                }
            },
            selectLineShapeType: function selectLineShapeType(y, shape) {
                y.set('lineShape', shape);
            },
            updateY: function updateY(index, selection) {
                if (selection) {
                    this.get('multipleYs').replace(index, 1, [_ember['default'].Object.create({
                        columnName: selection.get('columnName')
                    })]);
                } else {
                    this.get('multipleYs').replace(index, 1, [null]);
                }
            }
        }
    });
});
define("frontend/pods/components/base-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3N/mbSpS", "block": "{\"symbols\":[\"y\",\"index\",\"dd\",\"ddm\",\"ct\",\"dd\",\"ddm\",\"lst\"],\"statements\":[[6,\"div\"],[9,\"class\",\"row border-bottom p-4\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[1,[18,\"x1Name\"],false],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"prompt\",\"on-change\"],[[20,[\"resultsColumnsHash\"]],\"columnName\",\"columnName\",[20,[\"x1Hash\"]],\"Select a Column\",[25,\"action\",[[19,0,[]],\"updateSelection\",\"resultsViewSettings.x1\"],null]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"cordinateChart\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[1,[18,\"x2Name\"],false],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"prompt\",\"on-change\"],[\"\",[20,[\"resultsColumnsHash\"]],\"columnName\",\"columnName\",[20,[\"x2Hash\"]],\"Select a Column\",[25,\"action\",[[19,0,[]],\"updateSelection\",\"resultsViewSettings.x2\"],null]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-x\"],[3,\"action\",[[19,0,[]],\"clearx2\"]],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"multipleYs\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[1,[18,\"yName\"],false],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"prompt\",\"on-change\"],[\"\",[20,[\"resultsColumnsHash\"]],\"columnName\",\"columnName\",[19,1,[]],\"Select\\n                    a Column\",[25,\"action\",[[19,0,[]],\"updateY\",[19,2,[]]],null]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row py-5 px-1\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\" \"],[1,[25,\"circular-checkbox\",null,[[\"checked\",\"dataTooltip\"],[[19,1,[\"separateYaxis\"]],\"Separate Y axis\"]]],false],[0,\" \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[25,\"or\",[[19,1,[\"chartType\"]],[20,[\"defaultChartType\"]]],null],\"Line\"],null]],null,{\"statements\":[[4,\"bs-dropdown\",null,null,{\"statements\":[[4,\"component\",[[19,6,[\"toggle\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-\",[25,\"if\",[[25,\"eq\",[[19,1,[\"lineShape\"]],\"spline\"],null],\"git-branch\",\"activity\"],null],\" mt-1 ml-1 text-gray \"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,6,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"each\",[[20,[\"lineShapeTypes\"]]],null,{\"statements\":[[4,\"component\",[[19,7,[\"item\"]]],null,{\"statements\":[[0,\"                                                \"],[6,\"div\"],[9,\"class\",\"row p-2 w-75 nav-link\"],[3,\"action\",[[19,0,[]],[25,\"mut\",[[19,1,[\"lineShape\"]]],null],[19,8,[\"value\"]]]],[7],[0,\"\\n                                                    \"],[6,\"i\"],[10,\"class\",[26,[\"px-2 fe fe-\",[25,\"if\",[[25,\"eq\",[[19,8,[\"value\"]],\"spline\"],null],\"git-branch\",\"activity\"],null]]]],[7],[8],[0,\" \"],[1,[25,\"capitalize\",[[19,8,[\"name\"]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[8]},null]],\"parameters\":[7]},null]],\"parameters\":[6]},null]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n\"],[4,\"bs-dropdown\",null,null,{\"statements\":[[4,\"component\",[[19,3,[\"toggle\"]]],null,{\"statements\":[[4,\"if\",[[19,1,[\"chartType\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"i\"],[10,\"class\",[26,[[25,\"get-chart-icon\",[[19,1,[\"chartType\"]]],null],\" text-gray\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                        \"],[6,\"i\"],[10,\"class\",[26,[[25,\"get-chart-icon\",[[20,[\"defaultChartType\"]]],null],\" text-gray\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"each\",[[20,[\"chartTypes\"]]],null,{\"statements\":[[4,\"component\",[[19,4,[\"item\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[9,\"class\",\"row p-2 w-75 nav-link\"],[3,\"action\",[[19,0,[]],[25,\"mut\",[[19,1,[\"chartType\"]]],null],[19,5,[]]]],[7],[0,\"\\n                                                \"],[6,\"i\"],[10,\"class\",[26,[[25,\"get-chart-icon\",[[19,5,[]]],null],\" px-2\"]]],[7],[8],[0,\" \"],[1,[25,\"capitalize\",[[19,5,[]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[5]},null]],\"parameters\":[4]},null]],\"parameters\":[3]},null],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-red\"],[3,\"action\",[[19,0,[]],\"removeColumn\",[19,1,[]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[4,\"if\",[[20,[\"cordinateChart\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"btn btn-link\"],[3,\"action\",[[19,0,[]],\"addYColumn\"]],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" Add another \"],[1,[18,\"yName\"],false],[0,\" column\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"cordinateChart\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10 offset-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"X Label\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"xLabel\"]],\"form-control\",\"X Lable\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"cordinateChart\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10 offset-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Y Label\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"yLabel\"]],\"form-control\",\"Y Label\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[false],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10 offset-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Title\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"title\"]],\"form-control\",\"Title\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10 offset-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Mode\"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"selected\",\"prompt\",\"on-change\"],[[20,[\"stackModes\"]],\"title\",[20,[\"resultsViewSettings\",\"isStacked\"]],\"Select a Mode\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"resultsViewSettings\",\"isStacked\"]]],null]],null]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/base-chart-settings/template.hbs" } });
});
define('frontend/pods/components/base-header/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        sessionService: _ember['default'].inject.service(),
        dashboards: _ember['default'].computed('store', function () {
            return this.get('store').query('dashboard', {
                limit: 5
            });
        }),
        actions: {
            goToDashboard: function goToDashboard(dashboard) {
                this.sendAction('goToDashboard', dashboard);
            },
            invalidateSession: function invalidateSession() {
                this.sendAction('invalidateSession');
            }
        }
    });
});
define("frontend/pods/components/base-header/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "u+RVCeQz", "block": "{\"symbols\":[\"dd\",\"ddm\",\"dd\",\"ddm\",\"dashboard\"],\"statements\":[[4,\"if\",[[20,[\"sessionService\",\"authenticated\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"d-flex\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-lg order-lg-first\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row\"],[7],[0,\"\\n                        \"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"header-brand\"]],{\"statements\":[[1,[25,\"app-logo\",null,[[\"logoSize\"],[\"small\"]]],false]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[25,\"can\",[\"show Dashboard\"],null]],null,{\"statements\":[[4,\"bs-dropdown\",null,[[\"class\"],[\"nav-item\"]],{\"statements\":[[0,\"                                \"],[4,\"component\",[[19,3,[\"toggle\"]]],[[\"class\"],[\"nav-link\"]],{\"statements\":[[0,\"Dashboards\\n                                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down mt-1 ml-1\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"menu\"]]],[[\"className\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"each\",[[20,[\"dashboards\"]]],null,{\"statements\":[[4,\"component\",[[19,4,[\"item\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"a\"],[9,\"class\",\"dropdown-item \"],[3,\"action\",[[19,0,[]],\"goToDashboard\",[19,5,[]]]],[7],[0,\" \"],[1,[19,5,[\"title\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"]],\"parameters\":[5]},null],[0,\" \"],[1,[19,4,[\"divider\"]],false],[0,\"\\n\"],[4,\"component\",[[19,4,[\"item\"]]],null,{\"statements\":[[0,\"                                        \"],[4,\"link-to\",[\"dashboards.index\"],[[\"class\"],[\"dropdown-item\"]],{\"statements\":[[0,\" All Dashboards \"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[4]},null]],\"parameters\":[3]},null]],\"parameters\":[]},null],[4,\"if\",[[25,\"can\",[\"show question\"],null]],null,{\"statements\":[[0,\"                            \"],[6,\"li\"],[9,\"class\",\"nav-item\"],[7],[0,\"\\n                                \"],[4,\"link-to\",[\"questions.all\"],[[\"class\"],[\"nav-link\"]],{\"statements\":[[0,\" Questions \"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"can\",[\"create question\"],null]],null,{\"statements\":[[0,\"                            \"],[6,\"li\"],[9,\"class\",\"nav-item\"],[7],[0,\"\\n                                \"],[4,\"link-to\",[\"questions.new\"],[[\"class\"],[\"nav-link\"]],{\"statements\":[[0,\" New Question \"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"li\"],[9,\"class\",\"nav-item\"],[7],[0,\"\\n                            \"],[4,\"link-to\",[\"data_references.databases.all\"],[[\"class\"],[\"nav-link\"]],{\"statements\":[[0,\" Data Reference \"]],\"parameters\":[]},null],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-lg-3 ml-auto\"],[7],[0,\"\\n                            \"],[6,\"li\"],[9,\"class\",\"nav-item right px-0\"],[7],[0,\"\\n\"],[4,\"bs-dropdown\",null,[[\"direction\",\"class\"],[\"left\",\"d-inline\"]],{\"statements\":[[4,\"component\",[[19,1,[\"toggle\"]]],[[\"class\"],[\"nav-link\"]],{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"item pp\"],[7],[0,\"\\n                                            \"],[6,\"img\"],[9,\"class\",\"profile_pic\"],[10,\"src\",[26,[[20,[\"sessionService\",\"user\",\"profile_pic\"]]]]],[7],[8],[0,\" \"],[8],[0,\" \"],[1,[20,[\"sessionService\",\"user\",\"full_name\"]],false],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down mt-1 ml-1\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[4,\"if\",[[25,\"can\",[\"show settings\"],null]],null,{\"statements\":[[0,\"                                                \"],[4,\"link-to\",[\"settings\"],[[\"class\"],[\"dropdown-item\"]],{\"statements\":[[0,\"Settings\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                            \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"invalidateSession\"]],[7],[0,\"Logout\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/base-header/template.hbs" } });
});
define('frontend/pods/components/bubble-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        defaultChartType: "Bubble",
        layoutName: 'components/base-chart-settings'
    });
});
define("frontend/pods/components/bubble-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RThwtxIa", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"defaultChartType\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"defaultChartType\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/bubble-chart-settings/template.hbs" } });
});
define('frontend/pods/components/bubble-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {

    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {

        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),

        defaultChartType: 'Bubble',
        getData: function getData(_this) {}
    });
});
define("frontend/pods/components/bubble-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "rRV0ur0d", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/bubble-chart/template.hbs" } });
});
define('frontend/pods/components/calendar-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        layoutName: 'components/base-chart-settings'
    });

    // export default Ember.Component.extend({
    // classNames: ["ui", "segment"],
    // date: Ember.computed.alias('resultsViewSettings.date'),
    // dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
    // actions: {
    //     addDataColumn(){
    //         if ( this.get('dataColumns')) {
    //             this.get('dataColumns').pushObject({})
    //         }else{
    //             this.set('dataColumns', [{}])
    //         }
    //     },
    //     removeColumn(data){
    //         this.get('dataColumns').removeObject(data)
    //     }
    // }
    // });
});
define("frontend/pods/components/calendar-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "EzXNZyJi", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"showXlabel\",\"showYlabel\",\"x1Name\",\"x2Name\",\"yName\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],false,false,\"Date\",\"GroupBy Column\",\"Data\"]]],false],[0,\"\\n\"],[2,\" <div class=\\\"ui form full\\\"> \"],[0,\"\\n\"],[2,\" <div class=\\\"ui grid\\\"> \"],[0,\"\\n\"],[2,\" <div class=\\\"eight wide column\\\"> \"],[0,\"\\n\"],[2,\" <div class=\\\"ui grid\\\"> \"],[0,\"\\n\"],[2,\" {{#each dataColumns as |data|}} -->\\n<!-- <div class=\\\"fourteen wide column\\\"> -->\\n<!-- <div class=\\\"field\\\"> -->\\n<!-- <label>Data Column</label> -->\\n<!-- {{#ui-dropdown class=\\\"search selection\\\" selected=data.columnName onChange=(action (mut data.columnName))  as |execute mapper|}}  -->\\n<!-- <div class=\\\"default text\\\">Data Column</div> -->\\n<!-- <i class=\\\"fe fe-chevron-down\\\"></i> -->\\n<!-- <div class=\\\"menu\\\"> -->\\n<!-- {{#each results.columns as |column|}} -->\\n<!-- <div class=\\\"item\\\" data-value=\\\"{{map-value mapper column}}\\\"> -->\\n<!-- {{capitalize column}} -->\\n                                </div>\\n                                <!-- {{/each}} -->\\n                                <!-- </div> -->\\n                                <!-- {{/ui-dropdown}} -->\\n                                <!-- </div> -->\\n                                <!-- </div> -->\\n                                <!-- <div class=\\\"two wide Column\\\"> -->\\n                                <!-- <i class=\\\"remove icon\\\" {{action 'removeColumn' data}}></i> -->\\n                                <!-- </div> -->\\n                                <!-- {{/each}} \"],[0,\"\\n                                \"],[2,\" </div> \"],[0,\"\\n                                \"],[2,\" <div class=\\\"add-text\\\" {{action 'addDataColumn'}}>Add another data column</div> \"],[0,\"\\n                                \"],[2,\" </div> \"],[0,\"\\n                                \"],[2,\" <div class=\\\"eight wide column\\\"> \"],[0,\"\\n                                \"],[2,\" <div class=\\\"field\\\"> \"],[0,\"\\n                                \"],[2,\" <label>Date Column</label> \"],[0,\"\\n                                \"],[2,\" {{#ui-dropdown class=\\\"search selection\\\" selected=date onChange=(action (mut date))  as |execute mapper|}}  -->\\n                                <!-- <div class=\\\"default text\\\">Date Column</div> -->\\n                                <!-- <i class=\\\"fe fe-chevron-down\\\"></i> -->\\n                                <!-- <div class=\\\"menu\\\"> -->\\n                                <!-- {{#each results.columns as |column|}} -->\\n                                <!-- <div class=\\\"item\\\" data-value=\\\"{{map-value mapper column}}\\\"> -->\\n                                <!-- {{ capitalize column}} -->\\n                                <!-- </div> -->\\n                                <!-- {{/each}} -->\\n                                <!-- </div> -->\\n                                <!-- {{/ui-dropdown}} \"],[0,\"\\n                                \"],[2,\" </div> \"],[0,\"\\n                                \"],[2,\" </div> \"],[0,\"\\n                                \"],[2,\" </div> \"],[0,\"\\n                                \"],[2,\" </div> \"],[2,\" \\n                                                  \"],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/calendar-chart-settings/template.hbs" } });
});
define('frontend/pods/components/calendar-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {
        // date: Ember.computed.alias('resultsViewSettings.date'),
        // dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
        // header: {
        //     left:   'title',
        //     center: '',
        //     right:  'prev,next'

        // },

        // groupByValues: Ember.computed('jsonData', function(){
        //     let data =  this.get('jsonData');
        //     return data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
        //         return [].concat.apply([], series.map((item, j)=>{
        //             return item.get('type')
        //         }))
        //     }))

        // }),

        // events: Ember.computed('jsonData', function(){
        //     let data =  this.get('jsonData');
        //     data =  data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
        //         return [].concat.apply([], series.map((item, j)=>{
        //             return item.get('contents').map((el)=>{
        //                 return {
        //                     title: el.get('y'),
        //                     start: el.get('x1'),
        //                     end: el.get('x1'),
        //                     backgroundColor: this.get('colors')[i + j],
        //                     className: "calander-data"
        //                 }
        //             })
        //         }))
        //     }));
        //     return data
        // }),
        // dataColors: Ember.computed('multipleYs.@each.columnName' , 'groupByValues', function(){
        //     let groupByValues = this.get('groupByValues')
        //     groupByValues = groupByValues  && groupByValues.filter((item)=>{return item})
        //     groupByValues = groupByValues && groupByValues.length != 0 && this.get('groupByValues') &&
        //             this.get('groupByValues').map((item, i)=> {
        //                 return {name: item, color: this.get('colors')[i]}
        //             })
        //     if (groupByValues){
        //         return groupByValues
        //     }else{
        //         return this.get('multipleYs') &&
        //                 this.get('multipleYs').map((item, i)=> {
        //                     return {name: item.columnName, color: this.get('colors')[i]}
        //                 })
        //     }
        // })
    });
});
define("frontend/pods/components/calendar-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bYbEbARe", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/calendar-chart/template.hbs" } });
});
define('frontend/pods/components/change-user-permissions-dialogue/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        // selectedPermissionSets: Ember.computed('user.permission_sets', function () {
        //     return this.get('user.permission_sets') && this.get('user.permission_sets').map((item) => {
        //         return this.get('store').peekRecord('permissionSet', item.get('id'));
        //     });
        // }),
        userNameOrEmail: _ember['default'].computed.or('user.full_name', 'user.email'),
        actions: {
            clear: function clear() {
                this.set('open', false);
            },
            mutUserPermissionSets: function mutUserPermissionSets(permissionSet) {
                this.set('user.permission_sets', [permissionSet]);
            },
            saveUserPermissions: function saveUserPermissions() {
                this.set('open', false);
                this.sendAction('saveUserPermissions', this.get('user'));
            }
        }
    });
});
define("frontend/pods/components/change-user-permissions-dialogue/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "dPHpNfDN", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"size\",\"onHide\"],[\"center\",[20,[\"open\"]],\"lg\",[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\" Change User Role of \"],[1,[18,\"userNameOrEmail\"],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"mb-2\"],[7],[0,\" Select user role. \"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"permissionSets\"]],\"name\",\"name\",[20,[\"user\",\"role\"]],false,\"Select Roles\",[25,\"action\",[[19,0,[]],\"mutUserPermissionSets\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clear\"],null],\"danger\"]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"saveUserPermissions\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Save\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/change-user-permissions-dialogue/template.hbs" } });
});
define("frontend/pods/components/circular-checkbox/component", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Component.extend({
        tagName: "span",
        click: function click() {
            this.toggleProperty("checked");
        }
    });
});
define("frontend/pods/components/circular-checkbox/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gdja7TWA", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"checked\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"circular checkbox\"],[10,\"data-tooltip\",[26,[[18,\"dataTooltip\"]]]],[9,\"data-inverted\",\"\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"circle icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"circular checkbox\"],[10,\"data-tooltip\",[26,[[18,\"dataTooltip\"]]]],[9,\"data-inverted\",\"\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"circle thin icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/circular-checkbox/template.hbs" } });
});
define('frontend/pods/components/create-dashboard-variable/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        showDatePicker: _ember['default'].computed('variable.var_type', function () {
            if (this.get('variable.var_type') == "Date") {
                return true;
            } else {
                return false;
            }
        })
    });
});
define("frontend/pods/components/create-dashboard-variable/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oRVav67N", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n    \"],[1,[20,[\"variable\",\"name\"]],false],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui form full\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"sixteen wide column\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Default (mendatory)\"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showDatePicker\"]]],null,{\"statements\":[[0,\"                    \"],[1,[25,\"ui-calendar\",null,[[\"date\",\"onChange\",\"placeholder\"],[[20,[\"variable\",\"default_date\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"variable\",\"default_date\"]]],null]],null],\"current_date\"]]],false],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"or\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"variable\",\"default\"]],\"ui\",\"current_date\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                    \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"variable\",\"default\"]],\"ui\",\"default\"]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/create-dashboard-variable/template.hbs" } });
});
define('frontend/pods/components/create-dashboard/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        dashboard: {},
        actions: {
            createDashboard: function createDashboard() {
                var dashboard = this.store.createRecord('dashboard', {
                    title: this.get('dashboard.title'),
                    description: this.get('dashboard.description')
                });
                dashboard.save().then(function (response) {});
            },
            createAndAddToDashboard: function createAndAddToDashboard() {
                var _this = this;

                dashboard.get('questions').addObject(this.get('question'));
                dashboard.save().then(function (response) {
                    _this.sendAction('transitionToDashBoard', response.id);
                });
            }
        }

    });
});
define("frontend/pods/components/create-dashboard/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "uwIjJDZD", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui modal create-dashboard\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Create Dashboard\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"create-dashboard content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui form full\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"sixteen wide column\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Title\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"dashboard\",\"title\"]],\"ui\",\"What are you calling it?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"sixteen wide column\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"dashboard\",\"description\"]],\"ui\",\"What does it show?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"onlyCreate\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"ui positive right button\"],[3,\"action\",[[19,0,[]],\"createDashboard\"]],[7],[0,\"\\n                Create and Add Question to Dashboard\\n                \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"ui positive violet right button \"],[3,\"action\",[[19,0,[]],\"createAndAddToDashboard\"]],[7],[0,\"\\n                Create and Add Question to Dashboard\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/create-dashboard/template.hbs" } });
});
define('frontend/pods/components/create-tag/component', ['exports', 'ember', 'frontend/mixins/colors-mixin'], function (exports, _ember, _frontendMixinsColorsMixin) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsColorsMixin['default'], {
        tag: {},
        actions: {
            createAndAddToTag: function createAndAddToTag(entity) {
                var _this = this;

                var tag = this.store.createRecord('tag', {
                    name: this.get('tag.name'),
                    description: this.get('tag.description'),
                    color: this.randomColor()
                });
                tag.get(this.get('entityName')).addObject(entity);
                tag.save().then(function (response) {
                    entity.get('tags').pushObject(response);
                    _this.sendAction('getData', response);
                });
            }
        }

    });
});
define("frontend/pods/components/create-tag/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "r/dq0Ks9", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui modal create-tag\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Create Tag\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"create-tag content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui form full\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"sixteen wide column\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"tag\",\"name\"]],\"ui\",\"What are you calling it?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"sixteen wide column\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"tag\",\"description\"]],\"ui\",\"What does it show?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive violet right button \"],[3,\"action\",[[19,0,[]],\"createAndAddToTag\",[20,[\"entity\"]]]],[7],[0,\"\\n            Create and Add \"],[1,[18,\"toEntityName\"],false],[0,\" to Tag\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/create-tag/template.hbs" } });
});
define('frontend/pods/components/create-variable/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        variableTypes: ['String', 'Integer', 'Date', 'Dynamic'].map(function (item) {
            return _ember['default'].Object.create({ title: item });
        }),
        showDatePicker: _ember['default'].computed('variable.var_type', function () {
            if (this.get('variable.var_type') == "Date") {
                return true;
            } else {
                return false;
            }
        }),
        varTypeHash: _ember['default'].computed("variable.var_type", function () {
            return _ember['default'].Object.create({ title: this.get("variable.var_type") });
        }),
        varTypeHash: _ember['default'].computed("variable.var_type", function () {
            return _ember['default'].Object.create({ title: this.get("variable.var_type") });
        }),
        variableTypeObserver: _ember['default'].observer('variable.var_type', function () {
            if (this.get('variable.var_type') == "Date") {
                this.set('default_date', new Date());
                this.set('variable.default', "current_date");
            }
        }),

        dynamic: _ember['default'].computed('variable.var_type', function () {
            return this.get('variable.var_type') == "Dynamic";
        }),

        questions: _ember['default'].computed('questionQuery', function () {
            return this.store.query('question', { for_variable: true, query: this.get('questionQuery') || "" });
        }),

        actions: {
            updateVarType: function updateVarType(selection) {
                this.set('variable.var_type', selection.get('title'));
                this.set('variable.default', null);
                this.set('variable.default_options', []);
                this.set('variable.question_filter', null);
            },
            updateQuestionSearch: function updateQuestionSearch(text) {
                this.set('questionQuery', text);
            }
        }

    });
});
define("frontend/pods/components/create-variable/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "8h1aSpS8", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"create-variable content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row w-100\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group w-100\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label text-default\"],[7],[0,\"Name\\n                        \"],[6,\"span\"],[9,\"class\",\"form-required\"],[7],[0,\"*\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\\n                    \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"class\",\"placeholder\"],[\"form-control\",[20,[\"variable\",\"name\"]],\"ui\",\"Variable name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label text-default mt-2\"],[7],[0,\"Type\\n                        \"],[6,\"span\"],[9,\"class\",\"form-required\"],[7],[0,\"*\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n  \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"prompt\",\"selected\",\"on-change\"],[[20,[\"variableTypes\"]],\"title\",\"Select a Variable Type\",[20,[\"varTypeHash\"]],[25,\"action\",[[19,0,[]],\"updateVarType\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"dynamic\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label text-default mt-2\"],[7],[0,\"Question Filter\\n                        \"],[6,\"span\"],[9,\"class\",\"form-required\"],[7],[0,\"*\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n  \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"prompt\",\"selected\",\"on-search\",\"on-change\"],[[20,[\"questions\"]],\"title\",\"Select a Filter Question\",[20,[\"variable\",\"question_filter\"]],[25,\"action\",[[19,0,[]],\"updateQuestionSearch\"],null],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"variable\",\"question_filter\"]]],null]],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label text-default mt-2\"],[7],[0,\"\\n                    Default\\n                    \"],[6,\"span\"],[9,\"class\",\"form-required\"],[7],[0,\"*\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[1,[25,\"accordion-multiselect\",null,[[\"label\",\"selection\",\"options\",\"labelProperty\",\"placeholder\"],[\"Default Options\",[20,[\"variable\",\"default_options\"]],[20,[\"variable\",\"questionFilterOptions\"]],\"name\",\"select few options\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label text-default mt-2\"],[7],[0,\"Default\\n                        \"],[6,\"span\"],[9,\"class\",\"form-required\"],[7],[0,\"*\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showDatePicker\"]]],null,{\"statements\":[[0,\"                        \"],[1,[25,\"ui-calendar\",null,[[\"class\",\"date\",\"onChange\",\"placeholder\"],[\"form-control\",[20,[\"default_date\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"default_date\"]]],null]],null],\"current_date\"]]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"or\"],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"class\",\"placeholder\"],[\"form-control\",[20,[\"variable\",\"default\"]],\"ui\",\"current_date\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                    \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"class\",\"placeholder\"],[\"form-control\",[20,[\"variable\",\"default\"]],\"ui\",\"default\"]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/create-variable/template.hbs" } });
});
define('frontend/pods/components/dashboard-grid/component', ['exports', 'ember', 'frontend/mixins/custom-events', 'frontend/mixins/loading-messages'], function (exports, _ember, _frontendMixinsCustomEvents, _frontendMixinsLoadingMessages) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsLoadingMessages['default'], _frontendMixinsCustomEvents['default'], {
        classNames: ['full'],
        timeZone: moment.tz.guess(),
        didInsertElement: function didInsertElement() {
            var _this = this;

            _ember['default'].run.next(function () {
                // begin loop
                var grid = _ember['default'].$('.grid-stack').data('gridstack');
                grid.cellHeight(grid.cellWidth());
                if (_this.get('dashboard.isEditing')) {
                    grid && grid.enable();
                } else {
                    grid && grid.disable();
                }
                _this.set('resizeTime', new Date());
            });
        },
        actions: {
            change: function change(args) {

                this.set('resizeTime', new Date());
            },
            showDeleteFromDashboardDialogue: function showDeleteFromDashboardDialogue(question) {
                this.set('toBeDeleted', question);
                this.set('toggleDeleteDashboardDialogue', true);
            },
            deleteFromDashboard: function deleteFromDashboard(question) {
                var dashboard = this.get('dashboard');
                dashboard.get('questions').removeObject(question);
                dashboard.save();
            },
            refreshQuestion: function refreshQuestion(question) {
                question.set('updated At', new Date());
                question.set('resultsCanBeLoaded', true);
            }

        }
    });
});
define("frontend/pods/components/dashboard-grid/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "iDswIB2c", "block": "{\"symbols\":[\"question\",\"dd\",\"ddm\",\"note\"],\"statements\":[[4,\"if\",[[20,[\"dashboard\"]]],null,{\"statements\":[[4,\"grid-stack\",null,[[\"class\",\"options\",\"onChange\"],[\"full\",[25,\"hash\",null,[[\"animate\",\"width\",\"verticalMargin\"],[true,48,\"0em\"]]],[25,\"action\",[[19,0,[]],\"change\"],null]]],{\"statements\":[[4,\"if\",[[20,[\"dashboard\",\"newNote\"]]],null,{\"statements\":[[4,\"grid-stack-item\",null,[[\"class\",\"options\"],[\"grid-segment\",[25,\"get\",[[20,[\"dashboard\"]],\"newNoteSettings\"],null]]],{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"h-100\"],[9,\"id\",\"js-notes-new\"],[7],[0,\" \"],[1,[25,\"dashboard-note-card\",null,[[\"note\"],[[20,[\"dashboard\",\"newNote\"]]]]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"each\",[[20,[\"dashboard\",\"notes\"]]],null,{\"statements\":[[4,\"if\",[[19,4,[\"id\"]]],null,{\"statements\":[[4,\"grid-stack-item\",null,[[\"class\",\"options\"],[\"grid-segment\",[25,\"get\",[[25,\"get\",[[20,[\"dashboard\"]],\"notes_settings\"],null],[25,\"get\",[[19,4,[]],\"id\"],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"h-100\"],[10,\"id\",[26,[\"js-notes-\",[19,4,[\"id\"]]]]],[7],[0,\" \"],[1,[25,\"dashboard-note-card\",null,[[\"note\"],[[19,4,[]]]]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[4]},null],[4,\"each\",[[20,[\"dashboard\",\"questions\"]]],null,{\"statements\":[[4,\"grid-stack-item\",null,[[\"class\",\"options\"],[\"grid-segment\",[25,\"get\",[[25,\"get\",[[20,[\"dashboard\"]],\"settings\"],null],[25,\"get\",[[19,1,[]],\"id\"],null]],null]]],{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"card h-100\"],[10,\"id\",[26,[\"js-question-\",[19,1,[\"id\"]]]]],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"showCardHeader\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"card-header row question\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-8\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" \"],[1,[19,1,[\"title\"]],false],[0,\" \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-4 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"updated_at\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"span\"],[7],[0,\"\\n                                        \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"left\"]],{\"statements\":[[0,\" Updated \"],[1,[25,\"moment-from-now\",[[19,1,[\"updated_at\"]]],[[\"timeZone\",\"interval\"],[[20,[\"timeZone\"]],1000]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                        \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-clock text-\",[19,1,[\"updatedAgoColor\"]]]]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"bs-dropdown\",null,[[\"direction\",\"class\"],[\"left\",\"d-inline-block\"]],{\"statements\":[[4,\"component\",[[19,2,[\"toggle\"]]],[[\"class\"],[\"\"]],{\"statements\":[[0,\"                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-more-vertical text-gray\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"if\",[[19,1,[\"has_permission\"]]],null,{\"statements\":[[4,\"component\",[[19,3,[\"item\"]]],null,{\"statements\":[[0,\"                                                \"],[4,\"link-to\",[\"questions.show\",[19,1,[\"id\"]]],[[\"class\"],[\"dropdown-item\"]],{\"statements\":[[0,\" View\\n                                                    Question \"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"item\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"refreshQuestion\",[19,1,[]]]],[7],[0,\" Refresh \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[20,[\"dashboard\",\"has_permission\"]],[25,\"can\",[\"edit dashboard\"],null]],null]],null,{\"statements\":[[4,\"component\",[[19,3,[\"item\"]]],null,{\"statements\":[[0,\"                                                \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"showDeleteFromDashboardDialogue\",[19,1,[]]]],[7],[0,\" Remove from\\n                                                    Dashboard \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[3]},null]],\"parameters\":[2]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[6,\"div\"],[9,\"class\",\"card-body m-0 p-0\"],[7],[0,\"\\n                        \"],[4,\"if\",[[19,1,[\"results\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"question-widget\",null,[[\"question\",\"results\",\"resultsViewSettings\",\"resizeTime\",\"resultsViewType\",\"hideMenu\",\"refresh\",\"dashboard\",\"remove\"],[[19,1,[]],[19,1,[\"results\"]],[19,1,[\"results_view_settings\"]],[20,[\"resizeTime\"]],[19,1,[\"results_view_settings\",\"resultsViewType\"]],[19,1,[\"showCardHeader\"]],\"refreshQuestion\",[20,[\"dashboard\"]],\"showDeleteFromDashboardDialogue\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,\"or\",[[19,1,[\"loading\"]],[25,\"not\",[[19,1,[\"content\",\"isLoaded\"]]],null]],null]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"loader text-primary\"],[7],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"parameters\":[]},null]],\"parameters\":[]},null],[1,[25,\"delete-dialogue\",null,[[\"open\",\"entityName\",\"entity\",\"delete\",\"className\"],[[20,[\"toggleDeleteDashboardDialogue\"]],\"question from Dashboard\",[20,[\"toBeDeleted\"]],\"deleteFromDashboard\",\"delete-from-dashboard\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/dashboard-grid/template.hbs" } });
});
define('frontend/pods/components/dashboard-note-card/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['h-100'],
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            Simditor.locale = 'en-US';
        },
        isEditing: _ember['default'].computed.alias('note.isEditing'),
        _editor: function _editor() {
            var _this2 = this;

            var editor = new Simditor({
                textarea: document.getElementById(this.get('textareaRandomId')),
                placeholder: '',
                defaultImage: 'images/image.png',
                params: {},
                upload: false,
                tabIndent: true,
                toolbarFloat: true,
                toolbarFloatOffset: 0,
                toolbarHidden: false,
                pasteImage: false,
                cleanPaste: false,
                toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', '|', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', '|', 'code', 'table', 'link', 'image', '|', 'indent', 'outdent', 'alignment']
            });
            var _this = this;
            editor.on('valuechanged', function (e, src) {
                _this2.set('note.content', editor.body.html());
            });
            return editor;
        },

        dashboardIsEditingObserver: _ember['default'].observer('note.dashboard.isEditing', function () {
            this.get('note.dashboard.isEditing') && this.set('isEditing', false);
        }),

        isEditingObserver: _ember['default'].on('init', _ember['default'].observer('isEditing', function () {
            if (this.get('isEditing')) {
                _ember['default'].run.next(this, function () {
                    this.set('editor', this._editor());
                });
            }
        })),
        textarea: _ember['default'].computed('randomId', function () {
            return document.getElementById(this.get('textareaRandomId'));
        }),

        textareaRandomId: _ember['default'].computed(function () {
            return 'textarea-' + parseInt(Math.random() * 100000000);
        }),
        actions: {
            toggleEditNote: function toggleEditNote() {
                this.toggleProperty('isEditing');
                if (this.get('isEditing')) {

                    this.set('note.dashboard.isEditing', false);
                }
            },
            deleteNote: function deleteNote() {
                var newRecord = !this.get('note.id');
                if (newRecord) {
                    this.set('note.dashboard.newNote', null);
                }
                this.get('note').destroyRecord();
            },
            saveNote: function saveNote() {
                var _this3 = this;

                var newRecord = !this.get('note.id');
                this.get('note').save().then(function (response) {
                    _this3.set('isEditing', false);
                    if (newRecord) {
                        var notes_settings = _this3.get('note.dashboard.notes_settings');
                        var el = $('#js-notes-new').parents('.grid-stack-item');
                        if (Object.keys(notes_settings).length === 0) {
                            _this3.set('note.dashboard.notes_settings', _ember['default'].Object.create());
                            notes_settings = _this3.get('note.dashboard.notes_settings');
                        }
                        notes_settings.set(response.id, {
                            x: el.data('gs-x'),
                            y: el.data('gs-y'),
                            width: el.data('gs-width'),
                            height: el.data('gs-height')
                        });
                    }
                    _this3.set('note.dashboard.newNote', null);
                    _this3.set('note.dashboard.isEditing', true);
                });
            }
        }
    });
});
define("frontend/pods/components/dashboard-note-card/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vg10b3il", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"card h-100\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"card-body p-0\"],[7],[0,\"\\n        \"],[4,\"if\",[[20,[\"isEditing\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"textarea\",null,[[\"id\",\"value\",\"class\"],[[20,[\"textareaRandomId\"]],[20,[\"note\",\"content\"]],\"hidden\"]]],false],[0,\" \"]],\"parameters\":[]},{\"statements\":[[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"w-100 p-2 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"can\",[\"edit dashboard\"],null]],null,{\"statements\":[[4,\"if\",[[25,\"not\",[[20,[\"note\",\"dashboard\",\"isEditing\"]]],null]],null,{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-edit text-muted\"],[3,\"action\",[[19,0,[]],\"toggleEditNote\"]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-red\"],[3,\"action\",[[19,0,[]],\"deleteNote\"]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"px-2\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"simditor\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"simditor-body py-0\"],[7],[0,\" \"],[1,[20,[\"note\",\"content\"]],true],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"isEditing\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer text-right\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-red\"],[3,\"action\",[[19,0,[]],\"toggleEditNote\"]],[7],[0,\"Cancel\"],[8],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[3,\"action\",[[19,0,[]],\"saveNote\"]],[7],[0,\"Save\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/dashboard-note-card/template.hbs" } });
});
define('frontend/pods/components/dashboard-select-variables/component', ['exports', 'ember', 'frontend/mixins/helper-mixin'], function (exports, _ember, _frontendMixinsHelperMixin) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsHelperMixin['default'], {
        variablesSelected: _ember['default'].computed.alias('dashboard.variables'),
        variablesRemaining: _ember['default'].computed('variables', 'variablesSelected.@each', function () {
            var variablesSelected = this.get('variablesSelected');
            return this.uniqueByName(this.get('variables').filter(function (item) {
                return variablesSelected.map(function (variable) {
                    return variable.get('name');
                }).indexOf(item.get('name')) < 0;
            }));
        }),
        variables: _ember['default'].computed('dashboard.questions.@each.variables.@each.content.isLoaded', function () {
            var dashboardQuestions = this.get('dashboard.questions');
            return [].concat.apply([], dashboardQuestions.map(function (item) {
                return item.get('variables').toArray();
            }));
        }),
        actions: {
            selectVariable: function selectVariable(variable) {
                this.set('isEditing', true);
                var variablesSelected = this.get('variablesSelected');
                variable = this.get('store').createRecord('variable', {
                    name: variable.get('name'),
                    'default': variable.get('default'),
                    var_type: variable.get('var_type'),
                    question_filter: variable.get('question_filter'),
                    default_options: variable.get('default_options')
                });
                variablesSelected.pushObject(variable);
            },
            removeVariable: function removeVariable(variable) {
                this.set('isEditing', true);
                var variablesSelected = this.get('variablesSelected');
                variablesSelected.removeObject(variable);
                variable.destroyRecord();
            },
            saveUserPermissions: function saveUserPermissions() {
                this.sendAction('saveUserPermissions', this.get('user'));
            }
        }
    });
});
define("frontend/pods/components/dashboard-select-variables/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "TJizsOsR", "block": "{\"symbols\":[\"variable\",\"variable\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui fullscreen modal select-dashboard-variables\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Select Variables for this dashboard\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\" content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"Selected\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"variablesSelected\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"four wide column margin-bottom\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"selected permission-select margin-top\"],[3,\"action\",[[19,0,[]],\"removeVariable\",[19,2,[]]]],[7],[0,\"\\n                        \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"Can be Selected\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"variablesRemaining\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"four wide column\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"permission-select margin-top\"],[3,\"action\",[[19,0,[]],\"selectVariable\",[19,1,[]]]],[7],[0,\"\\n                        \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui red cancel button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive right button\"],[7],[0,\"\\n            Done\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/dashboard-select-variables/template.hbs" } });
});
define('frontend/pods/components/dashboard-selector/component', ['exports', 'ember', 'ember-keyboard-shortcuts/mixins/component'], function (exports, _ember, _emberKeyboardShortcutsMixinsComponent) {
  exports['default'] = _ember['default'].Component.extend(_emberKeyboardShortcutsMixinsComponent['default'], {
    dashboards: _ember['default'].computed(function () {
      return this.get('store').findAll('dashboard');
    }),
    selectedIndex: 0,
    filteredDashboards: _ember['default'].computed('query', 'dashboards.isFulfilled', function () {
      this.set('selectedIndex', 0);
      var dashboards = this.get('dashboards');
      var query = this.get('query');
      if (query && query != "" && dashboards) {
        return dashboards.filter(function (item) {
          return item.get('title') && item.get('title').toLowerCase().match(query.toLowerCase());
        });
      } else {
        return dashboards;
      }
    }),
    actions: {
      incrementIndex: function incrementIndex() {
        if (this.get('selectedIndex') >= this.get('filteredDashboards.length') - 1) {
          this.set('selectedIndex', 0);
        } else {
          this.incrementProperty('selectedIndex');
        }
      },

      decrementIndex: function decrementIndex() {
        if (this.get('selectedIndex') <= 0) {
          this.set('selectedIndex', this.get('filteredDashboards.length') - 1);
        } else {
          this.decrementProperty('selectedIndex');
        }
      },
      goToDashboardClick: function goToDashboardClick(dashboard) {
        this.sendAction('goToDashboard', dashboard);
      },
      goToDashboard: function goToDashboard() {
        this.sendAction('goToDashboard', this.get('filteredDashboards').objectAt(this.get('selectedIndex')));
      }
    },

    keyboardShortcuts: {
      "up": 'decrementIndex',
      "down": 'incrementIndex',
      "enter": 'goToDashboard'
    }
  });
});
define("frontend/pods/components/dashboard-selector/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Sz5HxIBj", "block": "{\"symbols\":[\"dashboard\",\"index\"],\"statements\":[[6,\"div\"],[9,\"class\",\"searchbar overlay\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"dashboard-selector searchbar-content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"create-dashboard content\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui vertical menu full\"],[7],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"ui icon input\"],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"search icon\"],[7],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"Search a dashboard\",[20,[\"query\"]]]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"filteredDashboards\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[10,\"class\",[26,[\"item \",[25,\"if\",[[25,\"eq\",[[20,[\"selectedIndex\"]],[19,2,[]]],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"goToDashboardClick\",[19,1,[]]]],[7],[0,\"\\n          \"],[1,[19,1,[\"title\"]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},{\"statements\":[[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n          No Results\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/dashboard-selector/template.hbs" } });
});
define('frontend/pods/components/data-charts/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/data-charts/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "XpeDfbMi", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"id\",\"my-graph\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/data-charts/template.hbs" } });
});
define('frontend/pods/components/database-selector/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            toggleSql: function toggleSql() {
                this.sendAction('toggleSql');
            }
        }

    });
});
define("frontend/pods/components/database-selector/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "GprVWgEI", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"prompt\",\"selected\",\"optionLabelKey\",\"on-change\"],[[20,[\"databases\"]],\"name\",\"Select a Database\",[20,[\"queryObject\",\"database\"]],\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"queryObject\",\"database\"]]],null]],null]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/database-selector/template.hbs" } });
});
define('frontend/pods/components/db-tree/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        db: _ember['default'].computed('database', function () {
            var database = this.get('database');
            return this.get('store').peekRecord('database', database.id) || this.get('store').findRecord('database', database.id);
        }),
        tables: _ember['default'].computed('db', 'db.isLoaded', 'db.tables', 'db.tables.isLoaded', 'query', function () {
            var tables = this.get('db.tables');
            var query = this.get('query');
            query = query && query.trim();
            if (tables && query && query !== '') {
                return tables.filter(function (item) {
                    return item.get('readable_table_name') && item.get('readable_table_name').toLowerCase().match(query.toLowerCase());
                });
            }
            return tables && tables.slice(0, 10);
        }),
        actions: {
            toggleColumns: function toggleColumns(table) {
                table.toggleProperty('showColumnsInTree');
            }
        }
    });
});
define("frontend/pods/components/db-tree/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "TlQyUQzg", "block": "{\"symbols\":[\"table\",\"column\"],\"statements\":[[6,\"div\"],[9,\"class\",\"db-tree mx-1\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"form-group mb-0\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[20,[\"query\"]],\"form-control\",\"Search Tables\"]]],false],[0,\" \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"tree text-default\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"tables\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"node-name d-flex\"],[3,\"action\",[[19,0,[]],\"toggleColumns\",[19,1,[]]]],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"showColumnsInTree\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down pt-1 pr-2\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-right pt-1 pr-2\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                \"],[6,\"span\"],[9,\"class\",\"col-8\"],[7],[0,\" \"],[1,[19,1,[\"readable_table_name\"]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"text-right col-2\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"data_references.databases.show.tables.show.explore\",[20,[\"database\",\"id\"]],[19,1,[\"id\"]]],[[\"target\",\"bubbles\"],[\"_blank\",false]],{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-zoom-in\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[10,\"class\",[26,[\"leafs pl-4 \",[25,\"if\",[[19,1,[\"showColumnsInTree\"]],\"\",\"hidden\"],null]]]],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"columns\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"leaf-name\"],[7],[0,\" \"],[1,[19,2,[\"name\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/db-tree/template.hbs" } });
});
define('frontend/pods/components/delete-dialogue/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            clearDelete: function clearDelete() {
                this.set('open', false);
            },
            'delete': function _delete(entity) {
                this.set('open', false);
                this.sendAction('delete', entity);
            }
        }
    });
});
define("frontend/pods/components/delete-dialogue/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "7potMlVg", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clearDelete\"],null]]],{\"statements\":[[0,\"    \"],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\" Are you sure , you want to delete this \"],[1,[18,\"entityName\"],false],[0,\"? \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clearDelete\"],null],\"danger\"]],{\"statements\":[[0,\"No Way\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"delete\",[20,[\"entity\"]]],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Yes, I am Sure\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/delete-dialogue/template.hbs" } });
});
define('frontend/pods/components/dropdown-default/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/dropdown-default/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UhwEDn+o", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"object\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"default text\"],[7],[1,[18,\"object\"],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"default text\"],[7],[1,[18,\"default\"],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[20,[\"icon\"]]],null,{\"statements\":[[0,\"    \"],[6,\"i\"],[10,\"class\",[26,[[18,\"icon\"],\" icon\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/dropdown-default/template.hbs" } });
});
define('frontend/pods/components/filter-maker/component', ['exports', 'ember'], function (exports, _ember) {
    var _slice = Array.prototype.slice;
    exports['default'] = _ember['default'].Component.extend({
        filteredColumns: _ember['default'].computed('columns', 'columnQuery', function () {
            var columns = this.get('columns');
            var columnQuery = this.get('columnQuery');
            if (columns && columnQuery) {
                return columns.filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(columnQuery.toLowerCase());
                });
            } else {
                return columns;
            }
        }),
        filterObserver: _ember['default'].observer('filter.column', 'filter.operator', 'filter.value', 'filter.valueDateObj.dtt', 'filter.valueDateObj.value', 'filter.valueDateObj.duration', function () {

            if (this.get('filter.raw') && this.get('filter.value')) {
                this.set('filter.column', null);
                this.set('filter.operator', null);
                this.set("filter.label", this.get('filter.value'));
            } else if (this.get('filter.column') && this.get('filter.operator') && this.get('filter.valueDateObj') && !this.get('filter.value')) {
                var selectorsLabel = (this.get('filter.valueDateObj.value') || '30') + ' ' + (this.get('filter.valueDateObj.duration.name') || 'Days') + ' ' + (this.get('filter.valueDateObj.dtt.name') || 'Ago');
                this.set("filter.label", this.get('filter.column.human_name') + " " + this.get('filter.operator.name') + " " + selectorsLabel);
            } else if (this.get('filter.column') && this.get('filter.operator') && this.get('filter.value')) {
                this.set("filter.label", this.get('filter.column.human_name') + " " + this.get('filter.operator.name') + " " + this.get('filter.value'));
            } else {
                this.set("filter.label", null);
            }
        }),

        operators: [{ name: "is greater than", value: ">" }, { name: "is less than", value: "<" }, { name: "is greater than or equals to", value: ">=" }, { name: "is less than or equals to", value: "<=" }, { name: "is", value: "=" }, { name: "is not ", value: "!=" }, { name: "contains", value: "in" }, { name: "does not contain", value: "not in" }],
        actions: {
            switchToBuilder: function switchToBuilder() {
                this.sendAction.apply(this, ['switchToBuilder'].concat(_slice.call(arguments)));
            },

            switchToRaw: function switchToRaw() {
                this.sendAction.apply(this, ['switchToRaw'].concat(_slice.call(arguments)));
            }
        }
    });
});
define("frontend/pods/components/filter-maker/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "EU9c+UJC", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"border p-2\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"filter\",\"raw\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToBuilder\",\"filters\",[20,[\"filter\"]],false]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Builder\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-list text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"filter\",\"value\"]],\"form-control my-2\",\"joining_table.column = 'something'\"]]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToRaw\",\"filters\",[20,[\"filter\"]]]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Raw\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-code text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"filteredColumns\"]],\"human_name\",[20,[\"filter\",\"column\"]],\"Select a Column\",\"human_name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"filter\",\"column\"]]],null]],null]]]],false],[0,\"\\n        \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"prompt\",\"selected\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"operators\"]],\"name\",\"Select an operator\",[20,[\"filter\",\"operator\"]],\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"filter\",\"operator\"]]],null]],null]]]],false],[0,\"\\n        \"],[1,[25,\"filter-value-selector\",null,[[\"filter\"],[[20,[\"filter\"]]]]],false],[0,\" \"]],\"parameters\":[]}],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/filter-maker/template.hbs" } });
});
define('frontend/pods/components/filter-value-selector/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        valueObserver: _ember['default'].observer('filter.value', function () {
            this.setAllOtherFalse(this);
            var cv = this.get('sortedColumnValues').findBy("value", this.get('filter.value'));
            cv && cv.set('selected', true);
            this.set('filter.valueDateObj', { date: false });
        }),
        columnObserver: _ember['default'].observer('filter.column', function () {
            this.set('filter.value', null);
            if (this.get('showDatePicker')) {
                this.set('filter.valueDateObj', { date: true });
            } else {
                this.set('filter.valueDateObj', { date: false });
            }
        }),
        valueDateObjObserver: _ember['default'].observer('filter.valueDateObj.value', 'filter.valueDateObj.duration', 'filter.valueDateObj.dtt', function () {
            if (this.get('filter.valueDateObj.date')) {
                this.set('filter.value', null);
            }
        }),
        sortedColumnValues: _ember['default'].computed("filter.column", "filter.column.column_values.content.isLoaded", function () {
            var columnValues = this.get('filter.column.column_values');
            return columnValues && columnValues.sortBy('displayName');
        }),

        showDatePicker: _ember['default'].computed('filter.column', function () {
            var dataType = this.get('filter.column.data_type');
            if (dataType == 'date' || dataType == 'datetime' || dataType == 'timestamp without time zone' || dataType == 'timestamp') {
                return true;
            } else {
                return false;
            }
        }),
        durations: [{ name: "Seconds", value: "seconds" }, { name: "Minutes", value: "minutes" }, { name: "Hours", value: "hours" }, { name: "Days", value: "days" }, { name: "Weeks", value: "weeks" }, { name: "Months", value: "months" }, { name: "Quarters", value: "quarters" }, { name: "Years", value: "years" }],
        dateTimeTypes: [{ name: "Ago", value: "ago" }, { name: "After", value: "after" }],
        setAllOtherFalse: function setAllOtherFalse(_this) {
            _this.get('sortedColumnValues').forEach(function (item) {
                item.set('selected', false);
            });
        },

        actions: {
            selectOption: function selectOption(cv) {
                this.setAllOtherFalse(this);
                this.set("filter.value", cv.get("value"));
                cv.set('selected', true);
            }
        }
    });
});
define("frontend/pods/components/filter-value-selector/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4Y/VCEGw", "block": "{\"symbols\":[\"cv\"],\"statements\":[[4,\"each\",[[20,[\"sortedColumnValues\"]]],null,{\"statements\":[[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[19,1,[\"selected\"]],\"tag-primary\"],null],\" tag\"]]],[3,\"action\",[[19,0,[]],\"selectOption\",[19,1,[]]]],[7],[0,\"\\n  \"],[1,[19,1,[\"displayName\"]],false],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"showDatePicker\"]]],null,{\"statements\":[[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"filter\",\"valueDateObj\",\"value\"]],\"form-control my-2\",\"30\"]]],false],[0,\"\\n\"],[1,[25,\"searchable-select\",null,[[\"content\",\"class\",\"sortBy\",\"prompt\",\"selected\",\"optionLabelKey\",\"on-change\"],[[20,[\"durations\"]],\"my-2\",\"name\",\"Days\",[20,[\"filter\",\"valueDateObj\",\"duration\"]],\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"filter\",\"valueDateObj\",\"duration\"]]],null]],null]]]],false],[0,\"\\n  \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"prompt\",\"selected\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"dateTimeTypes\"]],\"name\",\"Ago\",[20,[\"filter\",\"valueDateObj\",\"dtt\"]],\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"filter\",\"valueDateObj\",\"dtt\"]]],null]],null]]]],false],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"divider\"],[7],[0,\"Or\"],[8],[0,\"\\n    \"],[1,[25,\"ui-calendar\",null,[[\"class\",\"date\",\"onChange\",\"placeholder\"],[\"form-control\",[20,[\"filter\",\"value\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"filter\",\"value\"]]],null]],null],\"Pick a date and time\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"class\",\"placeholder\"],[\"form-control my-2\",[20,[\"filter\",\"value\"]],\"ui\",\"Column Value\"]]],false],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/filter-value-selector/template.hbs" } });
});
define('frontend/pods/components/final-query-accordian/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/final-query-accordian/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "cO8NgPgu", "block": "{\"symbols\":[\"acc\",\"aitem\"],\"statements\":[[4,\"bs-accordion\",null,[[\"class\"],[\"text-default mb-1\"]],{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-status card-status-left bg-warning\"],[7],[8],[0,\"\\n\"],[4,\"component\",[[19,2,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"            \"],[6,\"span\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"variablesReplacedQuery\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-check text-success\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-danger\"],[7],[8],[0,\"\\n                    \"]],\"parameters\":[]}],[0,\" Variables Replaced \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"isQueryLimited\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-check text-success\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-danger\"],[7],[8],[0,\"\\n                    \"]],\"parameters\":[]}],[0,\" Limit of \"],[1,[18,\"queryLimit\"],false],[0,\" applied \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"additionalFiltersApplied\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-check text-success\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-danger\"],[7],[8],[0,\"\\n                    \"]],\"parameters\":[]}],[0,\" Additional Filters Applied \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[4,\"component\",[[19,2,[\"body\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"ember-ace\",null,[[\"lines\",\"value\",\"mode\",\"theme\",\"readOnly\"],[10,[20,[\"finalQuery\"]],[20,[\"aceMode\"]],[20,[\"aceTheme\"]],true]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/final-query-accordian/template.hbs" } });
});
define('frontend/pods/components/funnel-chart-settings/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        values: _ember['default'].computed.alias('resultsViewSettings.x1'),
        labels: _ember['default'].computed.alias('resultsViewSettings.multipleYs'),
        multipleYs: _ember['default'].computed.alias('resultsViewSettings.multipleYs'),
        title: _ember['default'].computed.alias('resultsViewSettings.title')
    });
});
define("frontend/pods/components/funnel-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "KN8WYgng", "block": "{\"symbols\":[\"y\",\"execute\",\"mapper\",\"column\",\"execute\",\"mapper\",\"column\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"eight wide column\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Labels\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"search selection\",[20,[\"values\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"values\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Values\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"results\",\"columns\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,6,[]],[19,7,[]]],null]]]],[7],[0,\" \"],[1,[25,\"capitalize\",[[19,7,[]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[7]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[5,6]},null],[0,\"            \"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"multipleYs\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Values\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"search selection\",[19,1,[\"columnName\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[19,1,[\"columnName\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Lables\"],[8],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"results\",\"columns\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,3,[]],[19,4,[]]],null]]]],[7],[0,\" \"],[1,[25,\"capitalize\",[[19,4,[]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[2,3]},null],[0,\"                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"eight wide stretched column\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Title\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"title\"]],\"ui\",\"Title\"]]],false],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/funnel-chart-settings/template.hbs" } });
});
define('frontend/pods/components/group-by-maker/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        selectedGroupBy: _ember['default'].computed('groupBy.selected', 'columns', function () {
            var selected = this.get('groupBy.selected');
            var columns = this.get('columns');
            if (selected && columns) {
                return this.get('columns').findBy('human_name', _ember['default'].Object.create(selected).get('human_name'));
            }
        }),

        filteredColumns: _ember['default'].computed('columns', 'columnQuery', function () {
            var columns = this.get('columns');
            var columnQuery = this.get('columnQuery');
            if (columns && columnQuery) {
                return columns.filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(columnQuery.toLowerCase());
                });
            } else {
                return columns;
            }
        }),
        labelObserver: _ember['default'].on('init', _ember['default'].observer('groupBy.selected', 'groupBy.castType', 'groupBy.selected.value', function () {
            var groupBy = this.get('groupBy');
            if (groupBy) {
                groupBy = _ember['default'].Object.create(groupBy);
                if (groupBy.get('selected.raw') == true) {
                    groupBy.set('selected.human_name', null);
                    groupBy.set('selected.name', null);
                }
                var label = groupBy.get('selected.human_name') || groupBy.get('selected.name') || groupBy.get('selected.value');
                if (this.get('isGroupByDateType')) {
                    label = label + ': ' + groupBy.get('castType.name');
                } else {
                    this.set('caseType', null);
                }
                groupBy.set('label', label);
            }
        })),

        isGroupByDateType: _ember['default'].computed('groupBy.selected', function () {
            var dataType = this.get('groupBy.selected.data_type');
            if (dataType == 'date' || dataType == 'datetime' || dataType == 'timestamp without time zone' || dataType == 'timestamp') {
                return true;
            } else {
                return false;
            }
        }),

        groupByDateTypes: [{
            name: 'As It is',
            value: null
        }, {
            name: 'by Seconds',
            value: 'seconds'
        }, {
            name: 'by Minute',
            value: 'minutes'
        }, {
            name: 'by Day',
            value: 'day'
        }, {
            name: 'by Hour',
            value: 'hour'
        }, {
            name: 'by Week',
            value: 'week'
        }, {
            name: 'by Month',
            value: 'month'
        }, {
            name: 'by Quarter',
            value: 'quarter'
        }, {
            name: 'by year',
            value: 'year'
        }, {
            name: 'by Hour of the day',
            value: 'hour_day'
        }, {
            name: 'by Day of the week',
            value: 'day_week'
        }, {
            name: 'by week of year',
            value: 'week_year'
        }, {
            name: 'by month of year',
            value: 'month_year'
        }, {
            name: 'by quarter of year',
            value: 'quarter_year'
        }],
        actions: {
            switchToBuilder: function switchToBuilder(type, el, handleSelected) {
                this.sendAction('switchToBuilder', type, el, handleSelected);
            },
            switchToRaw: function switchToRaw(type, el, handleSelected) {
                this.sendAction('switchToRaw', type, el, handleSelected);
            }
        }
    });
});
define("frontend/pods/components/group-by-maker/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9vfAAYEj", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"border p-2\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"groupBy\",\"selected\",\"raw\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToBuilder\",\"groupBys\",[20,[\"groupBy\"]],true]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Builder\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-list text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"groupBy\",\"selected\",\"value\"]],\"form-control my-2\",\"Something complex\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToRaw\",\"groupBys\",[20,[\"groupBy\"]],true]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Raw\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-code text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"filteredColumns\"]],\"human_name\",[20,[\"selectedGroupBy\"]],\"Select a Column\",\"human_name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"groupBy\",\"selected\"]]],null]],null]]]],false],[0,\"\\n        \"],[4,\"if\",[[20,[\"isGroupByDateType\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"groupByDateTypes\"]],\"name\",[20,[\"gropuBy\",\"castType\"]],\"Select a time Grouping\",\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"groupBy\",\"castType\"]]],null]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/group-by-maker/template.hbs" } });
});
define('frontend/pods/components/key-value-maker/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            deleteKey: function deleteKey(element) {
                this.get('objArray').removeObject(element);
            },
            addMore: function addMore() {
                this.get('objArray').pushObject({
                    key: '',
                    value: ''
                });
            }
        }
    });
});
define("frontend/pods/components/key-value-maker/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "dX5F9Q+J", "block": "{\"symbols\":[\"el\"],\"statements\":[[4,\"each\",[[20,[\"objArray\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-5 pr-2\"],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,1,[\"key\"]],\"form-control\",\"key\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-5 pl-2\"],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,1,[\"value\"]],\"form-control\",\"value\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"btn btn-link text-red\"],[3,\"action\",[[19,0,[]],\"deleteKey\",[19,1,[]]]],[7],[0,\"DELETE\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"btn btn-link\"],[3,\"action\",[[19,0,[]],\"addMore\"]],[7],[0,\" Add More\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/key-value-maker/template.hbs" } });
});
define('frontend/pods/components/keyboard-shortcuts-help/component', ['exports', 'ember', 'ember-keyboard-shortcuts/mixins/component'], function (exports, _ember, _emberKeyboardShortcutsMixinsComponent) {
  exports['default'] = _ember['default'].Component.extend(_emberKeyboardShortcutsMixinsComponent['default'], {
    init: function init() {
      this._super.apply(this, arguments);
      var showKeyboardShortcutsButton = localStorage.getItem('AG_showKeyboardShortcutsButton') == null ? true : localStorage.getItem('AG_showKeyboardShortcutsButton') == 'true';
      this.set('showKeyboardShortcutsButton', showKeyboardShortcutsButton);
    },
    showKeyboardShortcutsButton: true,
    showKeyboardShortcuts: false,

    actions: {
      toggleKeyboardShortcuts: function toggleKeyboardShortcuts() {
        this.toggleProperty('showKeyboardShortcuts');
      },

      toggleKeyboardShortcutsButton: function toggleKeyboardShortcutsButton() {
        this.toggleProperty('showKeyboardShortcutsButton');
        localStorage.setItem('AG_showKeyboardShortcutsButton', this.get('showKeyboardShortcutsButton'));
      }
    },

    keyboardShortcuts: {
      "ctrl+k": 'toggleKeyboardShortcuts',
      "ctrl+shift+k": 'toggleKeyboardShortcutsButton'
    }
  });
});
define("frontend/pods/components/keyboard-shortcuts-help/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZejKdySo", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"showKeyboardShortcutsButton\"]]],null,{\"statements\":[[6,\"div\"],[9,\"class\",\"fixed shortcut-button\"],[3,\"action\",[[19,0,[]],\"toggleKeyboardShortcuts\"]],[7],[0,\"\\n  ?\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"showKeyboardShortcuts\"]]],null,{\"statements\":[[6,\"div\"],[9,\"class\",\"sidebar\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n    Keyboard Shortcuts\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"subheader\"],[7],[0,\"\\n    Application\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+n\"],[8],[0,\" New Question\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+q\"],[8],[0,\" Search Questions\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+d\"],[8],[0,\" Search Dashboards\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+r\"],[8],[0,\" Go To Data Reference\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+q\"],[8],[0,\" Go To All Questions\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+k\"],[8],[0,\" Toggle Show Shortcuts Button\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+k\"],[8],[0,\" Show Keyboard Shortcuts\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"subheader\"],[7],[0,\"\\n    Dashboard\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+r\"],[8],[0,\" Refresh All Components\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"subheader\"],[7],[0,\"\\n    New Question/ Saved Question\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Enter\"],[8],[0,\" Run Query\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+d\"],[8],[0,\" Select Database\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+t\"],[8],[0,\" Select Table\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+f\"],[8],[0,\" Add Filters\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+g\"],[8],[0,\" Add group By Clause\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+o\"],[8],[0,\" Add Order By Clause\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[6,\"div\"],[9,\"class\",\"shortcut\"],[7],[0,\"Ctrl+Shift+v\"],[8],[0,\" Select View\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/keyboard-shortcuts-help/template.hbs" } });
});
define('frontend/pods/components/limited-query-accordian/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/limited-query-accordian/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MVA3MSLR", "block": "{\"symbols\":[\"acc\",\"aitem\"],\"statements\":[[4,\"bs-accordion\",null,[[\"class\"],[\"text-default mb-1\"]],{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"card-status card-status-left bg-warning\"],[7],[8],[0,\"\\n\"],[4,\"component\",[[19,2,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n        Limit has been set on this query. This happens when you try to load more than \"],[1,[18,\"queryLimit\"],false],[0,\" rows. You can still download complete data.\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"ember-ace\",null,[[\"lines\",\"value\",\"mode\",\"theme\",\"readOnly\"],[10,[20,[\"limitedQuery\"]],[20,[\"aceMode\"]],[20,[\"aceTheme\"]],true]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/limited-query-accordian/template.hbs" } });
});
define('frontend/pods/components/line-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        defaultChartType: "Line",
        layoutName: 'components/base-chart-settings'
    });
});
define("frontend/pods/components/line-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Kx+rGYR4", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"defaultChartType\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"defaultChartType\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/line-chart-settings/template.hbs" } });
});
define('frontend/pods/components/line-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {

    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {
        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'layout', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),
        defaultChartType: 'Line',

        getData: function getData(_this) {

            // let gd = _this.get('getNode')(_this);
            // let gridParent = _this.get('gridParent');
            // var data = _this.get('jsonData'),
            //     layout;
            // data = data && data.length > 0 && [].concat.apply([], data.map((series, i) => {
            //     return series.map((item, j) => {
            //         return _this.chartData(item, i, j, _this.getChartType(i), _this);
            //     });
            // }));
            // layout = data && _this.get('layout');
            // data && Plotly.newPlot(gd, data, layout, {
            //     modeBarButtonsToRemove: ['sendDataToCloud'],
            //     displaylogo: false,
            //     showLine: false
            // })
            //     .then(_this.get('downloadAsPNG'));
            // data && gridParent[0] && gridParent[0].addEventListener('plotlyResize', function () {
            //     let dimensions = _this.get('dimensions')(gridParent);
            //     Plotly.relayout(_this.get('randomId'), dimensions);
            // });
            // data && gd && gd.addEventListener('plotlyResize', function () {
            //     Plotly.Plots.resize(document.getElementById(_this.get('randomId')));
            // });
        }
    });
});
define("frontend/pods/components/line-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "00f4hzZP", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/line-chart/template.hbs" } });
});
define('frontend/pods/components/next-transition-warning/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            clearTransition: function clearTransition() {
                this.set('open', false);
            },
            goAheadWithNextTransition: function goAheadWithNextTransition() {
                this.set('open', false);
                this.sendAction('goAheadWithNextTransition');
            }

        }
    });
});
define("frontend/pods/components/next-transition-warning/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "L1Ycasxd", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clearTransition\"],null]]],{\"statements\":[[0,\"    \"],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\" If You leave this page, you will loose all the edits on this page. Are you sure you want to leave this page? \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clearTransition\"],null],\"danger\"]],{\"statements\":[[0,\"No Way\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"goAheadWithNextTransition\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Yes, I am Sure\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/next-transition-warning/template.hbs" } });
});
define('frontend/pods/components/number-chart-settings/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        title: _ember['default'].computed.alias('resultsViewSettings.title')
    });
});
define("frontend/pods/components/number-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BJppRUIt", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"eight wide stretched column\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Title\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"title\"]],\"ui\",\"Title\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/number-chart-settings/template.hbs" } });
});
define("frontend/pods/components/number-chart/component", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Component.extend({
        numbers: _ember["default"].computed("results", "displayName", function () {
            var _this = this;

            var row = this.get('results.rows')[0];
            return row && row.map(function (item, i) {
                var obj = _ember["default"].Object.create({
                    value: item,
                    title: _this.get('results.columns')[i]
                });
                return obj;
            });
        }),

        displayName: _ember["default"].computed("questionName", "resultsViewSettings.title", "results", function () {
            return this.get('resultsViewSettings.title') || this.get('results.columns')[0];
        }),

        onlyOne: _ember["default"].computed('numbers', function () {
            var numbers = this.get('numbers');
            if (numbers.length == 1) {
                numbers.objectAt(0).set('title', this.get('displayName'));
                return true;
            } else {
                return false;
            }
        })

    });
});
define("frontend/pods/components/number-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "nwoWcn7Z", "block": "{\"symbols\":[\"number\",\"number\"],\"statements\":[[6,\"div\"],[9,\"class\",\"number-chart full text-align-center\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"onlyOne\"]]],null,{\"statements\":[[4,\"each\",[[20,[\"numbers\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-12 text-center\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"h1 m-0 mt-4\"],[7],[0,\"\\n                            \"],[1,[25,\"localize\",[[19,2,[\"value\"]]],null],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"small\"],[9,\"class\",\"text-muted mb-4\"],[7],[0,\"\\n                            \"],[1,[25,\"capitalize\",[[19,2,[\"title\"]]],null],false],[0,\"\\n                        \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[]},{\"statements\":[[4,\"each\",[[20,[\"numbers\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-3\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"number-block  text-align-center \"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"h1 m-0\"],[7],[0,\"\\n                            \"],[1,[25,\"localize\",[[19,1,[\"value\"]]],null],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"small\"],[9,\"class\",\"text-muted mb-4\"],[7],[0,\"\\n                            \"],[1,[25,\"capitalize\",[[19,1,[\"title\"]]],null],false],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/number-chart/template.hbs" } });
});
define('frontend/pods/components/order-by-maker/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        filteredColumns: _ember['default'].computed('columns', 'columnQuery', function () {
            var columns = this.get('columns');
            var columnQuery = this.get('columnQuery');
            if (columns && columnQuery) {
                return columns.filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(columnQuery.toLowerCase());
                });
            } else {
                return columns;
            }
        }),
        labelObserver: _ember['default'].on('init', _ember['default'].observer('orderBy.column', 'orderBy.order', function () {
            var orderBy = this.get('orderBy');
            if (orderBy) {
                orderBy = _ember['default'].Object.create(orderBy);
                var label = orderBy.get('column.human_name') || orderBy.get('column.name') || orderBy.get('column.value');
                this.get('orderBy.column') && (label += ' : ' + this.get('orderBy.order.name'));
                orderBy.set('label', label);
            }
        })),

        orders: [{

            name: 'Asending',
            value: 'ASC'
        }, {

            name: 'Desending',
            value: 'DESC'
        }]

    });
});
define("frontend/pods/components/order-by-maker/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Kd1O4yZU", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\" border p-2\"],[7],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"filteredColumns\"]],\"human_name\",[20,[\"orderBy\",\"column\"]],\"Select a Column\",\"human_name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"orderBy\",\"column\"]]],null]],null]]]],false],[0,\"\\n    \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"orders\"]],\"name\",[20,[\"orderBy\",\"order\"]],\"Select Sort Direction\",\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"orderBy\",\"order\"]]],null]],null]]]],false],[0,\"\\n    \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/order-by-maker/template.hbs" } });
});
define('frontend/pods/components/pie-chart-settings/component', ['exports', 'ember', 'frontend/pods/components/base-chart-settings/component'], function (exports, _ember, _frontendPodsComponentsBaseChartSettingsComponent) {
    exports['default'] = _frontendPodsComponentsBaseChartSettingsComponent['default'].extend({
        defaultChartType: 'Pie',
        layoutName: 'components/base-chart-settings'
    });
});
define("frontend/pods/components/pie-chart-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "39AWTEj5", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"base-chart-settings\",null,[[\"resultsViewSettings\",\"results\",\"defaultChartType\",\"barType\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"defaultChartType\"]],[20,[\"barType\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/pie-chart-settings/template.hbs" } });
});
define('frontend/pods/components/pie-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {
    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {

        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),
        defaultChartType: 'Pie',

        total: _ember['default'].computed('jsonData', function () {
            var data = this.get('jsonData');
            return data && data.length >= 0 && data[0] && data[0].length > 0 && data[0][0].get('contents').map(function (el) {
                return el.get('x1');
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
        }),

        getData: function getData(_this) {}
    });
});
define("frontend/pods/components/pie-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "801TFSYR", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/pie-chart/template.hbs" } });
});
define('frontend/pods/components/pivot-table/component', ['exports', 'npm:react', 'npm:react-pivottable/PivotTableUI', 'npm:react-pivottable/TableRenderers', 'npm:react-pivottable/PlotlyRenderers', 'npm:react-plotly.js/factory'], function (exports, _npmReact, _npmReactPivottablePivotTableUI, _npmReactPivottableTableRenderers, _npmReactPivottablePlotlyRenderers, _npmReactPlotlyJsFactory) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };

  // create Plotly renderers via dependency injection
  var Plot = (0, _npmReactPlotlyJsFactory['default'])(window.Plotly);
  var PlotlyRenderers = (0, _npmReactPivottablePlotlyRenderers['default'])(Plot);

  var App = (function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
      _classCallCheck(this, App);

      _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
      this.state = props.resultsViewSettings;
      this.setData();
    }

    _createClass(App, [{
      key: 'setData',
      value: function setData() {
        var _this = this;

        this.data = [];
        if (this.props.results && this.props.results.rows) {
          this.props.results.rows.forEach(function (row) {
            var obj = {};
            _this.props.results.columns.forEach(function (col, i) {
              obj[col] = row[i];
            });
            _this.data.push(obj);
          });
        }
      }
    }, {
      key: 'setStateAndSendProps',
      value: function setStateAndSendProps(s) {
        this.setState(s);
        this.props.setState(s, this.props.context);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _npmReact['default'].createElement('div', { className: 'pivot-table' }, _npmReact['default'].createElement(_npmReactPivottablePivotTableUI['default'], _extends({
          data: this.data,
          cols: this.props.cols || [],
          renderers: Object.assign({}, _npmReactPivottableTableRenderers['default'], PlotlyRenderers),
          onChange: function onChange(s) {
            return _this2.setStateAndSendProps(s);
          }
        }, this.state)));
      }
    }]);

    return App;
  })(_npmReact['default'].Component);

  exports['default'] = App;
});

//import Plot from 'npm:react-plotly.js';
define("frontend/pods/components/pivot-table/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "HR2YAhgJ", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/pivot-table/template.hbs" } });
});
define('frontend/pods/components/query-builder/component', ['exports', 'ember', 'ember-keyboard-shortcuts/mixins/component'], function (exports, _ember, _emberKeyboardShortcutsMixinsComponent) {
  exports['default'] = _ember['default'].Component.extend(_emberKeyboardShortcutsMixinsComponent['default'], {

    databasesLength: _ember['default'].computed("databases.@each", function () {
      if (this.get('databases.length')) {
        return true;
      }
    }),

    selectedDatabase: _ember['default'].computed("queryObject.database", "databases.@each", function () {
      return this.get('store').peekRecord('database', this.get('queryObject.database.id'));
    }),
    showTags: true,
    actions: {
      getResults: function getResults() {
        this.sendAction('getResults', this.get('queryObject'));
      },
      toggleSql: function toggleSql() {
        this.sendAction('toggleSql');
      },
      changeDatabase: function changeDatabase() {
        $('.ks-database').click();
        $('.ks-database-input').focus();
      },
      changeTable: function changeTable() {
        $('.ks-table').click();
        $('.ks-table-input').click();
        $('.ks-table-search').focus();
      },
      changeGroupBys: function changeGroupBys() {
        $('.ks-group_bys').click();
      },
      changeOrderBys: function changeOrderBys() {
        $('.ks-order_bys').click();
      },
      changeView: function changeView() {
        $('.ks-view').click();
      },
      changeFilters: function changeFilters() {
        $('.ks-filters').click();
      }
    },

    keyboardShortcuts: {
      "ctrl+shift+d": "changeDatabase",
      "ctrl+shift+t": "changeTable",
      "ctrl+shift+f": "changeFilters",
      "ctrl+shift+g": "changeGroupBys",
      "ctrl+shift+o": "changeOrderBys",
      "ctrl+shift+v": "changeView"
    }
  });
});
define("frontend/pods/components/query-builder/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kT9n8/vy", "block": "{\"symbols\":[\"acc\",\"aitem\"],\"statements\":[[6,\"div\"],[9,\"class\",\"card long-accordion mr-2\"],[7],[0,\"\\n\"],[4,\"bs-accordion\",null,[[\"class\"],[\"text-default\"]],{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,2,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Database \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"right\"],[9,\"data-tooltip\",\"Switch to SQL\"],[9,\"data-inverted\",\"\"],[9,\"data-variation\",\"inverted\"],[3,\"action\",[[19,0,[]],\"toggleSql\"]],[7],[6,\"i\"],[9,\"class\",\"fe fe-terminal\"],[7],[8],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"                \"],[1,[25,\"database-selector\",null,[[\"queryObject\",\"toggleSql\",\"databases\",\"acc\"],[[20,[\"queryObject\"]],\"toggleSql\",[20,[\"databases\"]],[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"showTags\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"queryObject\",\"database\",\"name\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"full\"],[7],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag tag-primary\"],[7],[0,\" \"],[1,[20,[\"queryObject\",\"database\",\"name\"]],false],[8],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[2]},null],[0,\"        \"],[1,[25,\"subquery-builder\",null,[[\"queryObject\",\"databases\",\"acc\"],[[20,[\"queryObject\"]],[20,[\"databases\"]],[19,1,[]]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"showGetResults\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"content active\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-secondary full rounded-0\"],[7],[0,\" Crunching Data ... \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"content active\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-primary full rounded-0\"],[3,\"action\",[[19,0,[]],\"getResults\"]],[7],[0,\" Get Results \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null]],\"parameters\":[1]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/query-builder/template.hbs" } });
});
define('frontend/pods/components/question-options/component', ['exports', 'ember', 'frontend/mixins/custom-events'], function (exports, _ember, _frontendMixinsCustomEvents) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsCustomEvents['default'], {
        editing: false,
        actions: {
            showApiActionModal: function showApiActionModal() {
                var apiAction = this.get('store').createRecord('apiAction', {
                    color: 'indigo',
                    method: 'GET',
                    headers: [],
                    question: this.get('question')
                });
                this.set('apiAction', apiAction);
                this.set('toggleApiActionModal', true);
            },
            saveQuestion: function saveQuestion() {
                if (this.get('newQuestion')) {
                    this.set('editing', true);
                } else {
                    this.set('editing', false);
                }
                this.sendAction('saveQuestion');
            },
            showAddToDashboard: function showAddToDashboard() {
                this.set('toggleAddToDashboardModal', true);
            },
            showAddTags: function showAddTags() {
                this.set('toggleTagsModal', true);
            },
            editQuestion: function editQuestion() {
                this.set('editing', true);
            },
            addToDashboard: function addToDashboard(dashboard) {
                this.sendAction('addToDashboard', dashboard);
            },
            cancelEditingQuestion: function cancelEditingQuestion() {
                this.set('editing', false);
            },
            showDeleteDialogue: function showDeleteDialogue() {

                this.set('toggleDeleteDialogue', true);
            },
            showShareDialogue: function showShareDialogue() {
                this.set('toggleShareModal', 'true');
            },
            showSnapshotMaker: function showSnapshotMaker() {
                this.set('toggleSnapshotModal', true);
            },
            showWidgetCreator: function showWidgetCreator() {
                this.set('toggleWidgetModal', true);
            },
            deleteQuestion: function deleteQuestion(question) {
                var _this = this;

                question.destroyRecord().then(function (response) {
                    _this.sendAction('transitionToIndex');
                });
            },
            toggleVariableWindow: function toggleVariableWindow() {
                this.toggleProperty('showVariables');
                var plotlyComponent = _ember['default'].$('.js-plotly-plot')[0];
                plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
            },
            viewSnapshots: function viewSnapshots(question) {
                this.sendAction('transitionToSnapshots', question.id);
            }
        }

    });
});
define("frontend/pods/components/question-options/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "5kMaqWmp", "block": "{\"symbols\":[\"dd\",\"ddm\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row full\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"and\",[[20,[\"editing\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"form-group my-0\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"class\",\"placeholder\"],[\"form-control js-question_title\",[20,[\"questionName\"]],\"ui\",[20,[\"questionName\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\"\\n                            \"],[6,\"i\"],[10,\"class\",[26,[[20,[\"question\",\"icon\"]]]]],[7],[8],[0,\" \"],[1,[18,\"questionName\"],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[10,\"class\",[26,[\"col text-right \",[25,\"if\",[[20,[\"editing\"]],\"pt-1\"],null],\" \"]]],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"validQuestion\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary py-0 align-baseline\"],[3,\"action\",[[19,0,[]],\"saveQuestion\"]],[7],[0,\"\\n                                \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Save Question\"]],\"parameters\":[]},null],[0,\" SAVE \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[20,[\"editing\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[0,\"                            \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-gray py-0 align-baseline\"],[3,\"action\",[[19,0,[]],\"cancelEditingQuestion\"]],[7],[0,\"\\n                                \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Cancel Editing Question\"]],\"parameters\":[]},null],[0,\" CANCEL \"],[8],[0,\"\\n                            \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-red py-0 align-baseline\"],[3,\"action\",[[19,0,[]],\"showDeleteDialogue\"]],[7],[0,\"\\n                                \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Delete Question\"]],\"parameters\":[]},null],[0,\" DELETE \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"d-inline-flex\"],[7],[0,\"\\n                                    \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Edit\"]],\"parameters\":[]},null],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"btn btn-link text-primary py-0\"],[3,\"action\",[[19,0,[]],\"editQuestion\"]],[7],[0,\"EDIT\"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[20,[\"validQuestion\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[0,\"                        \"],[6,\"span\"],[9,\"class\",\"d-inline-flex\"],[7],[0,\"\\n                            \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Share\"]],\"parameters\":[]},null],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"btn btn-link text-primary py-0\"],[3,\"action\",[[19,0,[]],\"showShareDialogue\"]],[7],[0,\"SHARE\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"bs-dropdown\",null,[[\"direction\",\"class\"],[\"left\",\"d-inline\"]],{\"statements\":[[0,\"                        \"],[4,\"component\",[[19,1,[\"toggle\"]]],[[\"class\"],[\"btn btn-link text-primary py-0\"]],{\"statements\":[[0,\" MORE \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,1,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"if\",[[25,\"and\",[[25,\"and\",[[20,[\"validQuestion\"]],[20,[\"canCreateSnapshot\"]]],null],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"a\"],[9,\"class\",\"dropdown-item border-bottom\"],[3,\"action\",[[19,0,[]],\"showSnapshotMaker\"]],[7],[0,\"Create\\n                                        Snapshots/Schedule Report\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[25,\"and\",[[20,[\"validQuestion\"]],[20,[\"question\",\"id\"]]],null],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"a\"],[9,\"class\",\"dropdown-item border-bottom\"],[3,\"action\",[[19,0,[]],\"showApiActionModal\"]],[7],[0,\"Add an API\\n                                        Action\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"a\"],[9,\"class\",\"dropdown-item border-bottom\"],[3,\"action\",[[19,0,[]],\"showAddTags\"]],[7],[0,\"Add Tags\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"gt\",[[20,[\"question\",\"snapshots\",\"length\"]],0],null]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                        \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n                                        \"],[6,\"a\"],[9,\"class\",\"dropdown-item border-bottom\"],[7],[0,\"view \"],[1,[20,[\"question\",\"snapshots\",\"length\"]],false],[0,\"\\n                                            snapshot(s)\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[20,[\"enableAddToDashboard\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"a\"],[9,\"class\",\"dropdown-item border-bottom\"],[3,\"action\",[[19,0,[]],\"showAddToDashboard\"]],[7],[0,\" Add\\n                                        Question to Dashboard\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"toggleVariableWindow\"]],[7],[0,\"Toggle Variable Window\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\" \"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"question\",[20,[\"toggleDeleteDialogue\"]],[20,[\"question\"]],\"deleteQuestion\"]]],false],[0,\"\\n\"],[1,[25,\"share-entity\",null,[[\"entityName\",\"entity\",\"open\"],[\"Question\",[20,[\"question\"]],[20,[\"toggleShareModal\"]]]]],false],[0,\"\\n\"],[1,[25,\"add-tag\",null,[[\"entityName\",\"entity\",\"open\"],[\"Question\",[20,[\"question\"]],[20,[\"toggleTagsModal\"]]]]],false],[0,\" \"],[1,[25,\"add-to-dashboard\",null,[[\"question\",\"addToDashboard\",\"open\"],[[20,[\"question\"]],\"addToDashboard\",[20,[\"toggleAddToDashboardModal\"]]]]],false],[0,\"\\n\"],[1,[25,\"snapshot-creator\",null,[[\"question\",\"open\"],[[20,[\"question\"]],[20,[\"toggleSnapshotModal\"]]]]],false],[0,\" \"],[1,[25,\"widget-creator\",null,[[\"question\",\"open\"],[[20,[\"question\"]],[20,[\"toggleWidgetModal\"]]]]],false],[0,\"\\n\"],[1,[25,\"api-action-modal\",null,[[\"apiAction\",\"open\"],[[20,[\"apiAction\"]],[20,[\"toggleApiActionModal\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/question-options/template.hbs" } });
});
define('frontend/pods/components/question-selector/component', ['exports', 'ember', 'ember-keyboard-shortcuts/mixins/component'], function (exports, _ember, _emberKeyboardShortcutsMixinsComponent) {
  exports['default'] = _ember['default'].Component.extend(_emberKeyboardShortcutsMixinsComponent['default'], {
    questions: _ember['default'].computed(function () {
      return this.get('store').findAll('question');
    }),
    selectedIndex: 0,

    searchedQuestionsObserver: _ember['default'].on('init', _ember['default'].observer('query', 'questions.isFulfilled', function () {
      _ember['default'].run.debounce(this, this.setFilteredQuestions, 300);
    })),
    setFilteredQuestions: function setFilteredQuestions() {
      this.set('selectedIndex', 0);
      var questions = this.get('questions');
      var query = this.get('query');
      if (query && query != "" && questions) {
        this.set('filteredQuestions', this.get('store').query('question', { q: query, tag: null }));
      } else {
        return this.set('filteredQuestions', questions.filterBy('id'));
      }
    },
    actions: {
      incrementIndex: function incrementIndex() {
        if (this.get('selectedIndex') >= this.get('filteredQuestions.length') - 1) {
          this.set('selectedIndex', 0);
        } else {
          this.incrementProperty('selectedIndex');
        }
      },

      decrementIndex: function decrementIndex() {
        if (this.get('selectedIndex') <= 0) {
          this.set('selectedIndex', this.get('filteredQuestions.length') - 1);
        } else {
          this.decrementProperty('selectedIndex');
        }
      },
      goToQuestionClick: function goToQuestionClick(question) {
        this.sendAction('goToQuestion', question);
      },
      goToQuestion: function goToQuestion() {
        this.sendAction('goToQuestion', this.get('filteredQuestions').objectAt(this.get('selectedIndex')));
      }
    },

    keyboardShortcuts: {
      "up": 'decrementIndex',
      "down": 'incrementIndex',
      "enter": 'goToQuestion'
    }
  });
});
define("frontend/pods/components/question-selector/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vm4akcnO", "block": "{\"symbols\":[\"question\",\"index\"],\"statements\":[[6,\"div\"],[9,\"class\",\"searchbar overlay\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"dashboard-selector searchbar-content\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"create-dashboard content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui vertical menu full\"],[7],[0,\"\\n\\n      \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui icon input\"],[7],[0,\"\\n          \"],[6,\"i\"],[9,\"class\",\"search icon\"],[7],[8],[0,\"\\n          \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"Search a question\",[20,[\"query\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"filteredQuestions\"]]],null,{\"statements\":[[4,\"if\",[[19,1,[\"id\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[10,\"class\",[26,[\"item \",[25,\"if\",[[25,\"eq\",[[20,[\"selectedIndex\"]],[19,2,[]]],null],\"active\"],null]]]],[3,\"action\",[[19,0,[]],\"goToQuestionClick\",[19,1,[]]]],[7],[0,\"\\n        \"],[1,[19,1,[\"title\"]],false],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1,2]},{\"statements\":[[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n        No Results\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/question-selector/template.hbs" } });
});
define('frontend/pods/components/question-widget/component', ['exports', 'ember', 'frontend/mixins/chart-settings', 'frontend/mixins/colors-mixin'], function (exports, _ember, _frontendMixinsChartSettings, _frontendMixinsColorsMixin) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsChartSettings['default'], _frontendMixinsColorsMixin['default'], {
    colorway: _ember['default'].computed(function () {
      return this.get('colors').join("");
    }),
    setState: function setState(s, context) {
      var resultsViewSettings = {
        aggregatorName: s.aggregatorName,
        colOrder: s.colOrder,
        cols: s.cols,
        derivedAttributes: s.derivedAttributes,
        hiddenAttributes: s.hiddenAttributes,
        hiddenFromAggregators: s.hiddenFromAggregators,
        hiddenFromDragDrop: s.hiddenFromDragDrop,
        menuLimit: s.menuLimit,
        rendererName: s.rendererName,
        rowOrder: s.rowOrder,
        rows: s.rows,
        sorters: s.sorters,
        unusedOrientationCutoff: s.unusedOrientationCutoff,
        vals: s.vals,
        valueFilter: s.valueFilter,
        resultsViewType: "Pivot Table"
      };
      context.set('resultsViewSettings', resultsViewSettings);
    },

    componentContext: _ember['default'].computed(function () {
      return this;
    }),

    actions: {
      remove: function remove() {
        this.sendAction('remove', this.get('question'));
      },

      refresh: function refresh() {
        this.sendAction('refresh', this.get('question'));
      }
    }
  });
});
define("frontend/pods/components/question-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NwemMkIP", "block": "{\"symbols\":[\"dd\",\"ddm\"],\"statements\":[[4,\"if\",[[25,\"not\",[[20,[\"hideMenu\"]]],null]],null,{\"statements\":[[4,\"if\",[[20,[\"question\",\"updated_at\"]]],null,{\"statements\":[[0,\"        \"],[6,\"span\"],[9,\"class\",\"card-body-timer\"],[7],[0,\"\\n            \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"left\"]],{\"statements\":[[0,\" Updated \"],[1,[25,\"moment-from-now\",[[20,[\"question\",\"updated_at\"]]],[[\"timeZone\",\"interval\"],[[20,[\"timeZone\"]],1000]]],false],[0,\"\\\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-clock text-\",[20,[\"question\",\"updatedAgoColor\"]]]]],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"bs-dropdown\",null,[[\"direction\",\"class\"],[\"left\",\"card-body-menu\"]],{\"statements\":[[4,\"component\",[[19,1,[\"toggle\"]]],[[\"class\"],[\"\"]],{\"statements\":[[0,\"            \"],[6,\"i\"],[9,\"class\",\"fe fe-more-vertical text-gray\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"menu\"]]],[[\"class\"],[\"dropdown-menu-arrow\"]],{\"statements\":[[4,\"if\",[[20,[\"question\",\"has_permission\"]]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                    \"],[4,\"link-to\",[\"questions.show\",[20,[\"question\",\"id\"]]],[[\"class\"],[\"dropdown-item\"]],{\"statements\":[[0,\" View Question \"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"refresh\"]],[7],[0,\" Refresh \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[20,[\"dashboard\",\"has_permission\"]],[25,\"can\",[\"edit dashboard\"],null]],null]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"a\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"remove\"]],[7],[0,\" Remove from Dashboard \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"parameters\":[]},null],[6,\"div\"],[10,\"class\",[26,[\"renderer-component \",[18,\"fullscreenClass\"]]]],[7],[0,\" \"],[1,[25,\"component\",[[20,[\"resultsWidgetComponent\"]]],[[\"canEdit\",\"results\",\"resultsViewSettings\",\"resultsViewType\",\"questionName\",\"question\",\"context\",\"setState\",\"colorway\",\"resizeTime\"],[[25,\"can\",[\"edit question\"],null],[20,[\"results\"]],[20,[\"resultsViewSettings\"]],[20,[\"resultsViewType\"]],[20,[\"questionName\"]],[20,[\"question\"]],[20,[\"componentContext\"]],[20,[\"setState\"]],[20,[\"colorway\"]],[20,[\"resizeTime\"]]]]],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/question-widget/template.hbs" } });
});
define('frontend/pods/components/questions-list/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['full'],
        allQuestions: _ember['default'].computed.sort('questions', function (a, b) {
            if (a.get('updated_at') >= b.get('updated_at')) {
                return -1;
            } else {
                return 1;
            }
        }),
        tags: _ember['default'].computed(function () {
            return this.get('store').findAll('tag');
        }),
        timeZone: moment.tz.guess(),
        actions: {
            showDeleteDialogue: function showDeleteDialogue(questionToBeDeleted) {
                this.set('questionToBeDeleted', questionToBeDeleted);
                this.set('toggleDeleteDialogue', true);
            },
            addTag: function addTag(question) {
                this.set('addTagToQuestion', question);
                this.set('toggleTagsModal', true);
            },
            viewSnapshots: function viewSnapshots(question) {
                this.sendAction('transitionToSnapshots', question.id);
            },
            deleteQuestion: function deleteQuestion(question) {
                var _this = this;

                question.destroyRecord().then(function (response) {
                    _this.sendAction('transitionToIndex');
                });
            },
            getData: function getData(tag) {
                this.get('tags').pushObject(tag);
            },
            loadQuestion: function loadQuestion(question) {
                this.store.query('question', {
                    filter: {
                        id: question.id
                    }
                });
            },
            refreshQuestion: function refreshQuestion(question) {
                question && question.set('updatedAt', new Date());
                question.set('resultsCanBeLoaded', true);
            },
            toggleQuestionWidget: function toggleQuestionWidget(newQuestion, oldQuestion) {
                oldQuestion && oldQuestion.set('showQuestionWidgetOnListPage', false);
                newQuestion && newQuestion.set('showQuestionWidgetOnListPage', true);
                //Ember.$('html, body').scrollTop(Ember.$(newQuestion));
            }
        }
    });
});
define("frontend/pods/components/questions-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "zhglO76z", "block": "{\"symbols\":[\"acc\",\"question\",\"aitem\",\"dashboard\",\"tag\"],\"statements\":[[4,\"bs-accordion\",null,[[\"onChange\",\"class\"],[[25,\"action\",[[19,0,[]],\"toggleQuestionWidget\"],null],\"text-default py-1\"]],{\"statements\":[[4,\"each\",[[20,[\"allQuestions\"]]],null,{\"statements\":[[4,\"if\",[[25,\"and\",[[19,2,[\"id\"]],[19,2,[\"has_permission\"]]],null]],null,{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"value\",\"class\"],[[19,2,[]],\"my-2\"]],{\"statements\":[[4,\"component\",[[19,3,[\"title\"]]],[[\"class\"],[\"py-2 border-bottom-0\"]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"row justify-content-between\"],[3,\"action\",[[19,0,[]],\"loadQuestion\",[19,2,[]]]],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-auto\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                                \"],[6,\"span\"],[9,\"class\",\"avatar mr-2 text-white bg-primary\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[10,\"class\",[26,[[19,2,[\"icon\"]]]]],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[7],[0,\"\\n                                    \"],[6,\"h4\"],[9,\"class\",\"m-0\"],[7],[0,\"\\n                                        \"],[6,\"a\"],[9,\"href\",\"javascript:void(0)\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"questions.show\",[19,2,[\"id\"]]],null,{\"statements\":[[0,\"                                                \"],[6,\"div\"],[9,\"class\",\"h6 text-primary mb-0 question-title\"],[7],[0,\" \"],[1,[19,2,[\"title\"]],false],[0,\"\\n                                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                        \"],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                    \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" from \"],[6,\"span\"],[9,\"class\",\"table-name\"],[7],[1,[19,2,[\"human_sql\",\"table\",\"human_name\"]],false],[8],[0,\"\\n                                        \"],[4,\"if\",[[19,2,[\"human_sql\",\"table\",\"human_name\"]]],null,{\"statements\":[[0,\" in \"]],\"parameters\":[]},null],[0,\"\\n                                        \"],[6,\"span\"],[9,\"class\",\"database-name\"],[7],[1,[19,2,[\"human_sql\",\"database\",\"name\"]],false],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-auto\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"tags\"],[7],[0,\"\\n\"],[4,\"each\",[[19,2,[\"tags\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"span\"],[9,\"class\",\"tag\"],[10,\"style\",[26,[\"background: \",[19,5,[\"color\"]],\"; color: white; opacity: 0.8;\"]]],[7],[0,\"\\n                                        \"],[4,\"link-to\",[\"tags.show\",[19,5,[\"id\"]]],[[\"class\"],[\"text-white\"]],{\"statements\":[[0,\" \"],[1,[19,5,[\"name\"]],false],[0,\"\\n                                            \"],[6,\"span\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-tag\"],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[4,\"each\",[[19,2,[\"dashboards\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"span\"],[9,\"class\",\"tag\"],[7],[0,\"\\n                                        \"],[4,\"link-to\",[\"dashboards.show\",[19,4,[\"id\"]]],null,{\"statements\":[[0,\" \"],[1,[19,4,[\"title\"]],false],[0,\"\\n                                            \"],[6,\"span\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-grid\"],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col-2 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[19,2,[\"updated_at\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[7],[0,\"\\n                                    \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"left\"]],{\"statements\":[[0,\" Updated\\n                                        \"],[1,[25,\"moment-from-now\",[[19,2,[\"updated_at\"]]],[[\"timeZone\",\"interval\"],[[20,[\"timeZone\"]],1000]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-clock text-\",[19,2,[\"updatedAgoColor\"]]]]],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"span\"],[9,\"class\",\"px-1\"],[3,\"action\",[[19,0,[]],\"addTag\",[19,2,[]]]],[7],[0,\"\\n                                \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[\"top\",\"Add Tags\"]]],false],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-tag text-gray\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"px-1\"],[3,\"action\",[[19,0,[]],\"viewSnapshots\",[19,2,[]]]],[7],[0,\"\\n                                \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"view \"],[1,[19,2,[\"snapshots\",\"length\"]],false],[0,\"\\n                                    snapshot(s)\"]],\"parameters\":[]},null],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-copy text-gray\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-red px-0\"],[3,\"action\",[[19,0,[]],\"showDeleteDialogue\",[19,2,[]]]],[7],[0,\"\\n                                \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[\"top\",\"Delete Question\"]]],false],[0,\" DELETE \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"body\"]]],[[\"class\"],[\"border-top p-0\"]],{\"statements\":[[4,\"if\",[[19,2,[\"showQuestionWidgetOnListPage\"]]],null,{\"statements\":[[0,\"                        \"],[4,\"if\",[[19,2,[\"results\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"question-widget\",null,[[\"question\",\"results\",\"resultsViewSettings\",\"hideMenu\",\"resultsViewType\"],[[19,2,[]],[19,2,[\"results\"]],[19,2,[\"results_view_settings\"]],true,[19,2,[\"results_view_settings\",\"resultsViewType\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,\"or\",[[19,2,[\"loading\"]],[25,\"not\",[[19,2,[\"content\",\"isLoaded\"]]],null]],null]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"loader text-primary\"],[7],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"                \"],[6,\"div\"],[9,\"class\",\"card-footer\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"row justify-content-between\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"ml-2 d-none d-lg-block\"],[7],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted d-block mt-1\"],[7],[0,\"By\\n                                    \"],[1,[25,\"or\",[[19,2,[\"owner\",\"full_name\"]],[19,2,[\"owner\",\"email\"]]],null],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"col text-right\"],[7],[0,\"\\n                            \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" Updated\\n                                \"],[1,[25,\"moment-from-now\",[[19,2,[\"updated_at\"]]],[[\"timeZone\",\"interval\"],[[20,[\"timeZone\"]],1000]]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null]],\"parameters\":[]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"question\",[20,[\"toggleDeleteDialogue\"]],[20,[\"questionToBeDeleted\"]],\"deleteQuestion\"]]],false],[0,\"\\n\"],[1,[25,\"add-tag\",null,[[\"entityName\",\"tags\",\"entity\",\"open\"],[\"Question\",[20,[\"tags\"]],[20,[\"addTagToQuestion\"]],[20,[\"toggleTagsModal\"]]]]],false],[0,\"\\n\"],[1,[25,\"create-tag\",null,[[\"entityName\",\"entity\",\"getData\"],[\"questions\",[20,[\"addTagToQuestion\"]],\"getData\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/questions-list/template.hbs" } });
});
define('frontend/pods/components/results-table-settings/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/results-table-settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vB/dmJDy", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/results-table-settings/template.hbs" } });
});
define('frontend/pods/components/results-table/component', ['exports', 'ember', 'ember-light-table', 'ember-cli-pagination/computed/paged-array'], function (exports, _ember, _emberLightTable, _emberCliPaginationComputedPagedArray) {
    var computed = _ember['default'].computed;
    var observer = _ember['default'].observer;
    exports['default'] = _ember['default'].Component.extend({
        page: 1,
        perPage: 15,

        pagedRows: (0, _emberCliPaginationComputedPagedArray['default'])('results.rows'),

        resetPageObserver: observer('results', function () {
            this.set('pagedRows.page', 1);
        }),
        showResults: computed('results', function () {
            return this.get('results.rows').length > 0;
        }),

        page: _ember['default'].computed.alias('pagedRows.page'),
        perPage: _ember['default'].computed.alias('pagedRows.perPage'),
        totalPages: _ember['default'].computed.oneWay('pagedRows.totalPages'),
        showPageNumbers: _ember['default'].computed('totalPages', function () {
            return this.get('totalPages') - 1;
        }),
        actions: {
            editApiAction: function editApiAction(apiAction) {
                this.set('editableApiAction', apiAction);
                this.set('toggleEditApiActionModal', true);
            },
            showDeleteApiActionModal: function showDeleteApiActionModal(apiAction) {
                this.set('deletableApiAction', apiAction);
                this.set('toggleDeleteApiActionModal', true);
            },
            deleteApiAction: function deleteApiAction(apiAction) {
                apiAction.destroyRecord();
            },
            callApiAction: function callApiAction(apiAction, row) {
                var _this = this;

                var variables = this.get('results.columns').map(function (item, index) {
                    return {
                        name: item,
                        value: row[index]
                    };
                });
                apiAction.sendCall({
                    variables: variables
                }).then(function (response) {
                    if (response.redirect_url) {
                        window.open(response.redirect_url, '_blank');
                    } else {
                        _this.set('apiActionResult', response);
                        _this.set('toggleApiActionResult', true);
                    }
                })['catch'](function (error) {
                    _this.set('apiActionResult', {
                        status_code: 0,
                        response_body: '{"error" : "Could not parse Response" }'
                    });
                    _this.set('toggleApiActionResult', true);
                });
            }

        }
    });
});
define("frontend/pods/components/results-table/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lI4gIS6P", "block": "{\"symbols\":[\"row\",\"apiAction\",\"el\",\"index\",\"apiAction\",\"column\"],\"statements\":[[6,\"div\"],[9,\"class\",\"table-responsive\"],[7],[0,\"\\n    \"],[6,\"table\"],[9,\"class\",\"table table-hover table-outline table-vcenter text-nowrap card-table table-striped\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"results\",\"columns\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"th\"],[7],[1,[25,\"capitalize\",[[19,6,[]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[4,\"each\",[[20,[\"question\",\"api_actions\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"th\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"i\"],[9,\"class\",\"fe fe-edit text-primary\"],[3,\"action\",[[19,0,[]],\"editApiAction\",[19,5,[]]]],[7],[8],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x-square text-red\"],[3,\"action\",[[19,0,[]],\"showDeleteApiActionModal\",[19,5,[]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"pagedRows\"]]],null,{\"statements\":[[0,\"                \"],[6,\"tr\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[]]],null,{\"statements\":[[0,\"                        \"],[6,\"td\"],[9,\"class\",\"\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"exists-in\",[[19,4,[]],[20,[\"results\"]]],null]],null,{\"statements\":[[0,\"                                \"],[4,\"link-to\",[\"explore.new\",[25,\"get-column-id\",[[19,4,[]],[20,[\"results\"]]],null],[19,3,[]]],null,{\"statements\":[[0,\" \"],[1,[25,\"widgets/render-widgets\",null,[[\"el\",\"question\",\"index\",\"results\"],[[19,3,[]],[20,[\"question\"]],[19,4,[]],[20,[\"results\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"]],\"parameters\":[]},{\"statements\":[[1,[25,\"widgets/render-widgets\",null,[[\"el\",\"question\",\"index\",\"results\"],[[19,3,[]],[20,[\"question\"]],[19,4,[]],[20,[\"results\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[3,4]},null],[4,\"each\",[[20,[\"question\",\"api_actions\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"td\"],[7],[0,\"\\n                            \"],[6,\"div\"],[10,\"class\",[26,[\"btn btn-link text-\",[19,2,[\"color\"]],\" text-uppercase p-0\"]]],[3,\"action\",[[19,0,[]],\"callApiAction\",[19,2,[]],[19,1,[]]]],[7],[1,[19,2,[\"name\"]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showPageNumbers\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tfoot\"],[9,\"class\",\"full-width\"],[7],[0,\"\\n                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"th\"],[9,\"colspan\",\"100\"],[9,\"class\",\"p-0 pt-5\"],[7],[0,\"\\n                        \"],[4,\"if\",[[20,[\"showResults\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"page-numbers\",null,[[\"content\"],[[20,[\"pagedRows\"]]]]],false],[0,\" \"]],\"parameters\":[]},{\"statements\":[[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"centered\"],[7],[0,\" Looks like your query did not return any result. \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"Api Action\",[20,[\"toggleDeleteApiActionModal\"]],[20,[\"deletableApiAction\"]],\"deleteApiAction\"]]],false],[0,\"\\n\"],[1,[25,\"api-action-modal\",null,[[\"apiAction\",\"open\"],[[20,[\"editableApiAction\"]],[20,[\"toggleEditApiActionModal\"]]]]],false],[0,\"\\n\"],[1,[25,\"api-action-result\",null,[[\"canDebug\",\"result\",\"open\"],[[20,[\"canEdit\"]],[20,[\"apiActionResult\"]],[20,[\"toggleApiActionResult\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/results-table/template.hbs" } });
});
define('frontend/pods/components/share-entity/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    selectedUsers: _ember['default'].computed('entity.shared_to', function () {
      return this.get('entity.shared_to') && this.get('entity.shared_to').map(function (item) {
        return _ember['default'].Object.create({
          title: item
        });
      }) || [];
    }),
    users: _ember['default'].computed(function () {
      return this.get('store').findAll('user');
    }),
    userEmails: _ember['default'].computed('users', 'users.content.isLoaded', function () {
      return this.get('users').map(function (item) {

        return _ember['default'].Object.create({
          title: item.get('email')
        });
      });
    }),
    sortedUsers: _ember['default'].computed('users.content.isLoaded', function () {
      return this.get('users').sortBy('label');
    }),
    actions: {
      clearSharedTo: function clearSharedTo() {
        this.get('entity').rollbackAttributes('shared_to');
        this.set('open', false);
      },
      saveSharedTo: function saveSharedTo() {
        this.get('entity').save();
        this.set('open', false);
      },
      addToSharedTo: function addToSharedTo(item) {
        this.set('entity.shared_to', item.map(function (it) {
          return it.title;
        }));
      },
      addNewSharedTo: function addNewSharedTo(text) {
        var newUser = _ember['default'].Object.create({
          title: text
        });
        this.get('userEmails').addObject(newUser);
        this.get('selectedUsers').addObject(newUser);
        this.get('entity.shared_to').addObject(text);
      }
    }
  });
});
define("frontend/pods/components/share-entity/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lkW4zok6", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clearSharedTo\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\" Share \"],[1,[18,\"entityName\"],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"tip mb-2\"],[7],[0,\"Tip: Enter 'all' to share with everybody on AfterGlow\"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-add\",\"on-change\"],[[20,[\"userEmails\"]],true,[20,[\"selectedUsers\"]],false,\"Select People You want to share it with\",[25,\"action\",[[19,0,[]],\"addNewSharedTo\"],null],[25,\"action\",[[19,0,[]],\"addToSharedTo\"],null]]]],false],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"tip mt-2 mb-2\"],[7],[0,\"Or share the link below.\"],[8],[0,\"\\n        \"],[6,\"input\"],[9,\"type\",\"text\"],[10,\"value\",[20,[\"entity\",\"shareable_url\"]],null],[9,\"class\",\"form-control\"],[9,\"disabled\",\"\"],[7],[8],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clearSharedTo\"],null],\"danger\"]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"saveSharedTo\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Share\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/share-entity/template.hbs" } });
});
define('frontend/pods/components/snapshot-creator/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        toast: _ember['default'].inject.service(),
        sessionService: _ember['default'].inject.service(),

        snapshot: _ember['default'].computed(function () {
            return {
                name: this.get('question.title') + '-' + moment().format('LLLL'),
                description: 'Snapshot of ' + this.get('question.title') + ' on ' + moment().format('LLLL'),
                scheduled: false,
                interval: 86400,
                starting_at: new Date(),
                should_save_data_to_db: false,
                should_create_csv: true,
                keep_latest: 5,
                should_send_mail_on_completion: true,
                mail_to: [this.get('sessionService.user.email')],
                question: this.get('question')
            };
        }),
        intervals: [{
            name: '2 hours',
            value: 7200
        }, {
            name: '4 hours',
            value: 14400
        }, {
            name: '6 hours',
            value: 21600
        }, {
            name: '8 hours',
            value: 28800
        }, {
            name: '12 hours',
            value: 43200
        }, {
            name: '1 day',
            value: 86400
        }, {
            name: '2 days',
            value: 172800
        }, {
            name: '1 week',
            value: 604800
        }, {
            name: '2 weeks',
            value: 1209600
        }],

        intervalsReverseMapping: {
            7200: '2 hours',
            14400: '4 hours',
            21600: '6 hours',
            28800: '8 hours',
            43200: '12 hours',
            86400: '1 day',
            172800: '2 days',
            604800: '1 week',
            1209600: '2 weeks'
        },

        users: _ember['default'].computed(function () {
            return this.get('store').findAll('user');
        }),
        sortedUsers: _ember['default'].computed('users.content.isLoaded', function () {
            return this.get('users').sortBy('label');
        }),
        selectedUsers: _ember['default'].computed('snapshot.mail_to', function () {
            return this.get('snapshot.mail_to') && this.get('snapshot.mail_to').map(function (item) {
                return _ember['default'].Object.create({
                    title: item
                });
            }) || [];
        }),
        userEmails: _ember['default'].computed('users', 'users.content.isLoaded', function () {
            return this.get('users').map(function (item) {

                return _ember['default'].Object.create({
                    title: item.get('email')
                });
            });
        }),
        selectedColumns: _ember['default'].computed('snapshot.searchable_columns', function () {
            var searchableColumns = this.get('snapshot.searchable_columns');
            return searchableColumns && searchableColumns.map(function (column) {
                return {
                    title: column
                };
            });
        }),
        searchableColumnsOptions: _ember['default'].computed('question.columns', function () {
            var columns = this.get('question.columns');
            return columns && columns.map(function (column) {
                return {
                    title: column
                };
            });
        }),
        actions: {

            clear: function clear() {
                this.set('open', false);
            },
            selectScheduleInterval: function selectScheduleInterval(value) {
                this.set('snapshot.interval', value);
            },
            addToEmails: function addToEmails(item) {
                this.set('snapshot.mail_to', item.map(function (it) {
                    return it.title;
                }));
            },
            addToSearchableColumns: function addToSearchableColumns(values) {
                this.set('snapshot.searchable_columns', values && values.map(function (colObj) {
                    return colObj.title;
                }));
            },
            addNewEmail: function addNewEmail(text) {
                var newUser = _ember['default'].Object.create({
                    title: text
                });
                this.get('userEmails').addObject(newUser);
                this.get('selectedUsers').addObject(newUser);
                this.get('snapshot.mail_to').addObject(text);
            },
            createSnapshot: function createSnapshot() {
                var _this = this;

                this.set('open', false);
                if (this.get('edit')) {
                    this.get('snapshot').stopAndNew(this.get('snapshot')).then(function (response) {
                        _this.get('toast').success('Your snapshot is updated successfully', 'Yay!', {
                            closeButton: true,
                            timeout: 1500,
                            progressBar: false
                        });
                    });
                } else {
                    var snapshot = this.store.createRecord('snapshot', this.get('snapshot'));
                    snapshot.save().then(function (response) {
                        _this.get('toast').success('Your snapshot is being created. You\'ll get an email when it is complete', 'Yay!', {
                            closeButton: true,
                            timeout: 1500,
                            progressBar: false
                        });
                    });
                }
            }
        }

    });
});
define("frontend/pods/components/snapshot-creator/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "q4Mp9CZz", "block": "{\"symbols\":[\"modal\",\"footer\",\"interval\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"size\",\"open\",\"onHide\"],[\"center\",\"lg\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\" Create Snapshot \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"ui grid\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"snapshot\",\"name\"]],\"form-control\",\"What are you calling it?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Description\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"snapshot\",\"description\"]],\"form-control\",\"What does it show?\"]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"custom-control custom-checkbox\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"checked\",\"class\",\"type\"],[[20,[\"snapshot\",\"scheduled\"]],\"custom-control-input\",\"checkbox\"]]],false],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"custom-control-label\"],[7],[0,\"scheduled?\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-8\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"snapshot\",\"scheduled\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Schedule it every: \"],[8],[0,\"\\n                            \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectScheduleInterval\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"intervals\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"option\"],[10,\"value\",[19,3,[\"value\"]],null],[10,\"selected\",[25,\"eq\",[[20,[\"snapshot\",\"interval\"]],[19,3,[\"value\"]]],null],null],[7],[1,[25,\"capitalize\",[[19,3,[\"name\"]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"starting at\"],[8],[0,\" \"],[1,[25,\"ui-calendar\",null,[[\"date\",\"onChange\",\"placeholder\"],[[20,[\"snapshot\",\"starting_at\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"snapshot\",\"starting_at\"]]],null]],null],[20,[\"snapshot\",\"starting_at\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Keep Latest\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"snapshot\",\"keep_latest\"]],\"form-control\",\"Keep Latest X Snapshots\"]]],false],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"custom-control custom-checkbox\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"checked\",\"class\",\"type\"],[[20,[\"snapshot\",\"should_save_data_to_db\"]],\"custom-control-input\",\"checkbox\"]]],false],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"custom-control-label\"],[7],[0,\"Enable Indexing and autocomplete?\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"snapshot\",\"should_save_data_to_db\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Searchable Columns\"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"searchableColumnsOptions\"]],true,[20,[\"searchableColumns\"]],false,\"Add columns for indexing and autocomplete\",[25,\"action\",[[19,0,[]],\"addToSearchableColumns\"],null]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"custom-control custom-checkbox\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"checked\",\"class\",\"type\"],[[20,[\"snapshot\",\"should_create_csv\"]],\"custom-control-input\",\"checkbox\"]]],false],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"custom-control-label\"],[7],[0,\"create csv ?\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"custom-control custom-checkbox\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"checked\",\"class\",\"type\"],[[20,[\"snapshot\",\"should_send_mail_on_completion\"]],\"custom-control-input\",\"checkbox\"]]],false],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"custom-control-label\"],[7],[0,\"send mail after completion ?\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"snapshot\",\"should_send_mail_on_completion\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Email ids \"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-add\",\"on-change\"],[[20,[\"userEmails\"]],true,[20,[\"selectedUsers\"]],false,\"Select People You want to share it with\",[25,\"action\",[[19,0,[]],\"addNewEmail\"],null],[25,\"action\",[[19,0,[]],\"addToEmails\"],null]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clear\"],null],\"danger\"]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"createSnapshot\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Create Snapshot\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/snapshot-creator/template.hbs" } });
});
define('frontend/pods/components/snapshot-stop-confirmation/component', ['exports', '@ember/component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({});
});
define("frontend/pods/components/snapshot-stop-confirmation/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PtRF4j4l", "block": "{\"symbols\":[\"modal\",\"footer\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"open\",\"onHide\"],[\"center\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clearStop\"],null]]],{\"statements\":[[0,\"    \"],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\" Are you sure , you don't want this snapshot to run again? \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clearStop\"],null],\"danger\"]],{\"statements\":[[0,\"No Way\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"stop\",[20,[\"entity\"]]],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Yes, I am Sure\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/snapshot-stop-confirmation/template.hbs" } });
});
define('frontend/pods/components/snapshots-list/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['full'],
        actions: {
            editSnapshot: function editSnapshot(snapshot) {
                this.set('selectedSnapshot', snapshot);
                this.sendAction('editSnapshot');
            },
            deleteSnapshot: function deleteSnapshot(snapshot) {
                snapshot.destroyRecord();
            }
        }
    });
});
define("frontend/pods/components/snapshots-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FNUsZvbs", "block": "{\"symbols\":[\"snapshot\"],\"statements\":[[4,\"each\",[[20,[\"snapshots\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"ui segment full\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-9\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                    \"],[6,\"span\"],[9,\"class\",\"avatar mr-2 text-white bg-primary\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-database\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[7],[0,\"\\n                        \"],[6,\"h5\"],[9,\"class\",\"m-0 text-default\"],[7],[0,\" \"],[1,[19,1,[\"name\"]],false],[0,\" \"],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"scheduled\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\"\\n                                \"],[6,\"b\"],[7],[0,\"Scheduled Every:\"],[8],[0,\" \"],[1,[25,\"snapshot-time\",[[19,1,[\"interval\"]]],null],false],[0,\",\"],[8],[0,\"\\n                            \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\"\\n                                \"],[6,\"b\"],[7],[0,\"Subscribers:\"],[8],[0,\" \"],[1,[19,1,[\"mail_to\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" updated:\"],[1,[25,\"momentize\",[[19,1,[\"updated_at\"]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-3 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"should_save_data_to_db\"]]],null,{\"statements\":[[4,\"link-to\",[\"questions.show.snapshots.show\",[19,1,[\"question\",\"id\"]],[19,1,[\"id\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[7],[0,\"VIEW \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[19,1,[\"scheduled\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"editSnapshot\",[19,1,[]]]],[7],[0,\" EDIT \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-red\"],[3,\"action\",[[19,0,[]],\"deleteSnapshot\",[19,1,[]]]],[7],[0,\" DELETE \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\" \"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"entity\",\"delete\"],[\"snapshot\",[20,[\"questionToBeDeleted\"]],\"deleteSnapshot\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/snapshots-list/template.hbs" } });
});
define('frontend/pods/components/subquery-builder/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        selectedTable: null,
        unsortedTables: _ember['default'].computed('queryObject.database', 'databases.content.isLoaded', 'queryObject.database.id', 'database.tables.content.isLoaded', function () {
            if (this.get('queryObject.database') && this.get('databases.length') && this.get('queryObject.database.id')) {
                var store = this.get('store');
                var database = store.peekRecord('database', this.get('queryObject.database.id')) || store.findRecord('database', this.get('queryObject.database.id'));
                return database && database.get('tables');
            }
        }),

        questions: _ember['default'].computed('questionQuery', function () {
            if (!this.get('queryObject.database.id')) {
                return [];
            }
            return this.store.query('question', {
                database_id: this.get('queryObject.database.id'),
                query: this.get('questionQuery') || ''
            });
        }),
        tables: _ember['default'].computed('unsortedTables', 'tableQuery', 'unsortedTables.content.isLoaded', function () {
            var tables = this.get('unsortedTables') && this.get('unsortedTables').sortBy('human_name');
            var tableQuery = this.get('tableQuery');
            if (tables && tableQuery) {
                return tables.filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(tableQuery.toLowerCase());
                });
            } else {
                return tables;
            }
        }),
        tablesObserver: _ember['default'].observer('tables', function () {
            if (this.get('tables') && !this.get('tables').isAny('id', this.get('queryObject.table.id'))) {
                this.set('queryObject.table', null);
                this.set('queryObject.filters', []);
                this.set('queryObject.groupBys', []);
                this.set('queryObject.orderBys', []);
                this.set('queryObject.rawQuery', null);
            }
        }),
        // columnsObserver:  Ember.observer('columns', function(){
        //     if (!this.get('columns').isAny('id', this.get('queryObject.filters.0.column.id'))){
        //         this.set('queryObject.filters', []);
        //     }
        //     if (!this.get('columns').isAny('id', this.get('queryObject.groupBys.0.column.id'))){
        //         this.set('queryObject.groupBys', []);
        //     }
        //     if (!this.get('columns').isAny('id', this.get('queryObject.orderBys.0.column.id'))){
        //         this.set('queryObject.orderBys', []);
        //     }
        // }),
        filters: [{
            column: 'c1',
            operator: 'Not In',
            value: 5
        }],
        selectViews: [{
            selected: {
                name: 'Count',
                value: 'count'
            }
        }],
        questionResultsObserver: _ember['default'].on('init', _ember['default'].observer('queryObject.table', function () {
            var question = this.get('queryObject.table');
            if (this.get('queryObject.fromQuestion') && question) {
                var _question = this.get('queryObject.table');
                this.get('store').query('question', {
                    filter: {
                        id: _question.id
                    }
                });
            }
        })),
        unsortedColumns: _ember['default'].computed('queryObject.table', 'tables.content.isLoaded', function () {
            if (this.get('queryObject.table') && this.get('tables.length') && this.get('queryObject.table.id')) {
                var store = this.get('store');
                var table = this.get('tables').findBy('id', this.get('queryObject.table.id'));
                return table && table.get('columns');
            }
        }),

        columns: _ember['default'].computed('unsortedColumns', 'unsortedColumns.content.isLoaded', 'queryObject.table.cached_results', function () {
            var _this2 = this;

            var fromQuestion = this.get('queryObject.fromQuestion');
            if (!fromQuestion) {
                return this.get('unsortedColumns') && this.get('unsortedColumns').sortBy('name');
            } else {
                return this.get('queryObject.table') && this.get('queryObject.table.cached_results.columns') && this.get('queryObject.table.cached_results.columns').map(function (item, index) {
                    return {
                        name: item,
                        human_name: item,
                        data_type: _this2.figureOutDataType(index)
                    };
                });
            }
        }),
        figureOutDataType: function figureOutDataType(index) {
            var dataType = 'Not Relevent';
            this.get('queryObject.table.cached_results.rows') && this.get('queryObject.table.cached_results.rows').every(function (row) {
                if (moment(row[index], moment.ISO_8601, true).isValid()) {
                    dataType = 'datetime';
                    return false;
                }
                return true;
            });
            return dataType;
        },

        rawObject: _ember['default'].computed(function () {
            return _ember['default'].Object.extend({

                selected: null,
                label: _ember['default'].computed('selected', 'selected.value', function () {
                    if (this.get('selected.raw') == true) {
                        this.set('selected.human_name', null);
                        this.set('selected.name', null);
                    }
                    return this.get('selected.human_name') || this.get('selected.name') || this.get('selected.value');
                })
            });
        }),
        rawObjectWithSelected: function rawObjectWithSelected(_this) {
            var selected = _this.get('rawObject').create();
            selected.set('selected', _ember['default'].Object.create({
                raw: false,
                value: null
            }));
            selected.set('castType', _ember['default'].Object.create({}));
            return selected;
        },
        filtersTagsShow: _ember['default'].computed('queryObject.filters.@each.label', function () {
            var show = false;
            var filters = this.get('queryObject.filters');
            filters.forEach(function (item) {
                if (item.label) {
                    show = true;
                }
            });
            return show;
        }),
        actions: {

            updateQuestionSearch: function updateQuestionSearch(text) {
                this.set('questionQuery', text);
            },
            addFilter: function addFilter() {
                this.get('queryObject.filters').pushObject(_ember['default'].Object.create({
                    column: null,
                    operator: null,
                    value: null,
                    valueDateObj: {}
                }));
            },

            addView: function addView() {
                this.get('queryObject.views').pushObject(_ember['default'].Object.create({}));
            },

            addGroupBy: function addGroupBy() {
                this.get('queryObject.groupBys').pushObject(this.get('rawObjectWithSelected')(this));
            },
            addOrderBy: function addOrderBy() {
                this.get('queryObject.orderBys').pushObject(_ember['default'].Object.create({}));
            },
            switchToBuilder: function switchToBuilder(type, el, handleSelected) {
                var items = this.get('queryObject').get(type);
                if (handleSelected) {
                    el.set('selected', _ember['default'].Object.create({}));
                    el.set('castType', null);
                } else {
                    el.set('raw', false);
                }
            },
            switchToRaw: function switchToRaw(type, el, handleSelected) {
                var items = this.get('queryObject').get(type);
                if (handleSelected) {
                    el.set('selected', _ember['default'].Object.create({
                        raw: true
                    }));
                    el.set('castType', null);
                } else {
                    el.set('raw', true);
                }
            },
            remove: function remove(type, el) {
                var arr = this.get('queryObject').get(type);
                arr.removeObject(el);
            },
            toggleFromTable: function toggleFromTable() {
                this.toggleProperty('queryObject.fromQuestion');
            }
        }
    });
});
define("frontend/pods/components/subquery-builder/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1qBIUjem", "block": "{\"symbols\":[\"aitem\",\"aitem\",\"aitem\",\"orderBy\",\"orderBy\",\"aitem\",\"groupBy\",\"groupBy\",\"aitem\",\"view\",\"selectView\",\"aitem\",\"filter\",\"filter\",\"aitem\"],\"statements\":[[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,15,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\"\\n                \"],[4,\"if\",[[20,[\"queryObject\",\"fromQuestion\"]]],null,{\"statements\":[[0,\"Question\"]],\"parameters\":[]},{\"statements\":[[0,\"Table\"]],\"parameters\":[]}],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"d-inline-flex\"],[3,\"action\",[[19,0,[]],\"toggleFromTable\"]],[7],[0,\"\\n                    \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Switch between Question and Table\"]],\"parameters\":[]},null],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-toggle-right\"],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,15,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[10,\"class\",[26,[\"content \",[18,\"tableClass\"]]]],[7],[0,\"\\n            \"],[4,\"if\",[[20,[\"queryObject\",\"fromQuestion\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"prompt\",\"selected\",\"on-search\",\"on-change\"],[[20,[\"questions\"]],\"title\",\"Select a Question\",[20,[\"queryObject\",\"table\"]],[25,\"action\",[[19,0,[]],\"updateQuestionSearch\"],null],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"queryObject\",\"table\"]]],null]],null]]]],false],[0,\"\\n                \"]],\"parameters\":[]},{\"statements\":[[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"prompt\",\"selected\",\"optionLabelKey\",\"on-change\"],[[20,[\"tables\"]],\"human_name\",\"Select a Table\",[20,[\"queryObject\",\"table\"]],\"human_name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"queryObject\",\"table\"]]],null]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"or\",[[20,[\"queryObject\",\"table\",\"readable_table_name\"]],[20,[\"queryObject\",\"table\",\"title\"]]],null]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"full right\"],[7],[0,\"\\n                \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag tag-primary\"],[7],[0,\" \"],[1,[25,\"or\",[[20,[\"queryObject\",\"table\",\"human_name\"]],[20,[\"queryObject\",\"table\",\"title\"]]],null],false],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[15]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,12,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Filters \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,12,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[4,\"each\",[[20,[\"queryObject\",\"filters\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"filter-maker\",null,[[\"filter\",\"columns\",\"queryObject\",\"switchToBuilder\",\"switchToRaw\"],[[19,14,[]],[20,[\"columns\"]],[20,[\"queryObject\"]],\"switchToBuilder\",\"switchToRaw\"]]],false],[0,\"\\n\"]],\"parameters\":[14]},null],[0,\"        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary mr-2 mt-2 full\"],[3,\"action\",[[19,0,[]],\"addFilter\"]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus text-white\"],[7],[8],[0,\" Add More \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"filtersTagsShow\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"filters\"]]],null,{\"statements\":[[4,\"if\",[[19,13,[\"label\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,13,[\"label\"]],false],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"filters\",[19,13,[]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[13]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[12]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,9,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"title ks-view\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" View \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,9,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[4,\"each\",[[20,[\"queryObject\",\"views\"]]],null,{\"statements\":[[0,\" \"],[1,[19,11,[\"select\",\"name\"]],false],[0,\" \"],[1,[25,\"view-maker\",null,[[\"selectView\",\"switchToRaw\",\"switchToBuilder\"],[[19,11,[]],\"switchToRaw\",\"switchToBuilder\"]]],false],[0,\"\\n\"]],\"parameters\":[11]},null],[0,\"        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary mr-2 mt-2 full\"],[3,\"action\",[[19,0,[]],\"addView\"]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus text-white\"],[7],[8],[0,\" Add More \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"queryObject\",\"views\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"views\"]]],null,{\"statements\":[[4,\"if\",[[19,10,[\"label\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,10,[\"label\"]],false],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"views\",[19,10,[]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[10]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[9]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,6,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Group By \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,6,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[4,\"each\",[[20,[\"queryObject\",\"groupBys\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"group-by-maker\",null,[[\"columns\",\"groupBy\",\"switchToRaw\",\"switchToBuilder\"],[[20,[\"columns\"]],[19,8,[]],\"switchToRaw\",\"switchToBuilder\"]]],false],[0,\" \"]],\"parameters\":[8]},null],[0,\"\\n        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary mr-2 mt-2 full\"],[3,\"action\",[[19,0,[]],\"addGroupBy\"]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus text-white\"],[7],[8],[0,\" Add More \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"queryObject\",\"groupBys\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"groupBys\"]]],null,{\"statements\":[[4,\"if\",[[19,7,[\"label\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,7,[\"label\"]],false],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"groupBys\",[19,7,[]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[7]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[6]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,3,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Sort By \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,3,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[4,\"each\",[[20,[\"queryObject\",\"orderBys\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"order-by-maker\",null,[[\"columns\",\"orderBy\"],[[20,[\"columns\"]],[19,5,[]]]]],false],[0,\" \"]],\"parameters\":[5]},null],[0,\"\\n        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary mr-2 mt-2 full\"],[3,\"action\",[[19,0,[]],\"addOrderBy\"]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus text-white\"],[7],[8],[0,\" Add More \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"queryObject\",\"orderBys\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"queryObject\",\"orderBys\"]]],null,{\"statements\":[[4,\"if\",[[19,4,[\"column\",\"human_name\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[19,4,[\"label\"]],false],[0,\"\\n                        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-white\"],[3,\"action\",[[19,0,[]],\"remove\",\"orderBys\",[19,4,[]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[4]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[3]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,2,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Number of Results \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"ui form margin-top-10\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"queryObject\",\"limit\"]],\"ui\",\"limit\"]]],false],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"queryObject\",\"limit\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"queryObject\",\"limit\"]]],null,{\"statements\":[[0,\"                \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[20,[\"queryObject\",\"limit\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[2]},null],[4,\"component\",[[20,[\"acc\",\"item\"]]],[[\"class\"],[\"m-0\"]],{\"statements\":[[4,\"component\",[[19,1,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-10\"],[7],[0,\" Search After (offset) \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"ui form margin-top-10\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"queryObject\",\"offset\"]],\"ui\",\"Search after\"]]],false],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"queryObject\",\"offset\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card-footer py-2\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"queryObject\",\"offset\"]]],null,{\"statements\":[[0,\"                \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"tag tag-primary\"],[7],[1,[20,[\"queryObject\",\"offset\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/subquery-builder/template.hbs" } });
});
define('frontend/pods/components/variable-value-selector/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/variable-value-selector/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "iu0AQfBN", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/variable-value-selector/template.hbs" } });
});
define('frontend/pods/components/variables-layer/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        variableTypeObserver: _ember['default'].on('init', _ember['default'].observer('variables.@each.var_type', function () {
            this.get('variables') && this.get('variables').forEach(function (item) {
                if (item && item.get('var_type') == "Date") {
                    item.set('showDatePicker', true);
                    item.set('showMultiSelect', false);
                } else if (item && item.get('var_type') == "Dynamic") {
                    item.set('showMultiSelect', true);
                    item.set('showDatePicker', false);
                } else {
                    item.set('showMultiSelect', false);
                    item.set('showDatePicker', false);
                }
            });
        }))
    });
});
define("frontend/pods/components/variables-layer/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+SMQqpkj", "block": "{\"symbols\":[\"variable\"],\"statements\":[[6,\"div\"],[9,\"class\",\"row variable-layer\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"variables\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[20,[\"showVariables\"]],\"col-4\",\"col-3\"],null]]]],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[6,\"label\"],[9,\"class\",\"form-label text-default\"],[7],[1,[25,\"capitalize\",[[19,1,[\"name\"]]],null],false],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"showDatePicker\"]]],null,{\"statements\":[[0,\"                            \"],[1,[25,\"ui-calendar\",null,[[\"date\",\"onChange\",\"placeholder\"],[[19,1,[\"date_value\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[19,1,[\"date_value\"]]],null]],null],[19,1,[\"default_date\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[19,1,[\"showMultiSelect\"]]],null,{\"statements\":[[0,\"                \"],[1,[25,\"accordion-multiselect\",null,[[\"label\",\"selection\",\"options\",\"labelProperty\",\"placeholder\"],[null,[19,1,[\"default_options\"]],[19,1,[\"questionFilterOptions\"]],\"name\",\"Select Few Options\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"value\",\"placeholder\"],[\"form-control\",\"text\",[19,1,[\"value\"]],[19,1,[\"default\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"                \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/variables-layer/template.hbs" } });
});
define('frontend/pods/components/view-maker/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        labelObserver: _ember['default'].on('init', _ember['default'].observer('selectView.selected', 'selectView.selected.value', 'selectView.selected.raw', 'selectView.selected.human_name', 'selectView.selected.name', function () {
            var selectView = this.get('selectView');
            if (selectView) {
                selectView = _ember['default'].Object.create(selectView);
                if (selectView.get('selected.raw') == true) {
                    selectView.set('selected.human_name', null);
                    selectView.set('selected.name', null);
                }
                var label = selectView.get("selected.human_name") || selectView.get('selected.name') || selectView.get('selected.value');
                selectView.set('label', label);
            }
        })),

        viewOptions: [{
            name: "Raw Data",
            value: "raw_data"
        }, {
            name: "Count",
            value: "count"
        }],

        actions: {
            switchToBuilder: function switchToBuilder(type, el, handleSelected) {
                this.sendAction("switchToBuilder", type, el, handleSelected);
            },
            switchToRaw: function switchToRaw(type, el, handleSelected) {
                this.sendAction("switchToRaw", type, el, handleSelected);
            }
        }
    });
});
define("frontend/pods/components/view-maker/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QTjsTtXu", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"border-p-2\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"selectView\",\"selected\",\"raw\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToBuilder\",\"views\",[20,[\"selectView\"]],true]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Builder\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-list text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"selectView\",\"selected\",\"value\"]],\"form-control my-2\",\"COUNT(column) As Metric\"]]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"switch\"],[3,\"action\",[[19,0,[]],\"switchToRaw\",\"views\",[20,[\"selectView\"]],true]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Switch To Raw\"]]],false],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"fe fe-code text-gray\"],[7],[8],[0,\"\\n        \"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"viewOptions\"]],\"name\",[20,[\"selectView\",\"selected\"]],\"Select a View\",\"name\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"selectView\",\"selected\"]]],null]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]}],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/view-maker/template.hbs" } });
});
define('frontend/pods/components/widget-creator/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {
        widget: _ember['default'].computed('', function () {
            return this.get('store').createRecord('widget', {
                renderer: 'icon_and_text',
                question: this.get('question')
            });
        }),

        widgetRenderer: _ember['default'].computed('widget.renderer', function () {
            var widgetRenderer = this.get('widget.renderer');
            if (widgetRenderer) {
                widgetRenderer = this.get('widgetRenderers').filter(function (item) {
                    return item['value'] === widgetRenderer;
                })[0];
                return widgetRenderer;
            }
        }),

        selectedColumn: _ember['default'].computed('widget.column_name', function () {
            var selectedColumn = this.get('widget.column_name');
            if (selectedColumn) {
                selectedColumn = this.get('columns').filter(function (item) {
                    return item['human_name'] === selectedColumn;
                })[0];
                return selectedColumn;
            }
        }),

        columns: _ember['default'].computed(function () {
            return this.get('question.cached_results.columns').map(function (item, index) {
                return {
                    name: item,
                    human_name: item
                };
            });
        }),

        editableWidgetComponent: _ember['default'].computed('widget.renderer', function () {
            var renderer = this.get('widget.renderer');
            if (renderer) {
                return 'widgets/editable/' + this.get('widgetComponentNames')[renderer];
            }
            return 'widgets/editable/icon-and-text';
        }),

        widgets: _ember['default'].computed('widgetQuery', function () {
            return this.store.query('widget', {
                query: this.get('widgetQuery') || ''
            });
        }),

        selectedWidgets: _ember['default'].computed('question.widgets.@each', 'question.widgets.isFulfilled', function () {
            var _this = this;

            return this.get('question.widgets').map(function (item) {
                return _this.get('store').peekRecord('widget', item.get('id'));
            }).filter(function (item) {
                return item;
            });
        }),

        widgetRenderers: [

        // {
        //     title: 'Progress Bar',
        //     value: 'progress_bar'
        // },

        {
            title: 'Icon and Text',
            value: 'icon_and_text'
        }, {
            title: 'Tag',
            value: 'tag'
        },

        // {
        //     title: 'Row Color',
        //     value: 'row_color'
        // },
        // {
        //     title: 'Row Border',
        //     value: 'row_border'
        // },

        {
            title: 'Prefix',
            value: 'prefix'
        }, {
            title: 'suffix',
            value: 'suffix'
        }],

        widgetItemsObserver: _ember['default'].observer('widget.widget_items.[]', function () {
            if (this.get('afterSave')) {
                return;
            }
            this.set('allWidgetItems', this.get('widget.widget_items'));
        }),
        actions: {
            clear: function clear() {
                this.set('open', false);
            },
            save: function save() {
                var _this2 = this;

                this.set('afterSave', true);

                this.get('widget.widget_items').forEach(function (item) {
                    if (item.get('id')) {
                        item.save();
                    }
                });
                this.get('widget').save().then(function (resp) {
                    _this2.get('allWidgetItems').forEach(function (item) {
                        if (!item.get('id')) {
                            item.set('widget', _this2.get('widget'));
                            item.save();
                        }
                    });

                    _this2.set('afterSave', false);
                });
            },
            convertToWidgetItems: function convertToWidgetItems() {
                var _this3 = this;

                try {
                    var items = JSON.parse(this.get('widget.itemsJson'));
                    this.set('invalidJsonError', false);
                } catch (e) {
                    this.set('invalidJsonError', true);
                    return;
                }
                Object.keys(items).forEach(function (key) {
                    _this3.get('store').createRecord('widget_item', {
                        widget: _this3.get('widget'),
                        value: key,
                        text: items[key],
                        config: {}
                    });
                });
            },
            toggleWidgetItemJson: function toggleWidgetItemJson() {
                this.set('widget.showItemsJson', false);
            },
            removeWidgetItem: function removeWidgetItem(widgetItem) {
                widgetItem.destroyRecord();
            },
            addWidgetItem: function addWidgetItem() {
                this.get('store').createRecord('widget_item', {
                    widget: this.get('widget'),
                    value: 'Key',
                    text: 'value',
                    config: {}
                });
            },
            updateWidgetSearch: function updateWidgetSearch(text) {
                this.set('widgetQuery', text);
            },
            setWidgetRenderer: function setWidgetRenderer(item) {
                if (item && item.value) {
                    this.set('widget.renderer', item.value);
                }
            },
            selectColumn: function selectColumn(item) {
                if (item && item.human_name) {
                    this.set('widget.column_name', item.human_name);
                }
            },
            saveQuestion: function saveQuestion() {
                this.get('question').save();
                this.set('open', false);
            }
        }
    });
});
define("frontend/pods/components/widget-creator/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "uvsmEgLz", "block": "{\"symbols\":[\"modal\",\"footer\",\"acc\",\"wi\",\"aitem\"],\"statements\":[[4,\"bs-modal\",null,[[\"position\",\"size\",\"open\",\"onHide\"],[\"center\",\"lg\",[20,[\"open\"]],[25,\"action\",[[19,0,[]],\"clear\"],null]]],{\"statements\":[[4,\"component\",[[19,1,[\"header\"]]],null,{\"statements\":[[0,\"        \"],[6,\"h4\"],[9,\"class\",\"modal-title\"],[7],[0,\" Add a Widget\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"body\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"tip mt-2 mb-2\"],[7],[0,\"Select One or More Widgets\"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"sortBy\",\"multiple\",\"closeOnSelection\",\"prompt\",\"optionLabelKey\",\"selected\",\"on-search\",\"on-change\"],[[20,[\"widgets\"]],\"displayName\",true,false,\"Select one or more widgets\",\"displayName\",[20,[\"selectedWidgets\"]],[25,\"action\",[[19,0,[]],\"updateWidgetSearch\"],null],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"question\",\"widgets\"]]],null]],null]]]],false],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"tip mt-2 mb-2\"],[7],[0,\"Or create a new one\"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-6 pr-1\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"type\",\"class\",\"placeholder\",\"value\"],[\"text\",\"form-control\",\"Give it a name\",[20,[\"widget\",\"name\"]]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-6 pl-1\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Widget Type\"],[8],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"content\",\"selected\",\"prompt\",\"on-change\"],[[20,[\"widgetRenderers\"]],[20,[\"widgetRenderer\"]],\"Select Widget Type\",[25,\"action\",[[19,0,[]],\"setWidgetRenderer\"],null]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"sortBy\",\"selected\",\"prompt\",\"optionLabelKey\",\"on-change\"],[\"my-2\",[20,[\"columns\"]],\"human_name\",[20,[\"selectedColumn\"]],\"Select a Column\",\"human_name\",[25,\"action\",[[19,0,[]],\"selectColumn\"],null]]]],false],[0,\"\\n                \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"widget\",\"shouldShowJson\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"tip mt-2 mb-2\"],[7],[0,\"Enter Key value Pairs in Json form. Keys must be values that appear in column. Value should be text that you\\n                want to convert these keys into.\"],[8],[0,\" \"],[1,[25,\"textarea\",null,[[\"rows\",\"value\",\"class\"],[10,[20,[\"widget\",\"itemsJson\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"invalidJsonError\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"form-error\"],[7],[0,\" Invalid Json \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[6,\"div\"],[9,\"class\",\"text-right\"],[7],[0,\"\\n                \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"toggleWidgetItemJson\"],null],\"mt-2\",\"gray\"]],{\"statements\":[[0,\"I'll add one by one\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"convertToWidgetItems\"],null],\"mt-2\",\"primary\"]],{\"statements\":[[0,\"Convert to Widget Items\"]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-label\"],[7],[0,\"Transaforms\"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"bs-accordion\",null,[[\"class\"],[\"no-box-shadow\"]],{\"statements\":[[4,\"each\",[[20,[\"widget\",\"widget_items\"]]],null,{\"statements\":[[4,\"component\",[[19,3,[\"item\"]]],null,{\"statements\":[[4,\"component\",[[19,5,[\"title\"]]],[[\"class\"],[\"py-2 border-bottom-0\"]],{\"statements\":[[0,\"                            \"],[6,\"span\"],[7],[1,[19,4,[\"value\"]],false],[8],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right\"],[7],[8],[0,\"\\n                            \"],[6,\"span\"],[7],[0,\" \"],[1,[19,4,[\"text\"]],false],[0,\" \"],[8],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-red\"],[3,\"action\",[[19,0,[]],\"removeWidgetItem\",[19,4,[]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[4,\"component\",[[19,5,[\"body\"]]],[[\"class\"],[\"border-top\"]],{\"statements\":[[0,\" \"],[1,[25,\"component\",[[20,[\"editableWidgetComponent\"]]],[[\"wi\"],[[19,4,[]]]]],false],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[5]},null]],\"parameters\":[4]},null]],\"parameters\":[3]},null],[0,\"            \"],[6,\"span\"],[9,\"class\",\"btn btn-link text-primary mt-2\"],[3,\"action\",[[19,0,[]],\"addWidgetItem\"]],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\"Add another Transform\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"widget\",\"canSave\"]]],null,{\"statements\":[[0,\"                    \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"save\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Create Widget\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"footer\"]]],null,{\"statements\":[[0,\"        \"],[4,\"bs-button\",null,[[\"onClick\",\"type\"],[[25,\"action\",[[19,0,[]],\"clear\"],null],\"danger\"]],{\"statements\":[[0,\"Cancel\"]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"bs-button\",null,[[\"onClick\",\"class\",\"type\"],[[25,\"action\",[[19,0,[]],\"saveQuestion\"],null],\"btn-primary\",\"primary\"]],{\"statements\":[[0,\"Apply Widget\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[2]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widget-creator/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/circular-progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/circular-progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Vc18ab3O", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"mx-auto chart-circle chart-circle-xs\"],[9,\"data-value\",\"0.96\"],[9,\"data-thickness\",\"3\"],[9,\"data-color\",\"blue\"],[7],[0,\"\\n    \"],[6,\"canvas\"],[9,\"width\",\"80\"],[9,\"height\",\"80\"],[9,\"style\",\"height: 40px; width: 40px;\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"chart-circle-value\"],[7],[0,\"96%\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/circular-progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/icon-and-text/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/icon-and-text/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Bk+P8yh9", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/icon-and-text/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/prefix-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/prefix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eCLUtNe8", "block": "{\"symbols\":[],\"statements\":[[6,\"span\"],[9,\"class\",\"widget-prefix\"],[7],[0,\"$\"],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"widget-value\"],[7],[0,\" value\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/prefix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "WJ2zSqWj", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"clearfix\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"float-left\"],[7],[0,\"\\n            \"],[6,\"strong\"],[7],[0,\"42%\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"float-right\"],[7],[0,\"\\n            \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\"Value\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"progress progress-xs\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"progress-bar bg-yellow\"],[9,\"role\",\"progressbar\"],[9,\"style\",\"width: 42%\"],[9,\"aria-valuenow\",\"42\"],[9,\"aria-valuemin\",\"0\"],[9,\"aria-valuemax\",\"100\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/ratings-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/ratings-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "d14tFS1/", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/ratings-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/row-border/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/row-border/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "r/OeG430", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/row-border/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/row-color/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/row-color/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kqSheE6g", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/row-color/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/suffix-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/suffix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "JZaMTpwd", "block": "{\"symbols\":[],\"statements\":[[6,\"span\"],[9,\"class\",\"widget-value\"],[7],[0,\" value\"],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"widget-suffix\"],[7],[0,\"/-\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/suffix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/demo/tag-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/demo/tag-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xZwXWhYB", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/demo/tag-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/circular-progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/circular-progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1ugd86LF", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/circular-progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/icon-and-text/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/icon-and-text/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Pj//ptN6", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pr-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Value\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"value\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pl-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"text\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Color in Hex\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"color\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"\\n                Example: #FFFFFF, #F2F2F2 \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Icon\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"icon\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"You can choose the icon names\\n                    \"],[6,\"a\"],[9,\"target\",\"_\"],[9,\"href\",\"https://feathericons.com\"],[7],[0,\"here\"],[8],[0,\", Example: arrow-right \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/icon-and-text/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/prefix-widget/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {});
});
define("frontend/pods/components/widgets/editable/prefix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gf2Ek+jg", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pr-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Value\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"value\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pl-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"text\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text Color in Hex\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"text_color\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"Defaults to Gray. Example: #FFFFFF, #F2F2F2 \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Prefix\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"prefix\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/prefix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3EQxcNvh", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/ratings-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/ratings-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vSC1zD91", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/ratings-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/row-border/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/row-border/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VIQUxXSA", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/row-border/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/row-color/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/row-color/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "u/aZiYiq", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/row-color/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/suffix-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/suffix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YpxDZPy4", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pr-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Value\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"value\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pl-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"text\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text Color in Hex\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"text_color\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"Defaults to Gray. Example: #FFFFFF, #F2F2F2 \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Suffix\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"suffix\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/suffix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/editable/tag-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/editable/tag-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FTczU+oz", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pr-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Value\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"value\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-6 pl-1\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Text\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"text\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Tag Text Color in Hex\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"text_color\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"Defaults to Gray. Example: #FFFFFF, #F2F2F2 \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Tag Background Color in Hex\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"color\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\" Example: #FFFFFF, #F2F2F2 \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Tag Icon\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"wi\",\"config\",\"icon\"]],\"form-control\"]]],false],[0,\" \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"tip mt-0 mb-0\"],[7],[0,\"Optional. You can choose the icon names\\n                    \"],[6,\"a\"],[9,\"target\",\"_\"],[9,\"href\",\"https://feathericons.com\"],[7],[0,\"here\"],[8],[0,\", Example: arrow-right \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/editable/tag-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/render-widgets/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {

        widget: _ember['default'].computed('el', 'index', 'question.cached_results', 'results', 'question.widgets.@each', 'question.widgets.isFulfilled', function () {
            var columns = this.get('results.columns') || this.get('question.cached_results.columns');
            if (columns) {
                var columnName = columns[this.get('index')];

                return this.get('question.widgets') && this.get('question.widgets').findBy('column_name', columnName);
            }
        }),

        rendererComponent: _ember['default'].computed('widget', function () {
            var renderer = this.get('widget') && this.get('widget.renderer');
            if (renderer) {
                return 'widgets/renderer/' + this.get('widgetComponentNames')[renderer];
            }
        })

    });
});
define("frontend/pods/components/widgets/render-widgets/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BiIerb7Q", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"widget\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"component\",[[20,[\"rendererComponent\"]]],[[\"widget\",\"el\"],[[20,[\"widget\"]],[20,[\"el\"]]]]],false],[0,\" \"]],\"parameters\":[]},{\"statements\":[[1,[25,\"format-object\",[[20,[\"el\"]]],null],true],[0,\" \"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/render-widgets/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/circular-progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/renderer/circular-progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "wQ5DTBoQ", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/circular-progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/icon-and-text/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {});
});
define("frontend/pods/components/widgets/renderer/icon-and-text/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+FfD9Kqf", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"applicableWidgetItem\"]]],null,{\"statements\":[[0,\"    \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-\",[20,[\"applicableWidgetItem\",\"config\",\"icon\"]]]]],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"color\"]]]]],[7],[8],[0,\"\\n    \"],[6,\"span\"],[7],[1,[25,\"format-object\",[[20,[\"applicableWidgetItem\",\"text\"]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[1,[25,\"format-object\",[[20,[\"el\"]]],null],false],[0,\" \"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/icon-and-text/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/prefix-widget/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {});
});
define("frontend/pods/components/widgets/renderer/prefix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "D2bu7EFO", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"applicableWidgetItem\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"text_color\"]],\";\"]]],[7],[1,[20,[\"applicableWidgetItem\",\"config\",\"prefix\"]],false],[8],[0,\"\\n    \"],[6,\"span\"],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"text_color\"]],\";background-color: \",[20,[\"applicableWidgetItem\",\"config\",\"color\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"format-object\",[[20,[\"applicableWidgetItem\",\"text\"]]],null],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[1,[25,\"format-object\",[[20,[\"el\"]]],null],false],[0,\" \"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/prefix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/progress-bar/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/renderer/progress-bar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "d+tfBjDT", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/progress-bar/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/ratings-widget/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/renderer/ratings-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "w8df5cIE", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/ratings-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/row-border/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/renderer/row-border/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "o0DUvpCs", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/row-border/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/row-color/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("frontend/pods/components/widgets/renderer/row-color/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "m7EQyzqu", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/row-color/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/suffix-widget/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {});
});
define("frontend/pods/components/widgets/renderer/suffix-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "F6AzKbwn", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"applicableWidgetItem\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"text_color\"]],\";background-color: \",[20,[\"applicableWidgetItem\",\"config\",\"color\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"format-object\",[[20,[\"applicableWidgetItem\",\"text\"]]],null],false],[0,\" \"],[8],[0,\"\\n    \"],[6,\"span\"],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"text_color\"]],\";\"]]],[7],[1,[20,[\"applicableWidgetItem\",\"config\",\"suffix\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[1,[25,\"format-object\",[[20,[\"el\"]]],null],false],[0,\" \"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/suffix-widget/template.hbs" } });
});
define('frontend/pods/components/widgets/renderer/tag-widget/component', ['exports', 'ember', 'frontend/mixins/widget-components'], function (exports, _ember, _frontendMixinsWidgetComponents) {
  exports['default'] = _ember['default'].Component.extend(_frontendMixinsWidgetComponents['default'], {});
});
define("frontend/pods/components/widgets/renderer/tag-widget/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "psPmrKpn", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"applicableWidgetItem\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"tag\"],[10,\"style\",[26,[\"color: \",[20,[\"applicableWidgetItem\",\"config\",\"text_color\"]],\";background-color: \",[20,[\"applicableWidgetItem\",\"config\",\"color\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"format-object\",[[20,[\"applicableWidgetItem\",\"text\"]]],null],false],[0,\"\\n        \"],[6,\"a\"],[9,\"href\",\" # \"],[9,\"class\",\"tag-addon \"],[7],[0,\"\\n            \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-\",[20,[\"applicableWidgetItem\",\"config\",\"icon\"]],\" \"]]],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[1,[25,\"format-object\",[[20,[\"el\"]]],null],false],[0,\" \"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/components/widgets/renderer/tag-widget/template.hbs" } });
});
define('frontend/pods/dashboards/index/controller', ['exports', 'ember', 'frontend/mixins/dynamic-query-params-controller-mixin'], function (exports, _ember, _frontendMixinsDynamicQueryParamsControllerMixin) {
    exports['default'] = _ember['default'].Controller.extend(_frontendMixinsDynamicQueryParamsControllerMixin['default'], {
        dashboards: _ember['default'].computed.alias('model')
    });
});
define('frontend/pods/dashboards/index/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin', 'ember-can', 'frontend/mixins/dynamic-query-params-routes-mixin', 'ember-keyboard-shortcuts/mixins/route'], function (exports, _ember, _frontendMixinsAuthenticationMixin, _emberCan, _frontendMixinsDynamicQueryParamsRoutesMixin, _emberKeyboardShortcutsMixinsRoute) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, _emberKeyboardShortcutsMixinsRoute['default'], _frontendMixinsDynamicQueryParamsRoutesMixin['default'], _frontendMixinsAuthenticationMixin['default'], {
        toast: _ember['default'].inject.service(),
        model: function model(params) {
            return this.store.findAll('dashboard');
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.set('currentController', controller);
        }

    });
});
define("frontend/pods/dashboards/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "m4IcfbzI", "block": "{\"symbols\":[\"dashboard\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" All Dashboards\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row row-cards\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"dashboards\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-3 database-cards\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card p-3 mx-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"stamp stamp-md bg-primary mr-3\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-grid\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row justify-content-between w-100\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n                                \"],[6,\"h4\"],[9,\"class\",\"m-0\"],[7],[0,\"\\n                                    \"],[4,\"link-to\",[\"dashboards.show\",[19,1,[\"id\"]]],[[\"class\"],[\"item text-primary\"]],{\"statements\":[[0,\" \"],[1,[19,1,[\"title\"]],false],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/dashboards/index/template.hbs" } });
});
define('frontend/pods/dashboards/show/controller', ['exports', 'ember', 'frontend/mixins/dynamic-query-params-controller-mixin'], function (exports, _ember, _frontendMixinsDynamicQueryParamsControllerMixin) {
    exports['default'] = _ember['default'].Controller.extend(_frontendMixinsDynamicQueryParamsControllerMixin['default'], {
        dashboard: _ember['default'].computed.alias('model'),

        queryParamsVariables: _ember['default'].computed.alias('dashboard.variables'),

        variablesFulfilled: _ember['default'].computed('dashboard.questions.@each.variablesUpdated', function () {
            var variablesFulfilled = true;
            this.get('dashboard.questions').forEach(function (item) {
                item.get('variables').forEach(function (variable) {
                    if (!variable.get('isLoaded')) {
                        variablesFulfilled = false;
                    }
                });
            });
            return variablesFulfilled;
        }),

        reloadBasedOnQueryParamsObserver: _ember['default'].observer('reloadBasedOnQueryParams', 'variablesFulfilled', function () {
            var variablesFulfilled = this.get('variablesFulfilled');
            if (variablesFulfilled) {
                this.refreshFunction();
            }
        }),
        questionObserver: _ember['default'].on('init', _ember['default'].observer('dashboard', function () {
            var questions = this.get('dashboard.questions');
            if (questions) {
                var ids = questions.map(function (item) {
                    return item.id;
                });
                this.store.query('question', {
                    filter: {
                        id: ids.join(',')
                    }
                });
            }
        })),
        nonEditable: 'yes',
        fullScreen: false,
        refreshIntervals: [{
            name: 'Never',
            value: null
        }, {
            name: '5 Seconds',
            value: 5000
        }, {
            name: '10 Seconds',
            value: 10000
        }, {
            name: '30 Seconds',
            value: 30000
        }, {
            name: '1 Minute',
            value: 60000
        }, {
            name: '5 Minutes',
            value: 300000
        }, {
            name: '15 Minutes',
            value: 900000
        }, {
            name: '30 Minutes',
            value: 1800000
        }],
        refreshInterval: {
            name: 'Never',
            value: null
        },
        schedule: function schedule(f) {
            return _ember['default'].run.later(this, function () {
                f.apply(this);
                this.set('timer', this.schedule(f));
            }, this.get('refreshInterval.value'));
        },

        editModeObserver: _ember['default'].observer('editMode', function () {
            this.set('dashboard.isEditing', this.get('editMode'));
        }),
        stopTimer: function stopTimer() {
            _ember['default'].run.cancel(this.get('timer'));
        },

        startTimer: function startTimer() {
            this.refreshFunction();
            this.set('timer', this.schedule(this.get('onPoll')));
        },

        onPoll: function onPoll() {
            this.refreshFunction();
        },
        refreshIntervalObserver: _ember['default'].observer('refreshInterval', function () {
            var refreshInterval = this.get('refreshInterval');
            if (refreshInterval.value != null) {
                this.stopTimer();
                this.startTimer();
            } else {
                this.stopTimer();
            }
        }),
        // setQuestionDashboardVariables() {
        //     let questions = this.get('dashboard.questions');
        //     questions && questions.forEach((item) => {
        //         let variable = item.get('variables').findBy('name', this.get('name'));
        //         variable && variable.set('value', this.get('value'));
        //         variable && variable.set('default_options', this.get('default_options'));
        //     });
        // },
        refreshFunction: function refreshFunction() {
            this.changeQueryParamsInUrl(this.get('dashboard.variables'), this.get('dashboard.title'));
            // this.setQuestionDashboardVariables();
            var questions = this.get('dashboard.questions');
            questions && questions.forEach(function (item) {
                item.set('resultsCanBeLoaded', true);
                item.set('updated_at', new Date());
            });
        },
        editMode: _ember['default'].computed.alias('dashboard.isEditing'),
        actions: {
            editDashboard: function editDashboard() {
                this.set('nonEditable', null);
                this.set('editMode', true);
            },
            addNewNote: function addNewNote() {
                var dashboard = this.get('dashboard');
                var note = this.store.createRecord('note', {
                    dashboard: this.get('dashboard')
                });
                note.set('isEditing', true);
                dashboard.set('newNoteSettings', {
                    width: 24,
                    height: 14,
                    noMove: true
                });
                dashboard.set('newNote', note);
                _ember['default'].run.next(this, function () {
                    _ember['default'].$('.grid-stack').data('gridstack').disable();
                });
            },
            saveDashboard: function saveDashboard() {
                var _this = this;

                var dashboard = this.get('dashboard');
                var settings = {};
                dashboard.get('questions').forEach(function (item) {
                    var el = $('#js-question-' + item.get('id')).parents('.grid-stack-item');
                    settings[item.get('id')] = {
                        x: el.data('gs-x'),
                        y: el.data('gs-y'),
                        width: el.data('gs-width'),
                        height: el.data('gs-height')
                        // noMove: this.get('nonEditable'),
                        // noResize: this.get('nonEditable')
                    };
                });
                dashboard.set('settings', _ember['default'].Object.create(settings));
                settings = {};
                dashboard.get('notes').forEach(function (item) {
                    var el = $('#js-notes-' + item.get('id')).parents('.grid-stack-item');

                    settings[item.get('id')] = {
                        x: el.data('gs-x'),
                        y: el.data('gs-y'),
                        width: el.data('gs-width'),
                        height: el.data('gs-height')
                        // noMove: this.get('nonEditable'),
                        // noResize: this.get('nonEditable')
                    };
                });
                dashboard.set('notes_settings', _ember['default'].Object.create(settings));
                dashboard.save().then(function (response) {
                    dashboard.get('variables').invoke('save');
                }).then(function (variables) {
                    _this.set('nonEditable', 'yes');
                    _this.set('editMode', false);
                });
            },
            cancelEditingDashboard: function cancelEditingDashboard() {
                this.set('nonEditable', 'yes');
                this.set('editMode', false);
            },
            showShareDialogue: function showShareDialogue() {
                this.set('toggleShareModal', 'true');
            },
            showDeleteDialogue: function showDeleteDialogue() {
                this.set('toggleDeleteDialogue', true);
                $('.ui.modal.delete-dialogue').modal('show');
            },
            deleteDashboard: function deleteDashboard(dashboard) {
                var _this2 = this;

                dashboard.destroyRecord().then(function (response) {
                    _this2.transitionToRoute('index');
                });
            },
            setRefreshInterval: function setRefreshInterval(interval) {
                this.set('refreshInterval', interval);
            },
            refreshNow: function refreshNow() {
                this.refreshFunction();
            },
            showVariablesDialogue: function showVariablesDialogue() {
                $('.ui.modal.select-dashboard-variables').modal('show');
            },
            toggleFullScreen: function toggleFullScreen() {
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.set('fullScreen', false);
                } else {
                    var element = _ember['default'].$('.dashboard-page').get(0);
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                    this.set('fullScreen', true);
                }
            }
        }
    });
});
define('frontend/pods/dashboards/show/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin', 'ember-can', 'frontend/mixins/dynamic-query-params-routes-mixin', 'ember-keyboard-shortcuts/mixins/route'], function (exports, _ember, _frontendMixinsAuthenticationMixin, _emberCan, _frontendMixinsDynamicQueryParamsRoutesMixin, _emberKeyboardShortcutsMixinsRoute) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, _emberKeyboardShortcutsMixinsRoute['default'], _frontendMixinsDynamicQueryParamsRoutesMixin['default'], _frontendMixinsAuthenticationMixin['default'], {
        toast: _ember['default'].inject.service(),
        queryParams: {
            share_id: {
                refreshModel: true
            }
        },
        model: function model(params) {
            return this.store.queryRecord('dashboard', {
                id: params.dashboard_id,
                share_id: params.share_id
            });
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.set('currentController', controller);
        },
        afterModel: function afterModel(model, transition) {
            this._super.apply(this, arguments);
            if (!this.can('show dashboard')) {
                this.get('toast').error('You are not authorized to perform this action', 'Sorry Mate!', {
                    closeButton: true,
                    timeout: 1500,
                    progressBar: false
                });

                return this.transitionTo('index');
            } else {
                this.set('title', 'Afterglow Dashboard - ' + model.get('title'));
            }
        },

        actions: {
            refreshQuestions: function refreshQuestions() {
                this.get('currentController').refreshFunction();
            }
        },

        keyboardShortcuts: {
            'ctrl+r': 'refreshQuestions'
        }
    });
});
define("frontend/pods/dashboards/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qS86iivX", "block": "{\"symbols\":[\"dd\",\"ddm\",\"refreshInterval\"],\"statements\":[[6,\"div\"],[9,\"class\",\"dashboard-page w-100\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"row justify-content-between w-100\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"editMode\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n                                    \"],[6,\"span\"],[9,\"class\",\"input-group-prepend mt-2\"],[9,\"id\",\"basic-addon1\"],[7],[0,\"\\n                                        \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Title\"],[8],[0,\"\\n                                    \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"dashboard\",\"title\"]],\"form-control mt-2\"]]],false],[0,\" \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n                                    \"],[6,\"span\"],[9,\"class\",\"input-group-prepend mt-2\"],[9,\"id\",\"basic-addon1\"],[7],[0,\"\\n                                        \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Description\"],[8],[0,\"\\n                                    \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[20,[\"dashboard\",\"description\"]],\"form-control mt-2\"]]],false],[0,\" \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" \"],[1,[20,[\"dashboard\",\"title\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col text-center\"],[7],[0,\"\\n                        \"],[4,\"if\",[[20,[\"editMode\"]]],null,{\"statements\":[[0,\" \"]],\"parameters\":[]},{\"statements\":[[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"text-primary\"],[3,\"action\",[[19,0,[]],\"refreshNow\"]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Refresh Now\"]]],false],[0,\" REFRESH \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[10,\"class\",[26,[\"col text-right \",[25,\"if\",[[20,[\"editMode\"]],\"options-dashboard\"],null]]]],[7],[0,\"\\n\"],[4,\"if\",[[25,\"and\",[[20,[\"editMode\"]],[25,\"not\",[[25,\"can\",[\"edit dashboard\"],null]],null]],null]],null,{\"statements\":[[0,\"                            \"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"cancelEditingDashboard\"]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Cancel Editing Dashboard\"]]],false],[0,\" CANCEL \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"can\",[\"edit dashboard\"],null]],null,{\"statements\":[[4,\"if\",[[20,[\"editMode\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"button\"],[9,\"class\",\"btn btn-link link-primary\"],[3,\"action\",[[19,0,[]],\"saveDashboard\"]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Save Dashboard\"]]],false],[0,\" SAVE \"],[8],[0,\"\\n                                \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-gray\"],[3,\"action\",[[19,0,[]],\"cancelEditingDashboard\"]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Cancel Editing Dashboard\"]]],false],[0,\" CANCEL \"],[8],[0,\"\\n                                \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-red\"],[3,\"action\",[[19,0,[]],\"showDeleteDialogue\"]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Delete Dashboard\"]]],false],[0,\" DELETE \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Edit\"]]],false],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"fe fe-edit px-1\"],[9,\"px-1\",\"\"],[3,\"action\",[[19,0,[]],\"editDashboard\"]],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                            \"],[6,\"span\"],[7],[0,\"\\n                                \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\" Refresh Interval: \"],[1,[20,[\"refreshInterval\",\"name\"]],false]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"bs-dropdown\",null,null,{\"statements\":[[4,\"component\",[[19,1,[\"toggle\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-refresh-cw text-gray px-1\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,1,[\"menu\"]]],[[\"class\"],[\"menu-left\"]],{\"statements\":[[4,\"each\",[[20,[\"refreshIntervals\"]]],null,{\"statements\":[[4,\"component\",[[19,2,[\"item\"]]],null,{\"statements\":[[0,\"                                                \"],[6,\"div\"],[9,\"class\",\"dropdown-item\"],[3,\"action\",[[19,0,[]],\"setRefreshInterval\",[19,3,[]]]],[7],[0,\" \"],[1,[19,3,[\"name\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[3]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null],[0,\"                            \"],[8],[0,\"\\n\"],[4,\"if\",[[25,\"not\",[[20,[\"dashboard\",\"newNote\"]]],null]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Add a Note\"]]],false],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"fe fe-edit-3 px-1\"],[3,\"action\",[[19,0,[]],\"addNewNote\"]],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Share\"]]],false],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-share px-1\"],[3,\"action\",[[19,0,[]],\"showShareDialogue\"]],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Variables\"]]],false],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-code px-1\"],[3,\"action\",[[19,0,[]],\"showVariablesDialogue\"]],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"fullScreen\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Exit Fullscreen\"]]],false],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-minimize\"],[3,\"action\",[[19,0,[]],\"toggleFullScreen\"]],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"title\"],[\"Fullscreen\"]]],false],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-maximize\"],[3,\"action\",[[19,0,[]],\"toggleFullScreen\"]],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui basic segment padded-content full no-top-margin\"],[7],[0,\" \"],[1,[25,\"variables-layer\",null,[[\"variables\"],[[20,[\"dashboard\",\"variables\"]]]]],false],[0,\" \"],[1,[25,\"dashboard-grid\",null,[[\"editing\",\"dashboard\"],[[20,[\"editMode\"]],[20,[\"dashboard\"]]]]],false],[0,\" \"],[8],[0,\" \"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"dashboard\",[20,[\"toggleDeleteDialogue\"]],[20,[\"dashboard\"]],\"deleteDashboard\"]]],false],[0,\"\\n    \"],[1,[25,\"share-entity\",null,[[\"entityName\",\"entity\",\"open\"],[\"Dashboard\",[20,[\"dashboard\"]],[20,[\"toggleShareModal\"]]]]],false],[0,\" \"],[1,[25,\"dashboard-select-variables\",null,[[\"dashboard\",\"isEditing\"],[[20,[\"dashboard\"]],[20,[\"editMode\"]]]]],false],[0,\"\\n    \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/dashboards/show/template.hbs" } });
});
define('frontend/pods/data-references/databases/all/controller', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _ember['default'].Controller.extend(_emberCan.CanMixin, {

        canEdit: _ember['default'].computed(function () {
            return this.can('edit question');
        }),
        databases: _ember['default'].computed.alias("model"),
        actions: {
            syncDatabase: function syncDatabase(database) {
                var _this = this;

                database.sync().then(function (response) {
                    _this.get('toast').success("Databse Sync was successfully initiated. Please wait for few minutes for it to complete", 'YaY!', { closeButton: true, timeout: 15000, progressBar: false });
                });
            }
        }
    });
});
define('frontend/pods/data-references/databases/all/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model() {
            return this.store.findAll('database');
        }
    });
});
define("frontend/pods/data-references/databases/all/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "yYzbH+Dq", "block": "{\"symbols\":[\"database\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" All Databases \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row row-cards\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"databases\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-3 database-cards\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card p-3 mx-2\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"stamp stamp-md bg-primary mr-3\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-database\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row justify-content-between w-100\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n                                \"],[6,\"h4\"],[9,\"class\",\"m-0\"],[7],[0,\"\\n                                    \"],[4,\"link-to\",[\"data_references.databases.show.tables.all\",[19,1,[\"id\"]]],[[\"class\"],[\"item text-primary\"]],{\"statements\":[[0,\" \"],[1,[19,1,[\"name\"]],false],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[1,[19,1,[\"db_type\"]],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-3 text-right\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"button\"],[9,\"class\",\"btn btn-link text-primary\"],[3,\"action\",[[19,0,[]],\"syncDatabase\",[19,1,[]]]],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[\"top\",\"Sync All Tables and Columns\"]]],false],[0,\" SYNC \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/data-references/databases/all/template.hbs" } });
});
define('frontend/pods/data-references/databases/show/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        database: _ember['default'].computed.alias('model')
    });
});
define('frontend/pods/data-references/databases/show/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {

        model: function model(params) {
            return this.store.peekRecord('database', params.database_id) || this.store.findRecord('database', params.database_id);
        }
    });
});
define('frontend/pods/data-references/databases/show/tables/all/controller', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _ember['default'].Controller.extend(_emberCan.CanMixin, {

        canEdit: _ember['default'].computed(function () {
            return this.can('edit question');
        }),
        tables: _ember['default'].computed('query', 'database.tables.isFulfilled', function () {
            var query = this.get('query');
            if (query) {
                return this.get('database.tables').filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(query.toLowerCase());
                }).sortBy('human_name');
            }
            return this.get('database.tables').sortBy('human_name');
        }),
        loading: _ember['default'].computed.not('database.tables.isFulfilled'),
        actions: {
            editTable: function editTable(table) {
                table.set('editMode', true);
            },
            saveTable: function saveTable(table) {
                table.save().then(function (response) {
                    table.set('editMode', false);
                });
            },
            cancelEdit: function cancelEdit(table) {
                table.set('editMode', false);
            }
        }
    });
});
define('frontend/pods/data-references/databases/show/tables/all/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {

        renderTemplate: function renderTemplate(controller, model) {

            this.render('data_references.databases.show.tables.all', {
                into: 'application',
                controller: controller
            });
        },

        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            controller.set('database', this.controllerFor('data_references.databases.show').get('database'));
        }
    });
});
define("frontend/pods/data-references/databases/show/tables/all/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "y0muY1Pu", "block": "{\"symbols\":[\"table\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" Tables in database: \"],[1,[20,[\"database\",\"name\"]],false],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container px-0 mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"input-group input-icon\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"input-group-prepend\"],[9,\"id\",\"basic-addon3\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Search a Table\"],[8],[0,\"\\n            \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"query\"]],\"form-control\",\"Search Table\"]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-icon-addon\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-search\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"loader text-primary\"],[7],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"table-responsive\"],[7],[0,\"\\n                \"],[6,\"table\"],[9,\"class\",\"table table-hover table-outline table-vcenter text-nowrap card-table table-striped\"],[7],[0,\"\\n                    \"],[6,\"thead\"],[7],[0,\"\\n                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"th\"],[9,\"class\",\"w-3\"],[7],[0,\"Table Name\"],[8],[0,\"\\n                            \"],[6,\"th\"],[9,\"class\",\"w-12\"],[7],[0,\"Description\"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"th\"],[9,\"class\",\"w-1\"],[7],[0,\"Actions\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"tables\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"tr\"],[7],[0,\"\\n                                \"],[6,\"td\"],[7],[0,\"\\n                                    \"],[4,\"link-to\",[\"data_references.databases.show.tables.show\",[20,[\"database\",\"id\"]],[19,1,[\"id\"]]],null,{\"statements\":[[0,\" \"],[1,[19,1,[\"human_name\"]],false],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"editMode\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"form-group mb-0\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,1,[\"description\"]],\"form-control\",\"short description of this table\"]]],false],[0,\"\\n                                            \"],[8],[0,\"\\n                                    \"]],\"parameters\":[]},{\"statements\":[[1,[19,1,[\"description\"]],false],[0,\" \"]],\"parameters\":[]}],[0,\"\\n                                \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"editMode\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Save\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-save text-gray mx-1\"],[3,\"action\",[[19,0,[]],\"saveTable\",[19,1,[]]]],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n                                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Cancel Editing\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-gray mx-1\"],[3,\"action\",[[19,0,[]],\"cancelEdit\",[19,1,[]]]],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Edit\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-edit text-gray mx-1\"],[3,\"action\",[[19,0,[]],\"editTable\",[19,1,[]]]],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"link-to\",[\"data_references.databases.show.tables.show.explore\",[20,[\"database\",\"id\"]],[19,1,[\"id\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Explore Data\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-zoom-in text-gray mx-1\"],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/data-references/databases/show/tables/all/template.hbs" } });
});
define('frontend/pods/data-references/databases/show/tables/show/controller', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _ember['default'].Controller.extend(_emberCan.CanMixin, {
        table: _ember['default'].computed.alias('model'),

        canEdit: _ember['default'].computed(function () {
            return this.can('edit question');
        }),
        columns: _ember['default'].computed('query', 'table.columns.isFulfilled', function () {
            var query = this.get('query');
            if (query) {
                return this.get('table.columns').filter(function (item) {
                    return item.get('human_name') && item.get('human_name').toLowerCase().match(query.toLowerCase());
                }).sortBy('human_name');
            }
            return this.get('table.columns').sortBy('human_name');
        }),
        loading: _ember['default'].computed.not('table.columns.isFulfilled'),
        actions: {
            editColumn: function editColumn(column) {
                column.set('editMode', true);
            },
            saveColumn: function saveColumn(column) {
                column.save().then(function (response) {
                    column.set('editMode', false);
                });
            }
        }
    });
});
define('frontend/pods/data-references/databases/show/tables/show/explore/controller', ['exports', 'ember', 'frontend/pods/questions/new/controller', 'frontend/pods/data-references/databases/show/tables/show/controller', 'frontend/mixins/result-view-mixin', 'ember-can'], function (exports, _ember, _frontendPodsQuestionsNewController, _frontendPodsDataReferencesDatabasesShowTablesShowController, _frontendMixinsResultViewMixin, _emberCan) {
    exports['default'] = _frontendPodsQuestionsNewController['default'].extend(_frontendMixinsResultViewMixin['default'], _emberCan.CanMixin, {
        table: _ember['default'].computed.alias('model'),
        question: _ember['default'].computed("recalculate", "database", "table", function () {
            return this.store.createRecord('question', {
                title: "Table: " + this.get('table.name'),
                human_sql: _ember['default'].Object.create({
                    queryType: 'query_builder',
                    database: this.get('database'),
                    table: this.get('table'),
                    views: [],
                    filters: [],
                    groupBys: [],
                    orderBys: [],
                    offset: null,
                    limit: 2000
                }),
                results_view_settings: { resultsViewType: "table", numbers: [], dataColumns: [{}] }
            });
        }),
        questionObserver: _ember['default'].observer("question.database", function () {
            if (this.get('question.human_sql.database') && this.get('question.human_sql.table')) {
                this.getResultsFunction(null);
            }
        })
    });
});
define('frontend/pods/data-references/databases/show/tables/show/explore/route', ['exports', 'ember', 'frontend/pods/questions/new/route'], function (exports, _ember, _frontendPodsQuestionsNewRoute) {
    exports['default'] = _frontendPodsQuestionsNewRoute['default'].extend({
        renderTemplate: function renderTemplate(controller, model) {

            this.render('questions.new', {
                into: 'application',
                controller: controller
            });
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            controller.set('database', this.controllerFor('data_references.databases.show').get('database'));
        }
    });
});
define("frontend/pods/data-references/databases/show/tables/show/explore/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+2HkKOrq", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/data-references/databases/show/tables/show/explore/template.hbs" } });
});
define('frontend/pods/data-references/databases/show/tables/show/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            return this.store.find('table', params.table_id);
        }

    });
});
define("frontend/pods/data-references/databases/show/tables/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "maHSIkrL", "block": "{\"symbols\":[\"column\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" Columns in table: \"],[1,[20,[\"table\",\"name\"]],false],[0,\" in database: \"],[1,[20,[\"table\",\"database\",\"name\"]],false],[0,\" \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container px-0 mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"input-group input-icon\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"input-group-prepend\"],[9,\"id\",\"basic-addon3\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Search a Column\"],[8],[0,\"\\n            \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[20,[\"query\"]],\"form-control\",\"Search Table\"]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-icon-addon\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-search\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"loader text-primary\"],[7],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"table-responsive\"],[7],[0,\"\\n                \"],[6,\"table\"],[9,\"class\",\"table table-hover table-outline table-vcenter text-nowrap card-table table-striped\"],[7],[0,\"\\n                    \"],[6,\"thead\"],[7],[0,\"\\n                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"th\"],[7],[0,\"Column Name\"],[8],[0,\"\\n                            \"],[6,\"th\"],[7],[0,\"Data Type\"],[8],[0,\"\\n                            \"],[6,\"th\"],[9,\"class\",\"w-9\"],[7],[0,\"Description\"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"th\"],[7],[0,\"Actions\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"columns\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"tr\"],[7],[0,\"\\n                                \"],[6,\"td\"],[7],[0,\" \"],[1,[19,1,[\"human_name\"]],false],[0,\" \"],[8],[0,\"\\n                                \"],[6,\"td\"],[7],[0,\" \"],[1,[19,1,[\"data_type\"]],false],[0,\" \"],[8],[0,\"\\n                                \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"editMode\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"form-group mb-0\"],[7],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,1,[\"description\"]],\"form-control\",\"short description of this column\"]]],false],[0,\"\\n                                            \"],[8],[0,\"\\n                                    \"]],\"parameters\":[]},{\"statements\":[[1,[19,1,[\"description\"]],false],[0,\" \"]],\"parameters\":[]}],[0,\"\\n                                \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"editMode\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"span\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Save\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-save text-gray mx-1\"],[3,\"action\",[[19,0,[]],\"saveColumn\",[19,1,[]]]],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                            \"],[6,\"span\"],[9,\"data-tooltip\",\"Edit\"],[9,\"data-inverted\",\"\"],[7],[0,\" \"],[1,[25,\"bs-tooltip\",null,[[\"placement\",\"title\"],[[20,[\"top\"]],\"Edit\"]]],false],[0,\"\\n                                                \"],[6,\"i\"],[9,\"class\",\"fe fe-edit text-gray mx-1\"],[3,\"action\",[[19,0,[]],\"editColumn\",[19,1,[]]]],[7],[8],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/data-references/databases/show/tables/show/template.hbs" } });
});
define("frontend/pods/data-references/databases/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MHnCJpIJ", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/data-references/databases/show/template.hbs" } });
});
define('frontend/pods/explore/new/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        value: _ember['default'].computed.alias('model.value'),
        dependencies: _ember['default'].computed('model', function () {
            return this.get('model.dependencies') && this.get('model.dependencies').map(function (item) {
                return _ember['default'].Object.create(item);
            });
        }),

        getDependencyResults: function getDependencyResults(dependency) {
            dependency.set('loading', true);
            this.get('ajax').apiCall({
                url: this.get('ajax.apiPath') + '/explore/dependency' + '?table_id=' + dependency.get('id') + '&value=' + this.get('model.value') + '&column_id=' + dependency.get('column_id') + '&foreign_column_id=' + dependency.get('foreign_column_id') + '&value_column_id=' + this.get('model.column_id'),
                type: 'GET'
            }, function (response, status) {
                dependency.set('loading', false);
                dependency.set('results', response.results);
                dependency.set('errors', null);
            }, function (error, status) {
                dependency.set('loading', false);
                dependency.set('errors', 'We are not able to fetch the results at the moment. Please try after some time.');
                dependency.set('results', null);
            });
        },
        actions: {
            showDependencyResults: function showDependencyResults(newDependency, oldDependency) {
                oldDependency && oldDependency.set('showDependencyWidgetOnListPage', false);
                newDependency && newDependency.set('showDependencyWidgetOnListPage', true);
                if (newDependency && !newDependency.get('results')) {
                    this.getDependencyResults(newDependency);
                }
            }
        }
    });
});
define('frontend/pods/explore/new/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        ajax: _ember['default'].inject.service(),
        model: function model(params) {
            var _this = this;

            return new _ember['default'].RSVP.Promise(function (resolve, reject) {

                _this.get('ajax').apiCall({
                    url: _this.get('ajax.apiPath') + '/explore' + '?column_id=' + params.column_id + '&value=' + params.column_value,
                    type: 'GET'
                }, function (response, status) {
                    resolve(response);
                }, function (error, status) {
                    reject(error);
                });
            });
        }
    });
});
define("frontend/pods/explore/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "SbJvuyue", "block": "{\"symbols\":[\"acc\",\"dep\",\"aitem\"],\"statements\":[[6,\"div\"],[9,\"class\",\"container px-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row mt-4\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Enter \"],[1,[25,\"capitalize\",[[20,[\"model\",\"table_name\"]]],null],false],[0,\" \"],[1,[25,\"capitalize\",[[20,[\"model\",\"column_name\"]]],null],false],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\"],[\"text\",[20,[\"value\"]],\"form-control\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"value\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"span\"],[9,\"class\",\"input-group-append\"],[7],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"input-group-text bg-primary text-white h5\"],[7],[0,\"\\n                                \"],[4,\"link-to\",[\"explore.new\",[20,[\"model\",\"column_id\"]],[20,[\"value\"]]],null,{\"statements\":[[0,\" search \"]],\"parameters\":[]},null],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-header\"],[7],[0,\" \"],[1,[25,\"capitalize\",[[20,[\"model\",\"table_name\"]]],null],false],[0,\" \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\" \"],[1,[25,\"results-table\",null,[[\"results\"],[[20,[\"model\",\"results\"]]]]],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-header\"],[7],[0,\" Relationships \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n\"],[4,\"bs-accordion\",null,[[\"onChange\",\"class\"],[[25,\"action\",[[19,0,[]],\"showDependencyResults\"],null],\"text-default\"]],{\"statements\":[[4,\"each\",[[20,[\"dependencies\"]]],null,{\"statements\":[[4,\"component\",[[19,1,[\"item\"]]],[[\"value\",\"class\"],[[19,2,[]],\"mx-0 my-1\"]],{\"statements\":[[0,\"                        \"],[4,\"component\",[[19,3,[\"title\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[0,\" \"],[1,[25,\"capitalize\",[[19,2,[\"name\"]]],null],false],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,3,[\"body\"]]],[[\"class\"],[\"py-2\"]],{\"statements\":[[4,\"if\",[[19,2,[\"loading\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"loader text-primary\"],[7],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                \"],[4,\"if\",[[19,2,[\"results\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"results-table\",null,[[\"results\"],[[19,2,[\"results\"]]]]],false],[0,\" \"]],\"parameters\":[]},{\"statements\":[[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"errors\"],[7],[0,\" \"],[1,[20,[\"deps\",\"errors\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}]],\"parameters\":[]},null]],\"parameters\":[3]},null]],\"parameters\":[2]},null]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/explore/new/template.hbs" } });
});
define('frontend/pods/funnel-chart/component', ['exports', 'ember', 'frontend/mixins/utils-functions'], function (exports, _ember, _frontendMixinsUtilsFunctions) {
    var get = _ember['default'].get,
        arrayComputed = _ember['default'].arrayComputed;
    exports['default'] = _ember['default'].Component.extend(_frontendMixinsUtilsFunctions['default'], {

        didInsertElement: function didInsertElement() {
            this.get('getData')(this);
        },
        data: _ember['default'].observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function () {
            _ember['default'].run.next(this, function () {
                this.get('getData')(this);
            });
        }),
        defaultChartType: 'Funnel',

        total: _ember['default'].computed('jsonData', function () {
            var data = this.get('jsonData');
            return data && data.length >= 0 && data[0] && data[0].length > 0 && data[0][0].get('contents').map(function (el) {
                return el.get('x1');
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
        }),

        getData: function getData(_this) {}
    });
});
define("frontend/pods/funnel-chart/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xur9Jd9B", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"randomId\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"echarts-chart\",null,[[\"option\",\"opts\"],[[20,[\"options\"]],[20,[\"opts\"]]]]],false],[0,\" \"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/funnel-chart/template.hbs" } });
});
define('frontend/pods/index/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        afterModel: function afterModel() {
            this.transitionTo('questions.new');
        }
    });
});
define("frontend/pods/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "tGB3LIqG", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/index/template.hbs" } });
});
define("frontend/pods/loading/controller", ["exports", "ember", "frontend/mixins/loading-messages"], function (exports, _ember, _frontendMixinsLoadingMessages) {
  exports["default"] = _ember["default"].Controller.extend(_frontendMixinsLoadingMessages["default"], {});
});
define('frontend/pods/loading/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("frontend/pods/loading/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PwG2fQPB", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"dimmer active\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"loader big text-primary\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"dimmer-content\"],[7],[0,\" \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/loading/template.hbs" } });
});
define('frontend/pods/login/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        ajax: _ember['default'].inject.service(),
        apiNamespace: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').namespace;
        }),

        apiHost: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').host;
        }),
        actions: {
            loginWithGoogle: function loginWithGoogle() {
                this.get('ajax').apiCall({
                    url: this.get('apiHost') + this.get('apiNamespace') + '/auth/google',
                    type: 'GET'
                }, function (response, status) {
                    window.location = response.path;
                }, function (error, status) {});
            }
        }
    });
});
define('frontend/pods/login/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("frontend/pods/login/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QxMMzkdE", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"page\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"page-single\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col col-login mx-auto mt-9\"],[7],[0,\"\\n                    \"],[6,\"form\"],[9,\"class\",\"card p-4\"],[9,\"action\",\"\"],[9,\"method\",\"post\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"text-center mb-6\"],[7],[0,\" \"],[1,[25,\"app-logo\",null,[[\"logoSize\"],[\"big\"]]],false],[0,\" \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"text-center\"],[3,\"action\",[[19,0,[]],\"loginWithGoogle\"]],[7],[0,\"\\n                            \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"btn btn-link text-google\"],[7],[0,\" LOGIN WITH GOOGLE \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/login/template.hbs" } });
});
define('frontend/pods/questions/all/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        query: null,
        pageTitle: 'All Questions',
        searchedQuestionsObserver: _ember['default'].observer('questions', 'query', function () {
            _ember['default'].run.debounce(this, this.search, 300);
        }),

        search: function search() {
            var query = this.get('query');
            var questions = this.get('questions');
            if (query && query != '') {
                questions = this.store.query('question', {
                    q: query,
                    tag: null
                });
            }
            this.set('searchedQuestions', questions);
        },
        questions: _ember['default'].computed.alias('model'),
        setResultsCanBeLoaded: _ember['default'].on('init', _ember['default'].observer('questions', 'dashboard.isLoaded', function () {
            var questions = this.get('questions');
            questions && questions.forEach(function (item) {
                item.set('resultsCanBeLoaded', false);
            });
        })),
        showAllTags: true,
        tags: _ember['default'].computed(function () {
            return this.store.findAll('tag');
        }),
        actions: {
            transitionToSnapshots: function transitionToSnapshots(questionId) {
                this.transitionToRoute('questions.show.snapshots.all', questionId);
            }
        }
    });
});
define('frontend/pods/questions/all/route', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, {
        toast: _ember['default'].inject.service(),
        afterModel: function afterModel(model, transition) {
            this._super.apply(this, arguments);
            if (!this.can('show question')) {
                this.get('toast').error('You are not authorized to perform this action', 'Sorry Mate!', {
                    closeButton: true,
                    timeout: 1500,
                    progressBar: false
                });

                this.transitionTo('index');
            } else {
                this.set('title', 'Afterglow All Questions');
            }
        },
        model: function model() {
            return this.store.findAll('question');
        }
    });
});
define("frontend/pods/questions/all/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZsivsxjM", "block": "{\"symbols\":[\"tag\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"text-default\"],[7],[0,\" \"],[1,[18,\"pageTitle\"],false],[0,\" \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container px-0\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"showAllTags\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"row py-4\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"tags\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"fs-1 tag font-weight-bold\"],[7],[0,\" Tags: \"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"tags\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"tag\"],[10,\"style\",[26,[\"background: \",[19,1,[\"color\"]],\"; opacity: 0.8; font-size: 1rem;\"]]],[7],[0,\"\\n                        \"],[4,\"link-to\",[\"tags.show\",[19,1,[\"id\"]]],[[\"class\"],[\"text-white\"]],{\"statements\":[[0,\" \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"tag-addon\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-tag\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"div\"],[10,\"class\",[26,[\"form-group \",[25,\"if\",[[20,[\"tag_id\"]],\"pt-4\"],null]]]],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"input-group input-icon\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"input-group-prepend\"],[9,\"id\",\"basic-addon3\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Search a Question\"],[8],[0,\"\\n            \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\",\"aria-describedby\"],[[20,[\"query\"]],\"ui form-control\",\"Search Question\",\"basic-addon3\"]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-icon-addon\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-search\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container px-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[4,\"if\",[[20,[\"query\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"questions-list\",null,[[\"questions\",\"transitionToSnapshots\"],[[20,[\"searchedQuestions\"]],\"transitionToSnapshots\"]]],false],[0,\" \"]],\"parameters\":[]},{\"statements\":[[1,[25,\"questions-list\",null,[[\"questions\",\"transitionToSnapshots\"],[[20,[\"questions\"]],\"transitionToSnapshots\"]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/all/template.hbs" } });
});
define('frontend/pods/questions/new/controller', ['exports', 'ember', 'frontend/mixins/chart-settings', 'frontend/mixins/loading-messages', 'frontend/mixins/result-view-mixin', 'frontend/mixins/custom-events', 'frontend/mixins/ace-tools', 'frontend/mixins/dynamic-query-params-controller-mixin'], function (exports, _ember, _frontendMixinsChartSettings, _frontendMixinsLoadingMessages, _frontendMixinsResultViewMixin, _frontendMixinsCustomEvents, _frontendMixinsAceTools, _frontendMixinsDynamicQueryParamsControllerMixin) {
    exports['default'] = _ember['default'].Controller.extend(_frontendMixinsLoadingMessages['default'], _frontendMixinsChartSettings['default'], _frontendMixinsResultViewMixin['default'], _frontendMixinsAceTools['default'], _frontendMixinsCustomEvents['default'], _frontendMixinsDynamicQueryParamsControllerMixin['default'], {
        ajax: _ember['default'].inject.service(),
        queryParamsVariables: _ember['default'].computed.alias('question.variables'),
        reloadBasedOnQueryParamsObserver: _ember['default'].observer('reloadBasedOnQueryParams', function () {
            this.set('question.resultsCanBeLoaded', true);
        }),

        newQuestion: true,
        databases: _ember['default'].computed(function () {
            return this.get('store').findAll('database');
        }),

        canEdit: true,
        showVariables: false,
        question: _ember['default'].computed('recalculate', function () {
            return this.store.createRecord('question', {
                title: 'New Question',
                human_sql: _ember['default'].Object.create({
                    fromTable: true,
                    queryType: 'query_builder',
                    database: null,
                    table: null,
                    views: [],
                    filters: [_ember['default'].Object.create({
                        column: null,
                        operator: null,
                        value: null
                    })],
                    groupBys: [],
                    orderBys: [],
                    offset: null,
                    rawQuery: '',
                    additionalFilters: {
                        filters: [],
                        groupBys: [],
                        orderBys: []
                    },
                    limit: null
                }),
                results_view_settings: {
                    resultsViewType: 'Table',
                    numbers: [],
                    dataColumns: [{}]
                }
            });
        }),
        getQuestionfromLocalStorage: function getQuestionfromLocalStorage() {
            return JSON.parse(localStorage.getItem('AG_NEW_QUESTION') || '{}');
        },

        questionNameObserver: _ember['default'].observer('question.title', 'queryObject.table.human_name', 'queryObject.filters.@each.label', 'queryObject.views.@each.label', 'queryObject.groupBys.@each.label', function () {
            if (this.get('queryObject.table.human_name') && !this.get('questionNameIsSet')) {
                var title = '';
                var filterlabels = '';
                var viewlabels = '';
                var groupBylabels = '';
                if (this.get('queryObject.views.length')) {
                    viewlabels = this.get('queryObject.views').map(function (item) {
                        return item.get('label');
                    }).join(' , ');
                }
                if (viewlabels != '') {
                    title = viewlabels + ' of ';
                }
                title = title + ('' + this.get('queryObject.table.human_name'));
                if (this.get('queryObject.filters.length')) {
                    filterlabels = this.get('queryObject.filters').map(function (item) {
                        return item.get('label');
                    }).join(' , ');
                }
                if (filterlabels != '') {
                    title = title + ' where ' + filterlabels;
                }
                if (this.get('queryObject.groupBys.length')) {
                    groupBylabels = this.get('queryObject.groupBys').map(function (item) {
                        return item.get('label');
                    }).join(' , ');
                }
                if (groupBylabels != '') {
                    title = title + ', grouped by ' + groupBylabels;
                }
                this.set('question.title', title);
            }
        }),
        resultsViewType: _ember['default'].computed.alias('question.results_view_settings.resultsViewType'),
        questionName: _ember['default'].computed.alias('question.title'),
        resultsViewSettings: _ember['default'].computed.alias('question.results_view_settings'),
        queryBuilderType: _ember['default'].computed('queryObject.queryType', function () {
            var queryType = this.get('queryObject.queryType');
            if (queryType == 'query_builder') {
                return true;
            } else {
                return false;
            }
        }),

        changeSQL: _ember['default'].observer('queryObject.rawQuery', function () {
            this.set('question.sql', this.get('queryObject.rawQuery'));
        }),
        aceTheme: 'ace/theme/dracula',
        aceMode: 'ace/mode/sql',

        queryObject: _ember['default'].computed.alias('question.human_sql'),

        apiNamespace: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').namespace;
        }),

        apiHost: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').host;
        }),
        showGetResults: false,
        showGetResultsObserver: _ember['default'].observer('queryObject.database', 'queryObject.table', 'queryObject.queryType', 'queryObject.rawQuery', function () {
            var showGetResults = this.get('queryObject.database') && this.get('queryObject.table') || this.get('queryObject.database') && this.get('queryObject.queryType') == 'raw' && this.get('queryObject.rawQuery');
            _ember['default'].run.next(this, function () {
                this.set('showGetResults', showGetResults);
            });
        }),
        resultsWidgetSettingsComponent: _ember['default'].computed('resultsViewType', function () {
            this.set('results', this.get('results'));
            return this.get('resultsWidgets')[this.get('resultsViewType')] + '-settings';
        }),
        availableResultsTypes: _ember['default'].computed('resultsWidgets', function () {
            return Object.keys(this.get('resultsWidgets'));
        }),
        availableResultsTypesHash: _ember['default'].computed('availableResultsTypes', function () {
            return Object.keys(this.get('resultsWidgets')).map(function (item) {
                return _ember['default'].Object.create({
                    title: item
                });
            });
        }),
        resultsViewTypeTitle: _ember['default'].computed('resultsViewType', function () {
            return _ember['default'].Object.create({
                title: this.get('resultsViewType')
            });
        }),
        getResultsWithSelectedTextFunction: function getResultsWithSelectedTextFunction() {
            this.getResultsFunction(null, true);
        },
        getResultsFunction: function getResultsFunction(queryObject, withSelected) {
            var _this = this;

            var question = this.get('question');

            var query_variables = question.get('query_variables');
            var changedAttributes = Object.keys(question.changedAttributes()).filter(function (item) {
                return item != 'updated_at' && item != 'cached_results';
            });
            // if (question.id && ( changedAttributes == 0) && !this.get('variablesChanged') && !this.get('attributesChanged')){
            //     question.set("updated_at", new Date())
            //     question.set('resultsCanBeLoaded', true)
            // }else{
            question.set('updated_at', new Date());
            queryObject = queryObject || this.get('queryObject');
            queryObject.set('id', question.get('id'));
            queryObject.set('variables', query_variables && query_variables.map(function (item) {
                return {
                    name: item.get('name'),
                    value: item.get('value') || item.get('default'),
                    var_type: item.get('var_type'),
                    default_options: item.get('default_options')
                };
            }));

            this.changeQueryParamsInUrl(queryObject.get('variables'), queryObject.get('name'));
            this.set('loading', true);
            this.set('results', null);
            if (withSelected && this.get('aceEditor') && this.get('aceEditor').getSelectedText()) {
                queryObject = JSON.parse(JSON.stringify(queryObject));
                queryObject['rawQuery'] = this.get('aceEditor').getSelectedText();
            }
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/query_results',
                type: 'POST',
                data: queryObject
            }, function (response, status) {
                _this.set('loading', false);
                _this.set('errors', null);
                _this.set('results', response.data);
                if (!_this.get('resultsViewType')) {
                    _this.set('resultsViewType', _this.autoDetect(response.data.rows));
                }

                if (!(withSelected && _this.get('aceEditor') && _this.get('aceEditor').getSelectedText())) {
                    _this.set('queryObject.rawQuery', response.query);
                    _this.set('validQuestion', true);
                }
                _this.set('isQueryLimited', response.data.limited);
                _this.set('queryLimit', response.data.limit);
                _this.set('limitedQuery', response.data.limited_query);
                _this.set('variablesReplacedQuery', response.data.variables_replaced_query);
            }, function (error, status) {
                _this.set('loading', false);
                error && error.error ? _this.set('errors', error.error) : _this.set('errors', {
                    message: 'Something isn\'t right. Please check the query elements.'
                });
                _this.set('results', null);
                if (!(withSelected && _this.get('aceEditor') && _this.get('aceEditor').getSelectedText())) {
                    _this.set('validQuestion', false);
                    _this.set('queryObject.rawQuery', error.query);
                }
                _this.set('isQueryLimited', null);
                _this.set('queryLimit', null);
                _this.set('limitQuery', null);
                _this.set('variablesReplacedQuery', error.error.variables_replaced_query);
            });
            // }
        },

        actions: {
            removeVariable: function removeVariable(variable) {
                this.get('question.variables').removeObject(variable);
                this.set('variablesChanged', true);
                variable.destroyRecord();
            },

            toggleSql: function toggleSql() {
                var queryType = this.get('queryObject.queryType');
                if (queryType == 'query_builder') {
                    this.set('queryObject.queryType', 'raw');
                    this.get('queryObject.rawQuery') == null && this.set('queryObject.rawQuery', '');
                } else {
                    this.set('queryObject.queryType', 'query_builder');
                }
                var plotlyComponent = _ember['default'].$('.js-plotly-plot')[0];
                plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
            },
            getQuestionResults: function getQuestionResults() {
                var question = this.get('question');
                question.set('updated_at', new Date());
                question.set('resultsCanBeLoaded', true);
            },
            getResults: function getResults(queryObject) {
                this.getResultsFunction(queryObject);
            },
            toggleSettings: function toggleSettings() {
                this.toggleProperty('showSettings');
            },
            saveQuestion: function saveQuestion() {
                var _this2 = this;

                if (this.get('newQuestion')) {
                    _ember['default'].run.later(this, function () {
                        $('.js-question_title').focus();
                    }, 150);
                    this.set('newQuestion', false);
                } else {
                    (function () {
                        var question = _this2.get('question');
                        question.set('sql', question.get('sql') || question.get('human_sql.rawQuery'));
                        question.set('cached_results', null);
                        question.set('query_type', question.get('human_sql.queryType') == 'raw' ? 'sql' : 'human_sql');
                        question.save().then(function (response) {
                            question.get('variables').invoke('save');

                            _this2.set('retryingTransition', true);
                            _this2.transitionToRoute('questions.show', response.id);
                        }).then(function (variable) {
                            question.set('resultsCanBeLoaded', true);
                        });
                    })();
                }
            },
            transitionToDashBoard: function transitionToDashBoard(dashboard_id) {
                this.transitionToRoute('dashboards.show', dashboard_id);
            },
            transitionToIndex: function transitionToIndex() {
                this.transitionToRoute('index');
            },
            downloadData: function downloadData() {
                var _this3 = this;

                var question = this.get('question');
                var queryObject = this.get('queryObject');
                var query_variables = question.get('query_variables');
                queryObject.set('variables', query_variables && query_variables.map(function (item) {
                    return {
                        name: item.get('name'),
                        value: item.get('value') || item.get('default'),
                        var_type: item.get('var_type'),
                        default_options: item.get('default_options')
                    };
                }));
                this.get('ajax').apiCall({
                    url: this.get('apiHost') + this.get('apiNamespace') + '/create_csv',
                    type: 'POST',
                    data: queryObject
                }, function (response, status) {

                    _this3.get('toast').success('Your CSV is getting uploaded to cloud. You\'ll get an email with download link shortly', 'YaY!', {
                        closeButton: true,
                        timeout: 1500,
                        progressBar: false
                    });
                }, function (error, status) {
                    _this3.get('toast').success('Looks like CSV download process is not working as expected. Please try again. If problem persists, talk to your Admin', 'Sorry Mate!', {
                        closeButton: true,
                        timeout: 1500,
                        progressBar: false
                    });
                });
            },
            addVariable: function addVariable() {
                var variable = this.store.createRecord('variable', {
                    name: 'New Variable',
                    var_type: 'String',
                    'default': 'value',
                    default_options: []
                });
                this.get('question.variables').pushObject(variable);
                this.set('variablesChanged', true);
            },

            transitionToSnapshots: function transitionToSnapshots(questionId) {
                this.transitionToRoute('questions.show.snapshots.all', questionId);
            },
            updateResultViewType: function updateResultViewType(selection) {
                this.set('resultsViewType', selection.get('title'));
            },
            toggleFullscreen: function toggleFullscreen() {
                var plotlyComponent = _ember['default'].$('.js-plotly-plot')[0];
                this.set('resizeTime', new Date());
                if (this.get('fullscreenClass')) {
                    this.set('fullscreenClass', null);
                    plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
                } else {
                    this.set('fullscreenClass', 'fullscreen');
                    plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
                }
            },
            toggleSqlEditor: function toggleSqlEditor() {
                this.toggleProperty('collapseSqlEditor');
            },
            setEditorWhenReady: function setEditorWhenReady(editor) {
                this.set('aceEditor', editor);
            }

        }
    });
});
/* global pushObject */
define('frontend/pods/questions/new/route', ['exports', 'ember', 'ember-can', 'ember-keyboard-shortcuts/mixins/route', 'frontend/mixins/dynamic-query-params-routes-mixin'], function (exports, _ember, _emberCan, _emberKeyboardShortcutsMixinsRoute, _frontendMixinsDynamicQueryParamsRoutesMixin) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, _emberKeyboardShortcutsMixinsRoute['default'], _frontendMixinsDynamicQueryParamsRoutesMixin['default'], {
        toast: _ember['default'].inject.service(),
        title: 'Afterglow New Question',

        resetController: function resetController() {
            this.controller.set('validQuestion', true);
            this.controller.set('queryObject.rawQuery', null);
            this.controller.set('isQueryLimited', false);
            this.controller.set('queryLimit', 0);
            this.controller.set('limitedQuery', null);
            this.controller.set('variablesReplacedQuery', null);
            this.controller.set('recalculate', new Date());
            this.controller.set('showSettings', false);
            this.controller.set('results', null);
            this.controller.set('errors', null);
        },
        afterModel: function afterModel() {
            if (!this.can('create question')) {
                this.transitionTo('questions.all');
            }
        },
        actions: {
            willTransition: function willTransition(transition) {
                this._super.apply(this, arguments);
                this.set('nextTransition', transition);
                if (this.can('create question') && !this.controller.get('retryingTransition')) {
                    transition.abort();
                    this.controller.set('showTransitionWarning', true);
                } else {
                    this.resetController();
                }
                this.set('retryingTransition', false);
            },
            runQuery: function runQuery() {
                this.get('currentController').getResultsFunction();
            },
            runQueryWithSelectedText: function runQueryWithSelectedText() {
                this.get('currentController').getResultsWithSelectedTextFunction();
            },
            goAheadWithNextTransition: function goAheadWithNextTransition() {
                this.resetController();
                this.controller.set('retryingTransition', true);
                this.get('nextTransition').retry();
            }
        },

        keyboardShortcuts: {
            'ctrl+enter': 'runQuery',
            'ctrl+r': 'runQueryWithSelectedText'
        }

    });
});
define("frontend/pods/questions/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vttdOjyo", "block": "{\"symbols\":[\"var\"],\"statements\":[[1,[25,\"question-options\",null,[[\"questionName\",\"saveQuestion\",\"validQuestion\",\"enableAddToDashboard\",\"addToDashboard\",\"question\",\"newQuestion\",\"showVariables\",\"transitionToIndex\",\"transitionToSnapshots\",\"canCreateSnapshot\",\"canEdit\"],[[20,[\"questionName\"]],\"saveQuestion\",[20,[\"validQuestion\"]],[20,[\"enableAddToDashBoard\"]],\"addToDashboard\",[20,[\"question\"]],[20,[\"newQuestion\"]],[20,[\"showVariables\"]],\"transitionToIndex\",\"transitionToSnapshots\",[20,[\"canCreateSnapshot\"]],[20,[\"canEdit\"]]]]],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container p-0 mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[20,[\"showVariables\"]],\" col-9 \",\"col-12 \"],null]]]],[7],[0,\" \"],[1,[25,\"variables-layer\",null,[[\"variables\",\"showVariables\"],[[20,[\"question\",\"query_variables\"]],[20,[\"showVariables\"]]]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"and\",[[20,[\"queryBuilderType\"]],[20,[\"canEdit\"]]],null],\"col-3\",\"col-12\"],null]]]],[7],[0,\"\\n                    \"],[4,\"if\",[[25,\"and\",[[20,[\"queryBuilderType\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[0,\" \"],[1,[25,\"query-builder\",null,[[\"loading\",\"getResults\",\"toggleSql\",\"queryObject\",\"showGetResults\",\"databases\"],[[20,[\"loading\"]],\"getResults\",\"toggleSql\",[20,[\"queryObject\"]],[20,[\"showGetResults\"]],[20,[\"databases\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"and\",[[20,[\"canEdit\"]],[20,[\"queryBuilderType\"]]],null],\"col-9\",\"col-12\"],null]]]],[7],[0,\"\\n                    \"],[4,\"if\",[[25,\"and\",[[20,[\"queryBuilderType\"]],[20,[\"canEdit\"]]],null]],null,{\"statements\":[[0,\" \"]],\"parameters\":[]},{\"statements\":[[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"col-12\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"div\"],[10,\"class\",[26,[\"card \",[25,\"if\",[[20,[\"collapseSqlEditor\"]],\"card-collapsed\"],null]]]],[7],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"row card-header\"],[7],[0,\"\\n                                            \"],[6,\"div\"],[9,\"class\",\"col-2\"],[7],[0,\" \"],[1,[25,\"database-selector\",null,[[\"queryObject\",\"showTags\",\"databases\"],[[20,[\"queryObject\"]],false,[20,[\"databases\"]]]]],false],[0,\"\\n                                            \"],[8],[0,\"\\n                                            \"],[6,\"div\"],[9,\"class\",\"card-options\"],[7],[0,\"\\n                                                \"],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"toggleSqlEditor\"]],[7],[0,\"\\n                                                    \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-up\"],[7],[8],[0,\"\\n                                                \"],[8],[0,\"\\n                                                \"],[6,\"a\"],[9,\"class\",\"text-right\"],[3,\"action\",[[19,0,[]],\"toggleSql\"]],[7],[0,\"\\n                                                    \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Switch to Query Builder\"]],\"parameters\":[]},null],[0,\"\\n                                                    \"],[6,\"i\"],[9,\"class\",\"fe fe-align-justify text-gray\"],[7],[8],[0,\"\\n                                                \"],[8],[0,\"\\n                                            \"],[8],[0,\"\\n                                        \"],[8],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n                                            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"queryObject\",\"database\"]]],null,{\"statements\":[[0,\"                                                    \"],[6,\"div\"],[9,\"class\",\"col-3\"],[7],[0,\" \"],[1,[25,\"db-tree\",null,[[\"database\"],[[20,[\"queryObject\",\"database\"]]]]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                                \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[20,[\"queryObject\",\"database\"]],\"col-9\",\"col-12\"],null]]]],[7],[0,\" \"],[1,[25,\"ember-ace\",null,[[\"lines\",\"value\",\"mode\",\"enableSnippets\",\"enableDefaultAutocompletion\",\"enableLiveAutocompletion\",\"context\",\"suggestAutoCompletions\",\"theme\",\"useWrapMode\",\"update\",\"ready\"],[15,[20,[\"queryObject\",\"rawQuery\"]],[20,[\"aceMode\"]],true,true,true,[20,[\"queryObject\",\"database\"]],[20,[\"suggestAutoCompletions\"]],[20,[\"aceTheme\"]],true,[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"queryObject\",\"rawQuery\"]]],null]],null],[25,\"action\",[[19,0,[]],\"setEditorWhenReady\"],null]]]],false],[0,\"\\n                                                \"],[8],[0,\"\\n                                            \"],[8],[0,\"\\n                                        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showGetResults\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[9,\"class\",\"card-footer\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"                                                    \"],[6,\"div\"],[9,\"class\",\"content active text-align-center\"],[7],[0,\"\\n                                                        \"],[6,\"button\"],[9,\"class\",\"btn btn-secondary\"],[7],[0,\" Crunching Data ... \"],[8],[0,\"\\n                                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                                    \"],[6,\"div\"],[9,\"class\",\"content active text-align-center\"],[7],[0,\"\\n                                                        \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[3,\"action\",[[19,0,[]],\"getResults\"]],[7],[0,\" Get\\n                                                            Results \"],[6,\"i\"],[9,\"class\",\"fe fe-arrow-right text-white\"],[7],[8],[0,\"\\n                                                        \"],[8],[0,\"\\n                                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"content active text-align-center\"],[7],[0,\"\\n                                            \"],[6,\"button\"],[9,\"class\",\"btn btn-secondary\"],[7],[0,\" Crunching Data ... \"],[8],[0,\"\\n                                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"content active text-align-center\"],[7],[0,\"\\n                                            \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[3,\"action\",[[19,0,[]],\"getQuestionResults\"]],[7],[0,\" Refresh\\n                                            \"],[8],[0,\"\\n                                        \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[20,[\"canEdit\"]]],null,{\"statements\":[[4,\"if\",[[25,\"or\",[[20,[\"variablesReplacedQuery\"]],[20,[\"isQueryLimited\"]]],null]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"mb-5\"],[7],[0,\"\\n                                \"],[4,\"if\",[[20,[\"results\",\"final_query\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"final-query-accordian\",null,[[\"isQueryLimited\",\"queryLimit\",\"variablesReplacedQuery\",\"aceMode\",\"finalQuery\",\"additionalFiltersApplied\",\"aceTheme\"],[[20,[\"isQueryLimited\"]],[20,[\"queryLimit\"]],[20,[\"variablesReplacedQuery\"]],[20,[\"aceMode\"]],[20,[\"results\",\"final_query\"]],[20,[\"results\",\"additional_filters_applied\"]],[20,[\"aceTheme\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"]],\"parameters\":[]},null],[0,\" \"],[1,[25,\"additional-filters\",null,[[\"results\",\"error\",\"question\",\"queryObject\"],[[20,[\"results\"]],[20,[\"errors\"]],[20,[\"question\"]],[20,[\"queryObject\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"results\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[10,\"class\",[26,[\"card \",[18,\"fullscreenClass\"]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"card-header row results-view-selector\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"col-3\"],[9,\"bubbles\",\"false\"],[7],[0,\" \"],[1,[25,\"searchable-select\",null,[[\"class\",\"content\",\"selected\",\"prompt\",\"on-change\"],[\"my-2 w-75 d-inline-block\",[20,[\"availableResultsTypesHash\"]],[20,[\"resultsViewTypeTitle\"]],\"Select\\n                                a Visualization\",[25,\"action\",[[19,0,[]],\"updateResultViewType\"],null]]]],false],[0,\"\\n                                    \"],[6,\"span\"],[7],[0,\"\\n                                        \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Configure Visualization\"]],\"parameters\":[]},null],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-settings text-gray\"],[3,\"action\",[[19,0,[]],\"toggleSettings\"]],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"col-3 offset-6 text-right\"],[7],[0,\"\\n                                    \"],[6,\"span\"],[9,\"class\",\"px-1\"],[3,\"action\",[[19,0,[]],\"downloadData\"]],[7],[0,\"\\n                                        \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Download Data\"]],\"parameters\":[]},null],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-save text-gray\"],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"question\",\"updated_at\"]]],null,{\"statements\":[[0,\"                                        \"],[6,\"span\"],[9,\"class\",\"px-1\"],[7],[0,\"\\n                                            \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"Updated \"],[1,[25,\"moment-from-now\",[[20,[\"question\",\"updated_at\"]]],[[\"interval\"],[1000]]],false]],\"parameters\":[]},null],[0,\"\\n                                            \"],[6,\"i\"],[10,\"class\",[26,[\"fe fe-clock text-\",[20,[\"question\",\"updatedAgoColor\"]]]]],[7],[8],[0,\"\\n                                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                    \"],[6,\"span\"],[9,\"class\",\"pl-1\"],[3,\"action\",[[19,0,[]],\"toggleFullscreen\"]],[7],[0,\"\\n                                        \"],[4,\"bs-tooltip\",null,[[\"placement\"],[\"top\"]],{\"statements\":[[0,\"toggleFullScreen\"]],\"parameters\":[]},null],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"fe fe-maximize text-gray\"],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[4,\"if\",[[20,[\"showSettings\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"component\",[[20,[\"resultsWidgetSettingsComponent\"]]],[[\"resultsViewSettings\",\"results\",\"database\",\"table\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]],[20,[\"queryParams\",\"database\"]],[20,[\"queryParams\",\"table\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"div\"],[9,\"class\",\"card-body p-0\"],[7],[0,\" \"],[1,[25,\"question-widget\",null,[[\"results\",\"resultsViewSettings\",\"resultsViewType\",\"questionName\",\"hideMenu\",\"question\",\"resizeTime\"],[[20,[\"results\"]],[20,[\"resultsViewSettings\"]],[20,[\"resultsViewType\"]],[20,[\"questionName\"]],true,[20,[\"question\"]],[20,[\"resizeTime\"]]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"card results\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"dimmer active p-8\"],[7],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"loader big text-primary\"],[7],[0,\" \"],[8],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"dimmer-content full-height\"],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"card results\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"div\"],[9,\"class\",\"query error section text-red\"],[7],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"ui big\"],[7],[0,\"\\n                                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x-circle text-red\"],[7],[8],[0,\"\\n                                        \"],[8],[0,\" \"],[1,[20,[\"errors\",\"message\"]],false],[0,\"\\n                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                    \"],[6,\"div\"],[9,\"class\",\"section\"],[7],[0,\"Wanna see something cool? Run a Query!\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showVariables\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-3 pl-2\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Variables\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"question\",\"variables\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"w-100\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"card p-4\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-x text-gray variable-remove\"],[3,\"action\",[[19,0,[]],\"removeVariable\",[19,1,[]]]],[7],[8],[0,\"\\n                            \"],[1,[25,\"create-variable\",null,[[\"entity\",\"variable\"],[[20,[\"question\"]],[19,1,[]]]]],false],[0,\" \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[6,\"div\"],[9,\"class\",\"btn btn-primary w-100\"],[3,\"action\",[[19,0,[]],\"addVariable\"]],[7],[0,\" Add Variable \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"],[8],[0,\" \"],[1,[25,\"next-transition-warning\",null,[[\"open\",\"goAheadWithNextTransition\"],[[20,[\"showTransitionWarning\"]],\"goAheadWithNextTransition\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/new/template.hbs" } });
});
define('frontend/pods/questions/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
  exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {});
});
define('frontend/pods/questions/show/controller', ['exports', 'ember', 'frontend/pods/questions/new/controller', 'frontend/mixins/result-view-mixin', 'ember-can'], function (exports, _ember, _frontendPodsQuestionsNewController, _frontendMixinsResultViewMixin, _emberCan) {
    exports['default'] = _frontendPodsQuestionsNewController['default'].extend(_frontendMixinsResultViewMixin['default'], _emberCan.CanMixin, {
        question: _ember['default'].computed.alias('model'),
        newQuestion: false,
        enableAddToDashBoard: true,
        results: _ember['default'].computed.alias('question.results'),
        isQueryLimited: _ember['default'].computed.alias('results.limited'),
        canCreateSnapshot: true,
        limitedQuery: _ember['default'].computed.alias('results.limited_query'),
        queryLimit: _ember['default'].computed.alias('results.limit'),
        variablesReplacedQuery: _ember['default'].computed.alias('results.variables_replaced_query'),
        loading: _ember['default'].computed.alias('question.loading'),
        validQuestion: true,
        questionNameIsSet: true,

        canEdit: _ember['default'].computed(function () {
            return this.can('edit question');
        }),
        actions: {
            showAddToDashboard: function showAddToDashboard() {
                $('.ui.modal.add-to-dashboard').modal('show');
            },

            refreshNow: function refreshNow() {
                var question = this.get('question');
                question.set('resultsCanBeLoaded', true);
                question.set('updated_at', new Date());
            },
            addToDashboard: function addToDashboard(dashboard) {
                var _this = this;

                dashboard.get('questions').addObject(this.get('question'));
                var settings = dashboard.get('settings');
                !settings && dashboard.set('settings', {});
                settings = dashboard.get('settings');
                var dimensions = this.get('resultViewDashboardDefaultDimensions')[this.get('question.results_view_settings.resultsViewType')] || {
                    width: 6,
                    height: 6
                };
                settings[this.get('question.id')] = dimensions;
                dashboard.save().then(function (response) {
                    _this.set('retryingTransition', true);
                    _this.transitionToRoute('dashboards.show', response.id);
                    $('.ui.modal.add-to-dashboard').modal('hide');
                });
            }

        }
    });
});
define('frontend/pods/questions/show/route', ['exports', 'ember', 'ember-can', 'frontend/mixins/dynamic-query-params-routes-mixin', 'ember-keyboard-shortcuts/mixins/route'], function (exports, _ember, _emberCan, _frontendMixinsDynamicQueryParamsRoutesMixin, _emberKeyboardShortcutsMixinsRoute) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, _emberKeyboardShortcutsMixinsRoute['default'], _frontendMixinsDynamicQueryParamsRoutesMixin['default'], {
        toast: _ember['default'].inject.service(),

        afterModel: function afterModel(model, transition) {

            this._super.apply(this, arguments);
            if (!this.can('show question')) {
                this.get('toast').error('You are not authorized to perform this action', 'Sorry Mate!', {
                    closeButton: true,
                    timeout: 1500,
                    progressBar: false
                });

                this.transitionTo('index');
            } else {
                this.set('title', 'Afterglow Question - ' + model.get('title'));
            }
        },
        queryParams: {
            share_id: {
                refreshModel: true
            }
        },
        model: function model(params) {
            return this.store.queryRecord('question', {
                id: params.question_id,
                share_id: params.share_id
            });
        },
        resetController: function resetController() {
            this.controller.get('question').reload();

            this.set('retryingTransition', false);
        },
        templateName: 'questions/new',
        actions: {

            willTransition: function willTransition(transition) {
                this._super.apply(this, arguments);
                this.set('nextTransition', transition);
                if (this.can('create question') && !this.controller.get('retryingTransition')) {
                    transition.abort();
                    this.controller.set('showTransitionWarning', true);
                } else {
                    this.resetController();
                }
                this.set('retryingTransition', false);
            },
            runQuery: function runQuery() {
                this.get('currentController').getResultsFunction();
            },
            runQueryWithSelectedText: function runQueryWithSelectedText() {
                this.get('currentController').getResultsWithSelectedTextFunction();
            },
            goAheadWithNextTransition: function goAheadWithNextTransition() {
                this.resetController();
                this.controller.set('retryingTransition', true);
                this.get('nextTransition').retry();
            },
            didTransition: function didTransition() {
                this._super.apply(this, arguments);

                this.set('currentController.question.resultsCanBeLoaded', new Date());
            }
        },

        keyboardShortcuts: {
            'ctrl+enter': 'runQuery',
            'ctrl+r': 'runQueryWithSelectedText'
        }
    });
});
define('frontend/pods/questions/show/snapshots/all/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({

        searchedsnapshots: _ember['default'].computed('question.snapshots', 'query', function () {
            var query = this.get('query');
            var snapshots = this.get('question.snapshots');
            if (!query || query == '') {
                return snapshots;
            } else {
                return snapshots.filter(function (item) {
                    return item.get('name').toLowerCase().indexOf(query.toLowerCase()) >= 0;
                });
            }
        }),

        actions: {
            editSnapshot: function editSnapshot() {
                //  this.get('selectedSnapshot').stop();
                this.set('selectedSnapshot.starting_at', new Date());
                this.set('toggleEditSnapshot', true);
            }
        }
    });
});
define('frontend/pods/questions/show/snapshots/all/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        afterModel: function afterModel() {
            // if (!this.can('show question')) {
            //     this.get('toast').error(
            //         "You are not authorized to perform this action",
            //         'Sorry Mate!',
            //         {closeButton: true, timeout: 1500, progressBar:false}
            //     );

            //     this.transitionTo('index');
            // }
        },
        renderTemplate: function renderTemplate(controller, model) {

            // Render the `favoritePost` template into
            // the outlet `posts`, and display the `favoritePost`
            // controller.
            this.render('questions.show.snapshots.all', {
                into: 'application',
                controller: controller
            });
        },

        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            controller.set('question', this.controllerFor('questions.show').get('question'));
        }

    });
});
define("frontend/pods/questions/show/snapshots/all/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eGh5n8OO", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\" \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container px-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"form-group pt-4\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"input-group input-icon\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"input-group-prepend\"],[9,\"id\",\"basic-addon3\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"input-group-text\"],[7],[0,\"Search a Question\"],[8],[0,\"\\n            \"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\",\"aria-describedby\"],[[20,[\"query\"]],\"form-control\",\"Search Snapshot\",\"basic-addon3\"]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-icon-addon\"],[7],[0,\"\\n                \"],[6,\"i\"],[9,\"class\",\"fe fe-search\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[4,\"if\",[[20,[\"query\"]]],null,{\"statements\":[[0,\" \"],[1,[25,\"snapshots-list\",null,[[\"questions\",\"selectedSnapshot\",\"editSnapshot\",\"stopSnapshot\"],[[20,[\"searchedSnapshots\"]],[20,[\"selectedSnapshot\"]],\"editSnapshot\",\"stopSnapshot\"]]],false],[0,\"\\n        \"]],\"parameters\":[]},{\"statements\":[[1,[25,\"snapshots-list\",null,[[\"snapshots\",\"selectedSnapshot\",\"editSnapshot\",\"stopSnapshot\"],[[20,[\"question\",\"snapshots\"]],[20,[\"selectedSnapshot\"]],\"editSnapshot\",\"stopSnapshot\"]]],false],[0,\"\\n\"]],\"parameters\":[]}],[8],[0,\" \"],[1,[25,\"snapshot-creator\",null,[[\"snapshot\",\"open\",\"edit\"],[[20,[\"selectedSnapshot\"]],[20,[\"toggleEditSnapshot\"]],true]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/show/snapshots/all/template.hbs" } });
});
define('frontend/pods/questions/show/snapshots/show/controller', ['exports', 'ember', 'frontend/pods/questions/new/controller', 'frontend/mixins/result-view-mixin'], function (exports, _ember, _frontendPodsQuestionsNewController, _frontendMixinsResultViewMixin) {
    exports['default'] = _frontendPodsQuestionsNewController['default'].extend(_frontendMixinsResultViewMixin['default'], {
        snapshot: _ember['default'].computed.alias('model'),
        columns: _ember['default'].computed.alias('snapshot.columns'),
        rows: _ember['default'].computed.alias("snapshot.snapshotData"),

        results: _ember['default'].computed('columns', 'rows', function () {
            return {
                columns: this.get('columns'),
                rows: this.get('rows').map(function (item) {
                    return item.get('rowValues');
                })
            };
        }),
        actions: {

            downloadData: function downloadData() {
                var _this = this;

                var queryObject = { snapshot_id: this.get('snapshot.id') };
                this.get('ajax').apiCall({
                    url: this.get('apiHost') + this.get('apiNamespace') + '/create_csv',
                    type: 'POST',
                    data: queryObject
                }, function (response, status) {

                    _this.get('toast').success("Your CSV is getting uploaded to cloud. You'll get an email with download link shortly", 'YaY!', { closeButton: true, timeout: 1500, progressBar: false });
                }, function (error, status) {
                    _this.get('toast').success("Looks like CSV download process is not working as expected. Please try again. If problem persists, talk to your Admin", 'Sorry Mate!', { closeButton: true, timeout: 1500, progressBar: false });
                });
            }
        }
    });
});
define('frontend/pods/questions/show/snapshots/show/route', ['exports', 'ember', 'ember-can'], function (exports, _ember, _emberCan) {
    exports['default'] = _ember['default'].Route.extend(_emberCan.CanMixin, {

        model: function model(params) {
            return this.store.findRecord('snapshot', params.snapshot_id);
        },
        afterModel: function afterModel() {
            if (!this.can('show question')) {
                this.get('toast').error("You are not authorized to perform this action", 'Sorry Mate!', { closeButton: true, timeout: 1500, progressBar: false });

                this.transitionTo('index');
            }
        },

        renderTemplate: function renderTemplate(controller, model) {

            this.render('questions.show.snapshots.show', {
                into: 'application',
                controller: controller
            });
        }
    });
});
define("frontend/pods/questions/show/snapshots/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YMllDj5F", "block": "{\"symbols\":[\"execute\",\"mapper\",\"rv\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui basic segment full padded-content no-top-margin\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"results\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"ui segment\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui grid results-view-selector\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"four wide column\"],[9,\"bubbles\",\"false\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"search selection\",[20,[\"resultsViewType\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"resultsViewType\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[1,[25,\"dropdown-default\",null,[[\"default\"],[[20,[\"resultsViewType\"]]]]],false],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"fe fe-chevron-down\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"availableResultsTypes\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,2,[]],[19,3,[]]],null]]]],[7],[0,\"\\n                                    \"],[6,\"i\"],[10,\"class\",[26,[[25,\"get-chart-icon\",[[19,3,[]]],null],\" icon\"]]],[7],[8],[0,\"\\n                                    \"],[1,[19,3,[]],false],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"eight wide column text-align-right\"],[7],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"four wide column text-align-right\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"question\",\"updated_at\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"span\"],[10,\"data-tooltip\",[26,[\" Updated \",[25,\"moment-from-now\",[[20,[\"question\",\"updated_at\"]]],[[\"interval\"],[1000]]]]]],[9,\"data-inverted\",\"\"],[7],[0,\"\\n                            \"],[6,\"i\"],[10,\"class\",[26,[\"time icon \",[20,[\"question\",\"updatedAgoColor\"]]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[6,\"span\"],[9,\"data-tooltip\",\"Download Data\"],[9,\"data-inverted\",\"\"],[3,\"action\",[[19,0,[]],\"downloadData\"]],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"save icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"span\"],[9,\"data-tooltip\",\"Configure\"],[9,\"data-inverted\",\"\"],[7],[0,\"  \\n                        \"],[6,\"i\"],[9,\"class\",\"settings icon\"],[3,\"action\",[[19,0,[]],\"toggleSettings\"]],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showSettings\"]]],null,{\"statements\":[[0,\"                \"],[1,[25,\"component\",[[20,[\"resultsWidgetSettingsComponent\"]]],[[\"resultsViewSettings\",\"results\"],[[20,[\"resultsViewSettings\"]],[20,[\"results\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[1,[25,\"question-widget\",null,[[\"results\",\"resultsViewSettings\",\"resultsViewType\",\"questionName\",\"question\"],[[20,[\"results\"]],[20,[\"resultsViewSettings\"]],[20,[\"resultsViewType\"]],[20,[\"questionName\"]],[20,[\"question\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"loading\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"ui segment results\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui text massive loader\"],[7],[1,[18,\"loadingMessage\"],false],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"ui segment results\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"errors\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"query error section\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui big\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"ban icon red\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[1,[20,[\"errors\",\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"section\"],[7],[0,\"Wanna see something cool? Run a Query!\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}]],\"parameters\":[]}],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/show/snapshots/show/template.hbs" } });
});
define("frontend/pods/questions/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "XRp9SHP+", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/show/template.hbs" } });
});
define("frontend/pods/questions/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1v0fhLPx", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/questions/template.hbs" } });
});
define("frontend/pods/settings/controller", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Controller.extend({
        pageTitle: "Settings"
    });
});
define('frontend/pods/settings/databases/edit/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        db: _ember['default'].computed.alias('model'),

        dbTypes: ['postgres', 'influxdb', 'mysql', 'redshift'],

        actions: {
            selectDbType: function selectDbType(value) {
                this.set('db.db_type', value);
            },
            saveDatabase: function saveDatabase() {
                var _this = this;

                this.get('db').save().then(function (response) {
                    _this.transitionToRoute('settings.databases.index');
                });
            }
        }
    });
});
define('frontend/pods/settings/databases/edit/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            return this.store.queryRecord('database', {
                id: params.database_id,
                include_config: "true"
            });
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Edit Database');
        }

    });
});
define("frontend/pods/settings/databases/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "/zNfpMim", "block": "{\"symbols\":[\"dbType\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Type\"],[8],[0,\"\\n                \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectDbType\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"dbTypes\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"option\"],[10,\"value\",[19,1,[]],null],[10,\"selected\",[25,\"eq\",[[20,[\"db\",\"db_type\"]],[19,1,[]]],null],null],[7],[1,[25,\"capitalize\",[[19,1,[]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"first-name\",\"form-control\",\"What do you call it?\",[20,[\"db\",\"name\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Host Url\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Host endpoint\",[20,[\"db\",\"config\",\"host_url\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Host Port\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"number\",\"first-name\",\"Host Port\",[20,[\"db\",\"config\",\"host_port\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Database Name\",[20,[\"db\",\"config\",\"db_name\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Username\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Username\",[20,[\"db\",\"config\",\"username\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Password\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"password\",\"first-name\",\"Password\",[20,[\"db\",\"config\",\"password\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-footer text-right\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[9,\"type\",\"submit\"],[3,\"action\",[[19,0,[]],\"saveDatabase\"]],[7],[0,\"SAVE\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/databases/edit/template.hbs" } });
});
define('frontend/pods/settings/databases/index/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        databases: _ember['default'].computed.sort('model', function (a, b) {
            if (a.get('name').toLowerCase() <= b.get('name').toLowerCase()) {
                return -1;
            } else {
                return 1;
            }
        }),

        actions: {
            showDeleteDialogue: function showDeleteDialogue(databaseToBeDeleted) {
                this.set('databaseToBeDeleted', databaseToBeDeleted);
                this.set('toggleDeleteDialogue', true);
            },
            deleteDatabase: function deleteDatabase(database) {
                database.destroyRecord().then(function (database) {});
            }
        }
    });
});
define('frontend/pods/settings/databases/index/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model() {
            return this.store.findAll('database');
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Databases');
            this.controllerFor('settings').set('showAddDatabase', true);
        },

        actions: {
            willTransition: function willTransition() {
                this.controllerFor('settings').set('showAddDatabase', false);
            }
        }
    });
});
define("frontend/pods/settings/databases/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4l19VaU3", "block": "{\"symbols\":[\"database\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"databases\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card mb-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card-body p-3\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"avatar mr-2 text-white bg-primary\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-database\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                                \"],[6,\"h6\"],[9,\"class\",\"m-0 text-default\"],[7],[0,\" \"],[1,[25,\"capitalize\",[[19,1,[\"name\"]]],null],false],[0,\" \"],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" type: \"],[1,[19,1,[\"db_type\"]],false],[0,\" \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-6 text-right\"],[7],[0,\"\\n                        \"],[4,\"link-to\",[\"settings.databases.edit\",[19,1,[\"id\"]]],[[\"class\"],[\"btn btn-link text-primary\"]],{\"statements\":[[0,\" EDIT\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"button\"],[9,\"data-tooltip\",\"Delete Database\"],[9,\"data-inverted\",\"\"],[9,\"class\",\"btn btn-link text-red\"],[3,\"action\",[[19,0,[]],\"showDeleteDialogue\",[19,1,[]]]],[7],[0,\" DELETE \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card-body text-center\"],[7],[0,\" You have not added any databases yet. \"],[6,\"div\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"settings.databases.new\"],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"btn btn-link p-0\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" ADD NEW DATABASE \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8],[0,\"\\n\"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"database\",[20,[\"toggleDeleteDialogue\"]],[20,[\"databaseToBeDeleted\"]],\"deleteDatabase\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/databases/index/template.hbs" } });
});
define('frontend/pods/settings/databases/new/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        db: {
            name: null,
            db_type: 'postgres',
            config: {
                host_url: null,
                host_port: null,
                db_name: null,
                username: null,
                password: null
            }
        },

        dbTypes: ['postgres', 'influxdb', 'mysql', 'redshift'],

        actions: {
            selectDbType: function selectDbType(value) {
                this.set('db.db_type', value);
            },
            saveDatabase: function saveDatabase() {
                var _this = this;

                this.store.createRecord('database', this.get('db')).save().then(function (response) {
                    _this.transitionToRoute('settings.databases.index');
                });
            }
        }
    });
});
define('frontend/pods/settings/databases/new/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'New Database');
        }

    });
});
define("frontend/pods/settings/databases/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0oLTX4Ik", "block": "{\"symbols\":[\"dbType\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Type\"],[8],[0,\"\\n                \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectDbType\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"dbTypes\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"option\"],[10,\"value\",[19,1,[]],null],[10,\"selected\",[25,\"eq\",[[20,[\"db\",\"db_type\"]],[19,1,[]]],null],null],[7],[1,[25,\"capitalize\",[[19,1,[]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"first-name\",\"form-control\",\"What do you call it?\",[20,[\"db\",\"name\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Host Url\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Host endpoint\",[20,[\"db\",\"config\",\"host_url\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Host Port\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"number\",\"first-name\",\"Host Port\",[20,[\"db\",\"config\",\"host_port\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Name\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Database Name\",[20,[\"db\",\"config\",\"db_name\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Username\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"Username\",[20,[\"db\",\"config\",\"username\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Database Password\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"password\",\"first-name\",\"Password\",[20,[\"db\",\"config\",\"password\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-footer text-right\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[9,\"type\",\"submit\"],[3,\"action\",[[19,0,[]],\"saveDatabase\"]],[7],[0,\"SAVE\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/databases/new/template.hbs" } });
});
define('frontend/pods/settings/email/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Email Settings');
            this.controllerFor('settings').set('showAddDatabase', false);
        }
    });
});
define("frontend/pods/settings/email/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "/X8Ge1kF", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/email/template.hbs" } });
});
define('frontend/pods/settings/permissions/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        permissionSets: _ember['default'].computed.alias('model')
    });
});
define('frontend/pods/settings/permissions/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            return this.store.findAll('permission_set');
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Permissions');
            this.controllerFor('settings').set('showAddDatabase', false);
        }
    });
});
define("frontend/pods/settings/permissions/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "y/2WHASd", "block": "{\"symbols\":[\"permissionSet\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"permissionSets\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card mb-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card-body p-3\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                                \"],[6,\"h5\"],[9,\"class\",\" m-0 text-default \"],[7],[0,\" \"],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted \"],[7],[0,\" \"],[1,[19,1,[\"displayPermissions\"]],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/permissions/template.hbs" } });
});
define('frontend/pods/settings/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin', 'ember-can'], function (exports, _ember, _frontendMixinsAuthenticationMixin, _emberCan) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], _emberCan.CanMixin, {
        toast: _ember['default'].inject.service(),
        afterModel: function afterModel() {
            if (!this.can('show settings')) {
                this.get('toast').error("You are not authorized to perform this action", 'Sorry Mate!', { closeButton: true, timeout: 1500, progressBar: false });

                this.transitionTo('index');
            }
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Settings');
        }
    });
});
define('frontend/pods/settings/sms/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'SMS Settings');

            this.controllerFor('settings').set('showAddDatabase', false);
        }
    });
});
define("frontend/pods/settings/sms/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "mB6Gz0DY", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/sms/template.hbs" } });
});
define('frontend/pods/settings/teams/edit/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        team: _ember['default'].computed.alias('model'),
        users: _ember['default'].computed(function () {
            return this.store.findAll('user');
        }),
        databases: _ember['default'].computed(function () {
            return this.store.findAll('database');
        }),
        selectedUsers: _ember['default'].computed('team.users', function () {
            var _this = this;

            return this.get('team.users') && this.get('team.users').map(function (item) {
                return _this.get('store').peekRecord('user', item.get('id'));
            });
        }),
        selectedDatabases: _ember['default'].computed('team.accessible_databases', function () {
            var _this2 = this;

            return this.get('team.accessible_databases') && this.get('team.accessible_databases').map(function (item) {
                return _this2.get('store').peekRecord('database', item.get('id'));
            });
        }),

        actions: {
            mutDatabase: function mutDatabase(databases) {
                var alreadyAddedDatabaseIDs = this.get('team.accessible_databases').map(function (db) {
                    return db.id;
                });
                var databaseIds = databases && databases.map(function (db) {
                    return db.id;
                });
                var newDatabases = databaseIds && databaseIds.filter(function (dbid) {
                    return !alreadyAddedDatabaseIDs.contains(dbid);
                });
                var toBeRemovedDatabases = alreadyAddedDatabaseIDs && alreadyAddedDatabaseIDs.filter(function (dbid) {
                    return !databaseIds.contains(dbid);
                });
                if (newDatabases[0]) {
                    this.get('team').addDatabase({
                        database_id: +newDatabases[0]
                    });
                }
                if (toBeRemovedDatabases[0]) {
                    this.get('team').removeDatabase({
                        database_id: +toBeRemovedDatabases[0]
                    });
                }
                this.set('team.accessible_databases', databases);
            },
            mutUser: function mutUser(users) {
                var alreadyAddedUserIDs = this.get('team.users').map(function (user) {
                    return user.id;
                });
                var userIds = users && users.map(function (user) {
                    return user.id;
                });
                var newUsers = userIds && userIds.filter(function (userid) {
                    return !alreadyAddedUserIDs.contains(userid);
                });
                var toBeRemovedUsers = alreadyAddedUserIDs && alreadyAddedUserIDs.filter(function (userid) {
                    return !userIds.contains(userid);
                });
                if (newUsers[0]) {
                    this.get('team').addUser({
                        user_id: +newUsers[0]
                    });
                }
                if (toBeRemovedUsers[0]) {
                    this.get('team').removeUser({
                        user_id: +toBeRemovedUsers[0]
                    });
                }
                this.set('team.users', users);
            },
            saveDatabase: function saveDatabase() {
                var _this3 = this;

                this.get('team').save().then(function (response) {
                    _this3.transitionToRoute('settings.teams.index');
                });
            }
        }
    });
});
define('frontend/pods/settings/teams/edit/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            return this.store.find('team', params.team_id);
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Edit Team');
        }

    });
});
define("frontend/pods/settings/teams/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "57QmpRSr", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"first-name\",[25,\"if\",[[20,[\"team\",\"errors\",\"name\"]],\"form-control is-invalid\",\"form-control\"],null],\"What do you call it?\",[20,[\"team\",\"name\"]]]]],false],[0,\"\\n                \"],[4,\"if\",[[20,[\"team\",\"errors\",\"name\"]]],null,{\"statements\":[[6,\"div\"],[9,\"class\",\"invalid-feedback\"],[7],[1,[20,[\"team\",\"errors\",\"name\",\"0\",\"message\"]],false],[0,\" \"],[8]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"two words about this team?\",[20,[\"team\",\"description\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Users\"],[8],[0,\"\\n                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"users\"]],true,\"email\",\"email\",[20,[\"selectedUsers\"]],false,\"Add Users\",[25,\"action\",[[19,0,[]],\"mutUser\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Accessible Databases\"],[8],[0,\"\\n                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"databases\"]],true,\"name\",\"name\",[20,[\"selectedDatabases\"]],false,\"Select Databases that should be accessible to this team\",[25,\"action\",[[19,0,[]],\"mutDatabase\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/teams/edit/template.hbs" } });
});
define('frontend/pods/settings/teams/index/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        teams: _ember['default'].computed.sort('model', function (a, b) {
            if (a.get('name').toLowerCase() <= b.get('name').toLowerCase()) {
                return -1;
            } else {
                return 1;
            }
        }),

        actions: {
            showDeleteDialogue: function showDeleteDialogue(teamToBeDeleted) {
                this.set('teamToBeDeleted', teamToBeDeleted);
                this.set('toggleDeleteDialogue', true);
            },
            deleteTeam: function deleteTeam(team) {
                team.destroyRecord().then(function (team) {});
            }
        }
    });
});
define('frontend/pods/settings/teams/index/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model() {
            return this.store.findAll('team');
        },

        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Teams');
            this.controllerFor('settings').set('showAddTeam', true);
        },

        actions: {
            willTransition: function willTransition() {
                this.controllerFor('settings').set('showAddTeam', false);
            }
        }
    });
});
define("frontend/pods/settings/teams/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "caNwqJgN", "block": "{\"symbols\":[\"team\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"teams\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card mb-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card-body p-3\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center\"],[7],[0,\"\\n                            \"],[6,\"span\"],[9,\"class\",\"avatar mr-2 text-white bg-primary\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-users\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                                \"],[6,\"h6\"],[9,\"class\",\"m-0 text-default\"],[7],[0,\" \"],[1,[25,\"capitalize\",[[19,1,[\"name\"]]],null],false],[0,\" \"],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" \"],[1,[19,1,[\"description\"]],false],[0,\" \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-4\"],[7],[0,\"\\n                        \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" \"],[1,[19,1,[\"users\",\"length\"]],false],[0,\" Users\"],[8],[0,\"\\n                        \"],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[6,\"small\"],[9,\"class\",\"text-muted\"],[7],[0,\" \"],[1,[19,1,[\"accessible_databases\",\"length\"]],false],[0,\" Accessible Databases \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-4 text-right\"],[7],[0,\"\\n                        \"],[4,\"link-to\",[\"settings.teams.edit\",[19,1,[\"id\"]]],[[\"class\"],[\"btn btn-link text-primary\"]],{\"statements\":[[0,\" EDIT \"]],\"parameters\":[]},null],[0,\"\\n                        \"],[6,\"button\"],[9,\"data-tooltip\",\"Delete Team\"],[9,\"data-inverted\",\"\"],[9,\"class\",\"btn btn-link text-red\"],[3,\"action\",[[19,0,[]],\"showDeleteDialogue\",[19,1,[]]]],[7],[0,\" DELETE \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card-body text-center\"],[7],[0,\" You do not have any team yet. \"],[6,\"div\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"settings.teams.new\"],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"btn btn-link p-0\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" ADD NEW TEAM \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8],[0,\" \"],[1,[25,\"delete-dialogue\",null,[[\"entityName\",\"open\",\"entity\",\"delete\"],[\"team\",[20,[\"toggleDeleteDialogue\"]],[20,[\"teamToBeDeleted\"]],\"deleteTeam\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/teams/index/template.hbs" } });
});
define('frontend/pods/settings/teams/new/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        team: _ember['default'].computed(function () {
            return this.store.createRecord('team', {});
        }),

        actions: {
            saveTeam: function saveTeam() {
                var _this = this;

                this.get('team').save().then(function (response) {
                    _this.transitionToRoute('settings.teams.edit', response.id);
                });
            }
        }
    });
});
define('frontend/pods/settings/teams/new/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'New Team');
        },
        actions: {
            willTransition: function willTransition(transition) {
                var team = this.controller.get('team');
                if (!team.id) {
                    team.destroyRecord();
                }
            }
        }

    });
});
define("frontend/pods/settings/teams/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oXpN6YN7", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"first-name\",[25,\"if\",[[20,[\"team\",\"errors\",\"name\"]],\"form-control is-invalid\",\"form-control\"],null],\"What do you call it?\",[20,[\"team\",\"name\"]]]]],false],[0,\"\\n                \"],[4,\"if\",[[20,[\"team\",\"errors\",\"name\"]]],null,{\"statements\":[[6,\"div\"],[9,\"class\",\"invalid-feedback\"],[7],[1,[20,[\"team\",\"errors\",\"name\",\"0\",\"message\"]],false],[0,\" \"],[8]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"name\",\"placeholder\",\"value\"],[\"form-control\",\"text\",\"first-name\",\"two words about this team\",[20,[\"team\",\"description\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-footer text-right\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[9,\"type\",\"submit\"],[3,\"action\",[[19,0,[]],\"saveTeam\"]],[7],[0,\"SAVE\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/teams/new/template.hbs" } });
});
define("frontend/pods/settings/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "GJIY6maG", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"header collapse d-lg-flex p-0\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"nav nav-tabs border-0 flex-column flex-lg-row py-3 px-0\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row justify-content-between w-100\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"col text-default\"],[7],[0,\" \"],[1,[18,\"pageTitle\"],false],[0,\" \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showAddDatabase\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"col text-right\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"settings.databases.new\"],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"btn btn-link p-0\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" ADD NEW DATABASE \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"showAddTeam\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"col text-right\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"settings.teams.new\"],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"btn btn-link p-0\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"fe fe-plus\"],[7],[8],[0,\" ADD NEW TEAM \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"pt-3 px-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"card\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"card-body p-0\"],[7],[0,\"\\n                    \"],[4,\"link-to\",[\"settings.databases.index\"],[[\"class\"],[\"nav-item p-3 border-bottom text-default\"]],{\"statements\":[[0,\" Databases \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"link-to\",[\"settings.users\"],[[\"class\"],[\"nav-item p-3 border-bottom text-default\"]],{\"statements\":[[0,\"                    Users \"]],\"parameters\":[]},null],[0,\"\\n                    \"],[4,\"link-to\",[\"settings.teams\"],[[\"class\"],[\"nav-item p-3 text-default border-bottom\"]],{\"statements\":[[0,\" Teams \"]],\"parameters\":[]},null],[0,\"\\n                    \"],[4,\"link-to\",[\"settings.permissions\"],[[\"class\"],[\"nav-item p-3 text-default\"]],{\"statements\":[[0,\" User Permissions \"]],\"parameters\":[]},null],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-9\"],[7],[0,\" \"],[1,[18,\"outlet\"],false],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/template.hbs" } });
});
define('frontend/pods/settings/users/edit/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        user: _ember['default'].computed.alias('model'),
        permissionSets: _ember['default'].computed(function () {
            return this.store.findAll('permission-set');
        }),
        teams: _ember['default'].computed(function () {
            return this.store.findAll('team');
        }),
        selectedTeams: _ember['default'].computed('user.teams', function () {
            var _this = this;

            return this.get('user.teams') && this.get('user.teams').map(function (item) {
                return _this.get('store').peekRecord('team', item.get('id'));
            });
        }),

        actions: {

            showChangePermissionDialogue: function showChangePermissionDialogue(user) {
                this.set('toBeChangedUser', user);
                this.set('togglePermissionsModal', true);
            },
            saveUser: function saveUser(user) {
                user.save().then(function (user) {});
            },
            mutTeams: function mutTeams(teams) {
                var alreadyAddedTeamIDs = this.get('user.teams').map(function (team) {
                    return team.id;
                });
                var teamIds = teams && teams.map(function (team) {
                    return team.id;
                });
                var newTeams = teamIds && teamIds.filter(function (teamid) {
                    return !alreadyAddedTeamIDs.contains(teamid);
                });
                var toBeRemovedTeams = alreadyAddedTeamIDs && alreadyAddedTeamIDs.filter(function (teamid) {
                    return !teamIds.contains(teamid);
                });
                if (newTeams[0]) {
                    this.store.peekRecord('team', newTeams[0]).addUser({
                        user_id: +this.get('user.id')
                    });
                }
                if (toBeRemovedTeams[0]) {
                    this.store.peekRecord('team', toBeRemovedTeams[0]).removeUser({
                        user_id: +this.get('user.id')
                    });
                }
                this.set('user.teams', teams);
            }
        }
    });
});
define('frontend/pods/settings/users/edit/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            return this.store.find('user', params.user_id);
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Edit User');
        }

    });
});
define("frontend/pods/settings/users/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "XbPi7pJB", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"card\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"card-body\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center mt-auto\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"avatar avatar-lg mr-3\"],[10,\"style\",[26,[\"background-image: url(\",[20,[\"user\",\"profile_pic\"]],\")\"]]],[7],[8],[0,\"\\n                \"],[6,\"div\"],[7],[0,\"\\n                    \"],[6,\"h3\"],[9,\"class\",\"text-default mb-0\"],[7],[1,[25,\"or\",[[20,[\"user\",\"full_name\"]],[20,[\"user\",\"email\"]]],null],false],[8],[0,\"\\n                    \"],[6,\"small\"],[9,\"class\",\"d-block text-muted\"],[7],[4,\"if\",[[20,[\"user\",\"full_name\"]]],null,{\"statements\":[[0,\" \"],[1,[20,[\"user\",\"email\"]],false]],\"parameters\":[]},null],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ml-auto text-muted\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"tag bg-primary text-white\"],[7],[0,\"\\n                        \"],[1,[20,[\"user\",\"role\",\"name\"]],false],[0,\"\\n                        \"],[6,\"span\"],[9,\"class\",\"tag-addon text-white\"],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"fe fe-edit-2\"],[3,\"action\",[[19,0,[]],\"showChangePermissionDialogue\",[20,[\"user\"]]]],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"form-group mt-5\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"class\",\"form-label\"],[7],[0,\"Teams\"],[8],[0,\"\\n                \"],[1,[25,\"searchable-select\",null,[[\"content\",\"multiple\",\"sortBy\",\"optionLabelKey\",\"selected\",\"closeOnSelection\",\"prompt\",\"on-change\"],[[20,[\"teams\"]],true,\"name\",\"name\",[20,[\"selectedTeams\"]],false,\"Select teams\",[25,\"action\",[[19,0,[]],\"mutTeams\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[1,[25,\"change-user-permissions-dialogue\",null,[[\"open\",\"user\",\"permissionSets\",\"saveUserPermissions\"],[[20,[\"togglePermissionsModal\"]],[20,[\"toBeChangedUser\"]],[20,[\"permissionSets\"]],\"saveUser\"]]],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/users/edit/template.hbs" } });
});
define('frontend/pods/settings/users/index/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        users: _ember['default'].computed.sort('model', function (a, b) {
            if (a.get('full_name') && a.get('full_name').toLowerCase() <= a.get('full_name') && b.get('full_name').toLowerCase()) {
                return -1;
            } else {
                return 1;
            }
        }),

        actions: {
            activateUser: function activateUser(user) {
                var _this = this;

                user.activate({}).then(function (response) {
                    _this.store.pushPayload('user', response);
                });
            },
            deactivateUser: function deactivateUser(user) {
                var _this2 = this;

                user.deactivate({}).then(function (response) {

                    _this2.store.pushPayload('user', response);
                });
            }

        }
    });
});
define('frontend/pods/settings/users/index/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            return this.store.findAll('user');
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings').set('pageTitle', 'Users');

            this.controllerFor('settings').set('showAddDatabase', false);
        }
    });
});
define("frontend/pods/settings/users/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NOIucwfW", "block": "{\"symbols\":[\"user\"],\"statements\":[[6,\"div\"],[9,\"class\",\"pl-3 pt-0\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"users\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"card mb-3\"],[7],[0,\"\\n            \"],[6,\"div\"],[10,\"class\",[26,[\"card-body p-3 \",[25,\"if\",[[19,1,[\"is_deactivated\"]],\"bg-gray-lightest\"],null]]]],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-6\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center mt-auto\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"avatar avatar-md mr-3\"],[10,\"style\",[26,[\"background-image: url(\",[19,1,[\"profile_pic\"]],\")\"]]],[7],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                                \"],[6,\"h6\"],[9,\"class\",\"text-default mb-0\"],[7],[1,[25,\"or\",[[19,1,[\"full_name\"]],[19,1,[\"email\"]]],null],false],[8],[0,\"\\n                                \"],[6,\"small\"],[9,\"class\",\"d-block text-muted\"],[7],[4,\"if\",[[19,1,[\"full_name\"]]],null,{\"statements\":[[0,\" \"],[1,[19,1,[\"email\"]],false]],\"parameters\":[]},null],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"col-6 text-right \"],[7],[0,\"\\n                        \"],[4,\"link-to\",[\"settings.users.edit\",[19,1,[\"id\"]]],[[\"class\"],[\"btn btn-link text-primary\"]],{\"statements\":[[0,\" EDIT \"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[19,1,[\"is_deactivated\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"button\"],[9,\"data-tooltip\",\"Activate User\"],[9,\"data-inverted\",\" \"],[9,\"class\",\"btn btn-link text-red\\n                                \"],[3,\"action\",[[19,0,[]],\"activateUser\",[19,1,[]]]],[7],[0,\" ACTIVATE \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"button\"],[9,\"data-tooltip\",\"Deactivate User\"],[9,\"data-inverted\",\" \"],[9,\"class\",\"btn btn-link text-red\\n                                \"],[3,\"action\",[[19,0,[]],\"deactivateUser\",[19,1,[]]]],[7],[0,\" DEACTIVATE \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/settings/users/index/template.hbs" } });
});
define("frontend/pods/tags/show/controller", ["exports", "ember", "frontend/pods/questions/all/controller"], function (exports, _ember, _frontendPodsQuestionsAllController) {
    exports["default"] = _frontendPodsQuestionsAllController["default"].extend({
        questions: _ember["default"].computed.alias("model.questions"),
        showAllTags: false,
        tag: _ember["default"].computed(function () {
            return this.store.find('tag', this.get('tag_id'));
        }),
        pageTitle: _ember["default"].computed('tag', 'tag.isLoaded', function () {
            return "All Questions with Tag: " + this.get('tag.name');
        }),
        search: function search() {
            var query = this.get('query');
            var questions = this.get('questions');
            if (query && query != "") {
                questions = this.store.query('question', { q: query, tag: this.get('tag_id') });
            }
            this.set('searchedQuestions', questions);
        }

    });
});
define('frontend/pods/tags/show/route', ['exports', 'ember', 'frontend/mixins/authentication-mixin'], function (exports, _ember, _frontendMixinsAuthenticationMixin) {
    exports['default'] = _ember['default'].Route.extend(_frontendMixinsAuthenticationMixin['default'], {
        model: function model(params) {
            this.set('tag_id', params.tag_id);
            return this.store.find('tag', params.tag_id);
        },

        templateName: "questions.all",

        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            controller.set('tag_id', this.get('tag_id'));
        }
    });
});
define("frontend/pods/tags/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "y88QkWrY", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "frontend/pods/tags/show/template.hbs" } });
});
define('frontend/resolver', ['exports', 'ember-cli-react/resolver'], function (exports, _emberCliReactResolver) {
  exports['default'] = _emberCliReactResolver['default'];
});
define('frontend/router', ['exports', 'ember', 'frontend/config/environment'], function (exports, _ember, _frontendConfigEnvironment) {

    var Router = _ember['default'].Router.extend({
        location: _frontendConfigEnvironment['default'].locationType,
        rootURL: _frontendConfigEnvironment['default'].rootURL
    });

    Router.map(function () {
        this.route('questions', function () {
            this.route('new');
            this.route('show', {
                path: '/:question_id'
            }, function () {
                this.route('snapshots', function () {
                    this.route('show', {
                        path: '/:snapshot_id'
                    });
                    this.route('all', {
                        path: '/'
                    });
                });
            });
            this.route('all', {
                path: '/'
            });
        });

        this.route('dashboards', function () {
            this.route('index', {
                path: '/'
            });
            this.route('show', {
                path: '/:dashboard_id'
            });
        });

        this.route('alerts', function () {
            this.route('index', {
                path: '/'
            });
            this.route('new');
            this.route('edit', {
                path: '/:alert_id/edit'
            });
        });
        this.route('alert_events', function () {
            this.route('index', {
                path: '/'
            });
            this.route('show', {
                path: '/:alert_event_id'
            });
        });
        this.route('login');

        this.route('api', function () {
            this.route('google', function () {
                this.route('callback');
            });
        });
        this.route('settings', function () {
            this.route('databases', function () {
                this.route('index', {
                    path: '/'
                });
                this.route('edit', {
                    path: '/:database_id/edit'
                });
                this.route('new');
            });

            this.route('email');
            this.route('sms');
            this.route('teams', function () {
                this.route('index', {
                    path: '/'
                });
                this.route('edit', {
                    path: '/:team_id/edit'
                });
                this.route('new');
            });
            this.route('users', function () {
                this.route('index', {
                    path: '/'
                });
                this.route('edit', {
                    path: '/:user_id/edit'
                });
                this.route('invite');
            });
            this.route('permissions');
        });

        this.route('tags', function () {
            this.route('show', {
                path: '/:tag_id'
            });
        });
        this.route('loading');

        this.route('data_references', function () {
            this.route('databases', function () {
                this.route('show', {
                    path: '/:database_id'
                }, function () {
                    this.route('tables', function () {
                        this.route('show', {
                            path: '/:table_id'
                        }, function () {
                            this.route('explore', {
                                path: '/explore'
                            });
                        });
                        this.route('all', {
                            path: '/'
                        });
                    });
                });
                this.route('all', {
                    path: '/'
                });
            });
        });

        this.route('explore', function () {
            this.route('new', {
                path: '/columns/:column_id/:column_value'
            });
        });
    });

    exports['default'] = Router;
});
define('frontend/services/ajax', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        store: _ember['default'].inject.service(),
        sessionService: _ember['default'].inject.service(),

        apiNamespace: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').namespace;
        }),

        apiHost: _ember['default'].computed('store', function () {
            return this.get('store').adapterFor('application').host;
        }),

        apiPath: _ember['default'].computed(function () {
            return this.get('apiHost') + this.get('apiNamespace');
        }),

        apiCall: function apiCall(options, successCb, failureCb) {
            var _this = this;

            options && options.data && (options.data = JSON.stringify(options.data));
            options.beforeSend = function (request) {
                request.setRequestHeader('Content-type', 'application/json');
                request.setRequestHeader('Authorization', _this.get('sessionService.token'));
            };
            _ember['default'].$.ajax(options).then(function (response, status) {
                if (successCb) {
                    successCb(response, status);
                }
            })['catch'](function (error, status) {
                if (failureCb) {
                    failureCb(error.responseJSON, status);
                }
            });
        }

    });
});
define('frontend/services/can', ['exports', 'ember-can'], function (exports, _emberCan) {
  exports['default'] = _emberCan.CanService;
});
define('frontend/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _emberCookiesServicesCookies) {
  exports['default'] = _emberCookiesServicesCookies['default'];
});
define('frontend/services/media', ['exports', 'ember-responsive/media'], function (exports, _emberResponsiveMedia) {
  exports['default'] = _emberResponsiveMedia['default'];
});
define('frontend/services/moment', ['exports', 'ember', 'frontend/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _frontendConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_frontendConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('frontend/services/resize-detector', ['exports', 'ember-element-resize-detector/services/resize-detector'], function (exports, _emberElementResizeDetectorServicesResizeDetector) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberElementResizeDetectorServicesResizeDetector['default'];
    }
  });
});
define('frontend/services/scrollbar-thickness', ['exports', 'ember-scrollable/services/scrollbar-thickness'], function (exports, _emberScrollableServicesScrollbarThickness) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberScrollableServicesScrollbarThickness['default'];
    }
  });
});
define('frontend/services/session-service', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        cookies: _ember['default'].inject.service(),
        ajax: _ember['default'].inject.service(),
        authenticated: false,
        token: null,
        setAttemptedTransition: function setAttemptedTransition(transition) {
            if (transition && transition.intent) {
                localStorage.setItem('ag_attempted_transition', transition.intent.url);
            }
        },
        getAttemptedTransition: function getAttemptedTransition() {
            return localStorage.getItem('ag_attempted_transition');
        },
        setToken: function setToken(token) {
            localStorage.setItem('ag_access_token', token);
            this.set('token', token);
        },
        setUser: function setUser(user) {
            this.set('user', user);
        },
        verifyToken: function verifyToken(successCb, errorCb) {
            var _this = this;

            var accessToken = localStorage.getItem('ag_access_token');
            this.set('token', accessToken);
            return this.get('ajax').apiCall({
                url: this.get('ajax.apiPath') + '/verify-token/',
                type: 'POST',
                data: {
                    token: accessToken
                }
            }, function (response, status) {
                _this.set('user', response.user);
                _this.set('permissions', response.permissions);
                _this.set('authenticated', true);
                successCb(response, status);
            }, function (error, status) {
                errorCb(error, status);
            });
        },
        invalidate: function invalidate() {
            localStorage.setItem('ag_access_token', null);
            this.set('token', null);
            this.set('authenticated', false);
        }
    });
});
define('frontend/services/toast', ['exports', 'ember-toastr/services/toast'], function (exports, _emberToastrServicesToast) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberToastrServicesToast['default'];
    }
  });
});
define('frontend/templates/components/ember-popper-targeting-parent', ['exports', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperTemplatesComponentsEmberPopperTargetingParent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPopperTemplatesComponentsEmberPopperTargetingParent['default'];
    }
  });
});
define('frontend/templates/components/ember-popper', ['exports', 'ember-popper/templates/components/ember-popper'], function (exports, _emberPopperTemplatesComponentsEmberPopper) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPopperTemplatesComponentsEmberPopper['default'];
    }
  });
});
define("frontend/templates/components/multiselect-checkboxes", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4zaeXvEo", "block": "{\"symbols\":[\"checkbox\",\"index\",\"&default\"],\"statements\":[[4,\"each\",[[20,[\"checkboxes\"]]],null,{\"statements\":[[4,\"if\",[[22,3]],null,{\"statements\":[[0,\"    \"],[11,3,[[19,1,[\"option\"]],[19,1,[\"isSelected\"]],[19,2,[]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"li\"],[7],[0,\"\\n      \"],[6,\"label\"],[7],[0,\"\\n        \"],[1,[25,\"input\",null,[[\"type\",\"checked\",\"disabled\"],[\"checkbox\",[19,1,[\"isSelected\"]],[20,[\"disabled\"]]]]],false],[0,\"\\n        \"],[1,[19,1,[\"label\"]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[1,2]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/multiselect-checkboxes.hbs" } });
});
define("frontend/templates/components/ui-accordion", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZnO9uwEd", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-accordion.hbs" } });
});
define("frontend/templates/components/ui-checkbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "j7UE7QEg", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"input\"],[10,\"type\",[18,\"type\"],null],[10,\"name\",[18,\"name\"],null],[10,\"tabindex\",[18,\"tabindex\"],null],[10,\"checked\",[25,\"unbound\",[[20,[\"checked\"]]],null],null],[10,\"disabled\",[25,\"unbound\",[[20,[\"disabled\"]]],null],null],[7],[8],[0,\"\\n\"],[6,\"label\"],[7],[1,[18,\"label\"],false],[8],[0,\"\\n\"],[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-checkbox.hbs" } });
});
define("frontend/templates/components/ui-dimmer", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "A5T+7ikQ", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-dimmer.hbs" } });
});
define("frontend/templates/components/ui-dropdown", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YNQb2jYG", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null],[25,\"action\",[[19,0,[]],\"mapping\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-dropdown.hbs" } });
});
define("frontend/templates/components/ui-embed", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "a08glVYo", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-embed.hbs" } });
});
define("frontend/templates/components/ui-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "JJqNVQRi", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-modal.hbs" } });
});
define("frontend/templates/components/ui-nag", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZclQGSfN", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-nag.hbs" } });
});
define("frontend/templates/components/ui-popup", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "AUfbLS34", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-popup.hbs" } });
});
define("frontend/templates/components/ui-progress", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NacBOgNf", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-progress.hbs" } });
});
define("frontend/templates/components/ui-radio", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Di15iHqa", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"input\"],[10,\"type\",[18,\"type\"],null],[10,\"name\",[18,\"name\"],null],[10,\"tabindex\",[18,\"tabindex\"],null],[10,\"checked\",[25,\"unbound\",[[20,[\"checked\"]]],null],null],[10,\"disabled\",[25,\"unbound\",[[20,[\"disabled\"]]],null],null],[7],[8],[0,\"\\n\"],[6,\"label\"],[7],[1,[18,\"label\"],false],[8],[0,\"\\n\"],[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-radio.hbs" } });
});
define("frontend/templates/components/ui-rating", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "w01EuuBx", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-rating.hbs" } });
});
define("frontend/templates/components/ui-search", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6Pf2y3eX", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-search.hbs" } });
});
define("frontend/templates/components/ui-shape", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MCd5YJw7", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-shape.hbs" } });
});
define("frontend/templates/components/ui-sidebar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+NQGTpdj", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-sidebar.hbs" } });
});
define("frontend/templates/components/ui-sticky", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "W8lmxwSB", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/ui-sticky.hbs" } });
});
define('frontend/transforms/array', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Transform.extend({
        deserialize: function deserialize(value) {
            if (Ember.isArray(value)) {
                return Em.A(value);
            } else {
                return Em.A();
            }
        },
        serialize: function serialize(value) {
            if (Ember.isArray(value)) {
                return Em.A(value);
            } else {
                return Em.A();
            }
        }
    });
});
define('frontend/transforms/key-value-array', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Transform.extend({
        deserialize: function deserialize(value) {
            if (!$.isPlainObject(value)) {
                return [];
            } else {
                return Object.keys(value).map(function (key) {
                    return Ember.Object.create({
                        key: key,
                        value: value[key]
                    });
                });
            }
        },
        serialize: function serialize(array) {
            var obj = {};
            array.forEach(function (item) {
                obj[item.key] = item.value;
            });
            return obj;
        }

    });
});
define('frontend/transforms/object', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Transform.extend({
        deserialize: function deserialize(value) {
            if (!$.isPlainObject(value)) {
                return {};
            } else {
                return Ember.Object.create(value);
            }
        },
        serialize: function serialize(value) {
            return value;
        }

    });
});
define('frontend/transforms/query-object', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
    exports['default'] = _emberData['default'].Transform.extend({
        deserialize: function deserialize(value) {
            if (null) {
                return {};
            } else {
                var obj = _ember['default'].Object.create({
                    fromQuestion: value.fromQuestion,
                    database: _ember['default'].Object.create(value.database),
                    table: _ember['default'].Object.create(value.table),
                    views: value.views && value.views.map(function (item) {
                        return _ember['default'].Object.create(item);
                    }),
                    filters: value.filters && value.filters.map(function (item) {
                        return _ember['default'].Object.create(item);
                    }),
                    groupBys: value.groupBys && value.groupBys.map(function (item) {
                        return _ember['default'].Object.create(item);
                    }),
                    limit: value.limit,
                    offset: value.offset,
                    orderBys: value.orderBys && value.orderBys.map(function (item) {
                        return _ember['default'].Object.create(item);
                    }),
                    queryType: value.queryType,
                    rawQuery: value.rawQuery,
                    additionalFilters: _ember['default'].Object.create(value.additionalFilters),
                    additionalFilterColumns: value.additionalFilterColumns && value.additionalFilterColumns.map(function (item) {
                        return _ember['default'].Object.create(item);
                    })
                });
                return obj;
            }
        },
        serialize: function serialize(value) {
            return value;
        }
    });
});
define("frontend/transforms/utc", ["exports", "ember-data"], function (exports, _emberData) {
    exports["default"] = _emberData["default"].Transform.extend({
        serialize: function serialize(value) {
            return value ? value.toJSON() : null;
        },

        deserialize: function deserialize(value) {
            return moment.utc(value);
        }
    });
});
define('frontend/util-tests/collection-action', ['exports', 'ember-api-actions/util-tests/collection-action'], function (exports, _emberApiActionsUtilTestsCollectionAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberApiActionsUtilTestsCollectionAction['default'];
    }
  });
});
define('frontend/util-tests/member-action', ['exports', 'ember-api-actions/util-tests/member-action'], function (exports, _emberApiActionsUtilTestsMemberAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberApiActionsUtilTestsMemberAction['default'];
    }
  });
});
define('frontend/utils/get-promise-content', ['exports', 'ember-promise-tools/utils/get-promise-content'], function (exports, _emberPromiseToolsUtilsGetPromiseContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsGetPromiseContent['default'];
    }
  });
});
define('frontend/utils/is-fulfilled', ['exports', 'ember-promise-tools/utils/is-fulfilled'], function (exports, _emberPromiseToolsUtilsIsFulfilled) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsIsFulfilled['default'];
    }
  });
});
define('frontend/utils/is-promise', ['exports', 'ember-promise-tools/utils/is-promise'], function (exports, _emberPromiseToolsUtilsIsPromise) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsIsPromise['default'];
    }
  });
});
define('frontend/utils/smart-resolve', ['exports', 'ember-promise-tools/utils/smart-resolve'], function (exports, _emberPromiseToolsUtilsSmartResolve) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsSmartResolve['default'];
    }
  });
});
define('frontend/utils/titleize', ['exports', 'ember-composable-helpers/utils/titleize'], function (exports, _emberComposableHelpersUtilsTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersUtilsTitleize['default'];
    }
  });
});


define('frontend/config/environment', [], function() {
  var prefix = 'frontend';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("frontend/app")["default"].create({"name":"frontend","version":"0.0.0+6b83a5a9"});
}
