"use strict";

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindAddContact(this.handleAddContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindFindContact(this.handleFindContact);
    this.view.bindSearchInput(this.handleSearchInput);
    this.view.bindClickTag(this.handleClickTag);
    this.view.bindResetViews(this.handleResetViews);
    this.view.bindGetAllTags(this.handleGetAllTags);
    this.model.bindContactListChanged(this.onContactListChanged);
    this.onContactListChanged(this.model.contacts);
  }

  onContactListChanged = (contacts) => {
    this.view.renderViews(contacts);
    this.view.showContactsView();
  };

  handleAddContact = (contact) => {
    this.model.addContact(contact);
  };

  handleEditContact = (id, updatedContact) => {
    this.model.editContact(id, updatedContact);
  };

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
  };

  handleFindContact = (id) => {
    return this.model.findContact(id);
  };

  handleSearchInput = (query) => {
    this.model.filterContactsByName(query);
  };

  handleClickTag = (tag) => {
    this.model.filterContactsByTag(tag);
  };

  handleResetViews = () => {
    this.onContactListChanged(this.model.contacts);
  };

  handleGetAllTags = () => {
    return this.model.getAllTags();
  }
}

export default Controller;