/**
 * finishes the currently running game
 */
function beginGame() {
  var begin_data = {
      action: 'begin_game'
    };
  sendAdminRequest(begin_data);
  window.location.href = location.href;
}

/**
 * kicks off a new game
 */
function endGame() {
  var end_data = {
      action: 'end_game'
    };
  sendAdminRequest(end_data);
  window.location.href = location.href;
}

/**
 * submits an ajax request to the admin endpoint
 *
 * @param  request_data (request object)
 *   - the parameters for the request.
 *
 * @return Boolean
 *   - whether or not the request was succesful
 */
function sendAdminRequest(request_data) {
  var csrf_token = $('input[name=csrf_token]')[0].value;
  request_data.csrf_token = csrf_token;
  $.post(
    'index.php?p=admin&ajax=true',
    request_data
  ).fail(function() {
    // TODO: Make this a modal
    console.log('ERROR');
  }).done(function(data) {
    console.log(data);
    var responseData = JSON.parse(data);
    if (responseData.result == 'OK') {
      console.log('OK');
      return true;
    } else {
      // TODO: Make this a modal
      console.log('Failed');
      return false;
    }
  });
}

var $body = $('body');

/**
 * --admin
 */
 FB_CTF.admin = (function(){

  /**
   * check the admin forms for errors
   *
   * @param $clicked (jquery object)
   *   - the clicked element. From this, we'll find the form
   *      elements we're looking to validate
   *
   * @return Boolean
   *   - whether or not the form is valud
   */
  function validateAdminForm($clicked) {
    var valid         = true,
        $validateForm = $clicked.closest('.validate-form')
        $required     = $('.form-el--required', $validateForm),
        errorClass    = 'form-error';

    if( $validateForm.length === 0 ){
      $validateForm = $clicked.closest('.fb-admin-main');
    }

    $('.error-msg', $validateForm).remove();

    $required.removeClass(errorClass).each(function(){
    var $self       = $(this),
        $requiredEl = $('input[type="text"], input[type="password"]', $self ),
        $logoName   = $('.logo-name', $self);

        //
        // all the conditions that would make this element
        //  trigger an error
        //
        if(
          ( $requiredEl.val() === '' ) ||
          ( $logoName.length > 0 && $logoName.text() === '' )
        ) {
          $self.addClass( errorClass );
          valid = false;

          if($('.error-msg', $validateForm).length === 0){
            $('.admin-box-header h3', $validateForm).after('<span class="error-msg">Please fix the errors in red</span>');
          }

          return;
        }
      });

    return valid;
  }

  /**
   * add a new section
   *
   * @param $clicked (jquery object)
   *   - the clicked button
   */
  function addNewSection( $clicked ){
    var $sectionContainer = $clicked.closest('.admin-buttons').siblings('.admin-sections'),
        $lastSection      = $('.admin-box', $sectionContainer).last(),
        $firstSection      = $('.admin-box', $sectionContainer).first(),
        $newSection       = $firstSection.clone(),

        // +1 for the 0-based index, +1 for the new section
        //  being added
        sectionIndex      = $lastSection.index();

        //
        // update some stuff in the cloned section
        //
    var $title        = $('.admin-box-header h3', $newSection),
        titleText     = $title.text().toLowerCase(),
        switchName    = $('input[type="radio"]', $newSection).first().attr('name');

    if (switchName) {
      newSwitchName = switchName.substr( 0, switchName.lastIndexOf("--")) + "--" + sectionIndex;

      $('#' + switchName + '--on', $newSection).attr('id', newSwitchName + "--on");
      $('label[for="' + switchName + '--on"]', $newSection).attr('for', newSwitchName + "--on");
      $('#' + switchName + '--off', $newSection).attr('id', newSwitchName + "--off");
      $('label[for="' + switchName + '--off"]', $newSection).attr('for', newSwitchName + "--off");
      $('input[type="radio"]', $newSection).attr('name', newSwitchName);
    }

    $newSection.removeClass('section-locked');
    $newSection.removeClass('completely-hidden');

    $('.emblem-carousel li.active', $newSection).removeClass('active');
    $('.form-error', $newSection).removeClass('form-error');
    $('.post-avatar, .logo-name', $newSection).removeClass('has-avatar').empty();
    $('.error-msg', $newSection).remove();
    $('input[type="text"], input[type="password"]', $newSection).prop("disabled", false);

    $('.dk-select', $newSection).remove();
    $('select', $newSection).dropkick();
    var select1 = $('[name=entity_id]', $newSection)[0];
    var select2 = $('[name=category_id]', $newSection)[0];
    if (select1 !== undefined && select2 !== undefined) {
      Dropkick(select1).disable(false);
      Dropkick(select2).disable(false);
    }

    if (titleText.indexOf('team') > -1) {
      $title.text('Team ' + sectionIndex);
    } else if( titleText.indexOf('quiz level') > -1){
      $title.text('Quiz Level ' + sectionIndex);
    } else if( titleText.indexOf('base level') > -1){
      $title.text('Base Level ' + sectionIndex);
    } else if( titleText.indexOf('flag level') > -1){
      $title.text('Flag Level ' + sectionIndex);
    } else if( titleText.indexOf('player') > -1){
      $title.text('Player ' + sectionIndex);
    }

    $('input[type="text"], input[type="password"]', $newSection).val('');

    $sectionContainer.append($newSection);

    FB_CTF.slider.init();
  }

  /**
   * add a new attachment
   *
   * @param $clicked (jquery object)
   *   - the clicked button
   */
  function addNewAttachment( $clicked ){
    var $attachments      = $('.attachments', $clicked),
        $newAttachment    = $('.new-attachment-hidden', $clicked),
        $addedAttachment  = $newAttachment.clone();

    $addedAttachment.removeClass('completely-hidden');
    $addedAttachment.removeClass('new-attachment-hidden');

    $("input[type=file]", $addedAttachment).change(function (e){
      var fileName = e.target.files[0].name;
      $("input[name=filename]", $addedAttachment)[0].value = fileName;
    });

    $attachments.append($addedAttachment);
  }

  /**
   * add a new link
   *
   * @param $clicked (jquery object)
   *   - the clicked button
   */
  function addNewLink( $clicked ){
    var $links      = $('.links', $clicked),
        $newLink    = $('.new-link-hidden', $clicked),
        $addedLink  = $newLink.clone();

    $addedLink.removeClass('completely-hidden');
    $addedLink.removeClass('new-link-hidden');

    $links.append($addedLink);
  }

  // Create new attachment
  function createAttachment(section) {
    var level_id = $('.attachment_form input[name=level_id]', section)[0].value;
    var filename = $('.attachment_form input[name=filename]', section)[0].value;
    var attachment_file = $('.attachment_form input[name=attachment_file]', section)[0].files[0];
    var csrf_token = $('input[name=csrf_token]')[0].value;

    if (level_id && filename && attachment_file) {
      var formData = new FormData();
      formData.append('attachment_file', attachment_file);
      formData.append('action', 'create_attachment');
      formData.append('level_id', level_id);
      formData.append('filename', filename);
      formData.append('csrf_token', csrf_token);

      $.ajax({
        url: 'index.php?p=admin&ajax=true',
        type: 'POST',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false
      }).done(function(data) {
        var responseData = JSON.parse(data);
        if (responseData.result == 'OK') {
          console.log('OK');
          $('.attachment_form label', section).html('Created!');
          $('.attachment_form input[type=file]', section)[0].remove();
          $('.admin-buttons', section.closest('.new-attachment')).remove();
        } else {
          // TODO: Make this a modal
          console.log('Failed');
        }
      });
    }
  }

  // Create new link
  function createLink(section) {
    var level_id = $('.link_form input[name=level_id]', section)[0].value;
    var link = $('.link_form input[name=link]', section)[0].value;
    var csrf_token = $('input[name=csrf_token]')[0].value;
    var create_data = {
      action: 'create_link',
      link: link,
      level_id: level_id,
      csrf_token: csrf_token
    };

    if ((level_id) && (link)) {
      $.post(
        'index.php?p=admin&ajax=true',
        create_data
      ).fail(function() {
        // TODO: Make this a modal
        console.log('ERROR');
      }).done(function(data) {
        //console.log(data);
        var responseData = JSON.parse(data);
        if (responseData.result == 'OK') {
          console.log('OK');
          $('.link_form label', section).html('Created!');
          $('.admin-buttons', section.closest('.new-link')).remove();
        } else {
          // TODO: Make this a modal
          console.log('Failed');
          return false;
        }
      });
    }
  }

  // Delete link
  function deleteLink(section) {
    var link_id = $('.link_form input[name=link_id]', section)[0].value;
    var delete_data = {
      action: 'delete_link',
      link_id: link_id
    };

    if ((link_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Delete attachment
  function deleteAttachment(section) {
    var attachment_id = $('.attachment_form input[name=attachment_id]', section)[0].value;
    var delete_data = {
      action: 'delete_attachment',
      attachment_id: attachment_id
    };

    if ((attachment_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Generic deletion
  function deleteElement(section) {
    var elementSection = $('form', section)[0].classList[0];
    if (elementSection === 'session_form') {
      deleteSession(section);
    } else if (elementSection === 'team_form') {
      deleteTeam(section);
    } else if (elementSection === 'level_form') {
      deleteLevel(section);
    } else if (elementSection === 'categories_form') {
      deleteCategory(section);
    } else if (elementSection === 'announcements_form') {
      deleteAnnouncement(section);
    }
  }

  // Generic update
  function updateElement(section) {
    var elementSection = $('form', section)[0].classList[0];
    if (elementSection === 'team_form') {
      updateTeam(section);
    } else if (elementSection === 'level_form') {
      updateLevel(section);
    }
  }

  // Generic create
  function createElement(section) {
    var elementSection = $('form', section)[0].classList[0];
    if (elementSection === 'team_form') {
      createTeam(section);
    } else if (elementSection === 'level_form') {
      createLevel(section);
    } else if (elementSection === 'categories_form') {
      createCategory(section);
    }
    window.location.href = location.href;
  }

  // Create announcement
  function createAnnouncement(section) {
    var announcement = $('input[name=new_announcement]', section)[0].value;
    var create_data = {
      action: 'create_announcement',
      announcement: announcement
    };
    if ((announcement)) {
      sendAdminRequest(create_data);
    }
    window.location.href = location.href;
  }

  // Create and download database backup
  function databaseBackup() {
    var backup_data = {
      action: 'backup_db'
    };
    sendAdminRequest(backup_data);
  }

  // Create tokens
  function createTokens(section) {
    var create_data = {
      action: 'create_tokens'
    };
    sendAdminRequest(create_data);
    window.location.href = location.href;
  }

  // Delete announcement
  function deleteAnnouncement(section) {
    var announcement_id = $('.announcements_form input[name=announcement_id]', section)[0].value;
    var delete_data = {
      action: 'delete_announcement',
      announcement_id: announcement_id
    };
    if ((announcement_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Delete level
  function deleteLevel(section) {
    var level_id = $('.level_form input[name=level_id]', section)[0].value;
    var delete_data = {
      action: 'delete_level',
      level_id: level_id
    };
    if ((level_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Create category
  function createCategory(section) {
    var category = $('.categories_form input[name=category]', section)[0].value;
    var create_data = {
      action: 'create_category',
      category: category
    };
    if ((category)) {
      sendAdminRequest(create_data);
    }
  }

  // Delete category
  function deleteCategory(section) {
    var category_id = $('.categories_form input[name=category_id]', section)[0].value;
    var delete_data = {
      action: 'delete_category',
      category_id: category_id
    };
    if ((category_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Create generic level
  function createLevel(section) {
    var level_type = $('.level_form input[name=level_type]', section)[0].value;
    switch (level_type) {
      case 'quiz':
        createQuizLevel(section);
        break;
      case 'flag':
        createFlagLevel(section);
        break;
      case 'base':
        createBaseLevel(section);
        break;
    }
  }

  // Create quiz level
  function createQuizLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var question = $('.level_form textarea[name=question]', section)[0].value;
    var answer = $('.level_form input[name=answer]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var create_data = {
      action: 'create_quiz',
      title: title,
      question: question,
      answer: answer,
      entity_id: entity_id,
      points: points,
      hint: hint,
      penalty: penalty
    };
    if ((title) && (question) && (answer) && (entity_id) && (points)) {
      sendAdminRequest(create_data);
    }
  }

  // Create flag level
  function createFlagLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var description = $('.level_form textarea[name=description]', section)[0].value;
    var flag = $('.level_form input[name=flag]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var category_id = $('.level_form select[name=category_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var create_data = {
      action: 'create_flag',
      title: title,
      description: description,
      flag: flag,
      entity_id: entity_id,
      category_id: category_id,
      points: points,
      hint: hint,
      penalty: penalty
    };
    if ((title) && (description) && (flag) && (entity_id) && (points)) {
      sendAdminRequest(create_data);
    }
  }

  // Create base level
  function createBaseLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var description = $('.level_form textarea[name=description]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var category_id = $('.level_form select[name=category_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var bonus = $('.level_form input[name=bonus]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var create_data = {
      action: 'create_base',
      title: title,
      description: description,
      entity_id: entity_id,
      category_id: category_id,
      points: points,
      bonus: bonus,
      hint: hint,
      penalty: penalty
    };
    if ((title) && (description) && (entity_id) && (points) && (points)) {
      sendAdminRequest(create_data);
    }
  }

  // Update generic level
  function updateLevel(section) {
    var level_type = $('.level_form input[name=level_type]', section)[0].value;
    switch (level_type) {
      case 'quiz':
        updateQuizLevel(section);
        break;
      case 'flag':
        updateFlagLevel(section);
        break;
      case 'base':
        updateBaseLevel(section);
        break;
    }
  }

  // Update quiz level
  function updateQuizLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var question = $('.level_form textarea[name=question]', section)[0].value;
    var answer = $('.level_form input[name=answer]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var bonus = $('.level_form input[name=bonus]', section)[0].value;
    var bonus_dec = $('.level_form input[name=bonus_dec]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var level_id = $('.level_form input[name=level_id]', section)[0].value;
    var update_data = {
      action: 'update_quiz',
      title: title,
      question: question,
      answer: answer,
      entity_id: entity_id,
      points: points,
      bonus: bonus,
      bonus_dec: bonus_dec,
      hint: hint,
      penalty: penalty,
      level_id: level_id
    };
    if ((title) && (question) && (answer) && (entity_id) && (points)) {
      sendAdminRequest(update_data);
    }
  }

  // Update flag level
  function updateFlagLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var description = $('.level_form textarea[name=description]', section)[0].value;
    var flag = $('.level_form input[name=flag]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var category_id = $('.level_form select[name=category_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var bonus = $('.level_form input[name=bonus]', section)[0].value;
    var bonus_dec = $('.level_form input[name=bonus_dec]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var level_id = $('.level_form input[name=level_id]', section)[0].value;
    var update_data = {
      action: 'update_flag',
      title: title,
      description: description,
      flag: flag,
      entity_id: entity_id,
      category_id: category_id,
      points: points,
      bonus: bonus,
      bonus_dec: bonus_dec,
      hint: hint,
      penalty: penalty,
      level_id: level_id
    };
    if ((title) && (description) && (flag) && (entity_id) && (points)) {
      sendAdminRequest(update_data);
    }
  }

  // Update base level
  function updateBaseLevel(section) {
    var title = $('.level_form input[name=title]', section)[0].value;
    var description = $('.level_form textarea[name=description]', section)[0].value;
    var entity_id = $('.level_form select[name=entity_id] option:selected', section)[0].value;
    var category_id = $('.level_form select[name=category_id] option:selected', section)[0].value;
    var points = $('.level_form input[name=points]', section)[0].value;
    var bonus = $('.level_form input[name=bonus]', section)[0].value;
    var hint = $('.level_form input[name=hint]', section)[0].value;
    var penalty = $('.level_form input[name=penalty]', section)[0].value;
    var level_id = $('.level_form input[name=level_id]', section)[0].value;
    var update_data = {
      action: 'update_base',
      title: title,
      description: description,
      entity_id: entity_id,
      category_id: category_id,
      points: points,
      bonus: bonus,
      hint: hint,
      penalty: penalty,
      level_id: level_id
    };
    if ((title) && (description) && (entity_id) && (points)) {
      sendAdminRequest(update_data);
    }
  }

  // Delete team
  function deleteTeam(section) {
    var team_id = $('.team_form input[name=team_id]', section)[0].value;
    var delete_data = {
      action: 'delete_team',
      team_id: team_id
    };
    if ((team_id)) {
      sendAdminRequest(delete_data);
    }
  }

  // Create team
  function createTeam(section) {
    var team_name = $('.team_form input[name=team_name]', section)[0].value;
    var team_password = $('.team_form input[name=password]', section)[0].value;
    var team_logo = $('.logo-name', section)[0].textContent;
    var create_data = {
      action: 'create_team',
      name: team_name,
      password: team_password,
      logo: team_logo
    };
    if ((team_name) && (team_password) && (team_logo)) {
      sendAdminRequest(create_data);
    }
  }

  // Update team
  function updateTeam(section) {
    var team_id = $('.team_form input[name=team_id]', section)[0].value;
    var team_name = $('.team_form input[name=team_name]', section)[0].value;
    var team_points = $('.team_form input[name=points]', section)[0].value;
    var team_password = $('.team_form input[name=password]', section)[0].value;
    var team_logo = $('.logo-name', section)[0].textContent;
    var update_data = {
      action: 'update_team',
      team_id: team_id,
      name: team_name,
      points: team_points,
      password: team_password,
      logo: team_logo
    };
    if ((team_id) && (team_name) && (team_logo)) {
      sendAdminRequest(update_data);
    }
  }

  // Toggle team option
  function toggleTeam(radio_id) {
    var team_id = radio_id.split('--')[2].split('-')[1];
    var radio_action = radio_id.split('--')[2].split('-')[2];
    var action_value = (radio_id.split('--')[3] === 'on') ? 1 : 0;
    var toggle_data = {
      action: 'toggle_' + radio_action + '_team',
      team_id: team_id,
      [radio_action]: action_value
    };
    if ((team_id) && (radio_action)) {
      sendAdminRequest(toggle_data);
    }
  }

  // Toggle All
  function toggleAll(radio_id) {
    var action_type = radio_id.split('--')[2].split('_')[1];
    var action_value = (radio_id.split('--')[3] === 'on') ? 1 : 0;
    var toggle_data = {
      action: 'toggle_status_all',
      all_type: action_type,
      status: action_value
    };
    if ((action_type)) {
      sendAdminRequest(toggle_data);
      if (action_value) {
        $('input[type=radio][id*=on]').prop('checked', true);
        $('input[type=radio][id*=off]').prop('checked', false);
      } else {
        $('input[type=radio][id*=on]').prop('checked', false);
        $('input[type=radio][id*=off]').prop('checked', true);
      }
    }
  }

  // Toggle level option
  function toggleLevel(radio_id) {
    var level_id = radio_id.split('--')[2].split('-')[1];
    var radio_action = radio_id.split('--')[2].split('-')[2];
    var action_value = (radio_id.split('--')[3] === 'on') ? 1 : 0;
    var toggle_data = {
      action: 'toggle_' + radio_action + '_level',
      level_id: level_id,
      [radio_action]: action_value
    };
    if ((level_id) && (radio_action)) {
      sendAdminRequest(toggle_data);
    }
  }

  function toggleConfiguration(radio_id) {
    var radio_action = radio_id.split('--')[2];
    var action_value = (radio_id.split('--')[3] === 'on') ? 1 : 0;
    var toggle_data = {
      action: 'change_configuration',
      field: radio_action,
      value: action_value
    };
    if ((radio_action)) {
      sendAdminRequest(toggle_data);
    }
  }

  function changeConfiguration(field, value) {
    var conf_data = {
      action: 'change_configuration',
      field: field,
      value: value
    };
    sendAdminRequest(conf_data);
  }

  function toggleLogo(section) {
  // Toggle logo status
    var logo_id = $('.logo_form input[name=logo_id]', section)[0].value;
    var action_value = $('.logo_form input[name=status_action]', section)[0].value;
    var toggle_data = {
      action: action_value + '_logo',
      logo_id: logo_id
    };
    if ((logo_id) && (action_value)) {
      sendAdminRequest(toggle_data);
    }
    window.location.href = location.href;
  }

  function toggleCountry(section) {
  // Toggle country status
    var country_id = $('.country_form input[name=country_id]', section)[0].value;
    var action_value = $('.country_form input[name=status_action]', section)[0].value;
    var toggle_data = {
      action: action_value,
      country_id: country_id
    };
    if (country_id && action_value) {
      sendAdminRequest(toggle_data);
    }
    window.location.href = location.href;
  }

  // Delete session
  function deleteSession(section) {
    var session_cookie = $('.session_form input[name=cookie]', section)[0].value;
    var delete_data = {
      action: 'delete_session',
      cookie: session_cookie
    };
  
    if ((session_cookie)) {
      sendAdminRequest(delete_data);
    }
  }

  /* --------------------------------------------
   * --init
   * -------------------------------------------- */


  /**
   * init the admin stuff
   */
  function init() {
    //
    // actionable buttons
    //
    $('.fb-admin-main').off('click').on('click', '[data-action]', function(event) {
      event.preventDefault();
      var $self        = $(this),
          $section     = $self.closest('.admin-box'),
          action       = $self.data('action'),
          actionModal  = $self.data('actionModal'),
          lockClass    = 'section-locked',
          sectionTitle = $self.closest('#fb-main-content').find('.admin-page-header h3').text().replace(' ', '_');

      //
      // route the actions
      //
      if (action === 'save') {
        var valid = validateAdminForm($self);

        if (actionModal && valid === false){
          actionModal = 'error';
        } else {
          updateElement($section);
        }
        if (valid) {
          $section.addClass(lockClass);
          $('input[type="text"], input[type="password"], textarea', $section).prop("disabled", true);
        }
      } else if (action === 'save-no-validation'){
        $section.addClass(lockClass);
        updateElement($section);
        $('input[type="text"], input[type="password"], textarea', $section).prop("disabled", true);
        Dropkick($('[name=entity_id]', $section)[0]).disable();
        Dropkick($('[name=category_id]', $section)[0]).disable();
      } else if (action === 'add-new'){
        addNewSection($self);
      } else if (action === 'create') {
        createElement($section);
      } else if (action === 'create-announcement') {
        createAnnouncement($section);
      } else if (action === 'backup-db') {
        databaseBackup();
      } else if (action === 'create-tokens') {
        createTokens($section);
      } else if (action === 'edit'){
        $section.removeClass(lockClass);
        $('input[type="text"], input[type="password"], textarea', $section).prop("disabled", false);
        Dropkick($('[name=entity_id]', $section)[0]).disable(false);
        Dropkick($('[name=category_id]', $section)[0]).disable(false);
      } else if (action === 'delete') {
        $section.remove();
        deleteElement($section);
        // rename the section boxes
        /*$('.admin-box').each(function(i, el){
          var $titleObj  = $('.admin-box-header h3', el),
               title     = $titleObj.text(),
               newTitle  = title.substring( 0, title.lastIndexOf(" ") + 1 ) + (i + 1);

          $titleObj.text(newTitle);
        });*/
      } else if (action === 'disable-logo') {
        toggleLogo($section);
      } else if (action === 'enable-logo') {
        toggleLogo($section);
      } else if (action === 'disable-country') {
        toggleCountry($section);
      } else if (action === 'enable-country') {
        toggleCountry($section);
      } else if (action === 'add-attachment') {
        addNewAttachment($section);
      } else if (action === 'create-attachment') {
        var $containingDiv = $self.closest('.new-attachment');
        createAttachment($containingDiv);
      } else if (action === 'delete-new-attachment') {
        var $containingDiv = $self.closest('.new-attachment');
        $containingDiv.remove();
        deleteAttachment($containingDiv);
      } else if (action === 'delete-attachment') {
        var $containingDiv = $self.closest('.existing-attachment');
        $containingDiv.remove();
        deleteAttachment($containingDiv);
      } else if (action === 'add-link') {
        addNewLink($section);
      } else if (action === 'create-link') {
        var $containingDiv = $self.closest('.new-link');
        createLink($containingDiv);
      } else if (action === 'delete-new-link') {
        var $containingDiv = $self.closest('.new-link');
        $containingDiv.remove();
        deleteLink($containingDiv);
      } else if (action === 'delete-link') {
        var $containingDiv = $self.closest('.existing-link');
        $containingDiv.remove();
        deleteLink($containingDiv);
      }

      //
      // if there's a modal
      //
      if( actionModal ){
        FB_CTF.modal.loadPopup( 'action-' + actionModal , function(){
          $('#fb-modal .admin-section-name').text(sectionTitle);
        });
      }
    });

    //
    // radio buttons
    //
    $('input[type="radio"]').on('change', function(event) {
      var $this = $(this);
      var radio_name = $this.attr('id');

      if (radio_name.search('fb--teams') === 0) {
        if (radio_name.search('all') > 0) {
          toggleAll(radio_name);
        } else {
          toggleTeam(radio_name);
        }
      } else if (radio_name.search('fb--levels') === 0) {
        if (radio_name.search('all') > 0) {
          toggleAll(radio_name);
        } else {
          toggleLevel(radio_name);
        }
      } else if (radio_name.search('fb--conf') === 0) {
        toggleConfiguration(radio_name);
      }
    });

    //
    // configuration fields
    //
    $('select,input[type="number"][name^="fb--conf"]').on('change', function(event) {
      var $this = $(this);
      var field = $this.attr('name').split('--')[2];
      var value = '';
      if ($this.attr('type') === 'number') {
        value = $(this)[0].value;
      } else {
        value = $('option:selected', $this)[0].value;
      }
      if (!$(this).hasClass('not_configuration')) {
        changeConfiguration(field, value);
        if (field === 'registration_type') {
          location.reload();
        }
      }
    });

    //
    // modal actionable
    //
    $body.on('click', '.js-confirm-save', function(event) {
      var $status = $('.admin-section--status .highlighted');
      $status.text('Saved');

      setTimeout(function(){
        $status.fadeOut(function(){
          $status.text('').removeAttr('style');
        });
      }, 5000);
    });

    //
    // category filter select (flags, bases)
    //
    $('select[name="category_filter"]').on('change', function(event) {
      var $this = $(this);
      var filter = $('option:selected', $this)[0].value;
      if (filter === 'all') {
        $('section[id!=new-element]').each(function(){
          //console.log(this);
          $(this).removeClass("completely-hidden");
        });
      } else {
        $('section[id!=new-element]').each(function(){
          $(this).addClass("completely-hidden");
        });
        var targets = $('option:contains("' + filter + '"):selected[class!=filter_option]');
        targets.each(function(){
          var target = $(this).closest('section[id!=new-element]')[0];
          $(target).removeClass("completely-hidden");
          //console.log($(this).closest('section[id!=new-element]')[0]);
        });
      }
    });

    //
    // status filter select (quiz, flags, bases)
    //
    $('select[name="status_filter"]').on('change', function(event) {
      var $this = $(this);
      var filter = $('option:selected', $this)[0].value;
      if (filter === 'all') {
        $('section[id!=new-element]').each(function(){
          $(this).removeClass("completely-hidden");
        });
      } else {
        $('section[id!=new-element]').each(function(){
          $(this).addClass("completely-hidden");
        });
        var filter_string = 'off';
        if (filter === 'Enabled') {
          filter_string = 'on';
        }
        var targets = $('input[type="radio"][id*="status--'+ filter_string +'"]:checked[class!=filter_option]');
        targets.each(function(){
          var target = $(this).closest('section[id!=new-element]')[0];
          $(target).removeClass("completely-hidden");
        });
      }
    });

    //
    // use filter select (countries)
    //
    $('select[name="use_filter"]').on('change', function(event) {
      var $this = $(this);
      var filter = $('option:selected', $this)[0].value;
      if (filter === 'all') {
        $('section[id!=new-element]').each(function(){
          $(this).removeClass("completely-hidden");
        });
      } else {
        $('section[id!=new-element]').each(function(){
          $(this).addClass("completely-hidden");
        });
        var targets = $('.country-use');
        targets.each(function(){
          if ($(this).text() === filter) {
            var target = $(this).closest('section[id!=new-element]')[0];
            $(target).removeClass("completely-hidden");
          }
        });
      }
    });

    //
    // status filter select (countries)
    //
    $('select[name="country_status_filter"]').on('change', function(event) {
      var $this = $(this);
      var filter = $('option:selected', $this)[0].value;
      if (filter === 'all') {
        $('section[id!=new-element]').each(function(){
          $(this).removeClass("completely-hidden");
        });
      } else {
        $('section[id!=new-element]').each(function(){
          $(this).addClass("completely-hidden");
        });
        var targets = $('.country-'+filter);
        targets.each(function(){
          var target = $(this).closest('section[id!=new-element]')[0];
          $(target).removeClass("completely-hidden");
        });
      }
    });

    //
    // select a logo
    //
    $body.on('click', '.js-choose-logo', function(event) {
      event.preventDefault();

      var $self      = $(this),
          $container = $self.closest('.fb-column-container');;

      FB_CTF.modal.loadPopup('choose-logo', function(){
        var $modal = $('#fb-modal');

        FB_CTF.loadComponent('.emblem-carousel', 'inc/components/emblem-carousel.php', function(){
          FB_CTF.slider.init();
        });

        $('.js-store-logo', $modal).on('click', function(event) {
          event.preventDefault();
          var $active  = $('.slides li.active', $modal),
              logo     = $active.html(),
              logoName = $('use', $active).attr('xlink:href').replace('#icon--badge-', '');

          $('.post-avatar', $container).addClass('has-avatar').html(logo);
          $('.logo-name', $container).text(logoName);
        });
      });
    });

    //
    // prompt begin game
    //
    $('.js-begin-game').on('click', function(event) {
      event.preventDefault();
      FB_CTF.modal.loadPopup('action-begin-game');
    });

    //
    // prompt end game
    //
    $('.js-end-game').on('click', function(event) {
      event.preventDefault();
      FB_CTF.modal.loadPopup('action-end-game');
    });

    //
    // prompt logout
    //
    $('.js-prompt-logout').on('click', function(event) {
      event.preventDefault();
      FB_CTF.modal.loadPopup('action-logout');
    });

    //
    // show/hide answer
    //
    $('.toggle_answer_visibility').on('click', function(event) {
      event.preventDefault();
      if ($(this).prev('input').attr('type') === 'text') {
        $(this).text('Show Answer');
        $(this).prev('input').attr('type', 'password');
      } else if ($(this).prev('input').attr('type') === 'password') {
        $(this).text('Hide Answer');
        $(this).prev('input').attr('type', 'text');
      }
    });

  }

  return {
    init: init
  };
})(); // admin

// Capture enter key presses to avoid unexpected actions
$(document).on('keypress', 'input', function(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
});
