module.exports = function () {
  // Sidebar links

  var $categories = getAll('#categories .bd-category');

  if ($categories.length > 0) {
    $categories.forEach(function (el) {
      var toggle_el = el.querySelector('.bd-category-toggle');

      toggle_el.addEventListener('click', function (event) {
        // closeCategories(el);
        el.classList.toggle('is-active');
      });
    });
  }

  function closeCategories(current_el) {
    $categories.forEach(function (el) {
      if (current_el == el) {
        return;
      }
      el.classList.remove('is-active');
    });
  }

  var anchors_ref_el = document.getElementById('anchorsReference');
  var anchors_el = document.getElementById('anchors');
  var anchor_links_el = getAll('.bd-anchor-link');

  var anchors_by_id = {};
  var anchors_order = [];
  var anchor_nav_els = [];

  if (anchors_el && anchor_links_el.length > 0) {
    anchors_el.classList.add('is-active');
    var anchors_el_list = anchors_el.querySelector('.bd-anchors-list');

    anchor_links_el.forEach(function (el, index) {
      var link_target = el.getAttribute('href');
      var link_text = el.previousElementSibling.innerText;

      if (link_text != '') {
        var item_el = createAnchorLink(link_text, link_target);
        anchors_el_list.appendChild(item_el);

        var anchor_key = link_target.substring(1); // #target -> target
        anchors_by_id[anchor_key] = {
          id: anchor_key,
          index: index,
          target: link_target,
          text: link_text,
          nav_el: item_el
        };
        anchors_order.push(anchor_key);
        anchor_nav_els.push(item_el);
      }
    });

    var back_to_top_el = createAnchorLink('Back to top', '');
    back_to_top_el.onclick = scrollToTop;
    anchors_el_list.appendChild(back_to_top_el);
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function createAnchorLink(text, target) {
    var item_el = document.createElement('li');
    var link_el = document.createElement('a');
    var text_node = document.createTextNode(text);

    if (target) {
      link_el.setAttribute('href', target);
    }

    link_el.appendChild(text_node);
    item_el.appendChild(link_el);

    return item_el;
  }

  function closeCategories(current_el) {
    $categories.forEach(function (el) {
      if (current_el == el) {
        return;
      }
      el.classList.remove('is-active');
    });
  }

  // Dropdowns

  var $dropdowns = getAll('.dropdown:not(.is-hoverable)');

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function ($el) {
      $el.addEventListener('click', function (event) {
        event.stopPropagation();
        $el.classList.toggle('is-active');
      });
    });

    document.addEventListener('click', function (event) {
      closeDropdowns();
    });
  }

  function closeDropdowns() {
    $dropdowns.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  // Toggles

  var $burgers = getAll('.burger');

  if ($burgers.length > 0) {
    $burgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  // Modals

  var rootEl = document.documentElement;
  var $modals = getAll('.modal');
  var $modalButtons = getAll('.modal-button');
  var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

  if ($modalButtons.length > 0) {
    $modalButtons.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        openModal(target);
      });
    });
  }

  if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
      $el.addEventListener('click', function () {
        closeModals();
      });
    });
  }

  function openModal(target) {
    var $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
  }

  function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
      closeDropdowns();
    }
  });

  // Functions

  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }

  // Utils

  function removeFromArray(array, value) {
    if (array.includes(value)) {
      var value_index = array.indexOf(value);
      array.splice(value_index, 1);
    }

    return array;
  }

  Array.prototype.diff = function (a) {
    return this.filter(function (i) {
      return a.indexOf(i) < 0;
    });
  };
};
