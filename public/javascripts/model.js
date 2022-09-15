"use strict";

class Model {
  constructor() {
    this.contacts = [];
    this.fetchContacts();
  }

  fetchContacts() {
    fetch('/api/contacts')
      .then(result => result.json())
      .then(contacts => {
        this.contacts = contacts;
        this.onContactListChanged(this.contacts);
      });
  }

  addContact(contact) {
    fetch('/api/contacts', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(contact),
    }).then(() => this.fetchContacts())
      .catch(error => alert('Error: ' + error));
  }

  editContact(id, updatedContact) {
    fetch('/api/contacts/' + id, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    }).then(() => this.fetchContacts())
      .catch(error => alert('Error: ' + error));
  }

  deleteContact(id) {
    fetch('/api/contacts/' + id, {
      method: 'DELETE',
    }).then(() => this.fetchContacts())
      .catch(error => alert('Error: ' + error));
  }

  findContact(id) {
    return this.contacts.find(contact => contact.id === Number(id));
  }

  filterContactsByName(query) {
    const filteredContacts = this.contacts.filter(contact => {
      const name = contact.full_name.toLowerCase();
      return name.includes(query.toLowerCase());
    });

    this.onContactListChanged(filteredContacts);
  }

  filterContactsByTag(tag) {
    const filteredContacts = this.contacts.filter(contact => {
      if (!contact.tags) return false;
      const tags = contact.tags.split(',');
      return tags.includes(tag);
    });

    this.onContactListChanged(filteredContacts);
  }

  getAllTags() {
    const uniqueTags = [];
    this.contacts.filter(contact => contact.tags)
      .map(contact => contact.tags.split(','))
      .forEach(tags => {
        tags.forEach(tag => {
          if (!uniqueTags.includes(tag)) uniqueTags.push(tag);
        });
      });
    return uniqueTags;
  }

  bindContactListChanged(callback) {
    this.onContactListChanged = callback;
  }
}

export default Model;