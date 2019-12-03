import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['easymotion'],
  pressedKeys: [],
  assignmentList: [],
  assignmentMap: {},
  didInsertElement() {
    this._super(...arguments);
    $(document).on('keyup', (e) => {
      if (['TEXTAREA', 'INPUT'].indexOf(e.target.tagName) < 0) {
        if (!this.get('enabled')){
          if (e.key == 's') {
            this.activateEasyMotion();
          }
        }else {
          this.cleanup(e.key);
        }
        if (e.key == 'Escape') {
          this.disableEasymotion();
        }

      }
      return;
    });
  },
  cleanup(key) {
    var allKeysPressed = this.get('pressedKeys').join('') + key;
    var newAssignmentList = this.get('assignmentList').filter((el) => {
      return el.match(`^${allKeysPressed}`);
    });
    this.set('assignmentList', newAssignmentList);
    if (newAssignmentList.length == 0) {
      return this.disableEasymotion();
    } else {
      var newAssignmentMap = Ember.Object.create();
      this.$().html('');
      newAssignmentList.forEach((el) => {
        var assignmentMap = this.get('assignmentMap');
        this.createEasymotionElements(assignmentMap.get(el),el.split(''));
        newAssignmentMap.set(el, assignmentMap.get(el));
      });
      this.set('assignmentMap', newAssignmentMap);
    }
    var exactMatch = this.get('assignmentMap').get(allKeysPressed);
    if (exactMatch) {
      $(exactMatch).click();
      $(exactMatch).focus();
      return this.disableEasymotion();
    }
    this.get('pressedKeys').pushObject(key);

  },
  disableEasymotion() {
    this.set('pressedKeys', []);
    this.set('assignmentList', []);
    this.set('assignemntMap', Ember.Object.create());
    this.set('enabled', false);
    this.$().html('');
  },
  createEasymotionElements(el, letters) {
    var top = $(el).offset().top;
    var left = $(el).offset().left;
    var element = `<span id="js-easymotion-${letters.join('')}" class="easymotion-el" style="position: absolute; top: ${top}px ; left: ${left}px ;">${letters.join('')}</span>`;
    this.$().append(element);
  },
  generateAssignmentList(length) {
    var letters = ['h', 'k', 'l', 'y', 'u', 'i', 'o', 'p', 'n', 'm', ',', 'q', 'w', 'e', 'r', 't', 'z', 'x', 'c', 'v', 'b', 'a', 's', 'd', 'g', 'j', 'f', ';'];
    var assignmentList = [];
    var prefixes = letters.slice(parseInt(length / letters.length), letters.length);
    var charIndex = 0;
    var singleLetters = letters.slice(0, letters.length - prefixes.length);
    var prefixIndex = -1;
    while (assignmentList.length <= length) {
      if (prefixIndex >= 0) {
        assignmentList.push([prefixes[prefixIndex], letters[charIndex]]);
      } else {
        if (charIndex >= singleLetters.length - 1) {
          charIndex = 0;
          prefixIndex++;
          continue;
        }
        assignmentList.push([singleLetters[charIndex]]);
      }
      if (charIndex == letters.length - 1) {
        prefixIndex++;
        charIndex = 0;
        continue;
      }
      charIndex++;
    }
    return assignmentList;
  },
  activateEasyMotion() {
    this.set('enabled', true);
    var elements = $('input,.ace_scroller,textarea,select,button,a,[data-ember-action]');
    var assignmentList = this.generateAssignmentList(elements.length);
    this.set('assignmentMap', Ember.Object.create());

    for (let i = 0; i < elements.length; i++) {
      this.get('assignmentList').pushObject(assignmentList[i].join(''));
      this.get('assignmentMap').set(assignmentList[i].join(''), elements[i]);
      this.createEasymotionElements(elements[i], assignmentList[i]);
    }
  }
});
