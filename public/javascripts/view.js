"use strict";

import debounce from "./debounce.js";

class View {
  constructor() {
    this.contactsList = document.querySelector('#contacts_list');
    this.contactsView = document.querySelector('#contacts_view');
    this.editContactView = document.querySelector('#edit_contact_view');
    this.addContactView = document.querySelector('#add_contact_view');
    this.addForm = document.querySelector('#add_form');
    this.editForm = document.querySelector('#edit_form');
    this.submitAdd = document.querySelector('#submit_add');
    this.submitEdit = document.querySelector('#submit_edit');
    this.search = document.querySelector('#search');
    this.tagCheckboxes = document.querySelectorAll('.tag_checkboxes');
    this.modalBackground = document.querySelector('#modal_background');
    this.compileHandlebarsTemplates();
    Handlebars.registerHelper('eachTag', this.eachTag);
    this.bindLocalHandlers();
  }

  compileHandlebarsTemplates() {
    this.contactTemplate = Handlebars.compile(document.querySelector('#contact_template').innerHTML);
    this.tagsTemplate = Handlebars.compile(document.querySelector('#tags_template').innerHTML);
    this.tagTemplate = Handlebars.compile(document.querySelector('#tag_template').innerHTML);
  }

  bindLocalHandlers() {
    this.bindCancelContactForm();
    this.bindViewAddForm();
    this.bindViewEditForm();
    this.bindHeader();
    this.bindModalBackground();
    this.bindNewTag();
    this.bindCancelNewTag();
  }

