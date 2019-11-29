/**
 * Admin_anw.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    auth_Id: {
      type: "integer"
    },
    anw_id: {
      type: "integer"
    },
    status: {
      type: "string"
    },
    date: {
      type: "string"
    }, 
    content: {
      type: "string"
    }
  }, connection: 'someMysqlServer'

};