  bindCancelContactForm() {
    document.querySelectorAll('.cancel').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        this.resetForms();
        this.resetViews();
      });
    });
  }

  bindCancelNewTag() {
    document.querySelector('#cancel_new_tag').addEventListener('click', event => {
      event.preventDefault();
      this.resetModal();
    });
  }

  bindViewAddForm() {
    document.querySelector('#add_view_button')
      .addEventListener('click', event => {
        event.preventDefault();
        this.resetViews();
        this.showAddView();
      });
  }

  bindViewEditForm() {
    this.contactsList.addEventListener('click', event => {
      if (event.target.classList.contains('edit')) {
        event.preventDefault();
        this.resetViews();
        this.populateEditFields(event.target.parentNode.dataset.id);
        this.showEditView();
      }
    });
  }

  bindAddTag() {
    document.querySelectorAll('.add_new_tag').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        this.addNewTag();
      });
    });
  }

  bindHeader() {
    document.querySelector('#main_header').addEventListener('click', event => {
      event.preventDefault();
      this.resetForms();
      this.resetViews();
    });
  }

  bindModalBackground() {
    this.modalBackground.addEventListener('click', event => {
      if (event.target.id !== 'modal_wrapper') return;
      event.preventDefault();
      this.resetModal();
    });
  }

  bindNewTag() {
    document.querySelector('#submit_new_tag').addEventListener('click', event => {
      event.preventDefault();
      const newTag = document.querySelector('#new_tag_input').value;
      const allTags = [...document.querySelectorAll('.tag_wrapper')]
        .map(wrapper => wrapper.textContent.trim());
      if (!newTag) {
        this.reportInvalidTagName('Field cannot be empty.');
      } else if (allTags.includes(newTag)) {
        this.reportInvalidTagName('Tag name already exists.');
      } else {
        this.updateTagViews(newTag);
      }
    });
  }

  bindAddContact(handler) {
    this.submitAdd.addEventListener('click', event => {
      event.preventDefault();
      if (!this.addForm.reportValidity()) return;
      handler(this.formContactData(this.addForm));
      this.resetForms();
    });
  }

  bindDeleteContact(handler) {
    this.contactsList.addEventListener('click', event => {
      if (!event.target.classList.contains('delete')) return;
      event.preventDefault();
      if (confirm('Are you sure you want to delete this contact?')) {
        this.resetViews();
        this.resetForms();
        handler(event.target.parentNode.dataset.id);
      }
    });
  }

  bindEditContact(handler) {
    this.submitEdit.addEventListener('click', event => {
      event.preventDefault();
      const id = Number(this.editForm.elements.id.value);
      const updatedContact = this.formContactData(this.editForm);
      updatedContact.id = id;
      handler(id, updatedContact);
      this.resetForms();
    });
  }

  bindClickTag(handler) {
    this.contactsList.addEventListener('click', event => {
      event.preventDefault();
      if (!event.target.classList.contains('tag')) return;
      handler(event.target.textContent.slice(1));
    });
  }

  bindSearchInput(handler) {
    const outerHandler = (event) => {
      handler(event.target.value);
    };
    this.search.addEventListener('input', debounce(outerHandler, 150));
  }

  bindFindContact(handler) {
    this.findContact = handler;
  }

  bindResetViews(handler) {
    this.resetViews = handler;
  }

  bindGetAllTags(handler) {
    this.getAllTags = handler;
  }

  /* eslint-disable camelcase */
  formContactData(form) {
    return {
      full_name: form.elements.full_name.value,
      phone_number: form.elements.phone_number.value,
      email: form.elements.email.value,
      tags: this.getTags(form) || null,
    };
  }
  /* eslint-enable camelcase */

  getTags(addForm) {
    const checkboxes = addForm.querySelectorAll("[type='checkbox']");
    const checked = [...checkboxes].filter(box => box.checked);
    return checked.map(box => box.name).join(',');
  }

  showElement(element) {
    element.classList.remove('hide');
    element.classList.add('show');
  }

  hideElement(element) {
    element.classList.add('hide');
    element.classList.remove('show');
  }

  showContactsView() {
    this.hideElement(this.addContactView);
    this.hideElement(this.editContactView);
    this.showElement(this.contactsView);
  }

  showAddView() {
    this.hideElement(this.contactsView);
    this.hideElement(this.editContactView);
    this.showElement(this.addContactView);
    document.querySelector('#add_full_name').focus();
  }

  showEditView() {
    this.hideElement(this.contactsView);
    this.hideElement(this.addContactView);
    this.showElement(this.editContactView);
    document.querySelector('#edit_full_name').focus();
  }

  renderViews(contacts) {
    this.contactsList.innerHTML = this.contactTemplate({contacts});
    const tags = this.getAllTags();
    this.tagCheckboxes.forEach(tagCheckbox => {
      tagCheckbox.innerHTML = this.tagsTemplate({tags});
    });
    this.bindAddTag();
  }

  populateEditFields(id) {
    const contact = this.findContact(id);
    this.editForm.elements.id.value = id;
    this.editForm.elements.full_name.value = contact.full_name;
    this.editForm.elements.phone_number.value = contact.phone_number;
    this.editForm.elements.email.value = contact.email;
    this.populateCheckedTags(contact);
  }

  populateCheckedTags(contact) {
    const tags = contact.tags && contact.tags.split(',');
    if (tags) {
      [...this.editForm.querySelectorAll('[type="checkbox"]')].forEach(checkbox => {
        if (tags.includes(checkbox.name)) checkbox.checked = true;
      });
    }
  }

  updateTagViews(newTag) {
    const html = this.tagTemplate(newTag);
    this.tagCheckboxes.forEach(element => {
      element.insertAdjacentHTML('beforeend', html);
    });
    this.resetModal();
  }

  reportInvalidTagName(message) {
    document.querySelector('#tag_name_error').textContent = message;
  }

  resetForms() {
    this.addForm.reset();
    this.editForm.reset();
    this.search.value = '';
  }

  resetModal() {
    this.modalBackground.classList.add('hide');
    document.querySelector('#new_tag_input').value = '';
    document.querySelector('#tag_name_error').textContent = '';
  }

  addNewTag() {
    this.modalBackground.classList.remove('hide');
    document.querySelector('#new_tag_input').focus();
  }

  eachTag(tags, options) {
    let result = '';
    tags.split(',').forEach(tag => {
      result += options.fn(tag);
    });

    return result;
  }
}

export default View;